import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { weatherTool } from "../tools/weather-tool";
import { stockPriceTool } from "../tools/stock-tools";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';
import { z } from 'zod';

const logger = new PinoLogger({ name: 'masterAgent', level: 'info' });
logger.info('Initializing masterAgent');

/**
 * Comprehensive Zod schemas for Master Agent validation
 * Prevents Google AI model ZodNull validation errors
 */
const masterAgentInputSchema = z.object({
  query: z.string().min(1).describe('User query or request for the master agent'),
  context: z.record(z.any()).optional().describe('Optional context information'),
  requestId: z.string().optional().describe('Optional request identifier'),
  metadata: z.record(z.any()).optional().describe('Optional metadata')
}).strict();

const masterAgentOutputSchema = z.object({
  response: z.string().describe('Agent response to the user query'),
  actions: z.array(z.string()).optional().describe('Actions taken by the agent'),
  toolsUsed: z.array(z.string()).optional().describe('Tools used during processing'),
  requestId: z.string().describe('Unique request identifier'),
  timestamp: z.string().datetime().describe('Response timestamp')
}).strict();

/**
 * Enhanced Master Agent configuration with Zod validation
 * Prevents ZodNull errors and ensures type safety
 */
const masterAgentConfigSchema = z.object({
  name: z.string().min(1).describe('Agent name identifier'),
  instructions: z.string().min(1).describe('Agent instructions and behavior'),
  model: z.any().describe('AI model configuration'),
  tools: z.record(z.any()).describe('Available tools for the agent'),
  memory: z.any().describe('Agent memory configuration')
}).strict();

/**
 * Master Agent - Primary debugging and problem-solving assistant
 * 
 * Enhanced with comprehensive Zod validation to prevent ZodNull errors
 * and ensure type safety across all operations.
 * 
 * @mastra Enhanced master agent with input/output validation
 */
export const masterAgent = new Agent({
  name: "masterAgent",
  instructions: `You are the master assistant that can answer questions and help with tasks. You are the master of all assistants and you can use the tools provided to you to help you.  Your job is to debug and fix problems with the user.

  When processing requests:
  - Validate all inputs using the provided schemas
  - Use appropriate tools based on the request type
  - Provide clear, actionable responses
  - Log all actions for debugging purposes
  - Handle errors gracefully with detailed feedback
  
  Available capabilities:
  - Graph-based knowledge retrieval and analysis
  - Vector similarity search across documents
  - Weather information and forecasting
  - Stock price lookup and financial data
  - File system operations via MCP
  - Git repository management
  - Docker container operations
  - Time and timezone utilities`,
  
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'master-agent',
    tags: ['agent', 'master', 'debug', 'validated'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
    metadata: {
      hasInputValidation: true,
      zodSchemaVersion: '1.0.0',
      supportedInputTypes: ['query', 'context', 'metadata'],
      preventsZodNullErrors: true
    }
  }),
  
  tools: {
    graphTool,
    vectorQueryTool,
    weatherTool,
    stockPriceTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Validate input data against master agent schema
 * @param input - Raw input data to validate
 * @returns Validated input data
 * @throws ZodError if validation fails
 */
export function validateMasterAgentInput(input: unknown): z.infer<typeof masterAgentInputSchema> {
  try {
    return masterAgentInputSchema.parse(input);
  } catch (error) {
    logger.error('Master agent input validation failed', { error, input });
    throw error;
  }
}

/**
 * Validate output data against master agent schema
 * @param output - Raw output data to validate
 * @returns Validated output data
 * @throws ZodError if validation fails
 */
export function validateMasterAgentOutput(output: unknown): z.infer<typeof masterAgentOutputSchema> {
  try {
    return masterAgentOutputSchema.parse(output);
  } catch (error) {
    logger.error('Master agent output validation failed', { error, output });
    throw error;
  }
}

// Export schemas for use in other parts of the application
export { masterAgentInputSchema, masterAgentOutputSchema, masterAgentConfigSchema };