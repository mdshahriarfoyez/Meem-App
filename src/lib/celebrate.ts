import confetti from 'canvas-confetti';

/** Palette shared by every celebration so the bursts feel part of the same app. */
const COLORS = ['#FF6B8A', '#FFA1B4', '#C3B5F0', '#F2D3A0', '#FFF8F5'];

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A single warm burst — used when a small moment completes. */
export function burst(origin: { x: number; y: number } = { x: 0.5, y: 0.55 }) {
  if (reduced()) return;
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    scalar: 0.9,
    ticks: 180,
    gravity: 0.9,
    colors: COLORS,
    origin,
    disableForReducedMotion: true,
  });
}

/** Two soft side-cannons — the "you finished a chapter" celebration. */
export function cheer() {
  if (reduced()) return;
  const shared = {
    particleCount: 60,
    spread: 80,
    startVelocity: 45,
    scalar: 0.85,
    ticks: 220,
    colors: COLORS,
    disableForReducedMotion: true,
  } as const;
  confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.7 } });
}

/**
 * The finale: a handful of fireworks over ~5s with a light drift of hearts.
 *
 * Deliberately paced on timers rather than per animation frame — firing every
 * frame buries the screen in confetti and the moment stops feeling special.
 * Returns a cleanup function so React can cancel it on unmount.
 */
export function finale(): () => void {
  if (reduced()) return () => {};

  const heart = confetti.shapeFromText({ text: '❤️', scalar: 2 });
  const petal = confetti.shapeFromText({ text: '🤍', scalar: 2 });

  // One firework roughly every 600ms, in the upper half of the screen.
  const fireworks = window.setInterval(() => {
    confetti({
      particleCount: 40,
      spread: 360,
      startVelocity: 24,
      ticks: 110,
      gravity: 0.75,
      scalar: 0.85,
      colors: COLORS,
      origin: { x: 0.2 + Math.random() * 0.6, y: 0.18 + Math.random() * 0.3 },
      disableForReducedMotion: true,
    });
  }, 600);

  // A few hearts drifting down past them.
  const hearts = window.setInterval(() => {
    confetti({
      particleCount: 2,
      spread: 90,
      startVelocity: 10,
      ticks: 300,
      gravity: 0.35,
      scalar: 1.5,
      flat: true,
      shapes: [heart, petal],
      origin: { x: Math.random(), y: -0.1 },
      disableForReducedMotion: true,
    });
  }, 700);

  const stop = () => {
    clearInterval(fireworks);
    clearInterval(hearts);
  };

  const timeout = window.setTimeout(stop, 5000);

  return () => {
    stop();
    clearTimeout(timeout);
  };
}
