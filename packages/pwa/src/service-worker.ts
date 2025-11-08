/// <reference lib="webworker" />

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
  skipWaiting: () => void;
};

// Precache and route static assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Cache API responses with network-first strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache images with cache-first strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache CSS and JS with stale-while-revalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Background sync for offline actions
const bgSync = new BackgroundSyncPlugin('offline-actions', {
  maxRetentionTime: 24 * 60, // 24 hours
});

registerRoute(
  ({ url, request }) => 
    url.pathname.startsWith('/api/') && 
    (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE'),
  new NetworkFirst({
    cacheName: 'api-mutations',
    plugins: [bgSync],
  })
);

// Handle offline fallback
const OFFLINE_PAGE = '/offline.html';
const CACHE_NAME = 'offline-cache';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_PAGE]);
    })
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(OFFLINE_PAGE);
        return cached || new Response('Offline', { status: 503 });
      })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    image: data.image,
    data: data.data,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    tag: data.tag,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.action) {
    // Handle action button clicks
    self.clients.openWindow(`/?action=${event.action}&data=${JSON.stringify(event.notification.data)}`);
  } else {
    // Handle notification click
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        const client = clients.find((c) => (c as WindowClient).visibilityState === 'visible');
        if (client) {
          (client as WindowClient).focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            data: event.notification.data,
          });
        } else {
          self.clients.openWindow('/');
        }
      })
    );
  }
});

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement your background sync logic here
  console.log('Performing background sync...');
}

// Skip waiting and claim clients immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Claim control of all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});