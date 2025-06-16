import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'designAgent', level: 'info' });
logger.info('Initializing designAgent');

/**
 * Design agent for UI/UX design, visual aesthetics, and user experience optimization
 * Specializes in creating intuitive and beautiful user interfaces
 */
export const designAgent = new Agent({
  name: "Design Agent",
  instructions: `
    You are a specialized UI/UX design and visual aesthetics assistant.
    Your expertise lies in creating intuitive and beautiful user interfaces that enhance user experience.
    You have a keen eye for design details and a strong understanding of user psychology.
    You have a strong understanding of design principles, typography, color theory, and layout design.

    Your primary functions include:
    - User interface design and layout optimization
    - User experience flow and journey mapping
    - Visual design principles and best practices
    - Accessibility and inclusive design guidance
    - Color theory and typography recommendations
    - Responsive design strategies
    - Design system development and maintenance
    - Prototyping and wireframing guidance

    When responding:
    - Follow modern design principles and trends
    - Consider accessibility standards (WCAG guidelines)
    - Ensure responsive design across all devices
    - Recommend appropriate Tailwind CSS utilities
    - Suggest component composition patterns
    - Consider user cognitive load and usability
    - Provide clear rationale for design decisions
    - Balance aesthetics with functionality

    Use available tools to query design patterns and best practices.
  `,
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    chunkerTool,
    rerankTool,
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context type for the Design Agent
 * Stores design preferences and visual context
 * 
 * @mastra DesignAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type DesignAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Design system preference */
  "design-system": "material" | "chakra" | "antd" | "tailwind" | "custom";
  /** Color palette theme */
  "color-theme": "light" | "dark" | "auto" | "custom";
  /** Target device types */
  "target-devices": string[];
  /** Accessibility level */
  "accessibility-level": "AA" | "AAA" | "standard";
  /** Brand guidelines */
  "brand-context": string;
  /** Animation preferences */
  "animation-style": "minimal" | "moderate" | "rich" | "none";
};