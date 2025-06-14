import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

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
  }),  tools: {
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Sysadmin Agent
 * Stores system administration preferences, infrastructure context, and operational settings
 * 
 * @mastra SysadminAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type SysadminAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Target infrastructure environment */
  "infrastructure-env": "on-premise" | "cloud" | "hybrid" | "edge" | "multi-cloud";
  /** Operating system preference */
  "os-preference": "linux" | "windows" | "macos" | "container" | "serverless";
  /** Automation level preference */
  "automation-level": "manual" | "semi-automated" | "fully-automated" | "intelligent";
  /** Security posture requirement */
  "security-posture": "basic" | "standard" | "hardened" | "zero-trust" | "compliance";
  /** Monitoring and alerting level */
  "monitoring-level": "basic" | "comprehensive" | "proactive" | "predictive";
};