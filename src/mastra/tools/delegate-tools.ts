/**
 * @mastra Agent Delegation Tools for Hierarchical Multi-Agent Coordination
 * 
 * This module provides tools for delegating tasks to specialized agents within
 * the Dean Machines RSC platform. Implements hierarchical multi-agent patterns
 * with dynamic runtime context support for request-specific configuration.
 * 
 * Key Features:
 * - Dynamic agent delegation based on task requirements
 * - Agent runtime context support for user/session-specific preferences 
 * - Type-safe agent selection and task routing
 * - Comprehensive error handling and logging
 * - Integration with existing agent registry
 * 
 * @author Dean Machines Team
 * @date 2025-06-17
 * @version 1.0.0
 * 
 * [EDIT: 2025-06-17] [BY: GitHub Copilot]
 */

import { createTool, ToolExecutionContext } from '@mastra/core/tools';
import { RuntimeContext } from '@mastra/core/di';
import { z } from 'zod';
import { PinoLogger } from '@mastra/loggers';
// Import agent registry for delegation
import { agentRegistry, agentMetadata, supervisorAgent } from '../agents';

const logger = new PinoLogger({ name: 'delegateTools', level: 'info' });

/**
 * Runtime context type for delegate tools configuration
 */
export type DelegateToolsRuntimeContext = {
  'user-id': string;
  'session-id': string;
  'delegation-depth': number;
  'max-delegation-depth': number;
  'execution-timeout': number;
  'priority-level': 'low' | 'normal' | 'high' | 'urgent';
  'context-category': string;
  'debug'?: boolean;
};


/**
 * Enhanced agent registry for delegation with specializations
 * Uses the imported agentRegistry and agentMetadata from the agent index
 */
const DELEGATION_REGISTRY = Object.entries(agentRegistry).reduce((acc, [key, agent]) => {
  acc[key] = {
    agent,
    specialization: agentMetadata[key as keyof typeof agentMetadata]?.description || `${key} agent`
  };
  return acc;
}, {} as Record<string, { agent: typeof agentRegistry[keyof typeof agentRegistry]; specialization: string }>);

/**
 * Input schema for agent delegation requests
 */
const delegateTaskInputSchema = z.object({
  task: z.string().min(1).describe('The task to delegate to a specialized agent'),
  agentId: z.enum([
    'master', 'strategizer', 'analyzer', 'evolve', 'supervisor',
    'code', 'git', 'data', 'debug', 'docker',
    'research', 'documentation', 'design', 'marketing',
    'weather', 'manager', 'browser', 'graph', 'processing',
    'special', 'sysadmin', 'utility'
  ]).describe('The ID of the agent to delegate the task to'),
  context: z.record(z.any()).optional().describe('Additional context for the delegated task'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal').describe('Task priority level')
}).strict();

/**
 * Input schema for intelligent agent selection
 */
const intelligentDelegateInputSchema = z.object({
  task: z.string().min(1).describe('The task that needs to be completed'),
  requirements: z.array(z.string()).optional().describe('Specific requirements or constraints'),
  domain: z.string().optional().describe('The domain or area of expertise needed'),
  context: z.record(z.any()).optional().describe('Additional context for task execution')
}).strict();

/**
 * Output schema for delegation responses
 */
const delegationOutputSchema = z.object({
  result: z.string().describe('The result from the delegated agent execution'),
  agentUsed: z.string().describe('The agent that executed the task'),
  executionTime: z.number().describe('Task execution time in milliseconds'),
  metadata: z.record(z.any()).optional().describe('Additional metadata from execution')
});

/**
 * Tool for delegating tasks to specific agents
 * 
 * Allows direct delegation to a known specialized agent when the caller
 * knows exactly which agent should handle the task.
 * 
 * @example
 * ```typescript
 * const result = await delegateTaskTool.execute({
 *   task: "Analyze the sales data for Q4 trends",
 *   agentId: "analyzer",
 *   context: { dataSource: "sales_q4.csv" }
 * });
 * ```
 */
export const delegateTaskTool = createTool({
  id: 'delegate-task',
  description: 'Delegate a specific task to a specialized agent by agent ID',
  inputSchema: delegateTaskInputSchema,
  outputSchema: delegationOutputSchema,
  execute: async ({ context, runtimeContext }) => {
    const startTime = Date.now();
    
    try {      // Type-safe access to runtime context
      const userId = (runtimeContext?.get?.('user-id') as string) || 'anonymous';
      const sessionId = (runtimeContext?.get?.('session-id') as string) || `session-${Date.now()}`;
      const delegationDepth = (runtimeContext?.get?.('delegation-depth') as number) || 0;
      const maxDepth = (runtimeContext?.get?.('max-delegation-depth') as number) || 5;
      const executionTimeout = (runtimeContext?.get?.('execution-timeout') as number) || 30000;

      logger.info(`Delegating task to agent ${context.agentId}`, {
        userId,
        sessionId,
        delegationDepth,
        agentId: context.agentId,
        taskPreview: context.task.substring(0, 100)
      });

      // Check delegation depth to prevent infinite loops
      if (delegationDepth >= maxDepth) {
        throw new Error(`Maximum delegation depth (${maxDepth}) exceeded`);
      }      // Get the target agent
      const agentInfo = DELEGATION_REGISTRY[context.agentId];
      if (!agentInfo) {
        throw new Error(`Unknown agent ID: ${context.agentId}`);
      }

      // Prepare the delegation context
      const delegationContext = {
        ...context.context,
        delegatedBy: 'delegation-tool',
        originalTask: context.task,
        priority: context.priority,
        userId,
        sessionId,
        delegationDepth: delegationDepth + 1
      };

      // Execute the delegated task with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Task execution timeout')), executionTimeout);      });      const executionPromise = agentInfo.agent.generate([
        {
          role: 'user',
          content: `Task: ${context.task}\n\nContext: ${JSON.stringify(delegationContext, null, 2)}`
        }
      ]);      const response = await Promise.race([executionPromise, timeoutPromise]);
      const executionTime = Date.now() - startTime;

      logger.info(`Task delegation completed successfully`, {
        userId,
        sessionId,
        agentId: context.agentId,
        executionTime
      });      return {
        result: typeof response === 'object' && response !== null && 'text' in response 
          ? (response as { text: string }).text 
          : typeof response === 'string' 
            ? response 
            : String(response),
        agentUsed: context.agentId,
        executionTime,
        metadata: {
          specialization: agentInfo.specialization,
          delegationDepth: delegationDepth + 1,
          priority: context.priority
        }
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      logger.error(`Task delegation failed`, {
        agentId: context.agentId,
        error: errorMessage,
        executionTime
      });

      return {
        result: `Delegation failed: ${errorMessage}`,
        agentUsed: context.agentId,
        executionTime,
        metadata: {
          error: errorMessage,
          failed: true
        }
      };
    }
  }});

/**
 * Tool for intelligent agent selection and delegation
 * 
 * Automatically selects the most appropriate agent based on task requirements
 * and domain expertise. Uses AI-powered analysis to determine the best agent.
 * 
 * @example
 * ```typescript
 * const result = await intelligentDelegateTool.execute({
 *   task: "Create a responsive navigation component",
 *   requirements: ["React", "TypeScript", "Tailwind CSS"],
 *   domain: "frontend-development"
 * });
 * ```
 */
export const intelligentDelegateTool = createTool({
  id: 'intelligent-delegate',
  description: 'Intelligently select and delegate to the most appropriate agent for a task',
  inputSchema: intelligentDelegateInputSchema,
  outputSchema: delegationOutputSchema,
  execute: async ({ context, runtimeContext }) => {
    const startTime = Date.now();
    
    try {      const userId = runtimeContext?.get?.('user-id') || 'anonymous';
      const sessionId = runtimeContext?.get?.('session-id') || `session-${Date.now()}`;

      logger.info(`Starting intelligent delegation`, {
        userId,
        sessionId,
        taskPreview: context.task.substring(0, 100),
        domain: context.domain
      });// Use the supervisor agent to analyze the task and select the best agent
      const analysisPrompt = `
Analyze this task and select the most appropriate agent from the available options:

Task: ${context.task}
Requirements: ${context.requirements?.join(', ') || 'None specified'}
Domain: ${context.domain || 'General'}

Available agents and their specializations:
${Object.entries(DELEGATION_REGISTRY).map(([id, info]) => 
  `- ${id}: ${info.specialization}`
).join('\n')}

Respond with ONLY the agent ID that would be best suited for this task.
`;

      const analysisResponse = await supervisorAgent.generate([
        { role: 'user', content: analysisPrompt }
      ]);

      const selectedAgentId = analysisResponse.text.trim().toLowerCase();      // Validate the selected agent
      if (!(selectedAgentId in DELEGATION_REGISTRY)) {
        logger.warn(`Invalid agent selection: ${selectedAgentId}, falling back to supervisor agent`);
        return await delegateTaskTool.execute({
          context: {
            task: context.task,
            agentId: 'supervisor',
            context: context.context,
            priority: 'normal'
          },
          runtimeContext
        });
      }

      // Delegate to the selected agent
      return await delegateTaskTool.execute({
        context: {
          task: context.task,
          agentId: selectedAgentId as keyof typeof agentRegistry,
          context: {
            ...context.context,
            intelligentlySelected: true,
            requirements: context.requirements,
            domain: context.domain
          },
          priority: 'normal'
        },
        runtimeContext
      });

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      logger.error(`Intelligent delegation failed`, {
        error: errorMessage,
        executionTime
      });

      return {
        result: `Intelligent delegation failed: ${errorMessage}`,
        agentUsed: 'none',
        executionTime,
        metadata: {
          error: errorMessage,
          failed: true
        }
      };
    }
  }
});

/**
 * Input schema for listing available agents
 */
const listAgentsInputSchema = z.object({
  domain: z.string().optional().describe('Filter agents by domain or specialization area'),
  includeSpecializations: z.boolean().optional().default(true).describe('Include agent specialization descriptions')
}).strict();

/**
 * Tool for listing available agents and their capabilities
 * 
 * Provides information about all available agents in the system,
 * their specializations, and current status.
 * 
 * @example
 * ```typescript
 * const result = await listAvailableAgentsTool.execute({
 *   domain: "development",
 *   includeSpecializations: true
 * });
 * ```
 */
export const listAvailableAgentsTool = createTool({
  id: 'list-available-agents',
  description: 'List all available agents and their specializations for delegation',
  inputSchema: listAgentsInputSchema,
  outputSchema: z.object({
    result: z.string(),
    totalAgents: z.number(),
    metadata: z.record(z.any()).optional()
  }),
  execute: async ({ context, runtimeContext }) => {
    try {
      const userId = runtimeContext?.get?.('user-id') || 'anonymous';
      
      logger.info(`Listing available agents`, {
        userId,
        domain: context.domain
      });      let agents = Object.entries(DELEGATION_REGISTRY);
      
      // Filter by domain if specified
      if (context.domain) {
        const domainLower = context.domain.toLowerCase();
        agents = agents.filter(([, info]) => 
          info.specialization.toLowerCase().includes(domainLower)
        );
      }

      const agentList = agents.map(([id, info]) => {
        if (context.includeSpecializations) {
          return `${id}: ${info.specialization}`;
        }
        return id;
      }).join('\n');

      const result = context.includeSpecializations
        ? `Available agents and their specializations:\n\n${agentList}`
        : `Available agent IDs:\n\n${agentList}`;

      return {
        result,
        totalAgents: agents.length,        metadata: {
          domain: context.domain,
          includeSpecializations: context.includeSpecializations,
          allAgents: Object.keys(DELEGATION_REGISTRY)
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      logger.error(`Failed to list agents`, { error: errorMessage });

      return {
        result: `Failed to list agents: ${errorMessage}`,
        totalAgents: 0,
        metadata: { error: errorMessage, failed: true }
      };
    }
  }
});
