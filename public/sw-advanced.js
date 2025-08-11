/**
 * Advanced Service Worker for Stacks PWA - Phase 3 Optimization
 * Intelligent caching, prefetching, and offline strategies
 */

const VERSION = '3.0';
const CACHE_NAMES = {
  static: `stacks-static-v${VERSION}`,
  dynamic: `stacks-dynamic-v${VERSION}`,
  images: `stacks-images-v${VERSION}`,
  api: `stacks-api-v${VERSION}`,
  fonts: `stacks-fonts-v${VERSION}`,
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
  static: 24 * 60 * 60 * 1000, // 24 hours
  dynamic: 1 * 60 * 60 * 1000, // 1 hour
  images: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  fonts: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Critical resources to cache immediately
const CRITICAL_ASSETS = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png', '/home', '/explore'];

// Resources to prefetch after initial load
const PREFETCH_ASSETS = ['/community', '/profile', '/ar-discovery'];

class AdvancedServiceWorker {
  constructor() {
    this.installHandler = this.installHandler.bind(this);
    this.activateHandler = this.activateHandler.bind(this);
    this.fetchHandler = this.fetchHandler.bind(this);
    this.messageHandler = this.messageHandler.bind(this);

    this.setupEventListeners();
  }

  setupEventListeners() {
    self.addEventListener('install', this.installHandler);
    self.addEventListener('activate', this.activateHandler);
    self.addEventListener('fetch', this.fetchHandler);
    self.addEventListener('message', this.messageHandler);
  }

  async installHandler(event) {
    console.log(`[SW] Installing service worker v${VERSION}`);

    event.waitUntil(this.performInstallTasks());

    // Force activation of new service worker
    self.skipWaiting();
  }

  async performInstallTasks() {
    try {
      // Cache critical assets first
      await this.cacheResources(CACHE_NAMES.static, CRITICAL_ASSETS);

      // Prefetch non-critical assets
      setTimeout(() => this.prefetchResources(), 2000);

      console.log('[SW] Installation complete');
    } catch (error) {
      console.error('[SW] Installation failed:', error);
    }
  }

  async activateHandler(event) {
    console.log('[SW] Activating service worker');

    event.waitUntil(this.performActivationTasks());

    // Take control of all clients immediately
    self.clients.claim();
  }

  async performActivationTasks() {
    try {
      // Clean up old caches
      await this.cleanupOldCaches();

      // Initialize cache metadata
      await this.initializeCacheMetadata();

      console.log('[SW] Activation complete');
    } catch (error) {
      console.error('[SW] Activation failed:', error);
    }
  }

  async fetchHandler(event) {
    const request = event.request;
    const url = new URL(request.url);

    // Skip non-GET requests and external origins
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
      return;
    }

    event.respondWith(this.handleRequest(request, url));
  }

  async messageHandler(event) {
    const { type, payload } = event.data || {};

    switch (type) {
      case 'PREFETCH_ROUTE':
        await this.prefetchRoute(payload.route);
        break;
      case 'CLEAR_CACHE':
        await this.clearSpecificCache(payload.cacheName);
        break;
      case 'GET_CACHE_STATUS':
        const status = await this.getCacheStatus();
        event.ports[0]?.postMessage(status);
        break;
    }
  }

  async handleRequest(request, url) {
    // Determine request type and apply appropriate strategy
    if (this.isAPIRequest(url)) {
      return this.handleAPIRequest(request);
    } else if (this.isImageRequest(url)) {
      return this.handleImageRequest(request);
    } else if (this.isFontRequest(url)) {
      return this.handleFontRequest(request);
    } else if (this.isStaticAsset(url)) {
      return this.handleStaticAsset(request);
    } else {
      return this.handleDynamicRequest(request);
    }
  }

  // API requests: Network-first with stale-while-revalidate
  async handleAPIRequest(request) {
    const cacheKey = this.generateCacheKey(request);

    try {
      // Try network first
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        // Cache the response with expiry
        await this.cacheWithExpiry(CACHE_NAMES.api, cacheKey, networkResponse.clone(), CACHE_EXPIRY.api);
        return networkResponse;
      }
    } catch (error) {
      console.log('[SW] Network failed for API request:', error);
    }

    // Fallback to cache
    const cachedResponse = await this.getCachedResponse(CACHE_NAMES.api, cacheKey);
    if (cachedResponse && !this.isExpired(cachedResponse)) {
      return cachedResponse;
    }

    // Return network error if no cache available
    return new Response('Network error', { status: 503 });
  }

  // Images: Cache-first with lazy cleanup
  async handleImageRequest(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        // Cache images with longer expiry
        await this.cacheWithExpiry(CACHE_NAMES.images, request, networkResponse.clone(), CACHE_EXPIRY.images);
      }

      return networkResponse;
    } catch (error) {
      // Return placeholder or offline image
      return this.getOfflineImage();
    }
  }

  // Fonts: Cache-first with very long expiry
  async handleFontRequest(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        await this.cacheWithExpiry(CACHE_NAMES.fonts, request, networkResponse.clone(), CACHE_EXPIRY.fonts);
      }

      return networkResponse;
    } catch (error) {
      return new Response('Font not available offline', { status: 404 });
    }
  }

  // Static assets: Cache-first
  async handleStaticAsset(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(request).then((response) => {
      if (response.ok) {
        this.cacheWithExpiry(CACHE_NAMES.static, request, response.clone(), CACHE_EXPIRY.static);
      }
      return response;
    });
  }

  // Dynamic content: Network-first with cache fallback
  async handleDynamicRequest(request) {
    try {
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        await this.cacheWithExpiry(CACHE_NAMES.dynamic, request, networkResponse.clone(), CACHE_EXPIRY.dynamic);
      }

      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      // Return offline page for navigation requests
      if (request.destination === 'document') {
        return caches.match('/');
      }

      return new Response('Offline', { status: 503 });
    }
  }

  // Helper methods
  isAPIRequest(url) {
    return url.pathname.startsWith('/api/');
  }

  isImageRequest(url) {
    return /\.(jpg|jpeg|png|webp|avif|svg|gif)$/i.test(url.pathname);
  }

  isFontRequest(url) {
    return /\.(woff|woff2|ttf|eot)$/i.test(url.pathname);
  }

  isStaticAsset(url) {
    return (
      url.pathname.startsWith('/_next/') ||
      url.pathname.includes('.js') ||
      url.pathname.includes('.css') ||
      url.pathname === '/manifest.json'
    );
  }

  generateCacheKey(request) {
    const url = new URL(request.url);
    // Include search params for API requests to ensure unique caching
    return `${url.pathname}${url.search}`;
  }

  async cacheWithExpiry(cacheName, request, response, maxAge) {
    const cache = await caches.open(cacheName);

    // Add expiry metadata to the response
    const headers = new Headers(response.headers);
    headers.set('sw-cache-timestamp', Date.now().toString());
    headers.set('sw-cache-maxage', maxAge.toString());

    const responseWithExpiry = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });

    await cache.put(request, responseWithExpiry);
  }

  async getCachedResponse(cacheName, request) {
    const cache = await caches.open(cacheName);
    return cache.match(request);
  }

  isExpired(response) {
    const timestamp = response.headers.get('sw-cache-timestamp');
    const maxAge = response.headers.get('sw-cache-maxage');

    if (!timestamp || !maxAge) {
      return false; // If no expiry data, assume not expired
    }

    const cacheTime = parseInt(timestamp);
    const expiry = parseInt(maxAge);

    return Date.now() - cacheTime > expiry;
  }

  async cacheResources(cacheName, resources) {
    const cache = await caches.open(cacheName);
    const validResources = resources.filter((url) => url !== null);

    // Cache resources individually to avoid failing entire batch
    const promises = validResources.map(async (url) => {
      try {
        await cache.add(url);
        console.log('[SW] Cached:', url);
      } catch (error) {
        console.warn('[SW] Failed to cache:', url, error);
      }
    });

    await Promise.allSettled(promises);
  }

  async prefetchResources() {
    console.log('[SW] Starting prefetch of non-critical resources');

    try {
      await this.cacheResources(CACHE_NAMES.dynamic, PREFETCH_ASSETS);
      console.log('[SW] Prefetch complete');
    } catch (error) {
      console.warn('[SW] Prefetch failed:', error);
    }
  }

  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCacheNames = Object.values(CACHE_NAMES);

    const deletionPromises = cacheNames.map((cacheName) => {
      if (!currentCacheNames.includes(cacheName)) {
        console.log('[SW] Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    });

    await Promise.all(deletionPromises);
  }

  async initializeCacheMetadata() {
    // Store cache metadata for management
    const metadata = {
      version: VERSION,
      cacheNames: CACHE_NAMES,
      cacheExpiry: CACHE_EXPIRY,
      timestamp: Date.now(),
    };

    const cache = await caches.open(CACHE_NAMES.static);
    const response = new Response(JSON.stringify(metadata));
    await cache.put('/__sw_metadata__', response);
  }

  async prefetchRoute(route) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await this.cacheWithExpiry(CACHE_NAMES.dynamic, route, response.clone(), CACHE_EXPIRY.dynamic);
        console.log('[SW] Prefetched route:', route);
      }
    } catch (error) {
      console.warn('[SW] Failed to prefetch route:', route, error);
    }
  }

  async clearSpecificCache(cacheName) {
    if (caches.has(cacheName)) {
      await caches.delete(cacheName);
      console.log('[SW] Cleared cache:', cacheName);
    }
  }

  async getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      status[name] = keys.length;
    }

    return status;
  }

  async getOfflineImage() {
    // Return a simple offline placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" fill="#ccc">
      <rect width="200" height="150" fill="#f0f0f0"/>
      <text x="100" y="80" text-anchor="middle" fill="#999">Offline</text>
    </svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}

// Initialize the advanced service worker
new AdvancedServiceWorker();
