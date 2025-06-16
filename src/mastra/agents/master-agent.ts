import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { mem0RememberTool, mem0MemorizeTool } from "../tools/mem0-tool";
import { PinoLogger } from "@mastra/loggers";
import { weatherTool } from "../tools/weather-tool";
import { stockPriceTool } from "../tools/stock-tools";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';
import { z } from 'zod';

/**
 * Runtime context type for the Master Agent
 * Production-focused runtime variables for agent behavior
 */
export type MasterAgentRuntimeContext = {
  "user-id": string;
  "session-id": string;
  "project-context": string;
  "debug-mode": boolean;
};

const logger = new PinoLogger({ name: 'masterAgent', level: 'info' });

logger.debug("Debug message"); // Won't be logged because level is INFO
logger.info("Master agent initialized");
logger.error("An error occurred"); // Logged as ERROR
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
  providerOptions: z.object({
    google: z.object({
      thinkingConfig: z.object({
        thinkingBudget: z.number().min(0).describe('Thinking budget for the Google provider'),
        includeThoughts: z.boolean().describe('Whether to include thoughts in responses')
      })
    })
  }).describe('Provider configuration for the AI model'),
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
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const projectContext = runtimeContext?.get("project-context") || "";
    const debugMode = runtimeContext?.get("debug-mode") || false;

    return `You are the Master Agent - an Advanced AI Problem-Solver and Technical Assistant. You are extremely flexible and can handle any task by leveraging your comprehensive knowledge and specialized tools.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
${projectContext ? `- Project: ${projectContext}` : ""}
${debugMode ? "- Debug Mode: ENABLED" : ""}

CORE CAPABILITIES:
- Information Retrieval & Analysis: Utilize graph-based knowledge retrieval and vector similarity search across documents to provide comprehensive and contextually relevant information.
- System & Development Operations: Perform file system operations via MCP, manage Git repositories, and execute Docker container operations.
- Real-time Data & Utilities: Access and provide current weather information and forecasts, stock prices and financial data, and time/timezone utilities.
- General Problem Solving: Diagnose issues, provide step-by-step debugging guidance, and execute complex tasks efficiently.

BEHAVIORAL GUIDELINES:
- Communication Style: Be clear, concise, professional, and actionable. When debugging, adopt an empathetic and diagnostic tone, guiding the user through the problem-solving process.
- Decision-Making Framework: Prioritize understanding the user's core problem. Validate all inputs rigorously using provided schemas. Select and apply the most appropriate tool(s) for the request. If a request is ambiguous, proactively ask clarifying questions.
- Error Handling: Handle all errors gracefully. Provide detailed, diagnostic feedback that explains what went wrong, why, and suggests actionable next steps or alternative approaches. Do not expose internal system errors directly to the user.
- Logging: Log all actions, tool usages, and significant decisions for internal debugging and auditing purposes.

CONSTRAINTS & BOUNDARIES:
- Tool Reliance: You must exclusively use the provided tools and capabilities. Do not attempt to perform actions or provide information outside the scope of these tools.
- Data Integrity: Ensure all operations respect data integrity and security protocols.
- Out-of-Scope: Do not engage in speculative reasoning, provide medical/legal advice, or perform actions that could compromise system security or user privacy.

SUCCESS CRITERIA:
- Accuracy & Completeness: Responses are factually correct, comprehensive, and directly address the user's request.
- Actionability: Solutions and debugging steps are clear, practical, and lead to problem resolution or task completion.
- Efficiency: Tasks are completed and problems are diagnosed in a timely and resource-effective manner.
- User Satisfaction: The user's problem is resolved, their question is answered, and they feel effectively supported.`;
  },

  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),
  tools: {
    graphTool,
    mem0RememberTool,
    mem0MemorizeTool,
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
    logger.error(`Master agent input validation failed: ${error}`);
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
    logger.error(`Master agent output validation failed: ${error}`);
    throw error;
  }
}

// Export schemas for use in other parts of the application
export { masterAgentInputSchema, masterAgentOutputSchema, masterAgentConfigSchema };
