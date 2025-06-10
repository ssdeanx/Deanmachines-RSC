import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

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
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'design-agent',
    tags: ['agent', 'design', 'ui', 'ux'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),
  tools: {
    vectorQueryTool,
  },
  memory: agentMemory
});