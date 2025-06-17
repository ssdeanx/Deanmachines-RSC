import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphRAGTool } from '../tools/graphRAG';
import { vectorQueryTool, hybridVectorSearchTool } from "../tools/vectorQueryTool";
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'supervisorAgent', level: 'info' });
logger.info('Initializing supervisorAgent');

/**
 * Supervisor agent for agent orchestration, coordination, and quality control
 * Specializes in managing multi-agent workflows and ensuring optimal task distribution
 */
export const supervisorAgent = new Agent({
  name: "Supervisor Agent",
  instructions: async ({ runtimeContext }) => {
    const userId = runtimeContext?.get("user-id") || "anonymous";
    const sessionId = runtimeContext?.get("session-id") || "default";
    const agentCount = runtimeContext?.get("agent-count") || 1;
    const coordinationStrategy = runtimeContext?.get("coordination-strategy") || "collaborative";
    const qaLevel = runtimeContext?.get("qa-level") || "standard";
    const delegationLevel = runtimeContext?.get("delegation-level") || "moderate";
    const escalationThreshold = runtimeContext?.get("escalation-threshold") || "medium";

    return `You are a specialized agent coordination and supervision assistant. Your role is to ensure smooth collaboration and optimal performance among a team of agents. You ensure that agents are working together effectively, and that tasks are completed efficiently and accurately. You have a strong understanding of multi-agent systems, task delegation, and quality assurance.

CURRENT SESSION:
- User: ${userId}
- Session: ${sessionId}
- Agent Count: ${agentCount}
- Coordination Strategy: ${coordinationStrategy}
- Quality Assurance Level: ${qaLevel}
- Delegation Level: ${delegationLevel}
- Escalation Threshold: ${escalationThreshold}

You are proficient in analyzing agent capabilities, monitoring performance, and resolving conflicts between agents. You are familiar with various coordination strategies and can adapt to different agent ecosystems. You have a strong understanding of communication protocols and can facilitate effective information exchange between agents.

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

Use available tools to analyze agent relationships and coordination patterns.`;
  },
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),  tools: {
    graphRAGTool,
    hybridVectorSearchTool,
    chunkerTool,
    rerankTool,
    // Using vectorQueryTool for direct vector queries
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Supervisor Agent
 * Stores agent coordination preferences, delegation rules, and oversight configurations
 * 
 * @mastra SupervisorAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type SupervisorAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Number of agents under supervision */
  "agent-count": number;
  /** Coordination strategy */
  "coordination-strategy": "centralized" | "distributed" | "hierarchical" | "collaborative";
  /** Quality assurance level */
  "qa-level": "basic" | "standard" | "rigorous" | "comprehensive";
  /** Delegation authority level */
  "delegation-level": "limited" | "moderate" | "extensive" | "full";
  /** Escalation threshold */
  "escalation-threshold": "low" | "medium" | "high" | "critical-only";
};