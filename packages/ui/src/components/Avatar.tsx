import * as React from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  fallbackColor?: 'default' | 'coral' | 'purple' | 'blue' | 'green';
}

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

const getVariantClasses = (variant: string = 'circle') => {
  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-lg',
  };
  return variants[variant as keyof typeof variants] || variants.circle;
};

const getFallbackColorClasses = (color: string = 'default') => {
  const colors = {
    default: 'bg-gray-400 text-white',
    coral: 'bg-coral-500 text-white',
    purple: 'bg-purple-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
  };
  return colors[color as keyof typeof colors] || colors.default;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt, 
    name = 'User', 
    size = 'md', 
    variant = 'circle', 
    fallbackColor = 'default',
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);
    
    const handleImageError = () => {
      setImageError(true);
    };
    
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
    
    const showFallback = !src || imageError;
    const initials = getInitials(name);
    
    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center flex-shrink-0 font-semibold overflow-hidden',
          getSizeClasses(size),
          getVariantClasses(variant),
          showFallback && getFallbackColorClasses(fallbackColor),
          className
        )}
        ref={ref}
        {...props}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt || name}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
        
        {!showFallback && !imageLoaded && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            getFallbackColorClasses(fallbackColor)
          )}>
            <span className="select-none">{initials}</span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';