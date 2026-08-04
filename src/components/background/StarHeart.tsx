import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  /** Seconds the constellation takes to draw itself. */
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

const POINTS = 34;

/** Classic parametric heart, normalised to roughly [-1, 1] on both axes. */
function heartPoint(t: number) {
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x / 17, y: -y / 17 };
}

/**
 * A field of stars in which a heart-shaped constellation slowly connects
 * itself, one star at a time.
 */
export function StarHeart({ duration = 4, onComplete, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let notified = false;

    // Ambient background stars.
    let field: { x: number; y: number; r: number; phase: number; a: number }[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 9000);
      field = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        a: 0.25 + Math.random() * 0.55,
      }));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      // Reduced motion: show the finished constellation immediately.
      const t = reduced ? 1 : Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      // --- background stars ---------------------------------------------
      for (const s of field) {
        const twinkle = 0.6 + Math.sin(now / 900 + s.phase) * 0.4;
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = '#FFF8F5';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- constellation -------------------------------------------------
      const scale = Math.min(width, height) * 0.32;
      const cx = width / 2;
      const cy = height / 2;
      const revealed = t * POINTS;

      const at = (i: number) => {
        const p = heartPoint((i / POINTS) * Math.PI * 2);
        return { x: cx + p.x * scale, y: cy + p.y * scale };
      };

      // Lines trail slightly behind the stars so the shape "draws" itself.
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,107,138,0.45)';
      ctx.beginPath();
      for (let i = 0; i < Math.min(POINTS, Math.floor(revealed)); i++) {
        const a = at(i);
        const b = at(i + 1);
        const segment = Math.min(1, revealed - i);
        ctx.globalAlpha = 0.55 * segment;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * segment, a.y + (b.y - a.y) * segment);
      }
      ctx.stroke();

      for (let i = 0; i < POINTS; i++) {
        const appear = Math.max(0, Math.min(1, revealed - i));
        if (appear <= 0) continue;
        const { x, y } = at(i);
        const pulse = 0.8 + Math.sin(now / 700 + i) * 0.2;
        const r = 2.4 * appear * pulse;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        glow.addColorStop(0, 'rgba(255,161,180,0.9)');
        glow.addColorStop(1, 'rgba(255,107,138,0)');
        ctx.globalAlpha = appear;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFF8F5';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (t >= 1 && !notified) {
        notified = true;
        onCompleteRef.current?.();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [duration, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
