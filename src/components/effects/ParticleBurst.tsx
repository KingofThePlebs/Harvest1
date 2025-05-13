"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef }      from 'react';
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
  particleColors = ['hsl(var(--primary))', 'hsl(var(--accent))', '#FFDA63'],
  particleSizeRange = [4, 8],
  duration = 700,
  maxInitialSpeed = 3,
  gravity = 0.08,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const hasCalledOnCompleteRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    hasCalledOnCompleteRef.current = false; // Reset for new instance

    const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocityMagnitude = Math.random() * maxInitialSpeed;
      const size = Math.random() * (particleSizeRange[1] - particleSizeRange[0]) + particleSizeRange[0];
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      return {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocityMagnitude,
        vy: Math.sin(angle) * velocityMagnitude - (Math.random() * 1.5 + 1.0),
        opacity: 1,
        size,
        color,
        rotation: Math.random() * 360,
        angularVelocity: (Math.random() - 0.5) * 10,
      };
    });
    setParticles(newParticles);
    startTimeRef.current = performance.now();

    const animationLoop = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      const elapsedTime = currentTime - startTimeRef.current;
      let activeParticlesExistThisFrame = false;

      setParticles(prevParticles => {
        // If the component was unmounted or particles cleared by another means,
        // prevParticles might be empty. Avoid processing.
        if (prevParticles.length === 0 && elapsedTime > 0) {
            activeParticlesExistThisFrame = false;
            return [];
        }

        const updatedParticles = prevParticles
          .map(p => {
            const progress = Math.min(elapsedTime / duration, 1);
            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + gravity,
              opacity: 1 - Math.pow(progress, 2),
              rotation: p.rotation + p.angularVelocity * 0.016, 
            };
          })
          .filter(p => p.opacity > 0.01); 

        activeParticlesExistThisFrame = updatedParticles.length > 0;
        return updatedParticles;
      });

      if (activeParticlesExistThisFrame && elapsedTime < duration) {
        animationFrameId.current = requestAnimationFrame(animationLoop);
      } else {
        // Animation ends: either no particles left or duration exceeded
        animationFrameId.current = null; // Stop the loop
        if (!hasCalledOnCompleteRef.current) {
          hasCalledOnCompleteRef.current = true;
          onAnimationComplete();
        }
      }
    };

    animationFrameId.current = requestAnimationFrame(animationLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // If component unmounts (e.g. parent sets particleBurstState to null)
      // and animation hasn't naturally completed, we might call onAnimationComplete
      // to ensure parent knows. However, parent is causing unmount, so it knows.
      // Calling it here could cause issues if parent's onAnimationComplete handler
      // is not idempotent or expects to be called only on natural completion.
      // For now, rely on natural completion to call it.
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, particleCount, particleColors, particleSizeRange, duration, maxInitialSpeed, gravity, onAnimationComplete]);

  if (!isClient || particles.length === 0) {
    // particles.length === 0 check prevents rendering briefly before particles are initialized
    // or after they are cleared.
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="pointer-events-none fixed"
      style={{ 
        transform: `translate(${originX}px, ${originY}px)`, 
        zIndex: 9999
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
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>,
    document.body
  );
};

export default ParticleBurst;
