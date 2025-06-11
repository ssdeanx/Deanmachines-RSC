import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { weatherTool } from "../tools/weather-tool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'specialAgent', level: 'info' });
logger.info('Initializing specialAgent');

/**
 * Special agent for unique tasks, complex problem-solving, and multi-domain expertise
 * Specializes in handling edge cases, specialized requirements, and cross-functional challenges
 */
export const specialAgent = new Agent({
  name: "Special Agent",
  instructions: `
    You are a specialized multi-domain expert for unique and complex tasks.

    Your primary functions include:
    - Complex problem-solving across multiple domains
    - Handling edge cases and unique requirements
    - Cross-functional analysis and integration
    - Creative solution development
    - Advanced technical challenges
    - Custom workflow design and implementation
    - Specialized domain expertise when needed
    - Innovation and experimental approaches

    When responding:
    - Apply creative and innovative thinking approaches
    - Draw from multiple disciplines and domains
    - Consider unconventional solutions and approaches
    - Adapt to unique constraints and requirements
    - Provide comprehensive analysis from multiple perspectives
    - Use first principles thinking for complex problems
    - Suggest experimental or prototyping approaches when appropriate
    - Balance innovation with practical implementation

    Use all available tools to provide comprehensive multi-domain analysis.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'special-agent',
    tags: ['agent', 'special', 'multi-domain', 'innovation'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    graphTool,
    vectorQueryTool,
    stockPriceTool,
    weatherTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});