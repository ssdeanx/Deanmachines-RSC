// Generated on June 12, 2025
'use client';

import { motion } from 'framer-motion';
import { TopNavbar } from '@/components/landing/TopNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Code,
  Rocket,
  ArrowRight,
  Shield,
  Settings,
  Brain,
  Copy,
  CheckCircle,
  Zap,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';


/**
 * Documentation page with comprehensive guides, API references, and tutorials
 *
 * Features interactive code examples, searchable documentation, and progressive disclosure
 * Dark theme with yellow neon accents for consistent branding
 *
 * @returns {JSX.Element} The rendered documentation page
 */
export default function DocsPage() {
  const quickStartSteps = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Clone & Install",
      description: "Get started by cloning the repository and installing dependencies",
      code: "git clone https://github.com/ssdeanx/Deanmachines-RSC\ncd Deanmachines-RSC\nnpm install",
      time: "2 minutes"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Configure Environment",
      description: "Set up your API keys and environment variables",
      code: "# Copy .env.example to .env and configure:\nGOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key\nDATABASE_URL=your_libsql_url\nDATABASE_AUTH_TOKEN=your_auth_token\nLANGSMITH_API_KEY=your_langsmith_key\nGITHUB_TOKEN=your_github_token",
      time: "3 minutes"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Start Development",
      description: "Run both Next.js frontend and Mastra backend",
      code: "# Terminal 1: Start Next.js frontend\nnpm run dev\n\n# Terminal 2: Start Mastra backend\nnpm run dev:mastra",
      time: "1 minute"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Access Playground",
      description: "Interact with AI agents through the CopilotKit interface",
      code: "# Frontend: http://localhost:3000\n# Mastra Backend: http://localhost:4111\n# Playground: http://localhost:3000/playground",
      time: "Instant"
    }
  ];

  const documentationSections = [
    {
      category: "Getting Started",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { title: "Installation", href: "/docs/installation", badge: "Essential" },
        { title: "Environment Setup", href: "/docs/environment", badge: "Required" },
        { title: "Basic Concepts", href: "/docs/concepts", badge: null },
        { title: "Architecture Overview", href: "/docs/architecture", badge: "Important" }
      ]
    },
    {
      category: "Mastra Framework",
      icon: <Brain className="w-5 h-5" />,
      items: [
        { title: "Agents", href: "/docs/mastra/agents", badge: "Core" },
        { title: "Memory & Storage", href: "/docs/mastra/memory", badge: "Advanced" },
        { title: "Tools & MCP", href: "/docs/mastra/tools", badge: "Popular" },
        { title: "Workflows", href: "/docs/mastra/workflows", badge: "Automation" }
      ]
    },
    {
      category: "CopilotKit Integration",
      icon: <Code className="w-5 h-5" />,
      items: [
        { title: "Setup & Configuration", href: "/docs/copilotkit/setup", badge: "Essential" },
        { title: "Components & Hooks", href: "/docs/copilotkit/components", badge: "UI" },
        { title: "Agent Integration", href: "/docs/copilotkit/agents", badge: "Core" },
        { title: "Custom Actions", href: "/docs/copilotkit/actions", badge: "Advanced" }
      ]
    },
    {
      category: "Deployment & Production",
      icon: <Rocket className="w-5 h-5" />,
      items: [
        { title: "Production Setup", href: "/docs/deployment/production", badge: "Important" },
        { title: "Environment Variables", href: "/docs/deployment/environment", badge: "Security" },
        { title: "Monitoring & Observability", href: "/docs/deployment/monitoring", badge: "LangSmith" },
        { title: "Scaling & Performance", href: "/docs/deployment/scaling", badge: "Advanced" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6"
            animate={{
              textShadow: [
                "0 0 10px rgba(241, 196, 15, 0.3)",
                "0 0 20px rgba(241, 196, 15, 0.5)",
                "0 0 10px rgba(241, 196, 15, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Documentation & <span className="text-primary neon-text">Guides</span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Everything you need to build, deploy, and scale intelligent applications with DeanMachines RSC.
            From quick start tutorials to advanced API references.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
            >
              <Link href="/docs/quick-start">
                <Rocket className="w-5 h-5 mr-2" />
                Quick Start Guide
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="glass-effect border-primary/30 hover:border-primary/60"
            >
              <Link href="/docs/api">
                <Code className="w-5 h-5 mr-2" />
                API Reference
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="sticky top-24">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary neon-text">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {documentationSections.map((section) => (
                    <motion.div key={section.category} variants={itemVariants}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-primary">{section.icon}</div>
                        <h3 className="font-semibold text-foreground">{section.category}</h3>
                      </div>
                      <ul className="space-y-2 ml-7">
                        {section.items.map((item) => (
                          <li key={item.title}>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                              <Link
                                href={item.href}
                                className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors group"
                              >
                                <span className="group-hover:neon-text">{item.title}</span>
                                {item.badge && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs glass-effect"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            </motion.div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}                </CardContent>
              </Card>
            </div>
          </motion.div>
          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Tabs defaultValue="quickstart" className="space-y-8">
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 bg-muted/20 glass-effect">
                <TabsTrigger value="quickstart" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Quick Start
                </TabsTrigger>
                <TabsTrigger value="examples" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Examples
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quickstart" className="space-y-8">
                <motion.div variants={itemVariants}>
                  <Card className="glass-effect border-primary/20 neon-glow">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary neon-text">Quick Start Guide</CardTitle>
                      <CardDescription>
                        Get up and running with DeanMachines RSC in under 15 minutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        {quickStartSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            className="glass-effect rounded-lg p-6 border border-primary/10"
                            whileHover={{ scale: 1.02, borderColor: "rgba(241, 196, 15, 0.3)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-primary bg-primary/10 p-3 rounded-lg">
                                {step.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                                  <Badge variant="outline" className="glass-effect">
                                    {step.time}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{step.description}</p>
                                <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto glass-effect">
                                  <pre className="text-foreground">{step.code}</pre>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 float-right opacity-70 hover:opacity-100"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-6">
                <motion.div variants={containerVariants} className="grid gap-6">
                  {[
                    {
                      title: "Multi-Agent Code Analysis",
                      description: "Use Git, Code, and Graph agents to analyze repositories and generate dependency graphs",
                      features: ["Repository Cloning", "Code Graph Generation", "Multi-Agent Coordination"],
                      difficulty: "Beginner",
                      time: "15 min"
                    },
                    {
                      title: "Weather & Stock Analysis",
                      description: "Combine Weather and Data agents for comprehensive market analysis",
                      features: ["Real-time Weather Data", "Stock Price Analysis", "Correlation Insights"],
                      difficulty: "Intermediate",
                      time: "30 min"
                    },
                    {
                      title: "Research & Documentation",
                      description: "Use Research and Documentation agents to create comprehensive project docs",
                      features: ["Web Research", "Content Generation", "Technical Writing"],
                      difficulty: "Advanced",
                      time: "45 min"
                    }
                  ].map((example, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-foreground">{example.title}</CardTitle>
                            <div className="flex gap-2">
                              <Badge
                                variant={example.difficulty === 'Beginner' ? 'default' : example.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                                className="glass-effect"
                              >
                                {example.difficulty}
                              </Badge>
                              <Badge variant="outline" className="glass-effect">
                                {example.time}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{example.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-foreground mb-2">Key Features:</h4>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {example.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Button
                              asChild
                              className="w-full glass-effect border-primary/30 hover:border-primary/60"
                              variant="outline"
                            >
                              <Link href={`/docs/examples/${example.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                View Tutorial <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <motion.div variants={containerVariants} className="grid gap-6">
                  {[
                    {
                      icon: <Brain className="w-6 h-6" />,
                      title: "Advanced Agent Patterns",
                      description: "Master complex agent architectures with real Mastra implementations",
                      topics: ["Agent Coordination", "Memory Management", "Tool Integration", "Runtime Contexts"]
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Production Deployment",
                      description: "Deploy DeanMachines RSC with enterprise-grade reliability",
                      topics: ["LibSQL/Turso Setup", "LangSmith Observability", "Environment Security", "Scaling Strategies"]
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "CopilotKit Mastery",
                      description: "Build sophisticated AI interfaces with CopilotKit and Mastra",
                      topics: ["Custom Components", "Agent Switching", "Real-time Updates", "State Management"]
                    }
                  ].map((topic, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="text-primary bg-primary/10 p-2 rounded-lg">
                              {topic.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl text-foreground">{topic.title}</CardTitle>
                              <CardDescription>{topic.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-foreground mb-3">Topics Covered:</h4>
                              <div className="flex flex-wrap gap-2">
                                {topic.topics.map((item, idx) => (
                                  <Badge key={idx} variant="secondary" className="glass-effect">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              asChild
                              className="w-full glass-effect border-primary/30 hover:border-primary/60"
                              variant="outline"
                            >
                              <Link href={`/docs/advanced/${topic.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                Learn More <ExternalLink className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
