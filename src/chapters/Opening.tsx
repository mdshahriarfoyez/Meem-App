import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { TapHint } from '../components/ui/TapHint';
import { lineVariants } from '../lib/motion';
import { haptic } from '../lib/haptics';
import { HER_NAME } from '../data/content';

interface Props {
  onContinue: () => void;
  onSecret: () => void;
  secretFound: boolean;
}

const BEATS = ['I made something just for you…', 'Tap anywhere.'];

/** Taps on the title within this window count toward the easter egg. */
const TAP_WINDOW = 1200;
const TAPS_TO_UNLOCK = 5;

export function Opening({ onContinue, onSecret, secretFound }: Props) {
  const [beat, setBeat] = useState(-1);
  const taps = useRef(0);
  const lastTap = useRef(0);

  // Reveal the beats on a timer; the last one waits for her.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBeat(0), 2200),
      window.setTimeout(() => setBeat(1), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleTitleTap = (event: React.MouseEvent) => {
    event.stopPropagation(); // never advance the story from the title
    const now = Date.now();
    taps.current = now - lastTap.current < TAP_WINDOW ? taps.current + 1 : 1;
    lastTap.current = now;
    haptic('tick');

    if (taps.current >= TAPS_TO_UNLOCK) {
      taps.current = 0;
      haptic('double');
      onSecret();
    }
  };

  return (
    <ChapterFrame onTap={beat >= 1 ? onContinue : undefined}>
      <motion.h1
        onClick={handleTitleTap}
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.97 }}
        className="text-warm text-glow cursor-pointer font-display text-[clamp(2.6rem,13vw,4.5rem)] leading-none font-medium"
      >
        Hi {HER_NAME} <span className="text-rose-glow">❤️</span>
      </motion.h1>

      <div className="mt-10 flex h-24 flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {beat === 0 && (
            <motion.p
              key="beat-0"
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-xs text-lg text-cream/85"
            >
              {BEATS[0]}
            </motion.p>
          )}
          {beat === 1 && (
            <motion.div key="beat-1" variants={lineVariants} initial="initial" animate="animate">
              <TapHint label={BEATS[1]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* A whisper of a hint, only before she has found the easter egg. */}
      {beat >= 1 && !secretFound && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ delay: 6, duration: 2 }}
          className="absolute bottom-24 text-[0.65rem] tracking-[0.2em] text-cream uppercase"
        >
          some things like being tapped more than once
        </motion.p>
      )}
    </ChapterFrame>
  );
}
