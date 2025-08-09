/**
 * Service Worker for Stacks PWA
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'stacks-v1';
const STATIC_CACHE_NAME = 'stacks-static-v1';
const DYNAMIC_CACHE_NAME = 'stacks-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/_next/static/css/app/globals.css'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.filter((url) => url !== null));
      })
      .catch((error) => {
        console.warn('[SW] Failed to cache some static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests with cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for same origin)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip API requests for now (they need network-first strategy)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network and cache the response
      return fetch(event.request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();

            // Determine which cache to use
            const cacheName = isStaticAsset(event.request.url) ? STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;

            caches.open(cacheName).then((cache) => {
              console.log('[SW] Caching new resource:', event.request.url);
              cache.put(event.request, responseClone);
            });
          }

          return response;
        })
        .catch((error) => {
          console.log('[SW] Network request failed:', error);

          // Return offline fallback for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }

          throw error;
        });
    })
  );
});

// Helper function to determine if a resource is static
function isStaticAsset(url) {
  return (
    url.includes('_next/static') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('manifest.json')
  );
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    // Handle offline data sync here when implemented
  }
});

// Handle push notifications (for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('[SW] Push notification received:', data);

    // Show notification
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    });
  }
});
