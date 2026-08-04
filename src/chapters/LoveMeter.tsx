import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { heavySpring } from '../lib/motion';
import { burst } from '../lib/celebrate';
import { haptic } from '../lib/haptics';
import { METER_STEPS } from '../data/content';

const TARGET = 100_000_000;
const STEP_MS = 900;
const COUNT_MS = 1800;

/** Counts up to the result with an ease-out so it lands softly. */
function useCountUp(active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(TARGET * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return value;
}

export function LoveMeter({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const count = useCountUp(done);

  // Cycle the funny status lines, then reveal the result.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setStep((s) => {
        if (s + 1 >= METER_STEPS.length) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);

    const finish = window.setTimeout(() => {
      setDone(true);
      haptic('celebrate');
      burst({ x: 0.5, y: 0.45 });
    }, STEP_MS * METER_STEPS.length);

    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
  }, []);

  return (
    <ChapterFrame eyebrow="Chapter Four · Love meter">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="loading"
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream/10">
              <motion.div
                // Deliberately stalls twice — a bar that fills evenly is not funny.
                initial={{ width: '0%' }}
                animate={{
                  width: ['0%', '34%', '36%', '62%', '64%', '89%', '100%'],
                }}
                transition={{
                  duration: (STEP_MS * METER_STEPS.length) / 1000,
                  times: [0, 0.16, 0.3, 0.45, 0.62, 0.8, 1],
                  ease: 'easeInOut',
                }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#C3B5F0,#FF6B8A,#F2D3A0)]"
              />
            </div>

            <div className="mt-6 h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm tracking-wide text-cream"
                >
                  {METER_STEPS[step]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={heavySpring}
            className="flex flex-col items-center"
          >
            <motion.span
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl drop-shadow-[0_0_30px_rgba(255,107,138,0.6)]"
            >
              ❤️
            </motion.span>

            <p className="mt-5 text-[0.7rem] tracking-[0.42em] text-cream/70 uppercase">
              Love detected
            </p>

            <p className="text-warm mt-2 font-display text-[clamp(2rem,10vw,3.2rem)] leading-none font-medium tabular-nums">
              {count.toLocaleString('en-US')}%
            </p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              className="mt-6 text-sm text-cream"
            >
              No surprise there.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, ...heavySpring }}
              className="mt-8"
            >
              <PrimaryButton onClick={onContinue}>Continue →</PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterFrame>
  );
}
