/**
 * Animation Hooks
 * Custom React hooks for common animation patterns
 */

import { useEffect, useState, useRef } from 'react';
import { useAnimation, useInView as useFramerInView } from 'framer-motion';

/**
 * Hook for animating elements when they enter the viewport
 */
export function useScrollAnimation(threshold = 0.1) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useFramerInView(ref, { amount: threshold });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  return { ref, controls };
}

/**
 * Hook for sequential animations
 */
export function useSequentialAnimation(steps: string[], delay = 0.5) {
  const controls = useAnimation();

  const playSequence = async () => {
    for (const step of steps) {
      await controls.start(step);
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
  };

  return { controls, playSequence };
}

/**
 * Hook for hover animations with state
 */
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    hoverProps: {
      onHoverStart: () => setIsHovered(true),
      onHoverEnd: () => setIsHovered(false),
    },
  };
}

/**
 * Hook for tap/press animations
 */
export function useTapAnimation() {
  const [isTapped, setIsTapped] = useState(false);

  return {
    isTapped,
    tapProps: {
      onTapStart: () => setIsTapped(true),
      onTap: () => setTimeout(() => setIsTapped(false), 150),
    },
  };
}

/**
 * Hook for drag animations with constraints
 */
export function useDragAnimation(constraints = { left: 0, right: 0, top: 0, bottom: 0 }) {
  const [isDragging, setIsDragging] = useState(false);

  return {
    isDragging,
    dragProps: {
      drag: true as const,
      dragConstraints: constraints,
      onDragStart: () => setIsDragging(true),
      onDragEnd: () => setIsDragging(false),
    },
  };
}

/**
 * Hook for counter animation
 */
export function useCounterAnimation(end: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

/**
 * Hook for loading animation
 */
export function useLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();

  const startLoading = () => {
    setIsLoading(true);
    controls.start({
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    });
  };

  const stopLoading = () => {
    setIsLoading(false);
    controls.stop();
  };

  return { isLoading, controls, startLoading, stopLoading };
}

/**
 * Hook for stagger animation with dynamic children
 */
export function useStaggerAnimation(childCount: number) {
  const controls = useAnimation();

  const playStagger = () => {
    controls.start((i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  };

  return { controls, playStagger };
}

/**
 * Hook for page transition
 */
export function usePageTransition() {
  const [isExiting, setIsExiting] = useState(false);

  const exitPage = (callback: () => void) => {
    setIsExiting(true);
    setTimeout(() => {
      callback();
      setIsExiting(false);
    }, 300);
  };

  return { isExiting, exitPage };
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}

/**
 * Hook for auto-play animation
 */
export function useAutoPlay(duration = 3000) {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start('animate');
    }, duration);

    return () => clearInterval(interval);
  }, [controls, duration]);

  return controls;
}
