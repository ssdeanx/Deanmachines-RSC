'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Puzzle,
  Code,
  Copy,
  Zap,
  Settings,
  MessageSquare,
  Layers,
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

/**
 * CopilotKit Setup documentation page
 *
 * Comprehensive guide covering:
 * - CopilotKit installation and configuration
 * - Integration with Mastra backend
 * - Component setup and usage
 * - Runtime configuration
 * - Best practices and troubleshooting
 *
 * @returns {JSX.Element} The rendered CopilotKit setup documentation page
 */
export default function CopilotKitSetupPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copilotKitPackages = [
    {
      name: "@copilotkit/react-core",
      version: "1.3.18",
      description: "Core CopilotKit React functionality",
      required: true
    },
    {
      name: "@copilotkit/react-ui",
      version: "1.3.18",
      description: "Pre-built UI components for chat interfaces",
      required: true
    },
    {
      name: "@copilotkit/runtime-client-gql",
      version: "1.3.18",
      description: "GraphQL runtime client for backend communication",
      required: true
    },
    {
      name: "@copilotkit/shared",
      version: "1.3.18",
      description: "Shared utilities and types",
      required: false
    }
  ];

  const setupExample = `// src/app/layout.tsx
import { CopilotKit } from '@copilotkit/react-core';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CopilotKit
          runtimeUrl="http://localhost:4111/copilotkit"
          agent="master-agent"
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}`;

  const playgroundExample = `// src/app/playground/page.tsx
'use client';

import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotAgent } from '@copilotkit/react-core';

export default function PlaygroundPage() {
  const { switchAgent, currentAgent } = useCopilotAgent();

  return (
    <div className="h-screen flex">
      {/* Agent Selector */}
      <div className="w-64 p-4 border-r">
        <h3 className="font-semibold mb-4">Available Agents</h3>
        {['master-agent', 'weather-agent', 'git-agent'].map((agent) => (
          <button
            key={agent}
            onClick={() => switchAgent(agent)}
            className={\`w-full p-2 text-left rounded mb-2 \${
              currentAgent === agent ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }\`}
          >
            {agent}
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <CopilotChat
          labels={{
            title: "DeanMachines RSC Assistant",
            initial: "Hello! I'm your AI assistant. How can I help you today?"
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}`;

  const backendConfigExample = `// mastra.config.ts
import { Mastra } from '@mastra/core';
import { createCopilotKitIntegration } from '@mastra/copilotkit';

export const mastra = new Mastra({
  agents: [
    masterAgent,
    weatherAgent,
    gitAgent,
    codeAgent,
    graphAgent,
    researchAgent,
    documentationAgent,
    dataAgent
  ],
  integrations: [
    createCopilotKitIntegration({
      agents: {
        'master-agent': masterAgent,
        'weather-agent': weatherAgent,
        'git-agent': gitAgent,
        'code-agent': codeAgent,
        'graph-agent': graphAgent,
        'research-agent': researchAgent,
        'documentation-agent': documentationAgent,
        'data-agent': dataAgent
      }
    })
  ]
});`;

  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Chat Interface",
      description: "Pre-built chat components with customizable styling",
      implementation: "CopilotChat, CopilotSidebar"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Agent Switching",
      description: "Dynamic agent switching during conversations",
      implementation: "useCopilotAgent hook"
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Multi-Agent Support",
      description: "Seamless integration with multiple Mastra agents",
      implementation: "Agent registry in mastra.config.ts"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Runtime Configuration",
      description: "Dynamic configuration and context management",
      implementation: "Runtime contexts and environment variables"
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
            CopilotKit <span className="text-primary text-glow">Setup</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate CopilotKit with your Mastra backend to create powerful AI-driven user interfaces with multi-agent support.
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
                <Puzzle className="w-5 h-5 text-primary" />
                CopilotKit Features
              </CardTitle>
              <CardDescription>
                Key capabilities of CopilotKit integration with Mastra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 glass-effect rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.implementation}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Installation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Installation & Dependencies
              </CardTitle>
              <CardDescription>
                CopilotKit packages already installed in DeanMachines RSC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  All CopilotKit dependencies are pre-installed in this project. No additional installation required.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {copilotKitPackages.map((pkg, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass-effect rounded-lg">
                    <div>
                      <code className="font-mono text-sm">{pkg.name}</code>
                      <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pkg.version}</Badge>
                      {pkg.required && <Badge variant="default">Required</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Configuration */}
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
                Configuration Examples
              </CardTitle>
              <CardDescription>
                Set up CopilotKit with your Mastra backend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="frontend" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="frontend">Frontend Setup</TabsTrigger>
                  <TabsTrigger value="playground">Playground</TabsTrigger>
                  <TabsTrigger value="backend">Backend Config</TabsTrigger>
                </TabsList>

                <TabsContent value="frontend" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{setupExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(setupExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="playground" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{playgroundExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(playgroundExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="backend" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg relative">
                    <pre className="text-sm overflow-x-auto">
                      <code>{backendConfigExample}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(backendConfigExample)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        {/* Environment Variables */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Runtime Configuration
              </CardTitle>
              <CardDescription>
                Environment variables and runtime settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 glass-effect rounded-lg">
                  <h4 className="font-semibold mb-2">Frontend Configuration</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <code>
                      NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL=http://localhost:4111/copilotkit<br/>
                      NEXT_PUBLIC_DEFAULT_AGENT=master-agent
                    </code>
                  </div>
                </div>

                <div className="p-4 glass-effect rounded-lg">
                  <h4 className="font-semibold mb-2">Backend Configuration</h4>
                  <div className="bg-muted p-3 rounded text-sm">
                    <code>
                      MASTRA_PORT=4111<br/>
                      COPILOTKIT_ENABLED=true<br/>
                      CORS_ORIGIN=http://localhost:3000
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Best Practices */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>
                Guidelines for effective CopilotKit integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">✓ Recommended</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use environment variables for runtime URLs</li>
                    <li>• Implement proper error boundaries</li>
                    <li>• Test agent switching functionality</li>
                    <li>• Customize chat interface styling</li>
                    <li>• Monitor backend connectivity</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-destructive">✗ Avoid</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Hardcoding runtime URLs</li>
                    <li>• Ignoring connection errors</li>
                    <li>• Overloading single agents</li>
                    <li>• Skipping input validation</li>
                    <li>• Forgetting CORS configuration</li>
                  </ul>
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
              <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
              <p className="text-muted-foreground mb-6">
                Start building sophisticated AI interfaces with CopilotKit and Mastra integration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="glass-effect-strong electric-pulse">
                  <Link href="/docs/copilotkit/components">
                    <Puzzle className="w-4 h-4 mr-2" />
                    Explore Components
                  </Link>
                </Button>
                <Button variant="outline" asChild className="lightning-trail">
                  <Link href="/playground">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Try the Playground
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
