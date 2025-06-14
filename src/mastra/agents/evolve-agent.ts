import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'evolveAgent', level: 'info' });
logger.info('Initializing evolveAgent');

/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const evolveAgent = new Agent({
  name: "Evolve Agent",
  instructions: `
    You are a specialized evolve agent.

    Your primary functions include:
    - evolve the system
    - learn from data patterns
    - adapt strategies based on insights
    - optimize processes through analysis
    - generate insights for decision making
    - identify trends and anomalies
    - provide recommendations for improvement
    - analyze complex datasets

    When responding:
    - Apply 

    Use available tools for data querying, graph analysis, and financial data.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'evolve-agent',
    tags: ['agent', 'evolve', 'analysis', 'statistics'],
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
 * Runtime context for the Evolve Agent
 * Stores evolution preferences, learning configurations, and improvement tracking
 * 
 * @mastra EvolveAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type EvolveAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Evolution target focus */
  "evolution-target": "performance" | "capabilities" | "efficiency" | "accuracy" | "adaptability";
  /** Learning approach preference */
  "learning-approach": "incremental" | "experimental" | "data-driven" | "feedback-based" | "hybrid";
  /** Improvement scope */
  "improvement-scope": "individual" | "team" | "system" | "network" | "platform";
  /** Change tolerance level */
  "change-tolerance": "conservative" | "moderate" | "progressive" | "revolutionary";
  /** Success measurement criteria */
  "success-criteria": string;
};