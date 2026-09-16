/**
 * WANACHUO.COM SERVICE WORKER
 * ===========================
 * Progressive Web App (PWA) Service Worker
 * NETWORK-FIRST STRATEGY - Always fetch fresh data
 * HOMEPAGE START - Always opens at / for PWA
 */

const CACHE_NAME = 'wanachuo-v6-2026'; // Updated version - fixed PWA start page
const RUNTIME_CACHE = 'wanachuo-runtime-v6';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/hero3.webp',
  '/heroimage.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Skip waiting for instant updates
  );
});

// Listen for SKIP_WAITING message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING message received - activating immediately');
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    }).then(() => {
      // Notify clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Service worker updated successfully'
          });
        });
      });
    })
  );
});

// Fetch event - NETWORK FIRST FOR EVERYTHING (no cached data)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // SPECIAL HANDLING FOR NAVIGATION REQUESTS
  // Force PWA to open at homepage (/) instead of cached page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If it's a valid page, return it
          if (response && response.status === 200) {
            return response;
          }
          // If page doesn't exist, redirect to homepage
          return caches.match('/').then(cached => cached || response);
        })
        .catch(() => {
          // When offline, always serve homepage
          console.log('[SW] Offline navigation - redirecting to homepage');
          return caches.match('/').then(cached => {
            if (cached) return cached;
            // If no cache, return a basic offline page
            return new Response(
              '<html><body><h1>Offline</h1><p>Please check your internet connection</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        })
    );
    return;
  }

  // NETWORK-FIRST STRATEGY FOR ALL OTHER REQUESTS
  // This ensures fresh data is ALWAYS fetched from server
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Only cache static assets (images, fonts, etc.) - NOT HTML/JS/CSS
        const shouldCache = request.destination === 'image' || 
                           request.destination === 'font' ||
                           url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$/);

        if (shouldCache) {
          // Clone and cache for offline fallback only
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseToCache);
            });
        }

        return response;
      })
      .catch(() => {
        // Only use cache as LAST RESORT when completely offline
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Offline - serving cached version:', url.pathname);
              return cachedResponse;
            }
            
            // Return offline message for API calls
            if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
              return new Response(
                JSON.stringify({ error: 'Offline', message: 'You are currently offline' }),
                { headers: { 'Content-Type': 'application/json' } }
              );
            }
            
            // Return homepage for HTML requests
            return caches.match('/');
          });
      })
  );
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-properties') {
    event.waitUntil(
      // Sync logic here
      Promise.resolve()
    );
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'New properties available!',
    icon: '/web-app-manifest-192x192.png',
    badge: '/favicon-96x96.png',
    vibrate: [200, 100, 200],
    tag: 'wanachuo-notification',
    actions: [
      { action: 'view', title: 'View', icon: '/favicon-96x96.png' },
      { action: 'close', title: 'Close', icon: '/favicon-96x96.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Wanachuo.com', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});