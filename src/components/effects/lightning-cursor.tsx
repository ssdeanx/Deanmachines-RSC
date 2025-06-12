'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMouseLightning } from '@/hooks/use-mouse-lightning';

interface LightningCursorProps {
  enabled?: boolean;
  className?: string;
}

/**
 * LightningCursor component that creates lightning effects following mouse movement
 * 
 * Features:
 * - SVG-based lightning bolts for crisp rendering
 * - Smooth animations with framer-motion
 * - Performance optimized
 * - Theme-aware neon yellow lightning
 */
export function LightningCursor({ enabled = true, className = '' }: LightningCursorProps) {
  const { mousePosition, lightningBolts, isMoving } = useMouseLightning({ enabled });

  if (!enabled) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {/* Mouse glow effect */}
      <AnimatePresence>
        {isMoving && (
          <motion.div
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-primary/30 rounded-full blur-md animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightning bolts */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="lightning-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <AnimatePresence>
          {lightningBolts.map((bolt) => (
            <motion.g
              key={bolt.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: bolt.opacity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {/* Main lightning bolt */}
              <motion.line
                x1={bolt.startX}
                y1={bolt.startY}
                x2={bolt.endX}
                y2={bolt.endY}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                filter="url(#lightning-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Lightning glow */}
              <motion.line
                x1={bolt.startX}
                y1={bolt.startY}
                x2={bolt.endX}
                y2={bolt.endY}
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.1 }}
              />
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}
