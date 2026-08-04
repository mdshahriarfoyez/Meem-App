import { motion } from 'framer-motion';
import { silkSpring } from '../lib/motion';

interface Props {
  enabled: boolean;
  onToggle: () => void;
}

/** Four bars that dance while the ambient track is playing. */
export function MusicToggle({ enabled, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn music off' : 'Turn music on'}
      whileTap={{ scale: 0.9 }}
      transition={silkSpring}
      className="glass relative flex h-11 w-11 items-center justify-center rounded-full text-cream/80"
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[2.5px] rounded-full bg-current"
            animate={
              enabled
                ? { height: ['30%', '100%', '45%', '80%', '30%'] }
                : { height: '30%' }
            }
            transition={
              enabled
                ? {
                    duration: 1.4 + i * 0.25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1,
                  }
                : { duration: 0.3 }
            }
            style={{ height: '30%' }}
          />
        ))}
      </span>
      {!enabled && (
        // Diagonal strike-through when muted.
        <span className="absolute h-[1.5px] w-6 rotate-45 rounded-full bg-cream/70" />
      )}
    </motion.button>
  );
}
