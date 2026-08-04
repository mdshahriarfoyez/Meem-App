import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { chapterVariants } from '../../lib/motion';

interface Props {
  children: ReactNode;
  /** Small label shown above the content, e.g. "Chapter Two". */
  eyebrow?: string;
  /** Makes the whole frame a tap target — used by the read-along chapters. */
  onTap?: () => void;
  className?: string;
}

/** Shared layout + enter/exit motion for every chapter. */
export function ChapterFrame({ children, eyebrow, onTap, className = '' }: Props) {
  return (
    <motion.section
      variants={chapterVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onTap}
      className={[
        'relative flex min-h-full w-full flex-col items-center justify-center',
        // Padding clears the floating chrome (top buttons, bottom navigator) on
        // chapters whose content is taller than the viewport.
        'px-6 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(7rem+env(safe-area-inset-bottom))] text-center',
        onTap ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mb-7 text-[0.65rem] tracking-[0.4em] text-cream/60 uppercase"
        >
          {eyebrow}
        </motion.p>
      )}
      {children}
    </motion.section>
  );
}
