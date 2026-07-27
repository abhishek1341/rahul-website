'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerProps {
  children: ReactNode;
  delayChildren?: number;
  stagger?: number;
  className?: string;
}

export default function Stagger({ 
  children, 
  delayChildren = 0.2,
  stagger = 0.1,
  className = '' 
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? {
        staggerChildren: 0,
        delayChildren: 0,
      }
    : {
        staggerChildren: stagger,
        delayChildren: delayChildren,
      };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

