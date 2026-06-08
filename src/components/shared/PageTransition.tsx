'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function PageTransition({
  children,
  className,
  duration = 0.4,
}: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}
