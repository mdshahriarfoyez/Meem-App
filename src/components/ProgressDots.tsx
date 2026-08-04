import { motion } from 'framer-motion';
import { CHAPTER_ORDER } from '../types';
import { silkSpring } from '../lib/motion';
import { haptic } from '../lib/haptics';

interface Props {
  stage: number;
  /** Deepest chapter reached — anything beyond it stays locked. */
  furthest: number;
  onJump: (stage: number) => void;
}

const LABELS = [
  'Opening',
  'A tiny love story',
  'Little memories',
  'Our adventure',
  'Love meter',
  'A question',
  'The letter',
  'The stars',
];

/** Chapter navigator. Only unlocked chapters are tappable. */
export function ProgressDots({ stage, furthest, onJump }: Props) {
  return (
    <nav
      aria-label="Chapters"
      className="glass flex items-center gap-1 rounded-full px-2.5 py-2"
    >
      {CHAPTER_ORDER.map((id, index) => {
        const unlocked = index <= furthest;
        const active = index === stage;
        return (
          <button
            key={id}
            type="button"
            disabled={!unlocked}
            aria-label={LABELS[index]}
            aria-current={active ? 'step' : undefined}
            onClick={() => {
              haptic('tick');
              onJump(index);
            }}
            className="flex h-6 w-4 items-center justify-center disabled:cursor-default"
          >
            <motion.span
              layout
              transition={silkSpring}
              className={[
                'block rounded-full',
                active
                  ? 'h-1.5 w-4 bg-rose-soft'
                  : unlocked
                    ? 'h-1.5 w-1.5 bg-cream/55'
                    : 'h-1.5 w-1.5 bg-cream/15',
              ].join(' ')}
            />
          </button>
        );
      })}
    </nav>
  );
}
