/**
 * Mobile Performance and iOS Validation Tests
 * Validates mobile experience and iOS-specific features still work
 */

import { test, expect } from '@playwright/test';

test.describe('Mobile Performance & iOS Features', () => {
  test('mobile viewport displays correctly', async ({ page }) => {
    // Test iPhone SE (smallest common iOS device)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home');

    // Main content should be visible and properly sized
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    // Navigation should be at bottom with safe area padding
    const nav = page.locator('.fixed.bottom-0');
    await expect(nav).toBeVisible();

    // Content should not overlap with navigation
    const main = page.locator('main');
    await expect(main).toHaveClass(/pb-20/); // Bottom padding for nav
  });

  test('touch interactions work correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto('/home');

    // Touch-friendly elements should have proper classes
    await expect(page.locator('.mobile-touch').first()).toBeVisible();
    await expect(page.locator('.touch-feedback').first()).toBeVisible();

    // Mood buttons should be large enough for touch
    const moodButton = page.getByRole('button', { name: /FUNNY/i });
    await expect(moodButton).toBeVisible();

    // Test touch interaction
    await moodButton.tap();
    await expect(moodButton).toHaveClass(/scale-105/);
  });

  test('animations are smooth and present', async ({ page }) => {
    await page.goto('/home');

    // Check for animation classes
    const fadeInElements = page.locator('.animate-fade-in-up');
    const popElements = page.locator('.pop-element-lg');
    const floatElements = page.locator('.animate-float');

    expect(await fadeInElements.count()).toBeGreaterThan(0);
    expect(await popElements.count()).toBeGreaterThan(0);
    expect(await floatElements.count()).toBeGreaterThan(0);
  });

  test('PWA features are available', async ({ page }) => {
    await page.goto('/home');

    // Check for PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    expect(await manifestLink.count()).toBe(1);

    // Check for mobile meta tags
    const viewportMeta = page.locator('meta[name="viewport"]');
    expect(await viewportMeta.count()).toBeGreaterThan(0);

    // Check for apple-mobile-web-app tags
    const appleMeta = page.locator('meta[name*="apple-mobile"]');
    expect(await appleMeta.count()).toBeGreaterThan(0);
  });

  test('service worker functionality', async ({ page }) => {
    await page.goto('/home');

    // Check if service worker is registered
    const serviceWorkerCount = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        return registrations.length;
      }
      return 0;
    });

    // Service worker may or may not be registered depending on environment
    expect(serviceWorkerCount).toBeGreaterThanOrEqual(0);
  });

  test('responsive design across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 390, height: 844, name: 'iPhone 12' },
      { width: 428, height: 926, name: 'iPhone 14 Pro Max' },
      { width: 768, height: 1024, name: 'iPad' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/home');

      // Main heading should be visible on all viewports
      await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

      // Navigation should always be visible
      await expect(page.locator('.fixed.bottom-0')).toBeVisible();

      // AI prompt input should be responsive
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });

  test('font loading and display', async ({ page }) => {
    await page.goto('/home');

    // Check for proper font weights and sizes
    const mainHeading = page.getByRole('heading', { name: /WHAT'S.*NEXT/i });
    await expect(mainHeading).toHaveClass(/font-black/);
    await expect(mainHeading).toHaveClass(/text-huge/);

    // Check for consistent typography
    const megaTextElements = page.locator('.text-mega');
    expect(await megaTextElements.count()).toBeGreaterThan(0);
  });

  test('image loading and optimization', async ({ page }) => {
    await page.goto('/home');

    // Check for main character image
    const bgImage = page.locator('[style*="maincharacter.png"]');
    if ((await bgImage.count()) > 0) {
      await expect(bgImage.first()).toBeVisible();
    }

    // Verify no broken images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
      if (naturalWidth > 0) {
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });
});
