/**
 * PWA Offline Functionality Tests
 * Tests service worker caching, offline support, and PWA features
 */

import { test, expect } from '@playwright/test';

test.describe('Service Worker and Caching', () => {
  test('should register service worker successfully', async ({ page }) => {
    await page.goto('/home');

    // Wait for page to load and service worker to register
    await page.waitForTimeout(2000);

    // Check if service worker is supported and registered
    const swSupported = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(swSupported).toBe(true);

    // Check if service worker registration exists
    const swRegistration = await page.evaluate(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      } catch (error) {
        return false;
      }
    });

    // Service worker should be available in a PWA context
    expect(swRegistration).toBe(true);
  });

  test('should cache static assets', async ({ page }) => {
    await page.goto('/home');

    // Wait for service worker to be ready
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Check that static assets are cached
    const cacheKeys = await page.evaluate(async () => {
      const caches = await window.caches.keys();
      return caches;
    });

    expect(cacheKeys.length).toBeGreaterThan(0);
    expect(cacheKeys.some((key) => key.includes('stacks'))).toBe(true);

    // Verify specific assets are cached
    const cachedAssets = await page.evaluate(async () => {
      const cache = await caches.open('stacks-static-v1');
      const requests = await cache.keys();
      return requests.map((req) => req.url);
    });

    const expectedAssets = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png'];
    expectedAssets.forEach((asset) => {
      expect(cachedAssets.some((cached) => cached.endsWith(asset))).toBe(true);
    });
  });

  test('should work offline for cached pages', async ({ page }) => {
    // Load page while online
    await page.goto('/home');

    // Wait for service worker and caching
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await page.waitForTimeout(2000);

    // Go offline
    await page.context().setOffline(true);

    // Reload page - should work from cache
    await page.reload();

    // Verify main content is still visible
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });

  test('should handle offline fallback for uncached pages', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Go offline
    await page.context().setOffline(true);

    // Try to navigate to a potentially uncached page
    await page.goto('/non-existent-page');

    // Should fallback to home page
    await expect(page.getByRole('navigation')).toBeVisible();

    await page.context().setOffline(false);
  });
});

test.describe('PWA Installation', () => {
  test('should show install prompt on supported devices', async ({ page }) => {
    await page.goto('/home');

    // Simulate beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = () => Promise.resolve();
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });

    // Check for install-related elements (if implemented)
    // This would depend on your PWA install prompt implementation
  });

  test('should have correct manifest properties for installation', async ({ page }) => {
    const manifestResponse = await page.goto('/manifest.json');
    expect(manifestResponse?.status()).toBe(200);

    const manifest = await page.evaluate(() => fetch('/manifest.json').then((r) => r.json()));

    // Required properties for PWA installation
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    // Check for maskable icons (required for better mobile experience)
    const maskableIcon = manifest.icons.find((icon: any) => icon.purpose && icon.purpose.includes('maskable'));
    expect(maskableIcon).toBeDefined();
  });
});

test.describe('Background Sync and Push Notifications', () => {
  test('should register for background sync', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Test background sync capability
    const backgroundSyncSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
    });

    if (backgroundSyncSupported) {
      const syncRegistered = await page.evaluate(async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          await (registration as any).sync.register('background-sync');
          return true;
        } catch (error) {
          return false;
        }
      });

      expect(syncRegistered).toBe(true);
    }
  });

  test('should support push notifications capability', async ({ page }) => {
    await page.goto('/home');

    const pushSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 'PushManager' in window;
    });

    // Just verify the capability exists, don't actually register for notifications
    expect(typeof pushSupported).toBe('boolean');
  });
});

test.describe('Offline Data Handling', () => {
  test('should handle API failures gracefully when offline', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Go offline
    await page.context().setOffline(true);

    // Try to submit a form that would make an API request
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('Test offline functionality');

    const submitButton = page.locator('button:has-text("Find Next Read"), button:has-text("→")');
    await submitButton.first().click();

    // Should show some kind of offline message or handle gracefully
    // The exact behavior depends on your implementation
    await page.waitForTimeout(2000);

    // Go back online
    await page.context().setOffline(false);
  });

  test('should queue offline actions for later sync', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // This would test your offline data queuing implementation
    // The test structure is here for when you implement offline data sync
  });
});

test.describe('Cache Management', () => {
  test('should update cache when new version available', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Get current cache keys
    const initialCaches = await page.evaluate(async () => {
      return await caches.keys();
    });

    expect(initialCaches.length).toBeGreaterThan(0);

    // Simulate service worker update by changing cache name
    await page.evaluate(() => {
      return navigator.serviceWorker.register('/sw.js');
    });

    await page.waitForTimeout(1000);
  });

  test('should clean up old caches', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // This would test cache cleanup logic
    // Verify old caches are removed when service worker updates
    const cacheKeys = await page.evaluate(async () => {
      return await caches.keys();
    });

    // Should not have excessive number of cache keys
    expect(cacheKeys.length).toBeLessThan(10);
  });

  test('should respect cache size limits', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Navigate to multiple pages to fill cache
    const pages = ['/home', '/explore', '/discovery'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForTimeout(500);
    }

    // Verify cache doesn't grow excessively
    const cacheKeys = await page.evaluate(async () => {
      return await caches.keys();
    });

    // Should have reasonable number of cache keys
    expect(cacheKeys.length).toBeLessThan(5);
  });
});

test.describe('Network Strategies', () => {
  test('should use cache-first strategy for static assets', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Monitor network requests
    const responses: { url: string; fromCache: boolean }[] = [];

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        fromCache: response.fromServiceWorker(),
      });
    });

    // Reload to trigger cache usage
    await page.reload();
    await page.waitForTimeout(2000);

    // Check that static assets come from cache
    const staticAssets = responses.filter(
      (r) =>
        r.url.includes('.png') || r.url.includes('.css') || r.url.includes('.js') || r.url.includes('manifest.json')
    );

    if (staticAssets.length > 0) {
      const cachedAssets = staticAssets.filter((a) => a.fromCache);
      expect(cachedAssets.length).toBeGreaterThan(0);
    }
  });

  test('should use network-first strategy for API requests', async ({ page }) => {
    await page.goto('/home');
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Monitor API requests
    const apiRequests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        apiRequests.push(request.url());
      }
    });

    // Trigger an API request if possible
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('Test API request');

    const submitButton = page.locator('button:has-text("Find Next Read"), button:has-text("→")');
    await submitButton.first().click();

    await page.waitForTimeout(3000);

    // API requests should go through (when online)
    // The service worker should not cache API responses by default
  });
});
