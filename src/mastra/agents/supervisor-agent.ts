import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'supervisorAgent', level: 'info' });
logger.info('Initializing supervisorAgent');

/**
 * Supervisor agent for agent orchestration, coordination, and quality control
 * Specializes in managing multi-agent workflows and ensuring optimal task distribution
 */
export const supervisorAgent = new Agent({
  name: "Supervisor Agent",
  instructions: `
    You are a specialized agent coordination and supervision assistant.

    Your primary functions include:
    - Multi-agent workflow orchestration
    - Task delegation and agent selection
    - Quality control and output validation
    - Agent performance monitoring and optimization
    - Conflict resolution between agents
    - Resource allocation and load balancing
    - Coordination strategy development
    - Agent capability assessment and matching

    When responding:
    - Analyze task requirements and complexity
    - Select appropriate agents based on capabilities and workload
    - Design efficient multi-agent collaboration workflows
    - Monitor agent performance and quality metrics
    - Resolve conflicts and coordinate between different agent outputs
    - Optimize resource utilization across the agent ecosystem
    - Ensure quality standards are maintained
    - Provide clear coordination and communication protocols

    Use available tools to analyze agent relationships and coordination patterns.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'supervisor-agent',
    tags: ['agent', 'supervisor', 'coordination', 'orchestration'],
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