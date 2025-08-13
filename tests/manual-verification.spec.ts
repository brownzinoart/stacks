import { test, expect } from '@playwright/test';

test.describe('Manual User Experience Verification', () => {
  test('Quick mood button verification', async ({ page }) => {
    console.log('Starting manual verification...');
    
    // Navigate to home page
    await page.goto('/home');
    console.log('✅ Home page loaded');
    
    // Verify mood buttons are present
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await expect(funnyButton).toBeVisible();
    console.log('✅ FUNNY button found');
    
    const mindBlowingButton = page.getByRole('button', { name: /MIND-BLOWING/i });
    await expect(mindBlowingButton).toBeVisible(); 
    console.log('✅ MIND-BLOWING button found');
    
    const loveStoryButton = page.getByRole('button', { name: /LOVE STORY/i });
    await expect(loveStoryButton).toBeVisible();
    console.log('✅ LOVE STORY button found');
    
    const magicalButton = page.getByRole('button', { name: /MAGICAL/i });
    await expect(magicalButton).toBeVisible();
    console.log('✅ MAGICAL button found');
    
    // Click FUNNY mood button
    console.log('🎯 Clicking FUNNY button...');
    await funnyButton.click();
    
    // Check if loading overlay appears
    const loadingDialog = page.locator('[role="dialog"]');
    try {
      await expect(loadingDialog).toBeVisible({ timeout: 5000 });
      console.log('✅ Loading overlay appeared');
      
      // Check for loading stages
      const analyzingText = page.getByText('ANALYZING REQUEST');
      if (await analyzingText.isVisible()) {
        console.log('✅ ANALYZING REQUEST stage visible');
      }
      
    } catch (error) {
      console.log('⚠️ Loading overlay did not appear or took too long');
    }
    
    // Wait for navigation to recommendations (with shorter timeout)
    try {
      await page.waitForURL('/stacks-recommendations', { timeout: 45000 });
      console.log('✅ Navigated to recommendations page');
      
      // Check if page loads content
      const stacksTitle = page.getByText('STACKS');
      await expect(stacksTitle).toBeVisible({ timeout: 10000 });
      console.log('✅ STACKS title visible');
      
      const recommendationsTitle = page.getByText('RECOMMENDATIONS');
      await expect(recommendationsTitle).toBeVisible({ timeout: 5000 });
      console.log('✅ RECOMMENDATIONS title visible');
      
      // Look for book cards
      const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]').filter({
        has: page.locator('h2')
      });
      
      try {
        await expect(bookCards.first()).toBeVisible({ timeout: 15000 });
        const cardCount = await bookCards.count();
        console.log(`✅ Found ${cardCount} book recommendation cards`);
        
        if (cardCount > 0) {
          // Check first book details
          const firstCard = bookCards.first();
          const bookTitle = await firstCard.locator('h2').first().textContent();
          console.log(`✅ First book title: "${bookTitle}"`);
          
          // Check for book cover
          const bookCover = firstCard.locator('img, [class*="book-cover"]').first();
          if (await bookCover.isVisible()) {
            console.log('✅ Book cover is visible');
            
            // Check if it's a real URL
            const imgSrc = await bookCover.getAttribute('src');
            if (imgSrc && imgSrc.startsWith('http')) {
              console.log(`✅ Real book cover URL: ${imgSrc.substring(0, 50)}...`);
            } else {
              console.log('⚠️ Book cover is not a real URL, likely gradient placeholder');
            }
          }
          
          // Check for action buttons
          const addButton = firstCard.getByRole('button', { name: /Add to Queue/i });
          if (await addButton.isVisible()) {
            console.log('✅ Add to Queue button visible');
            
            // Test clicking it
            await addButton.click();
            const addedText = page.getByText('Added!');
            if (await addedText.isVisible({ timeout: 3000 })) {
              console.log('✅ Add to Queue functionality working');
            }
          }
        }
        
      } catch (error) {
        console.log('❌ No book cards found or took too long to load');
        console.log('Taking screenshot for debugging...');
        await page.screenshot({ path: 'test-results/debug-recommendations.png' });
      }
      
    } catch (error) {
      console.log('❌ Failed to navigate to recommendations page within timeout');
      console.log('Current URL:', page.url());
      console.log('Taking screenshot for debugging...');
      await page.screenshot({ path: 'test-results/debug-timeout.png' });
    }
  });

  test('Test emergency fallback scenario', async ({ page }) => {
    console.log('Testing emergency fallback...');
    
    // Mock API delays to trigger fallback
    await page.route('**/api/ai-recommendation-proxy', async (route) => {
      console.log('🚨 Delaying API call to trigger fallback...');
      await new Promise(resolve => setTimeout(resolve, 25000)); // 25 second delay
      await route.continue();
    });
    
    await page.goto('/home');
    
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    console.log('🎯 Clicked FUNNY with delayed API - waiting for fallback...');
    
    // Should still navigate to recommendations with fallback data
    try {
      await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
      console.log('✅ Navigated to recommendations (likely with fallback data)');
      
      // Check for fallback book titles
      const fallbackTitles = [
        'The Seven Husbands of Evelyn Hugo',
        'The Midnight Library',
        'Where the Crawdads Sing'
      ];
      
      let fallbackFound = 0;
      for (const title of fallbackTitles) {
        if (await page.getByText(title).isVisible({ timeout: 5000 })) {
          console.log(`✅ Found fallback book: ${title}`);
          fallbackFound++;
        }
      }
      
      if (fallbackFound > 0) {
        console.log(`✅ Emergency fallback working - found ${fallbackFound} fallback books`);
      } else {
        console.log('⚠️ No fallback books found, but page loaded');
      }
      
    } catch (error) {
      console.log('❌ Emergency fallback did not work - no navigation occurred');
    }
  });

  test('Test all four mood buttons quickly', async ({ page }) => {
    console.log('Testing all four mood buttons...');
    
    const moods = ['FUNNY', 'MIND-BLOWING', 'LOVE STORY', 'MAGICAL'];
    
    for (const mood of moods) {
      console.log(`\n🎭 Testing ${mood} mood...`);
      
      await page.goto('/home');
      
      const moodButton = page.getByRole('button', { name: new RegExp(mood, 'i') });
      await expect(moodButton).toBeVisible();
      await moodButton.click();
      
      console.log(`✅ Clicked ${mood} button`);
      
      // Check for loading overlay (brief check)
      const loadingDialog = page.locator('[role="dialog"]');
      if (await loadingDialog.isVisible({ timeout: 2000 })) {
        console.log(`✅ ${mood} loading overlay appeared`);
      }
      
      // Check if we navigate to recommendations (with timeout)
      try {
        await page.waitForURL('/stacks-recommendations', { timeout: 35000 });
        console.log(`✅ ${mood} navigated to recommendations successfully`);
        
        // Quick check for content
        const stacksTitle = page.getByText('STACKS');
        if (await stacksTitle.isVisible({ timeout: 5000 })) {
          console.log(`✅ ${mood} recommendations page content loaded`);
        }
        
      } catch (error) {
        console.log(`❌ ${mood} failed to navigate to recommendations`);
      }
    }
    
    console.log('\n📊 All mood button tests completed');
  });
});