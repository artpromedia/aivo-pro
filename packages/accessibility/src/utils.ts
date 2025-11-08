/**
 * Accessibility Utilities
 * WCAG 2.1 compliance helpers
 */

/**
 * Calculate color contrast ratio (WCAG 2.1)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map((val) => {
      const scaled = val / 255;
      return scaled <= 0.03928
        ? scaled / 12.92
        : Math.pow((scaled + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAG_AA(
  foreground: string,
  background: string,
  large = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return large ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAG_AAA(
  foreground: string,
  background: string,
  large = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return large ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Generate unique ID for accessibility attributes
 */
let idCounter = 0;
export function generateId(prefix = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Trap focus within an element
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = getFocusableElements(element);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    parseFloat(style.opacity) > 0
  );
}

/**
 * Get text content for screen readers
 */
export function getAccessibleText(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const ariaLabelledby = element.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent || '';
  }

  const title = element.getAttribute('title');
  if (title) return title;

  return element.textContent || '';
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get recommended font size based on user preferences
 */
export function getRecommendedFontSize(): number {
  const root = document.documentElement;
  const fontSize = window.getComputedStyle(root).fontSize;
  return parseFloat(fontSize);
}

/**
 * Validate ARIA attributes
 */
export function validateARIA(element: HTMLElement): string[] {
  const errors: string[] = [];

  // Check for invalid ARIA attributes
  const ariaAttrs = Array.from(element.attributes).filter((attr) =>
    attr.name.startsWith('aria-')
  );

  ariaAttrs.forEach((attr) => {
    // Basic validation - can be extended
    if (attr.value === '') {
      errors.push(`Empty ARIA attribute: ${attr.name}`);
    }
  });

  // Check for required ARIA labels on interactive elements
  const role = element.getAttribute('role');
  const interactiveRoles = ['button', 'link', 'textbox', 'combobox', 'slider'];

  if (interactiveRoles.includes(role || '')) {
    const hasLabel =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim();

    if (!hasLabel) {
      errors.push(`Interactive element missing accessible label`);
    }
  }

  return errors;
}

/**
 * Create screen reader only CSS
 */
export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
} as const;

/**
 * Keyboard navigation helpers
 */
export const KeyCodes = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

/**
 * Check if key press should activate element
 */
export function isActivationKey(key: string): boolean {
  return key === KeyCodes.ENTER || key === KeyCodes.SPACE;
}

/**
 * Get next/previous focusable element
 */
export function getNextFocusable(
  current: HTMLElement,
  direction: 'next' | 'previous' = 'next'
): HTMLElement | null {
  const focusable = getFocusableElements(document.body);
  const currentIndex = focusable.indexOf(current);

  if (currentIndex === -1) return null;

  const nextIndex =
    direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0 || nextIndex >= focusable.length) return null;

  return focusable[nextIndex];
}
