export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

import type { KeyboardEvent } from 'react';

export const keyboardNavigable = {
  role: 'button' as const,
  tabIndex: 0,
  onKeyDown: (event: KeyboardEvent<HTMLElement>, onClick: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  },
};