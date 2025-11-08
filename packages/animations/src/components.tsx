/**
 * Animated Components
 * Ready-to-use animated components built with Framer Motion
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInUp, scaleIn, slideInLeft } from './variants';

/**
 * Animated container with fade in
 */
export function FadeInContainer({
  children,
  delay = 0,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated card with hover effects
 */
export function AnimatedCard({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated button with tap effect
 */
export function AnimatedButton({
  children,
  ...props
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Animated list with stagger effect
 */
export function AnimatedList({
  children,
  ...props
}: HTMLMotionProps<'ul'>) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

/**
 * Animated list item
 */
export function AnimatedListItem({
  children,
  ...props
}: HTMLMotionProps<'li'>) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      {...props}
    >
      {children}
    </motion.li>
  );
}

/**
 * Animated modal backdrop
 */
export function AnimatedBackdrop({
  children,
  onClick,
  ...props
}: HTMLMotionProps<'div'> & { onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated modal content
 */
export function AnimatedModal({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated progress bar
 */
export function AnimatedProgressBar({
  progress,
  ...props
}: HTMLMotionProps<'div'> & { progress: number }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    />
  );
}

/**
 * Animated notification/toast
 */
export function AnimatedToast({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated skeleton loader
 */
export function AnimatedSkeleton({
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      }}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
      }}
      {...props}
    />
  );
}

/**
 * Animated page transition wrapper
 */
export function AnimatedPage({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated slide panel
 */
export function AnimatedSlidePanel({
  children,
  direction = 'left',
  ...props
}: HTMLMotionProps<'div'> & { direction?: 'left' | 'right' | 'top' | 'bottom' }) {
  const variants = {
    left: slideInLeft,
    right: { hidden: { x: '100%' }, visible: { x: 0 } },
    top: { hidden: { y: '-100%' }, visible: { y: 0 } },
    bottom: { hidden: { y: '100%' }, visible: { y: 0 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants[direction]}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated accordion item
 */
export function AnimatedAccordion({
  children,
  isOpen,
  ...props
}: HTMLMotionProps<'div'> & { isOpen: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated counter
 */
export function AnimatedCounter({
  value,
  ...props
}: HTMLMotionProps<'span'> & { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      {...props}
    >
      {value}
    </motion.span>
  );
}
