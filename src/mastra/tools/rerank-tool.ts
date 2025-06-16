
import { rerank, type RerankResult } from '@mastra/rag';
import { google } from '@ai-sdk/google';
import { CoreMessage, UIMessage } from 'ai';
import { agentMemory } from '../agentMemory';
import { PinoLogger } from '@mastra/loggers';

const logger = new PinoLogger({ name: 'rerankSearchMessages', level: 'info' });

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