import React, { ReactNode, useEffect } from 'react';
import { useGlobalStore } from '../store';
import { PortalType } from '../types';

interface PortalProviderProps {
  children: ReactNode;
  portalType: PortalType;
  autoSync?: boolean;
  syncInterval?: number;
}

export function PortalProvider({
  children,
  portalType,
  autoSync = true,
  syncInterval = 30000 // 30 seconds
}: PortalProviderProps) {
  const { syncWithServer, updateSyncStatus } = useGlobalStore();

  useEffect(() => {
    // Initialize portal-specific state
    updateSyncStatus({ 
      isOnline: navigator.onLine,
      lastSyncAt: new Date().toISOString()
    });

    // Set up auto-sync if enabled
    let syncIntervalId: NodeJS.Timeout | null = null;
    if (autoSync) {
      syncIntervalId = setInterval(() => {
        if (navigator.onLine) {
          syncWithServer();
        }
      }, syncInterval);
    }

    // Listen for online/offline changes
    const handleOnline = () => {
      updateSyncStatus({ isOnline: true });
      if (autoSync) {
        syncWithServer();
      }
    };

    const handleOffline = () => {
      updateSyncStatus({ isOnline: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      if (syncIntervalId) {
        clearInterval(syncIntervalId);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, syncInterval, syncWithServer, updateSyncStatus]);

  return <>{children}</>;
}