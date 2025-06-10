import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

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
  }),
  tools: {
    graphTool,
    vectorQueryTool,
    stockPriceTool,
  },
  memory: agentMemory
});