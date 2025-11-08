# @aivo/error-handling

Comprehensive error handling system for the AIVO Learning Platform with automatic recovery, graceful degradation, and detailed error reporting.

## Features

- 🛡️ **Portal Error Boundaries** - Isolate errors to prevent complete app crashes
- 🔄 **Automatic Recovery** - Smart retry mechanisms for network and chunk loading errors
- 📊 **Error Reporting** - Detailed error tracking with offline queue support
- 🎨 **Graceful Fallbacks** - Beautiful error UI components with recovery options
- 🔧 **State Recovery** - Automatic cleanup and restoration of corrupted state
- 📱 **Network Aware** - Offline detection and connection quality monitoring

## Installation

```bash
pnpm add @aivo/error-handling
```

## Quick Start

### 1. Wrap your portal with PortalErrorBoundary

```tsx
import { PortalErrorBoundary } from '@aivo/error-handling';

function App() {
  return (
    <PortalErrorBoundary portalName="learner-app">
      <YourAppContent />
    </PortalErrorBoundary>
  );
}
```

### 2. Use the useErrorHandler hook for async operations

```tsx
import { useErrorHandler } from '@aivo/error-handling';

function DataComponent() {
  const { reportError, handleAsyncError } = useErrorHandler();

  const fetchData = async () => {
    return handleAsyncError(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    });
  };

  return (
    // Your component JSX
  );
}
```

### 3. Monitor network status

```tsx
import { useNetworkStatus } from '@aivo/error-handling';

function NetworkAwareComponent() {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (!isOnline) {
    return <div>You're offline. Some features may be limited.</div>;
  }

  return (
    // Your component JSX
  );
}
```

## Components

### PortalErrorBoundary

The main error boundary component that wraps your entire portal or features.

```tsx
<PortalErrorBoundary
  portalName="teacher-portal"
  fallback={CustomErrorFallback}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
  isolate={true}
  resetOnPropsChange={true}
  resetKeys={[userId, sessionId]}
>
  <YourApp />
</PortalErrorBoundary>
```

**Props:**
- `portalName` - Name of the portal for error tracking
- `fallback` - Custom fallback component (optional)
- `onError` - Custom error handler function (optional)
- `isolate` - Whether to isolate errors to this boundary (optional)
- `resetOnPropsChange` - Reset error state when resetKeys change (optional)
- `resetKeys` - Array of values that trigger reset when changed (optional)

### Fallback Components

#### DefaultErrorFallback
The default error screen shown when errors occur.

#### FeatureFallback
A smaller fallback for individual features within a portal.

```tsx
import { FeatureFallback } from '@aivo/error-handling';

<FeatureFallback
  error={error}
  onRetry={handleRetry}
  portalName="teacher-portal"
/>
```

#### OfflineFallback
Shown when the user is offline.

```tsx
import { OfflineFallback } from '@aivo/error-handling';

<OfflineFallback onRetry={handleRetry} />
```

## Hooks

### useErrorHandler

Provides error reporting and async error handling utilities.

```tsx
const { reportError, handleAsyncError } = useErrorHandler();

// Report errors manually
reportError(new Error('Something went wrong'), {
  portal: 'learner-app',
  userId: 'user123',
  context: { action: 'submit-assignment' }
});

// Wrap async operations
const result = await handleAsyncError(async () => {
  return await api.submitAssignment(data);
});
```

### useNetworkStatus

Monitor network connectivity and connection quality.

```tsx
const { isOnline, isSlowConnection, effectiveType } = useNetworkStatus();

// Adapt UI based on connection
if (isSlowConnection) {
  // Show simplified UI
}
```

## Higher-Order Components

### withErrorBoundary

Wrap components with error boundaries using a HOC.

```tsx
import { withErrorBoundary } from '@aivo/error-handling';

const SafeComponent = withErrorBoundary(MyComponent, {
  portalName: 'parent-portal',
  isolate: true,
  resetKeys: [userId]
});
```

## Services

### ErrorReporter

Direct access to the error reporting service.

```tsx
import { ErrorReporter } from '@aivo/error-handling';

const reporter = new ErrorReporter();

await reporter.report({
  error: new Error('API Error'),
  portal: 'teacher-portal',
  userId: 'teacher123',
  timestamp: Date.now(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  retryCount: 0,
  context: { endpoint: '/api/grades' }
});
```

### StateRecovery

Manage state recovery and cleanup.

```tsx
import { StateRecovery } from '@aivo/error-handling';

const recovery = new StateRecovery();

// Attempt recovery
const recovered = await recovery.attemptRecovery(error);

// Clear corrupted state
recovery.clearAll();
```

## Error Logger

Configure and access error logs.

```tsx
import { errorLogger } from '@aivo/error-handling';

// Configure logging
errorLogger.configure({
  enableConsole: true,
  enableRemote: true,
  enableStorage: true,
  maxStoredErrors: 100
});

// Get stored errors
const errors = errorLogger.getStoredErrors();

// Clear error logs
errorLogger.clearStoredErrors();
```

## Portal Integration Examples

### Learner App

```tsx
// apps/learner-app/src/App.tsx
import { PortalErrorBoundary } from '@aivo/error-handling';

function App() {
  return (
    <PortalErrorBoundary 
      portalName="learner-app"
      resetKeys={[studentId, courseId]}
    >
      <Router>
        <Routes>
          <Route path="/*" element={<LearnerRoutes />} />
        </Routes>
      </Router>
    </PortalErrorBoundary>
  );
}
```

### Teacher Portal

```tsx
// apps/teacher-portal/src/App.tsx
import { PortalErrorBoundary, useNetworkStatus } from '@aivo/error-handling';

function App() {
  const { isOnline } = useNetworkStatus();

  return (
    <PortalErrorBoundary 
      portalName="teacher-portal"
      isolate={true}
    >
      {!isOnline && (
        <div className="bg-orange-100 p-2 text-center">
          You're offline. Some features may be limited.
        </div>
      )}
      <TeacherDashboard />
    </PortalErrorBoundary>
  );
}
```

## Best Practices

1. **Portal-Level Boundaries**: Always wrap your entire portal with `PortalErrorBoundary`
2. **Feature-Level Boundaries**: Use additional boundaries for critical features
3. **Async Error Handling**: Use `handleAsyncError` for all async operations
4. **Network Awareness**: Monitor network status for offline experiences
5. **Custom Fallbacks**: Create custom fallback components for better UX
6. **Error Context**: Always provide meaningful context when reporting errors
7. **Reset Keys**: Use reset keys to automatically recover from prop changes

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { 
  ErrorReport, 
  ErrorFallbackProps, 
  PortalName,
  ErrorSeverity,
  RecoveryStatus 
} from '@aivo/error-handling';
```

## Contributing

This package is part of the AIVO Learning Platform monorepo. Please follow the established patterns and ensure all error handling is thoroughly tested.