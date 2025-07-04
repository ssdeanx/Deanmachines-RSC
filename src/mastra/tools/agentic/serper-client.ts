import {
  aiFunction,
  AIFunctionsProvider,
  assert,
  getEnv,
  omit
} from '@agentic/core'
import defaultKy, { type KyInstance } from 'ky'
import { z } from 'zod'
import { createMastraTools } from "@agentic/mastra";

export const SERPER_API_BASE_URL = 'https://google.serper.dev'

export const SearchParamsSchema = z.object({
  q: z.string().describe('search query'),
  autocorrect: z.boolean().default(true).optional(),
  gl: z.string().default('us').optional(),
  hl: z.string().default('en').optional(),
  page: z.number().int().default(1).optional(),
  num: z
    .number()
    .int()
    .default(10)
    .optional()
    .describe('number of results to return')
})
export type SearchParams = z.infer<typeof SearchParamsSchema>

export const GeneralSearchSchema = SearchParamsSchema.extend({
  type: z
    .enum(['search', 'images', 'videos', 'places', 'news', 'shopping'])
    .default('search')
    .optional()
    .describe('Type of Google search to perform')
})
export type GeneralSearchParams = z.infer<typeof GeneralSearchSchema>

export interface SearchResponse {
  searchParameters: SearchParameters & { type: 'search' }
  organic: Organic[]
  answerBox?: AnswerBox
  knowledgeGraph?: KnowledgeGraph
  topStories?: TopStory[]
  peopleAlsoAsk?: PeopleAlsoAsk[]
  relatedSearches?: RelatedSearch[]
}

export interface SearchImagesResponse {
  searchParameters: SearchParameters & { type: 'images' }
  images: Image[]
}

export interface SearchVideosResponse {
  searchParameters: SearchParameters & { type: 'videos' }
  videos: Video[]
}

export interface SearchPlacesResponse {
  searchParameters: SearchParameters & { type: 'places' }
  places: Place[]
}

export interface SearchNewsResponse {
  searchParameters: SearchParameters & { type: 'news' }
  news: News[]
}

export interface SearchShoppingResponse {
  searchParameters: SearchParameters & { type: 'shopping' }
  shopping: Shopping[]
}

export type SerperResponse =
  | SearchResponse
  | SearchImagesResponse
  | SearchVideosResponse
  | SearchPlacesResponse
  | SearchNewsResponse
  | SearchShoppingResponse

export interface KnowledgeGraph {
  title: string
  type: string
  website: string
  imageUrl: string
  description: string
  descriptionSource: string
  descriptionLink: string
  attributes: Record<string, string>
}

export interface Organic {
  title: string
  link: string
  snippet: string
  position: number
  imageUrl?: string
  sitelinks?: SiteLink[]
}

export interface AnswerBox {
  snippet: string
  snippetHighlighted?: string[]
  title: string
  link: string
  date?: string
  position?: number
}

export interface SiteLink {
  title: string
  link: string
}

export interface PeopleAlsoAsk {
  question: string
  snippet: string
  title: string
  link: string
}

export interface RelatedSearch {
  query: string
}

export interface SearchParameters {
  q: string
  gl: string
  hl: string
  num: number
  autocorrect: boolean
  page: number
  type: string
  engine: string
}

export interface TopStory {
  title: string
  link: string
  source: string
  date: string
  imageUrl: string
}

export interface Image {
  title: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  thumbnailUrl: string
  thumbnailWidth: number
  thumbnailHeight: number
  source: string
  domain: string
  link: string
  googleUrl: string
  position: number
}

export interface Video {
  title: string
  link: string
  snippet: string
  date: string
  imageUrl: string
  position: number
}

export interface Place {
  position: number
  title: string
  address: string
  latitude: number
  longitude: number
  category: string
  phoneNumber?: string
  website: string
  cid: string
  rating?: number
  ratingCount?: number
}

export interface News {
  title: string
  link: string
  snippet: string
  date: string
  source: string
  imageUrl: string
  position: number
}

export interface Shopping {
  title: string
  source: string
  link: string
  price: string
  imageUrl: string
  delivery?: Record<string, string>
  rating?: number
  ratingCount?: number
  offers?: string
  productId?: string
  position: number
}

export type ClientParams = Partial<Omit<SearchParams, 'q'>>

/**
 * Lightweight wrapper around Serper for Google search.
 *
 * @see https://serper.dev
 */
export class SerperClient extends AIFunctionsProvider {
  protected readonly ky: KyInstance
  protected readonly apiKey: string
  protected readonly apiBaseUrl: string
  protected readonly params: ClientParams

  constructor({
    apiKey = getEnv('SERPER_API_KEY'),
    apiBaseUrl = SERPER_API_BASE_URL,
    ky = defaultKy,
    ...params
  }: {
    apiKey?: string
    apiBaseUrl?: string
    ky?: KyInstance
  } & ClientParams = {}) {
    assert(
      apiKey,
      'SerperClient missing required "apiKey" (defaults to "SERPER_API_KEY")'
    )

    super()

    this.apiKey = apiKey
    this.apiBaseUrl = apiBaseUrl
    this.params = params

    this.ky = ky.extend({
      prefixUrl: this.apiBaseUrl,
      headers: {
        'x-api-key': this.apiKey
      }
    })
  }

  /**
   * Uses Google Search to return the most relevant web pages for a given query. Useful for finding up-to-date news and information about any topic.
   */
  @aiFunction({
    name: 'serper_google_search',
    description:
      'Uses Google Search to return the most relevant web pages for a given query. Useful for finding up-to-date news and information about any topic.',
    inputSchema: GeneralSearchSchema.pick({
      q: true,
      num: true,
      type: true
    })
  })
  async search(queryOrOpts: string | GeneralSearchParams) {
    const searchType =
      typeof queryOrOpts === 'string' ? 'search' : queryOrOpts.type || 'search'
    return this._fetch<SearchResponse>(
      searchType,
      typeof queryOrOpts === 'string' ? queryOrOpts : omit(queryOrOpts, 'type')
    )
  }

  async searchImages(queryOrOpts: string | SearchParams) {
    return this._fetch<SearchImagesResponse>('images', queryOrOpts)
  }

  async searchVideos(queryOrOpts: string | SearchParams) {
    return this._fetch<SearchVideosResponse>('videos', queryOrOpts)
  }

  async searchPlaces(queryOrOpts: string | SearchParams) {
    return this._fetch<SearchPlacesResponse>('places', queryOrOpts)
  }

  async searchNews(queryOrOpts: string | SearchParams) {
    return this._fetch<SearchNewsResponse>('news', queryOrOpts)
  }

  async searchProducts(queryOrOpts: string | SearchParams) {
    return this._fetch<SearchShoppingResponse>('shopping', queryOrOpts)
  }

  protected async _fetch<T extends SerperResponse>(
    endpoint: string,
    queryOrOpts: string | SearchParams
  ): Promise<T> {
    const params = {
      ...this.params,
      ...(typeof queryOrOpts === 'string' ? { q: queryOrOpts } : queryOrOpts)
    }

    return this.ky.post(endpoint, { json: params }).json<T>()
  }
}

const serperClient = new SerperClient();

/**
 * Mastra-wrapped Serper tools for Google search and verticals.
 *
 * @mastra Tool for Serper API integration
 * @see https://mastra.ai/en/reference/tools/create-tool
 * @example
 * import { serperTools } from './serper-client';
 * const results = await serperTools.search({ q: 'AI' });
 * @edit 2025-06-24 [BY: GitHub Copilot]
 */
export const serperTools = createMastraTools(serperClient);
