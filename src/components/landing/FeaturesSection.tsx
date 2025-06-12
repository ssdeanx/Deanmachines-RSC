// Generated on June 10, 2025
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Shield, Cpu, Globe, Rocket } from 'lucide-react';

interface FeaturesSectionProps {
  className?: string;
}

/**
 * FeaturesSection component with cutting-edge 2025 animations
 *
 * Showcases key features with neon glow effects and 3D transforms
 * Dark theme with yellow neon accents
 */
export function FeaturesSection({ className }: FeaturesSectionProps) {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Agents",
      description: "Autonomous AI agents that understand context and execute complex tasks with precision."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with sub-100ms response times and efficient memory management."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Built-in security measures with input validation and prompt injection protection."
    },
    {
      icon: Cpu,
      title: "Advanced Memory",
      description: "Sophisticated memory management with vector storage and semantic search capabilities."
    },
    {
      icon: Globe,
      title: "Seamless Integration",
      description: "Easy integration with existing systems and third-party APIs."
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Scalable architecture with comprehensive observability and monitoring."
    }
  ];

  return (
    <section className={`py-24 gradient-mesh cyber-grid relative overflow-hidden ${className || ''}`}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 holographic opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cutting-Edge <span className="text-primary text-glow">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Harness the power of next-generation AI technology with features designed for modern applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="glass-effect-strong neon-border hover:electric-pulse transition-all duration-300 h-full backdrop-blur-xl group-hover:text-glow">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 p-3 rounded-full bg-primary/20 w-fit neon-glow-subtle"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
