
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  color: string;
  rotation: number;
  angularVelocity: number;
}

interface ParticleBurstProps {
  originX: number;
  originY: number;
  particleCount?: number;
  onAnimationComplete: () => void;
  particleColors?: string[];
  particleSizeRange?: [number, number];
  duration?: number;
  maxInitialSpeed?: number;
  gravity?: number;
}

const ParticleBurst: FC<ParticleBurstProps> = ({
  originX,
  originY,
  particleCount = 15,
  onAnimationComplete,
  particleColors = ['hsl(var(--primary))', 'hsl(var(--accent))', '#FFDA63'], // Gold-ish, matches theme
  particleSizeRange = [4, 8], // pixels
  duration = 700, // milliseconds
  maxInitialSpeed = 3, // pixels per frame factor
  gravity = 0.08, // acceleration per frame
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocityMagnitude = Math.random() * maxInitialSpeed;
      const size = Math.random() * (particleSizeRange[1] - particleSizeRange[0]) + particleSizeRange[0];
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      return {
        id: i,
        x: 0, // Relative to origin container
        y: 0, // Relative to origin container
        vx: Math.cos(angle) * velocityMagnitude,
        vy: Math.sin(angle) * velocityMagnitude - (Math.random() * 1.5 + 1.0), // Initial upward pop
        opacity: 1,
        size,
        color,
        rotation: Math.random() * 360,
        angularVelocity: (Math.random() - 0.5) * 10, // Degrees per physics tick (approx 16ms)
      };
    });
    setParticles(newParticles);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime; // Initialize if somehow missed
      }
      const elapsedTime = currentTime - startTimeRef.current;

      setParticles(prevParticles => {
        // This check ensures that if onAnimationComplete was called early (e.g. by prevParticles being empty),
        // we don't try to process further.
        if (prevParticles.length === 0 && elapsedTime > 0) { 
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             // onAnimationComplete(); // Already called or will be called in the main check
            return [];
        }

        const updatedParticles = prevParticles.map(p => {
          const progress = Math.min(elapsedTime / duration, 1);
          return {
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity, // Apply gravity
            opacity: 1 - Math.pow(progress, 2), // Fade out (ease-out quadratic)
            rotation: p.rotation + p.angularVelocity * 0.016, // Assuming roughly 60fps for rotation speed
          };
        }).filter(p => p.opacity > 0.01); // Remove particles that are too transparent

        if (updatedParticles.length === 0 || elapsedTime >= duration) {
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
          startTimeRef.current = null;
          onAnimationComplete();
          return []; // Ensure particles are cleared
        }
        return updatedParticles;
      });
      
      // Continue animation only if time hasn't run out AND there are particles (implicitly, via setParticles update)
      if (elapsedTime < duration) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, particleCount, particleColors, particleSizeRange, duration, maxInitialSpeed, gravity]); // onAnimationComplete is stable, originX/Y only for portal position

  if (!isClient || particles.length === 0) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="pointer-events-none fixed" // Use fixed for viewport positioning
      style={{ 
        transform: `translate(${originX}px, ${originY}px)`, 
        zIndex: 9999  // Ensure particles are on top
      }}
      aria-hidden="true"
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: `translate(${p.x - p.size / 2}px, ${p.y - p.size / 2}px) rotate(${p.rotation}deg)`,
            willChange: 'transform, opacity', // Hint for browser optimization
          }}
        />
      ))}
    </div>,
    document.body // Portal to the document body
  );
};

export default ParticleBurst;
