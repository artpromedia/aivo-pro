import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'text-coral-600';
      case 'white': return 'text-white';
      case 'gray': return 'text-gray-500';
    }
  };

  return (
    <Loader2 className={`animate-spin ${getSizeClass()} ${getColorClass()} ${className}`} />
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  blur?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message, 
  children,
  blur = true 
}) => {
  return (
    <div className="relative">
      <div className={isLoading && blur ? 'blur-sm pointer-events-none' : ''}>
        {children}
      </div>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
        >
          <div className="text-center">
            <LoadingSpinner size="lg" />
            {message && (
              <p className="mt-3 text-sm font-medium text-gray-700">{message}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1, 
  avatar = false,
  animate = true 
}) => {
  const baseClass = `bg-gray-200 rounded ${animate ? 'animate-pulse' : ''}`;
  
  if (avatar) {
    return (
      <div className="flex items-center space-x-3">
        <div className={`${baseClass} w-10 h-10 rounded-full`} />
        <div className="flex-1 space-y-2">
          <div className={`${baseClass} h-4 w-3/4`} />
          <div className={`${baseClass} h-3 w-1/2`} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`${baseClass} h-4 ${
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          } ${className}`}
        />
      ))}
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true 
}) => {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={`header-${i}`} className="h-6" />
          ))}
        </div>
      )}
      
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="grid gap-4 py-3 border-b border-gray-100"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              className={colIndex === 0 ? 'h-5' : 'h-4'} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton lines={2} />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  isLoading,
  children,
  loadingText,
  disabled,
  className = '',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center gap-2 ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

interface PageLoadingProps {
  message?: string;
  showSpinner?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...', 
  showSpinner = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {showSpinner && (
          <div className="mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto"
            >
              <RefreshCw className="w-16 h-16 text-coral-500" />
            </motion.div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-white mb-2">AIVO Super Admin</h2>
        <p className="text-gray-400">{message}</p>
        
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-coral-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingOverlay,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  ButtonLoading,
  PageLoading
};