// Generated on June 10, 2025
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, Users, Zap, Github, ExternalLink } from 'lucide-react';

interface AboutSectionProps {
  className?: string;
}

/**
 * AboutSection component with cutting-edge 2025 animations
 * 
 * Showcases company information and team details with modern design
 * Dark theme with yellow neon accents
 */
export function AboutSection({ className }: AboutSectionProps) {
  const stats = [
    { number: "10k+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "24/7", label: "Support", icon: BookOpen },
    { number: "Open", label: "Source", icon: Github }
  ];

  const team = [
    {
      name: "AI Research Team",
      role: "Core Development",
      description: "Leading experts in AI agent development and machine learning.",
      badge: "Research"
    },
    {
      name: "Engineering Team",
      role: "Platform Architecture",
      description: "Building scalable and robust infrastructure for AI applications.",
      badge: "Engineering"
    },
    {
      name: "DevX Team",
      role: "Developer Experience",
      description: "Creating intuitive tools and documentation for developers.",
      badge: "DevX"
    }
  ];

  return (
    <section className={`py-24 bg-gradient-to-br from-background to-primary/5 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            About <span className="text-primary neon-text">DeanMachines</span>
          </h2>          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;re pioneering the future of AI-driven applications with cutting-edge technology, 
            autonomous agents, and developer-first approach. Our mission is to democratize AI 
            and make intelligent applications accessible to everyone.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-xl hover:neon-glow">
                <CardContent className="pt-6">
                  <motion.div
                    className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div className="text-2xl font-bold text-primary neon-text mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
            Our <span className="text-primary">Team</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 h-full backdrop-blur-xl group-hover:neon-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        {member.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center glass-effect rounded-2xl p-12 border border-primary/20 backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Join the AI Revolution
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the community building the future of intelligent applications. 
            Contribute to our open-source projects or start building your own AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
              >
                <Link href="/docs">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Documentation
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="glass-effect border-primary/30 hover:border-primary/60"
              >
                <Link href="https://github.com/your-repo/deanmachines-rsc" target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
