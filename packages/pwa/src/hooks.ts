import { useState, useEffect, useCallback } from 'react';
import type { PWAInstallPrompt, PWAUpdateInfo, InstallPromptState, NetworkStatus, NotificationPayload } from './types';

// Service Worker Registration Hook
export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setRegistration(reg);

          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const skipWaiting = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [waitingWorker]);

  const update = useCallback(async () => {
    if (registration) {
      await registration.update();
    }
  }, [registration]);

  return {
    registration,
    updateAvailable,
    skipWaiting,
    update,
    isSupported: 'serviceWorker' in navigator
  };
}

// Install Prompt Hook
export function useInstallPrompt(): InstallPromptState {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as unknown as PWAInstallPrompt);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const prompt = useCallback(async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
        setInstallPrompt(null);
      }
    }
  }, [installPrompt]);

  const dismiss = useCallback(() => {
    setCanInstall(false);
    setInstallPrompt(null);
  }, []);

  return {
    canInstall,
    isInstalled,
    prompt: canInstall ? prompt : null,
    dismiss
  };
}

// Network Status Hook
export function useNetworkStatus(): NetworkStatus {
  const [online, setOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState<NetworkStatus['connection']>(null);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setOnline(navigator.onLine);
    };

    const updateConnection = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        setConnection({
          type: conn.type || 'unknown',
          effectiveType: conn.effectiveType || 'unknown',
          downlink: conn.downlink || 0,
          rtt: conn.rtt || 0
        });
      }
    };

    updateConnection();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (conn) {
        conn.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  return { online, connection };
}

// Push Notifications Hook
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
        setSupported(true);
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [supported]);

  const subscribe = useCallback(async (vapidKey: string) => {
    if (!supported || permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });
      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }, [supported, permission]);

  const unsubscribe = useCallback(async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  }, [subscription]);

  const showNotification = useCallback(async (payload: NotificationPayload) => {
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: payload.data,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction
    });
  }, [permission]);

  return {
    supported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification
  };
}

// Offline Storage Hook
export function useOfflineStorage<T>(key: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if ('indexedDB' in window) {
          // Use IndexedDB for larger data
          const { openDB } = await import('idb');
          const db = await openDB('AIVO-PWA', 1, {
            upgrade(db) {
              if (!db.objectStoreNames.contains('offline-data')) {
                db.createObjectStore('offline-data');
              }
            }
          });
          const stored = await db.get('offline-data', key);
          if (stored) {
            setData(stored);
          }
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem(key);
          if (stored) {
            setData(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key]);

  const saveData = useCallback(async (newData: T) => {
    try {
      if ('indexedDB' in window) {
        const { openDB } = await import('idb');
        const db = await openDB('AIVO-PWA', 1);
        await db.put('offline-data', newData, key);
      } else {
        localStorage.setItem(key, JSON.stringify(newData));
      }
      setData(newData);
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, [key]);

  const removeData = useCallback(async () => {
    try {
      if ('indexedDB' in window) {
        const { openDB } = await import('idb');
        const db = await openDB('AIVO-PWA', 1);
        await db.delete('offline-data', key);
      } else {
        localStorage.removeItem(key);
      }
      setData(null);
    } catch (error) {
      console.error('Failed to remove offline data:', error);
    }
  }, [key]);

  return {
    data,
    isLoading,
    saveData,
    removeData
  };
}