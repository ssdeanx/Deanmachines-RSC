'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Layers, 
  Brain, 
  Database,
  Globe,
  Zap,
  Settings,
  MessageSquare,
  GitBranch,
  Shield,
  Monitor,
  Puzzle,
  Info
} from 'lucide-react';
import Link from 'next/link';

/**
 * Architecture documentation page
 * 
 * Comprehensive overview of DeanMachines RSC architecture:
 * - System components and their interactions
 * - Technology stack and integrations
 * - Data flow and communication patterns
 * - Deployment and scaling considerations
 * 
 * @returns {JSX.Element} The rendered architecture documentation page
 */
export default function ArchitecturePage() {
  const architectureLayers = [
    {
      name: "Frontend Layer",
      description: "Next.js 15 with App Router, React 19, and CopilotKit integration",
      icon: <Globe className="w-6 h-6" />,
      technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "CopilotKit"],
      responsibilities: [
        "User interface and experience",
        "AI chat interfaces",
        "Agent interaction management",
        "Real-time updates and state management"
      ],
      color: "bg-blue-500/20 border-blue-500/30"
    },
    {
      name: "Backend Layer", 
      description: "Mastra framework with multi-agent orchestration and MCP integrations",
      icon: <Brain className="w-6 h-6" />,
      technologies: ["Mastra Core", "Google Gemini", "MCP Servers", "Node.js"],
      responsibilities: [
        "Agent lifecycle management",
        "Tool and MCP integration",
        "Request routing and processing",
        "Context and memory management"
      ],
      color: "bg-green-500/20 border-green-500/30"
    },
    {
      name: "Data Layer",
      description: "LibSQL/Turso database with knowledge graph and persistent storage",
      icon: <Database className="w-6 h-6" />,
      technologies: ["LibSQL", "Turso", "SQLite", "Knowledge Graph"],
      responsibilities: [
        "Agent memory persistence",
        "Entity and relationship storage",
        "Configuration management",
        "Audit logging and history"
      ],
      color: "bg-purple-500/20 border-purple-500/30"
    },
    {
      name: "Integration Layer",
      description: "External APIs, services, and Model Context Protocol integrations",
      icon: <Puzzle className="w-6 h-6" />,
      technologies: ["MCP Protocol", "REST APIs", "WebSockets", "External Services"],
      responsibilities: [
        "External API integration",
        "Real-time data fetching",
        "Service orchestration",
        "Protocol standardization"
      ],
      color: "bg-orange-500/20 border-orange-500/30"
    }
  ];

  const systemComponents = [
    {
      name: "Master Agent",
      description: "Orchestrates and coordinates multiple specialized agents",
      type: "Core Agent",
      connections: ["All Agents", "Memory System", "Tool Registry"]
    },
    {
      name: "Specialized Agents",
      description: "Domain-specific agents (Weather, Git, Code, Research, etc.)",
      type: "Worker Agents", 
      connections: ["Master Agent", "MCP Tools", "Memory System"]
    },
    {
      name: "CopilotKit Runtime",
      description: "Handles frontend-backend communication and agent switching",
      type: "Communication Layer",
      connections: ["Frontend", "Mastra Backend", "Agent Registry"]
    },
    {
      name: "MCP Servers",
      description: "Standardized tool providers (Filesystem, Memory, Browser, Search)",
      type: "Tool Providers",
      connections: ["Agents", "External APIs", "System Resources"]
    },
    {
      name: "Memory System",
      description: "Knowledge graph and persistent storage for agent memory",
      type: "Data Management",
      connections: ["All Agents", "LibSQL Database", "Entity Store"]
    },
    {
      name: "Observability",
      description: "LangSmith integration for monitoring and debugging",
      type: "Monitoring",
      connections: ["All Agents", "Runtime", "External Dashboard"]
    }
  ];

  const dataFlow = [
    {
      step: 1,
      title: "User Interaction",
      description: "User sends message through CopilotKit chat interface",
      component: "Frontend"
    },
    {
      step: 2,
      title: "Request Routing",
      description: "CopilotKit runtime routes request to selected agent",
      component: "Runtime"
    },
    {
      step: 3,
      title: "Agent Processing",
      description: "Agent processes request, accesses memory, and uses tools",
      component: "Backend"
    },
    {
      step: 4,
      title: "Tool Execution",
      description: "MCP tools execute operations (search, file ops, etc.)",
      component: "MCP Layer"
    },
    {
      step: 5,
      title: "Memory Update",
      description: "Agent updates knowledge graph with new information",
      component: "Data Layer"
    },
    {
      step: 6,
      title: "Response Generation",
      description: "Agent generates response using AI model",
      component: "AI Model"
    },
    {
      step: 7,
      title: "UI Update",
      description: "Frontend receives response and updates chat interface",
      component: "Frontend"
    }
  ];

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
            System <span className="text-primary text-glow">Architecture</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive overview of DeanMachines RSC architecture, components, and data flow patterns.
          </p>
        </motion.div>

        {/* Architecture Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Architecture Layers
              </CardTitle>
              <CardDescription>
                Multi-layered architecture with clear separation of concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {architectureLayers.map((layer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-lg border ${layer.color}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-background/50 rounded-lg">
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{layer.name}</h3>
                        <p className="text-muted-foreground mb-4">{layer.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-1">
                              {layer.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Responsibilities</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {layer.responsibilities.map((resp, respIndex) => (
                                <li key={respIndex}>• {resp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* System Components */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                System Components
              </CardTitle>
              <CardDescription>
                Key components and their interactions within the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemComponents.map((component, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 glass-effect rounded-lg hover:electric-pulse transition-all duration-300"
                  >
                    <div className="mb-3">
                      <h4 className="font-semibold mb-1">{component.name}</h4>
                      <Badge variant="outline" className="text-xs mb-2">
                        {component.type}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Connects to:</div>
                      <div className="flex flex-wrap gap-1">
                        {component.connections.map((conn, connIndex) => (
                          <Badge key={connIndex} variant="secondary" className="text-xs">
                            {conn}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Data Flow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                Data Flow
              </CardTitle>
              <CardDescription>
                Request processing flow from user interaction to response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataFlow.map((flow, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 glass-effect rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {flow.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{flow.title}</h4>
                      <p className="text-sm text-muted-foreground">{flow.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {flow.component}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Technology Stack
              </CardTitle>
              <CardDescription>
                Core technologies and frameworks powering the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Frontend</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Next.js 15</div>
                    <div>React 19</div>
                    <div>TypeScript</div>
                    <div>Tailwind CSS v4</div>
                  </div>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">AI Framework</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Mastra Core</div>
                    <div>Google Gemini</div>
                    <div>CopilotKit</div>
                    <div>MCP Protocol</div>
                  </div>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Database className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Database</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>LibSQL</div>
                    <div>Turso</div>
                    <div>SQLite</div>
                    <div>Knowledge Graph</div>
                  </div>
                </div>
                <div className="text-center p-4 glass-effect rounded-lg">
                  <Monitor className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Observability</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>LangSmith</div>
                    <div>Pino Logger</div>
                    <div>Error Tracking</div>
                    <div>Performance Metrics</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Deployment Considerations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Deployment & Scaling
              </CardTitle>
              <CardDescription>
                Production deployment and scaling considerations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    The system is designed for horizontal scaling with stateless agents and persistent memory storage.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Scalability</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Stateless agent design</li>
                      <li>• Horizontal scaling support</li>
                      <li>• Load balancing ready</li>
                      <li>• Database connection pooling</li>
                    </ul>
                  </div>
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Security</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Environment variable isolation</li>
                      <li>• API key management</li>
                      <li>• CORS configuration</li>
                      <li>• Input validation</li>
                    </ul>
                  </div>
                  <div className="p-4 glass-effect rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Monitoring</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• LangSmith integration</li>
                      <li>• Performance tracking</li>
                      <li>• Error monitoring</li>
                      <li>• Usage analytics</li>
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="glass-effect-strong electric-pulse">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Explore the System</h3>
              <p className="text-muted-foreground mb-6">
                Dive deeper into specific components and learn how to customize and extend the architecture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="glass-effect-strong electric-pulse">
                  <Link href="/docs/mastra/agents">
                    <Brain className="w-4 h-4 mr-2" />
                    Explore Agents
                  </Link>
                </Button>
                <Button variant="outline" asChild className="lightning-trail">
                  <Link href="/docs/deployment/production">
                    <Shield className="w-4 h-4 mr-2" />
                    Production Setup
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
