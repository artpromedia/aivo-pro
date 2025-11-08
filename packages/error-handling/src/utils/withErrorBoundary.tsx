import React, { ComponentType } from 'react';
import { PortalErrorBoundary } from '../boundaries/PortalErrorBoundary';
import { ErrorFallbackProps } from '../types';

export interface WithErrorBoundaryOptions {
  portalName: string;
  fallback?: ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions
) {
  const WrappedComponent = (props: P) => (
    <PortalErrorBoundary
      portalName={options.portalName}
      fallback={options.fallback}
      onError={options.onError}
      isolate={options.isolate}
      resetOnPropsChange={options.resetOnPropsChange}
      resetKeys={options.resetKeys}
    >
      <Component {...props} />
    </PortalErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}