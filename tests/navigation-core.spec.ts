/**
 * Core Navigation Testing
 * Tests the essential 4-tab navigation functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Core Navigation', () => {
  test('should display navigation tabs', async ({ page }) => {
    await page.goto('/home');

    // Wait for page to load and check navigation exists
    await expect(page.locator('.fixed.bottom-0')).toBeVisible();

    // Check all 4 navigation items are present
    const navLinks = page.locator('a[href="/home"], a[href="/ar-discovery"], a[href="/community"], a[href="/profile"]');
    await expect(navLinks).toHaveCount(4);
  });

  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/home');

    // Test navigation to each page
    await page.locator('a[href="/ar-discovery"]').click();
    await expect(page).toHaveURL('/ar-discovery');

    await page.locator('a[href="/community"]').click();
    await expect(page).toHaveURL('/community');

    await page.locator('a[href="/profile"]').click();
    await expect(page).toHaveURL('/profile');

    await page.locator('a[href="/home"]').click();
    await expect(page).toHaveURL('/home');
  });

  test('should display main content on each page', async ({ page }) => {
    // Test home page
    await page.goto('/home');
    await expect(page.getByText("WHAT'S")).toBeVisible();
    await expect(page.getByText('NEXT?')).toBeVisible();

    // Test AR discovery page
    await page.goto('/ar-discovery');
    await expect(page.getByText('AR BOOK')).toBeVisible();
    await expect(page.getByText('DISCOVERY')).toBeVisible();

    // Test community page
    await page.goto('/community');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/home');

    // Navigation should be visible at bottom
    const nav = page.locator('.fixed.bottom-0');
    await expect(nav).toBeVisible();

    // Main content should be scrollable
    await expect(page.locator('main')).toBeVisible();
  });
});
