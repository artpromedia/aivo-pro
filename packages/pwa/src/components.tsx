import React, { useState, useEffect } from 'react';
import { useInstallPrompt, useServiceWorker, useNetworkStatus } from './hooks';

// Install Prompt Component
export const InstallPrompt: React.FC<{
  onInstall?: () => void;
  onDismiss?: () => void;
  className?: string;
}> = ({ onInstall, onDismiss, className = '' }) => {
  const { canInstall, prompt, dismiss } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (canInstall) {
      // Show prompt after a delay to avoid being intrusive
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!showPrompt || !canInstall) return null;

  const handleInstall = async () => {
    if (prompt) {
      await prompt();
      onInstall?.();
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    dismiss();
    setShowPrompt(false);
    onDismiss?.();
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Install AIVO App</h3>
          <p className="text-sm text-gray-600 mb-3">
            Install our app for faster access and offline learning!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Available Component
export const UpdatePrompt: React.FC<{
  onUpdate?: () => void;
  onDismiss?: () => void;
  className?: string;
}> = ({ onUpdate, onDismiss, className = '' }) => {
  const { updateAvailable, skipWaiting } = useServiceWorker();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowPrompt(true);
    }
  }, [updateAvailable]);

  if (!showPrompt) return null;

  const handleUpdate = () => {
    skipWaiting();
    onUpdate?.();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
  };

  return (
    <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-blue-50 border border-blue-200 rounded-2xl shadow-xl p-4 z-50 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">Update Available</h3>
          <p className="text-sm text-blue-700 mb-3">
            A new version of AIVO is ready with improvements and new features!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Network Status Indicator
export const NetworkStatusIndicator: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { online, connection } = useNetworkStatus();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!online) {
      setShowStatus(true);
    } else {
      // Hide status after coming back online
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [online]);

  if (!showStatus && online) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className={`px-4 py-3 text-center text-sm font-medium transition-colors ${
        online 
          ? 'bg-green-500 text-white' 
          : 'bg-orange-500 text-white'
      }`}>
        {online ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Back online! Syncing your data...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            You're offline. Your progress will sync when reconnected.
            {connection && (
              <span className="ml-2 text-xs opacity-75">
                ({connection.effectiveType})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// PWA Provider Component
export const PWAProvider: React.FC<{
  children: React.ReactNode;
  enableInstallPrompt?: boolean;
  enableUpdatePrompt?: boolean;
  enableNetworkStatus?: boolean;
  config?: {
    installPromptDelay?: number;
    maxCacheAge?: number;
    vapidKey?: string;
  };
}> = ({ 
  children, 
  enableInstallPrompt = true,
  enableUpdatePrompt = true,
  enableNetworkStatus = true,
  config = {}
}) => {
  const { registration } = useServiceWorker();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize PWA features
    const initPWA = async () => {
      try {
        // Register for push notifications if vapidKey provided
        if (config.vapidKey && 'Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted' && registration) {
            await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: config.vapidKey
            });
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error('PWA initialization failed:', error);
        setInitialized(true); // Continue anyway
      }
    };

    if (registration) {
      initPWA();
    }
  }, [registration, config.vapidKey]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {enableNetworkStatus && <NetworkStatusIndicator />}
      {enableInstallPrompt && <InstallPrompt />}
      {enableUpdatePrompt && <UpdatePrompt />}
    </>
  );
};