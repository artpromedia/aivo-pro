// PWA Core Types
export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface ServiceWorkerRegistration {
  installing?: ServiceWorker;
  waiting?: ServiceWorker;
  active?: ServiceWorker;
  scope: string;
  update(): Promise<ServiceWorkerRegistration>;
  unregister(): Promise<boolean>;
}

export interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface PWAConfig {
  enableOfflineMode: boolean;
  enablePushNotifications: boolean;
  enableInstallPrompt: boolean;
  offlineFallbackPage?: string;
  cachingStrategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxCacheAge: number; // in milliseconds
  excludeRoutes?: string[];
}

export interface CacheConfig {
  name: string;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  maxEntries?: number;
  maxAgeSeconds?: number;
  urlPattern: RegExp | string;
}

export interface OfflineData {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  retryCount: number;
}

export interface PWAUpdateInfo {
  available: boolean;
  waiting: ServiceWorker | null;
  skipWaiting: () => Promise<void>;
  refresh: () => void;
}

export interface InstallPromptState {
  canInstall: boolean;
  isInstalled: boolean;
  prompt: (() => Promise<void>) | null;
  dismiss: () => void;
}

export interface NetworkStatus {
  online: boolean;
  connection: {
    type: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null;
}

export interface BackgroundSyncData {
  id: string;
  url: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
}

export interface PWAMetrics {
  cacheHitRate: number;
  offlineUsage: number;
  installRate: number;
  notificationEngagement: number;
  performanceMetrics: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
}