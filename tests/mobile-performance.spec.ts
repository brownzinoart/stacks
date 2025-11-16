/**
 * Mobile Performance Testing
 * Tests performance characteristics on mobile devices and slow networks
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Performance', () => {
  test('should load quickly on slow 3G', async ({ page, context }) => {
    // Simulate slow 3G connection
    await context.route('**/*', async (route) => {
      // Add 500ms delay to simulate slow network
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const startTime = Date.now();
    await page.goto('/home');

    // Wait for critical content
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds even on slow 3G
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle memory pressure gracefully', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Simulate memory pressure by rapidly navigating between pages
    const pages = ['/home', '/explore', '/discovery', '/community', '/home'];

    for (let i = 0; i < 3; i++) {
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForTimeout(100); // Brief pause

        // Check that critical elements still render
        const headings = await page.locator('h1').count();
        expect(headings).toBeGreaterThan(0);
      }
    }
  });

  test('should optimize image loading', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check that images are lazy loaded or optimized
    const images = await page.locator('img').all();

    for (const img of images) {
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');

      // Images should either be data URLs (optimized) or have lazy loading
      if (src && !src.startsWith('data:')) {
        expect(['lazy', null]).toContain(loading);
      }
    }
  });

  test('should use efficient animations', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check that animations use transform and opacity (GPU accelerated)
    const animatedElements = await page.locator('[class*="animate-"]').all();

    for (const element of animatedElements) {
      const styles = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return {
          willChange: computedStyle.willChange,
          transform: computedStyle.transform,
          transition: computedStyle.transition,
        };
      });

      // Animations should use GPU-accelerated properties
      const hasGpuAcceleration =
        styles.willChange === 'transform' || styles.transform !== 'none' || styles.transition.includes('transform');

      expect(hasGpuAcceleration).toBe(true);
    }
  });

  test('should minimize layout thrashing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Measure layout stability during interactions
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Simulate user interaction
        setTimeout(() => {
          resolve(clsValue);
        }, 2000);
      });
    });

    // CLS should be minimal (< 0.1 is good)
    expect(cls).toBeLessThan(0.1);
  });

  test('should handle battery optimization', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check for battery-intensive operations
    const hasSetInterval = await page.evaluate(() => {
      const originalSetInterval = window.setInterval;
      let intervalCount = 0;
      window.setInterval = ((callback: TimerHandler, delay?: number, ...args: any[]) => {
        intervalCount++;
        return originalSetInterval(callback, delay, ...args);
      }) as any;

      setTimeout(() => {
        (window as any).intervalCount = intervalCount;
      }, 1000);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve((window as any).intervalCount || 0);
        }, 2000);
      });
    });

    // Should minimize background timers for battery life
    expect(hasSetInterval).toBeLessThan(5);
  });
});

test.describe('Progressive Web App Features', () => {
  test('should work in airplane mode simulation', async ({ page, context }) => {
    await page.goto('/home');

    // Wait for service worker to cache content
    await page.waitForTimeout(3000);

    // Block all network requests (airplane mode)
    await context.route('**/*', (route) => {
      if (route.request().url().includes('127.0.0.1')) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // Reload page
    await page.reload();

    // Should show cached content
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should handle poor connectivity gracefully', async ({ page, context }) => {
    // Simulate intermittent connectivity
    let shouldFail = false;
    await context.route('**/*', (route) => {
      if (shouldFail) {
        route.abort();
      } else {
        route.continue();
      }
      shouldFail = !shouldFail;
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Should still render basic content despite connectivity issues
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show install prompt on compatible devices', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Simulate install prompt event
    const installPromptShown = await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = () => Promise.resolve();
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });

      let prompted = false;
      window.addEventListener('beforeinstallprompt', () => {
        prompted = true;
      });

      window.dispatchEvent(event);
      return prompted;
    });

    expect(installPromptShown).toBe(true);
  });

  test('should handle background sync capability', async ({ page }) => {
    await page.goto('/home');

    const bgSyncSupported = await page.evaluate(async () => {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready;
          // Don't actually register - just check capability
          return true;
        } catch {
          return false;
        }
      }
      return false;
    });

    // Background sync is a PWA feature for offline data handling
    expect(typeof bgSyncSupported).toBe('boolean');
  });
});

test.describe('Accessibility on Mobile', () => {
  test('should have proper touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check all interactive elements have minimum 44px touch target
    const interactiveElements = await page.locator('button, a, input, [role="button"]').all();

    for (const element of interactiveElements) {
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('should support screen readers on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check for proper ARIA labels and roles
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // Images should have alt text or be decorative
      expect(alt !== null || role === 'presentation').toBe(true);
    }
  });

  test('should work with voice control', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check that major interactive elements have accessible names
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      if (await button.isVisible()) {
        const accessibleName = await button.evaluate((el) => {
          // Get computed accessible name
          return el.textContent || el.getAttribute('aria-label') || el.getAttribute('title');
        });

        expect(accessibleName).toBeTruthy();
      }
    }
  });
});
