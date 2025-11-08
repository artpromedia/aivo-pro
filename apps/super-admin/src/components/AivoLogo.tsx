import React from 'react';

interface AivoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'gradient';
}

const AivoLogo: React.FC<AivoLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: '#FFFFFF',
          secondary: '#F0F0F0',
          accent: '#E0E0E0'
        };
      case 'gradient':
        return {
          primary: 'url(#aivoGradient)',
          secondary: 'url(#aivoGradient2)',
          accent: '#FF7B5C'
        };
      default:
        return {
          primary: '#FF7B5C', // Coral
          secondary: '#FF636F', // Salmon
          accent: '#6366F1' // Indigo
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="aivoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7B5C" />
              <stop offset="50%" stopColor="#FF636F" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="aivoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#FF7B5C" />
            </linearGradient>
          </defs>
        )}
        
        {/* Main AIVO design - stylized AI brain/neural network */}
        {/* Outer circle representing the AI ecosystem */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={colors.primary}
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />
        
        {/* Inner neural network pattern */}
        <g transform="translate(50,50)">
          {/* Central node */}
          <circle cx="0" cy="0" r="8" fill={colors.primary} />
          
          {/* Primary nodes */}
          <circle cx="-20" cy="-15" r="5" fill={colors.secondary} />
          <circle cx="20" cy="-15" r="5" fill={colors.secondary} />
          <circle cx="-25" cy="10" r="5" fill={colors.secondary} />
          <circle cx="25" cy="10" r="5" fill={colors.secondary} />
          <circle cx="0" cy="25" r="5" fill={colors.accent} />
          
          {/* Secondary nodes */}
          <circle cx="-35" cy="-5" r="3" fill={colors.accent} opacity="0.7" />
          <circle cx="35" cy="-5" r="3" fill={colors.accent} opacity="0.7" />
          <circle cx="-15" cy="-35" r="3" fill={colors.accent} opacity="0.7" />
          <circle cx="15" cy="-35" r="3" fill={colors.accent} opacity="0.7" />
          
          {/* Connection lines */}
          <line x1="0" y1="0" x2="-20" y2="-15" stroke={colors.primary} strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="0" x2="20" y2="-15" stroke={colors.primary} strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="0" x2="-25" y2="10" stroke={colors.primary} strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="0" x2="25" y2="10" stroke={colors.primary} strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="0" x2="0" y2="25" stroke={colors.secondary} strokeWidth="2" opacity="0.6" />
          
          {/* Secondary connections */}
          <line x1="-20" y1="-15" x2="-35" y2="-5" stroke={colors.accent} strokeWidth="1" opacity="0.4" />
          <line x1="20" y1="-15" x2="35" y2="-5" stroke={colors.accent} strokeWidth="1" opacity="0.4" />
          <line x1="-20" y1="-15" x2="-15" y2="-35" stroke={colors.accent} strokeWidth="1" opacity="0.4" />
          <line x1="20" y1="-15" x2="15" y2="-35" stroke={colors.accent} strokeWidth="1" opacity="0.4" />
          
          {/* Cross connections for AI complexity */}
          <line x1="-20" y1="-15" x2="25" y2="10" stroke={colors.secondary} strokeWidth="1" opacity="0.3" />
          <line x1="20" y1="-15" x2="-25" y2="10" stroke={colors.secondary} strokeWidth="1" opacity="0.3" />
        </g>
        
        {/* AIVO text integrated into design */}
        <text 
          x="50" 
          y="85" 
          textAnchor="middle" 
          fill={colors.primary}
          fontSize="12"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          AIVO
        </text>
      </svg>
    </div>
  );
};

export default AivoLogo;