import { test, expect } from '@playwright/test';

test.describe('Complete Mood Button User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing local storage
    await page.goto('/home');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('FUNNY mood button complete user journey', async ({ page }) => {
    console.log('Testing FUNNY mood button flow...');
    
    // 1. Click FUNNY mood button
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await expect(funnyButton).toBeVisible();
    await funnyButton.click();
    
    // 2. Verify loading overlay appears with correct stages
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.getByText('ANALYZING REQUEST')).toBeVisible();
    
    // 3. Wait for navigation to recommendations page (with generous timeout for API)
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // 4. Verify recommendations page loads with content
    await expect(page.getByText('STACKS')).toBeVisible();
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    
    // 5. Verify book recommendations are present
    const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]').filter({
      has: page.locator('h2') // Book title
    });
    await expect(bookCards.first()).toBeVisible({ timeout: 10000 });
    
    // 6. Verify book covers are displaying (not just gradients)
    const bookCovers = page.locator('img').or(page.locator('[class*="book-cover"]'));
    await expect(bookCovers.first()).toBeVisible();
    
    // 7. Verify book metadata is present
    await expect(page.locator('h2').first()).toContainText(/\w+/); // Book title
    await expect(page.locator('text=/by .+/').first()).toBeVisible(); // Author
    
    // 8. Test interaction buttons
    const addToQueueBtn = page.getByRole('button', { name: /Add to Queue/i }).first();
    await expect(addToQueueBtn).toBeVisible();
    await addToQueueBtn.click();
    await expect(page.getByText('Added!')).toBeVisible();
  });

  test('MIND-BLOWING mood button complete user journey', async ({ page }) => {
    console.log('Testing MIND-BLOWING mood button flow...');
    
    const mindBlowingButton = page.getByRole('button', { name: /MIND-BLOWING/i });
    await expect(mindBlowingButton).toBeVisible();
    await mindBlowingButton.click();
    
    // Verify loading stages progress
    await expect(page.getByText('ANALYZING REQUEST')).toBeVisible();
    await expect(page.getByText('FINDING PERFECT MATCHES')).toBeVisible({ timeout: 15000 });
    
    // Wait for recommendations page
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Verify content loads properly
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]');
    await expect(bookCards.first()).toBeVisible({ timeout: 10000 });
    
    // Test book details modal
    const bookDetailsBtn = page.getByRole('button', { name: /Book Details/i }).first();
    await expect(bookDetailsBtn).toBeVisible();
    await bookDetailsBtn.click();
    // Modal should appear (dynamically imported)
    await expect(page.locator('[role="dialog"]').last()).toBeVisible({ timeout: 5000 });
  });

  test('LOVE STORY mood button complete user journey', async ({ page }) => {
    console.log('Testing LOVE STORY mood button flow...');
    
    const loveStoryButton = page.getByRole('button', { name: /LOVE STORY/i });
    await expect(loveStoryButton).toBeVisible();
    await loveStoryButton.click();
    
    // Test loading overlay components
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.getByText('Understanding your mood')).toBeVisible();
    
    // Verify progress indicators
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    
    // Wait for completion
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Verify category structure if present
    const categorySection = page.locator('text=Popular Recommendations').or(page.locator('h2'));
    await expect(categorySection.first()).toBeVisible({ timeout: 10000 });
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Edit your prompt"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('romantic fantasy books');
    await page.getByRole('button', { name: /Update/i }).click();
    
    // Should navigate back to home with new search
    await page.waitForURL('/home', { timeout: 10000 });
  });

  test('MAGICAL mood button complete user journey', async ({ page }) => {
    console.log('Testing MAGICAL mood button flow...');
    
    const magicalButton = page.getByRole('button', { name: /MAGICAL/i });
    await expect(magicalButton).toBeVisible();
    await magicalButton.click();
    
    // Comprehensive loading stage verification
    await expect(page.getByText('ANALYZING REQUEST')).toBeVisible();
    await expect(page.getByText('ENRICHING CONTEXT')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('FINDING PERFECT MATCHES')).toBeVisible({ timeout: 15000 });
    
    // Wait for final stage
    await expect(page.getByText('FETCHING BOOK COVERS')).toBeVisible({ timeout: 20000 });
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Verify comprehensive book display
    const firstBookCard = page.locator('[class*="rounded-3xl"][class*="bg-white"]').first();
    await expect(firstBookCard).toBeVisible({ timeout: 10000 });
    
    // Verify cover images are real URLs (not gradients)
    const bookCover = firstBookCard.locator('img, [style*="background-image"]').first();
    await expect(bookCover).toBeVisible();
    
    // Test book cover click for flipbook
    await bookCover.click();
    await expect(page.locator('text=Loading flipbook')).toBeVisible({ timeout: 5000 });
  });

  test('Emergency fallback behavior verification', async ({ page }) => {
    console.log('Testing emergency fallback scenarios...');
    
    // Mock slow/failed API to test fallback
    await page.route('**/api/**', async (route) => {
      // Delay all API calls to trigger timeouts
      await new Promise(resolve => setTimeout(resolve, 25000));
      await route.continue();
    });
    
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    // Should still show loading
    await expect(page.getByText('ANALYZING REQUEST')).toBeVisible();
    
    // Should eventually navigate to recommendations with fallback data
    await page.waitForURL('/stacks-recommendations', { timeout: 35000 });
    
    // Verify fallback recommendations appear
    await expect(page.getByText('Popular Recommendations')).toBeVisible({ timeout: 10000 });
    
    // Should have emergency fallback books
    const fallbackBooks = [
      'The Seven Husbands of Evelyn Hugo',
      'The Midnight Library', 
      'Where the Crawdads Sing'
    ];
    
    for (const bookTitle of fallbackBooks) {
      await expect(page.getByText(bookTitle)).toBeVisible();
    }
  });

  test('Performance and loading time verification', async ({ page }) => {
    console.log('Testing performance metrics...');
    
    const startTime = Date.now();
    
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    // Measure time to first loading stage
    await expect(page.getByText('ANALYZING REQUEST')).toBeVisible();
    const loadingStartTime = Date.now() - startTime;
    console.log(`Loading overlay appeared in: ${loadingStartTime}ms`);
    
    // Measure total time to recommendations
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    const totalTime = Date.now() - startTime;
    console.log(`Total time to recommendations: ${totalTime}ms`);
    
    // Measure time to first book visible
    await expect(page.locator('[class*="rounded-3xl"][class*="bg-white"]').first()).toBeVisible();
    const bookDisplayTime = Date.now() - startTime;
    console.log(`First book displayed in: ${bookDisplayTime}ms`);
    
    // Verify reasonable performance (should complete within 30 seconds)
    expect(totalTime).toBeLessThan(30000);
    expect(loadingStartTime).toBeLessThan(1000); // Loading should appear quickly
  });

  test('Visual verification of book covers and UI completeness', async ({ page }) => {
    console.log('Testing visual completeness...');
    
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/recommendations-page.png', fullPage: true });
    
    // Verify essential UI elements
    await expect(page.getByText('STACKS')).toBeVisible();
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    
    // Verify at least 3 books are displayed
    const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]').filter({
      has: page.locator('h2')
    });
    await expect(bookCards).toHaveCount({ min: 3 });
    
    // Verify each book has essential elements
    for (let i = 0; i < Math.min(3, await bookCards.count()); i++) {
      const card = bookCards.nth(i);
      await expect(card.locator('h2')).toBeVisible(); // Title
      await expect(card.locator('text=/by .+/').or(card.locator('p').first())).toBeVisible(); // Author
      await expect(card.getByRole('button', { name: /Add to Queue/i })).toBeVisible(); // Action buttons
    }
    
    // Verify breadcrumb navigation
    await expect(page.getByText('Home ›')).toBeVisible();
    await expect(page.getByText('Recommendations')).toBeVisible();
  });

  test('Multiple mood selections in sequence', async ({ page }) => {
    console.log('Testing multiple mood selections...');
    
    // Test FUNNY first
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Navigate back to home
    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForURL('/home');
    
    // Test MAGICAL next
    const magicalButton = page.getByRole('button', { name: /MAGICAL/i });
    await magicalButton.click();
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Verify new recommendations loaded
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    
    // Navigate back and test MIND-BLOWING
    await page.getByRole('button', { name: 'Home' }).click();
    await page.waitForURL('/home');
    
    const mindBlowingButton = page.getByRole('button', { name: /MIND-BLOWING/i });
    await mindBlowingButton.click();
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
  });
});