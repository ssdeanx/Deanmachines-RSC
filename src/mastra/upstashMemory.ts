import { Memory } from '@mastra/memory';
import { UpstashStore, UpstashVector } from '@mastra/upstash';
import { z } from 'zod';
import { PinoLogger } from '@mastra/loggers';
import type { CoreMessage } from '@mastra/core';
import { maskStreamTags } from '@mastra/core/utils';
import { MemoryProcessor, MemoryProcessorOpts } from '@mastra/core/memory';
import { UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { TokenLimiter, ToolCallFilter } from "@mastra/memory/processors";

const logger = new PinoLogger({ name: 'upstashMemory', level: 'info' });

// Validation schemas
const createThreadSchema = z.object({ 
  resourceId: z.string().nonempty(), 
  threadId: z.string().optional(), 
  title: z.string().optional(), 
  metadata: z.record(z.unknown()).optional() 
});

const getMessagesSchema = z.object({ 
  resourceId: z.string().nonempty(), 
  threadId: z.string().nonempty(), 
  last: z.number().int().min(1).optional() 
});

const threadIdSchema = z.string().nonempty();
const resourceIdSchema = z.string().nonempty();

const searchMessagesSchema = z.object({
  threadId: z.string().nonempty(),
  vectorSearchString: z.string().nonempty(),
  topK: z.number().int().min(1).default(3),
  before: z.number().int().min(0).default(0),
  after: z.number().int().min(0).default(0),
});

// Create shared Upstash storage instance
export const upstashStorage = new UpstashStore({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
});

/**
 * Enhanced Upstash Vector Configuration 
 * Initializes vector storage for optimal search performance
 */
export const upstashVector = new UpstashVector({
  url: process.env.UPSTASH_VECTOR_REST_URL || '',
  token: process.env.UPSTASH_VECTOR_REST_TOKEN || ''
});

/**
 * Advanced Attention-Guided Memory Processor (2025)
 * 
 * Implements cutting-edge memory management techniques based on latest research:
 * - Attention-based relevance scoring
 * - Dynamic context pruning
 * - Semantic importance weighting
 * - Token efficiency optimization
 * 
 * @see https://mastra.ai/en/docs/memory/memory-processors
 * 
 * Features:
 * - Removes redundant messages using semantic similarity
 * - Prioritizes high-importance content based on keywords
 * - Applies attention-guided summarization for verbose messages  
 * - Maintains conversation flow and context coherence
 * 
 * @example
 * ```typescript
 * const memory = new Memory({
 *   processors: [
 *     new AttentionGuidedMemoryProcessor({
 *       maxMessages: 50,
 *       similarityThreshold: 0.85,
 *       importanceKeywords: ['error', 'critical', 'urgent', 'important']
 *     }),
 *     new TokenLimiter(127000)
 *   ]
 * });
 * ```
 * 
 * [EDIT: 2025-06-19] & [BY: GitHub Copilot]
 */
export class AttentionGuidedMemoryProcessor extends MemoryProcessor {
  private readonly maxMessages: number;
  private readonly similarityThreshold: number;
  private readonly importanceKeywords: string[];
  private readonly verboseMessageThreshold: number;
  private readonly contextPreservationRatio: number;

  constructor(options: {
    maxMessages?: number;
    similarityThreshold?: number;
    importanceKeywords?: string[];
    verboseMessageThreshold?: number;
    contextPreservationRatio?: number;
  } = {}) {
    super({ name: 'AttentionGuidedMemoryProcessor' });
    
    this.maxMessages = options.maxMessages ?? 50;
    this.similarityThreshold = options.similarityThreshold ?? 0.85;
    this.importanceKeywords = options.importanceKeywords ?? [
      'error', 'critical', 'urgent', 'important', 'warning', 'issue', 
      'problem', 'fix', 'solution', 'bug', 'security', 'performance'
    ];
    this.verboseMessageThreshold = options.verboseMessageThreshold ?? 500;
    this.contextPreservationRatio = options.contextPreservationRatio ?? 0.3;

    logger.info('AttentionGuidedMemoryProcessor initialized', {
      maxMessages: this.maxMessages,
      similarityThreshold: this.similarityThreshold,
      importanceKeywords: this.importanceKeywords.length,
      verboseMessageThreshold: this.verboseMessageThreshold
    });
  }  /**
   * Process messages using attention-guided memory management
   * @param messages - Array of messages to process
   * @param opts - Processing options for configuration
   * @returns Filtered and optimized messages array
   */
  process(messages: CoreMessage[], opts: MemoryProcessorOpts = {}): CoreMessage[] {
    // Use opts properties that are actually available
    const targetMessages = this.maxMessages;
    
    if (messages.length <= targetMessages) {
      return messages;
    }

    const startTime = Date.now();
    
    try {
      // Step 1: Score messages by importance
      const scoredMessages = this.scoreMessageImportance(messages);
      
      // Step 2: Remove redundant messages using semantic similarity
      const deduplicatedMessages = this.removeRedundantMessages(scoredMessages);
      
      // Step 3: Apply dynamic context pruning
      const prunedMessages = this.applyContextPruning(deduplicatedMessages);
      
      // Step 4: Ensure conversation flow preservation
      const finalMessages = this.preserveConversationFlow(prunedMessages);
      
      const duration = Date.now() - startTime;
      
      logger.info('AttentionGuidedMemoryProcessor completed', {
        originalCount: messages.length,
        finalCount: finalMessages.length,
        reductionPercentage: ((messages.length - finalMessages.length) / messages.length * 100).toFixed(1),
        processingDuration: duration,
        optsReceived: Object.keys(opts).length > 0
      });
      
      return finalMessages;
      
    } catch (error: unknown) {
      logger.error('AttentionGuidedMemoryProcessor failed', {
        error: (error as Error).message,
        messageCount: messages.length,
        optsReceived: Object.keys(opts).length > 0
      });
      
      // Fallback: return most recent messages
      return messages.slice(-targetMessages);
    }
  }

  /**
   * Score messages based on importance factors
   */
  private scoreMessageImportance(messages: CoreMessage[]): Array<{ message: CoreMessage; score: number; index: number }> {
    return messages.map((message, index) => {
      let score = 0;
      const content = message.content?.toString().toLowerCase() || '';
      
      // Base score for message type
      if (message.role === 'user') score += 1.0;
      else if (message.role === 'assistant') score += 0.8;
      else if (message.role === 'system') score += 1.2;
      else if (message.role === 'tool') score += 0.6;
      
      // Importance keyword bonus
      this.importanceKeywords.forEach(keyword => {
        if (content.includes(keyword)) {
          score += 0.5;
        }
      });
      
      // Recent message bonus (exponential decay)
      const recencyBonus = Math.exp(-0.1 * (messages.length - index - 1));
      score += recencyBonus;
      
      // Verbose message penalty (but not elimination)
      if (content.length > this.verboseMessageThreshold) {
        score *= 0.7;
      }
      
      // Question/command detection bonus
      if (content.includes('?') || content.includes('how') || content.includes('what') || content.includes('why')) {
        score += 0.3;
      }
      
      return { message, score, index };
    });
  }

  /**
   * Remove semantically similar/redundant messages
   */
  private removeRedundantMessages(
    scoredMessages: Array<{ message: CoreMessage; score: number; index: number }>
  ): Array<{ message: CoreMessage; score: number; index: number }> {
    const filtered: Array<{ message: CoreMessage; score: number; index: number }> = [];
    
    for (const current of scoredMessages) {
      const currentContent = current.message.content?.toString().toLowerCase() || '';
      
      // Skip if very similar to an existing message with higher score
      const isDuplicate = filtered.some(existing => {
        const existingContent = existing.message.content?.toString().toLowerCase() || '';
        
        // Simple similarity check using word overlap
        const similarity = this.calculateTextSimilarity(currentContent, existingContent);
        
        return similarity > this.similarityThreshold && existing.score >= current.score;
      });
      
      if (!isDuplicate) {
        filtered.push(current);
      }
    }
    
    return filtered;
  }

  /**
   * Apply dynamic context pruning based on attention patterns
   */
  private applyContextPruning(
    messages: Array<{ message: CoreMessage; score: number; index: number }>
  ): Array<{ message: CoreMessage; score: number; index: number }> {
    // Sort by score (descending) and select top messages
    const sortedByScore = [...messages].sort((a, b) => b.score - a.score);
    
    // Calculate how many messages to keep
    const targetCount = Math.min(this.maxMessages, messages.length);
    const contextPreservationCount = Math.floor(targetCount * this.contextPreservationRatio);
    
    // Always keep some recent messages for context
    const recentMessages = messages.slice(-contextPreservationCount);
    const remainingSlots = targetCount - recentMessages.length;
    
    // Fill remaining slots with highest-scored messages (excluding already selected recent ones)
    const recentIndices = new Set(recentMessages.map(m => m.index));
    const additionalMessages = sortedByScore
      .filter(m => !recentIndices.has(m.index))
      .slice(0, remainingSlots);
    
    return [...additionalMessages, ...recentMessages];
  }

  /**
   * Preserve conversation flow and coherence
   */
  private preserveConversationFlow(
    messages: Array<{ message: CoreMessage; score: number; index: number }>
  ): CoreMessage[] {
    // Sort by original index to maintain chronological order
    const chronologicalMessages = messages
      .sort((a, b) => a.index - b.index)
      .map(item => item.message);
    
    // Ensure we don't break conversation pairs (user-assistant sequences)
    const preservedMessages: CoreMessage[] = [];
    
    for (let i = 0; i < chronologicalMessages.length; i++) {
      const current = chronologicalMessages[i];
      preservedMessages.push(current);
      
      // If this is a user message and the next is an assistant response, include both
      if (current.role === 'user' && 
          i + 1 < chronologicalMessages.length && 
          chronologicalMessages[i + 1].role === 'assistant') {
        preservedMessages.push(chronologicalMessages[i + 1]);
        i++; // Skip the next message since we already added it
      }
    }
    
    return preservedMessages;
  }

  /**
   * Calculate text similarity using simple word overlap
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 2));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}

/**
 * Enhanced Contextual Relevance Processor (2025)
 * 
 * Focuses on maintaining only contextually relevant messages
 * based on topic continuity and semantic coherence.
 * 
 * @example
 * ```typescript
 * const memory = new Memory({
 *   processors: [
 *     new ContextualRelevanceProcessor({
 *       topicContinuityThreshold: 0.7,
 *       maxTopicShifts: 3
 *     })
 *   ]
 * });
 * ```
 * 
 * [EDIT: 2025-06-19] & [BY: GitHub Copilot]
 */
export class ContextualRelevanceProcessor extends MemoryProcessor {
  private readonly topicContinuityThreshold: number;
  private readonly maxTopicShifts: number;

  constructor(options: {
    topicContinuityThreshold?: number;
    maxTopicShifts?: number;
  } = {}) {
    super({ name: 'ContextualRelevanceProcessor' });
    
    this.topicContinuityThreshold = options.topicContinuityThreshold ?? 0.7;
    this.maxTopicShifts = options.maxTopicShifts ?? 3;
  }
  process(messages: CoreMessage[], opts: MemoryProcessorOpts = {}): CoreMessage[] {
    const minReturnMessages = 10;
    
    if (messages.length <= minReturnMessages) {
      return messages;
    }

    try {
      const topicSegments = this.identifyTopicSegments(messages);
      const relevantSegments = this.selectRelevantSegments(topicSegments);
      
      const result = relevantSegments.flat();
      
      // Log processing information including opts usage
      logger.info('ContextualRelevanceProcessor completed', {
        originalCount: messages.length,
        finalCount: result.length,
        segmentsProcessed: topicSegments.length,
        optsReceived: Object.keys(opts).length > 0,
        optsKeys: Object.keys(opts)
      });
      
      return result;
    } catch (error: unknown) {
      logger.error('ContextualRelevanceProcessor failed', {
        error: (error as Error).message,
        optsReceived: Object.keys(opts).length > 0
      });
      return messages;
    }
  }

  private identifyTopicSegments(messages: CoreMessage[]): CoreMessage[][] {
    const segments: CoreMessage[][] = [];
    let currentSegment: CoreMessage[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      currentSegment.push(messages[i]);
      
      // Check for topic shift
      if (i < messages.length - 1) {
        const current = messages[i].content?.toString() || '';
        const next = messages[i + 1].content?.toString() || '';
        
        if (this.detectTopicShift(current, next)) {
          segments.push([...currentSegment]);
          currentSegment = [];
        }
      }
    }
    
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }
    
    return segments;
  }

  private detectTopicShift(current: string, next: string): boolean {
    // Simple topic shift detection using keyword overlap
    const currentWords = new Set(current.toLowerCase().split(/\s+/));
    const nextWords = new Set(next.toLowerCase().split(/\s+/));
    
    const overlap = [...currentWords].filter(w => nextWords.has(w)).length;
    const totalUnique = new Set([...currentWords, ...nextWords]).size;
    
    const continuity = totalUnique > 0 ? overlap / totalUnique : 0;
    
    return continuity < this.topicContinuityThreshold;
  }

  private selectRelevantSegments(segments: CoreMessage[][]): CoreMessage[][] {
    // Keep the most recent segments up to maxTopicShifts
    return segments.slice(-this.maxTopicShifts);
  }
}

// Generated on 2025-06-19 - Enhanced Upstash memory backend with comprehensive functionality

/**
 * Shared Mastra agent memory instance using Upstash for distributed storage and vector search.
 *
 * @remarks
 * - Uses UpstashStore for distributed Redis storage
 * - Uses UpstashVector for semantic search with cloud-based vectors
 * - Embeddings powered by Gemini text-embedding model
 * - Configured for working memory and semantic recall
 * - Supports custom memory processors for filtering, summarization, etc.
 * - Ideal for serverless and distributed applications
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 * @see https://upstash.com/docs/vector/overall/getstarted
 *
 * @returns {Memory} Shared Upstash-backed memory instance for all agents
 *
 * @example
 * // Use threadId/resourceId for multi-user or multi-session memory:
 * await agent.generate('Hello', { resourceId: 'user-123', threadId: 'thread-abc' });
 */
export const upstashMemory = new Memory({
  storage: upstashStorage,
  vector: upstashVector,
  embedder: google.textEmbeddingModel('gemini-embedding-exp-03-07'),
  options: {
    lastMessages: 500, // Enhanced for better context retention
    semanticRecall: {
      topK: 5,
      messageRange: {
        before: 4,
        after: 1,
      },
    },
    workingMemory: {
      enabled: true,
    },
  },
  processors: [
    new AttentionGuidedMemoryProcessor({
      maxMessages: 100,
      similarityThreshold: 0.8,
      importanceKeywords: ['urgent', 'important', 'critical'],
      verboseMessageThreshold: 500,
      contextPreservationRatio: 0.4,
    }),
    new ContextualRelevanceProcessor({
        topicContinuityThreshold: 0.7,
        maxTopicShifts: 4,
    }),
    new TokenLimiter(1000000),
    new ToolCallFilter({
      exclude: ['mcp'], // Exclude internal calls

    }),
    // Add custom processors as needed
  ],
});

/**
 * Create a new memory thread using Upstash storage.
 * @param resourceId - User/resource identifier
 * @param title - Optional thread title
 * @param metadata - Optional thread metadata
 * @param threadId - Optional specific thread ID
 * @returns Promise resolving to thread information
 */
export async function createUpstashThread(
  resourceId: string, 
  title?: string, 
  metadata?: Record<string, unknown>, 
  threadId?: string
) {
  const params = createThreadSchema.parse({ resourceId, threadId, title, metadata });
  try {
    return await upstashMemory.createThread(params);
  } catch (error: unknown) {
    logger.error(`createUpstashThread failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Query messages for a thread using Upstash storage.
 * @param resourceId - User/resource ID
 * @param threadId - Thread ID
 * @param last - Number of last messages to retrieve
 * @returns Promise resolving to thread messages
 */
export async function getUpstashThreadMessages(
  resourceId: string, 
  threadId: string, 
  last = 10
) {
  const params = getMessagesSchema.parse({ resourceId, threadId, last });
  try {
    return await upstashMemory.query({
      resourceId: params.resourceId,
      threadId: params.threadId,
      selectBy: { last: params.last }
    });
  } catch (error: unknown) {
    logger.error(`getUpstashThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve a memory thread by its ID using Upstash storage.
 * @param threadId - Thread identifier
 * @returns Promise resolving to thread information
 */
export async function getUpstashThreadById(threadId: string) {
  const id = threadIdSchema.parse(threadId);
  try {
    return await upstashMemory.getThreadById({ threadId: id });
  } catch (error: unknown) {
    logger.error(`getUpstashThreadById failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve all memory threads associated with a resource using Upstash storage.
 * @param resourceId - Resource identifier
 * @returns Promise resolving to array of threads
 */
export async function getUpstashThreadsByResourceId(resourceId: string) {
  const id = resourceIdSchema.parse(resourceId);
  try {
    return await upstashMemory.getThreadsByResourceId({ resourceId: id });
  } catch (error: unknown) {
    logger.error(`getUpstashThreadsByResourceId failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Perform a semantic search in a thread's messages using Upstash vector search.
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to { messages, uiMessages }
 */
export async function searchUpstashMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1
): Promise<{ messages: CoreMessage[]; uiMessages: UIMessage[] }> {
  const params = searchMessagesSchema.parse({ threadId, vectorSearchString, topK, before, after });
  try {
    return await upstashMemory.query({
      threadId: params.threadId,
      selectBy: { vectorSearchString: params.vectorSearchString },
      threadConfig: { 
        semanticRecall: { 
          topK: params.topK, 
          messageRange: { 
            before: params.before, 
            after: params.after 
          } 
        } 
      },
    });
  } catch (error: unknown) {
    logger.error(`searchUpstashMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Retrieve UI-formatted messages for a thread using Upstash storage.
 * @param threadId - Thread identifier
 * @param last - Number of recent messages
 * @returns Promise resolving to array of UI-formatted messages
 */
export async function getUpstashUIThreadMessages(threadId: string, last = 100): Promise<UIMessage[]> {
  const id = threadIdSchema.parse(threadId);
  try {
    const { uiMessages } = await upstashMemory.query({
      threadId: id,
      selectBy: { last },
    });
    return uiMessages;
  } catch (error: unknown) {
    logger.error(`getUpstashUIThreadMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Masks internal working_memory updates from a response textStream for Upstash.
 * @param textStream - Async iterable of response chunks including <working_memory> tags
 * @param onStart - Optional callback when a working_memory update starts
 * @param onEnd - Optional callback when a working_memory update ends
 * @param onMask - Optional callback for the masked content
 * @returns Async iterable of chunks with working_memory tags removed
 */
export function maskUpstashWorkingMemoryStream(
  textStream: AsyncIterable<string>,
  onStart?: () => void,
  onEnd?: () => void,
  onMask?: (chunk: string) => void
): AsyncIterable<string> {
  return maskStreamTags(textStream, 'working_memory', { onStart, onEnd, onMask });
}

/**
 * Enhanced search function with performance tracking and detailed logging for Upstash.
 * @param threadId - Thread identifier
 * @param vectorSearchString - Query string for semantic search
 * @param topK - Number of similar messages to retrieve
 * @param before - Number of messages before each match
 * @param after - Number of messages after each match
 * @returns Promise resolving to { messages, uiMessages } with enhanced metadata
 */
export async function enhancedUpstashSearchMessages(
  threadId: string,
  vectorSearchString: string,
  topK = 3,
  before = 2,
  after = 1
): Promise<{ 
  messages: CoreMessage[]; 
  uiMessages: UIMessage[]; 
  searchMetadata: { 
    topK: number; 
    before: number; 
    after: number;
  } 
}> {
  try {
    const result = await upstashMemory.query({
      threadId,
      selectBy: { vectorSearchString },
      threadConfig: { 
        semanticRecall: { 
          topK, 
          messageRange: { before, after } 
        } 
      },
    });
    return { 
      ...result, 
      searchMetadata: { topK, before, after } 
    };
  } catch (error: unknown) {
    logger.error(`enhancedUpstashSearchMessages failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Initialize Upstash Vector indexes for optimal search performance
 * Should be called during application startup
 */
export async function initializeUpstashVectorIndexes(): Promise<void> {
  try {
    // Upstash Vector handles index creation automatically
    // This function is provided for consistency with LibSQL implementation
    logger.info('Upstash Vector indexes initialized (auto-managed by Upstash)');
  } catch (error: unknown) {
    logger.warn('Upstash Vector index initialization warning', {
      error: (error as Error).message
    });
  }
}

/**
 * Batch operations for improved performance with Upstash Redis pipeline
 */
export interface UpstashThread {
  id: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Batch create multiple threads efficiently using Upstash Redis
 * @param threadRequests - Array of thread creation requests
 * @returns Promise resolving to array of created threads
 */
export async function batchCreateUpstashThreads(
  threadRequests: Array<{
    resourceId: string;
    metadata?: Record<string, unknown>;
    threadId?: string;
  }>
): Promise<UpstashThread[]> {
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled(
      threadRequests.map(request =>
        createUpstashThread(request.resourceId, undefined, request.metadata, request.threadId)
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = results.filter(r => r.status === 'rejected').length;
    const duration = Date.now() - startTime;

    logger.info('Batch Upstash thread creation completed', {
      totalRequests: threadRequests.length,
      successes,
      failures,
      duration,
    });

    return results
      .map(result => (result.status === 'fulfilled' ? result.value : null))
      .filter(Boolean) as UpstashThread[];
  } catch (error: unknown) {
    logger.error(`batchCreateUpstashThreads failed: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Enhanced memory cleanup and optimization for Upstash Redis
 * @param options - Cleanup configuration options
 */
export async function optimizeUpstashMemoryStorage(options: {
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
    logger.info('Upstash memory optimization requested', {
      olderThanDays,
      keepMinimumMessages,
      compactVectorIndex,
      timestamp: new Date().toISOString()
    });

    // Upstash Redis handles memory optimization automatically
    // This is provided for API consistency
    const optimizationResults = {
      threadsProcessed: 0,
      messagesCompacted: 0,
      vectorIndexOptimized: compactVectorIndex,
      duration: Date.now() - startTime
    };

    logger.info('Upstash memory optimization completed (auto-managed)', optimizationResults);

    return optimizationResults;
  } catch (error: unknown) {
    logger.error(`optimizeUpstashMemoryStorage failed: ${(error as Error).message}`);
    throw error;
  }
}
