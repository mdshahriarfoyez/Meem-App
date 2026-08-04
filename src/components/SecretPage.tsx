import { motion } from 'framer-motion';
import { staggerChild, staggerParent, silkSpring } from '../lib/motion';
import { ParticleField } from './background/ParticleField';
import { SECRET_REASONS, SECRET_TITLE } from '../data/content';

/** The easter egg: unlocked by tapping the title five times. */
export function SecretPage({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-40 overflow-hidden bg-navy-900/92 backdrop-blur-xl"
    >
      <ParticleField density={45} />

      <div className="soft-scroll pad-safe relative h-full overflow-y-auto overscroll-contain px-6">
        <div className="mx-auto flex max-w-md flex-col items-center pt-16 pb-24">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[0.62rem] tracking-[0.4em] text-cream uppercase"
          >
            You found it
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-warm mt-4 text-center font-display text-[clamp(1.7rem,7vw,2.4rem)] leading-tight"
          >
            {SECRET_TITLE}
          </motion.h2>

          <motion.ol
            variants={staggerParent(0.07, 0.5)}
            initial="initial"
            animate="animate"
            className="mt-10 flex w-full flex-col gap-2.5"
          >
            {SECRET_REASONS.map((reason, index) => (
              <motion.li
                key={reason}
                variants={staggerChild}
                className="glass flex items-center gap-4 rounded-[24px] px-5 py-3.5 text-left"
              >
                <span className="w-6 shrink-0 font-display text-sm text-rose-soft tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.95rem] leading-snug text-cream/90">{reason}</span>
              </motion.li>
            ))}
          </motion.ol>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: SECRET_REASONS.length * 0.07 + 0.8, duration: 1 }}
            className="mt-10 text-center font-hand text-2xl text-cream"
          >
            …and everything I forgot to write down.
          </motion.p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close"
        whileTap={{ scale: 0.92 }}
        transition={silkSpring}
        className="glass absolute top-[max(1.25rem,env(safe-area-inset-top))] right-5 flex h-11 w-11 items-center justify-center rounded-full text-cream/80"
      >
        <span aria-hidden className="text-lg leading-none">
          ✕
        </span>
      </motion.button>
    </motion.div>
  );
}
