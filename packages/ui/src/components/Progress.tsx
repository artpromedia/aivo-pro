import * as React from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'coral' | 'purple' | 'gradient';
  showValue?: boolean;
  label?: string;
}

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

const getVariantClasses = (variant: string = 'default') => {
  const variants = {
    default: 'bg-gray-200',
    coral: 'bg-coral-200',
    purple: 'bg-purple-200',
    gradient: 'bg-gray-200',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

const getProgressClasses = (variant: string = 'default') => {
  const variants = {
    default: 'bg-gray-600',
    coral: 'bg-coral-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-coral-500 to-purple-500',
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = 'md', variant = 'default', showValue = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
            {showValue && <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>}
          </div>
        )}
        
        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            getSizeClasses(size),
            getVariantClasses(variant)
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              getProgressClasses(variant)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';