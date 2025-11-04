import * as React from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getVariantClasses = (variant: string = 'primary') => {
  const variants = {
    primary: 'bg-coral-500 text-white shadow-coral hover:bg-coral-600 hover:shadow-lg transform hover:scale-105',
    secondary: 'bg-white text-gray-900 shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md',
    outline: 'border-2 border-coral-500 text-coral-500 hover:bg-coral-50 hover:shadow-coral',
    ghost: 'hover:bg-gray-100 text-gray-700 hover:shadow-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg',
    gradient: 'bg-gradient-to-r from-coral-500 to-purple-500 text-white shadow-lg hover:from-coral-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105',
  };
  return variants[variant as keyof typeof variants] || variants.primary;
};

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    md: 'h-11 px-5 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-2xl',
    icon: 'h-10 w-10 rounded-full',
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    return (
      <button
        className={cn(
          baseClasses,
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="mr-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';