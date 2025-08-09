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

    // Check for iOS tab bar navigation elements with updated names
    await expect(page.getByRole('link', { name: /Discover/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Library/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Community/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Progress/i })).toBeVisible();
  });

  test('should display home page content', async ({ page }) => {
    await page.goto('/home');

    // Check for main heading (discovery-first strategy)
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    // Check for AI prompt input with rotating examples
    await expect(page.locator('input[type="text"]')).toBeVisible();

    // Check for discovery sections
    await expect(page.getByText('MORE WAYS')).toBeVisible();
    await expect(page.getByText('TO DISCOVER')).toBeVisible();

    // Check for main sections with correct titles
    await expect(page.getByText('NEW')).toBeVisible(); // From NewReleases
    await expect(page.getByText('BOOK')).toBeVisible(); // From MyQueue (BOOK QUEUE)
    await expect(page.getByText('READING')).toBeVisible(); // From ReadingStreak (READING PLAN)
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/home');

    // Basic accessibility checks - use specific heading to avoid multiple h1 elements
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();
    await expect(page.locator('main').first()).toBeVisible();

    // Check for AI prompt input
    const promptInput = page.locator('input[type="text"]').first();
    await expect(promptInput).toBeVisible();

    // Verify navigation is keyboard accessible
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });

  test('should handle AI prompt submission', async ({ page }) => {
    await page.goto('/home');

    // Fill in the AI prompt with the correct input selector
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('I want something adventurous');

    // Submit the form with the correct button selector
    await page.click('button:has-text("Find Next Read")');

    // Verify loading state appears
    await expect(page.getByText('FINDING').first()).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/home');

    // Navigate to Library (AR Discovery) page
    await page.getByRole('link', { name: /Library/i }).click();
    await expect(page).toHaveURL('/ar-discovery');
    await expect(page.getByRole('heading', { name: /AR BOOK.*DISCOVERY/i })).toBeVisible();

    // Navigate to Community page
    await page.getByRole('link', { name: /Community/i }).click();
    await expect(page).toHaveURL('/community');

    // Navigate back to Discover (Home)
    await page.getByRole('link', { name: /Discover/i }).click();
    await expect(page).toHaveURL('/home');
  });
});
