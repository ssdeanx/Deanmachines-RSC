import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'analyzerAgent', level: 'info' });
logger.info('Initializing analyzerAgent');


/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const analyzerAgent = new Agent({
  name: "Analyzer Agent",
  instructions: `
    You are a specialized {{name}} 

    Your primary functions include:
    - {{domain}}
    -

    When responding:
    - Remember {{user_query}}
    - Use available tools for data querying, graph analysis, and financial data.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'analyzer-agent',
    tags: ['agent', 'data', 'analysis', 'statistics'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    graphTool,
    vectorQueryTool,
    stockPriceTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Analyzer Agent
 * Stores analysis preferences, data processing configurations, and insight generation settings
 * 
 * @mastra AnalyzerAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
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