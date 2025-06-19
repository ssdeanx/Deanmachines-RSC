import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';
import { chunkerTool } from "../tools/chunker-tool";


import { z } from "zod";

const logger = new PinoLogger({ name: 'analyzerAgent', level: 'info' });
logger.info('Initializing analyzerAgent');

/**
 * Runtime context type for the Analyzer Agent
 * Stores analysis preferences, data processing configurations, and insight generation settings
 */
export type AnalyzerAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Analysis type focus */
  "analysis-type": "statistical" | "trend" | "comparative" | "predictive" | "diagnostic" | "exploratory";
  /** Data depth preference */
  "data-depth": "surface" | "detailed" | "comprehensive" | "exhaustive";
  /** Visualization preference */
  "visualization": "charts" | "graphs" | "tables" | "dashboards" | "reports" | "interactive";
  /** Analysis speed vs accuracy */
  "speed-accuracy": "fast" | "balanced" | "thorough" | "comprehensive";
  /** Domain context for analysis */
  "domain-context": string;
};

/**
 * Comprehensive Zod schemas for Analyzer Agent validation
 * Prevents Google AI model ZodNull validation errors
 */
const analyzerAgentInputSchema = z.object({
  query: z.string().min(1).describe('Analysis query or data request for the analyzer agent'),
  data: z.any().optional().describe('Optional data to analyze'),
  context: z.record(z.any()).optional().describe('Optional context information'),
  requestId: z.string().optional().describe('Optional request identifier'),
  metadata: z.record(z.any()).optional().describe('Optional metadata')
}).strict();

const analyzerAgentOutputSchema = z.object({
  analysis: z.string().describe('Analysis results and insights'),
  visualizations: z.array(z.string()).optional().describe('Generated visualizations or charts'),
  recommendations: z.array(z.string()).optional().describe('Actionable recommendations based on analysis'),
  toolsUsed: z.array(z.string()).optional().describe('Tools used during analysis'),
  requestId: z.string().describe('Unique request identifier'),
  timestamp: z.string().datetime().describe('Analysis timestamp')
}).strict();

/**
 * Enhanced Analyzer Agent configuration with Zod validation
 * Prevents ZodNull errors and ensures type safety
 */
const analyzerAgentConfigSchema = z.object({
  name: z.string().min(1).describe('Agent name identifier'),
  instructions: z.string().describe('Detailed instructions for the agent'),
  runtimeContext: z.object({
    'user-id': z.string().describe('User identifier'),
    'session-id': z.string().describe('Session identifier'),
    'analysis-type': z.enum(["statistical", "trend", "comparative", "predictive", "diagnostic", "exploratory"]).describe('Analysis type focus'),
    'data-depth': z.enum(["surface", "detailed", "comprehensive", "exhaustive"]).describe('Data depth preference'),
    'visualization': z.enum(["charts", "graphs", "tables", "dashboards", "reports", "interactive"]).describe('Visualization preference'),
    'speed-accuracy': z.enum(["fast", "balanced", "thorough", "comprehensive"]).describe('Analysis speed vs accuracy'),
    'domain-context': z.string().describe('Domain context for analysis')
  }).describe('Runtime context for the agent'),
  model: z.any().describe('Model configuration for the agent'),
  tools: z.record(z.any()).describe('Available tools for the agent'),
  memory: z.any().describe('Agent memory configuration'),
  workflows: z.record(z.any()).describe('Available workflows for the agent')
}).strict();

/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const analyzerAgent = new Agent({
  name: "Analyzer Agent",
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const analysisType = runtimeContext?.get("analysis-type") || "exploratory";
    const dataDepth = runtimeContext?.get("data-depth") || "detailed";
    const visualization = runtimeContext?.get("visualization") || "charts";
    const speedAccuracy = runtimeContext?.get("speed-accuracy") || "balanced";
    const domainContext = runtimeContext?.get("domain-context") || "general";

    return `You are a specialized data analyst with expertise in statistical analysis, data processing, and insights generation. Your primary focus is on extracting meaningful insights from data, performing statistical tests, and generating visualizations to support decision-making.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
- Analysis Type: ${analysisType}
- Data Depth: ${dataDepth}
- Visualization: ${visualization}
- Speed vs Accuracy: ${speedAccuracy}
- Domain Context: ${domainContext}

Your primary functions include:
- Data manipulation and cleaning
- Statistical analysis and hypothesis testing
- Data visualization and reporting
- Generating actionable insights from data

When responding:
- Remember to validate data integrity and quality.
- Suggest appropriate statistical methods and models.
- Consider data privacy and security implications.
- Provide clear explanations of analytical results.
- Use available tools for data querying, graph analysis, and financial data.`;
  },
  model: createGemini25Provider('gemini-2.5-flash-lite-preview-06-17',  {
    responseModalities: ["TEXT"],
    thinkingConfig: {
      thinkingBudget: 0, // -1 means dynamic thinking budget
      includeThoughts: false, // Include thoughts for debugging and monitoring purposes
    },
  }), 
  tools: {
    vectorQueryTool,
    chunkerTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Validate input data against analyzer agent schema
 * @param input - Raw input data to validate
 * @returns Validated input data
 * @throws ZodError if validation fails
 */
export function validateAnalyzerAgentInput(input: unknown): z.infer<typeof analyzerAgentInputSchema> {
  try {
    return analyzerAgentInputSchema.parse(input);
  } catch (error) {
    logger.error(`Analyzer agent input validation failed: ${error}`);
    throw error;
  }
}

/**
 * Validate output data against analyzer agent schema
 * @param output - Raw output data to validate
 * @returns Validated output data
 * @throws ZodError if validation fails
 */
export function validateAnalyzerAgentOutput(output: unknown): z.infer<typeof analyzerAgentOutputSchema> {
  try {
    return analyzerAgentOutputSchema.parse(output);
  } catch (error) {
    logger.error(`Analyzer agent output validation failed: ${error}`);
    throw error;
  }
}

// Export schemas for use in other parts of the application
export { analyzerAgentInputSchema, analyzerAgentOutputSchema, analyzerAgentConfigSchema };