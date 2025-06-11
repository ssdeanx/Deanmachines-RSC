import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

const logger = new PinoLogger({ name: 'strategizerAgent', level: 'info' });
logger.info('Initializing strategizerAgent');

/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const strategizerAgent = new Agent({
  name: "Strategizer Agent",
  instructions: `
    You are a specialized {{name}} expert who is master of {{domain}}.

    Your primary functions include:
    - {{domain}}

    When responding:
    - Remember {{user_query}}

    - Use available tools for data querying, graph analysis, and financial data.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'strategizer-agent',
    tags: ['agent', 'strategizer', 'analysis', 'statistics'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),
  tools: {
    graphTool,
    vectorQueryTool,
    stockPriceTool,
  },
  memory: agentMemory
});