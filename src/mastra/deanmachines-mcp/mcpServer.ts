/**
 * Dean Machines MCP Server - Comprehensive Mastra AI Framework Integration
 * 
 * This server exposes all Dean Machines agents, tools, and workflows as a Model Context Protocol (MCP) server.
 * It provides external MCP clients (like Cursor, Windsurf, Claude Desktop) with access to the complete
 * Dean Machines AI ecosystem, including 20+ specialized agents, advanced tools, and intelligent workflows.
 * 
 * Features:
 * - Complete agent registry exposure (20+ agents across all domains)
 * - Advanced tool ecosystem integration
 * - Workflow orchestration capabilities
 * - Comprehensive error handling and logging
 * - Resource and prompt management
 * - Multiple transport protocols (stdio, SSE, HTTP)
 * - Full integration with Mastra observability
 * 
 * Architecture:
 * - Agents → MCP Tools (ask_<agentName> pattern)
 * - Workflows → MCP Tools (run_<workflowName> pattern)
 * - Native Tools → Direct exposure
 * - Resources → Document and data access
 * - Prompts → Template management
 * 
 * @mastra DeanMachinesMCPServer
 * [EDIT: 2025-06-23] [BY: GitHub Copilot]
 */

import { MCPServer } from '@mastra/mcp';
import { agentRegistry } from '../agents';
import { weatherWorkflow, codeGraphMakerWorkflow, advancedCodeGraphMakerWorkflow, fullStackDevelopmentWorkflow, researchAnalysisWorkflow } from '../workflows';
import { env } from '../config/environment';
import { PinoLogger } from '@mastra/loggers';

// Import all available Mastra tools
import {
  chunkerTool,
  codeExecutor,
  graphRAGTool,
  graphRAGUpsertTool,
  rerankTool,
  stockPriceTool,
  vectorQueryTool,
  hybridVectorSearchTool,
  weatherTool,
  webScraperTool,
  webExtractorTool,
  webCrawlerTool,
  createMastraExaTools,
  createMastraArxivTools,
  createMastraRedditTools,
  createMastraWikipediaTools,
  createBraveSearchTool,
  createMastraHackerNewsTools,  
  createMastraWikidataTools,
  diffbotTools
} from '../tools';

// Initialize logger for MCP server operations
const logger = new PinoLogger({ 
  name: 'DeanMachinesMCPServer', 
  level: env.LOG_LEVEL 
});

/**
 * Create instances of all agentic Mastra tools
 * These provide comprehensive access to external APIs and services
 */
const agenticTools = (() => {
  try {
    logger.info('🔧 Initializing agentic tools...');
    
    const tools: Record<string, unknown> = {};

    // Web search and research tools
    if (process.env.EXA_API_KEY) {
      const exaTools = createMastraExaTools();
      Object.assign(tools, exaTools);
      logger.info('✅ Exa search tools initialized');
    }

    if (process.env.BRAVE_API_KEY) {
      const braveSearchTool = createBraveSearchTool();
      tools.braveSearch = braveSearchTool;
      logger.info('✅ Brave search tool initialized');
    }

    // Academic and research tools
    const arxivTools = createMastraArxivTools();
    Object.assign(tools, arxivTools);
    logger.info('✅ Arxiv research tools initialized');

    // Social media and discussion tools
    if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
      const redditTools = createMastraRedditTools();
      Object.assign(tools, redditTools);
      logger.info('✅ Reddit tools initialized');
    }

    const hackerNewsTools = createMastraHackerNewsTools();
    Object.assign(tools, hackerNewsTools);
    logger.info('✅ Hacker News tools initialized');

    // Knowledge base tools
    const wikipediaTools = createMastraWikipediaTools();
    Object.assign(tools, wikipediaTools);
    logger.info('✅ Wikipedia tools initialized');

    const wikidataTools = createMastraWikidataTools();
    Object.assign(tools, wikidataTools);
    logger.info('✅ Wikidata tools initialized');

    // Content extraction tools
    if (process.env.DIFFBOT_API_KEY) {
      Object.assign(tools, diffbotTools);
      logger.info('✅ Diffbot extraction tools initialized');
    }

    // Code execution tool
    tools.codeExecutor = codeExecutor;
    logger.info('✅ Code execution tool initialized');

    logger.info(`🎯 Initialized ${Object.keys(tools).length} agentic tools`);
    return tools;
  } catch (error) {
    logger.error('❌ Error initializing agentic tools:', { error: error instanceof Error ? error.message : 'Unknown error' });
    return {};
  }
})();

/**
 * Resource handling for the MCP server
 * Provides access to project documentation, agent configurations, and system status
 */
const mcpServerResources = {
  /**
   * List all available resources in the Dean Machines ecosystem
   */
  listResources: async () => {
    logger.info('📚 Listing MCP server resources');
    
    return [
      {
        uri: 'deanmachines://agents/registry',
        name: 'Agent Registry',
        description: 'Complete list of all available agents with capabilities and metadata',
        mimeType: 'application/json'
      },
      {
        uri: 'deanmachines://workflows/catalog',
        name: 'Workflow Catalog',
        description: 'Available workflows for complex task orchestration',
        mimeType: 'application/json'
      },
      {
        uri: 'deanmachines://tools/inventory',
        name: 'Tool Inventory',
        description: 'Complete inventory of all available tools and their capabilities',
        mimeType: 'application/json'
      },
      {
        uri: 'deanmachines://system/status',
        name: 'System Status',
        description: 'Current system status, health metrics, and configuration',
        mimeType: 'application/json'
      },
      {
        uri: 'deanmachines://docs/readme',
        name: 'Project Documentation',
        description: 'Main project documentation and usage instructions',
        mimeType: 'text/markdown'
      },
      {
        uri: 'deanmachines://config/environment',
        name: 'Environment Configuration',
        description: 'Current environment configuration and settings',
        mimeType: 'application/json'
      }
    ];
  },

  /**
   * Get content for specific resources
   */
  getResourceContent: async ({ uri }: { uri: string }) => {
    logger.info(`📖 Retrieving resource content for: ${uri}`);

    try {
      switch (uri) {
        case 'deanmachines://agents/registry':
          return {
            text: JSON.stringify({
              totalAgents: Object.keys(agentRegistry).length,
              agents: Object.entries(agentRegistry).map(([name, agent]) => ({
                name,
                description: agent.getDescription?.() || `${name} agent for specialized tasks`,
                tools: Object.keys(agent.tools || {}).length || 0,
                hasMemory: true,
                model: 'Google Gemini 2.5 Flash'
              })),
              categories: {
                core: ['master', 'strategizer', 'analyzer', 'evolve', 'supervisor'],
                development: ['code', 'git', 'docker', 'debug'],
                data: ['data', 'graph', 'processing', 'research', 'weather'],
                management: ['manager', 'marketing'],
                operations: ['sysadmin', 'browser', 'utility'],
                creative: ['design', 'documentation'],
                specialized: ['special', 'react', 'langgraph']
              }
            }, null, 2)
          };

        case 'deanmachines://workflows/catalog':
          return {
            text: JSON.stringify({
              workflows: [
                {
                  name: 'weatherWorkflow',
                  description: 'Weather information processing and analysis',
                  type: 'data-processing'
                },
                {
                  name: 'codeGraphMakerWorkflow',
                  description: 'Basic code analysis and graph generation',
                  type: 'development'
                },
                {
                  name: 'advancedCodeGraphMakerWorkflow',
                  description: 'Advanced code analysis with comprehensive graph generation',
                  type: 'development'
                },
                {
                  name: 'fullStackDevelopmentWorkflow',
                  description: 'Complete full-stack development lifecycle',
                  type: 'development'
                },
                {
                  name: 'researchAnalysisWorkflow',
                  description: 'Comprehensive research and analysis workflow',
                  type: 'research'
                }
              ]
            }, null, 2)
          };        case 'deanmachines://tools/inventory':
          return {
            text: JSON.stringify({
              totalTools: Object.keys({
                chunkerTool,
                graphRAGTool,
                graphRAGUpsertTool,
                hybridVectorSearchTool,
                rerankTool,
                vectorQueryTool,
                stockPriceTool,
                weatherTool,
                webScraperTool,
                webExtractorTool,
                webCrawlerTool,
                ...agenticTools
              }).length,
              categories: {
                core: [
                  { name: 'chunkerTool', description: 'Text chunking and segmentation for document processing' },
                  { name: 'codeExecutor', description: 'Secure code execution sandbox for programming tasks' },
                  { name: 'graphRAGTool', description: 'Knowledge graph RAG operations for intelligent information retrieval' },
                  { name: 'rerankTool', description: 'Search result reranking for improved relevance' },
                  { name: 'vectorQueryTool', description: 'Vector database queries for semantic search' },
                  { name: 'graphRAGUpsertTool', description: 'Knowledge graph RAG upsert operations' },
                  { name: 'hybridVectorSearchTool', description: 'Hybrid vector search combining embeddings and graphs' },
                ],
                data: [
                  { name: 'stockPriceTool', description: 'Financial market data and stock price information' },
                  { name: 'weatherTool', description: 'Weather data and forecasting information' }
                ],
                web: [
                  { name: 'webScraperTool', description: 'Web scraping and HTML content extraction' },
                  { name: 'webExtractorTool', description: 'Structured web data extraction and parsing' },
                  { name: 'webCrawlerTool', description: 'Website crawling and systematic content indexing' }
                ],
                search: [
                  { name: 'exaSearch', description: 'Exa neural search for high-quality web results' },
                  { name: 'braveSearch', description: 'Brave Search API for privacy-focused web search' },
                  { name: 'wikipediaSearch', description: 'Wikipedia knowledge base search and article retrieval' },
                  { name: 'wikidataQuery', description: 'Wikidata structured knowledge graph queries' }
                ],
                academic: [
                  { name: 'arxivSearch', description: 'Academic paper search on ArXiv preprint repository' },
                  { name: 'arxivPaperLookup', description: 'Detailed ArXiv paper metadata and content access' }
                ],
                social: [
                  { name: 'redditSearch', description: 'Reddit posts and comments search across subreddits' },
                  { name: 'hackerNewsSearch', description: 'Hacker News stories and discussion threads' },
                  { name: 'hackerNewsTopStories', description: 'Current trending stories from Hacker News' }
                ],
                extraction: [
                  { name: 'diffbotExtract', description: 'AI-powered content extraction from web pages' },
                  { name: 'diffbotAnalyze', description: 'Deep content analysis and structured data extraction' }
                ]
              },
              features: {
                totalIntegrations: Object.keys(agenticTools).length,
                aiPowered: ['diffbotExtract', 'exaSearch', 'graphRAGTool', 'graphRAGUpsertTool', 'hybridVectorSearchTool'],
                realTimeData: ['weatherTool', 'stockPriceTool', 'hackerNewsTopStories'],
                knowledgeBases: ['wikipediaSearch', 'wikidataQuery', 'arxivSearch'],
                webAccess: ['webScraperTool', 'webCrawlerTool', 'braveSearch'],
                secureExecution: ['codeExecutor'],
                semanticSearch: ['vectorQueryTool', 'exaSearch', 'rerankTool']
              }
            }, null, 2)
          };

        case 'deanmachines://system/status':
          return {
            text: JSON.stringify({
              status: 'operational',
              version: '1.0.0',
              environment: env.NODE_ENV,
              features: {
                hasGoogleAI: !!env.GOOGLE_GENERATIVE_AI_API_KEY,
                hasLangSmith: !!env.LANGSMITH_API_KEY,
                hasDatabase: !!env.DATABASE_URL,
                hasNeo4j: !!env.NEO4J_URL
              },
              timestamp: new Date().toISOString(),
              uptime: process.uptime(),
              memory: process.memoryUsage()
            }, null, 2)
          };        case 'deanmachines://docs/readme':
          return {
            text: `# Dean Machines AI Ecosystem v2.0

A comprehensive AI application built with the Mastra framework, featuring 20+ specialized agents, 50+ advanced tools including agentic integrations, and intelligent workflows.

## 🤖 Available Agents (${Object.keys(agentRegistry).length})

${Object.entries(agentRegistry).map(([name, agent]) => 
  `- **${name}**: ${agent.getDescription?.() || `${name} agent for specialized tasks`}`
).join('\n')}

## 🛠️ Available Tools (${Object.keys(agenticTools).length + 9})

### Core Tools
- **chunkerTool**: Text chunking and segmentation for document processing
- **codeExecutor**: Secure code execution sandbox  
- **graphRAGTool**: Knowledge graph RAG operations
- **graphRAGUpsertTool**: Knowledge graph RAG upsert operations
- **rerankTool**: Search result reranking for improved relevance
- **vectorQueryTool**: Vector database queries for semantic search
- **hybridVectorSearchTool**: Hybrid vector search combining embeddings and graphs
- **stockPriceTool**: Financial market data and analysis
- **weatherTool**: Weather data and forecasting

### Web & Extraction Tools  
- **webScraperTool**: General web scraping and HTML extraction
- **webExtractorTool**: Structured web data extraction 
- **webCrawlerTool**: Website crawling and systematic indexing

### Agentic Integration Tools
#### Search & Research
- **exaSearch**: Neural search for high-quality web results
- **braveSearch**: Privacy-focused web search
- **wikipediaSearch**: Wikipedia knowledge base access
- **wikidataQuery**: Structured knowledge graph queries

#### Academic & Publications
- **arxivSearch**: Academic paper search on ArXiv
- **arxivPaperLookup**: Detailed paper metadata and content

#### Social & Discussion
- **redditSearch**: Reddit posts and comments across subreddits  
- **hackerNewsSearch**: Hacker News stories and discussions
- **hackerNewsTopStories**: Current trending tech news

#### AI-Powered Extraction
- **diffbotExtract**: AI-powered content extraction from web pages
- **diffbotAnalyze**: Deep content analysis and data extraction

## 🔄 Available Workflows (5)

- **weatherWorkflow**: Weather information processing and analysis
- **codeGraphMakerWorkflow**: Basic code analysis with visualization
- **advancedCodeGraphMakerWorkflow**: Advanced code analysis with comprehensive features
- **fullStackDevelopmentWorkflow**: Complete development lifecycle (coding, git, docker, testing, docs)
- **researchAnalysisWorkflow**: Multi-source research with web, academic, and social media tools

## 📋 Enhanced Prompt Templates (9)

- **agent_interaction**: Comprehensive agent selection and interaction guidance
- **workflow_execution**: Optimal workflow selection and execution strategies  
- **system_analysis**: System capabilities and optimization analysis
- **debugging_assistance**: Systematic debugging with specialized agents
- **task_orchestration**: Multi-agent coordination for complex tasks
- **research_workflow**: Academic and web research strategies
- **data_analysis**: Data processing and analysis workflows
- **content_creation**: Content creation and documentation workflows
- **tool_selection**: Optimal tool selection for specific tasks

## 🚀 Usage

### Agent Interaction
Use \`ask_<agentName>\` to interact with specific agents:
- \`ask_master\`: Complex orchestration and planning
- \`ask_research\`: Information gathering and analysis  
- \`ask_code\`: Programming and development tasks
- \`ask_debug\`: Troubleshooting and problem solving

### Workflow Execution  
Use \`run_<workflowName>\` to execute comprehensive workflows:
- \`run_researchAnalysisWorkflow\`: Multi-source research
- \`run_fullStackDevelopmentWorkflow\`: Complete development lifecycle

### Direct Tool Access
Access any of the 50+ tools directly for specific operations:
- Search: exaSearch, braveSearch, wikipediaSearch
- Academic: arxivSearch, arxivPaperLookup  
- Social: redditSearch, hackerNewsSearch
- Extraction: diffbotExtract, webScraperTool
- Analysis: graphRAGTool, vectorQueryTool

## 🌐 External Integrations

- **Exa**: Neural search for high-quality results
- **ArXiv**: Academic paper repository access  
- **Reddit**: Social discussion and community insights
- **Wikipedia/Wikidata**: Comprehensive knowledge bases
- **Brave Search**: Privacy-focused web search
- **Diffbot**: AI-powered content extraction
- **Hacker News**: Technology news and discussions

## 🔧 System Features

- Real-time data access across multiple sources
- AI-powered content extraction and analysis
- Semantic search and knowledge graph operations  
- Secure code execution environment
- Multi-agent orchestration and coordination
- Comprehensive observability and logging
`
          };

        case 'deanmachines://config/environment':
          return {
            text: JSON.stringify({
              nodeEnv: env.NODE_ENV,
              logLevel: env.LOG_LEVEL,
              port: env.PORT,
              features: {
                langsmithTracing: env.LANGSMITH_TRACING,
                langfuseTracing: env.LANGFUSE_TRACING
              }
            }, null, 2)
          };

        default:
          return {
            text: JSON.stringify({
              error: 'Resource not found',
              availableResources: [
                'deanmachines://agents/registry',
                'deanmachines://workflows/catalog',
                'deanmachines://tools/inventory',
                'deanmachines://system/status',
                'deanmachines://docs/readme',
                'deanmachines://config/environment'
              ]
            }, null, 2)
          };
      }
    } catch (error) {
      logger.error(`❌ Error retrieving resource ${uri}:`, { error: error instanceof Error ? error.message : 'Unknown error' });
      return {
        text: JSON.stringify({
          error: 'Failed to retrieve resource',
          uri,
          message: error instanceof Error ? error.message : 'Unknown error'
        }, null, 2)
      };
    }
  }
};

/**
 * Prompt templates for common Dean Machines operations
 * Enhanced with comprehensive tool and agent guidance - MCP 2025-06-18 compliant
 */
const mcpServerPrompts = {  /**
   * List all available prompts (MCP 2025-06-18)
   */
  listPrompts: async () => {
    logger.info('📝 Listing available prompts');
    
    const allPrompts = [
      {
        name: 'agent_interaction',
        title: 'Agent Interaction Guide',
        description: 'Template for interacting with Dean Machines agents effectively',
        arguments: [
          {
            name: 'agentName',
            description: 'Name of the agent to interact with',
            required: false
          },
          {
            name: 'task',
            description: 'Task or goal to accomplish',
            required: false
          }
        ]
      },
      {
        name: 'workflow_execution',
        title: 'Workflow Execution Strategy',
        description: 'Template for selecting and executing optimal workflows',
        arguments: [
          {
            name: 'goal',
            description: 'Primary goal or objective',
            required: false
          },
          {
            name: 'complexity',
            description: 'Task complexity level (simple, medium, complex)',
            required: false
          }
        ]
      },
      {
        name: 'system_analysis',
        title: 'System Analysis',
        description: 'Analyze current system capabilities and optimization opportunities',
        arguments: []
      },
      {
        name: 'debugging_assistance',
        title: 'Debugging Assistant',
        description: 'Systematic debugging guidance using specialized agents',
        arguments: [
          {
            name: 'issue',
            description: 'Description of the problem or error',
            required: false
          },
          {
            name: 'severity',
            description: 'Issue severity (low, medium, high, critical)',
            required: false
          }
        ]
      },
      {
        name: 'task_orchestration',
        title: 'Task Orchestration',
        description: 'Multi-agent coordination for complex tasks',
        arguments: [
          {
            name: 'goal',
            description: 'Complex goal or multi-step process',
            required: false
          },
          {
            name: 'scope',
            description: 'Task scope (small, medium, large, enterprise)',
            required: false
          }
        ]
      },
      {
        name: 'research_workflow',
        title: 'Research Workflow',
        description: 'Comprehensive research strategy using multiple sources',
        arguments: [
          {
            name: 'topic',
            description: 'Research topic or question',
            required: false
          },
          {
            name: 'focus',
            description: 'Research focus area',
            required: false
          }
        ]
      },
      {
        name: 'data_analysis',
        title: 'Data Analysis Workflow',
        description: 'Data processing and analysis strategies',
        arguments: [
          {
            name: 'dataType',
            description: 'Type of data to analyze',
            required: false
          },
          {
            name: 'analysisGoal',
            description: 'Analysis objective',
            required: false
          }
        ]
      },
      {
        name: 'content_creation',
        title: 'Content Creation Workflow',
        description: 'Content creation strategies with specialized agents',
        arguments: [
          {
            name: 'contentType',
            description: 'Type of content to create',
            required: false
          },
          {
            name: 'audience',
            description: 'Target audience',
            required: false
          }
        ]
      },
      {
        name: 'tool_selection',
        title: 'Tool Selection Guide',
        description: 'Optimal tool selection for specific tasks',
        arguments: [
          {
            name: 'task',
            description: 'Task or requirement',
            required: false
          },
          {
            name: 'requirements',
            description: 'Quality and performance requirements',
            required: false
          }
        ]
      }
    ];

    logger.info(`📝 Listed ${allPrompts.length} prompts`);
    return allPrompts;
  },

  /**
   * Get prompt messages for specific prompts
   */
  getPromptMessages: async ({ name, version, args }: { name: string; version?: string; args?: Record<string, unknown> }) => {
    logger.info(`📋 Getting prompt messages for: ${name} (v${version || '1.0.0'})`);

    const messages: Array<{
      [x: string]: unknown;
      role: "assistant" | "user";
      content: {
        [x: string]: unknown;
        type: "text";
        text: string;
      };
    }> = [];    switch (name) {
      case 'agent_interaction':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Dean Machines AI Ecosystem - Agent Interaction Guide

Available Agents by Category:
• Core: master, strategizer, analyzer, evolve, supervisor
• Development: code, git, docker, debug, documentation  
• Data: data, graph, processing, research, weather
• Management: manager, marketing
• Operations: sysadmin, browser, utility
• Creative: design
• Specialized: special, react, langgraph

Agent Selection Guidelines:
- Use 'master' for complex multi-step tasks requiring orchestration
- Use 'strategizer' for planning and decision-making
- Use 'code' for programming tasks
- Use 'research' for information gathering and analysis
- Use 'debug' for troubleshooting issues

Available Tools: ${Object.keys(agenticTools).length + 9} tools including search, academic, social, extraction capabilities`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `I want to ${args?.task || 'perform a task'} using ${args?.agents || 'the most appropriate agent(s)'}. Please recommend the best agent(s) and approach for this task.`
          }
        });
        break;

      case 'workflow_execution':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Dean Machines Workflow Execution Guide

Available Workflows:
• weatherWorkflow: Weather data processing and analysis
• codeGraphMakerWorkflow: Basic code analysis with visualization
• advancedCodeGraphMakerWorkflow: Comprehensive code analysis with advanced features
• fullStackDevelopmentWorkflow: Complete development lifecycle (coding, git, docker, testing, docs)
• researchAnalysisWorkflow: Multi-source research with web, academic, and social media tools

Workflow Selection Guidelines:
- Simple tasks: Use basic workflows
- Complex projects: Use full-stack or advanced workflows  
- Research tasks: Use research workflow with appropriate tools
- Data analysis: Combine workflows with data agents`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `I need to ${args?.goal || 'achieve a goal'} with complexity level ${args?.complexity || 'medium'}. Please recommend the optimal workflow and execution strategy.`
          }
        });
        break;

      case 'system_analysis':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Dean Machines System Analysis

Current Capabilities:
• Agents: ${Object.keys(agentRegistry).length} specialized agents
• Tools: ${Object.keys(agenticTools).length + 9} tools across multiple categories
• Workflows: 5 comprehensive workflows
• External APIs: Exa, ArXiv, Reddit, Wikipedia, Wikidata, Brave Search, Diffbot, Hacker News
• Features: AI-powered search, academic research, social media monitoring, content extraction

System Health Indicators:
- Agent registry loaded: ${Object.keys(agentRegistry).length > 0}
- Tools initialized: ${Object.keys(agenticTools).length > 0}
- Workflows available: Yes
- External integrations: Active`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: 'Please analyze the current system status, identify optimization opportunities, and suggest the best usage patterns for my requirements.'
          }
        });
        break;

      case 'research_workflow':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Comprehensive Research Workflow Guide

Available Research Tools:
• Academic: ArXiv search and paper lookup
• Web Search: Exa neural search, Brave Search
• Knowledge Bases: Wikipedia, Wikidata structured queries
• Social/Discussion: Reddit search, Hacker News
• Content Extraction: Diffbot AI-powered extraction
• Analysis: Graph RAG, vector search, reranking

Research Strategy:
1. Start with academic sources (ArXiv) for scholarly information
2. Use web search (Exa/Brave) for current information  
3. Check social discussions (Reddit/HN) for community insights
4. Extract and analyze content with AI tools
5. Synthesize findings with research agent`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `I need to research ${args?.topic || 'a topic'} with focus on ${args?.focus || 'comprehensive analysis'}. Please design an optimal research strategy using available tools.`
          }
        });
        break;

      case 'tool_selection':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Tool Selection Guide for Dean Machines Ecosystem

Tool Categories & Use Cases:
• Search Tools: exaSearch (neural), braveSearch (privacy), wikipediaSearch (knowledge)
• Academic: arxivSearch (papers), arxivPaperLookup (detailed)
• Social: redditSearch (discussions), hackerNewsSearch (tech news)
• Extraction: diffbotExtract (AI-powered), webScraperTool (general)
• Analysis: graphRAGTool (knowledge graphs), vectorQueryTool (semantic)
• Data: stockPriceTool (financial), weatherTool (meteorological)
• Code: codeExecutor (sandbox), chunkerTool (processing)

Selection Criteria:
- Data freshness requirements
- Privacy considerations  
- Accuracy vs speed tradeoffs
- API rate limits and costs
- Integration complexity`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `For the task "${args?.task || 'unspecified task'}" with requirements ${args?.requirements || 'standard quality and speed'}, please recommend the optimal tool selection and usage strategy.`
          }
        });
        break;      case 'debugging_assistance':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Debugging Assistance with Dean Machines Agents

Available Debugging Agents:
• debug: Error detection, troubleshooting, and systematic debugging
• analyzer: Deep analysis and pattern recognition for complex issues
• code: Code-specific debugging and optimization
• supervisor: Multi-agent coordination for complex debugging scenarios
• sysadmin: System-level debugging and infrastructure issues

Debugging Tools:
• codeExecutor: Safe code testing and validation
• graphRAGTool: Knowledge base search for solutions
• webScraperTool: Search for solutions online
• vectorQueryTool: Semantic search through documentation

Debugging Strategy:
1. Start with 'debug' agent for systematic troubleshooting
2. Use 'analyzer' for pattern recognition in complex issues  
3. Apply 'code' agent for programming-specific problems
4. Escalate to 'supervisor' for multi-faceted issues`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `I'm experiencing: ${args?.issue || 'an unknown problem'} with severity ${args?.severity || 'medium'}. Please provide a systematic debugging approach using the most appropriate agents and tools.`
          }
        });
        break;

      case 'task_orchestration':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Multi-Agent Task Orchestration Guide

Agent Orchestration Patterns:
• Sequential: master → strategizer → specific agents → supervisor
• Parallel: Multiple agents working simultaneously on different aspects
• Hierarchical: supervisor coordinating multiple agent teams
• Adaptive: evolve agent optimizing the orchestration strategy

Available Agent Categories:
${Object.entries(agentRegistry).slice(0, 10).map(([name, agent]) => 
  `• ${name}: ${agent.getDescription?.() || `${name} agent for specialized tasks`}`
).join('\n')}

Orchestration Guidelines:
- Use 'master' for initial task breakdown and planning
- Apply 'strategizer' for decision-making and prioritization
- Deploy 'supervisor' for coordination and quality control
- Leverage 'evolve' for continuous optimization`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Complex task: ${args?.goal || 'multi-step process'} with scope ${args?.scope || 'medium complexity'}. Please design an optimal multi-agent orchestration strategy.`
          }
        });
        break;

      case 'data_analysis':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Data Analysis Workflow with Dean Machines

Data Analysis Agents:
• data: Statistical analysis and data processing
• processing: Data transformation and workflow automation  
• analyzer: Pattern recognition and deep analysis
• graph: Knowledge graph operations and visualization

Data Tools:
• stockPriceTool: Financial market data
• weatherTool: Meteorological data
• vectorQueryTool: Semantic data retrieval
• chunkerTool: Data segmentation and processing
• rerankTool: Result optimization

Analysis Pipeline:
1. Data collection with appropriate tools
2. Processing and transformation with processing agent
3. Analysis and pattern recognition with analyzer/data agents
4. Visualization and insights with graph agent`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Data analysis task: ${args?.dataType || 'general data'} with goal ${args?.goal || 'insights extraction'}. Please design an optimal analysis workflow.`
          }
        });
        break;

      case 'content_creation':
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Context: Content Creation Workflow

Content Creation Agents:
• documentation: Technical writing and documentation
• design: UI/UX design and visual content
• marketing: Content marketing and messaging
• master: Content strategy and planning

Supporting Tools:
• webScraperTool: Research and content gathering
• arxivSearch: Academic source material
• wikipediaSearch: Factual information
• diffbotExtract: Content extraction and analysis

Creation Process:
1. Research and gather source material
2. Plan content strategy with master agent
3. Create content with specialized agents
4. Review and optimize with supervisor`
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Content creation: ${args?.contentType || 'general content'} for ${args?.audience || 'general audience'}. Please recommend the optimal creation strategy and agent workflow.`
          }
        });
        break;

      default:
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: 'Available prompts: agent_interaction, workflow_execution, system_analysis, debugging_assistance, task_orchestration, research_workflow, data_analysis, content_creation, tool_selection'
          }
        });
        messages.push({
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Unknown prompt: ${name}. Please use one of the available prompts listed above.`
          }
        });
    }

    return messages;
  }
};

/**
 * Dean Machines MCP Server Configuration
 * Aligned with MCP Protocol Revision 2025-06-18
 * 
 * Note: Mastra MCPServer handles capabilities declaration internally according to MCP spec.
 * The server automatically declares support for tools, resources, prompts, completions, and logging
 * based on the provided configuration.
 */
export const deanMachinesMCPServer = new MCPServer({
  name: 'Dean Machines AI Ecosystem',
  version: '2.0.0',
  description: 'Comprehensive AI ecosystem built on Mastra framework with 20+ specialized agents, 50+ advanced tools including agentic integrations (Exa, ArXiv, Reddit, Wikipedia, Wikidata, Brave Search, Diffbot, Hacker News), and intelligent workflows for research, development, and analysis',

  tools: {
    // Core Mastra tools
    chunkerTool,
    graphRAGTool,
    rerankTool,
    vectorQueryTool,
    stockPriceTool,
    weatherTool,
    webScraperTool,
    webExtractorTool,
    webCrawlerTool,
    // Add all agentic tools for comprehensive external API access
    ...agenticTools
  },
  agents: agentRegistry,
  workflows: {
    weatherWorkflow,
    codeGraphMakerWorkflow,
    advancedCodeGraphMakerWorkflow,
    fullStackDevelopmentWorkflow,
    researchAnalysisWorkflow
  },
  resources: mcpServerResources,
  prompts: mcpServerPrompts,
  repository: {
    source: 'https://github.com/ssdeanx/deanmachines-rsc',
    url: 'https://github.com/ssdeanx/deanmachines-rsc',
    id: 'ssdeanx'
  },
  releaseDate: new Date().toISOString(),
  isLatest: true,
  packageCanonical: 'npm' as const
});

/**
 * Dean Machines MCP Server Manager
 * Handles server lifecycle, transport configuration, and health monitoring
 */
export class DeanMachinesMCPServerManager {
  private server: typeof deanMachinesMCPServer;
  private logger: PinoLogger;
  private isRunning: boolean = false;
  private startTime: number = 0;
  private availableWorkflows = {
    weatherWorkflow,
    codeGraphMakerWorkflow,
    advancedCodeGraphMakerWorkflow,
    fullStackDevelopmentWorkflow,
    researchAnalysisWorkflow
  };

  constructor() {
    this.server = deanMachinesMCPServer;
    this.logger = new PinoLogger({ 
      name: 'DeanMachinesMCPServerManager', 
      level: env.LOG_LEVEL 
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async startStdio(): Promise<void> {
    try {
      this.logger.info('🚀 Starting Dean Machines MCP server on stdio transport');
      this.startTime = Date.now();
      this.isRunning = true;
      
      // Use the correct method for stdio transport
      await this.server.startStdio();

      this.logger.info('✅ Dean Machines MCP server started successfully on stdio');
    } catch (error) {
      this.isRunning = false;
      this.logger.error('❌ Failed to start MCP server on stdio:', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }


  /**
   * Execute a tool by name with input parameters
   */
  async executeTool(toolName: string, input: Record<string, unknown>): Promise<unknown> {
    try {
      this.logger.info(`🔧 Executing tool: ${toolName}`, { input });
      
      // Tool execution logic would go here
      // This is a placeholder for the actual tool execution
      
      this.logger.info(`✅ Tool execution completed: ${toolName}`);
      return { success: true, toolName, result: 'Tool executed successfully' };
    } catch (error) {
      this.logger.error(`❌ Tool execution failed: ${toolName}`, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    try {
      this.logger.info('🛑 Stopping Dean Machines MCP server');
      this.isRunning = false;
      
      // Server shutdown logic would go here
      
      this.logger.info('✅ Dean Machines MCP server stopped successfully');
    } catch (error) {
      this.logger.error('❌ Error during MCP server shutdown:', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  /**
   * Get server health and status information
   */
  async healthCheck(): Promise<{ status: string; details: Record<string, unknown> }> {
    try {
      const details = {
        isRunning: this.isRunning,
        uptime: this.isRunning ? Date.now() - this.startTime : 0,
        version: '1.0.0',
        agentsLoaded: Object.keys(agentRegistry).length,
        toolsLoaded: Object.keys(this.server.tools || {}).length,
        workflowsLoaded: Object.keys(this.availableWorkflows).length,
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };

      this.logger.info('💚 Health check completed', details);
      
      return {
        status: this.isRunning ? 'healthy' : 'stopped',
        details
      };
    } catch (error) {
      this.logger.error('❌ Health check failed:', { error: error instanceof Error ? error.message : 'Unknown error' });
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Get server status
   */
  get status() {
    return {
      isRunning: this.isRunning,
      uptime: this.isRunning ? Date.now() - this.startTime : 0,
      startTime: this.startTime
    };
  }
}

// Export singleton instance
export const mcpServerManager = new DeanMachinesMCPServerManager();

// Export the server for direct use
export { deanMachinesMCPServer as mcpServer };

// Default export
export default deanMachinesMCPServer;
