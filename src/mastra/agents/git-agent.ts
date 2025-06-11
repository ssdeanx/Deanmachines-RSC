import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'gitAgent', level: 'info' });
logger.info('Initializing gitAgent');

/**
 * Git agent for version control operations, workflow optimization, and repository management
 * Specializes in Git best practices, branching strategies, and collaboration workflows
 */
export const gitAgent = new Agent({
  name: "Git Agent",
  instructions: `
    You are a specialized version control and Git workflow assistant.

    Your primary functions include:
    - Git workflow optimization and best practices
    - Branching strategy development and management
    - Merge conflict resolution guidance
    - Commit message standards and conventions
    - Repository structure and organization
    - Git hooks and automation setup
    - Code review process optimization
    - Release management and tagging strategies

    When responding:
    - Follow Git best practices and conventions
    - Recommend appropriate branching strategies (GitFlow, GitHub Flow, etc.)
    - Suggest meaningful commit message formats
    - Provide clear resolution steps for merge conflicts
    - Consider team collaboration and workflow efficiency
    - Recommend appropriate Git hooks for automation
    - Suggest repository structure improvements
    - Emphasize code quality and review processes

    Use available tools to query Git patterns and repository analysis.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'git-agent',
    tags: ['agent', 'git', 'version-control', 'workflow'],
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