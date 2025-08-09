/**
 * iOS Mobile Testing Suite for Stacks
 * Comprehensive testing for iOS-ready PWA functionality
 */

import { test, expect } from '@playwright/test';

// iOS viewport configuration
const iOS_DEVICES = [
  { name: 'iPhone SE', viewport: { width: 375, height: 667 } },
  { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
  { name: 'iPhone 14 Pro Max', viewport: { width: 430, height: 932 } },
  { name: 'iPad', viewport: { width: 768, height: 1024 } },
  { name: 'iPad Pro', viewport: { width: 1024, height: 1366 } },
];

test.describe('iOS Mobile Responsiveness', () => {
  for (const device of iOS_DEVICES) {
    test(`should display correctly on ${device.name}`, async ({ page }) => {
      await page.setViewportSize(device.viewport);
      await page.goto('/home');

      // Check basic layout
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

      // Check touch-friendly elements (minimum 44px touch targets)
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox();
          if (boundingBox) {
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          }
        }
      }

      // Check navigation is accessible on mobile
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        if (await link.isVisible()) {
          const boundingBox = await link.boundingBox();
          if (boundingBox) {
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });
  }

  test('should handle landscape and portrait orientations', async ({ page }) => {
    // Test portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading')).toBeVisible();

    // Test landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.reload();

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading')).toBeVisible();

    // Verify content is still accessible in landscape
    const promptInput = page.getByPlaceholder(/feeling nostalgic/i);
    await expect(promptInput).toBeVisible();
  });
});

test.describe('iOS Safari Specific Features', () => {
  test('should have correct iOS meta tags', async ({ page }) => {
    await page.goto('/home');

    // Check for iOS-specific meta tags
    const appleMobileWebAppCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
    await expect(appleMobileWebAppCapable).toHaveAttribute('content', 'yes');

    const appleMobileWebAppTitle = page.locator('meta[name="apple-mobile-web-app-title"]');
    await expect(appleMobileWebAppTitle).toHaveAttribute('content', 'Stacks');

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    const viewportContent = await viewport.getAttribute('content');
    expect(viewportContent).toContain('width=device-width');
    expect(viewportContent).toContain('initial-scale=1');
    expect(viewportContent).toContain('viewport-fit=cover');
  });

  test('should have proper apple-touch-icons', async ({ page }) => {
    await page.goto('/home');

    // Check for various apple-touch-icon sizes
    const appleTouchIcon180 = page.locator('link[rel="apple-touch-icon"][sizes="180x180"]');
    await expect(appleTouchIcon180).toHaveAttribute('href', '/icon-192.png');

    const appleTouchIcon152 = page.locator('link[rel="apple-touch-icon"][sizes="152x152"]');
    await expect(appleTouchIcon152).toHaveAttribute('href', '/icon-192.png');

    const appleTouchIcon120 = page.locator('link[rel="apple-touch-icon"][sizes="120x120"]');
    await expect(appleTouchIcon120).toHaveAttribute('href', '/icon-192.png');

    const appleTouchIcon76 = page.locator('link[rel="apple-touch-icon"][sizes="76x76"]');
    await expect(appleTouchIcon76).toHaveAttribute('href', '/icon-192.png');
  });

  test('should handle iOS safe areas', async ({ page }) => {
    // Simulate iPhone X/11/12 with notch
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check that content doesn't overlap with status bar area
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => window.getComputedStyle(el));

    // The app should handle safe areas through CSS
    const html = page.locator('html');
    await expect(html).toHaveClass(/h-full/);

    // Check navigation is positioned correctly
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();

    // Check that touch targets are properly positioned
    const firstNavLink = page.locator('nav a').first();
    const boundingBox = await firstNavLink.boundingBox();

    if (boundingBox) {
      // Should not be too close to the top (status bar area)
      expect(boundingBox.y).toBeGreaterThan(20);
    }
  });
});

test.describe('Touch Interactions', () => {
  test('should handle touch gestures properly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Test tap interactions
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.tap();
    await expect(promptInput).toBeFocused();

    // Test text input on mobile
    await promptInput.fill('Testing mobile input');
    await expect(promptInput).toHaveValue('Testing mobile input');

    // Test button tap
    const submitButton = page.locator('button:has-text("Find Next Read"), button:has-text("→")');
    await submitButton.first().tap();

    // Should show loading state
    await expect(page.getByText('Finding your perfect match...')).toBeVisible();
  });

  test('should handle scrolling behavior', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/explore');

    // Test vertical scrolling
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Test that fixed navigation stays in place during scroll
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
  });

  test('should prevent unwanted zoom on input focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Check that viewport prevents zoom
    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');
    expect(content).toContain('user-scalable=false');
    expect(content).toContain('maximum-scale=1');
  });
});

test.describe('PWA Installation and Manifest', () => {
  test('should have valid manifest.json', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);

    const manifest = await page.evaluate(() => fetch('/manifest.json').then((r) => r.json()));

    expect(manifest.name).toBe('Stacks - Modern Library Discovery');
    expect(manifest.short_name).toBe('Stacks');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('/');
    expect(manifest.theme_color).toBe('#3B82F6');
    expect(manifest.background_color).toBe('#FBF7F4');
    expect(manifest.orientation).toBe('portrait-primary');

    // Check icons
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);

    const icon192 = manifest.icons.find((icon: any) => icon.sizes === '192x192');
    expect(icon192).toBeDefined();
    expect(icon192.src).toBe('/icon-192.png');
    expect(icon192.purpose).toBe('maskable');

    const icon512 = manifest.icons.find((icon: any) => icon.sizes === '512x512');
    expect(icon512).toBeDefined();
    expect(icon512.src).toBe('/icon-512.png');
    expect(icon512.purpose).toBe('maskable');
  });

  test('should register service worker', async ({ page }) => {
    await page.goto('/home');

    // Wait for service worker registration
    const swRegistered = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          resolve(false);
        }
      });
    });

    expect(swRegistered).toBe(true);

    // Check that service worker is active
    const swActive = await page.evaluate(() => {
      return navigator.serviceWorker.controller !== null;
    });

    expect(swActive).toBe(true);
  });

  test('should work offline (basic)', async ({ page }) => {
    await page.goto('/home');

    // Wait for service worker to be ready
    await page.waitForFunction(() => navigator.serviceWorker.controller);

    // Go offline
    await page.context().setOffline(true);

    // Navigate to home page - should work from cache
    await page.reload();

    // Should still show basic content
    await expect(page.getByRole('heading')).toBeVisible();

    // Go back online
    await page.context().setOffline(false);
  });
});

test.describe('Performance on Mobile', () => {
  test('should load quickly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const startTime = Date.now();
    await page.goto('/home');

    // Wait for main content to be visible
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds on mobile
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have acceptable Cumulative Layout Shift', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/home');

    // Wait for content to stabilize
    await page.waitForTimeout(2000);

    // Measure CLS using Performance Observer
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ type: 'layout-shift', buffered: true });

        // Resolve after a short delay
        setTimeout(() => resolve(clsValue), 1000);
      });
    });

    // CLS should be less than 0.1 for good performance
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('iOS App Icons', () => {
  test('should load app icons successfully', async ({ page }) => {
    // Test 192x192 icon
    const icon192Response = await page.goto('/icon-192.png');
    expect(icon192Response?.status()).toBe(200);
    expect(icon192Response?.headers()['content-type']).toContain('image/png');

    // Test 512x512 icon
    const icon512Response = await page.goto('/icon-512.png');
    expect(icon512Response?.status()).toBe(200);
    expect(icon512Response?.headers()['content-type']).toContain('image/png');
  });

  test('should have correct icon dimensions', async ({ page }) => {
    await page.goto('/home');

    // Check 192x192 icon dimensions
    const icon192Size = await page.evaluate(async () => {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = '/icon-192.png';
      });
    });
    expect(icon192Size).toEqual({ width: 192, height: 192 });

    // Check 512x512 icon dimensions
    const icon512Size = await page.evaluate(async () => {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = '/icon-512.png';
      });
    });
    expect(icon512Size).toEqual({ width: 512, height: 512 });
  });
});

test.describe('Capacitor Integration', () => {
  test('should load without Capacitor errors', async ({ page }) => {
    await page.goto('/home');

    // Check console for Capacitor-related errors
    const messages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        messages.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    // Filter out known development warnings
    const capacitorErrors = messages.filter(
      (msg) => msg.includes('Capacitor') && !msg.includes('not available on web') && !msg.includes('No such module')
    );

    expect(capacitorErrors.length).toBe(0);
  });

  test('should handle status bar configuration', async ({ page }) => {
    await page.goto('/home');

    // Check theme-color meta tag for status bar
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute('content', '#3B82F6');

    // Check that status bar style is set in apple web app meta
    // Note: This is handled through Next.js appleWebApp.statusBarStyle
  });
});
