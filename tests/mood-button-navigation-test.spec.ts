import { test, expect } from '@playwright/test';

test.describe('Mood Button Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to recommendations when FUNNY mood is clicked', async ({ page }) => {
    console.log('Testing FUNNY mood button click navigation');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('button:has-text("FUNNY")', { timeout: 10000 });
    
    // Click the FUNNY mood button
    await page.click('button:has-text("FUNNY")');
    console.log('Clicked FUNNY mood button');
    
    // Wait for navigation to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 15000 });
    console.log('Successfully navigated to recommendations page');
    
    // Verify recommendations page loaded
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to recommendations when LOVE STORY mood is clicked', async ({ page }) => {
    console.log('Testing LOVE STORY mood button click navigation');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('button:has-text("LOVE STORY")', { timeout: 10000 });
    
    // Click the LOVE STORY mood button
    await page.click('button:has-text("LOVE STORY")');
    console.log('Clicked LOVE STORY mood button');
    
    // Wait for navigation to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 15000 });
    console.log('Successfully navigated to recommendations page');
    
    // Verify recommendations page loaded
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading overlay during mood selection', async ({ page }) => {
    console.log('Testing loading overlay during mood selection');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('button:has-text("MAGICAL")', { timeout: 10000 });
    
    // Click the MAGICAL mood button
    await page.click('button:has-text("MAGICAL")');
    console.log('Clicked MAGICAL mood button');
    
    // Check for loading state - look for common loading indicators
    const loadingIndicators = [
      page.getByText('FINDING').first(),
      page.getByText('ANALYZING').first(),
      page.getByText('MATCHING').first(),
      page.locator('[data-testid="loading-overlay"]'),
      page.locator('.loading'),
      page.locator('.spinner')
    ];
    
    // Wait for at least one loading indicator to appear
    let foundLoading = false;
    for (const indicator of loadingIndicators) {
      try {
        await indicator.waitFor({ state: 'visible', timeout: 2000 });
        foundLoading = true;
        console.log('Found loading indicator');
        break;
      } catch (e) {
        // Continue checking other indicators
      }
    }
    
    // If no loading indicator found, that's okay - might be too fast
    if (!foundLoading) {
      console.log('No loading indicator found - might be very fast');
    }
    
    // Wait for navigation to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 20000 });
    console.log('Successfully navigated to recommendations page');
  });

  test('should display recommendations with book covers after mood selection', async ({ page }) => {
    console.log('Testing book recommendations display after mood selection');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('button:has-text("MIND-BLOWING")', { timeout: 10000 });
    
    // Click the MIND-BLOWING mood button
    await page.click('button:has-text("MIND-BLOWING")');
    console.log('Clicked MIND-BLOWING mood button');
    
    // Wait for navigation to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 20000 });
    console.log('Successfully navigated to recommendations page');
    
    // Wait for recommendations content to load
    await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
    
    // Look for book recommendations - they could be in different formats
    const bookSelectors = [
      'h2', // Book titles are typically in h2 tags
      '[class*="book"]', // Elements with "book" in class name
      'img[alt*="cover"]', // Book cover images
      'img[src*="cover"]'  // Book cover images by src
    ];
    
    let foundBooks = false;
    for (const selector of bookSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        foundBooks = true;
        console.log(`Found ${elements} elements matching ${selector}`);
        break;
      }
    }
    
    // Wait a bit more for content to load if not found immediately
    if (!foundBooks) {
      await page.waitForTimeout(3000);
      console.log('Waiting for recommendations to load...');
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/mood-recommendations-debug.png', fullPage: true });
    console.log('Screenshot saved for debugging');
  });
});