import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error monitoring service (e.g., Sentry, Bugsnag)
      console.error('Production error logged:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                    <p className="text-red-100">An unexpected error occurred in the application</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Error Details */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Bug className="h-5 w-5" />
                      Error Details
                    </h3>
                    
                    {this.state.error && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-400">Error Message:</label>
                          <p className="text-red-400 font-mono text-sm bg-gray-800 p-3 rounded mt-1">
                            {this.state.error.message}
                          </p>
                        </div>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error.stack && (
                          <details className="mt-4">
                            <summary className="text-sm font-medium text-gray-400 cursor-pointer hover:text-white">
                              Stack Trace (Development)
                            </summary>
                            <pre className="text-xs text-gray-300 bg-gray-800 p-3 rounded mt-2 overflow-x-auto">
                              {this.state.error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                  </div>

                  {/* What you can do */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">What you can do:</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-coral-500 rounded-full"></div>
                        Try refreshing the page or retrying the operation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-coral-500 rounded-full"></div>
                        Clear your browser cache and cookies
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-coral-500 rounded-full"></div>
                        Contact support if the problem persists
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={this.handleRetry}
                      className="flex-1 bg-coral-600 hover:bg-coral-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Try Again
                    </button>
                    
                    <button
                      onClick={this.handleReload}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reload Page
                    </button>
                    
                    <button
                      onClick={this.handleGoHome}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Go Home
                    </button>
                  </div>

                  {/* Error ID for Support */}
                  <div className="text-center pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      Error ID: {Date.now().toString(36).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Please include this ID when contacting support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple ErrorBoundary wrapper for smaller components
export const SimpleErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ErrorBoundary fallback={fallback}>
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;