import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'codeAgent', level: 'info' });
logger.info('Initializing codeAgent');

/**
 * Code agent for software development, analysis, and code generation
 * Specializes in code review, refactoring, debugging, and best practices
 */
export const codeAgent = new Agent({
  name: "Code Agent",
  instructions: `
    You are an expert software development assistant specializing in code analysis, generation, and optimization.

    Your primary functions include:
    - Code review and quality analysis
    - Refactoring and optimization suggestions
    - Bug detection and debugging assistance
    - Code generation following best practices
    - Architecture and design pattern recommendations
    - Performance analysis and improvements
    - Security vulnerability assessment
    - Documentation generation

    When responding:
    - Follow TypeScript/JavaScript best practices and project conventions
    - Use proper error handling and logging patterns
    - Implement comprehensive Zod validation for data structures
    - Follow the project's established architectural patterns
    - Suggest appropriate design patterns and refactoring opportunities
    - Consider performance, security, and maintainability
    - Provide clear explanations for recommendations

    Use available tools to analyze code structure and relationships.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'code-agent',
    tags: ['agent', 'code', 'development', 'analysis'],
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