import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { graphRAGTool } from '../tools/graphRAG';
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'processingAgent', level: 'info' });
logger.info('Initializing processingAgent');

/**
 * Processing agent for data transformation, batch operations, and workflow automation
 * Specializes in ETL processes, data pipelines, and automated task execution
 */
export const processingAgent = new Agent({
  name: "Processing Agent",
  instructions: `
    You are a specialized data processing and workflow automation assistant.

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

    Use available tools to analyze data relationships and processing patterns.
  `,
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
 * Runtime context for the Processing Agent
 * Stores data processing preferences, workflow configurations, and batch processing settings
 * 
 * @mastra ProcessingAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
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