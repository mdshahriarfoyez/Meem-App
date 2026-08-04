import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  /** Particles per million square pixels — scales with the viewport. */
  density?: number;
  className?: string;
}

const COLORS = ['#FF6B8A', '#C3B5F0', '#F2D3A0', '#FFF8F5'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  speed: number;
  sprite: HTMLCanvasElement;
}

/**
 * Soft glowing dots drifting upward behind the whole app.
 *
 * Each colour is pre-rendered once into an offscreen sprite and blitted with
 * drawImage; painting radial gradients per particle per frame is what makes
 * naive versions of this stutter on phones.
 */
export function ParticleField({ density = 70, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Cap the pixel ratio: 3x on a modern phone costs a lot for a blurry dot.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    /** Pre-render one glow sprite per colour. */
    const makeSprite = (color: string, radius: number) => {
      const size = Math.ceil(radius * 2 * dpr);
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext('2d')!;
      const gradient = sctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.35, `${color}80`);
      gradient.addColorStop(1, `${color}00`);
      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, size, size);
      return sprite;
    };

    const sprites = COLORS.map((c) => makeSprite(c, 24));

    const seed = () => {
      const count = Math.round((width * height * density) / 1_000_000);
      particles = Array.from({ length: count }, () => {
        const r = 1 + Math.random() * 3.2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -0.06 - Math.random() * 0.16,
          r,
          alpha: 0.18 + Math.random() * 0.42,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
          sprite: sprites[Math.floor(Math.random() * sprites.length)],
        };
      });
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();

    let last = performance.now();
    const draw = (now: number) => {
      // Normalise to 60fps so motion speed is frame-rate independent.
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.phase += 0.012 * p.speed * dt;
          // Wrap around the edges so the field never thins out.
          if (p.y < -30) {
            p.y = height + 30;
            p.x = Math.random() * width;
          }
          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
        }

        const twinkle = 0.65 + Math.sin(p.phase) * 0.35;
        const size = p.r * 5;
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.drawImage(p.sprite, p.x - size / 2, p.y - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
