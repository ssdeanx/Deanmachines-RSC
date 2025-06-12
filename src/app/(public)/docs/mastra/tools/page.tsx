'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wrench,
  Code,
  Copy,
  Zap,
  Database,
  Settings,
  Cloud,
  Search,
  FileText,
  Info,
  TrendingUp,
  Globe
} from 'lucide-react';
import Link from 'next/link';

/**
 * Mastra Tools documentation page
 *
 * Comprehensive guide covering:
 * - Available tools and MCP integrations
 * - Tool creation and configuration
 * - Integration with agents
 * - Best practices and examples
 *
 * @returns {JSX.Element} The rendered Mastra tools documentation page
 */
export default function MastraToolsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const availableTools = [
    {
      name: "Stock Tools",
      description: "Real-time stock market data and analysis",
      icon: <TrendingUp className="w-5 h-5" />,
      capabilities: ["Stock Prices", "Market Data", "Financial Analysis"],
      file: "src/mastra/tools/stock-tools.ts",
      badge: "Financial",
      mcpIntegration: false
    },
    {
      name: "Weather Tools",
      description: "Weather information and forecasting",
      icon: <Cloud className="w-5 h-5" />,
      capabilities: ["Current Weather", "Forecasts", "Location Data"],
      file: "src/mastra/tools/weather-tools.ts",
      badge: "API",
      mcpIntegration: false
    },
    {
      name: "Web Search MCP",
      description: "DuckDuckGo search integration via MCP",
      icon: <Search className="w-5 h-5" />,
      capabilities: ["Web Search", "Content Fetching", "Information Retrieval"],
      file: "MCP Server Integration",
      badge: "MCP",
      mcpIntegration: true
    },
    {
      name: "Filesystem MCP",
      description: "File system operations via MCP",
      icon: <FileText className="w-5 h-5" />,
      capabilities: ["File Operations", "Directory Management", "Content Reading"],
      file: "MCP Server Integration",
      badge: "MCP",
      mcpIntegration: true
    },
    {
      name: "Memory MCP",
      description: "Knowledge graph and memory operations",
      icon: <Database className="w-5 h-5" />,
      capabilities: ["Entity Management", "Relationship Mapping", "Knowledge Storage"],
      file: "MCP Server Integration",
      badge: "MCP",
      mcpIntegration: true
    },
    {
      name: "Browser MCP",
      description: "Web browser automation via Playwright",
      icon: <Globe className="w-5 h-5" />,
      capabilities: ["Web Automation", "Page Interaction", "Screenshot Capture"],
      file: "MCP Server Integration",
      badge: "MCP",
      mcpIntegration: true
    }
  ];

  const toolCreationExample = `import { createTool } from '@mastra/core';
import { z } from 'zod';

/**
 * Stock price lookup tool
 *
 * Fetches real-time stock price data for a given symbol
 */
export const getStockPrice = createTool({
  id: 'get-stock-price',
  description: 'Get current stock price for a given symbol',
  inputSchema: z.object({
    symbol: z.string().describe('Stock symbol (e.g., AAPL, GOOGL)'),
    exchange: z.string().optional().describe('Stock exchange (optional)')
  }),
  outputSchema: z.object({
    symbol: z.string().describe('Stock symbol'),
    price: z.number().describe('Current stock price'),
    change: z.number().describe('Price change'),
    changePercent: z.number().describe('Percentage change'),
    lastUpdated: z.string().describe('Last update timestamp')
  }),
  execute: async ({ symbol, exchange }) => {
    try {
      // Implementation logic here
      const stockData = await fetchStockData(symbol, exchange);

      return {
        symbol: stockData.symbol,
        price: stockData.currentPrice,
        change: stockData.priceChange,
        changePercent: stockData.changePercent,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(\`Failed to fetch stock data: \${error.message}\`);
    }
  }
});

// Export tools object for agent integration
export const stockTools = {
  getStockPrice,
  // ... other stock-related tools
};`;

  const mcpIntegrationExample = `// mastra.config.ts
import { Mastra } from '@mastra/core';
import { createMcpIntegration } from '@mastra/mcp';

export const mastra = new Mastra({
  agents: [
    // ... your agents
  ],
  integrations: [
    // MCP Server integrations
    createMcpIntegration({
      name: 'web-search',
      serverPath: 'npx -y @modelcontextprotocol/server-everything',
    }),
    createMcpIntegration({
      name: 'filesystem',
      serverPath: 'npx -y @modelcontextprotocol/server-filesystem',
    }),
    createMcpIntegration({
      name: 'memory',
      serverPath: 'npx -y @modelcontextprotocol/server-memory',
    })
  ]
});`;

  const agentToolIntegration = `import { Agent } from '@mastra/core';
import { stockTools } from '../tools/stock-tools';
import { weatherTools } from '../tools/weather-tools';

export const dataAgent = new Agent({
  name: 'Data Analysis Agent',
  instructions: \`You are a data analysis expert that can:

  - Fetch and analyze stock market data
  - Get weather information for analysis
  - Perform statistical calculations
  - Generate insights and recommendations

  Always provide accurate, up-to-date information and explain your analysis.\`,
    model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
      name: 'data-agent',
      tags: ['agent', 'data', 'analysis', 'statistics'],
      thinkingConfig: {
        thinkingBudget: 0,
        includeThoughts: false,
      },
    }),  tools: {
      graphTool,
      vectorQueryTool,
      stockPriceTool,
      ...await mcp.getTools(),
    },
    memory: agentMemory
  });
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mastra <span className="text-primary text-glow">Tools & MCP</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Extend your agents with powerful tools and Model Context Protocol (MCP) integrations for enhanced capabilities.
          </p>
        </motion.div>

        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Tool Architecture
              </CardTitle>
              <CardDescription>
                Understanding tools and MCP integrations in Mastra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Code className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Custom Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Build specialized tools with Zod validation and TypeScript safety
                  </p>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Settings className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">MCP Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Leverage Model Context Protocol for standardized tool access
                  </p>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Auto-Discovery</h4>
                  <p className="text-sm text-muted-foreground">
                    Tools are automatically available to agents through MCP servers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Available Tools */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
              <CardDescription>
                Custom tools and MCP integrations ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 glass-effect rounded-lg hover:electric-pulse transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {tool.icon}
                        <h4 className="font-semibold">{tool.name}</h4>
                      </div>
                      <Badge variant={tool.mcpIntegration ? "default" : "outline"}>
                        {tool.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {tool.capabilities.map((cap, capIndex) => (
                          <Badge key={capIndex} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <code className="text-xs text-muted-foreground">{tool.file}</code>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Code Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Implementation Examples
              </CardTitle>
              <CardDescription>
                Learn how to create and integrate tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="custom" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="custom">Custom Tool</TabsTrigger>
                  <TabsTrigger value="mcp">MCP Integration</TabsTrigger>
                  <TabsTrigger value="agent">Agent Integration</TabsTrigger>
                </TabsList>

                <TabsContent value="custom" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{toolCreationExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(toolCreationExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="mcp" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{mcpIntegrationExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(mcpIntegrationExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="agent" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{agentToolIntegration}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(agentToolIntegration)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        {/* Best Practices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>
                Guidelines for effective tool development and integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>MCP Integration:</strong> MCP tools are automatically discovered and made available to all agents. No manual registration required.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">✓ Best Practices</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use Zod for input/output validation</li>
                      <li>• Provide clear tool descriptions</li>
                      <li>• Handle errors gracefully</li>
                      <li>• Use TypeScript for type safety</li>
                      <li>• Document tool capabilities</li>
                      <li>• Test tools independently</li>
                    </ul>
                  </div>
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-destructive">✗ Common Pitfalls</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Skipping input validation</li>
                      <li>• Unclear tool descriptions</li>
                      <li>• Not handling API failures</li>
                      <li>• Overly complex tool logic</li>
                      <li>• Missing error messages</li>
                      <li>• Ignoring rate limits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Card className="glass-effect-strong electric-pulse">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Ready to Build Tools?</h3>
              <p className="text-muted-foreground mb-6">
                Explore memory systems and workflows to create comprehensive agent solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="glass-effect-strong electric-pulse">
                  <Link href="/docs/mastra/memory">
                    <Database className="w-4 h-4 mr-2" />
                    Memory Systems
                  </Link>
                </Button>
                <Button variant="outline" asChild className="lightning-trail">
                  <Link href="/docs/mastra/workflows">
                    <Settings className="w-4 h-4 mr-2" />
                    Workflows
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
