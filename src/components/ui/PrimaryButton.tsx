import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { silkSpring } from '../../lib/motion';
import { haptic } from '../../lib/haptics';

type Variant = 'solid' | 'ghost';

type Props = HTMLMotionProps<'button'> & {
  variant?: Variant;
  /** Renders at hero size — used for the two big "yes" moments. */
  hero?: boolean;
};

const BASE =
  'relative inline-flex items-center justify-center rounded-full font-medium tracking-[0.01em] ' +
  'select-none outline-none focus-visible:ring-2 focus-visible:ring-rose-soft/70 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-navy-800 disabled:opacity-50';

const VARIANTS: Record<Variant, string> = {
  solid:
    'text-navy-900 bg-[linear-gradient(135deg,#FFF8F5_0%,#FFA1B4_55%,#F2D3A0_100%)] ' +
    'shadow-[0_14px_40px_-12px_rgba(255,107,138,0.75)]',
  ghost:
    'text-cream/90 glass hover:text-cream',
};

export function PrimaryButton({
  variant = 'solid',
  hero = false,
  className = '',
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={silkSpring}
      onClick={(event) => {
        haptic('soft');
        onClick?.(event);
      }}
      className={[
        BASE,
        VARIANTS[variant],
        hero ? 'px-12 py-5 text-xl' : 'px-7 py-3.5 text-base',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
