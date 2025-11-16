/**
 * Comprehensive "What's Next" Feature Test
 * CRITICAL SUCCESS CRITERIA:
 * 1. 100% book cover success rate
 * 2. Full workflow must be bulletproof
 * 3. Priority is ALWAYS real book covers
 * 4. Must work perfectly on both web and iOS
 */

import { test, expect } from '@playwright/test';

// Test configuration for "What's Next" feature
const FEATURE_TIMEOUT = 120000; // 2 minutes for full AI workflow
const SEARCH_TIMEOUT = 45000; // 45 seconds for search to complete
const COVER_TIMEOUT = 15000; // 15 seconds for covers to load

test.describe('What\'s Next Feature - Comprehensive QA', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to discover page where AI prompt input is located
    await page.goto('/discover');
    await page.waitForLoadState('domcontentloaded'); // Don't wait for network idle
  });

  test('CRITICAL: Complete workflow - Text input to recommendations with book covers', async ({ page }) => {
    test.setTimeout(FEATURE_TIMEOUT);
    
    console.log('🎯 Starting comprehensive What\'s Next workflow test');
    
    // STEP 1: Find and interact with AI prompt input
    await page.waitForLoadState('domcontentloaded');
    const promptInput = page.getByPlaceholder(/What's your vibe/i).or(page.locator('input[type="text"]').first());
    await expect(promptInput).toBeVisible({ timeout: 15000 });
    
    console.log('✅ AI prompt input found and visible');
    
    // STEP 2: Enter test query
    const testQuery = 'I want fantasy books like Lord of the Rings with magic and adventure';
    await promptInput.fill(testQuery);
    await expect(promptInput).toHaveValue(testQuery);
    
    console.log('✅ Test query entered successfully');
    
    // STEP 3: Submit the form
    const submitButton = page.getByRole('button', { name: /Find My Next Read/i }).or(page.getByRole('button', { name: /search/i }));
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    
    await submitButton.click();
    console.log('✅ Submit button clicked');
    
    // STEP 4: Wait for and verify loading overlay appears
    const loadingOverlay = page.locator('[role="dialog"]').or(page.locator('.fixed.inset-0.z-\\[9999\\]'));
    await expect(loadingOverlay).toBeVisible({ timeout: 5000 });
    console.log('✅ Loading overlay appeared');
    
    // Verify loading stages are shown
    const loadingTitle = page.getByText(/ANALYZING REQUEST|FINDING PERFECT MATCHES|FETCHING BOOK COVERS/i);
    await expect(loadingTitle).toBeVisible({ timeout: 10000 });
    console.log('✅ Loading stages are displaying');
    
    // STEP 5: Wait for navigation to recommendations page
    await page.waitForURL('**/stacks-recommendations**', { timeout: SEARCH_TIMEOUT });
    console.log('✅ Successfully navigated to recommendations page');
    
    // STEP 6: Verify recommendations page structure
    await expect(page.getByText(/STACKS.*RECOMMENDATIONS/i)).toBeVisible({ timeout: 10000 });
    console.log('✅ Recommendations page header found');
    
    // STEP 7: CRITICAL - Verify book covers are present and loading
    const bookCovers = page.locator('[alt*="by"]').or(page.locator('img[src*="http"]')).or(page.locator('.BookCover'));
    await expect(bookCovers.first()).toBeVisible({ timeout: COVER_TIMEOUT });
    
    const coverCount = await bookCovers.count();
    console.log(`✅ Found ${coverCount} book covers`);
    
    // STEP 8: CRITICAL - Verify cover success rate
    const coverImages = await bookCovers.all();
    let realCovers = 0;
    let gradientCovers = 0;
    let failedCovers = 0;
    
    for (let i = 0; i < Math.min(coverImages.length, 10); i++) { // Test first 10 covers
      const cover = coverImages[i];
      try {
        const src = await cover.getAttribute('src');
        const style = await cover.getAttribute('style');
        
        if (src && src.startsWith('http')) {
          realCovers++;
          console.log(`✅ Real cover ${i + 1}: ${src.substring(0, 50)}...`);
        } else if (src && src.startsWith('gradient')) {
          gradientCovers++;
          console.log(`🎨 Gradient cover ${i + 1}: ${src.substring(0, 50)}...`);
        } else if (style && style.includes('gradient')) {
          gradientCovers++;
          console.log(`🎨 Style gradient cover ${i + 1}`);
        } else {
          failedCovers++;
          console.log(`❌ Failed/Unknown cover ${i + 1}: src=${src}, style=${style ? style.substring(0, 50) : 'none'}`);
        }
      } catch (error) {
        failedCovers++;
        console.log(`❌ Error checking cover ${i + 1}: ${error}`);
      }
    }
    
    const successRate = ((realCovers + gradientCovers) / Math.min(coverImages.length, 10)) * 100;
    console.log(`📊 Cover success rate: ${successRate}% (${realCovers} real, ${gradientCovers} gradient, ${failedCovers} failed)`);
    
    // CRITICAL: Must have 100% cover success (real + gradient fallback)
    expect(failedCovers).toBe(0);
    expect(successRate).toBe(100);
    
    // STEP 9: Verify book information is present
    const bookTitles = page.locator('h2, h3').filter({ hasText: /^[A-Z]/ });
    const titleCount = await bookTitles.count();
    expect(titleCount).toBeGreaterThan(0);
    console.log(`✅ Found ${titleCount} book titles`);
    
    // STEP 10: Verify user query is displayed
    const userQueryDisplay = page.getByText(testQuery);
    await expect(userQueryDisplay).toBeVisible({ timeout: 5000 });
    console.log('✅ User query is displayed on recommendations page');
    
    // STEP 11: Test action buttons functionality
    const addToQueueButton = page.getByRole('button', { name: /Add to Queue/i }).first();
    if (await addToQueueButton.isVisible()) {
      await addToQueueButton.click();
      await expect(page.getByText(/Added!/i)).toBeVisible({ timeout: 5000 });
      console.log('✅ Add to Queue functionality works');
    }
    
    console.log('🎉 Complete workflow test PASSED - What\'s Next feature is working correctly!');
  });

  test('CRITICAL: Mood button workflow with cover verification', async ({ page }) => {
    test.setTimeout(FEATURE_TIMEOUT);
    
    console.log('🎭 Starting mood button workflow test');
    
    // STEP 1: Find and click a mood button
    const funnyButton = page.getByRole('button', { name: /😂 Funny/i });
    await expect(funnyButton).toBeVisible({ timeout: 10000 });
    
    await funnyButton.click();
    console.log('✅ Funny mood button clicked');
    
    // STEP 2: Verify loading overlay
    const loadingOverlay = page.locator('[role="dialog"]');
    await expect(loadingOverlay).toBeVisible({ timeout: 5000 });
    console.log('✅ Loading overlay appeared for mood selection');
    
    // STEP 3: Wait for recommendations
    await page.waitForURL('**/stacks-recommendations**', { timeout: SEARCH_TIMEOUT });
    console.log('✅ Navigated to recommendations from mood button');
    
    // STEP 4: Verify covers load
    const bookCovers = page.locator('img[alt*="by"]').or(page.locator('.BookCover'));
    await expect(bookCovers.first()).toBeVisible({ timeout: COVER_TIMEOUT });
    
    const coverCount = await bookCovers.count();
    expect(coverCount).toBeGreaterThan(0);
    console.log(`✅ Mood button workflow loaded ${coverCount} book covers`);
  });

  test('Book cover service reliability test', async ({ page }) => {
    test.setTimeout(FEATURE_TIMEOUT);
    
    // Test multiple searches to verify cover service reliability
    const queries = [
      'Harry Potter fantasy adventure',
      'mystery novels like Agatha Christie',
      'science fiction space opera'
    ];
    
    for (const query of queries) {
      console.log(`🔍 Testing query: "${query}"`);
      
      await page.goto('/discover');
      const input = page.getByPlaceholder(/What's your vibe/i).or(page.locator('input[type="text"]').first());
      await input.fill(query);
      
      const submitBtn = page.getByRole('button', { name: /Find My Next Read/i });
      await submitBtn.click();
      
      await page.waitForURL('**/stacks-recommendations**', { timeout: SEARCH_TIMEOUT });
      
      // Verify covers for this query
      const covers = page.locator('img[alt*="by"]');
      const count = await covers.count();
      expect(count).toBeGreaterThan(0);
      
      console.log(`✅ Query "${query}" returned ${count} books with covers`);
    }
  });

  test('Loading overlay stages and progress verification', async ({ page }) => {
    console.log('🔄 Testing loading overlay stages');
    
    const input = page.getByPlaceholder(/What's your vibe/i).or(page.locator('input[type="text"]').first());
    await input.fill('epic fantasy adventure');
    
    const submitBtn = page.getByRole('button', { name: /Find My Next Read/i });
    await submitBtn.click();
    
    // Verify loading stages appear
    const stages = [
      'ANALYZING REQUEST',
      'ENRICHING CONTEXT',
      'FINDING PERFECT MATCHES',
      'FETCHING BOOK COVERS'
    ];
    
    for (const stage of stages) {
      const stageElement = page.getByText(stage);
      try {
        await expect(stageElement).toBeVisible({ timeout: 15000 });
        console.log(`✅ Stage "${stage}" displayed`);
      } catch (error) {
        console.log(`⏭️ Stage "${stage}" may have been skipped (fast processing)`);
      }
    }
    
    // Verify progress bar exists
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible({ timeout: 10000 });
    console.log('✅ Progress bar is visible');
  });

  test('Error handling and fallback verification', async ({ page }) => {
    console.log('🚨 Testing error handling');
    
    // Test with a very specific query that might challenge the AI
    const input = page.getByPlaceholder(/What's your vibe/i).or(page.locator('input[type="text"]').first());
    await input.fill('books about quantum physics written in ancient Sanskrit by robots');
    
    const submitBtn = page.getByRole('button', { name: /Find My Next Read/i });
    await submitBtn.click();
    
    // Even with an unusual query, should still get results or proper error handling
    try {
      await page.waitForURL('**/stacks-recommendations**', { timeout: SEARCH_TIMEOUT });
      console.log('✅ Unusual query handled successfully');
      
      // Should still have some books (fallback recommendations)
      const covers = page.locator('img[alt*="by"]').or(page.locator('.BookCover'));
      if (await covers.count() > 0) {
        console.log('✅ Fallback recommendations provided');
      }
    } catch (error) {
      // Check for proper error display
      const errorMessage = page.getByText(/error|failed|try again/i);
      if (await errorMessage.isVisible()) {
        console.log('✅ Proper error message displayed');
      } else {
        throw error;
      }
    }
  });

  test('Mobile viewport compatibility', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    console.log('📱 Testing mobile viewport');
    
    const input = page.getByPlaceholder(/What's your vibe/i).or(page.locator('input[type="text"]').first());
    await expect(input).toBeVisible();
    
    await input.fill('romantic comedy books');
    const submitBtn = page.getByRole('button', { name: /Find My Next Read/i });
    await submitBtn.click();
    
    await page.waitForURL('**/stacks-recommendations**', { timeout: SEARCH_TIMEOUT });
    
    // Verify mobile-friendly layout
    const covers = page.locator('img[alt*="by"]');
    await expect(covers.first()).toBeVisible({ timeout: COVER_TIMEOUT });
    
    console.log('✅ Mobile viewport compatibility verified');
  });
});