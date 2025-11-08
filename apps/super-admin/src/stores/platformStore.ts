import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PlatformMetrics, SystemAlert, AIProvider } from '@/types';

interface PlatformState {
  // Connection status
  isConnected: boolean;
  lastUpdate: Date | null;
  
  // Platform metrics
  metrics: PlatformMetrics | null;
  
  // System alerts
  alerts: SystemAlert[];
  criticalAlerts: SystemAlert[];
  
  // AI providers
  aiProviders: AIProvider[];
  primaryProvider: string | null;
  
  // Command palette
  commandPaletteOpen: boolean;
  
  // Current view state
  selectedTimeRange: '1h' | '24h' | '7d' | '30d';
  criticalMode: boolean;
  
  // Actions
  setConnected: (connected: boolean) => void;
  updateMetrics: (metrics: PlatformMetrics) => void;
  addAlert: (alert: SystemAlert) => void;
  resolveAlert: (alertId: string) => void;
  updateAIProviders: (providers: AIProvider[]) => void;
  setPrimaryProvider: (providerId: string) => void;
  toggleCommandPalette: () => void;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
  setCriticalMode: (enabled: boolean) => void;
}

export const usePlatformStore = create<PlatformState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    lastUpdate: null,
    metrics: null,
    alerts: [],
    criticalAlerts: [],
    aiProviders: [],
    primaryProvider: null,
    commandPaletteOpen: false,
    selectedTimeRange: '24h',
    criticalMode: false,

    // Actions
    setConnected: (connected) => 
      set({ isConnected: connected, lastUpdate: new Date() }),

    updateMetrics: (metrics) => 
      set({ metrics, lastUpdate: new Date() }),

    addAlert: (alert) => {
      const { alerts } = get();
      const newAlerts = [alert, ...alerts.slice(0, 99)]; // Keep last 100 alerts
      const criticalAlerts = newAlerts.filter(a => a.severity === 'critical' && !a.resolved);
      
      set({ 
        alerts: newAlerts, 
        criticalAlerts,
        criticalMode: criticalAlerts.length > 0
      });
    },

    resolveAlert: (alertId) => {
      const { alerts } = get();
      const newAlerts = alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      );
      const criticalAlerts = newAlerts.filter(a => a.severity === 'critical' && !a.resolved);
      
      set({ 
        alerts: newAlerts, 
        criticalAlerts,
        criticalMode: criticalAlerts.length > 0
      });
    },

    updateAIProviders: (providers) => 
      set({ aiProviders: providers }),

    setPrimaryProvider: (providerId) => 
      set({ primaryProvider: providerId }),

    toggleCommandPalette: () => 
      set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

    setTimeRange: (range) => 
      set({ selectedTimeRange: range }),

    setCriticalMode: (enabled) => 
      set({ criticalMode: enabled }),
  }))
);

// Subscribe to critical alerts for notifications
usePlatformStore.subscribe(
  (state) => state.criticalAlerts,
  (criticalAlerts) => {
    if (criticalAlerts.length > 0 && 'Notification' in window) {
      const latestAlert = criticalAlerts[0];
      if (Notification.permission === 'granted') {
        new Notification('Critical Platform Alert', {
          body: latestAlert.message,
          icon: '/logo.png',
          tag: latestAlert.id,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }
);