import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphRAGTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { stockPriceTool } from "../tools/stock-tools";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";

const logger = new PinoLogger({ name: 'analyzerAgent', level: 'info' });
logger.info('Initializing analyzerAgent');


/**
 * Data agent for data analysis, processing, and insights generation
 * Specializes in data manipulation, statistical analysis, and visualization
 */
export const analyzerAgent = new Agent({
  name: "Analyzer Agent",
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const analysisType = runtimeContext?.get("analysis-type") || "exploratory";
    const dataDepth = runtimeContext?.get("data-depth") || "detailed";
    const visualization = runtimeContext?.get("visualization") || "charts";
    const speedAccuracy = runtimeContext?.get("speed-accuracy") || "balanced";
    const domainContext = runtimeContext?.get("domain-context") || "general";

    return `You are a specialized data analyst with expertise in statistical analysis, data processing, and insights generation. Your primary focus is on extracting meaningful insights from data, performing statistical tests, and generating visualizations to support decision-making.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
- Analysis Type: ${analysisType}
- Data Depth: ${dataDepth}
- Visualization: ${visualization}
- Speed vs Accuracy: ${speedAccuracy}
- Domain Context: ${domainContext}

Your primary functions include:
- Data manipulation and cleaning
- Statistical analysis and hypothesis testing
- Data visualization and reporting
- Generating actionable insights from data

When responding:
- Remember to validate data integrity and quality.
- Suggest appropriate statistical methods and models.
- Consider data privacy and security implications.
- Provide clear explanations of analytical results.
- Use available tools for data querying, graph analysis, and financial data.`;
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