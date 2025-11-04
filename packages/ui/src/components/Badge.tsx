import * as React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'coral' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

const getVariantClasses = (variant: string = 'default') => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    coral: 'bg-coral-100 text-coral-800 border-coral-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center font-medium rounded-full border',
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';