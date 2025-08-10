/**
 * Service Worker Manager - Phase 3 Optimization
 * Manages service worker registration and advanced caching features
 */

type CacheStatus = Record<string, number>;

interface ServiceWorkerManager {
  register(): Promise<ServiceWorkerRegistration | null>;
  prefetchRoute(route: string): Promise<void>;
  clearCache(cacheName: string): Promise<void>;
  getCacheStatus(): Promise<CacheStatus>;
  updateServiceWorker(): Promise<void>;
}

class AdvancedServiceWorkerManager implements ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported) {
      console.log('[SW Manager] Service workers not supported');
      return null;
    }

    try {
      // Use advanced service worker in production, basic one in development
      const swPath = process.env.NODE_ENV === 'production' 
        ? '/sw-advanced.js' 
        : '/sw.js';

      this.registration = await navigator.serviceWorker.register(swPath, {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      console.log('[SW Manager] Service worker registered:', this.registration.scope);

      // Set up update handling
      this.setupUpdateHandling();

      // Set up message handling
      this.setupMessageHandling();

      return this.registration;
    } catch (error) {
      console.error('[SW Manager] Service worker registration failed:', error);
      return null;
    }
  }

  async prefetchRoute(route: string): Promise<void> {
    if (!this.registration || !this.registration.active) {
      console.warn('[SW Manager] No active service worker');
      return;
    }

    this.postMessage({
      type: 'PREFETCH_ROUTE',
      payload: { route }
    });
  }

  async clearCache(cacheName: string): Promise<void> {
    if (!this.registration || !this.registration.active) {
      console.warn('[SW Manager] No active service worker');
      return;
    }

    this.postMessage({
      type: 'CLEAR_CACHE',
      payload: { cacheName }
    });
  }

  async getCacheStatus(): Promise<CacheStatus> {
    if (!this.registration || !this.registration.active) {
      return {};
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data || {});
      };

      this.postMessage({
        type: 'GET_CACHE_STATUS'
      }, [messageChannel.port2]);
    });
  }

  async updateServiceWorker(): Promise<void> {
    if (!this.registration) {
      console.warn('[SW Manager] No registration available');
      return;
    }

    try {
      const registration = await this.registration.update();
      console.log('[SW Manager] Service worker update initiated');
      
      // If there's a waiting service worker, activate it
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('[SW Manager] Service worker update failed:', error);
    }
  }

  private setupUpdateHandling(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      console.log('[SW Manager] New service worker available');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is available, show update prompt
            this.showUpdatePrompt();
          }
        });
      }
    });

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW Manager] Service worker updated, reloading page');
      window.location.reload();
    });
  }

  private setupMessageHandling(): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, payload } = event.data || {};
      
      switch (type) {
        case 'CACHE_UPDATED':
          console.log('[SW Manager] Cache updated:', payload);
          break;
        case 'OFFLINE_READY':
          console.log('[SW Manager] App ready for offline use');
          this.notifyOfflineReady();
          break;
      }
    });
  }

  private showUpdatePrompt(): void {
    // Create a simple update prompt
    if (window.confirm('A new version is available. Update now?')) {
      this.updateServiceWorker();
    }
  }

  private notifyOfflineReady(): void {
    // Show a subtle notification that the app is ready for offline use
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'App ready for offline use';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  private postMessage(message: any, transfer?: Transferable[]): void {
    if (!this.registration || !this.registration.active) {
      return;
    }

    this.registration.active.postMessage(message, transfer);
  }

  // Preload critical routes based on user behavior
  async preloadCriticalRoutes(): Promise<void> {
    const criticalRoutes = ['/home', '/explore', '/community'];
    
    for (const route of criticalRoutes) {
      await this.prefetchRoute(route);
    }
  }

  // Intelligent prefetching based on navigation patterns
  async intelligentPrefetch(): Promise<void> {
    // Get current route
    const currentPath = window.location.pathname;
    
    // Define prefetch rules based on current page
    const prefetchRules: Record<string, string[]> = {
      '/home': ['/explore', '/stacks-recommendations'],
      '/explore': ['/community', '/ar-discovery'],
      '/community': ['/profile', '/home'],
      '/profile': ['/home', '/explore']
    };

    const routesToPrefetch = prefetchRules[currentPath] || [];
    
    for (const route of routesToPrefetch) {
      await this.prefetchRoute(route);
    }
  }

  // Clean up old caches periodically
  async performMaintenance(): Promise<void> {
    const cacheStatus = await this.getCacheStatus();
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Clear caches that might be old (this is a simplified example)
    for (const [cacheName, count] of Object.entries(cacheStatus)) {
      if (count > 100) { // If cache has too many entries
        console.log('[SW Manager] Clearing large cache:', cacheName);
        await this.clearCache(cacheName);
      }
    }
  }
}

// Create singleton instance
export const swManager = new AdvancedServiceWorkerManager();

// Auto-register service worker on app load
if (typeof window !== 'undefined') {
  // Wait for page load to avoid blocking rendering
  window.addEventListener('load', () => {
    swManager.register().then((registration) => {
      if (registration) {
        // Perform intelligent prefetching after registration
        setTimeout(() => {
          swManager.preloadCriticalRoutes();
          swManager.intelligentPrefetch();
        }, 2000);

        // Set up periodic maintenance
        setInterval(() => {
          swManager.performMaintenance();
        }, 30 * 60 * 1000); // Every 30 minutes
      }
    });
  });
}

// Export types for TypeScript
export type { ServiceWorkerManager, CacheStatus };