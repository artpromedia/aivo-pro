import * as React from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outline';
}

const getVariantClasses = (variant: string = 'default', hasError: boolean) => {
  const variants = {
    default: hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-white' 
      : 'border-gray-300 focus:border-coral-500 focus:ring-coral-500 bg-white',
    filled: hasError
      ? 'bg-red-50 border-red-200 focus:border-red-500 focus:ring-red-500 focus:bg-white'
      : 'bg-gray-50 border-gray-200 focus:border-coral-500 focus:ring-coral-500 focus:bg-white',
    outline: hasError
      ? 'border-2 border-red-300 focus:border-red-500 bg-white'
      : 'border-2 border-gray-200 focus:border-coral-500 bg-white',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, label, helperText, variant = 'default', ...props }, ref) => {
    const inputId = React.useId();
    const hasError = !!error;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              'block w-full rounded-xl shadow-sm transition-all duration-200',
              'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              'py-3 text-base',
              getVariantClasses(variant, hasError),
              props.disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400 text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';