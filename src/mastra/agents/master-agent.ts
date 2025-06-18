import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphRAGTool } from '../tools/graphRAG';
import { vectorQueryTool, hybridVectorSearchTool } from "../tools/vectorQueryTool";
import { mem0RememberTool, mem0MemorizeTool } from "../tools/mem0-tool";
import { PinoLogger } from "@mastra/loggers";
import { weatherTool } from "../tools/weather-tool";
import { stockPriceTool } from "../tools/stock-tools";
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import {
  ToneConsistencyMetric,
  KeywordCoverageMetric,
  CompletenessMetric,
  ContentSimilarityMetric,
  TextualDifferenceMetric                       
} from '@mastra/evals/nlp';
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';
import { z } from 'zod';
//import { CustomEvalMetric } from "../evals/customEval";
import { WordInclusionMetric } from "../evals/wordInclusion";

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
  instructions: z.string().describe('Detailed instructions for the agent'),
  runtimeContext: z.object({
    'user-id': z.string().describe('User identifier'),
    'session-id': z.string().describe('Session identifier'),
    'project-context': z.string().describe('Project context'),
    'debug-mode': z.boolean().describe('Debug mode flag')
  }).describe('Runtime context for the agent'),
  model: z.any().describe('Model configuration for the agent'),
  evals: z.record(z.any()).describe('Evaluation metrics for the agent'),
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
  name: "Master Agent",
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

  model: createGemini25Provider('gemini-2.5-flash-lite-preview-06-17',  {
    responseModalities: ["TEXT"],
    thinkingConfig: {
      thinkingBudget: -1, // -1 means dynamic thinking budget
      includeThoughts: true, // Include thoughts for debugging and monitoring purposes
    },
  }),
  tools: {
    graphRAGTool,
    mem0RememberTool,
    mem0MemorizeTool,
    hybridVectorSearchTool,
    rerankTool,
    chunkerTool,
    vectorQueryTool,
    weatherTool,
    stockPriceTool,
    ...await mcp.getTools(),
  },  
  memory: agentMemory,
  evals: {  
    toneConsistency: new ToneConsistencyMetric(),
    keywordCoverage: new KeywordCoverageMetric(),
    completeness: new CompletenessMetric(),
    wordInclusion: new WordInclusionMetric(['master-agent', 'mastra', 'problem-solving', 'agent', 'debugging',
      'technical', 'assistant', 'flexible', 'tools', 'knowledge', 'retrieval', 'vector', 'similarity',
      'search', 'documents', 'file', 'system', 'operations', 'mcp', 'git', 'repositories', 'docker',
      'containers', 'weather', 'stock', 'prices', 'financial', 'data', 'time', 'timezone', 'code', 'programming',
      'scripting', 'bash', 'shell', 'terminal', 'command', 'prompt', 'input', 'output', 'response', 'result',
      'answer', 'solution', 'fix', 'bug', 'error', 'warning', 'alert', 'notification', 'message', 'chat',
      'conversation', 'interaction', 'dialogue', 'exchange', 'communication', 'feedback', 'evaluation',
      'assessment', 'grading', 'score', 'grade', 'mark', 'point', 'rating', 'rank', 'position', 'order',
      'sequence', 'chronology', 'timeline', 'history', 'past', 'present', 'future', 'time', 'date', 'day',
      'week', 'month', 'year', 'decade', 'century', 'millennium', 'age', 'period', 'duration', 'interval',
      'window', 'span', 'extent', 'scope', 'boundary', 'limit', 'bound', 'fence', 'barrier', 'wall', 'barrier',
      'obstacle', 'hindrance', 'impediment', 'blocker', 'hurdle', 'challenge', 'obstacle', 'challenge', 'problem',
      'issue', 'task', 'job', 'duty', 'responsibility', 'accountability', 'obligation', 'commitment',
      'expectation', 'requirement', 'specification', 'standard', 'criteria', 'principle', 'rule', 'law',
      'regulation', 'policy', 'procedure', 'protocol', 'format', 'template', 'scheme', 'design', 'pattern',
      'model', 'framework', 'tool', 'utility', 'resource', 'asset', 'inventory', 'store', 'database',
      'repository', 'cache', 'memory', 'buffer', 'pool', 'pool', 'well', 'source', 'origin', 'root', 'base',
      'foundation', 'core', 'essence', 'heart', 'soul', 'spirit', 'mind', 'intelligence', 'reason', 'logic',
      'judgment', 'decision', 'choice', 'option', 'alternative', 'variety', 'diversity', 'richness', 'complexity',
      'depth', 'breadth', 'range', 'scope', 'extent', 'reach', 'impact', 'influence', 'power', 'strength',
      'weakness', 'vulnerability', 'sensitivity', 'resilience', 'adaptability', 'flexibility', 'agility',
      'nimbleness', 'swiftness', 'speed', 'velocity', 'dynamics', 'motion', 'flow', 'movement', 'change',
      'transformation', 'evolution', 'progress', 'development']),
    contentSimilarity: new ContentSimilarityMetric(),
    textualDifference: new TextualDifferenceMetric(),

//    customEval: new CustomEvalMetric(createGemini25Provider('gemini-2.5-flash-preview-05-20', {
//      thinkingConfig: {
//        thinkingBudget: 0,
//        includeThoughts: false,
//      },
//    })),
  }
});

/**


 * Validate input data against master agent schema * @param input - Raw input data to validate * @returns Validated input data * @throws ZodError if validation fails */
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
