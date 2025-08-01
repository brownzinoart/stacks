/**
 * E2E tests for AR features
 */

import { test, expect } from '@playwright/test';

test.describe('AR Discovery Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar-discovery');
  });

  test('should load AR discovery page successfully', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1')).toContainText('AR BOOK');
    await expect(page.locator('h1')).toContainText('DISCOVERY');

    // Check feature buttons
    await expect(page.getByRole('button', { name: /SHELF SCANNER/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /BOOK NAVIGATOR/i })).toBeVisible();
  });

  test('should show AR shelf scanner when clicked', async ({ page }) => {
    // Click shelf scanner button
    await page.getByRole('button', { name: /SHELF SCANNER/i }).click();

    // Check AR shelf scan component appears
    await expect(page.locator('text=AR SHELF')).toBeVisible();
    await expect(page.locator('text=SCANNER')).toBeVisible();

    // Check start button
    await expect(page.getByRole('button', { name: /START AR SCAN/i })).toBeVisible();
  });

  test('should show AR navigator when clicked', async ({ page }) => {
    // Click navigator button
    await page.getByRole('button', { name: /BOOK NAVIGATOR/i }).click();

    // Check book selection appears
    await expect(page.locator('text=SELECT A BOOK TO NAVIGATE TO')).toBeVisible();

    // Check sample books
    await expect(page.getByRole('button', { name: /The Great Gatsby/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sapiens/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /1984/i })).toBeVisible();
  });

  test('should show navigation interface when book selected', async ({ page }) => {
    // Navigate to book navigator
    await page.getByRole('button', { name: /BOOK NAVIGATOR/i }).click();

    // Select a book
    await page.getByRole('button', { name: /The Great Gatsby/i }).click();

    // Check navigation interface appears
    await expect(page.locator('text=AR BOOK')).toBeVisible();
    await expect(page.locator('text=NAVIGATOR')).toBeVisible();
    await expect(page.locator('text=Navigating to: The Great Gatsby')).toBeVisible();

    // Check start navigation button
    await expect(page.getByRole('button', { name: /START AR NAVIGATION/i })).toBeVisible();
  });

  test('should show instructions when no feature is selected', async ({ page }) => {
    // Check instructions card
    await expect(page.locator('text=HOW IT WORKS')).toBeVisible();

    // Check shelf scanner instructions
    await expect(page.locator('text=Hold your phone up to book shelves')).toBeVisible();

    // Check navigator instructions
    await expect(page.locator('text=Select any book in the catalog')).toBeVisible();
  });

  test('should handle camera permission denial gracefully', async ({ page, context }) => {
    // Mock camera permissions
    await context.grantPermissions([]); // Deny all permissions

    // Try to start AR scan
    await page.getByRole('button', { name: /SHELF SCANNER/i }).click();
    await page.getByRole('button', { name: /START AR SCAN/i }).click();

    // Should show error message (implementation may vary)
    // This test ensures the app doesn't crash when permissions are denied
    await page.waitForTimeout(1000);
    const errorMessage = page.locator('text=/permission|not supported/i');
    const errorCount = await errorMessage.count();
    expect(errorCount).toBeGreaterThan(0);
  });
});
