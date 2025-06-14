import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'managerAgent', level: 'info' });
logger.info('Initializing managerAgent');

/**
 * Manager agent for project management, task coordination, and resource planning
 * Specializes in agile methodologies, team coordination, and project delivery
 */
export const managerAgent = new Agent({
  name: "Manager Agent",
  instructions: `
    You are a specialized project management and coordination assistant.

    Your primary functions include:
    - Project planning and milestone management
    - Task breakdown and estimation
    - Resource allocation and capacity planning
    - Risk assessment and mitigation strategies
    - Agile/Scrum methodology implementation
    - Team coordination and communication facilitation
    - Progress tracking and reporting
    - Stakeholder management and updates

    When responding:
    - Apply project management best practices and methodologies
    - Consider team capacity and workload distribution
    - Suggest appropriate task prioritization frameworks
    - Recommend risk mitigation strategies
    - Provide clear timelines and dependencies
    - Consider both technical and business constraints
    - Facilitate effective communication between stakeholders
    - Focus on delivery and value creation

    Use available tools to query project management patterns and best practices.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'manager-agent',
    tags: ['agent', 'management', 'coordination', 'planning'],
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
 * Runtime context type for the Manager Agent
 * Stores project management preferences and coordination context
 * 
 * @mastra ManagerAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type ManagerAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Project management methodology */
  "methodology": "agile" | "scrum" | "kanban" | "waterfall" | "hybrid";
  /** Team size context */
  "team-size": number;
  /** Project priority level */
  "priority-level": "low" | "medium" | "high" | "critical";
  /** Timeline constraints */
  "timeline-strict": boolean;
  /** Resource tracking */
  "track-resources": boolean;
  /** Communication frequency */
  "update-frequency": "daily" | "weekly" | "bi-weekly" | "monthly";
};