import { test, expect } from '@playwright/test';

test.describe('Book Cover Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
  });

  test('should display real book covers in recommendations', async ({ page }) => {
    console.log('🧪 Testing real book cover display in recommendations');

    // Test FUNNY mood selection
    await page.click('[data-testid="mood-FUNNY"], button:has-text("FUNNY")');
    
    // Wait for loading to complete
    await page.waitForSelector('[data-testid="loading-stage"]', { state: 'hidden', timeout: 60000 });
    
    // Should navigate to recommendations page
    await expect(page).toHaveURL(/.*stacks-recommendations/);
    
    // Wait for recommendations to load
    await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
    
    // Check that book covers are present and not just gradients
    const bookCovers = await page.locator('[data-testid="book-cover"], .book-cover, img[alt*="cover"]').all();
    console.log(`📚 Found ${bookCovers.length} book covers`);
    
    expect(bookCovers.length).toBeGreaterThan(0);
    
    // Check each cover
    let realCoverCount = 0;
    let gradientCoverCount = 0;
    
    for (let i = 0; i < Math.min(bookCovers.length, 6); i++) {
      const cover = bookCovers[i];
      const src = await cover.getAttribute('src');
      const style = await cover.getAttribute('style');
      
      console.log(`📖 Cover ${i + 1}: src="${src?.substring(0, 50)}...", style="${style?.substring(0, 50)}..."`);
      
      if (src && (src.startsWith('http') || src.startsWith('/api/cover-proxy'))) {
        realCoverCount++;
        console.log(`  ✅ Real cover detected`);
        
        // Verify the image actually loads
        await expect(cover).toBeVisible();
        
        // Check that it's not a broken image
        const naturalWidth = await cover.evaluate((img: HTMLImageElement) => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
      } else if (style && (style.includes('gradient') || style.includes('linear-gradient'))) {
        gradientCoverCount++;
        console.log(`  🎨 Gradient cover detected`);
      } else {
        console.log(`  ❓ Unknown cover type`);
      }
    }
    
    console.log(`📊 Results: ${realCoverCount} real covers, ${gradientCoverCount} gradient covers`);
    
    // We want to see at least some real covers
    expect(realCoverCount).toBeGreaterThan(0);
    
    // Log success
    console.log(`🎉 Success! Found ${realCoverCount} real book covers out of ${bookCovers.length} total`);
  });

  test('should fetch covers for all mood types', async ({ page }) => {
    const moods = ['FUNNY', 'MIND-BLOWING', 'LOVE STORY', 'MAGICAL'];
    
    for (const mood of moods) {
      console.log(`🧪 Testing covers for mood: ${mood}`);
      
      // Go back to home
      await page.goto('/home');
      await page.waitForLoadState('networkidle');
      
      // Click mood
      await page.click(`button:has-text("${mood}")`);
      
      // Wait for loading
      await page.waitForSelector('[data-testid="loading-stage"]', { state: 'hidden', timeout: 60000 });
      
      // Check we're on recommendations page
      await expect(page).toHaveURL(/.*stacks-recommendations/);
      
      // Wait for content
      await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
      
      // Count covers
      const covers = await page.locator('[data-testid="book-cover"], .book-cover, img[alt*="cover"]').count();
      console.log(`📚 ${mood}: Found ${covers} covers`);
      
      expect(covers).toBeGreaterThan(0);
    }
  });

  test('should use cover proxy for external images', async ({ page }) => {
    console.log('🧪 Testing cover proxy usage');
    
    // Navigate to a page with recommendations
    await page.goto('/stacks-recommendations');
    
    // If no recommendations exist, create some first
    const hasRecommendations = await page.locator('h1:has-text("RECOMMENDATIONS")').isVisible();
    
    if (!hasRecommendations) {
      // Go to home and generate recommendations
      await page.goto('/home');
      await page.click('button:has-text("FUNNY")');
      await page.waitForSelector('[data-testid="loading-stage"]', { state: 'hidden', timeout: 60000 });
      await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
    }
    
    // Check for proxied images
    const images = await page.locator('img[src*="/api/cover-proxy"]').all();
    console.log(`🔗 Found ${images.length} images using cover proxy`);
    
    if (images.length > 0) {
      // Test that proxied images load successfully
      for (let i = 0; i < Math.min(images.length, 3); i++) {
        const img = images[i];
        await expect(img).toBeVisible();
        
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        console.log(`✅ Proxied image ${i + 1} loaded successfully`);
      }
    }
  });

  test('should handle cover loading errors gracefully', async ({ page }) => {
    console.log('🧪 Testing cover error handling');
    
    // Mock a failed cover request
    await page.route('**/api/cover-proxy*', route => {
      route.fulfill({
        status: 404,
        body: 'Not found'
      });
    });
    
    // Generate recommendations
    await page.click('button:has-text("FUNNY")');
    await page.waitForSelector('[data-testid="loading-stage"]', { state: 'hidden', timeout: 60000 });
    await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
    
    // Should still show some kind of cover (gradient fallback)
    const covers = await page.locator('[data-testid="book-cover"], .book-cover').count();
    expect(covers).toBeGreaterThan(0);
    
    console.log(`✅ Graceful fallback: ${covers} covers displayed despite failures`);
  });

  test('should display covers in book details modal', async ({ page }) => {
    console.log('🧪 Testing covers in book details modal');
    
    // Generate recommendations first if needed
    const hasRecommendations = await page.locator('h1:has-text("RECOMMENDATIONS")').isVisible();
    
    if (!hasRecommendations) {
      await page.click('button:has-text("FUNNY")');
      await page.waitForSelector('[data-testid="loading-stage"]', { state: 'hidden', timeout: 60000 });
      await page.waitForSelector('h1:has-text("RECOMMENDATIONS")', { timeout: 10000 });
    }
    
    // Click on a "Book Details" button
    const detailsButton = page.locator('button:has-text("Book Details"), button:has-text("Learn More")').first();
    await detailsButton.waitFor({ state: 'visible' });
    await detailsButton.click();
    
    // Wait for modal
    await page.waitForSelector('[data-testid="book-details-modal"], .modal', { timeout: 5000 });
    
    // Check for cover in modal
    const modalCover = page.locator('[data-testid="book-details-modal"] img, .modal img').first();
    await expect(modalCover).toBeVisible();
    
    const modalCoverSrc = await modalCover.getAttribute('src');
    console.log(`📱 Modal cover: ${modalCoverSrc?.substring(0, 50)}...`);
    
    // Verify it's not broken
    const naturalWidth = await modalCover.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
    
    console.log('✅ Book details modal shows cover successfully');
  });
});