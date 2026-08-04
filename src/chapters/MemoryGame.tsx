import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { heavySpring, staggerChild, staggerParent } from '../lib/motion';
import { cheer } from '../lib/celebrate';
import { haptic } from '../lib/haptics';
import { MEMORY_CARDS, type MemoryCard } from '../data/content';

/** A single flip card. Front is the memory, back is the note hidden inside. */
function Card({ card, flipped, onFlip }: { card: MemoryCard; flipped: boolean; onFlip: () => void }) {
  return (
    <motion.button
      type="button"
      variants={staggerChild}
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={card.label}
      whileTap={{ scale: 0.95 }}
      className="relative aspect-3/2 w-full perspective-distant"
    >
      <motion.div
        className="relative h-full w-full transform-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={heavySpring}
      >
        {/* Front */}
        <div className="glass absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[24px] px-2 backface-hidden">
          <span className="text-[clamp(1.6rem,7vw,2.2rem)]">{card.emoji}</span>
          <span className="text-[0.68rem] leading-tight tracking-wide text-cream/75">
            {card.label}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[24px] border border-rose-soft/25 bg-[linear-gradient(150deg,rgba(255,107,138,0.22),rgba(139,124,200,0.18))] px-3 backface-hidden transform-[rotateY(180deg)]"
          style={{ backdropFilter: 'blur(16px)' }}
        >
          <span className="font-display text-[0.74rem] leading-snug text-cream">
            {card.message}
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
}

export function MemoryGame({ onContinue }: { onContinue: () => void }) {
  const [opened, setOpened] = useState<string[]>([]);
  const complete = opened.length === MEMORY_CARDS.length;

  useEffect(() => {
    if (complete) cheer();
  }, [complete]);

  const flip = (id: string) => {
    if (opened.includes(id)) return;
    haptic('tick');
    setOpened((prev) => [...prev, id]);
  };

  return (
    <ChapterFrame eyebrow="Chapter Two · Little memories">
      <p className="mb-5 max-w-xs text-sm text-cream/70">
        Eight small things. Open every one.
      </p>

      <motion.div
        variants={staggerParent(0.06)}
        initial="initial"
        animate="animate"
        className="grid w-full max-w-88 grid-cols-2 gap-3 sm:max-w-lg sm:grid-cols-4"
      >
        {MEMORY_CARDS.map((card) => (
          <Card
            key={card.id}
            card={card}
            flipped={opened.includes(card.id)}
            onFlip={() => flip(card.id)}
          />
        ))}
      </motion.div>

      <div className="mt-7 flex h-20 flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, ...heavySpring }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-sm text-cream/75">That is all of them. Every one true.</p>
              <PrimaryButton onClick={onContinue}>Continue →</PrimaryButton>
            </motion.div>
          ) : (
            <motion.p
              key="count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="text-xs tracking-[0.2em] text-cream uppercase"
            >
              {opened.length} / {MEMORY_CARDS.length} opened
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ChapterFrame>
  );
}
