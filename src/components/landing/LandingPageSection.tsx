// Generated on June 10, 2025
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Particles } from '@tsparticles/react';
import { LightningCursor } from '@/components/effects/lightning-cursor';

interface LandingPageSectionProps {
  className?: string;
}

/**
 * LandingPageSection component with cutting-edge 2025 animations
 *
 * Features particle background, 3D transforms, and neon glow effects
 * Dark theme with yellow neon accents for a futuristic feel
 */
export function LandingPageSection({ className }: LandingPageSectionProps) {

  return (
    <section className={`relative min-h-screen py-16 md:py-24 gradient-mesh cyber-grid overflow-hidden ${className || ''}`}>
      {/* Lightning Cursor Effect */}
      <LightningCursor enabled={true} />

      {/* Enhanced Background with Holographic Effect */}
      <div className="absolute inset-0 holographic opacity-30" />

      {/* Particle Background */}
      <Particles
        id="tsparticles"
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120, interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: { enable: true },
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#f1c40f" },
            links: {
              color: "#f1c40f",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            }, number: {
              density: { enable: true },
              value: 80,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Build <motion.span
              className="text-primary neon-text"
              animate={{
                textShadow: [
                  "0 0 5px #f1c40f, 0 0 10px #f1c40f, 0 0 15px #f1c40f",
                  "0 0 10px #f1c40f, 0 0 20px #f1c40f, 0 0 30px #f1c40f",
                  "0 0 5px #f1c40f, 0 0 10px #f1c40f, 0 0 15px #f1c40f"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Intelligent
            </motion.span>
            <br />Applications, Faster.
          </h1>
        </motion.div>

        <motion.p
          className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          DeanMachines RSC empowers you to create sophisticated AI-driven solutions with autonomous agents, advanced memory, and seamless integration.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="default"
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 glass-effect-strong electric-pulse px-8 py-4 text-lg font-semibold"
            >
              <Link href="/docs/get-started">Get Started</Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              asChild
              className="glass-effect-strong border-primary/30 hover:border-primary/60 lightning-trail px-8 py-4 text-lg font-semibold"
            >
              <Link href="https://github.com/your-repo/deanmachines-rsc" target="_blank">
                View on GitHub
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* 3D Card Effect */}
          <motion.div
            className="relative transform-gpu"
            whileHover={{
              rotateX: 5,
              rotateY: 5,
              scale: 1.02,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="glass-effect-strong rounded-2xl p-8 electric-pulse backdrop-blur-xl">
              <Image
                src="/next.svg"
                alt="DeanMachines Platform Illustration"
                width={1200}
                height={700}
                className="rounded-xl shadow-2xl dark:invert floating"
                priority
              />

              {/* Floating elements around the main image */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/10 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
