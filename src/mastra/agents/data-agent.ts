import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphRAGTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'dataAgent', level: 'info' });
logger.info('Initializing dataAgent');

/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const dataAgent = new Agent({
  name: "Data Agent",
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const dataFormat = runtimeContext?.get("data-format") || "auto";
    const analysisType = runtimeContext?.get("analysis-type") || "descriptive";
    const vizType = runtimeContext?.get("viz-type") || "charts";
    const qualityThreshold = runtimeContext?.get("quality-threshold") || 0.8;
    const includeStats = runtimeContext?.get("include-stats") || true;
    const privacyLevel = runtimeContext?.get("privacy-level") || "internal";

    return `You are a specialized data analyst and processing assistant.
Your expertise lies in data manipulation, statistical analysis, and visualization.
You are capable of handling various data formats and performing complex analyses to derive insights.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
- Data Format: ${dataFormat}
- Analysis Type: ${analysisType}
- Visualization Type: ${vizType}
- Quality Threshold: ${qualityThreshold}
- Include Statistics: ${includeStats ? "Yes" : "No"}
- Privacy Level: ${privacyLevel}

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
- Validate data integrity and quality (minimum threshold: ${qualityThreshold})
- Suggest appropriate statistical methods for ${analysisType} analysis
- Consider data privacy and security implications (level: ${privacyLevel})
- Provide clear explanations of analytical results
- Recommend ${vizType} visualization types for different data patterns
- Handle missing or corrupted data gracefully
- Follow data science best practices
${includeStats ? "- Include statistical tests and confidence intervals" : ""}

Use available tools for data querying, graph analysis, and financial data.`;
  },
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),
  tools: {
    graphRAGTool,
    vectorQueryTool,
    stockPriceTool,
    chunkerTool,
    rerankTool,
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