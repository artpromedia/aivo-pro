import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  useServiceWorker, 
  useInstallPrompt, 
  useNetworkStatus, 
  usePushNotifications,
  useOfflineStorage 
} from '@aivo/pwa';

interface PWADemoProps {
  className?: string;
}

export const PWADemo: React.FC<PWADemoProps> = ({ className = '' }) => {
  const { registration, updateAvailable, skipWaiting, update } = useServiceWorker();
  const { canInstall, isInstalled, prompt, dismiss } = useInstallPrompt();
  const { online, connection } = useNetworkStatus();
  const { 
    supported: pushSupported, 
    permission, 
    requestPermission, 
    showNotification 
  } = usePushNotifications();
  const { data: offlineData, saveData, removeData } = useOfflineStorage<any>('pwa-demo-data');

  const [demoData, setDemoData] = useState({
    notifications: 0,
    offlineActions: 0,
    cacheHits: 0
  });

  const handleInstallApp = async () => {
    if (prompt) {
      await prompt();
    }
  };

  const handleUpdateApp = () => {
    skipWaiting();
  };

  const handleTestNotification = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    await showNotification({
      title: '🎉 AIVO Notification Test',
      body: 'Great! Push notifications are working perfectly.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'test-notification',
      requireInteraction: false
    });

    setDemoData(prev => ({ ...prev, notifications: prev.notifications + 1 }));
  };

  const handleSaveOfflineData = async () => {
    const newData = {
      timestamp: new Date().toISOString(),
      learningProgress: {
        mathLevel: Math.floor(Math.random() * 10) + 1,
        readingLevel: Math.floor(Math.random() * 10) + 1,
        completedLessons: Math.floor(Math.random() * 50)
      },
      preferences: {
        theme: 'auto',
        difficulty: 'intermediate'
      }
    };

    await saveData(newData);
    setDemoData(prev => ({ ...prev, offlineActions: prev.offlineActions + 1 }));
  };

  const handleClearOfflineData = async () => {
    await removeData();
  };

  const simulateCacheHit = () => {
    setDemoData(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
  };

  useEffect(() => {
    // Simulate cache hits when online
    if (online) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          simulateCacheHit();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [online]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl shadow-xl p-6 m-4 ${className}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📱 Progressive Web App Features</h2>
        <p className="text-gray-600">
          Experience modern web app capabilities with offline support, push notifications, and more
        </p>
      </div>

      {/* PWA Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Service Worker Status */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${registration ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-semibold text-blue-900">Service Worker</span>
          </div>
          <p className="text-sm text-blue-700">
            {registration ? 'Active & Caching' : 'Not Available'}
          </p>
          {updateAvailable && (
            <button
              onClick={handleUpdateApp}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
            >
              Update Available
            </button>
          )}
        </div>

        {/* Network Status */}
        <div className="bg-green-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${online ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className="font-semibold text-green-900">Network</span>
          </div>
          <p className="text-sm text-green-700">
            {online ? 'Online' : 'Offline'}
          </p>
          {connection && (
            <p className="text-xs text-green-600 mt-1">
              {connection.effectiveType} • {connection.downlink}Mbps
            </p>
          )}
        </div>

        {/* Install Status */}
        <div className="bg-purple-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-purple-500' : canInstall ? 'bg-yellow-500' : 'bg-gray-400'}`} />
            <span className="font-semibold text-purple-900">Install</span>
          </div>
          <p className="text-sm text-purple-700">
            {isInstalled ? 'Installed' : canInstall ? 'Available' : 'Not Supported'}
          </p>
          {canInstall && !isInstalled && (
            <button
              onClick={handleInstallApp}
              className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
            >
              Install App
            </button>
          )}
        </div>

        {/* Push Notifications */}
        <div className="bg-pink-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${permission === 'granted' ? 'bg-green-500' : pushSupported ? 'bg-yellow-500' : 'bg-gray-400'}`} />
            <span className="font-semibold text-pink-900">Notifications</span>
          </div>
          <p className="text-sm text-pink-700">
            {permission === 'granted' ? 'Enabled' : pushSupported ? 'Available' : 'Not Supported'}
          </p>
          {pushSupported && (
            <button
              onClick={handleTestNotification}
              className="mt-2 px-3 py-1 bg-pink-600 text-white text-xs rounded-lg hover:bg-pink-700"
            >
              Test Notification
            </button>
          )}
        </div>
      </div>

      {/* Feature Demonstrations */}
      <div className="space-y-6">
        {/* Offline Storage Demo */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">💾 Offline Data Storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Store learning progress offline and sync when connected
              </p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleSaveOfflineData}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Save Progress
                </button>
                <button
                  onClick={handleClearOfflineData}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  Clear Data
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Stored Data:</div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {offlineData ? JSON.stringify(offlineData, null, 2) : 'No data stored'}
              </pre>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">📊 PWA Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{demoData.cacheHits}</div>
              <div className="text-sm text-gray-600">Cache Hits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{demoData.notifications}</div>
              <div className="text-sm text-gray-600">Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{demoData.offlineActions}</div>
              <div className="text-sm text-gray-600">Offline Actions</div>
            </div>
          </div>
        </div>

        {/* PWA Features List */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">✨ PWA Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Offline Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>App Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Push Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Background Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Smart Caching</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Auto Updates</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Try These Features</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Turn off your internet to test offline functionality</li>
            <li>• Look for the install prompt to add AIVO to your device</li>
            <li>• Test push notifications with the button above</li>
            <li>• Save progress data and see it persist across sessions</li>
            <li>• Check your browser's Application tab to see cached resources</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};