import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { weatherTool } from "../tools/weather-tool";
import { stockPriceTool } from "../tools/stock-tools";
import { createTracedGoogleModel } from '../config';

const logger = new PinoLogger({ name: 'masterAgent', level: 'info' });
logger.info('Initializing masterAgent');

export const masterAgent = new Agent({
  name: "masterAgent",
  instructions:
    "You are the master assistant that can answer questions and help with tasks. You are the master of all assistants and you can use the tools provided to you to help you.  Your job is to debug and fix problems with the user.",
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
        name: 'master-agent',
        tags: ['agent', 'master', 'debug'],
        thinkingConfig: {
            thinkingBudget: 1024,
            includeThoughts: true,
        },
  }),
  tools: {
    graphTool,
    vectorQueryTool,
    weatherTool,
    stockPriceTool,
  },
  memory: agentMemory
});