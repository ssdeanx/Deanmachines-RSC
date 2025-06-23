/**
 * Comprehensive Diffbot API client for web scraping, data extraction, and knowledge enhancement.
 * 
 * This client provides full support for:
 * - **Extract API**: Analyze, Article, Product, Discussion, Image, Video, List, Event, Job extraction
 * - **Enhance API**: Person and Organization data enrichment from Knowledge Graph
 * - **Natural Language API**: Entity extraction, sentiment analysis, and fact extraction from text
 * 
 * ## Usage Example
 * ```typescript
 * import { createDiffbotClient, diffbotTools } from './agentic/diffbot-client'
 * 
 * // Create client instance
 * const diffbot = createDiffbotClient({
 *   apiKey: process.env.DIFFBOT_API_KEY!
 * })
 * 
 * // Extract article content
 * const article = await diffbot.extractArticleFromUrl({
 *   url: 'https://example.com/news-article'
 * })
 * 
 * // Analyze text content
 * const analysis = await diffbot.analyzeTextContent({
 *   content: 'Your text here...',
 *   sentiment: true,
 *   facts: true
 * })
 * 
 * // Enhance entity data
 * const enhanced = await diffbot.enhanceEntity({
 *   type: 'Person',
 *   name: 'John Doe'
 * })
 * ```
 * 
 * ## Mastra Integration
 * The `diffbotTools` export provides Mastra-compatible tools that can be directly
 * used in Mastra agents for AI-powered web scraping and data extraction workflows.
 * 
 * @see https://docs.diffbot.com - Official Diffbot API documentation
 * @see https://docs.diffbot.com/reference/extract-introduction - Extract API docs
 * @see https://docs.diffbot.com/reference/introduction-to-enhance-api - Enhance API docs  
 * @see https://docs.diffbot.com/reference/introduction-to-natural-language-api - Natural Language API docs
 */

import {
  aiFunction,
  AIFunctionsProvider,
  assert,
  getEnv,
  sanitizeSearchParams,
  throttleKy
} from '@agentic/core'
import defaultKy, { type KyInstance } from 'ky'
import pThrottle from 'p-throttle'
import { z } from 'zod'
import { createMastraTools } from './mastra'

// Replace namespace with individual exports
export const API_BASE_URL = 'https://api.diffbot.com'
export const KNOWLEDGE_GRAPH_API_BASE_URL = 'https://kg.diffbot.com'

// Allow up to 5 requests per second by default.
// https://docs.diffbot.com/reference/rate-limits
export const throttle = pThrottle({
  limit: 5,
  interval: 1000,
  strict: true
})

// Define specific types for classification arrays
export interface ClassificationItem {
  code: string
  name: string
  level?: number
}

export interface EmployeeCategory {
  name: string
  count?: number
  percentage?: number
}

// Add missing type definitions
export type Gender = 'male' | 'female' | 'other' | 'unknown'

// Define specific image type to avoid conflict with DOM Image
export interface DiffbotImage {
  url: string
  title?: string
  height?: number
  width?: number
  naturalHeight?: number
  naturalWidth?: number
  primary?: boolean
  meta?: DiffbotObjectMeta
}

export interface BasicEntity {
  id: string
  name: string
  diffbotUri?: string
  type?: string
}

export interface Employment {
  title: string
  employer: BasicEntity
  isCurrent?: boolean
  startDate?: DateTime
  endDate?: DateTime
  location?: Location
}

export interface Location {
  name: string
  latitude?: number
  longitude?: number
  country?: string
  region?: string
  city?: string
}

export interface NameDetail {
  firstName?: string
  lastName?: string
  middleName?: string
  fullName?: string
}

export interface DateTime {
  str: string
  precision?: number
  timestamp?: number
}

export interface Education {
  institution: BasicEntity
  degree?: string
  major?: string
  startDate?: DateTime
  endDate?: DateTime
  isCurrent?: boolean
}

export interface Nationality {
  name: string
  country?: string
}

export interface Union {
  name: string
  startDate?: DateTime
  endDate?: DateTime
}

export interface Language {
  name: string
  proficiency?: string
}

export interface Award {
  name: string
  date?: DateTime
  description?: string
}

export interface Amount {
  value: number
  currency: string
  str?: string
}

export interface Interest {
  name: string
  score?: number
}

export interface EmailAddress {
  address: string
  type?: string
}

export interface Investment {
  company: BasicEntity
  amount?: Amount
  date?: DateTime
  round?: string
}

export interface Category {
  name: string
  score?: number
}

export interface Technographic {
  name: string
  category?: string
  vendor?: string
}

export interface Stock {
  symbol: string
  exchange?: string
  price?: number
  marketCap?: Amount
}

export interface AnnualRevenue {
  year: number
  amount: Amount
}

export interface DiffbotError {
  message: string
  code?: string
  type?: string
}

// Define specific metadata interface
export interface DiffbotObjectMeta {
  [key: string]: string | number | boolean | null
}

export interface ExtractOptions {
  /** The URL to process */
  url: string
  
  /** Specify optional fields to be returned from any fully-extracted pages, e.g.: &fields=querystring,links. See available fields within each API's individual documentation pages.
   * @see https://docs.diffbot.com/reference/extract-optional-fields
   */
  fields?: string[]

  /** (*Undocumented*) Pass paging=false to disable automatic concatenation of multiple-page articles. (By default, Diffbot will concatenate up to 20 pages of a single article.) */
  paging?: boolean

  /** Pass discussion=false to disable automatic extraction of comments or reviews from pages identified as articles or products. This will not affect pages identified as discussions. */
  discussion?: boolean

  /** Sets a value in milliseconds to wait for the retrieval/fetch of content from the requested URL. The default timeout for the third-party response is 30 seconds (30000). */
  timeout?: number

  /** Used to specify the IP address of a custom proxy that will be used to fetch the target page, instead of Diffbot's default IPs/proxies. (Ex: &proxy=168.212.226.204) */
  proxy?: string

  /** Used to specify the authentication parameters that will be used with the proxy specified in the &proxy parameter. (Ex: &proxyAuth=username:password) */
  proxyAuth?: string
  
  /** Custom JavaScript to execute on the page */
  customJs?: string
  
  /** Custom headers to include in the request */
  customHeaders?: Record<string, string>
}

// Extended options for specific extraction types
export interface ExtractAnalyzeOptions extends ExtractOptions {
  mode?: 'article' | 'product' | 'image' | 'video'
}

export interface ExtractArticleOptions extends ExtractOptions {
  /** Maximum number of pages to concatenate for multi-page articles */
  maxPages?: number
}

// Base response interface
export interface ExtractResponse {
  objects: Array<{
    type: string
    pageUrl: string
    humanLanguage?: string
    title?: string
    text?: string
    html?: string
    url?: string
    diffbotUri?: string
    date?: string
    estimatedDate?: string
    author?: string
    authorUrl?: string
    discussion?: {
      confidence: number
      pageUrl: string
    }
    sentiment?: number
    tags?: Array<{
      id: number
      count: number
      prevalence: number
      label: string
      uri: string
      type: string
    }>
    images?: DiffbotImage[]
    videos?: Array<{
      primary: boolean
      url: string
    }>
    breadcrumb?: Array<{
      link: string
      name: string
    }>
    links?: string[]
    meta?: DiffbotObjectMeta
  }>
  request: DiffbotRequest
  errorCode?: number
  error?: string
}

export interface ExtractAnalyzeResponse extends ExtractResponse {
  stats?: {
    confidenceScore: number
  }
}

export interface ExtractArticleResponse extends ExtractResponse {
  // Article-specific response properties can be added here
  nextPages?: string[]
}

export interface DiffbotRequest {
  pageUrl: string
  api: string
  version: number
}

export interface KnowledgeGraphSearchOptions {
  type?: 'query' | 'text' | 'queryTextFallback' | 'crawl'
  query: string
  col?: string
  from?: number
  size?: number

  // NOTE: we only support `json`, so these options are not needed
  // We can always convert from json to another format if needed.
  // format?: 'json' | 'jsonl' | 'csv' | 'xls' | 'xlsx'
  // exportspec?: string
  // exportseparator?: string
  // exportfile?: string

  filter?: string
  jsonmode?: 'extended' | 'id'
  nonCanonicalFacts?: boolean
  noDedupArticles?: boolean
  cluster?: 'all' | 'best' | 'dedupe'
  report?: boolean
}

export interface KnowledgeGraphEnhanceOptions {
  type: EntityType

  id?: string
  name?: string
  url?: string
  phone?: string
  email?: string
  employer?: string
  title?: string
  school?: string
  location?: string
  ip?: string
  customId?: string

  size?: number
  threshold?: number

  refresh?: boolean
  search?: boolean
  useCache?: boolean

  filter?: string
  jsonmode?: 'extended' | 'id'
  nonCanonicalFacts?: boolean
}

export interface KnowledgeGraphResponse {
  data: KnowledgeGraphNode[]
  version: number
  hits: number
  results: number
  kgversion: string
  diffbot_type: string
  facet?: boolean
  errors?: DiffbotError[]
}

export interface KnowledgeGraphNode {
  score: number
  esscore?: number
  entity: KnowledgeGraphEntity
  entity_ctx: Record<string, unknown>
  errors: string[]
  callbackQuery: string
  upperBound: number
  lowerBound: number
  count: number
  value: string
  uri: string
}

export interface KnowledgeGraphEntity {
  id: string
  diffbotUri: string
  type?: string
  name: string
  images: DiffbotImage[]
  origins: string[]
  nbOrigins?: number

  gender?: Gender
  githubUri?: string
  importance?: number
  description?: string
  homepageUri?: string
  allNames?: string[]
  skills?: Partial<BasicEntity>[]
  crawlTimestamp?: number
  summary?: string
  image?: string
  types?: string[]
  nbIncomingEdges?: number
  allUris?: string[]
  employments?: Employment[]
  locations?: Location[]
  location?: Location
  allOriginHashes?: string[]
  nameDetail?: NameDetail
}

export type EntityType = 'Organization' | 'Place'

export const EnhanceEntityOptionsSchema = z.object({
  type: z.enum(['Person', 'Organization']),
  id: z
    .string()
    .optional()
    .describe('Diffbot ID of the entity to enhance if known'),
  name: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Name of the entity'),
  url: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Origin or homepage URL of the entity'),
  phone: z.string().optional().describe('Phone number of the entity'),
  email: z.string().optional().describe('Email of the entity'),
  employer: z
    .string()
    .optional()
    .describe("Name of the entity's employer (for Person entities)"),
  title: z
    .string()
    .optional()
    .describe('Title of the entity (for Person entities)'),
  school: z
    .string()
    .optional()
    .describe('School of the entity (for Person entities)'),
  location: z.string().optional().describe('Location of the entity'),
  ip: z.string().optional().describe('IP address of the entity'),
  customId: z.string().optional().describe('User-defined ID for correlation'),
  threshold: z.number().optional().describe('Similarity threshold'),
  refresh: z
    .boolean()
    .optional()
    .describe(
      'If set, will attempt to refresh the entity data by recrawling the source URLs.'
    ),
  search: z
    .boolean()
    .optional()
    .describe(
      'If set, will attempt to search the web for the entity and merge the results into its knowledge base.'
    ),
  size: z
    .number()
    .int()
    .max(100)
    .optional()
    .describe('Number of results to return')
})
export type EnhanceEntityOptions = z.infer<typeof EnhanceEntityOptionsSchema>

export interface EnhanceEntityResponse {
  version: number
  hits: number
  kgversion: string
  request_ctx: RequestCtx
  data: EnhanceEntityResult[]
  errors: DiffbotError[]
}

export interface RequestCtx {
  query: Query
  query_ctx: QueryCtx
}

export interface Query {
  type: string
  name: string[]
}

export interface QueryCtx {
  search: string
}

export interface EnhanceEntityResult {
  score: number
  esscore: number
  entity: Entity
  errors: DiffbotError[]
}

export interface Entity {
  name: string
  type: EntityType
  id: string
  summary?: string
  description?: string
  homepageUri?: string
  twitterUri?: string
  linkedInUri?: string
  githubUri?: string
  crunchbaseUri?: string
  googlePlusUri?: string
  facebookUri?: string
  angellistUri?: string
  wikipediaUri?: string
  diffbotUri?: string
  origin?: string
  origins?: string[]
  allUris?: string[]

  // extra metadata
  nbOrigins?: number
  nbIncomingEdges?: number
  nbFollowers?: number
  nbLocations?: number
  nbEmployees?: number
  nbEmployeesMin?: number
  nbEmployeesMax?: number
  nbActiveEmployeeEdges?: number
  nbUniqueInvestors?: number
  educations?: Education[]
  nationalities?: Nationality[]
  fullName?: string
  allNames?: string[]
  skills?: Partial<BasicEntity>[]
  children?: BasicEntity[]
  height?: number
  image?: string
  images?: DiffbotImage[]
  allOriginHashes?: string[]
  nameDetail?: NameDetail
  parents?: BasicEntity[]
  gender?: Gender
  importance?: number
  monthlyTraffic?: number
  monthlyTrafficGrowth?: number
  wikipediaPageviews?: number
  wikipediaPageviewsLastQuarterGrowth?: number
  wikipediaPageviewsLastYear?: number
  wikipediaPageviewsLastYearGrowth?: number
  wikipediaPageviewsLastQuarter?: number
  wikipediaPageviewsGrowth?: number
  birthPlace?: Location
  types?: string[]
  unions?: Union[]
  languages?: Language[]
  employments?: Employment[]
  birthDate?: DateTime
  religion?: Partial<BasicEntity>
  awards?: Award[]
  netWorth?: Amount
  allDescriptions?: string[]
  locations?: Location[]
  location?: Location
  interests?: Interest[]
  suppliers?: BasicEntity[]
  subsidiaries?: BasicEntity[]
  ipo?: {
    date: DateTime
    stockExchange: string
  }
  motto?: string
  logo?: string
  foundingDate?: DateTime
  totalInvestment?: Amount
  naicsClassification2017?: ClassificationItem[]
  naicsClassification?: ClassificationItem[]
  sicClassification?: ClassificationItem[]
  naceClassification?: ClassificationItem[]
  iSicClassification?: ClassificationItem[]
  employeeCategories?: EmployeeCategory[]
  emailAddresses?: EmailAddress[]
  age?: number
  isPublic?: boolean
  isAcquired?: boolean
  isDissolved?: boolean
  isNonProfit?: boolean
  crawlTimestamp?: number
  founders?: BasicEntity[]
  boardMembers?: BasicEntity[]
  ceo?: BasicEntity
  investments?: Investment[]
  acquiredBy?: BasicEntity[]
  diffbotClassification?: ClassificationItem[]
  blogUri?: string
  descriptors?: string[]
  industries?: string[]
  partnerships?: BasicEntity[]
  categories?: Category[]
  customers?: BasicEntity[]
  technographics?: Technographic[]
  stock?: Stock
  companiesHouseIds?: string[]
  yearlyRevenues?: AnnualRevenue[]
  revenue?: Amount
  parentCompany?: BasicEntity
  legalEntities?: BasicEntity[]
}

/**
 * Diffbot provides web page classification and scraping. It also provides
 * access to a knowledge graph with the ability to perform person and company
 * data enrichment.
 *
 * @see https://docs.diffbot.com
 */
export class DiffbotClient extends AIFunctionsProvider {
  protected readonly ky: KyInstance
  protected readonly kyKnowledgeGraph: KyInstance

  protected readonly apiKey: string
  protected readonly apiBaseUrl: string
  protected readonly apiKnowledgeGraphBaseUrl: string

  constructor({
    apiKey = getEnv('DIFFBOT_API_KEY'),
    apiBaseUrl = API_BASE_URL,
    apiKnowledgeGraphBaseUrl = KNOWLEDGE_GRAPH_API_BASE_URL,
    timeoutMs = 30_000,
    throttle = true,
    ky = defaultKy
  }: {
    apiKey?: string
    apiBaseUrl?: string
    apiKnowledgeGraphBaseUrl?: string
    timeoutMs?: number
    throttle?: boolean
    ky?: KyInstance
  } = {}) {
    assert(
      apiKey,
      `DiffbotClient missing required "apiKey" (defaults to "DIFFBOT_API_KEY")`
    )
    super()

    this.apiKey = apiKey
    this.apiBaseUrl = apiBaseUrl
    this.apiKnowledgeGraphBaseUrl = apiKnowledgeGraphBaseUrl

    const throttledKy = typeof throttle === 'function' ? throttleKy(ky, throttle) : ky

    this.ky = throttledKy.extend({
      prefixUrl: apiBaseUrl,
      timeout: timeoutMs
    })

    this.kyKnowledgeGraph = throttledKy.extend({
      prefixUrl: apiKnowledgeGraphBaseUrl,
      timeout: timeoutMs
    })
  }

  /**
   * Scrapes and extracts structured data from a web page. Also classifies the web page as one of several types (article, product, discussion, job, image, video, list, event, or other).
   */
  @aiFunction({
    name: 'diffbot_analyze_url',
    description:
      'Scrapes and extracts structured data from a web page. Also classifies the web page as one of several types (article, product, discussion, job, image, video, list, event, or other).',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.')
    })
  })
  async analyzeUrl(input: { url: string }) {
    return this._extract<ExtractAnalyzeResponse>('v3/analyze', { url: input.url })
  }

  /**
   * Scrapes and extracts clean article text from news articles, blog posts, and other text-heavy web pages.
   */
  @aiFunction({
    name: 'diffbot_extract_article_from_url',
    description:
      'Scrapes and extracts clean article text from news articles, blog posts, and other text-heavy web pages.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.')
    })
  })
  async extractArticleFromUrl(input: { url: string }) {
    return this._extract<ExtractArticleResponse>('v3/article', { url: input.url })
  }

  /**
   * Resolves and enriches a partial person or organization entity.
   */
  @aiFunction({
    name: 'diffbot_enhance_entity',
    description:
      'Resolves and enriches a partial person or organization entity.',
    inputSchema: EnhanceEntityOptionsSchema.omit({
      refresh: true,
      search: true,
      customId: true,
      threshold: true
    })
  })
  async enhanceEntity(
    opts: EnhanceEntityOptions
  ): Promise<EnhanceEntityResponse> {
    return this.kyKnowledgeGraph
      .get('kg/v3/enhance', {
        searchParams: sanitizeSearchParams({
          ...opts,
          token: this.apiKey
        })
      })
      .json<EnhanceEntityResponse>()
  }

  async searchKnowledgeGraph(options: KnowledgeGraphSearchOptions) {
    return this.kyKnowledgeGraph
      .get('kg/v3/dql', {
        searchParams: {
          ...options,
          token: this.apiKey
        }
      })
      .json<KnowledgeGraphResponse>()
  }

  async enhanceKnowledgeGraph(options: KnowledgeGraphEnhanceOptions) {
    return this.kyKnowledgeGraph
      .get('kg/v3/enhance', {
        searchParams: {
          ...options,
          token: this.apiKey
        }
      })
      .json<KnowledgeGraphResponse>()
  }

  protected async _extract<
    T extends ExtractResponse = ExtractResponse
  >(endpoint: string, options: ExtractOptions): Promise<T> {
    const { customJs, customHeaders, ...rest } = options
    const searchParams = sanitizeSearchParams({
      ...rest,
      token: this.apiKey
    })
    const headers = {
      ...Object.fromEntries(
        [['X-Forward-X-Evaluate', customJs]].filter(([, value]) => value)
      ),
      ...customHeaders
    }

    // console.log(`DiffbotClient._extract: ${endpoint}`, searchParams)

    return this.ky
      .get(endpoint, {
        searchParams,
        headers,
        retry: 1
      })
      .json<T>()
  }

  /**
   * Analyzes text content using Diffbot's Natural Language API to extract entities, facts, and sentiment.
   */
  @aiFunction({
    name: 'diffbot_analyze_text_content',
    description:
      'Analyzes text content using Diffbot\'s Natural Language API to extract entities, facts, and sentiment.',
    inputSchema: NaturalLanguageOptionsSchema
  })
  async analyzeTextContent(
    input: NaturalLanguageInput
  ): Promise<NaturalLanguageResponse> {
    return this.ky
      .post('v3/nl', {
        json: {
          content: input.content,
          ...(input.lang && { lang: input.lang }),
          ...(input.maxEntities && { maxEntities: input.maxEntities }),
          ...(input.minSalience && { minSalience: input.minSalience }),
          ...(input.sentiment !== undefined && { sentiment: input.sentiment }),
          ...(input.facts !== undefined && { facts: input.facts }),
          ...(input.openFacts !== undefined && { openFacts: input.openFacts })
        },
        searchParams: { token: this.apiKey },
        retry: 1
      })
      .json<NaturalLanguageResponse>()
  }

  /**
   * Extracts product information from product pages, including prices, specifications, and reviews.
   */
  @aiFunction({
    name: 'diffbot_extract_product_from_url',
    description:
      'Extracts product information from product pages, including prices, specifications, and reviews.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      reviews: z.boolean().optional().describe('Whether to extract product reviews'),
      maxReviews: z.number().int().min(1).max(100).optional().describe('Maximum number of reviews to extract')
    })
  })
  async extractProductFromUrl(input: { 
    url: string; 
    reviews?: boolean; 
    maxReviews?: number; 
  }) {
    return this._extract<ExtractProductResponse>('v3/product', input)
  }

  /**
   * Extracts discussion threads, forum posts, and comment sections.
   */
  @aiFunction({
    name: 'diffbot_extract_discussion_from_url',
    description:
      'Extracts discussion threads, forum posts, and comment sections.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      maxPosts: z.number().int().min(1).max(1000).optional().describe('Maximum number of posts to extract'),
      replies: z.boolean().optional().describe('Whether to extract post replies')
    })
  })
  async extractDiscussionFromUrl(input: { 
    url: string; 
    maxPosts?: number; 
    replies?: boolean; 
  }) {
    return this._extract<ExtractDiscussionResponse>('v3/discussion', input)
  }

  /**
   * Extracts detailed information about images, including dimensions and image recognition.
   */
  @aiFunction({
    name: 'diffbot_extract_image_from_url',
    description:
      'Extracts detailed information about images, including dimensions and image recognition.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      ocr: z.boolean().optional().describe('Whether to perform optical character recognition')
    })
  })
  async extractImageFromUrl(input: { 
    url: string; 
    ocr?: boolean; 
  }) {
    return this._extract<ExtractImageResponse>('v3/image', input)
  }

  /**
   * Extracts video information and metadata from video pages.
   */
  @aiFunction({
    name: 'diffbot_extract_video_from_url',
    description:
      'Extracts video information and metadata from video pages.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      metadata: z.boolean().optional().describe('Whether to extract detailed video metadata')
    })
  })
  async extractVideoFromUrl(input: { 
    url: string; 
    metadata?: boolean; 
  }) {
    return this._extract<ExtractVideoResponse>('v3/video', input)
  }

  /**
   * Extracts data from listing pages such as search results, product catalogs, and index pages.
   */
  @aiFunction({
    name: 'diffbot_extract_list_from_url',
    description:
      'Extracts data from listing pages such as search results, product catalogs, and index pages.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      maxItems: z.number().int().min(1).max(1000).optional().describe('Maximum number of list items to extract')
    })
  })
  async extractListFromUrl(input: { 
    url: string; 
    maxItems?: number; 
  }) {
    return this._extract<ExtractListResponse>('v3/list', input)
  }

  /**
   * Extracts event information from event pages, including dates, locations, and details.
   */
  @aiFunction({
    name: 'diffbot_extract_event_from_url',
    description:
      'Extracts event information from event pages, including dates, locations, and details.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      attendees: z.boolean().optional().describe('Whether to extract event attendee information')
    })
  })
  async extractEventFromUrl(input: { 
    url: string; 
    attendees?: boolean; 
  }) {
    return this._extract<ExtractEventResponse>('v3/event', input)
  }

  /**
   * Extracts job posting information including requirements, responsibilities, and company details.
   */
  @aiFunction({
    name: 'diffbot_extract_job_from_url',
    description:
      'Extracts job posting information including requirements, responsibilities, and company details.',
    inputSchema: z.object({
      url: z.string().url().describe('The URL to process.'),
      company: z.boolean().optional().describe('Whether to extract detailed company information')
    })
  })
  async extractJobFromUrl(input: { 
    url: string; 
    company?: boolean; 
  }) {
    return this._extract<ExtractJobResponse>('v3/job', input)
  }

  // ...existing methods...
}

/**
 * Creates a Diffbot client instance with default configuration
 * 
 * @param options - Configuration options for the Diffbot client
 * @returns A configured DiffbotClient instance
 * 
 * @example
 * ```typescript
 * const diffbot = createDiffbotClient({
 *   apiKey: process.env.DIFFBOT_API_KEY!
 * });
 * ```
 * 
 * [EDIT: 2025-06-23] [BY: GitHub Copilot]
 */
export function createDiffbotClient(options?: {
  apiKey?: string
  apiBaseUrl?: string
  apiKnowledgeGraphBaseUrl?: string
  throttle?: boolean
}) {
  return new DiffbotClient({
    apiKey: options?.apiKey ?? getEnv('DIFFBOT_API_KEY'),
    apiBaseUrl: options?.apiBaseUrl ?? API_BASE_URL,
    apiKnowledgeGraphBaseUrl: options?.apiKnowledgeGraphBaseUrl ?? KNOWLEDGE_GRAPH_API_BASE_URL,
    throttle: options?.throttle ?? true
  })
}

/**
 * Mastra-compatible tools for Diffbot web scraping and data extraction
 * 
 * Provides tools for analyzing web pages and extracting structured data
 * using Diffbot's AI-powered web scraping capabilities.
 * 
 * @example
 * ```typescript
 * import { diffbotTools } from './agentic/diffbot-client'
 * 
 * // Use in Mastra agent
 * export const myAgent = new Agent({
 *   tools: {
 *     ...diffbotTools
 *   }
 * })
 * ```
 * 
 * [EDIT: 2025-06-23] [BY: GitHub Copilot]
 */
export const diffbotTools = createMastraTools(createDiffbotClient())

// Natural Language API Types
export interface NaturalLanguageOptions {
  /** The content to process */
  content: string
  
  /** Language code (e.g., 'en', 'fr', 'es'). If not specified, language will be auto-detected */
  lang?: string
  
  /** Maximum number of entities to return */
  maxEntities?: number
  
  /** Minimum salience score for entities (0.0 to 1.0) */
  minSalience?: number
  
  /** Whether to include sentiment analysis */
  sentiment?: boolean
  
  /** Whether to include entity facts */
  facts?: boolean
  
  /** Whether to include open facts (experimental) */
  openFacts?: boolean
}

export interface NaturalLanguageResponse {
  /** Overall sentiment of the document (-1.0 to 1.0) */
  sentiment?: number
  
  /** Detected language code */
  lang?: string
  
  /** Extracted entities */
  entities?: NLEntity[]
  
  /** Extracted facts */
  facts?: NLFact[]
  
  /** Open domain facts */
  openFacts?: NLOpenFact[]
  
  /** Processing errors */
  errors?: DiffbotError[]
}

export interface NLEntity {
  /** Entity name */
  name: string
  
  /** Entity type (e.g., 'Person', 'Organization', 'Place') */
  type?: string
  
  /** Salience score (0.0 to 1.0) indicating importance */
  salience?: number
  
  /** Sentiment towards this entity (-1.0 to 1.0) */
  sentiment?: number
  
  /** Diffbot Knowledge Graph URI */
  diffbotUri?: string
  
  /** Wikipedia URI if available */
  wikipediaUri?: string
  
  /** Entity mentions in the text */
  mentions?: NLMention[]
}

export interface NLMention {
  /** Text of the mention */
  text: string
  
  /** Character offset in the original text */
  offset?: number
  
  /** Length of the mention */
  length?: number
}

export interface NLFact {
  /** Subject entity */
  subject: NLEntity
  
  /** Property/relationship type */
  property: string
  
  /** Object entity or literal value */
  object: NLEntity | string | number
  
  /** Confidence score */
  confidence?: number
}

export interface NLOpenFact {
  /** Subject entity */
  subject: NLEntity
  
  /** Property extracted from text */
  property: string
  
  /** Object extracted from text */
  object: string
  
  /** Confidence score */
  confidence?: number
}

export const NaturalLanguageOptionsSchema = z.object({
  content: z.string().min(1).max(100000).describe('The text content to analyze'),
  lang: z.string().optional().describe('Language code (e.g., en, fr, es)'),
  maxEntities: z.number().int().min(1).max(100).optional().describe('Maximum number of entities to return'),
  minSalience: z.number().min(0).max(1).optional().describe('Minimum salience score for entities'),
  sentiment: z.boolean().optional().describe('Whether to include sentiment analysis'),
  facts: z.boolean().optional().describe('Whether to include entity facts'),
  openFacts: z.boolean().optional().describe('Whether to include open facts (experimental)')
})

export type NaturalLanguageInput = z.infer<typeof NaturalLanguageOptionsSchema>

// Additional Extract API types for missing page types
export interface ExtractProductOptions extends ExtractOptions {
  /** Whether to extract product reviews/comments */
  reviews?: boolean
  
  /** Maximum number of reviews to extract */
  maxReviews?: number
}

export interface ExtractDiscussionOptions extends ExtractOptions {
  /** Maximum number of posts/comments to extract */
  maxPosts?: number
  
  /** Whether to extract post replies */
  replies?: boolean
}

export interface ExtractImageOptions extends ExtractOptions {
  /** Whether to perform image recognition */
  ocr?: boolean
}

export interface ExtractVideoOptions extends ExtractOptions {
  /** Whether to extract video metadata */
  metadata?: boolean
}

export interface ExtractListOptions extends ExtractOptions {
  /** Maximum number of list items to extract */
  maxItems?: number
}

export interface ExtractEventOptions extends ExtractOptions {
  /** Whether to extract event attendees */
  attendees?: boolean
}

export interface ExtractJobOptions extends ExtractOptions {
  /** Whether to extract company information */
  company?: boolean
}

// Response types for additional Extract APIs
export interface ExtractProductResponse extends ExtractResponse {
  objects: ProductObject[]
}

export interface ExtractDiscussionResponse extends ExtractResponse {
  objects: DiscussionObject[]
}

export interface ExtractImageResponse extends ExtractResponse {
  objects: ImageObject[]
}

export interface ExtractVideoResponse extends ExtractResponse {
  objects: VideoObject[]
}

export interface ExtractListResponse extends ExtractResponse {
  objects: ListObject[]
}

export interface ExtractEventResponse extends ExtractResponse {
  objects: EventObject[]
}

export interface ExtractJobResponse extends ExtractResponse {
  objects: JobObject[]
}

// Object types for different page types
export interface ProductObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Product-specific properties
  price?: string
  priceDetails?: PriceDetail[]
  availability?: string
  brand?: string
  sku?: string
  reviews?: Review[]
  specifications?: Specification[]
  description?: string
  category?: string
}

export interface PriceDetail {
  amount?: number
  currency?: string
  text?: string
  isSale?: boolean
  isRange?: boolean
}

export interface Review {
  author?: string
  text?: string
  rating?: number
  date?: string
  title?: string
}

export interface Specification {
  name: string
  value: string
}

export interface DiscussionObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Discussion-specific properties
  posts?: DiscussionPost[]
  numPosts?: number
  confidence?: number
}

export interface DiscussionPost {
  author?: string
  text?: string
  date?: string
  id?: string
  parentId?: string
  votes?: number
  replies?: DiscussionPost[]
}

export interface ImageObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Image-specific properties
  naturalHeight?: number
  naturalWidth?: number
  size?: number
  displayUrl?: string
  thumbnailUrl?: string
  caption?: string
  description?: string
  ocr?: string
}

export interface VideoObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Video-specific properties
  embedUrl?: string
  duration?: number
  viewCount?: number
  uploadDate?: string
  thumbnail?: string
  description?: string
}

export interface ListObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // List-specific properties
  items?: ListItem[]
  numItems?: number
}

export interface ListItem {
  title?: string
  description?: string
  url?: string
  date?: string
  author?: string
  image?: string
}

export interface EventObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Event-specific properties
  description?: string
  startDate?: string
  endDate?: string
  location?: EventLocation
  venue?: string
  organizer?: string
  price?: string
  category?: string
  attendees?: EventAttendee[]
}

export interface EventLocation {
  name?: string
  address?: string
  city?: string
  region?: string
  country?: string
  latitude?: number
  longitude?: number
}

export interface EventAttendee {
  name?: string
  title?: string
  company?: string
  bio?: string
}

export interface JobObject {
  type: string
  pageUrl: string
  humanLanguage?: string
  title?: string
  text?: string
  html?: string
  url?: string
  diffbotUri?: string
  date?: string
  estimatedDate?: string
  author?: string
  authorUrl?: string
  discussion?: {
    confidence: number
    pageUrl: string
  }
  sentiment?: number
  tags?: Array<{
    id: number
    count: number
    prevalence: number
    label: string
    uri: string
    type: string
  }>
  images?: DiffbotImage[]
  videos?: Array<{
    primary: boolean
    url: string
  }>
  breadcrumb?: Array<{
    link: string
    name: string
  }>
  links?: string[]
  meta?: DiffbotObjectMeta
  // Job-specific properties
  description?: string
  company?: JobCompany
  location?: string
  employmentType?: string
  salary?: string
  requirements?: string[]
  responsibilities?: string[]
  postedDate?: string
  expiryDate?: string
  applicationUrl?: string
}

export interface JobCompany {
  name?: string
  description?: string
  website?: string
  logo?: string
  industry?: string
  size?: string
}
