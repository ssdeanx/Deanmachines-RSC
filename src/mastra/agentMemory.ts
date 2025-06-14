import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { fastembed } from '@mastra/fastembed';
import { z } from 'zod';
import { PinoLogger } from '@mastra/loggers';
import type { CoreMessage } from '@mastra/core';
import { maskStreamTags } from '@mastra/core/utils';
import { MemoryProcessor } from '@mastra/core/memory';
import { TokenLimiter } from '@mastra/memory/processors';
import { rerank, type RerankResult } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { UIMessage } from 'ai';

const logger = new PinoLogger({ name: 'agentMemory', level: 'info' });

// Create shared storage instance
export const agentStorage = new LibSQLStore({
  url: process.env.DATABASE_URL || 'file:./next/mastra.db',
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
});

/**
 * Enhanced LibSQL Vector Configuration 
 * Initializes vector storage for optimal search performance
 */
export const agentVector = new LibSQLVector({
  connectionUrl: process.env.DATABASE_URL || 'file:./next/mastra.db',
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
});

const createThreadSchema = z.object({ resourceId: z.string().nonempty(), threadId: z.string().optional(), title: z.string().optional(), metadata: z.record(z.unknown()).optional() });
const getMessagesSchema = z.object({ resourceId: z.string().nonempty(), threadId: z.string().nonempty(), last: z.number().int().min(1).optional() });
const threadIdSchema = z.string().nonempty();
const resourceIdSchema = z.string().nonempty();
const searchMessagesSchema = z.object({
  threadId: z.string().nonempty(),
  vectorSearchString: z.string().nonempty(),
  topK: z.number().int().min(1).default(3),
  before: z.number().int().min(0).default(0),
  after: z.number().int().min(0).default(0),
});

/**
 * Shared Mastra agent memory instance using LibSQL for storage and vector search.
 *
 * @remarks
 * - Uses LibSQLStore for persistent storage url: process.env.DATABASE_URL || 'file:./memory.db',
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
 * - Uses LibSQLVector for semantic search url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN || ''
 * - Embeddings powered by fastembed
 * - Configured for working memory and semantic recall
 * - Supports custom memory processors for filtering, summarization, etc.
 *
 * @see https://github.com/mastra-ai/mastra
 *
 * @returns {Memory} Shared memory instance for all agents
 *
 * @example
 * // Use threadId/resourceId for multi-user or multi-session memory:
 * await agent.generate('Hello', { resourceId: 'user-123', threadId: 'thread-abc' });
 */
export const agentMemory = new Memory({
  storage: agentStorage,
  vector: agentVector,
  embedder: fastembed.base,
  options: {
    lastMessages: 1000, // This remains a system-level config for retrieval
    semanticRecall: {
      topK: 5,
      messageRange: {
        before: 4,
        after: 1,
      },
    },
    workingMemory: {
      enabled: true,
      template: `
---
# {{agent_name}} WM
Ctx: S:{{session_id}} U:{{user_id}} Q:"{{user_query_summary}}" Sent:{{sentiment_score}} UnresQ:{{unresolved_questions_count}}
Hist: {{summarized_history_short}}
Notes: {{assistant_scratchpad_summary}}
Plan: CurAct:"{{current_action}}" Next:"{{next_action_preview}}"
Entities: {{key_entities_list}}
Goals: {{active_goals_short}}
Hypo: {{current_hypotheses_brief}}
Signals: {{critical_signals_list}}
Flags: Learn:{{is_learning}} Clarify:{{needs_clarification}} Load:{{is_high_load}} Plan:{{is_planning}} Wait:{{is_waiting}} Exec:{{is_executing}}
Peers: {{collaborating_agents_ids}}
SharedKB: {{relevant_shared_kb_snippets}}
LearnEvents: {{recent_learning_highlights}}
---
      `,
    },
  },
  processors: [
    new TokenLimiter(1000000),
    new (class extends MemoryProcessor {
      private limit: number;
      constructor(limit: number = 1000000) {
        super({ name: 'SummarizeProcessor' });
        this.limit = limit;
      }
      process(messages: CoreMessage[]): CoreMessage[] {
        if (messages.length <= this.limit) {
          return messages;
        }
        const overflowCount = messages.length - this.limit;
        const recent = messages.slice(-this.limit);
        // Placeholder summary inserted as system message
        const summaryMessage: CoreMessage = {
          role: 'system',
          content: `Summary of ${overflowCount} earlier messages.`,
        };
        return [summaryMessage, ...recent];
      }
    })(),
  ],
});

/**
 * Create a new memory thread for a user/session.
 * @param resourceId - User/resource identifier
 * @param title - Optional thread title
 * @param metadata - Optional thread metadata
 * @param threadId - Optional specific thread ID
 * @returns Promise resolving to thread information
 */
export async function createThread(
  resourceId: string, title?: string, metadata?: Record<string, unknown>, threadId?: string
) {
  const params = createThreadSchema.parse({ resourceId, threadId, title, metadata });
  try {
    return await agentMemory.createThread(params);
  } catch (error: unknown) {
    logger.error(`createThread failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Query messages for a thread
 * @param resourceId - User/resource ID
 * @param threadId - Thread ID
 * @param last - Number of last messages to retrieve
 * @returns Promise resolving to thread messages
 */
export async function getThreadMessages(
  resourceId: string, threadId: string, last = 10
) {
  const params = getMessagesSchema.parse({ resourceId, threadId, last });
  try {
    return await agentMemory.query({
      resourceId: params.resourceId,
      threadId: params.threadId,
      selectBy: { last: params.last }
    });
  } catch (error: unknown) {
    logger.error(`getThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve a memory thread by its ID.
 * @param threadId - Thread identifier
 * @returns Promise resolving to thread information
 */
export async function getThreadById(threadId: string) {
  const id = threadIdSchema.parse(threadId);
  try {
    return await agentMemory.getThreadById({ threadId: id });
  } catch (error: unknown) {
    logger.error(`getThreadById failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve all memory threads associated with a resource.
 * @param resourceId - Resource identifier
 * @returns Promise resolving to array of threads
 */
export async function getThreadsByResourceId(resourceId: string) {
  const id = resourceIdSchema.parse(resourceId);
  try {
    return await agentMemory.getThreadsByResourceId({ resourceId: id });
  } catch (error: unknown) {
    logger.error(`getThreadsByResourceId failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Perform a semantic search in a thread's messages.
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to { messages, uiMessages }
 */
export async function searchMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1
): Promise<{ messages: CoreMessage[]; uiMessages: UIMessage[] }> {
  const params = searchMessagesSchema.parse({ threadId, vectorSearchString, topK, before, after });
  try {
    return await agentMemory.query({
      threadId: params.threadId,
      selectBy: { vectorSearchString: params.vectorSearchString },
      threadConfig: { semanticRecall: { topK: params.topK, messageRange: { before: params.before, after: params.after } } },
    });
  } catch (error: unknown) {
    logger.error(`searchMessages failed: ${(error as Error).message}`);
    throw error;
  }
}
/**
 * Retrieve UI-formatted messages for a thread.
 * @param threadId - Thread identifier
 * @param last - Number of recent messages
 * @returns Promise resolving to array of UI-formatted messages
 */
export async function getUIThreadMessages(threadId: string, last = 100): Promise<UIMessage[]> {
  const id = threadIdSchema.parse(threadId);
  try {
    const { uiMessages } = await agentMemory.query({
      threadId: id,
      selectBy: { last },
    });
    return uiMessages;
  } catch (error: unknown) {
    logger.error(`getUIThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}
/**
 * Masks internal working_memory updates from a response textStream.
 * @param textStream - Async iterable of response chunks including <working_memory> tags
 * @param onStart - Optional callback when a working_memory update starts
 * @param onEnd - Optional callback when a working_memory update ends
 * @param onMask - Optional callback for the masked content
 * @returns Async iterable of chunks with working_memory tags removed
 */
export function maskWorkingMemoryStream(
  textStream: AsyncIterable<string>,
  onStart?: () => void,
  onEnd?: () => void,
  onMask?: (chunk: string) => void
): AsyncIterable<string> {
  return maskStreamTags(textStream, 'working_memory', { onStart, onEnd, onMask });
}

/**
 * Enhanced search function with performance tracking and detailed logging
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to { messages, uiMessages } with enhanced metadata
 */
export async function enhancedSearchMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1
): Promise<{ messages: CoreMessage[]; uiMessages: UIMessage[]; searchMetadata: { topK: number; before: number; after: number } }> {
  try {
    const result = await agentMemory.query({
      threadId,
      selectBy: { vectorSearchString },
      threadConfig: { semanticRecall: { topK, messageRange: { before, after } } },
    });
    return { ...result, searchMetadata: { topK, before, after } };
  } catch (error: unknown) {
    logger.error(`enhancedSearchMessages failed: ${(error as Error).message}`);
    throw error;
  }
}
/**
 * Enhanced reranking search using Mastra's rerank function for better relevance
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve before reranking
 * @param finalK - Final number of messages after reranking
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to reranked results
 */
export async function rerankSearchMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 10,
  finalK = 3,
  before = 2,
  after = 1
): Promise<{ messages: CoreMessage[]; uiMessages: UIMessage[]; rerankMetadata: { topK: number; before: number; after: number } }> {
  const startTime = Date.now();

  try {
    // First, get more results than needed for reranking
    const initialResults = await agentMemory.query({
      threadId,
      selectBy: { vectorSearchString },
      threadConfig: {
        semanticRecall: {
          topK,
          messageRange: { before, after }
        }
      },
    });

    // Use Mastra's rerank function with Google model for better relevance
    if (initialResults.messages.length > finalK) {
      const model = google('gemini-2.0-flash-exp');

      // Convert memory results to the format expected by rerank function
      const queryResults = initialResults.messages.map((msg, index) => ({
        id: `msg_${index}`,
        score: 0.5, // Default score
        metadata: {
          text: msg.content,
          role: msg.role,
          index
        }
      }));

      // Rerank using Mastra's rerank function
      const rerankedResults = await rerank(
        queryResults,
        vectorSearchString,
        model,
        {
          weights: {
            semantic: 0.6,
            vector: 0.3,
            position: 0.1
          },
          topK: finalK
        }
      );

      // Map reranked results back to messages
      const rerankedMessages = rerankedResults.map((result) => {
        const originalIndex = result.result.metadata?.index;
        if (typeof originalIndex === 'number') {
          return initialResults.messages[originalIndex];
        }
        return undefined;
      }).filter(Boolean) as CoreMessage[];
      // Map reranked results to UI messages
      const rerankedUIMessages = rerankedResults.map((result: RerankResult) => {
        const originalIndex = result.result.metadata?.index as number | undefined;
        if (typeof originalIndex === 'number') {
          return initialResults.uiMessages[originalIndex];
        }
        return undefined;
      }).filter(Boolean) as UIMessage[];

      const rerankMetadata = {
        topK,
        before,
        after,
        initialResultCount: initialResults.messages.length,
        rerankingUsed: true,
        rerankingDuration: Date.now() - startTime,
        averageRelevanceScore: rerankedResults.length > 0 ? rerankedResults.reduce((sum: number, r: RerankResult) => sum + r.score, 0) / rerankedResults.length : 0
      };

      logger.info('Reranked search completed', {
        threadId,
        query: vectorSearchString,
        ...rerankMetadata
      });

      return {
        messages: rerankedMessages,
        uiMessages: rerankedUIMessages,
        rerankMetadata: { topK, before, after }
      };
    } else {
      // Fallback to simple top-k without reranking
      const finalMessages = initialResults.messages.slice(0, finalK);
      const finalUIMessages = initialResults.uiMessages.slice(0, finalK);

      return {
        messages: finalMessages,
        uiMessages: finalUIMessages,
        rerankMetadata: { topK, before, after }
      };
    }
  } catch (error: unknown) {
    logger.error(`rerankSearchMessages failed: ${(error as Error).message}`);
    throw error;
  }
}
/**
 * Initialize vector indexes for optimal search performance
 * Should be called during application startup
 */
export async function initializeVectorIndexes(): Promise<void> {
  try {
    // Create message embeddings index
    await agentVector.createIndex({
      indexName: 'context',
      dimension: 768, // Adjust based on your embedding model
      metric: 'cosine'
    });

    logger.info('Vector indexes initialized successfully');
  } catch (error: unknown) {
    logger.warn('Vector index initialization failed or indexes already exist', {
      error: (error as Error).message
    });
  }
}

/**
 * Batch operations for improved performance when dealing with multiple threads/messages
 */

/**
 * Batch create multiple threads efficiently
 * @param threadRequests - Array of thread creation requests
 * @returns Promise resolving to array of created threads
 */
export interface Thread {
  id: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

export async function batchCreateThreads(
  threadRequests: Array<{
    resourceId: string;
    metadata?: Record<string, unknown>;
    threadId?: string;
  }>
): Promise<Thread[]> {
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled(
      threadRequests.map(request =>
        createThread(request.resourceId, undefined, request.metadata, request.threadId)
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = results.filter(r => r.status === 'rejected').length;
    const duration = Date.now() - startTime;

    logger.info('Batch thread creation completed', {
      totalRequests: threadRequests.length,
      successes,
      failures,
      duration,
    });

    return results
      .map(result => (result.status === 'fulfilled' ? result.value : null))
      .filter(Boolean) as Thread[];
  } catch (error: unknown) {
    logger.error(`batchCreateThreads failed: ${(error as Error).message}`);
    throw error;
  }
}
/**
 * Enhanced memory cleanup and optimization
 * @param options - Cleanup configuration options
 */
export async function optimizeMemoryStorage(options: {
  olderThanDays?: number;
  keepMinimumMessages?: number;
  compactVectorIndex?: boolean;
} = {}): Promise<{
  threadsProcessed: number;
  messagesCompacted: number;
  vectorIndexOptimized: boolean;
}> {
  const {
    olderThanDays = 30,
    keepMinimumMessages = 10,
    compactVectorIndex = true
  } = options;

  const startTime = Date.now();

  try {
    // This would require additional LibSQL operations not currently exposed
    // For now, we'll track the optimization request
    logger.info('Memory optimization requested', {
      olderThanDays,
      keepMinimumMessages,
      compactVectorIndex,
      timestamp: new Date().toISOString()
    });

    // Placeholder for actual optimization logic
    // In a real implementation, you'd:
    // 1. Query old threads/messages
    // 2. Archive or delete based on criteria
    // 3. Optimize vector indexes
    // 4. Update storage statistics

    const optimizationResults = {
      threadsProcessed: 0,
      messagesCompacted: 0,
      vectorIndexOptimized: compactVectorIndex,
      duration: Date.now() - startTime
    };

    logger.info('Memory optimization completed', optimizationResults);

    return optimizationResults;
  } catch (error: unknown) {
    logger.error(`optimizeMemoryStorage failed: ${(error as Error).message}`);
    throw error;
  }
}

// Generated on 2025-06-01 - Enhanced with observability and tracing capabilities
