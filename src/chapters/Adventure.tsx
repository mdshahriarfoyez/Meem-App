import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { heavySpring, staggerChild, staggerParent } from '../lib/motion';
import { burst } from '../lib/celebrate';
import { haptic } from '../lib/haptics';
import { ADVENTURES, ADVENTURE_REPLY } from '../data/content';

interface Props {
  chosen: string | null;
  onChoose: (id: string) => void;
  onContinue: () => void;
}

/** Three doors, one answer. Whichever she picks was always the right one. */
export function Adventure({ chosen, onChoose, onContinue }: Props) {
  const [picked, setPicked] = useState<string | null>(chosen);

  const choose = (id: string) => {
    if (picked) return;
    haptic('soft');
    burst({ x: 0.5, y: 0.6 });
    setPicked(id);
    onChoose(id);
  };

  return (
    <ChapterFrame eyebrow="Chapter Three · Choose our adventure">
      <h2 className="mb-8 max-w-sm font-display text-[clamp(1.4rem,5.5vw,1.9rem)] leading-snug text-cream">
        What should we do?
      </h2>

      <motion.div
        variants={staggerParent(0.09)}
        initial="initial"
        animate="animate"
        className="grid w-full max-w-md gap-3 sm:grid-cols-3"
      >
        {ADVENTURES.map((adventure) => {
          const isPicked = picked === adventure.id;
          const dimmed = picked !== null && !isPicked;
          return (
            <motion.button
              key={adventure.id}
              type="button"
              variants={staggerChild}
              onClick={() => choose(adventure.id)}
              disabled={picked !== null}
              whileTap={picked ? undefined : { scale: 0.96 }}
              animate={{ opacity: dimmed ? 0.35 : 1, scale: isPicked ? 1.02 : 1 }}
              transition={heavySpring}
              className={[
                'glass flex items-center gap-4 rounded-[24px] px-5 py-4 text-left sm:flex-col sm:items-center sm:gap-2 sm:px-4 sm:py-6 sm:text-center',
                isPicked ? 'ring-1 ring-rose-soft/70' : '',
              ].join(' ')}
            >
              <span className="text-3xl">{adventure.emoji}</span>
              <span>
                <span className="block text-sm font-medium text-cream">{adventure.title}</span>
                <span className="block text-xs text-cream/60">{adventure.blurb}</span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-10 flex h-28 flex-col items-center justify-start">
        <AnimatePresence>
          {picked && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ...heavySpring }}
              className="flex flex-col items-center gap-5"
            >
              <p className="font-display text-xl text-cream">{ADVENTURE_REPLY}</p>
              <PrimaryButton onClick={onContinue}>Continue →</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  );
}
