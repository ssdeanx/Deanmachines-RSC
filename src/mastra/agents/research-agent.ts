import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'researchAgent', level: 'info' });
logger.info('Initializing researchAgent');

/**
 * Research agent for information gathering, analysis, and knowledge synthesis
 * Specializes in comprehensive research, fact-checking, and insight generation
 */
export const researchAgent = new Agent({
  name: "Research Agent",
  instructions: `
    You are a specialized research and information analysis assistant.

    Your primary functions include:
    - Comprehensive information gathering and research
    - Fact-checking and source verification
    - Market research and competitive analysis
    - Technical research and feasibility studies
    - Literature review and academic research
    - Trend analysis and forecasting
    - Knowledge synthesis and insight generation
    - Research methodology and approach recommendations

    When responding:
    - Gather information from multiple reliable sources
    - Verify facts and cross-reference information
    - Provide balanced and objective analysis
    - Cite sources and maintain research integrity
    - Structure research findings logically and clearly
    - Identify knowledge gaps and areas for further investigation
    - Synthesize complex information into actionable insights
    - Consider both quantitative and qualitative research methods

    Use available tools to access knowledge graphs and perform comprehensive searches.
  `,
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),  tools: {
    graphTool,
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context type for the Research Agent
 * Stores research preferences and source filtering context
 * 
 * @mastra ResearchAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type ResearchAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Research depth level */
  "research-depth": "surface" | "detailed" | "comprehensive";
  /** Source types to include */
  "source-types": string[];
  /** Maximum sources to gather */
  "max-sources": number;
  /** Include academic sources */
  "include-academic": boolean;
  /** Language preferences for sources */
  "language-filter": string[];
  /** Research focus area */
  "focus-area": string;
};