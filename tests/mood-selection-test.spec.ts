/**
 * Mood Selection Navigation Test
 * Tests that mood button clicks properly trigger the recommendation flow
 */

import { test, expect } from '@playwright/test';

test.describe('Mood Selection Navigation', () => {
  test('should auto-submit when mood button is clicked', async ({ page }) => {
    await page.goto('/home');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: /WHAT'S.*NEXT/i })).toBeVisible();

    // Click on a mood button (FUNNY)
    await page.click('button:has-text("FUNNY")');

    // Verify the mood is selected (check for selected state styling)
    await expect(page.locator('button:has-text("FUNNY")')).toHaveClass(/scale-105/);

    // The mood should automatically trigger the search flow
    // Check for loading state
    await expect(page.getByText('FINDING').first()).toBeVisible({ timeout: 5000 });

    // Should eventually navigate to recommendations page  
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 120000 });

    // Should show recommendations with real covers
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
  });

  test('should work with different mood buttons', async ({ page }) => {
    await page.goto('/home');

    // Test LOVE STORY mood
    await page.click('button:has-text("LOVE STORY")');
    
    // Check for loading state
    await expect(page.getByText('FINDING').first()).toBeVisible({ timeout: 5000 });

    // Should navigate to recommendations
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 120000 });
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
  });

  test('should allow manual submit after mood selection', async ({ page }) => {
    await page.goto('/home');

    // Click mood button
    await page.click('button:has-text("MAGICAL")');
    
    // Verify mood is selected
    await expect(page.locator('button:has-text("MAGICAL")')).toHaveClass(/scale-105/);

    // Manually click submit button
    await page.click('button:has-text("Find Next Read")');

    // Should trigger loading
    await expect(page.getByText('FINDING').first()).toBeVisible({ timeout: 5000 });

    // Should navigate to recommendations
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 120000 });
  });

  test('should clear text input when mood is selected', async ({ page }) => {
    await page.goto('/home');

    // Type in text input first
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('some text');

    // Select mood
    await page.click('button:has-text("MIND-BLOWING")');

    // Text input should be cleared
    await expect(promptInput).toHaveValue('');
    
    // Mood should be selected
    await expect(page.locator('button:has-text("MIND-BLOWING")')).toHaveClass(/scale-105/);
  });
});