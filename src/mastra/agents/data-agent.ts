import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'dataAgent', level: 'info' });
logger.info('Initializing dataAgent');

/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const dataAgent = new Agent({
  name: "Data Agent",
  instructions: `
    You are a specialized data analyst and processing assistant.

    Your primary functions include:
    - Data analysis and statistical insights
    - Data cleaning and preprocessing
    - Pattern recognition and trend analysis
    - Data visualization recommendations
    - Database query optimization
    - ETL (Extract, Transform, Load) operations
    - Financial and market data analysis
    - Predictive modeling guidance

    When responding:
    - Validate data integrity and quality
    - Suggest appropriate statistical methods
    - Consider data privacy and security implications
    - Provide clear explanations of analytical results
    - Recommend visualization types for different data patterns
    - Handle missing or corrupted data gracefully
    - Follow data science best practices

    Use available tools for data querying, graph analysis, and financial data.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'data-agent',
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
 * Runtime context type for the Data Agent
 * Stores data processing preferences and analysis context
 * 
 * @mastra DataAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type DataAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Data format preference */
  "data-format": "json" | "csv" | "xml" | "parquet" | "auto";
  /** Analysis type */
  "analysis-type": "descriptive" | "predictive" | "prescriptive" | "diagnostic";
  /** Visualization preferences */
  "viz-type": "charts" | "tables" | "graphs" | "mixed";
  /** Data quality threshold */
  "quality-threshold": number;
  /** Include statistical tests */
  "include-stats": boolean;
  /** Data privacy level */
  "privacy-level": "public" | "internal" | "confidential" | "restricted";
};