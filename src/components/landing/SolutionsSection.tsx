// Generated on June 10, 2025
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface SolutionsSectionProps {
  className?: string;
}

/**
 * SolutionsSection component with cutting-edge 2025 animations
 * 
 * Showcases different solutions with interactive cards and neon effects
 * Dark theme with yellow neon accents
 */
export function SolutionsSection({ className }: SolutionsSectionProps) {
  const solutions = [
    {
      title: "AI Chatbots",
      description: "Build intelligent conversational agents with advanced memory and context understanding.",
      features: ["Natural Language Processing", "Context Retention", "Multi-turn Conversations", "Custom Training"],
      badge: "Popular",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      title: "Data Analysis",
      description: "Automated data processing and insights generation with AI-powered analytics.",
      features: ["Real-time Processing", "Pattern Recognition", "Predictive Analytics", "Custom Reports"],
      badge: "Enterprise",
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      title: "Content Generation",
      description: "Create high-quality content at scale with AI-driven writing and editing tools.",
      features: ["SEO Optimization", "Multiple Formats", "Brand Voice", "Quality Control"],
      badge: "Creative",
      gradient: "from-purple-500/20 to-purple-500/5"
    }
  ];

  return (
    <section className={`py-24 bg-gradient-to-br from-background via-background/80 to-primary/5 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful <span className="text-primary neon-text">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your business with AI-powered solutions designed for maximum impact and efficiency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, rotateX: 5 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className={`glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 h-full backdrop-blur-xl group-hover:neon-glow bg-gradient-to-br ${solution.gradient}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      {solution.badge}
                    </Badge>
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        className="flex items-center text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full glass-effect border-primary/30 hover:border-primary/60">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get started with our cutting-edge AI solutions and see the difference in your productivity.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow px-8 py-4"
            >
              <Link href="/contact">Start Your Journey</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
