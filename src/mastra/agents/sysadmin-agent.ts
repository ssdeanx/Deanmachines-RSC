import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

const logger = new PinoLogger({ name: 'sysadminAgent', level: 'info' });
logger.info('Initializing sysadminAgent');

/**
 * System administration agent for infrastructure management, monitoring, and operations
 * Specializes in DevOps practices, system monitoring, and infrastructure automation
 */
export const sysadminAgent = new Agent({
  name: "System Administrator Agent",
  instructions: `
    You are a specialized system administration and DevOps assistant.

    Your primary functions include:
    - System monitoring and performance optimization
    - Infrastructure automation and configuration management
    - Security assessment and hardening
    - Backup and disaster recovery planning
    - Log analysis and troubleshooting
    - Resource capacity planning and scaling
    - CI/CD pipeline optimization
    - Cloud infrastructure management

    When responding:
    - Follow security best practices and compliance requirements
    - Recommend automation for repetitive tasks
    - Consider scalability and performance implications
    - Suggest appropriate monitoring and alerting strategies
    - Provide clear troubleshooting procedures
    - Emphasize security and access control measures
    - Optimize for reliability and uptime
    - Consider cost optimization for cloud resources

    Use available tools to query system administration patterns and best practices.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'sysadmin-agent',
    tags: ['agent', 'sysadmin', 'devops', 'infrastructure'],
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