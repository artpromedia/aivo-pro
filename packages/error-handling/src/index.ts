// Error Boundary Components
export { PortalErrorBoundary } from './boundaries/PortalErrorBoundary';

// Fallback Components
export { DefaultErrorFallback } from './fallbacks/DefaultErrorFallback';
export { FeatureFallback, OfflineFallback } from './fallbacks/FeatureFallback';

// Core Services
export { ErrorReporter } from './reporting/ErrorReporter';
export { StateRecovery } from './recovery/StateRecovery';

// Types
export type {
  ErrorReport,
  ErrorFallbackProps,
  PortalName,
  ErrorSeverity,
  RecoveryStatus,
  RecoveryStrategy
} from './types';

// Hooks
export { useErrorHandler } from './hooks/useErrorHandler';
export { useNetworkStatus } from './hooks/useNetworkStatus';

// Utilities
export { withErrorBoundary } from './utils/withErrorBoundary';
export { errorLogger } from './utils/errorLogger';