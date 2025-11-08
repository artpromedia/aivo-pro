import { useState, useEffect } from 'react';
import { EditorTheme } from '../types';

// Predefined themes
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
    selection: '#3b82f6',
    focus: '#3b82f6'
  },
  fonts: {
    editor: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'Monaco, Menlo, Ubuntu Mono, monospace'
  },
  spacing: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem'
  },
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
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
    selection: '#3b82f6',
    focus: '#3b82f6'
  },
  fonts: {
    editor: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'Monaco, Menlo, Ubuntu Mono, monospace'
  },
  spacing: {
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem'
  },
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.25)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.35)'
  }
};

export function useEditorTheme(initialTheme: 'light' | 'dark' | 'auto' = 'light') {
  const [currentTheme, setCurrentTheme] = useState<EditorTheme>(
    initialTheme === 'dark' ? darkTheme : lightTheme
  );
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(initialTheme);

  // Detect system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Apply theme to CSS custom properties
  const applyTheme = (theme: EditorTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Apply colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--editor-${key}`, value);
      });
      
      // Apply fonts
      Object.entries(theme.fonts).forEach(([key, value]) => {
        root.style.setProperty(`--editor-font-${key}`, value);
      });
      
      // Apply spacing
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--editor-spacing-${key}`, value);
      });
      
      // Apply border radius
      root.style.setProperty('--editor-border-radius', theme.borderRadius);
      
      // Apply shadows
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--editor-shadow-${key}`, value);
      });
    }
  };

  // Update theme based on mode
  const updateTheme = (mode: 'light' | 'dark' | 'auto') => {
    let theme: EditorTheme;
    
    if (mode === 'auto') {
      const systemTheme = getSystemTheme();
      theme = systemTheme === 'dark' ? darkTheme : lightTheme;
    } else {
      theme = mode === 'dark' ? darkTheme : lightTheme;
    }
    
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  // Change theme mode
  const setTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    updateTheme(mode);
    
    // Store preference in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('editor-theme', mode);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newMode = currentTheme.name === 'light' ? 'dark' : 'light';
    setTheme(newMode);
  };

  // Load theme preference from localStorage
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('editor-theme') as 'light' | 'dark' | 'auto';
      if (savedTheme && savedTheme !== themeMode) {
        setThemeMode(savedTheme);
        updateTheme(savedTheme);
        return;
      }
    }
    
    updateTheme(themeMode);
  }, []);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themeMode !== 'auto' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      updateTheme('auto');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  return {
    theme: currentTheme,
    mode: themeMode,
    setTheme,
    toggleTheme,
    isLight: currentTheme.name === 'light',
    isDark: currentTheme.name === 'dark',
    isAuto: themeMode === 'auto'
  };
}