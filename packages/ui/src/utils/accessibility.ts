export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

export const keyboardNavigable = {
  role: 'button' as const,
  tabIndex: 0,
  onKeyDown: (e: any, onClick: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  },
};