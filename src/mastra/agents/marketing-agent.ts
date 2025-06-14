import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'marketingAgent', level: 'info' });
logger.info('Initializing marketingAgent');

/**
 * Marketing agent for content creation, brand strategy, and marketing campaign development
 * Specializes in digital marketing, content strategy, and audience engagement
 */
export const marketingAgent = new Agent({
  name: "Marketing Agent",
  instructions: `
    You are a specialized marketing and content strategy assistant.

    Your primary functions include:
    - Content creation and copywriting
    - Brand messaging and positioning
    - Marketing campaign strategy and planning
    - Social media content and engagement strategies
    - SEO optimization and keyword research
    - Email marketing and automation
    - Market research and competitive analysis
    - Customer persona development and targeting

    When responding:
    - Create compelling and engaging content
    - Maintain consistent brand voice and messaging
    - Consider target audience demographics and preferences
    - Apply digital marketing best practices
    - Suggest data-driven marketing strategies
    - Optimize content for search engines and social platforms
    - Recommend appropriate marketing channels and tactics
    - Focus on conversion optimization and ROI

    Use available tools to research marketing trends and content strategies.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'marketing-agent',
    tags: ['agent', 'marketing', 'content', 'strategy'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Marketing Agent
 * Stores marketing campaign data, brand preferences, and audience targeting information
 * 
 * @mastra MarketingAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type MarketingAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Brand or company name */
  "brand-name": string;
  /** Target audience demographic */
  "target-audience": string;
  /** Marketing campaign type */
  "campaign-type": "social" | "email" | "content" | "seo" | "ppc" | "brand";
  /** Content tone preference */
  "content-tone": "professional" | "casual" | "friendly" | "authoritative" | "playful";
  /** Marketing budget range */
  "budget-range": "small" | "medium" | "large" | "enterprise";
};