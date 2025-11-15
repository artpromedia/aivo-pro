/**
 * Accessibility Hooks
 * React hooks for accessibility features
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  announce,
  generateId,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode,
  trapFocus,
  KeyCodes,
} from './utils';

/**
 * Hook for managing focus trap
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(active = true) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [active]);

  return ref;
}

/**
 * Hook for accessible announcements
 */
export function useAnnounce() {
  return useCallback(
    (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
      announce(message, politeness);
    },
    []
  );
}

/**
 * Hook for generating stable IDs
 */
export function useId(prefix?: string): string {
  const [id] = useState(() => generateId(prefix));
  return id;
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case KeyCodes.ARROW_UP:
          e.preventDefault();
          onNavigate('up');
          break;
        case KeyCodes.ARROW_DOWN:
          e.preventDefault();
          onNavigate('down');
          break;
        case KeyCodes.ARROW_LEFT:
          e.preventDefault();
          onNavigate('left');
          break;
        case KeyCodes.ARROW_RIGHT:
          e.preventDefault();
          onNavigate('right');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);
}

/**
 * Hook for escape key handler
 */
export function useEscapeKey(onEscape: () => void, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KeyCodes.ESCAPE) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, active]);
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [shouldReduce, setShouldReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setShouldReduce(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return shouldReduce;
}

/**
 * Hook for high contrast preference
 */
export function useHighContrast(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(prefersHighContrast);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = () => setIsHighContrast(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

/**
 * Hook for dark mode preference
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(prefersDarkMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDark(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

/**
 * Hook for managing focus on mount
 */
export function useAutoFocus(active = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus();
    }
  }, [active]);

  return ref;
}

/**
 * Hook for managing roving tabindex
 */
export function useRovingTabIndex(items: HTMLElement[], activeIndex: number) {
  useEffect(() => {
    items.forEach((item, index) => {
      item.tabIndex = index === activeIndex ? 0 : -1;
      if (index === activeIndex) {
        item.focus();
      }
    });
  }, [items, activeIndex]);
}

/**
 * Hook for accessible dialog/modal
 */
export function useDialog<T extends HTMLElement = HTMLElement>(isOpen: boolean) {
  const dialogRef = useRef<T | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus dialog
      if (dialogRef.current) {
        dialogRef.current.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return dialogRef;
}

/**
 * Hook for live region announcements
 */
export function useLiveRegion() {
  const [message, setMessage] = useState('');
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite');

  const announce = useCallback((msg: string, level: 'polite' | 'assertive' = 'polite') => {
    setMessage(msg);
    setPoliteness(level);
  }, []);

  return { message, politeness, announce };
}

/**
 * Hook for skip links
 */
export function useSkipLink(targetId: string) {
  const skip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return skip;
}

/**
 * Hook for aria-describedby
 */
export function useAriaDescribedBy(description: string) {
  const id = useId('description');
  
  return {
    descriptionId: id,
    descriptionProps: {
      id,
      children: description,
      style: { display: 'none' },
    },
    'aria-describedby': id,
  };
}

/**
 * Hook for accessible form field
 */
export function useFormField(label: string, error?: string) {
  const fieldId = useId('field');
  const labelId = useId('label');
  const errorId = useId('error');

  return {
    fieldProps: {
      id: fieldId,
      'aria-labelledby': labelId,
      'aria-invalid': !!error,
      'aria-describedby': error ? errorId : undefined,
    },
    labelProps: {
      id: labelId,
      htmlFor: fieldId,
      children: label,
    },
    errorProps: error
      ? {
          id: errorId,
          role: 'alert',
          children: error,
        }
      : undefined,
  };
}
