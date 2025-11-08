import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType?: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    effectiveType: undefined
  });

  const updateNetworkStatus = useCallback(() => {
    const isOnline = navigator.onLine;
    
    // Check for slow connection using Network Information API if available
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    let isSlowConnection = false;
    let effectiveType: string | undefined;
    
    if (connection) {
      effectiveType = connection.effectiveType;
      isSlowConnection = connection.effectiveType === 'slow-2g' || 
                        connection.effectiveType === '2g' ||
                        connection.downlink < 1;
    }

    setNetworkStatus({
      isOnline,
      isSlowConnection,
      effectiveType
    });
  }, []);

  useEffect(() => {
    updateNetworkStatus();

    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    const handleConnectionChange = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for connection changes if Network Information API is available
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateNetworkStatus]);

  return networkStatus;
}