import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { graphRAGTool } from '../tools/graphRAG';
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import { mcp } from '../tools/mcp';

import { z } from "zod";

const logger = new PinoLogger({ name: 'processingAgent', level: 'info' });
logger.info('Initializing processingAgent');

/**
 * Runtime context type for the Processing Agent
 * Stores data processing preferences, workflow configurations, and batch processing settings
 */
export type ProcessingAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Data processing type */
  "processing-type": "batch" | "stream" | "real-time" | "scheduled";
  /** Data source format */
  "data-format": "json" | "csv" | "xml" | "parquet" | "avro" | "binary";
  /** Processing pipeline stage */
  "pipeline-stage": "extract" | "transform" | "load" | "validate" | "analyze";
  /** Performance priority */
  "performance-mode": "speed" | "memory" | "accuracy" | "balanced";
  /** Error handling strategy */
  "error-handling": "strict" | "lenient" | "skip" | "retry";
};

/**
 * Comprehensive Zod schemas for Processing Agent validation
 * Prevents Google AI model ZodNull validation errors
 */
const processingAgentInputSchema = z.object({
  query: z.string().min(1).describe('Processing request or data transformation task'),
  data: z.any().optional().describe('Input data to process'),
  processingType: z.enum(["batch", "stream", "real-time", "scheduled"]).optional().describe('Type of processing to perform'),
  context: z.record(z.any()).optional().describe('Optional context information'),
  requestId: z.string().optional().describe('Optional request identifier'),
  metadata: z.record(z.any()).optional().describe('Optional metadata')
}).strict();

const processingAgentOutputSchema = z.object({
  result: z.string().describe('Processing result and summary'),
  processedData: z.any().optional().describe('Processed data output'),
  pipelineSteps: z.array(z.string()).optional().describe('Processing pipeline steps executed'),
  performance: z.object({
    duration: z.number().optional(),
    recordsProcessed: z.number().optional(),
    throughput: z.number().optional()
  }).optional().describe('Performance metrics'),
  toolsUsed: z.array(z.string()).optional().describe('Tools used during processing'),
  requestId: z.string().describe('Unique request identifier'),
  timestamp: z.string().datetime().describe('Processing completion timestamp')
}).strict();

/**
 * Enhanced Processing Agent configuration with Zod validation
 * Prevents ZodNull errors and ensures type safety
 */
const processingAgentConfigSchema = z.object({
  name: z.string().min(1).describe('Agent name identifier'),
  instructions: z.string().describe('Detailed instructions for the agent'),
  runtimeContext: z.object({
    'user-id': z.string().describe('User identifier'),
    'session-id': z.string().describe('Session identifier'),
    'processing-type': z.enum(["batch", "stream", "real-time", "scheduled"]).describe('Data processing type'),
    'data-format': z.enum(["json", "csv", "xml", "parquet", "avro", "binary"]).describe('Data source format'),
    'pipeline-stage': z.enum(["extract", "transform", "load", "validate", "analyze"]).describe('Processing pipeline stage'),
    'performance-mode': z.enum(["speed", "memory", "accuracy", "balanced"]).describe('Performance priority'),
    'error-handling': z.enum(["strict", "lenient", "skip", "retry"]).describe('Error handling strategy')
  }).describe('Runtime context for the agent'),
  model: z.any().describe('Model configuration for the agent'),
  tools: z.record(z.any()).describe('Available tools for the agent'),
  memory: z.any().describe('Agent memory configuration'),
  workflows: z.record(z.any()).describe('Available workflows for the agent')
}).strict();

/**
 * Processing agent for data transformation, batch operations, and workflow automation
 * Specializes in ETL processes, data pipelines, and automated task execution
 */
export const processingAgent = new Agent({
  name: "Processing Agent",
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const processingType = runtimeContext?.get("processing-type") || "batch";
    const dataFormat = runtimeContext?.get("data-format") || "json";
    const pipelineStage = runtimeContext?.get("pipeline-stage") || "transform";
    const performanceMode = runtimeContext?.get("performance-mode") || "balanced";
    const errorHandling = runtimeContext?.get("error-handling") || "strict";

    return `You are a specialized data processing and workflow automation assistant.
Your expertise lies in data transformation, batch processing, and workflow orchestration.
You have a strong understanding of ETL (Extract, Transform, Load) processes, data pipelines, and automated task execution.
You are proficient in designing and implementing efficient data processing pipelines, optimizing performance, and ensuring data quality.
You are familiar with various data formats, processing frameworks, and automation tools.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
- Processing Type: ${processingType}
- Data Format: ${dataFormat}
- Pipeline Stage: ${pipelineStage}
- Performance Mode: ${performanceMode}
- Error Handling: ${errorHandling}

Your primary functions include:
- Data transformation and ETL operations
- Batch processing and job scheduling
- Workflow automation and orchestration
- File processing and format conversion
- Data validation and quality assurance
- Pipeline optimization and performance tuning
- Error handling and retry mechanisms
- Monitoring and alerting for processing jobs

When responding:
- Design efficient and scalable processing workflows
- Consider data volume, velocity, and variety requirements
- Implement robust error handling and recovery mechanisms
- Suggest appropriate batch sizes and processing intervals
- Optimize for performance and resource utilization
- Ensure data integrity throughout processing pipelines
- Recommend monitoring and observability solutions
- Handle edge cases and data quality issues gracefully

Use available tools to analyze data relationships and processing patterns.`;
  },
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),  tools: {
    chunkerTool,
    rerankTool,
    graphRAGTool,
    vectorQueryTool,
    ...await mcp.getTools(),
  },

  memory: agentMemory
});

/**
 * Validate input data against processing agent schema
 * @param input - Raw input data to validate
 * @returns Validated input data
 * @throws ZodError if validation fails
 */
export function validateProcessingAgentInput(input: unknown): z.infer<typeof processingAgentInputSchema> {
  try {
    return processingAgentInputSchema.parse(input);
  } catch (error) {
    logger.error(`Processing agent input validation failed: ${error}`);
    throw error;
  }
}

/**
 * Validate output data against processing agent schema
 * @param output - Raw output data to validate
 * @returns Validated output data
 * @throws ZodError if validation fails
 */
export function validateProcessingAgentOutput(output: unknown): z.infer<typeof processingAgentOutputSchema> {
  try {
    return processingAgentOutputSchema.parse(output);
  } catch (error) {
    logger.error(`Processing agent output validation failed: ${error}`);
    throw error;
  }
}

// Export schemas for use in other parts of the application
export { processingAgentInputSchema, processingAgentOutputSchema, processingAgentConfigSchema };