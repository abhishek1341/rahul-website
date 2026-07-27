'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { animationPresets, springTransition, AnimationPreset } from './presets';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  preset?: AnimationPreset;
  className?: string;
  useAnimate?: boolean; // Use animate instead of whileInView (for Stagger children)
}

export default function Reveal({ 
  children, 
  delay = 0, 
  preset = 'fadeUpSpring',
  className = '',
  useAnimate = false
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const presetConfig = animationPresets[preset];
  const transition = {
    ...springTransition,
    delay,
  };

  // Adjust for reduced motion
  const variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
    : presetConfig.variants;

  const adjustedTransition = shouldReduceMotion
    ? {
        duration: 0.3,
        delay,
      }
    : transition;

  // When inside Stagger, use animate to inherit from parent. Otherwise use whileInView
  const animationProps = useAnimate
    ? { animate: 'animate' } // Inherit animation state from parent Stagger
    : { 
        whileInView: 'animate',
        viewport: presetConfig.viewport 
      };
  
  // When useAnimate is true, don't use delay in transition (parent Stagger handles it)
  const finalTransition = useAnimate && !shouldReduceMotion
    ? springTransition
    : adjustedTransition;

  return (
    <motion.div
      initial="initial"
      {...animationProps}
      variants={variants}
      transition={finalTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

