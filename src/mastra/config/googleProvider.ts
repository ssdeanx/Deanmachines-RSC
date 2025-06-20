// Generated on 2025-06-20 - Enhanced with Gemini 2.5 features
/**
 * Enhanced Google Generative AI Provider Setup for Mastra
 *
 * Comprehensive Google provider with full Gemini 2.5 feature support including:
 * - Search Grounding with Dynamic Retrieval
 * - Cached Content (Implicit & Explicit)
 * - File Inputs (PDF, images, etc.)
 * - Embedding Models with flexible dimensions (1536 default)
 * - Thinking Config via providerOptions (correct AI SDK pattern)
 * - Safety Settings and Response Modalities
 * - Image Generation capabilities
 *
 * @see https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai
 * @see https://ai.google.dev/gemini-api/docs
 *
 * @example Correct thinking config usage:
 * ```typescript
 * const result = await generateText({
 *   model: google('gemini-2.5-flash-lite-preview-06-17'),
 *   providerOptions: {
 *     google: {
 *       thinkingConfig: { thinkingBudget: 2048 }
 *     }
 *   },
 *   prompt: 'Think step by step...'
 * });
 * ```
 */
import {
  google as baseGoogle,
  GoogleGenerativeAIProviderSettings,
  GoogleGenerativeAIProviderOptions
} from '@ai-sdk/google';

/**
 * Gemini Model Configuration Constants - Focused on 2.5 Series
 */
export const GEMINI_CONFIG = {
  // Latest Gemini 2.5 models with advanced capabilities
  MODELS: {
    // Main model - Latest 2.5 Flash Lite with 1M context, thinking, and all features
    GEMINI_2_5_FLASH_LITE: 'gemini-2.5-flash-lite-preview-06-17', // Primary model
    GEMINI_2_5_PRO: 'gemini-2.5-pro-preview-05-06',
    GEMINI_2_5_FLASH: 'gemini-2.5-flash-preview-05-20'
  },

  // Embedding models with dimension support
  EMBEDDING_MODELS: {
    TEXT_EMBEDDING_004: 'text-embedding-004', // 768 default, supports custom dimensions
    GEMINI_EMBEDDING_EXP: 'gemini-embedding-exp-03-07' // 1536 dimensions, elastic: 3072, 1536, 768
  },

  // Safety settings presets
  SAFETY_PRESETS: {
    STRICT: [
      { category: 'HARM_CATEGORY_HATE_SPEECH' as const, threshold: 'BLOCK_LOW_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as const, threshold: 'BLOCK_LOW_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_HARASSMENT' as const, threshold: 'BLOCK_LOW_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as const, threshold: 'BLOCK_LOW_AND_ABOVE' as const }
    ],
    MODERATE: [
      { category: 'HARM_CATEGORY_HATE_SPEECH' as const, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as const, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_HARASSMENT' as const, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as const },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as const, threshold: 'BLOCK_MEDIUM_AND_ABOVE' as const }
    ],
    PERMISSIVE: [
      { category: 'HARM_CATEGORY_HATE_SPEECH' as const, threshold: 'BLOCK_ONLY_HIGH' as const },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as const, threshold: 'BLOCK_ONLY_HIGH' as const },
      { category: 'HARM_CATEGORY_HARASSMENT' as const, threshold: 'BLOCK_ONLY_HIGH' as const },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as const, threshold: 'BLOCK_ONLY_HIGH' as const }
    ],
    OFF: [
      { category: 'HARM_CATEGORY_HATE_SPEECH' as const, threshold: 'BLOCK_NONE' as const },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as const, threshold: 'BLOCK_NONE' as const },
      { category: 'HARM_CATEGORY_HARASSMENT' as const, threshold: 'BLOCK_NONE' as const },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as const, threshold: 'BLOCK_NONE' as const }
    ]
  }
} as const;

/**
 * Enhanced base Google model with Gemini 2.5 Flash Lite as default
 * Supports all advanced features via proper AI SDK patterns
 *
 * @param modelId - Gemini model ID (defaults to 2.5 Flash Lite)
 * @param options - Model configuration options
 * @returns Configured Google model instance
 */
export const baseGoogleModel = (
  modelId: string = GEMINI_CONFIG.MODELS.GEMINI_2_5_FLASH_LITE,
  options: {
    useSearchGrounding?: boolean;
    dynamicRetrieval?: boolean;
    safetyLevel?: 'STRICT' | 'MODERATE' | 'PERMISSIVE' | 'OFF';
    cachedContent?: string;
    structuredOutputs?: boolean;
    // Langfuse tracing options
    agentName?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    traceName?: string;
  } = {}
) => {
  const {
    useSearchGrounding = false,
    dynamicRetrieval = false,
    safetyLevel = 'MODERATE',
    cachedContent,
    structuredOutputs = true,
    // Langfuse tracing options
    agentName,
    tags = [],
    metadata = {},
    traceName
  } = options;

  const model = baseGoogle(modelId, {
    useSearchGrounding,
    dynamicRetrievalConfig: dynamicRetrieval ? {
      mode: 'MODE_DYNAMIC',
      dynamicThreshold: 0.8
    } : undefined,
    safetySettings: [...GEMINI_CONFIG.SAFETY_PRESETS[safetyLevel]],
    cachedContent,
    structuredOutputs
  });

  // Add Langfuse metadata to the model for automatic tracing
  if (agentName || tags.length > 0 || Object.keys(metadata).length > 0) {
    // Attach metadata that Langfuse can pick up
    (model as Record<string, unknown>).__langfuseMetadata = {
      agentName: agentName || 'unknown',
      tags: [
        'mastra',
        'google',
        'gemini-2.5',
        ...(agentName ? [agentName] : []),
        ...tags
      ],
      metadata: {
        modelId,
        provider: 'google',
        framework: 'mastra',
        agentName: agentName || 'unknown',
        thinkingBudget: 'dynamic',
        safetyLevel,
        useSearchGrounding,
        dynamicRetrieval,
        structuredOutputs,
        timestamp: new Date().toISOString(),
        traceName: traceName || `${agentName || 'agent'}-${modelId}`,
        ...metadata
      }
    };
  }

  return model;
};

/**
 * Create Google provider for Gemini 2.5+ models
 *
 * @param modelId - Gemini 2.5+ model ID
 * @param options - Model configuration options
 * @returns Configured Google model
 *
 * @example Basic usage:
 * ```typescript
 * const model = createGemini25Provider('gemini-2.5-flash-lite-preview-06-17');
 * ```
 *
 * @example With thinking config (use in generateText):
 * ```typescript
 * const result = await generateText({
 *   model: createGemini25Provider('gemini-2.5-flash-lite-preview-06-17'),
 *   providerOptions: {
 *     google: {
 *       thinkingConfig: { thinkingBudget: 2048 }
 *     }
 *   },
 *   prompt: 'Think step by step...'
 * });
 * ```
 */
export function createGemini25Provider(
  modelId: string = GEMINI_CONFIG.MODELS.GEMINI_2_5_FLASH_LITE,
  options: {
    // Thinking capabilities (for backward compatibility with existing agents)
    thinkingConfig?: {
      thinkingBudget?: number;
      includeThoughts?: boolean;
    };

    // Response modalities (for backward compatibility)
    responseModalities?: ('TEXT' | 'IMAGE')[];

    // Search and grounding
    useSearchGrounding?: boolean;
    dynamicRetrieval?: boolean;

    // Content and caching
    cachedContent?: string;

    // Safety and structure
    safetyLevel?: 'STRICT' | 'MODERATE' | 'PERMISSIVE' | 'OFF';
    structuredOutputs?: boolean;

    // Langfuse tracing options
    agentName?: string;
    tags?: string[];
    metadata?: Record<string, unknown>;
    traceName?: string;
  } = {}
) {
  // Extract the thinking and response modality options (for backward compatibility)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { thinkingConfig, responseModalities, ...baseOptions } = options;

  // Note: thinkingConfig and responseModalities should ideally be used in providerOptions
  // but we accept them here for backward compatibility with existing agent code
  // These parameters are intentionally unused but kept for API compatibility

  return baseGoogleModel(modelId, baseOptions);
}

/**
 * Create Google provider with image generation capabilities
 * @param modelId - Model ID (default: gemini-2.0-flash-exp)
 * @param options - Configuration options
 */
export function createGeminiImageProvider(
  modelId: string = GEMINI_CONFIG.MODELS.GEMINI_2_5_FLASH_LITE,
  options: {
    useSearchGrounding?: boolean;
    safetyLevel?: 'STRICT' | 'MODERATE' | 'PERMISSIVE' | 'OFF';
  } = {}
) {
  const { useSearchGrounding = false, safetyLevel = 'MODERATE' } = options;

  return baseGoogle(modelId, {
    useSearchGrounding,
    safetySettings: [...GEMINI_CONFIG.SAFETY_PRESETS[safetyLevel]]
  });
}

/**
 * Create embedding model with flexible dimensions
 * @param modelId - Embedding model ID
 * @param options - Embedding configuration
 */
export function createGeminiEmbeddingModel(
  modelId: string = GEMINI_CONFIG.EMBEDDING_MODELS.GEMINI_EMBEDDING_EXP,
  options: {
    outputDimensionality?: 768 | 1536 | 3072; // Supported dimensions for gemini-embedding-exp-03-07
    taskType?: 'SEMANTIC_SIMILARITY' | 'CLASSIFICATION' | 'CLUSTERING' | 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' | 'QUESTION_ANSWERING' | 'FACT_VERIFICATION' | 'CODE_RETRIEVAL_QUERY';
  } = {}
) {
  const {
    outputDimensionality = 1536, // Default to 1536 to match your setup
    taskType = 'SEMANTIC_SIMILARITY'
  } = options;

  return baseGoogle.textEmbeddingModel(modelId, {
    outputDimensionality,
    taskType
  });
}

/**
 * Main function - auto-detects model version and uses appropriate provider
 * @param modelId - ID of the Google model to use
 * @param options - Optional settings for the provider
 * @returns Google provider instance
 */
/**
 * Create a Mastra-compatible Google provider with proper thinking config support
 *
 * @param modelId - Gemini model ID
 * @param options - Provider configuration options
 * @returns Configured Google provider
 *
 * @example
 * ```typescript
 * // Basic usage
 * const model = createMastraGoogleProvider();
 *
 * // With thinking config (use in generateText providerOptions)
 * const result = await generateText({
 *   model: createMastraGoogleProvider('gemini-2.5-flash-lite-preview-06-17'),
 *   providerOptions: {
 *     google: {
 *       thinkingConfig: { thinkingBudget: 2048 }
 *     }
 *   },
 *   prompt: 'Explain quantum computing'
 * });
 * ```
 */
export function createMastraGoogleProvider(
  modelId: string = GEMINI_CONFIG.MODELS.GEMINI_2_5_FLASH_LITE,
  options: {
    // Search and grounding
    useSearchGrounding?: boolean;
    dynamicRetrieval?: boolean;

    // Content and caching
    cachedContent?: string;

    // Safety and structure
    safetyLevel?: 'STRICT' | 'MODERATE' | 'PERMISSIVE' | 'OFF';
    structuredOutputs?: boolean;
  } = {}
) {
  // Use the enhanced 2.5 provider for all models
  return createGemini25Provider(modelId, options);
}
/**
 * Main Google provider export - defaults to Gemini 2.5 Flash Lite
 * This is the primary export that should be used throughout the application
 *
 * @example Basic usage:
 * ```typescript
 * import { google } from './googleProvider';
 * const model = google('gemini-2.5-flash-lite-preview-06-17');
 * ```
 *
 * @example With thinking config (correct AI SDK pattern):
 * ```typescript
 * import { generateText } from 'ai';
 * import { google } from './googleProvider';
 *
 * const result = await generateText({
 *   model: google('gemini-2.5-flash-lite-preview-06-17'),
 *   providerOptions: {
 *     google: {
 *       thinkingConfig: { thinkingBudget: 2048 },
 *       responseModalities: ['TEXT']
 *     }
 *   },
 *   prompt: 'Think step by step about quantum computing...'
 * });
 * ```
 */
export const google = createMastraGoogleProvider;

export type { GoogleGenerativeAIProviderOptions, GoogleGenerativeAIProviderSettings };
