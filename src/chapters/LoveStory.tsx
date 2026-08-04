import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { TapHint } from '../components/ui/TapHint';
import { lineVariants } from '../lib/motion';
import { haptic } from '../lib/haptics';
import { STORY_LINES } from '../data/content';

/** One sentence at a time. Tapping anywhere moves to the next. */
export function LoveStory({ onContinue }: { onContinue: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index === STORY_LINES.length - 1;

  const next = () => {
    haptic('tick');
    if (isLast) onContinue();
    else setIndex((i) => i + 1);
  };

  return (
    <ChapterFrame eyebrow="Chapter One · A tiny love story" onTap={next}>
      <div className="flex min-h-[9rem] w-full max-w-md items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            variants={lineVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="font-display text-[clamp(1.5rem,6.5vw,2.25rem)] leading-snug text-cream"
          >
            {STORY_LINES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress rail — quiet, but tells her how much is left. */}
      <div className="mt-10 flex gap-1.5" aria-hidden>
        {STORY_LINES.map((line, i) => (
          <motion.span
            key={line}
            animate={{
              width: i === index ? 20 : 6,
              opacity: i <= index ? 0.85 : 0.25,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="h-[3px] rounded-full bg-rose-soft"
          />
        ))}
      </div>

      <div className="mt-12">
        <TapHint label={isLast ? 'Tap to keep going' : 'Tap to continue'} />
      </div>
    </ChapterFrame>
  );
}
