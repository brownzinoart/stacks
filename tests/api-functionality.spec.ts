/**
 * API Functionality Tests
 * Tests the AI prompt and recommendation system functionality
 */

import { test, expect } from '@playwright/test';

test.describe('API Functionality', () => {
  test.skip('AI recommendation system works', async ({ page }) => {
    await page.goto('/home');

    // Mock the API response to avoid actual API calls in tests
    await page.route('**/api/openai-proxy', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  overallTheme: 'Test recommendations',
                  categories: [
                    {
                      name: 'Test Category',
                      description: 'Test description',
                      books: [
                        {
                          title: 'Test Book',
                          author: 'Test Author',
                          whyYoullLikeIt: 'Test recommendation',
                        },
                      ],
                    },
                  ],
                }),
              },
            },
          ],
        }),
      });
    });

    // Fill and submit AI prompt
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('I want something adventurous');

    const submitButton = page.getByRole('button', { name: /Find Next Read/i });
    await submitButton.click();

    // Should navigate to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 10000 });
  });

  test('mood buttons work correctly', async ({ page }) => {
    await page.goto('/home');

    // Check mood buttons exist and are clickable
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    const mindBlowingButton = page.getByRole('button', { name: /MIND-BLOWING/i });
    const loveStoryButton = page.getByRole('button', { name: /LOVE STORY/i });
    const magicalButton = page.getByRole('button', { name: /MAGICAL/i });

    await expect(funnyButton).toBeVisible();
    await expect(mindBlowingButton).toBeVisible();
    await expect(loveStoryButton).toBeVisible();
    await expect(magicalButton).toBeVisible();

    // Test clicking a mood button
    await funnyButton.click();
    // Button should show selected state
    await expect(funnyButton).toHaveClass(/scale-105/);
  });

  test('discovery buttons are functional', async ({ page }) => {
    await page.goto('/home');

    // Test More Ways to Discover buttons
    const surpriseButton = page.getByRole('button', { name: /SURPRISE ME/i });
    const browseTopicsButton = page.getByRole('button', { name: /BROWSE TOPICS/i });
    const trendingButton = page.getByRole('button', { name: /TRENDING NOW/i });

    await expect(surpriseButton).toBeVisible();
    await expect(browseTopicsButton).toBeVisible();
    await expect(trendingButton).toBeVisible();

    // Verify they're clickable (won't navigate in test, but should respond to clicks)
    await surpriseButton.click();
    await browseTopicsButton.click();
    await trendingButton.click();
  });
});
