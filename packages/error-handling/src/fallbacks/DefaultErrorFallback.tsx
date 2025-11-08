import { ErrorInfo } from 'react';
import { RefreshCw, AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { ErrorFallbackProps } from '../types';

export function DefaultErrorFallback({
  error,
  errorInfo,
  onRetry,
  onReset,
  recovering,
  portalName,
  retryCount = 0
}: ErrorFallbackProps) {
  const isChunkError = error.message.toLowerCase().includes('chunk');
  const isNetworkError = error.message.toLowerCase().includes('network');
  const maxRetriesReached = retryCount >= 3;

  const getErrorTitle = () => {
    if (isChunkError) return 'Update Available';
    if (isNetworkError) return 'Connection Issue';
    return 'Something went wrong';
  };

  const getErrorMessage = () => {
    if (isChunkError) {
      return 'A new version of the application is available. Please refresh to continue.';
    }
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return 'An unexpected error occurred. Our team has been notified and we\'re working on a fix.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          {recovering ? (
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
          ) : (
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {recovering ? 'Recovering...' : getErrorTitle()}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {recovering ? 'Please wait while we attempt to recover the application.' : getErrorMessage()}
        </p>

        {/* Portal Information */}
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="text-sm text-gray-500">Portal: <span className="font-medium">{portalName}</span></p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">Attempts: {retryCount}/3</p>
          )}
        </div>

        {/* Actions */}
        {!recovering && (
          <div className="space-y-3">
            {!maxRetriesReached ? (
              <button
                onClick={onRetry}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            ) : (
              <button
                onClick={onReset}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Application
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </button>
          </div>
        )}

        {/* Debug Info (only in development) */}
        {typeof window !== 'undefined' && window.location?.hostname === 'localhost' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Debug Information
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              <div className="mb-2">
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap text-xs mt-1 max-h-40 overflow-y-auto">
                  {error.stack}
                </pre>
              </div>
              {errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap text-xs mt-1 max-h-40 overflow-y-auto">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}