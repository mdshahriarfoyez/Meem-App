import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

type Props = HTMLMotionProps<'div'> & {
  /** Adds a warm rose rim — used for the moments that matter most. */
  glow?: boolean;
};

/** The app's one surface: blurred glass, 24px corners, soft inner highlight. */
export function GlassCard({ glow = false, className = '', children, ...rest }: Props) {
  return (
    <motion.div
      {...rest}
      className={[
        'glass rounded-[24px]',
        glow ? 'shadow-[0_0_60px_-12px_rgba(255,107,138,0.45)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </motion.div>
  );
}
