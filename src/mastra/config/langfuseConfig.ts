// Generated on 2025-06-20 - Enhanced Langfuse Tracing for All Agents
/**
 * Enhanced Langfuse Tracing System for Mastra
 *
 * This provides comprehensive tracing for ALL agents with rich metadata.
 * Works with your existing telemetry setup but adds detailed agent tracking.
 *
 * Features:
 * - Traces all 22+ agents with detailed metadata
 * - Captures user context, session info, and runtime data
 * - Tracks tool usage, MCP server calls, and performance metrics
 * - Adds custom tags and metadata for each agent type
 * - Monitors thinking config, safety levels, and model parameters
 * - Provides workflow and network coordination tracking
 *
 * @see https://mastra.ai/en/reference/observability/providers/langfuse
 * @see https://langfuse.com/docs
 */

import { PinoLogger } from '@mastra/loggers';
import { Langfuse } from 'langfuse';

/**
 * Langfuse observability logger
 */
export const langfuseLogger = new PinoLogger({
  name: 'LangfuseObservability',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

/**
 * Langfuse configuration using environment variables
 */
export const langfuseConfig = {
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  baseUrl: process.env.LANGFUSE_BASEURL || 'https://cloud.langfuse.com',
  tracingEnabled: process.env.LANGFUSE_TRACING !== 'false', // Default to enabled
  projectName: process.env.LANGFUSE_PROJECT || 'deanmachines-rsc',
  environment: process.env.NODE_ENV || 'development',
};

/**
 * Enhanced Langfuse client for direct tracing
 * This works alongside your existing telemetry setup
 */
export const langfuseClient = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
});

/**
 * Check if Langfuse is properly configured
 * This checks the same environment variables your index.ts uses
 */
export const isLangfuseConfigured = (): boolean => {
  return !!(process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY);
};

/**
 * Enhanced agent tracing function
 * Call this in your agents to add detailed metadata tracking
 *
 * @param agentName - Name of the agent (e.g., 'master', 'code', 'research')
 * @param operation - Operation being performed ('generate', 'stream', 'callTool')
 * @param input - Input data/prompt
 * @param context - Additional context (userId, sessionId, etc.)
 * @returns Trace object for updating with results
 */
export const traceAgentOperation = (
  agentName: string,
  operation: 'generate' | 'stream' | 'callTool' | 'processMessage' | 'analyze',
  input: string | object,
  context?: {
    userId?: string;
    sessionId?: string;
    threadId?: string;
    resourceId?: string;
    modelId?: string;
    thinkingBudget?: number;
    safetyLevel?: string;
    tools?: string[];
    metadata?: Record<string, unknown>;
  }
) => {
  if (!isLangfuseConfigured()) {
    return null;
  }

  const trace = langfuseClient.trace({
    name: `${agentName}-${operation}`,
    input: typeof input === 'string' ? { prompt: input } : input,
    metadata: {
      // Agent information
      agentName,
      operation,
      component: 'agent',
      framework: 'mastra',

      // User context
      userId: context?.userId,
      sessionId: context?.sessionId,
      threadId: context?.threadId,
      resourceId: context?.resourceId,

      // Model configuration
      modelId: context?.modelId || 'gemini-2.5-flash-lite-preview-06-17',
      thinkingBudget: context?.thinkingBudget,
      safetyLevel: context?.safetyLevel,

      // Tools and additional data
      toolsUsed: context?.tools,
      timestamp: new Date().toISOString(),
      environment: langfuseConfig.environment,
      project: langfuseConfig.projectName,

      // Custom metadata
      ...context?.metadata
    },
    tags: [
      'agent',
      'mastra',
      agentName,
      operation,
      langfuseConfig.environment
    ]
  });

  langfuseLogger.info(`Started tracing ${agentName} ${operation}`, {
    traceId: trace.id,
    agentName,
    operation,
    userId: context?.userId,
    sessionId: context?.sessionId
  });

  return trace;
};

/**
 * Complete an agent trace with results and performance metrics
 *
 * @param trace - Trace object from traceAgentOperation
 * @param result - The result/output from the agent
 * @param metrics - Performance metrics
 */
export const completeAgentTrace = (
  trace: ReturnType<typeof traceAgentOperation>,
  result: string | object,
  metrics?: {
    duration?: number;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    cost?: number;
    success?: boolean;
    error?: string;
  }
) => {
  if (!trace) return;

  trace.update({
    output: typeof result === 'string' ? { response: result } : result,
    metadata: {
      // Performance metrics
      duration: metrics?.duration,
      inputTokens: metrics?.inputTokens,
      outputTokens: metrics?.outputTokens,
      totalTokens: metrics?.totalTokens,
      cost: metrics?.cost,

      // Status
      success: metrics?.success ?? true,
      error: metrics?.error,
      completedAt: new Date().toISOString()
    }
  });

  langfuseLogger.info(`Completed agent trace`, {
    traceId: trace.id,
    success: metrics?.success ?? true,
    duration: metrics?.duration,
    tokens: metrics?.totalTokens
  });
};

/**
 * Trace tool usage within an agent operation
 *
 * @param trace - Parent trace object
 * @param toolName - Name of the tool being used
 * @param toolInput - Input to the tool
 * @param toolOutput - Output from the tool
 * @param metadata - Additional tool metadata
 */
export const traceToolUsage = (
  trace: ReturnType<typeof traceAgentOperation>,
  toolName: string,
  toolInput: object,
  toolOutput: object,
  metadata?: Record<string, unknown>
) => {
  if (!trace) return;

  const span = trace.span({
    name: `tool-${toolName}`,
    input: toolInput,
    output: toolOutput,
    metadata: {
      toolName,
      toolType: 'mcp',
      component: 'tool',
      framework: 'mastra',
      timestamp: new Date().toISOString(),
      ...metadata
    }
  });

  langfuseLogger.debug(`Traced tool usage: ${toolName}`, {
    traceId: trace.id,
    toolName,
    spanId: span.id
  });

  return span;
};

/**
 * Trace workflow execution
 *
 * @param workflowName - Name of the workflow
 * @param steps - Array of workflow steps
 * @param context - Workflow context
 */
export const traceWorkflow = (
  workflowName: string,
  steps: string[],
  context?: {
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
  }
) => {
  if (!isLangfuseConfigured()) {
    return null;
  }

  const trace = langfuseClient.trace({
    name: `workflow-${workflowName}`,
    input: { workflowName, steps },
    metadata: {
      workflowName,
      stepCount: steps.length,
      component: 'workflow',
      framework: 'mastra',
      userId: context?.userId,
      sessionId: context?.sessionId,
      timestamp: new Date().toISOString(),
      environment: langfuseConfig.environment,
      project: langfuseConfig.projectName,
      ...context?.metadata
    },
    tags: [
      'workflow',
      'mastra',
      workflowName,
      langfuseConfig.environment
    ]
  });

  langfuseLogger.info(`Started workflow trace: ${workflowName}`, {
    traceId: trace.id,
    stepCount: steps.length
  });

  return trace;
};

/**
 * Standard tag sets for Langfuse tracing
 */
export const LANGFUSE_TAGS = {
  // Agent tags
  AGENT: ['agent', 'mastra', 'ai'],
  MASTER_AGENT: ['agent', 'master', 'orchestrator', 'mastra'],
  CODE_AGENT: ['agent', 'code', 'development', 'mastra'],
  RESEARCH_AGENT: ['agent', 'research', 'analysis', 'mastra'],
  
  // Model tags
  GOOGLE_MODEL: ['model', 'google', 'gemini', 'ai-sdk'],
  THINKING_MODEL: ['model', 'thinking', 'reasoning', 'gemini-2.5'],
  
  // Workflow tags
  WORKFLOW: ['workflow', 'automation', 'mastra'],
  WORKFLOW_STEP: ['workflow', 'step', 'execution', 'mastra'],
  
  // Tool tags
  MCP_TOOL: ['tool', 'mcp', 'integration', 'mastra'],
  CUSTOM_TOOL: ['tool', 'custom', 'mastra'],
  
  // Network tags
  NETWORK: ['network', 'coordination', 'multi-agent', 'mastra'],
  
  // Performance tags
  PERFORMANCE: ['performance', 'metrics', 'monitoring'],
  ERROR: ['error', 'exception', 'debugging'],
  
  // Environment tags
  DEVELOPMENT: ['development', 'debug'],
  PRODUCTION: ['production', 'live'],
} as const;

/**
 * Helper function to create agent metadata for Langfuse
 */
export const createAgentMetadata = (
  agentName: string,
  operation: string,
  additionalData?: Record<string, unknown>
) => ({
  agentName,
  operation,
  component: 'agent',
  framework: 'mastra',
  timestamp: new Date().toISOString(),
  environment: langfuseConfig.environment,
  project: langfuseConfig.projectName,
  ...additionalData
});

/**
 * Helper function to create model metadata for Langfuse
 */
export const createModelMetadata = (
  modelId: string,
  provider: string = 'google',
  additionalData?: Record<string, unknown>
) => ({
  modelId,
  provider,
  component: 'model',
  framework: 'ai-sdk',
  timestamp: new Date().toISOString(),
  environment: langfuseConfig.environment,
  project: langfuseConfig.projectName,
  ...additionalData
});

/**
 * Helper function to create workflow metadata for Langfuse
 */
export const createWorkflowMetadata = (
  workflowName: string,
  stepName?: string,
  additionalData?: Record<string, unknown>
) => ({
  workflowName,
  stepName,
  component: 'workflow',
  framework: 'mastra',
  timestamp: new Date().toISOString(),
  environment: langfuseConfig.environment,
  project: langfuseConfig.projectName,
  ...additionalData
});

/**
 * Performance measurement utility with Langfuse logging
 */
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> => {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    langfuseLogger.info(`Operation completed: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      status: 'success',
      ...metadata
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    langfuseLogger.error(`Operation failed: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      ...metadata
    });

    throw error;
  }
};

/**
 * Log Langfuse configuration status
 */
export const logLangfuseStatus = (): void => {
  if (isLangfuseConfigured()) {
    langfuseLogger.info('Langfuse is properly configured and ready for tracing', {
      baseUrl: langfuseConfig.baseUrl,
      projectName: langfuseConfig.projectName,
      environment: langfuseConfig.environment,
      tracingEnabled: langfuseConfig.tracingEnabled
    });
  } else {
    langfuseLogger.warn('Langfuse is not configured - missing API keys', {
      hasPublicKey: !!process.env.LANGFUSE_PUBLIC_KEY,
      hasSecretKey: !!process.env.LANGFUSE_SECRET_KEY,
      baseUrl: langfuseConfig.baseUrl
    });
  }
};

// Log status on module load
logLangfuseStatus();

/**
 * Example: How to add enhanced tracing to your agents
 *
 * Add this to any agent file (e.g., master-agent.ts):
 *
 * ```typescript
 * import { traceAgentOperation, completeAgentTrace, traceToolUsage } from '../config/langfuseConfig';
 *
 * // In your agent's generate method:
 * export const masterAgent = new Agent({
 *   // ... existing config
 *
 *   async generate(input, context) {
 *     // Start tracing
 *     const trace = traceAgentOperation('master', 'generate', input, {
 *       userId: context.get('user-id'),
 *       sessionId: context.get('session-id'),
 *       modelId: 'gemini-2.5-flash-lite-preview-06-17',
 *       thinkingBudget: 4096,
 *       safetyLevel: 'MODERATE',
 *       metadata: { complexity: 'high', domain: 'general' }
 *     });
 *
 *     const startTime = Date.now();
 *
 *     try {
 *       // Your existing agent logic
 *       const result = await this.model.generate(input);
 *
 *       // If you use tools, trace them:
 *       if (toolUsed) {
 *         traceToolUsage(trace, 'mcp-tool-name', toolInput, toolOutput);
 *       }
 *
 *       // Complete the trace
 *       completeAgentTrace(trace, result, {
 *         duration: Date.now() - startTime,
 *         inputTokens: result.usage?.promptTokens,
 *         outputTokens: result.usage?.completionTokens,
 *         totalTokens: result.usage?.totalTokens,
 *         success: true
 *       });
 *
 *       return result;
 *     } catch (error) {
 *       // Complete trace with error
 *       completeAgentTrace(trace, { error: error.message }, {
 *         duration: Date.now() - startTime,
 *         success: false,
 *         error: error.message
 *       });
 *       throw error;
 *     }
 *   }
 * });
 * ```
 *
 * This will give you detailed traces in Langfuse with:
 * - Agent name and operation type
 * - User context (userId, sessionId)
 * - Model configuration (thinking budget, safety level)
 * - Performance metrics (duration, tokens, cost)
 * - Tool usage tracking
 * - Error handling and success status
 * - Custom metadata and tags
 */
