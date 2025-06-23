/**
 * Vector Query Tools for Dean Machines RSC
 *
 * This module provides tools for querying vector stores with semantic search,
 * hybrid filtering, and metadata search. It includes a basic vector query tool,
 * an enhanced tool that integrates with agent memory, and a hybrid search tool
 * that combines semantic and metadata filtering.
 *
 * Key Features:
 * - Semantic search using embeddings
 * - Hybrid filtering based on metadata
 * - Integration with agent memory for context-aware search
 * - Runtime context support for personalized search preferences
 * - Comprehensive validation and error handling
 *
 * @author SSD
 * @date 2025-06-21
 * @version 1.0.1
 *
 * [EDIT: 2025-06-18] [BY: SSD]
 */
import { createVectorQueryTool } from "@mastra/rag";
import { createTool, ToolExecutionContext } from '@mastra/core/tools';
import { RuntimeContext } from '@mastra/core/di';
import { z } from 'zod';
import {
  searchUpstashMessages,
  queryVectors,
  VECTOR_CONFIG,
  type VectorQueryResult,
  type MetadataFilter
} from '../upstashMemory';
import type { UIMessage, CoreMessage } from 'ai';
import { PinoLogger } from '@mastra/loggers';
import { embedMany } from 'ai';
import { fastembed } from '@mastra/fastembed';

// Define runtime context type for vector query tools
export type VectorQueryRuntimeContext = {
  'user-id': string;
  'session-id': string;
  'search-preference': 'semantic' | 'hybrid' | 'metadata';
  'language': string;
  'quality-threshold': number;
  'debug'?: boolean;
  'max-results'?: number;
  'include-metadata'?: boolean;
};

const logger = new PinoLogger({ name: 'VectorQueryTool', level: 'info' });

// Enhanced schemas based on Mastra documentation patterns
const vectorQueryInputSchema = z.object({
  query: z.string().min(1).describe('The query to search for in the vector store'),
  threadId: z.string().optional().describe('Optional thread ID to search within a specific conversation thread'),
  topK: z.number().int().positive().default(5).describe('Number of most similar results to return'),
  minScore: z.number().min(0).max(1).default(0.0).describe('Minimum similarity score threshold'),
  before: z.number().int().min(0).default(2).describe('Number of messages before each match to include for context'),
  after: z.number().int().min(0).default(1).describe('Number of messages after each match to include for context'),
  includeMetadata: z.boolean().default(true).describe('Whether to include metadata in results'),
  enableFilter: z.boolean().default(false).describe('Enable filtering based on metadata'),
  filter: z.record(z.any()).optional().describe('Optional metadata filter using Upstash-compatible MongoDB/Sift query syntax. Supports: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $and, $or, $not, $nor, $exists, $contains, $regex. Field keys limited to 512 chars, no null values.'),
}).strict();

const vectorQueryResultSchema = z.object({
  id: z.string().describe('Unique identifier for the result'),
  content: z.string().describe('The text content of the chunk'),
  score: z.number().describe('Similarity score (0-1)'),
  metadata: z.record(z.any()).optional().describe('Associated metadata'),
  threadId: z.string().optional().describe('Thread ID if applicable'),
});

const vectorQueryOutputSchema = z.object({
  relevantContext: z.string().describe('Combined text from the most relevant chunks'),
  results: z.array(vectorQueryResultSchema).describe('Array of search results with similarity scores'),
  totalResults: z.number().int().min(0).describe('Total number of results found'),
  processingTime: z.number().min(0).describe('Time taken to process the query in milliseconds'),
  queryEmbedding: z.array(z.number()).optional().describe('The embedding vector of the query'),
}).strict();

// Basic vector query tool using Mastra's createVectorQueryTool for compatibility with Upstash
export const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "upstashVector",
  indexName: VECTOR_CONFIG.DEFAULT_INDEX_NAME,
  model: fastembed,
  enableFilter: true,
  description: "Search for semantically similar content in the Upstash vector store using embeddings with sparse cosine similarity. Supports filtering, ranking, and context retrieval."
});

// Enhanced vector query tool that integrates with UpstashMemory
export const enhancedVectorQueryTool = createTool({
  id: 'vector_query',
  description: 'Advanced vector search with hybrid filtering, metadata search, and agent memory integration',
  inputSchema: vectorQueryInputSchema,
  outputSchema: vectorQueryOutputSchema,
  execute: async ({ input, runtimeContext }: ToolExecutionContext<typeof vectorQueryInputSchema> & {
    input: z.infer<typeof vectorQueryInputSchema>;
    runtimeContext?: RuntimeContext<VectorQueryRuntimeContext>;
  }): Promise<z.infer<typeof vectorQueryOutputSchema>> => {
    const startTime = Date.now();
    try {
      // Validate input
      const validatedInput = vectorQueryInputSchema.parse(input);        // Get runtime context values for personalization
      const userId = runtimeContext?.get('user-id') || 'anonymous';
      const sessionId = runtimeContext?.get('session-id') || 'default';
      const searchPreference = runtimeContext?.get('search-preference') || 'semantic';
      const qualityThreshold = Number(runtimeContext?.get('quality-threshold')) || validatedInput.minScore;
      const debug = runtimeContext?.get('debug') || false;
      if (debug) {
        logger.info('Vector query input validated', {
          query: validatedInput.query,
          userId,
          sessionId,
          searchPreference,
          qualityThreshold: Number(qualityThreshold)
        });
      }

      const results: z.infer<typeof vectorQueryResultSchema>[] = [];
      let relevantContext = '';

      // If threadId is provided, use Upstash memory search
      if (validatedInput.threadId) {
        logger.info('Searching within thread using Upstash memory', { threadId: validatedInput.threadId });

        const memoryResults = await searchUpstashMessages(
          validatedInput.threadId,
          validatedInput.query,
          validatedInput.topK,
          validatedInput.before,
          validatedInput.after,
          validatedInput.enableFilter ? (validatedInput.filter as MetadataFilter) : undefined
        );

        // Transform memory results to match our schema - use both CoreMessage and UIMessage data
        memoryResults.messages.forEach((message: CoreMessage, index: number) => {
          results.push({
            id: `msg-${index}`,
            content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
            score: 1.0 - (index * 0.1), // Simulate decreasing relevance
            metadata: {
              role: message.role,
              threadId: validatedInput.threadId,
              timestamp: new Date().toISOString(),
              userId,
              sessionId,
              messageType: 'core'
            },
            threadId: validatedInput.threadId,
          });
        });

        // Also include UIMessage data for enhanced context
        memoryResults.uiMessages.forEach((uiMessage: UIMessage, index: number) => {
          results.push({
            id: `ui-msg-${index}`,
            content: typeof uiMessage.content === 'string' ? uiMessage.content : JSON.stringify(uiMessage.content),
            score: 1.0 - (index * 0.1), // Simulate decreasing relevance
            metadata: {
              role: uiMessage.role,
              threadId: validatedInput.threadId,
              timestamp: new Date().toISOString(),
              userId,
              sessionId,
              messageType: 'ui',
              uiMessageId: uiMessage.id
            },
            threadId: validatedInput.threadId,
          });
        });

        relevantContext = results.map(r => r.content).join('\n\n');
        
      } else {
        // Use direct Upstash vector store search with sparse cosine similarity
        logger.info('Performing direct Upstash vector store search');

        // Create query embedding using Google's embedding model (384 dimensions for fastembed compatibility)
        const { embeddings } = await embedMany({
          model: fastembed,
          values: [validatedInput.query]
        });

        const queryEmbedding = embeddings[0];

        // Query the Upstash vector store directly with sparse cosine similarity
        const vectorResults = await queryVectors(
          VECTOR_CONFIG.DEFAULT_INDEX_NAME,
          queryEmbedding,
          validatedInput.topK,
          validatedInput.enableFilter ? (validatedInput.filter as MetadataFilter) : undefined,
          false // Don't include vectors in response for performance
        );

        // Transform vector results to match our schema with runtime context
        vectorResults.forEach((result: VectorQueryResult, index: number) => {
          const content = String(result.metadata?.text || result.metadata?.content || '');
          const score = result.score || 0;

          if (score >= qualityThreshold) {
            results.push({
              id: result.id || `vec-${index}`,
              content,
              score,
              metadata: validatedInput.includeMetadata ? {
                ...result.metadata,
                userId,
                sessionId,
                searchPreference
              } : undefined,
            });
          }
        });

        relevantContext = results.map(r => r.content).join('\n\n');
      }

      const processingTime = Date.now() - startTime;

      const output = {
        relevantContext,
        results,
        totalResults: results.length,
        processingTime,
        queryEmbedding: undefined, // Don't include embeddings by default for performance
      };

      logger.info('Vector query completed successfully', {
        totalResults: output.totalResults,
        processingTime: output.processingTime,
        threadId: validatedInput.threadId,
        userId,
        sessionId
      });

      return vectorQueryOutputSchema.parse(output);

    } catch (error) {
      logger.error('Vector query failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(`Vector query failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
});

// Type for hybrid result to ensure type safety
type HybridVectorResult = {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
  threadId?: string;
};

// Hybrid scoring type
const hybridScoreSchema = z.object({
  semanticScore: z.number().describe('Pure semantic similarity score'),
  metadataScore: z.number().describe('Metadata matching score'),
  combinedScore: z.number().describe('Weighted combination of both scores'),
});

// Hybrid vector search tool that combines semantic and metadata filtering
export const hybridVectorSearchTool = createTool({
  id: 'hybrid_vector_query',
  description: 'Hybrid search combining vector similarity with metadata filtering for precise results',
  inputSchema: vectorQueryInputSchema.extend({
    metadataQuery: z.record(z.any()).optional().describe('Specific metadata query parameters'),
    semanticWeight: z.number().min(0).max(1).default(0.7).describe('Weight for semantic similarity (0-1)'),
    metadataWeight: z.number().min(0).max(1).default(0.3).describe('Weight for metadata matching (0-1)'),
  }),
  outputSchema: vectorQueryOutputSchema.extend({
    hybridScores: z.array(hybridScoreSchema).describe('Breakdown of hybrid scoring'),
  }),  execute: async ({ context, runtimeContext }: {
    context: z.infer<typeof vectorQueryInputSchema> & {
      metadataQuery?: Record<string, unknown>;
      semanticWeight?: number;
      metadataWeight?: number;
    };
    runtimeContext?: RuntimeContext<VectorQueryRuntimeContext>
  }) => {
    const startTime = Date.now();
    try {
      const extendedSchema = vectorQueryInputSchema.extend({
        metadataQuery: z.record(z.any()).optional(),
        semanticWeight: z.number().min(0).max(1).default(0.7),
        metadataWeight: z.number().min(0).max(1).default(0.3),
      });
      const validatedInput = extendedSchema.parse(context);
      // Get runtime context values
      const userId = runtimeContext?.get('user-id') || 'anonymous';
      const sessionId = runtimeContext?.get('session-id') || 'default';
      const searchPreference = runtimeContext?.get('search-preference') || 'hybrid';
      logger.info('Hybrid vector search initiated', { 
        query: validatedInput.query,
        semanticWeight: validatedInput.semanticWeight,
        metadataWeight: validatedInput.metadataWeight,
        userId,
        sessionId,
        searchPreference      });      // Use enhanced vector query instead of the basic one for consistency
      logger.info('Using enhanced vector query for semantic search');      const basicResults = await enhancedVectorQueryTool.execute({
        input: {
          query: validatedInput.query,
          topK: validatedInput.topK,
          minScore: validatedInput.minScore,
          before: 2,
          after: 1,
          includeMetadata: true,
          enableFilter: validatedInput.enableFilter || false,
          filter: validatedInput.filter
        },
        context: {
          query: validatedInput.query,
          topK: validatedInput.topK,
          minScore: validatedInput.minScore,
          before: 2,
          after: 1,
          includeMetadata: true,
          enableFilter: validatedInput.enableFilter || false,
          filter: validatedInput.filter
        },
        runtimeContext: runtimeContext || new RuntimeContext<VectorQueryRuntimeContext>()
      });
      // Transform basic results to match our hybrid scoring format
      const semanticResults = {
        relevantContext: basicResults.relevantContext || '',
        results: basicResults.results.map((r: {id: string; content: string; score: number; metadata?: Record<string, unknown>}): HybridVectorResult => ({
          id: r.id,
          content: r.content,
          score: r.score,
          metadata: r.metadata,
        })),
        totalResults: basicResults.totalResults,
        processingTime: 0,
      };

      // Apply hybrid scoring if metadata query is provided
      const hybridScores: z.infer<typeof hybridScoreSchema>[] = [];
      if (validatedInput.metadataQuery) {
        semanticResults.results.forEach((result: HybridVectorResult) => {
          const semanticScore = result.score;
          // Simple metadata matching score (can be enhanced)
          let metadataScore = 0;
          if (result.metadata && validatedInput.metadataQuery) {
            const matchingKeys = Object.keys(validatedInput.metadataQuery).filter(key => 
              result.metadata?.[key] === validatedInput.metadataQuery![key]
            );
            metadataScore = matchingKeys.length / Object.keys(validatedInput.metadataQuery).length;
          }

          const combinedScore = (semanticScore * validatedInput.semanticWeight!) + 
                               (metadataScore * validatedInput.metadataWeight!);

          hybridScores.push({
            semanticScore,
            metadataScore,
            combinedScore,
          });
        });

        // Re-sort results by combined score
        const resultsWithScores = semanticResults.results.map((result: HybridVectorResult, index: number) => ({
          ...result,
          score: hybridScores[index].combinedScore,
          metadata: {
            ...result.metadata,
            userId,
            sessionId,
            searchPreference
          }
        }));

        resultsWithScores.sort((a: HybridVectorResult, b: HybridVectorResult) => b.score - a.score);
        semanticResults.results = resultsWithScores;
      }

      const processingTime = Date.now() - startTime;

      const output = {
        ...semanticResults,
        processingTime,
        hybridScores,
      };

      logger.info('Hybrid vector search completed', {
        totalResults: output.totalResults,
        processingTime,
        hasMetadataQuery: !!validatedInput.metadataQuery,
        userId,
        sessionId
      });

      return output;

    } catch (error) {
      logger.error('Hybrid vector search failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(`Hybrid vector search failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
});

/**
 * Runtime context for vector query tools to enable dynamic configuration
 * This allows CopilotKit frontend to configure tool behavior via headers
 * 
 * @example
 * ```typescript
 * // In CopilotKit agent registration:
 * setContext: (c, runtimeContext) => {
 *   runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
 *   runtimeContext.set("session-id", c.req.header("X-Session-ID") || "default");
 *   runtimeContext.set("search-preference", c.req.header("X-Search-Preference") || "semantic");
 *   runtimeContext.set("language", c.req.header("X-Language") || "en");
 *   runtimeContext.set("quality-threshold", parseFloat(c.req.header("X-Quality-Threshold") || "0.5"));
 * }
 * ```
 */
export const vectorQueryRuntimeContext = new RuntimeContext<VectorQueryRuntimeContext>();

// Set default runtime context values
vectorQueryRuntimeContext.set("user-id", "anonymous");
vectorQueryRuntimeContext.set("session-id", "default");
vectorQueryRuntimeContext.set("search-preference", "semantic");
vectorQueryRuntimeContext.set("language", "en");
vectorQueryRuntimeContext.set("quality-threshold", 0.5);
