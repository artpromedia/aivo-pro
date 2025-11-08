/**
 * Animation Variants Library
 * Pre-configured Framer Motion variants for common animations
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Fade animations
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

/**
 * Scale animations
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleOut: Variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.8 },
};

export const scaleUp: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
};

/**
 * Slide animations
 */
export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
};

export const slideInUp: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0 },
};

export const slideInDown: Variants = {
  hidden: { y: '-100%' },
  visible: { y: 0 },
};

/**
 * Rotate animations
 */
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
};

export const flip: Variants = {
  hidden: { rotateY: -180, opacity: 0 },
  visible: { rotateY: 0, opacity: 1 },
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Modal/Dialog animations
 */
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 20 },
};

/**
 * Card animations
 */
export const cardHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

export const cardTap: Variants = {
  tap: { scale: 0.95 },
};

/**
 * List item animations
 */
export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Common transitions
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export const bounceTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 10,
};

export const slowTransition: Transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5,
};

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Notification/Toast animations
 */
export const toast: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.3 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

/**
 * Skeleton loading animation
 */
export const skeleton: Variants = {
  start: {
    backgroundPosition: '200% 0',
  },
  end: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 1.5,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Pulse animation
 */
export const pulse: Variants = {
  scale: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Shake animation (for errors)
 */
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Typing indicator animation
 */
export const typingDot: Variants = {
  start: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
