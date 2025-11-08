/**
 * Animated Page Wrapper
 * Provides consistent page transitions for learner app
 */

import { motion, AnimatePresence } from '@aivo/animations';
import { useReducedMotion } from '@aivo/accessibility';
import { ReactNode } from 'react';

interface AnimatedPageWrapperProps {
  children: ReactNode;
  pageKey?: string;
}

export function AnimatedPageWrapper({ children, pageKey }: AnimatedPageWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
