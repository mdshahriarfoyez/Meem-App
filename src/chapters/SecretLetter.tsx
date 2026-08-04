import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterFrame } from '../components/ui/ChapterFrame';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { easeSilk, heavySpring, staggerChild, staggerParent } from '../lib/motion';
import { haptic } from '../lib/haptics';
import { LETTER_LINES, LETTER_SIGNATURE } from '../data/content';

/** Envelope → paper. Tapping the seal unfolds the letter. */
export function SecretLetter({ onContinue }: { onContinue: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <ChapterFrame eyebrow="Chapter Six · A letter I kept">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.35 } }}
            transition={heavySpring}
            className="flex flex-col items-center"
          >
            <motion.button
              type="button"
              aria-label="Open the letter"
              onClick={() => {
                haptic('soft');
                setOpen(true);
              }}
              whileHover={{ scale: 1.04, rotate: -1 }}
              whileTap={{ scale: 0.96 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
              className="relative h-40 w-64 max-w-[80vw]"
            >
              {/* Envelope body */}
              <div className="absolute inset-0 rounded-[18px] bg-[linear-gradient(160deg,#FFF8F5,#F3DCD4)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]" />
              {/* Flap */}
              <div
                className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(160deg,#F7E4DC,#E9CBC2)]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                }}
              />
              {/* Wax seal */}
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FF8FA6,#D9506F)] text-lg shadow-[0_6px_18px_-4px_rgba(217,80,111,0.9)]"
              >
                ❤️
              </motion.span>
            </motion.button>

            <p className="mt-8 text-[0.7rem] tracking-[0.28em] text-cream/60 uppercase">
              Tap to open
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md perspective-[1400px]"
          >
            {/* The paper unfolds from its top edge, like it was tucked inside. */}
            <motion.article
              initial={{ rotateX: -88, y: -28, scaleY: 0.55, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: easeSilk }}
              style={{ transformOrigin: 'top center' }}
              className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(170deg,#FFFBF7,#F6E7DE)] px-7 py-9 text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
            >
              {/* A faint fold line across the middle sells the "it was folded" idea. */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/5" />

              <motion.div
                variants={staggerParent(0.32, 0.9)}
                initial="initial"
                animate="animate"
                className="flex flex-col gap-2 font-hand text-[1.2rem] leading-normal text-[#4A3540]"
              >
                {LETTER_LINES.map((line) => (
                  <motion.p key={line} variants={staggerChild}>
                    {line}
                  </motion.p>
                ))}
                <motion.p
                  variants={staggerChild}
                  className="mt-4 self-end text-[1.5rem] text-[#B3556E]"
                >
                  {LETTER_SIGNATURE}
                </motion.p>
              </motion.div>
            </motion.article>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: LETTER_LINES.length * 0.32 + 1.1, ...heavySpring }}
              className="mt-8 flex justify-center"
            >
              <PrimaryButton onClick={onContinue}>One more thing →</PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterFrame>
  );
}
