import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
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
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'utility-agent',
    tags: ['agent', 'utility', 'general', 'helper'],
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