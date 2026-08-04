import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { StarHeart } from '../components/background/StarHeart';
import { GlassCard } from '../components/ui/GlassCard';
import { useLongPress } from '../hooks/useLongPress';
import { heavySpring, lineVariants } from '../lib/motion';
import { finale as fireworks } from '../lib/celebrate';
import { haptic } from '../lib/haptics';
import {
  FINALE_LEAD,
  FINALE_QUESTION,
  FINALE_REPLY,
  FINALE_YES,
  HIDDEN_MESSAGE,
} from '../data/content';

type Phase = 'stars' | 'lead' | 'question' | 'celebrating';

interface Props {
  /** Lets the app swap the backdrop to sunrise colours when she says yes. */
  onCelebrate: () => void;
  hiddenFound: boolean;
  onHiddenFound: () => void;
}

export function Finale({ onCelebrate, hiddenFound, onHiddenFound }: Props) {
  const [phase, setPhase] = useState<Phase>('stars');
  const [showHidden, setShowHidden] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Constellation finishes → "So…" → one beat → the question.
  const onConstellationDone = useCallback(() => {
    setPhase((p) => (p === 'stars' ? 'lead' : p));
  }, []);

  useEffect(() => {
    if (phase !== 'lead') return;
    const timer = window.setTimeout(() => setPhase('question'), 1600);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => () => cleanupRef.current?.(), []);

  const sayYes = () => {
    haptic('celebrate');
    setPhase('celebrating');
    onCelebrate();
    cleanupRef.current = fireworks();
  };

  const revealHidden = useCallback(() => {
    haptic('celebrate');
    setShowHidden(true);
    onHiddenFound();
  }, [onHiddenFound]);

  const hold = useLongPress({ duration: 3000, onComplete: revealHidden });

  return (
    <ChapterFrame>
      {/* The constellation lives behind the whole chapter, and steps back to a
          quiet glow once the words arrive so the text stays readable. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: phase === 'stars' ? 1 : 0.42 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <StarHeart duration={4} onComplete={onConstellationDone} />
      </motion.div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === 'lead' && (
            <motion.p
              key="lead"
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="font-display text-4xl text-cream"
            >
              {FINALE_LEAD}
            </motion.p>
          )}

          {phase === 'question' && (
            <motion.div
              key="question"
              variants={lineVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center gap-10"
            >
              <h2 className="font-display text-[clamp(1.5rem,6vw,2.1rem)] leading-snug text-cream">
                {FINALE_QUESTION}
              </h2>
              <PrimaryButton hero onClick={sayYes} className="tracking-[0.08em]">
                {FINALE_YES}
              </PrimaryButton>
            </motion.div>
          )}

          {phase === 'celebrating' && (
            <motion.div
              key="celebrating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={heavySpring}
              className="flex flex-col items-center"
            >
              {/* Hold this heart for three seconds. */}
              <motion.button
                type="button"
                {...hold.handlers}
                aria-label="Hold me"
                animate={{ scale: hold.holding ? 1.14 : [1, 1.08, 1] }}
                transition={
                  hold.holding
                    ? { type: 'spring', stiffness: 200, damping: 20 }
                    : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                }
                className="relative flex h-28 w-28 items-center justify-center text-7xl drop-shadow-[0_0_40px_rgba(255,107,138,0.75)]"
              >
                ❤️
                {/* Ring that fills while she holds. */}
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(255,248,245,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - hold.progress)}
                    opacity={hold.progress > 0 ? 1 : 0}
                  />
                </svg>
              </motion.button>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ...heavySpring }}
                className="text-warm mt-8 font-display text-[clamp(1.8rem,8vw,2.6rem)] leading-none"
              >
                {FINALE_REPLY}
              </motion.p>

              {!hiddenFound && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 5, duration: 2 }}
                  className="mt-10 text-[0.62rem] tracking-[0.24em] text-cream uppercase"
                >
                  hold the heart, don't let go
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The message meant only for her. */}
      <AnimatePresence>
        {showHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHidden(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 px-6 backdrop-blur-xl"
          >
            <GlassCard
              glow
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={heavySpring}
              // Nearly opaque: the celebration behind it must not read through
              // the one message meant to be read on its own.
              style={{ background: 'rgba(10,14,32,0.94)' }}
              className="max-w-sm px-8 py-10"
            >
              <p className="font-hand text-[1.6rem] leading-relaxed text-cream">
                {HIDDEN_MESSAGE}
              </p>
              <p className="mt-8 text-[0.62rem] tracking-[0.24em] text-cream/50 uppercase">
                tap to close
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterFrame>
  );
}
