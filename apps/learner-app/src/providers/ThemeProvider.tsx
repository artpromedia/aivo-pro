import React, { createContext, useContext, ReactNode } from 'react';

export type AgeGroup = 'K5' | 'MS' | 'HS';

interface ThemeContextType {
  theme: AgeGroup;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    card: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  animations: {
    playful: boolean;
    duration: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs: Record<AgeGroup, ThemeContextType> = {
  K5: {
    theme: 'K5',
    colors: {
      primary: '#FF7B5C',
      secondary: '#A855F7',
      accent: '#EC4899',
      background: 'linear-gradient(135deg, #fef7ff 0%, #fdf4ff 50%, #fef3f2 100%)',
      card: '#ffffff',
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
    },
    fonts: {
      primary: 'Nunito',
      secondary: 'Comic Neue',
    },
    animations: {
      playful: true,
      duration: '0.5s',
    },
  },
  MS: {
    theme: 'MS',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #ecfdf5 100%)',
      card: '#ffffff',
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
    },
    fonts: {
      primary: 'Nunito',
      secondary: 'system-ui',
    },
    animations: {
      playful: false,
      duration: '0.3s',
    },
  },
  HS: {
    theme: 'HS',
    colors: {
      primary: '#1F2937',
      secondary: '#6366F1',
      accent: '#059669',
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      card: '#ffffff',
      text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        muted: '#9CA3AF',
      },
    },
    fonts: {
      primary: 'system-ui',
      secondary: 'system-ui',
    },
    animations: {
      playful: false,
      duration: '0.2s',
    },
  },
};

interface ThemeProviderProps {
  theme: AgeGroup;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  const currentTheme = themeConfigs[theme];

  return (
    <ThemeContext.Provider value={currentTheme}>
      <div 
        className={`theme-${theme.toLowerCase()}`}
        style={{
          '--theme-primary': currentTheme.colors.primary,
          '--theme-secondary': currentTheme.colors.secondary,
          '--theme-accent': currentTheme.colors.accent,
          '--theme-background': currentTheme.colors.background,
          '--theme-card': currentTheme.colors.card,
          '--theme-text-primary': currentTheme.colors.text.primary,
          '--theme-text-secondary': currentTheme.colors.text.secondary,
          '--theme-text-muted': currentTheme.colors.text.muted,
          '--theme-font-primary': currentTheme.fonts.primary,
          '--theme-animation-duration': currentTheme.animations.duration,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};