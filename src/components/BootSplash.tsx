import { motion } from 'framer-motion';

/** First-paint transition: a heart drawing a breath before the story starts. */
export function BootSplash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-800"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.06, 1], opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl drop-shadow-[0_0_36px_rgba(255,107,138,0.7)]"
      >
        ❤️
      </motion.span>
    </motion.div>
  );
}
