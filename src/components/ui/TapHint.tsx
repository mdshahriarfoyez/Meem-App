import { motion } from 'framer-motion';

/** The quiet, breathing "tap to continue" cue used between beats. */
export function TapHint({ label = 'Tap to continue' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.75, 0.35, 0.75] }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      }}
      className="flex flex-col items-center gap-2 text-cream/70"
    >
      <span className="text-[0.7rem] tracking-[0.28em] uppercase">{label}</span>
      <motion.span
        aria-hidden
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="block h-1.5 w-1.5 rounded-full bg-rose-soft"
      />
    </motion.div>
  );
}
