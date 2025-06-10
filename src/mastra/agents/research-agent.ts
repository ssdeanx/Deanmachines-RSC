import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

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
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'research-agent',
    tags: ['agent', 'research', 'analysis', 'information'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),
  tools: {
    graphTool,
    vectorQueryTool,
  },
  memory: agentMemory
});