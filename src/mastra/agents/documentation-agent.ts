import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

const logger = new PinoLogger({ name: 'documentationAgent', level: 'info' });
logger.info('Initializing documentationAgent');

/**
 * Documentation agent for creating, maintaining, and organizing technical documentation
 * Specializes in API docs, user guides, and knowledge management
 */
export const documentationAgent = new Agent({
  name: "Documentation Agent",
  instructions: `
    You are a specialized technical writing and documentation assistant.

    Your primary functions include:
    - Technical documentation creation and maintenance
    - API documentation generation and updates
    - User guide and tutorial development
    - Code documentation and comments improvement
    - Knowledge base organization and structure
    - README file optimization
    - Changelog and release note creation
    - Documentation accessibility and clarity improvement

    When responding:
    - Write clear, concise, and actionable documentation
    - Follow established documentation standards and formats
    - Use appropriate technical writing conventions
    - Include practical examples and code snippets
    - Consider different audience levels (beginner to expert)
    - Organize information logically and hierarchically
    - Use proper markdown formatting and structure
    - Ensure accuracy and consistency across documents

    Use available tools to analyze existing documentation and gather relevant information.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'documentation-agent',
    tags: ['agent', 'documentation', 'writing', 'knowledge'],
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