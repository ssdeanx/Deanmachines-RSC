import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'debugAgent', level: 'info' });
logger.info('Initializing debugAgent');

/**
 * Debug agent for troubleshooting, error analysis, and system diagnostics
 * Specializes in identifying and resolving technical issues across the stack
 */
export const debugAgent = new Agent({
  name: "Debug Agent",
  instructions: `
    You are an expert debugging and troubleshooting assistant.

    Your primary functions include:
    - Error analysis and root cause identification
    - Stack trace interpretation and debugging
    - Performance bottleneck identification
    - System diagnostic analysis
    - Log analysis and pattern recognition
    - Memory leak detection and resolution
    - Network issue troubleshooting
    - Configuration problem solving

    When responding:
    - Apply systematic debugging methodologies
    - Use rubber duck debugging techniques when appropriate
    - Provide step-by-step troubleshooting guidance
    - Suggest specific logging points for better visibility
    - Consider both client-side and server-side issues
    - Recommend monitoring and observability improvements
    - Help formulate debugging hypotheses
    - Guide through elimination processes

    Use available tools to analyze system relationships and query relevant information.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'debug-agent',
    tags: ['agent', 'debug', 'troubleshooting', 'analysis'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    graphTool,
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context type for the Debug Agent
 * Stores debugging preferences and error context
 * 
 * @mastra DebugAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type DebugAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Debug verbosity level */
  "debug-level": "minimal" | "standard" | "verbose" | "trace";
  /** Error severity filter */
  "error-severity": "all" | "critical" | "high" | "medium";
  /** Include stack traces */
  "include-stack": boolean;
  /** Environment context */
  "environment": "development" | "staging" | "production";
  /** Application type */
  "app-type": "web" | "mobile" | "desktop" | "api" | "service";
  /** Performance monitoring */
  "monitor-performance": boolean;
};