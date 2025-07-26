/**
 * Smoke tests for Stacks home page
 * Verifies basic functionality and accessibility
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully and return 200', async ({ page }) => {
    // Navigate to home page
    const response = await page.goto('/');

    // Verify the page loads successfully
    expect(response?.status()).toBe(200);

    // Verify we're redirected to /home
    await expect(page).toHaveURL('/home');
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/home');

    // Check for main navigation elements
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Discovery' })).toBeVisible();
  });

  test('should display home page content', async ({ page }) => {
    await page.goto('/home');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /what.*mood/i })).toBeVisible();

    // Check for AI prompt input
    await expect(page.getByPlaceholder(/feeling nostalgic/i)).toBeVisible();

    // Check for main sections
    await expect(page.getByText('Recent Searches')).toBeVisible();
    await expect(page.getByText('My Queue')).toBeVisible();
    await expect(page.getByText('Reading Streak')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/home');

    // Basic accessibility checks
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="main"]')).toBeVisible();

    // Check for proper form labels
    const promptInput = page.getByPlaceholder(/feeling nostalgic/i);
    await expect(promptInput).toBeVisible();

    // Verify navigation is keyboard accessible
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('should handle AI prompt submission', async ({ page }) => {
    await page.goto('/home');

    // Fill in the AI prompt
    await page.fill('textarea[placeholder*="feeling nostalgic"]', 'I want something adventurous');

    // Submit the form
    await page.click('button:text("Get Recommendations")');

    // Verify loading state appears
    await expect(page.getByText('Finding books...')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/home');

    // Navigate to Explore page
    await page.click('a:text("Explore")');
    await expect(page).toHaveURL('/explore');
    await expect(page.getByRole('heading', { name: 'Explore & Learn' })).toBeVisible();

    // Navigate to Discovery page
    await page.click('a:text("Discovery")');
    await expect(page).toHaveURL('/discovery');
    await expect(page.getByRole('heading', { name: 'Discovery' })).toBeVisible();

    // Navigate back to Home
    await page.click('a:text("Home")');
    await expect(page).toHaveURL('/home');
  });
});
