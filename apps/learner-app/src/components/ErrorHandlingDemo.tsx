import { useState } from 'react';
import { useErrorHandler, FeatureFallback, OfflineFallback, useNetworkStatus } from '@aivo/error-handling';
import { AlertTriangle, Wifi, RefreshCw } from 'lucide-react';

export function ErrorHandlingDemo() {
  const { reportError, handleAsyncError } = useErrorHandler();
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [loading, setLoading] = useState(false);
  const [simulateError, setSimulateError] = useState<string | null>(null);

  const handleChunkError = async () => {
    setLoading(true);
    try {
      await handleAsyncError(async () => {
        // Simulate chunk loading error
        throw new Error('Loading chunk 123 failed. (ChunkLoadError)');
      });
    } catch (error) {
      console.log('Chunk error handled by error boundary');
    }
    setLoading(false);
  };

  const handleNetworkError = async () => {
    setLoading(true);
    try {
      await handleAsyncError(async () => {
        // Simulate network error
        throw new Error('Network request failed');
      });
    } catch (error) {
      console.log('Network error handled by error boundary');
    }
    setLoading(false);
  };

  const handleFeatureError = () => {
    setSimulateError('feature');
  };

  const handleOfflineError = () => {
    setSimulateError('offline');
  };

  const clearError = () => {
    setSimulateError(null);
  };

  if (simulateError === 'feature') {
    return (
      <FeatureFallback
        error={new Error('Feature temporarily unavailable')}
        onRetry={clearError}
        recovering={false}
        portalName="learner-app"
      />
    );
  }

  if (simulateError === 'offline') {
    return (
      <OfflineFallback onRetry={clearError} />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        Error Handling Demo
      </h2>

      {/* Network Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wifi className={`w-5 h-5 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
          <span className="font-medium">
            Network Status: {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {isSlowConnection && (
          <p className="text-sm text-orange-600">
            Slow connection detected. Some features may load slowly.
          </p>
        )}
      </div>

      {/* Error Simulation Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleChunkError}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          Simulate Chunk Loading Error
        </button>

        <button
          onClick={handleNetworkError}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          Simulate Network Error
        </button>

        <button
          onClick={handleFeatureError}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Simulate Feature Error
        </button>

        <button
          onClick={handleOfflineError}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Simulate Offline Error
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">What happens when you click these buttons:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Chunk Loading Error:</strong> Shows update available screen with refresh option</li>
          <li>• <strong>Network Error:</strong> Shows connection issue screen with retry mechanism</li>
          <li>• <strong>Feature Error:</strong> Shows a smaller inline error for individual features</li>
          <li>• <strong>Offline Error:</strong> Shows offline notification with retry option</li>
        </ul>
      </div>
    </div>
  );
}