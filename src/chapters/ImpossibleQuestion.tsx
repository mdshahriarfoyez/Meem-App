import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { heavySpring, silkSpring } from '../lib/motion';
import { cheer } from '../lib/celebrate';
import { haptic } from '../lib/haptics';
import { MAYBE_EXCUSES, QUESTION, YES_LABEL } from '../data/content';

const LAST = MAYBE_EXCUSES.length - 1;

/**
 * No running-away button. The "Maybe" simply runs out of excuses: each tap
 * swaps in a new one and shrinks it slightly, until it gives up and turns
 * into a second "Absolutely".
 */
export function ImpossibleQuestion({ onYes }: { onYes: () => void }) {
  const [excuse, setExcuse] = useState(0);
  const [surrendered, setSurrendered] = useState(false);

  const tapMaybe = () => {
    if (surrendered) {
      accept();
      return;
    }
    haptic('tick');
    if (excuse >= LAST) {
      setSurrendered(true);
      haptic('double');
      return;
    }
    setExcuse((i) => i + 1);
  };

  const accept = () => {
    haptic('celebrate');
    cheer();
    onYes();
  };

  // Shrinks a little with every excuse, then springs back once it surrenders.
  const maybeScale = surrendered ? 1 : 1 - excuse * 0.07;

  return (
    <ChapterFrame eyebrow="Chapter Five · One question">
      <h2 className="max-w-sm font-display text-[clamp(1.5rem,6vw,2.1rem)] leading-snug text-cream">
        {QUESTION}
      </h2>

      <div className="mt-12 flex flex-col items-center gap-4">
        <PrimaryButton hero onClick={accept}>
          {YES_LABEL}
        </PrimaryButton>

        <motion.div animate={{ scale: maybeScale }} transition={heavySpring}>
          <PrimaryButton
            variant={surrendered ? 'solid' : 'ghost'}
            hero={surrendered}
            onClick={tapMaybe}
            className="min-w-[11rem]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={surrendered ? 'surrender' : excuse}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={silkSpring}
                className="block whitespace-nowrap"
              >
                {surrendered ? YES_LABEL : MAYBE_EXCUSES[excuse]}
              </motion.span>
            </AnimatePresence>
          </PrimaryButton>
        </motion.div>

        <AnimatePresence>
          {surrendered && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs tracking-[0.2em] text-cream uppercase"
            >
              it ran out of excuses
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  );
}
