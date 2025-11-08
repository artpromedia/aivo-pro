/**
 * SSO (Single Sign-On) Component
 */

import React from 'react';
import { useSSO } from '../advanced-hooks';
import { Loader2, AlertCircle } from 'lucide-react';
import type { SSOProvider } from '../sso';

export interface SSOComponentProps {
  /** List of enabled SSO providers */
  providers?: SSOProvider[];
  /** Called when SSO is initiated */
  onSSOStart?: (providerId: string) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Custom styling */
  className?: string;
}

export function SSOComponent({
  providers: customProviders,
  onSSOStart,
  onError,
  className = '',
}: SSOComponentProps) {
  const { providers: defaultProviders, isLoading, error, authorize } = useSSO();
  
  const providers = customProviders || defaultProviders;

  const handleSSOClick = async (providerId: string) => {
    try {
      onSSOStart?.(providerId);
      await authorize(providerId);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error.message}</span>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        No SSO providers configured
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        {providers.map((provider) => (
          <SSOButton
            key={provider.id}
            provider={provider}
            onClick={() => handleSSOClick(provider.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SSOButtonProps {
  provider: SSOProvider;
  onClick: () => void;
}

function SSOButton({ provider, onClick }: SSOButtonProps) {
  const getProviderStyles = () => {
    switch (provider.id) {
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300';
      case 'microsoft':
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300';
      case 'github':
        return 'bg-gray-900 hover:bg-gray-800 text-white border-gray-900';
      default:
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 border-2 rounded-lg font-medium transition-colors ${getProviderStyles()}`}
    >
      {provider.icon && <span className="text-xl">{provider.icon}</span>}
      <span>Sign in with {provider.name}</span>
    </button>
  );
}

/**
 * SSO Callback Handler Component
 * Use this component on your callback route to handle SSO redirects
 */
export interface SSOCallbackProps {
  /** Called when callback handling succeeds */
  onSuccess?: (result: any) => void;
  /** Called on error */
  onError?: (error: Error) => void;
}

export function SSOCallback({ onSuccess, onError }: SSOCallbackProps) {
  const { handleCallback } = useSSO();
  const [status, setStatus] = React.useState<'processing' | 'success' | 'error'>('processing');

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleCallback(window.location.href);
        setStatus('success');
        onSuccess?.(result);
      } catch (err) {
        setStatus('error');
        onError?.(err as Error);
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Sign-In</h2>
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign-In Successful!</h2>
            <p className="text-gray-600">Redirecting you now...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign-In Failed</h2>
            <p className="text-gray-600 mb-4">There was an error processing your authentication.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
