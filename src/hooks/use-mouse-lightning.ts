'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface LightningBolt {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  createdAt: number;
}

interface UseLightningOptions {
  enabled?: boolean;
  maxBolts?: number;
  boltLifetime?: number;
  minDistance?: number;
  intensity?: number;
}

/**
 * Custom hook for creating mouse-following lightning effects
 *
 * Features:
 * - Tracks mouse position with high precision
 * - Generates lightning bolts based on mouse movement
 * - Manages bolt lifecycle and animations
 * - Performance optimized with requestAnimationFrame
 *
 * @param options Configuration options for lightning behavior
 * @returns Lightning state and mouse position data
 */
export function useMouseLightning(options: UseLightningOptions = {}) {
  const {
    enabled = true,
    maxBolts = 5,
    boltLifetime = 1000,
    minDistance = 50,
    intensity = 0.8
  } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  const lastPositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const movementTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generate random lightning bolt path
  const generateLightningPath = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    if (distance < minDistance) return null;

    // Create jagged lightning path
    const segments = Math.max(3, Math.floor(distance / 20));
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const baseX = startX + (endX - startX) * t;
      const baseY = startY + (endY - startY) * t;

      // Add random offset for lightning effect
      const offsetX = (Math.random() - 0.5) * 30 * (1 - Math.abs(t - 0.5) * 2);
      const offsetY = (Math.random() - 0.5) * 30 * (1 - Math.abs(t - 0.5) * 2);

      points.push({
        x: baseX + offsetX,
        y: baseY + offsetY
      });
    }

    return points;
  }, [minDistance]);

  // Create new lightning bolt
  const createLightningBolt = useCallback((currentX: number, currentY: number) => {
    const lastPos = lastPositionRef.current;
    const path = generateLightningPath(lastPos.x, lastPos.y, currentX, currentY);

    if (!path) return;

    const newBolt: LightningBolt = {
      id: `bolt-${Date.now()}-${Math.random()}`,
      startX: lastPos.x,
      startY: lastPos.y,
      endX: currentX,
      endY: currentY,
      opacity: intensity,
      createdAt: Date.now()
    };

    setLightningBolts(prev => {
      const filtered = prev.filter(bolt => Date.now() - bolt.createdAt < boltLifetime);
      const newBolts = [...filtered, newBolt];
      return newBolts.slice(-maxBolts);
    });
  }, [generateLightningPath, intensity, boltLifetime, maxBolts]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    setMousePosition({ x: currentX, y: currentY });
    setIsMoving(true);

    // Clear existing timeout
    if (movementTimeoutRef.current) {
      clearTimeout(movementTimeoutRef.current);
    }

    // Set movement to false after a delay
    movementTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 100);

    // Create lightning bolt if mouse moved significantly
    const lastPos = lastPositionRef.current;
    const distance = Math.sqrt(
      Math.pow(currentX - lastPos.x, 2) + Math.pow(currentY - lastPos.y, 2)
    );

    if (distance > minDistance) {
      createLightningBolt(currentX, currentY);
      lastPositionRef.current = { x: currentX, y: currentY };
    }
  }, [enabled, minDistance, createLightningBolt]);

  // Animation loop for bolt opacity updates
  const animateLoop = useCallback(() => {
    setLightningBolts(prev => {
      const now = Date.now();
      return prev
        .map(bolt => ({
          ...bolt,
          opacity: Math.max(0, intensity * (1 - (now - bolt.createdAt) / boltLifetime))
        }))
        .filter(bolt => bolt.opacity > 0.01);
    });

    animationFrameRef.current = requestAnimationFrame(animateLoop);
  }, [intensity, boltLifetime]);

  // Set up event listeners and animation loop
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current);
      }
    };
  }, [enabled, handleMouseMove, animateLoop]);

  return {
    mousePosition,
    lightningBolts,
    isMoving,
    enabled
  };
}
