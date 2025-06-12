'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Code,
  Copy,
  Zap,
  Database,
  Settings,
  GitBranch,
  Cloud,
  Search,
  FileText,
  BarChart3,
  Info
} from 'lucide-react';
import Link from 'next/link';

/**
 * Mastra Agents documentation page
 *
 * Comprehensive guide covering:
 * - Agent architecture and concepts
 * - Available agents in the system
 * - Creating custom agents
 * - Agent configuration and runtime contexts
 * - Integration patterns and best practices
 *
 * @returns {JSX.Element} The rendered Mastra agents documentation page
 */
export default function MastraAgentsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const availableAgents = [
    {
      name: "Master Agent",
      description: "Orchestrates and coordinates multiple specialized agents",
      icon: <Brain className="w-5 h-5" />,
      capabilities: ["Agent Coordination", "Task Delegation", "Context Management"],
      file: "src/mastra/agents/master-agent.ts",
      badge: "Core"
    },
    {
      name: "Weather Agent",
      description: "Provides real-time weather information and forecasts",
      icon: <Cloud className="w-5 h-5" />,
      capabilities: ["Current Weather", "Forecasts", "Location-based Data"],
      file: "src/mastra/agents/weather-agent.ts",
      badge: "API"
    },
    {
      name: "Git Agent",
      description: "Handles Git repository operations and analysis",
      icon: <GitBranch className="w-5 h-5" />,
      capabilities: ["Repository Cloning", "Commit Analysis", "Branch Management"],
      file: "src/mastra/agents/git-agent.ts",
      badge: "Tools"
    },
    {
      name: "Code Agent",
      description: "Analyzes and processes code files and structures",
      icon: <Code className="w-5 h-5" />,
      capabilities: ["Code Analysis", "Syntax Parsing", "Documentation Generation"],
      file: "src/mastra/agents/code-agent.ts",
      badge: "Analysis"
    },
    {
      name: "Graph Agent",
      description: "Creates and manages dependency graphs and visualizations",
      icon: <BarChart3 className="w-5 h-5" />,
      capabilities: ["Dependency Mapping", "Graph Generation", "Visualization"],
      file: "src/mastra/agents/graph-agent.ts",
      badge: "Visualization"
    },
    {
      name: "Research Agent",
      description: "Conducts web research and information gathering",
      icon: <Search className="w-5 h-5" />,
      capabilities: ["Web Search", "Content Analysis", "Information Synthesis"],
      file: "src/mastra/agents/research-agent.ts",
      badge: "Research"
    },
    {
      name: "Documentation Agent",
      description: "Generates and maintains project documentation",
      icon: <FileText className="w-5 h-5" />,
      capabilities: ["Doc Generation", "Content Writing", "Format Conversion"],
      file: "src/mastra/agents/documentation-agent.ts",
      badge: "Content"
    },
    {
      name: "Data Agent",
      description: "Processes and analyzes various data formats",
      icon: <Database className="w-5 h-5" />,
      capabilities: ["Data Processing", "Format Conversion", "Analysis"],
      file: "src/mastra/agents/data-agent.ts",
      badge: "Processing"
    }
  ];

  const agentCreationExample = `import { Agent } from '@mastra/core';
import { RuntimeContext } from '@mastra/core/di';
import { z } from 'zod';

// Define runtime context for the agent
const weatherRuntimeContext = new RuntimeContext({
  WEATHER_API_KEY: z.string().describe('OpenWeatherMap API key'),
  DEFAULT_LOCATION: z.string().default('New York').describe('Default location for weather queries')
});

// Create the weather agent
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: \`You are a helpful weather assistant that provides accurate weather information.

  You can:
  - Get current weather conditions for any location
  - Provide weather forecasts
  - Give weather-related advice

  Always be helpful and provide accurate information.\`,
 model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
      name: 'weather-agent',
      tags: ['agent', 'data', 'analysis', 'statistics'],
      thinkingConfig: {
        thinkingBudget: 0,
        includeThoughts: false,
      },
    }),  tools: {
      graphTool,
      vectorQueryTool,
      stockPriceTool,
      weatherTool,
      ...await mcp.getTools(),
    },
    memory: agentMemory
  });

// Register runtime context
weatherAgent.registerRuntimeContext(weatherRuntimeContext);`;

  const toolIntegrationExample = `import { createTool } from '@mastra/core';
import { z } from 'zod';

// Define a custom tool
export const customAnalysisTool = createTool({
  id: 'custom-analysis',
  description: 'Performs custom data analysis',
  inputSchema: z.object({
    data: z.array(z.any()).describe('Data to analyze'),
    analysisType: z.enum(['statistical', 'trend', 'correlation']).describe('Type of analysis')
  }),
  outputSchema: z.object({
    results: z.any().describe('Analysis results'),
    insights: z.array(z.string()).describe('Key insights')
  }),
  execute: async ({ data, analysisType }) => {
    // Implementation logic here
    return {
      results: processData(data, analysisType),
      insights: generateInsights(data)
    };
  }
});

// Add tool to agent
export const dataAgent = new Agent({
  name: 'Data Analysis Agent',
  instructions: 'You are a data analysis expert...',
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
  });`;

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
            Mastra <span className="text-primary text-glow">Agents</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build intelligent, autonomous agents with Mastra&apos;s powerful framework. Create specialized agents that can coordinate, learn, and adapt.
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
                <Brain className="w-5 h-5 text-primary" />
                Agent Architecture
              </CardTitle>
              <CardDescription>
                Understanding the core concepts of Mastra agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Autonomous</h4>
                  <p className="text-sm text-muted-foreground">
                    Agents operate independently with their own decision-making capabilities
                  </p>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Settings className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Configurable</h4>
                  <p className="text-sm text-muted-foreground">
                    Runtime contexts and tools can be customized for specific use cases
                  </p>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Database className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Memory-Enabled</h4>
                  <p className="text-sm text-muted-foreground">
                    Persistent memory allows agents to learn and maintain context
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Available Agents */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle>Available Agents</CardTitle>
              <CardDescription>
                Pre-built agents ready to use in your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAgents.map((agent, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 glass-effect rounded-lg hover:electric-pulse transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {agent.icon}
                        <h4 className="font-semibold">{agent.name}</h4>
                      </div>
                      <Badge variant="outline">{agent.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap, capIndex) => (
                          <Badge key={capIndex} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <code className="text-xs text-muted-foreground">{agent.file}</code>
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
                Creating Custom Agents
              </CardTitle>
              <CardDescription>
                Learn how to build your own specialized agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Agent</TabsTrigger>
                  <TabsTrigger value="tools">With Tools</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{agentCreationExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(agentCreationExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{toolIntegrationExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(toolIntegrationExample)}
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
                Guidelines for building effective agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Runtime Contexts:</strong> Always define runtime contexts within individual agent files rather than centrally. This follows Mastra&apos;s pattern and ensures proper isolation.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">✓ Do</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Use clear, descriptive agent names</li>
                      <li>• Define specific instructions for each agent</li>
                      <li>• Implement proper error handling</li>
                      <li>• Use runtime contexts for configuration</li>
                      <li>• Test agents thoroughly before deployment</li>
                    </ul>
                  </div>
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-destructive">✗ Don&apos;t</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Create overly complex single agents</li>
                      <li>• Hardcode configuration values</li>
                      <li>• Ignore memory management</li>
                      <li>• Skip input validation</li>
                      <li>• Forget to handle edge cases</li>
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
              <h3 className="text-xl font-semibold mb-4">Ready to Build Agents?</h3>
              <p className="text-muted-foreground mb-6">
                Explore more advanced topics and learn how to integrate agents with tools and memory systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="glass-effect-strong electric-pulse">
                  <Link href="/docs/mastra/tools">
                    <Zap className="w-4 h-4 mr-2" />
                    Learn About Tools
                  </Link>
                </Button>
                <Button variant="outline" asChild className="lightning-trail">
                  <Link href="/docs/mastra/memory">
                    <Database className="w-4 h-4 mr-2" />
                    Memory Systems
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
