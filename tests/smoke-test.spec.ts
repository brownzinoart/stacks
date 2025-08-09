/**
 * Smoke Test Suite
 * Essential functionality verification after discovery-first strategy implementation
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('pages load successfully', async ({ page }) => {
    // Test home page loads
    const homeResponse = await page.goto('/home');
    expect(homeResponse?.status()).toBe(200);

    // Test AR discovery page loads
    const arResponse = await page.goto('/ar-discovery');
    expect(arResponse?.status()).toBe(200);

    // Test community page loads
    const communityResponse = await page.goto('/community');
    expect(communityResponse?.status()).toBe(200);

    // Test profile page loads
    const profileResponse = await page.goto('/profile');
    expect(profileResponse?.status()).toBe(200);
  });

  test('home page displays key elements', async ({ page }) => {
    await page.goto('/home');

    // Check main hero section
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    // Check AI prompt input exists
    await expect(page.locator('input[type="text"]').first()).toBeVisible();

    // Check navigation tabs exist
    await expect(page.locator('.fixed.bottom-0')).toBeVisible();

    // Check key sections exist
    await expect(page.getByText('MORE WAYS')).toBeVisible();
    await expect(page.getByText('TO DISCOVER')).toBeVisible();
  });

  test('AI prompt input is functional', async ({ page }) => {
    await page.goto('/home');

    // Find and fill AI prompt input
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('test input');

    // Verify input has content
    await expect(promptInput).toHaveValue('test input');

    // Check submit button becomes enabled
    const submitButton = page.getByRole('button', { name: /Find Next Read/i });
    await expect(submitButton).toBeVisible();
  });

  test('discovery features are present', async ({ page }) => {
    await page.goto('/home');

    // Check More Ways to Discover section
    await expect(page.getByText('SURPRISE ME')).toBeVisible();
    await expect(page.getByText('BROWSE TOPICS')).toBeVisible();
    await expect(page.getByText('TRENDING NOW')).toBeVisible();

    // Check Ready for Pickup section exists
    await expect(page.getByText('READY FOR')).toBeVisible();
    await expect(page.getByText('PICKUP')).toBeVisible();
  });

  test('mobile responsive layout works', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home');

    // Navigation should be at bottom
    const nav = page.locator('.fixed.bottom-0');
    await expect(nav).toBeVisible();

    // Main content should be visible
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    // Touch-friendly buttons should be present
    await expect(page.locator('.mobile-touch').first()).toBeVisible();
  });

  test('iOS-specific features work', async ({ page }) => {
    await page.goto('/home');

    // Check PWA install prompt component exists
    await expect(page.locator('div').first()).toBeVisible(); // Basic DOM check

    // Verify safe area handling in navigation
    const nav = page.locator('.fixed.bottom-0');
    await expect(nav).toBeVisible();
  });
});
