// Generated on June 10, 2025
'use client';

import { motion } from 'framer-motion';
import { TopNavbar } from '@/components/landing/TopNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Shield, Cpu, Globe, Rocket, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Autonomous AI Agents",
    description: "Create intelligent agents that can understand context, make decisions, and execute complex tasks without human intervention.",
    category: "AI Core",
    highlights: ["Natural Language Understanding", "Context Awareness", "Decision Making", "Task Execution"]
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    description: "Optimized for speed with sub-100ms response times, efficient memory management, and scalable architecture.",
    category: "Performance",
    highlights: ["Sub-100ms Response", "Memory Optimization", "Scalable Architecture", "Edge Computing"]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built-in security measures including input validation, prompt injection protection, and secure data handling.",
    category: "Security",
    highlights: ["Input Validation", "Prompt Protection", "Secure Storage", "Access Control"]
  },
  {
    icon: Cpu,
    title: "Advanced Memory System",
    description: "Sophisticated memory management with vector storage, semantic search, and intelligent context retention.",
    category: "Memory",
    highlights: ["Vector Storage", "Semantic Search", "Context Retention", "Smart Retrieval"]
  },
  {
    icon: Globe,
    title: "Seamless Integration",
    description: "Easy integration with existing systems, APIs, and workflows through our comprehensive SDK.",
    category: "Integration",
    highlights: ["REST APIs", "SDK Support", "Webhook Events", "Plugin System"]
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description: "Battle-tested architecture with comprehensive observability, monitoring, and debugging tools.",
    category: "DevOps",
    highlights: ["Observability", "Monitoring", "Debugging", "Analytics"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background/95 to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                Powerful <span className="text-primary neon-text">Features</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover the cutting-edge capabilities that make DeanMachines RSC the most advanced AI platform for building intelligent applications.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, rotateX: 2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 h-full backdrop-blur-xl group-hover:neon-glow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          {feature.category}
                        </Badge>
                        <motion.div
                          className="p-3 rounded-full bg-primary/10"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <feature.icon className="w-6 h-6 text-primary" />
                        </motion.div>
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.highlights.map((highlight, highlightIndex) => (
                          <motion.li
                            key={highlight}
                            className="flex items-center text-sm text-muted-foreground"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: highlightIndex * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {highlight}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs Section */}
        <section className="py-24 bg-gradient-to-br from-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Technical <span className="text-primary neon-text">Specifications</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on modern technology stack for maximum performance and reliability.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Response Time", value: "<100ms", icon: Zap },
                { label: "Uptime", value: "99.9%", icon: Shield },
                { label: "Concurrent Users", value: "10k+", icon: Globe },
                { label: "API Calls/sec", value: "1M+", icon: Cpu }
              ].map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-xl hover:neon-glow text-center">
                    <CardContent className="pt-6">
                      <motion.div
                        className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <spec.icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div className="text-2xl font-bold text-primary neon-text mb-1">
                        {spec.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {spec.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
