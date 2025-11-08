/**
 * Animation Utilities
 * Helper functions for animations
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Create stagger animation for children
 */
export function createStagger(
  staggerDelay = 0.1,
  baseDelay = 0
): Transition {
  return {
    staggerChildren: staggerDelay,
    delayChildren: baseDelay,
  };
}

/**
 * Create a custom fade variant
 */
export function createFadeVariant(
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none',
  distance = 20
): Variants {
  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return {};
    }
  };

  return {
    hidden: { opacity: 0, ...getOffset() },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

/**
 * Create a custom scale variant
 */
export function createScaleVariant(
  initialScale = 0.8,
  targetScale = 1
): Variants {
  return {
    hidden: { opacity: 0, scale: initialScale },
    visible: { opacity: 1, scale: targetScale },
  };
}

/**
 * Create a custom slide variant
 */
export function createSlideVariant(
  direction: 'left' | 'right' | 'up' | 'down',
  distance: string | number = '100%'
): Variants {
  const getOffset = () => {
    switch (direction) {
      case 'left':
        return { x: `-${distance}` };
      case 'right':
        return { x: distance };
      case 'up':
        return { y: `-${distance}` };
      case 'down':
        return { y: distance };
    }
  };

  return {
    hidden: getOffset(),
    visible: { x: 0, y: 0 },
  };
}

/**
 * Create a spring transition
 */
export function createSpring(
  stiffness = 300,
  damping = 30
): Transition {
  return {
    type: 'spring',
    stiffness,
    damping,
  };
}

/**
 * Create a tween transition
 */
export function createTween(
  duration = 0.3,
  ease: string | number[] = 'easeInOut'
): Transition {
  return {
    type: 'tween',
    duration,
    ease: ease as any,
  };
}

/**
 * Combine multiple variants
 */
export function combineVariants(...variants: Variants[]): Variants {
  return variants.reduce((acc, variant) => {
    Object.keys(variant).forEach((key) => {
      acc[key] = { ...acc[key], ...variant[key] };
    });
    return acc;
  }, {} as Variants);
}

/**
 * Create a loading spinner variant
 */
export function createSpinnerVariant(duration = 1): Variants {
  return {
    animate: {
      rotate: 360,
      transition: {
        duration,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };
}

/**
 * Create a pulse variant
 */
export function createPulseVariant(
  scale = 1.05,
  duration = 2
): Variants {
  return {
    animate: {
      scale: [1, scale, 1],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };
}

/**
 * Create a bounce variant
 */
export function createBounceVariant(height = -10): Variants {
  return {
    animate: {
      y: [0, height, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };
}

/**
 * Create a shake variant (for errors)
 */
export function createShakeVariant(intensity = 10): Variants {
  return {
    shake: {
      x: [0, -intensity, intensity, -intensity, intensity, 0],
      transition: {
        duration: 0.5,
      },
    },
  };
}

/**
 * Create a wave variant (for sequential animations)
 */
export function createWaveVariant(
  amplitude = 10,
  frequency = 2
): Variants {
  return {
    animate: (i: number) => ({
      y: [0, amplitude, 0],
      transition: {
        delay: i * 0.1,
        duration: frequency,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };
}

/**
 * Generate random animation delay
 */
export function randomDelay(min = 0, max = 0.5): number {
  return Math.random() * (max - min) + min;
}

/**
 * Create viewport animation config
 */
export function createViewportConfig(
  once = true,
  amount: number | 'some' | 'all' = 0.3
) {
  return {
    once,
    amount,
  };
}

/**
 * Easing functions
 */
export const easings = {
  easeInOut: [0.42, 0, 0.58, 1],
  easeOut: [0, 0, 0.58, 1],
  easeIn: [0.42, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

/**
 * Duration presets
 */
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1,
};
