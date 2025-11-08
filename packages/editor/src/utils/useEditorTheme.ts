import { useMemo } from 'react';
import type { EditorTheme } from '../types';

const lightTheme: EditorTheme = {
  name: 'light',
  colors: {
    background: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    toolbar: '#f9fafb',
    button: '#ffffff',
    buttonHover: '#f3f4f6',
    buttonActive: '#3b82f6',
    selection: '#dbeafe',
    focus: '#3b82f6',
  },
  fonts: {
    editor: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Monaco', 'Consolas', monospace",
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

const darkTheme: EditorTheme = {
  name: 'dark',
  colors: {
    background: '#1f2937',
    text: '#f9fafb',
    border: '#374151',
    toolbar: '#111827',
    button: '#374151',
    buttonHover: '#4b5563',
    buttonActive: '#3b82f6',
    selection: '#1e40af',
    focus: '#60a5fa',
  },
  fonts: {
    editor: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Monaco', 'Consolas', monospace",
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
  },
};

export const useEditorTheme = (themeName: 'light' | 'dark' | 'auto') => {
  const theme = useMemo(() => {
    if (themeName === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? darkTheme : lightTheme;
    }
    return themeName === 'dark' ? darkTheme : lightTheme;
  }, [themeName]);

  const themeClasses = useMemo(() => {
    return `editor-theme-${theme.name}`;
  }, [theme.name]);

  const themeStyles = useMemo(() => {
    return {
      '--editor-bg': theme.colors.background,
      '--editor-text': theme.colors.text,
      '--editor-border': theme.colors.border,
      '--editor-toolbar-bg': theme.colors.toolbar,
      '--editor-button': theme.colors.button,
      '--editor-button-hover': theme.colors.buttonHover,
      '--editor-button-active': theme.colors.buttonActive,
      '--editor-selection': theme.colors.selection,
      '--editor-focus': theme.colors.focus,
      '--editor-font': theme.fonts.editor,
      '--editor-font-mono': theme.fonts.mono,
      '--editor-spacing-sm': theme.spacing.small,
      '--editor-spacing-md': theme.spacing.medium,
      '--editor-spacing-lg': theme.spacing.large,
      '--editor-radius': theme.borderRadius,
      '--editor-shadow-sm': theme.shadows.small,
      '--editor-shadow-md': theme.shadows.medium,
      '--editor-shadow-lg': theme.shadows.large,
    } as React.CSSProperties;
  }, [theme]);

  return {
    theme,
    themeClasses,
    themeStyles,
  };
};