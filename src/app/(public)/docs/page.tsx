// Generated on 2025-01-27
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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

/**
 * Documentation page with comprehensive guides and tutorials
 * 
 * Features interactive code examples and searchable documentation
 * Dark theme with yellow neon accents for consistent branding
 * 
 * @returns {JSX.Element} The rendered documentation page
 */
export default function DocsPage() {
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Documentation Cards */}
          {[
            {
              title: "Getting Started",
              description: "Learn the basics and get your first AI agent running",
              icon: <BookOpen className="w-6 h-6" />,
              items: ["Installation", "Quick Start", "Basic Concepts"],
              href: "/docs/getting-started"
            },
            {
              title: "API Reference",
              description: "Complete API documentation with examples",
              icon: <Code className="w-6 h-6" />,
              items: ["Agent API", "Memory API", "Tools API"],
              href: "/docs/api"
            },
            {
              title: "Examples",
              description: "Real-world examples and use cases",
              icon: <Rocket className="w-6 h-6" />,
              items: ["Chatbots", "Workflows", "Integrations"],
              href: "/docs/examples"
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="text-primary bg-primary/10 p-3 rounded-lg w-fit mb-4">
                    {section.icon}
                  </div>
                  <CardTitle className="text-xl text-foreground">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className="w-full glass-effect border-primary/30 hover:border-primary/60"
                    variant="outline"
                  >
                    <Link href={section.href}>
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <Card className="glass-effect border-primary/20 neon-glow">
            <CardHeader>
              <CardTitle className="text-2xl text-primary neon-text">Quick Start</CardTitle>
              <CardDescription>
                Get up and running in under 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="install" className="space-y-6">
                <TabsList className="grid grid-cols-3 bg-muted/20 glass-effect">
                  <TabsTrigger value="install">Install</TabsTrigger>
                  <TabsTrigger value="configure">Configure</TabsTrigger>
                  <TabsTrigger value="deploy">Deploy</TabsTrigger>
                </TabsList>

                <TabsContent value="install" className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Installation</h3>
                  <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto glass-effect">
                    <pre className="text-foreground">npm install -g deanmachines-rsc{'\n'}npx create-deanmachines-app my-app</pre>
                  </div>
                </TabsContent>

                <TabsContent value="configure" className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Configuration</h3>
                  <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto glass-effect">
                    <pre className="text-foreground"># .env.local{'\n'}AI_PROVIDER_API_KEY=your_key_here{'\n'}DATABASE_URL=your_db_url</pre>
                  </div>
                </TabsContent>

                <TabsContent value="deploy" className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Deploy</h3>
                  <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto glass-effect">
                    <pre className="text-foreground">npm run build{'\n'}npm run deploy</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
  BookOpen, 
  Code, 
  Rocket, 
  Settings, 
  Database, 
  Brain,
  ArrowRight,
  ExternalLink,
  Copy,
  CheckCircle,
  Zap,
  Shield
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
      title: "Install DeanMachines RSC",
      description: "Get started with our CLI tool and create your first project",
      code: "npm install -g deanmachines-rsc\nnpx create-deanmachines-app my-app",
      time: "2 minutes"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Configure Environment",
      description: "Set up your API keys and environment variables",
      code: "# .env.local\nAI_PROVIDER_API_KEY=your_key_here\nDATABASE_URL=your_db_url",
      time: "1 minute"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Create Your First Agent",
      description: "Build an intelligent agent with memory and tools",
      code: "import { createAgent } from 'deanmachines-rsc';\n\nconst agent = createAgent({\n  name: 'MyAgent',\n  memory: true,\n  tools: ['web-search', 'calculator']\n});",
      time: "5 minutes"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Deploy & Scale",
      description: "Deploy your application to production with one command",
      code: "npm run deploy\n# Your app is now live!",
      time: "3 minutes"
    }
  ];

  const documentationSections = [
    {
      category: "Getting Started",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { title: "Installation", href: "/docs/installation", badge: "Essential" },
        { title: "Quick Start Guide", href: "/docs/quick-start", badge: "Popular" },
        { title: "Basic Concepts", href: "/docs/concepts", badge: null },
        { title: "First Project", href: "/docs/first-project", badge: "Tutorial" }
      ]
    },
    {
      category: "Core Features", 
      icon: <Brain className="w-5 h-5" />,
      items: [
        { title: "Intelligent Agents", href: "/docs/agents", badge: "Core" },
        { title: "Memory Systems", href: "/docs/memory", badge: "Advanced" },
        { title: "Tool Integration", href: "/docs/tools", badge: "Popular" },
        { title: "Workflow Automation", href: "/docs/workflows", badge: null }
      ]
    },
    {
      category: "API Reference",
      icon: <Code className="w-5 h-5" />,
      items: [
        { title: "Agent API", href: "/docs/api/agents", badge: null },
        { title: "Memory API", href: "/docs/api/memory", badge: null },
        { title: "Tools API", href: "/docs/api/tools", badge: null },
        { title: "Webhooks", href: "/docs/api/webhooks", badge: "Beta" }
      ]
    },
    {
      category: "Deployment",
      icon: <Rocket className="w-5 h-5" />,
      items: [
        { title: "Production Setup", href: "/docs/deployment/production", badge: "Important" },
        { title: "Scaling Guide", href: "/docs/deployment/scaling", badge: "Advanced" },
        { title: "Monitoring", href: "/docs/deployment/monitoring", badge: null },
        { title: "Security", href: "/docs/deployment/security", badge: "Critical" }
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
                  {documentationSections.map((section, sectionIndex) => (
                    <motion.div key={section.category} variants={itemVariants}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-primary">{section.icon}</div>
                        <h3 className="font-semibold text-foreground">{section.category}</h3>
                      </div>
                      <ul className="space-y-2 ml-7">
                        {section.items.map((item, itemIndex) => (
                          <motion.li 
                            key={item.title}
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
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </CardContent>
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
                      title: "Customer Support Bot",
                      description: "Build an intelligent customer support agent with memory and context awareness",
                      features: ["Natural Language Processing", "Memory Persistence", "Multi-Channel Support"],
                      difficulty: "Beginner",
                      time: "30 min"
                    },
                    {
                      title: "Data Analysis Pipeline",
                      description: "Create automated data processing workflows with AI-powered insights",
                      features: ["Automated Data Processing", "AI Insights", "Real-time Monitoring"],
                      difficulty: "Intermediate",
                      time: "1 hour"
                    },
                    {
                      title: "Content Generation System",
                      description: "Build a scalable content creation platform with AI assistance",
                      features: ["Multi-format Content", "Brand Voice Training", "Quality Scoring"],
                      difficulty: "Advanced",
                      time: "2 hours"
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
                      title: "Advanced Agent Architectures",
                      description: "Learn to build complex multi-agent systems with hierarchical coordination",
                      topics: ["Multi-Agent Coordination", "Hierarchical Planning", "Distributed Memory"]
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Security & Privacy",
                      description: "Implement enterprise-grade security for your AI applications",
                      topics: ["Data Encryption", "Access Control", "Audit Logging"]
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Performance Optimization",
                      description: "Scale your applications to handle millions of requests",
                      topics: ["Caching Strategies", "Load Balancing", "Resource Management"]
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
