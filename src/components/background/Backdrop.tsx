import { motion } from 'framer-motion';
import { ParticleField } from './ParticleField';

export type Mood = 'night' | 'warm' | 'sunrise';

/**
 * Colour washes for each act of the story. Two soft blobs plus a base tint —
 * animating them between moods is what makes the finale feel like a sunrise
 * rather than a scene change.
 */
const MOODS: Record<Mood, { base: string; blobA: string; blobB: string }> = {
  night: {
    base: '#0A0E20',
    blobA: 'rgba(255,107,138,0.20)',
    blobB: 'rgba(139,124,200,0.22)',
  },
  warm: {
    base: '#120E22',
    blobA: 'rgba(255,107,138,0.30)',
    blobB: 'rgba(242,211,160,0.20)',
  },
  sunrise: {
    base: '#41202F',
    blobA: 'rgba(255,146,110,0.55)',
    blobB: 'rgba(247,205,140,0.50)',
  },
};

export function Backdrop({ mood = 'night' }: { mood?: Mood }) {
  const palette = MOODS[mood];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: palette.base }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />

      {/* Slow-drifting colour blobs. Heavily blurred, so low opacity is plenty. */}
      <motion.div
        className="absolute -top-1/4 left-[-20%] h-[70vh] w-[70vh] rounded-full blur-[110px]"
        animate={{
          backgroundColor: palette.blobA,
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          backgroundColor: { duration: 2.2, ease: 'easeInOut' },
          x: { duration: 26, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 32, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="absolute right-[-25%] bottom-[-20%] h-[75vh] w-[75vh] rounded-full blur-[120px]"
        animate={{
          backgroundColor: palette.blobB,
          x: [0, -35, 25, 0],
          y: [0, 25, -20, 0],
        }}
        transition={{
          backgroundColor: { duration: 2.2, ease: 'easeInOut' },
          x: { duration: 30, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Vignette keeps attention in the centre of the screen. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <ParticleField density={mood === 'sunrise' ? 95 : 70} />
    </div>
  );
}
