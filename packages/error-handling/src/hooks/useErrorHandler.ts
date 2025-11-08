import { useCallback } from 'react';
import { ErrorReporter } from '../reporting/ErrorReporter';
import { ErrorReport } from '../types';

const errorReporter = new ErrorReporter();

export function useErrorHandler() {
  const reportError = useCallback(async (
    error: Error,
    context?: Partial<ErrorReport>
  ) => {
    try {
      await errorReporter.report({
        error,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        portal: context?.portal || 'unknown',
        userId: context?.userId,
        retryCount: context?.retryCount || 0,
        context: context?.context || {},
        ...context
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  const handleAsyncError = useCallback((asyncFn: () => Promise<any>) => {
    return asyncFn().catch((error) => {
      reportError(error, { portal: 'async-operation' });
      throw error; // Re-throw to maintain error flow
    });
  }, [reportError]);

  return {
    reportError,
    handleAsyncError
  };
}