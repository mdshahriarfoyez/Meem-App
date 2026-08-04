import type { Transition, Variants } from 'framer-motion';

/** Shared spring — soft, slightly weighted, never bouncy enough to feel cheap. */
export const silkSpring: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

/** Slower spring for large surfaces (cards, letters, chapter frames). */
export const heavySpring: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 24,
  mass: 1.1,
};

export const easeSilk = [0.22, 1, 0.36, 1] as const;

/** Chapter-level transition: rise in, sink out. */
export const chapterVariants: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeSilk },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(8px)',
    transition: { duration: 0.45, ease: easeSilk },
  },
};

/** Line-level fade used by the love story and any single-sentence reveal. */
export const lineVariants: Variants = {
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: easeSilk },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(6px)',
    transition: { duration: 0.5, ease: easeSilk },
  },
};

/** Parent that reveals children one after another. */
export const staggerParent = (stagger = 0.08, delay = 0.1): Variants => ({
  initial: {},
  animate: { transition: { staggerChildren: stagger, delayChildren: delay } },
  exit: {},
});

export const staggerChild: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: silkSpring },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

/** Press feedback shared by every tappable surface. */
export const pressable = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: silkSpring,
};
