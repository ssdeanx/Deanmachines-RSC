'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Settings,
  Brain
} from 'lucide-react';
import Link from 'next/link';

/**
 * Installation documentation page for DeanMachines RSC
 *
 * Provides comprehensive installation instructions for:
 * - Prerequisites and system requirements
 * - Repository cloning and setup
 * - Environment configuration
 * - Development and production setup
 * - Troubleshooting common issues
 *
 * @returns {JSX.Element} The rendered installation documentation page
 */
export default function InstallationPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const prerequisites = [
    {
      name: "Node.js",
      version: "18.0.0+",
      description: "JavaScript runtime for running the application",
      checkCommand: "node --version",
      installUrl: "https://nodejs.org/"
    },
    {
      name: "npm",
      version: "9.0.0+",
      description: "Package manager (comes with Node.js)",
      checkCommand: "npm --version",
      installUrl: "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm"
    },
    {
      name: "Git",
      version: "2.0.0+",
      description: "Version control system",
      checkCommand: "git --version",
      installUrl: "https://git-scm.com/downloads"
    }
  ];

  const environmentVariables = [
    {
      key: "GOOGLE_GENERATIVE_AI_API_KEY",
      description: "Google Gemini API key for AI model access",
      required: true,
      example: "AIzaSyC...",
      getUrl: "https://makersuite.google.com/app/apikey"
    },
    {
      key: "DATABASE_URL",
      description: "LibSQL/Turso database connection URL",
      required: true,
      example: "libsql://your-database.turso.io",
      getUrl: "https://turso.tech/"
    },
    {
      key: "DATABASE_AUTH_TOKEN",
      description: "Authentication token for LibSQL/Turso database",
      required: true,
      example: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
      getUrl: "https://turso.tech/"
    },
    {
      key: "LANGSMITH_API_KEY",
      description: "LangSmith API key for observability and monitoring",
      required: false,
      example: "ls__...",
      getUrl: "https://smith.langchain.com/"
    },
    {
      key: "GITHUB_TOKEN",
      description: "GitHub personal access token for repository operations",
      required: false,
      example: "ghp_...",
      getUrl: "https://github.com/settings/tokens"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Installation <span className="text-primary text-glow">Guide</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get DeanMachines RSC up and running in minutes with our comprehensive installation guide
          </p>
        </motion.div>

        {/* Prerequisites */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Prerequisites
              </CardTitle>
              <CardDescription>
                Ensure you have the following installed before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass-effect rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{prereq.name}</h4>
                        <Badge variant="outline">{prereq.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{prereq.description}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                        {prereq.checkCommand}
                      </code>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={prereq.installUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Install
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Installation Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Installation Steps
              </CardTitle>
              <CardDescription>
                Follow these steps to install and set up DeanMachines RSC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="development" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="development">Development Setup</TabsTrigger>
                  <TabsTrigger value="production">Production Setup</TabsTrigger>
                </TabsList>

                <TabsContent value="development" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Clone the Repository</h4>
                        <div className="bg-muted p-4 rounded-lg relative">
                          <code className="text-sm">
                            git clone https://github.com/ssdeanx/Deanmachines-RSC.git<br/>
                            cd Deanmachines-RSC
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard('git clone https://github.com/ssdeanx/Deanmachines-RSC.git\ncd Deanmachines-RSC')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Install Dependencies</h4>
                        <div className="bg-muted p-4 rounded-lg relative">
                          <code className="text-sm">npm install</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard('npm install')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Configure Environment</h4>
                        <div className="bg-muted p-4 rounded-lg relative">
                          <code className="text-sm">
                            cp .env.example .env<br/>
                            # Edit .env with your API keys
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard('cp .env.example .env')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Start Development Servers</h4>
                        <div className="bg-muted p-4 rounded-lg relative">
                          <code className="text-sm">
                            # Terminal 1: Next.js Frontend<br/>
                            npm run dev<br/><br/>
                            # Terminal 2: Mastra Backend<br/>
                            npm run dev:mastra
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard('npm run dev\n# In another terminal:\nnpm run dev:mastra')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="production" className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Production setup requires additional configuration for security and performance.
                      See our <Link href="/docs/deployment/production" className="text-primary hover:underline">Production Deployment Guide</Link> for detailed instructions.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        {/* Environment Variables */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <Card className="glass-effect-strong neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Configure these environment variables in your .env file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {environmentVariables.map((env, index) => (
                  <div key={index} className="p-4 glass-effect rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{env.key}</code>
                        {env.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={env.getUrl} target="_blank">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Get Key
                        </Link>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{env.description}</p>
                    <code className="text-xs text-muted-foreground">{env.example}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Card className="glass-effect-strong electric-pulse">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Ready to Build?</h3>
              <p className="text-muted-foreground mb-6">
                Now that you have DeanMachines RSC installed, explore our guides to start building intelligent applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="glass-effect-strong electric-pulse">
                  <Link href="/docs/mastra/agents">
                    <Brain className="w-4 h-4 mr-2" />
                    Create Your First Agent
                  </Link>
                </Button>
                <Button variant="outline" asChild className="lightning-trail">
                  <Link href="/playground">
                    <Terminal className="w-4 h-4 mr-2" />
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
