/**
 * Test file to verify Diffbot client integration and functionality
 * 
 * This file demonstrates usage of the Diffbot client with all supported APIs:
 * - Extract API (Analyze, Article, Product, Discussion, Image, Video, List, Event, Job)
 * - Enhance API (Person/Organization enrichment)
 * - Natural Language API (Text analysis, entity extraction, sentiment)
 */

import { createDiffbotClient, diffbotTools } from './diffbot-client'

// Test client creation
const diffbot = createDiffbotClient({
  apiKey: process.env.DIFFBOT_API_KEY || 'test-key'
})

/**
 * Example usage of Diffbot Extract APIs
 */
async function testExtractAPIs() {
  try {
    // Test URL analysis
    const analyzeResult = await diffbot.analyzeUrl({
      url: 'https://example.com/article'
    })
    console.log('Analyze result:', analyzeResult)

    // Test article extraction
    const articleResult = await diffbot.extractArticleFromUrl({
      url: 'https://example.com/news-article'
    })
    console.log('Article result:', articleResult)

    // Test product extraction
    const productResult = await diffbot.extractProductFromUrl({
      url: 'https://example.com/product-page',
      reviews: true,
      maxReviews: 10
    })
    console.log('Product result:', productResult)

    // Test discussion extraction
    const discussionResult = await diffbot.extractDiscussionFromUrl({
      url: 'https://example.com/forum-thread',
      maxPosts: 50,
      replies: true
    })
    console.log('Discussion result:', discussionResult)

    // Test image extraction
    const imageResult = await diffbot.extractImageFromUrl({
      url: 'https://example.com/image-page',
      ocr: true
    })
    console.log('Image result:', imageResult)

    // Test video extraction
    const videoResult = await diffbot.extractVideoFromUrl({
      url: 'https://example.com/video-page',
      metadata: true
    })
    console.log('Video result:', videoResult)

    // Test list extraction
    const listResult = await diffbot.extractListFromUrl({
      url: 'https://example.com/search-results',
      maxItems: 100
    })
    console.log('List result:', listResult)

    // Test event extraction
    const eventResult = await diffbot.extractEventFromUrl({
      url: 'https://example.com/event-page',
      attendees: true
    })
    console.log('Event result:', eventResult)

    // Test job extraction
    const jobResult = await diffbot.extractJobFromUrl({
      url: 'https://example.com/job-posting',
      company: true
    })
    console.log('Job result:', jobResult)

  } catch (error) {
    console.error('Extract API test error:', error)
  }
}

/**
 * Example usage of Diffbot Enhance API
 */
async function testEnhanceAPI() {
  try {
    // Test person enhancement
    const personResult = await diffbot.enhanceEntity({
      type: 'Person',
      name: 'Elon Musk'
    })
    console.log('Person enhancement result:', personResult)

    // Test organization enhancement
    const orgResult = await diffbot.enhanceEntity({
      type: 'Organization',
      name: 'Tesla'
    })
    console.log('Organization enhancement result:', orgResult)

  } catch (error) {
    console.error('Enhance API test error:', error)
  }
}

/**
 * Example usage of Diffbot Natural Language API
 */
async function testNaturalLanguageAPI() {
  try {
    const nlResult = await diffbot.analyzeTextContent({
      content: 'Apple Inc. is a technology company founded by Steve Jobs. The company is known for innovative products like the iPhone.',
      lang: 'en',
      sentiment: true,
      facts: true,
      maxEntities: 10,
      minSalience: 0.1
    })
    console.log('Natural Language result:', nlResult)

  } catch (error) {
    console.error('Natural Language API test error:', error)
  }
}

/**
 * Example usage with Mastra tools integration
 */
function testMastraIntegration() {
  console.log('Available Diffbot tools:', Object.keys(diffbotTools))
  
  // The diffbotTools object should contain all the @aiFunction decorated methods
  // These can be used directly in Mastra agents
}

// Export test functions for potential use in other files
export {
  testExtractAPIs,
  testEnhanceAPI,
  testNaturalLanguageAPI,
  testMastraIntegration
}

console.log('Diffbot client test file loaded successfully')
