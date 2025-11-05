import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { AgeGroup } from '../providers/ThemeProvider';

interface ThemeSwitcherProps {
  currentTheme: AgeGroup;
  onThemeChange: (theme: AgeGroup) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  currentTheme, 
  onThemeChange 
}) => {
  const themes: { key: AgeGroup; label: string; color: string; description: string }[] = [
    { 
      key: 'K5', 
      label: 'K-5', 
      color: 'from-pink-400 to-purple-500',
      description: 'Ages 5-10'
    },
    { 
      key: 'MS', 
      label: 'MS', 
      color: 'from-blue-400 to-indigo-500',
      description: 'Ages 11-14'
    },
    { 
      key: 'HS', 
      label: 'HS', 
      color: 'from-gray-600 to-gray-800',
      description: 'Ages 15-18'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-600">Theme</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {themes.map((theme) => (
          <motion.button
            key={theme.key}
            onClick={() => onThemeChange(theme.key)}
            className={`
              relative px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${currentTheme === theme.key 
                ? 'text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentTheme === theme.key && (
              <motion.div
                layoutId="activeTheme"
                className={`absolute inset-0 bg-gradient-to-r ${theme.color} rounded-xl`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-bold">{theme.label}</span>
              <span className={`text-xs ${currentTheme === theme.key ? 'text-white/80' : 'text-gray-400'}`}>
                {theme.description}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};