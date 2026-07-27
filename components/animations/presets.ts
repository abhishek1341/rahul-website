import { Variants } from 'framer-motion';

export type AnimationPreset = 'fadeUpSpring' | 'slideInLeft' | 'slideInRight';

interface PresetConfig {
  variants: Variants;
  viewport?: { once?: boolean; amount?: number };
}

export const animationPresets: Record<AnimationPreset, PresetConfig> = {
  fadeUpSpring: {
    variants: {
      initial: { opacity: 0, y: 170 },
      animate: { opacity: 1, y: 0 },
    },
    viewport: { once: true, amount: 0.3 },
  },
  slideInLeft: {
    variants: {
      initial: { opacity: 0, x: -170 },
      animate: { opacity: 1, x: 0 },
    },
    viewport: { once: true, amount: 0.3 },
  },
  slideInRight: {
    variants: {
      initial: { opacity: 0, x: 170 },
      animate: { opacity: 1, x: 0 },
    },
    viewport: { once: true, amount: 0.3 },
  },
};

export const springTransition = {
  type: 'spring' as const,
  damping: 27,
  stiffness: 121,
  mass: 0.3,
};

