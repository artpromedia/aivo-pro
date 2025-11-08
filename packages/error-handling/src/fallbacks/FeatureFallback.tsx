import { RefreshCw, Wifi, AlertCircle } from 'lucide-react';
import { ErrorFallbackProps } from '../types';

export function FeatureFallback({
  error,
  onRetry,
  recovering,
  portalName
}: Partial<ErrorFallbackProps> & { featureName?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center max-w-sm mx-auto">
      <div className="mb-4">
        {recovering ? (
          <RefreshCw className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
        ) : (
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Feature Temporarily Unavailable
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm">
        This feature is experiencing issues. Please try again in a moment.
      </p>
      
      {!recovering && onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 w-full"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

export function OfflineFallback({
  onRetry
}: { onRetry?: () => void }) {
  return (
    <div className="bg-white border border-orange-200 rounded-xl p-6 text-center max-w-sm mx-auto">
      <div className="mb-4">
        <Wifi className="w-12 h-12 text-orange-500 mx-auto" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Internet Connection
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm">
        Please check your internet connection and try again.
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 w-full"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
}