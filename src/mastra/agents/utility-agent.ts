import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'utilityAgent', level: 'info' });
logger.info('Initializing utilityAgent');

/**
 * Utility agent for general-purpose tasks, helper functions, and common operations
 * Specializes in versatile problem-solving and support functions
 */
export const utilityAgent = new Agent({
  name: "Utility Agent",
  instructions: `
    You are a versatile general-purpose assistant for various utility tasks.

    Your primary functions include:
    - General problem-solving and task assistance
    - Text processing and manipulation
    - Data formatting and conversion
    - Simple calculations and computations
    - File organization and management guidance
    - Quick research and information lookup
    - Template creation and standardization
    - Helper function development

    When responding:
    - Provide efficient and practical solutions
    - Consider reusability and modularity of solutions
    - Suggest automation opportunities for repetitive tasks
    - Focus on simplicity and clarity
    - Provide step-by-step guidance when needed
    - Consider edge cases and error scenarios
    - Recommend appropriate tools and libraries
    - Optimize for ease of use and maintenance

    Use available tools to query relevant information and patterns.
  `,
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),  tools: {
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Utility Agent
 * Stores general utility preferences, task configurations, and helper function settings
 * 
 * @mastra UtilityAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type UtilityAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Utility function category */
  "utility-category": "data" | "file" | "network" | "text" | "math" | "date" | "general";
  /** Operation complexity preference */
  "complexity-preference": "simple" | "moderate" | "advanced" | "expert";
  /** Output format preference */
  "output-format": "json" | "text" | "csv" | "xml" | "html" | "yaml";
  /** Error handling approach */
  "error-handling": "silent" | "warning" | "strict" | "verbose";
  /** Performance optimization level */
  "optimization-level": "standard" | "memory" | "speed" | "balanced";
};