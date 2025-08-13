import { test, expect } from '@playwright/test';

test.describe('Basic Mood Button Flow Test', () => {
  test('Test FUNNY mood button complete flow', async ({ page }) => {
    console.log('🎯 Starting basic flow test for FUNNY mood');
    
    // 1. Navigate to home
    await page.goto('/home');
    await expect(page.getByRole('button', { name: /FUNNY/i })).toBeVisible();
    console.log('✅ Home page loaded with FUNNY button');
    
    // 2. Click FUNNY button  
    await page.getByRole('button', { name: /FUNNY/i }).click();
    console.log('✅ Clicked FUNNY button');
    
    // 3. Wait for recommendations page (generous timeout)
    await page.waitForURL('/stacks-recommendations', { timeout: 60000 });
    console.log('✅ Navigated to recommendations page');
    
    // 4. Take screenshot
    await page.screenshot({ path: 'test-results/funny-recommendations.png' });
    console.log('✅ Screenshot taken');
    
    // 5. Basic content verification
    await expect(page.getByText('STACKS')).toBeVisible();
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    console.log('✅ Page headers are visible');
    
    // 6. Check for any book content (very basic)
    const hasBooks = await page.locator('h2').count() > 1; // More than just page headers
    console.log(`📚 Found books: ${hasBooks}`);
    
    // 7. Check localStorage for data
    const hasData = await page.evaluate(() => {
      return localStorage.getItem('stacks_recommendations') !== null;
    });
    console.log(`💾 Has stored data: ${hasData}`);
    
    console.log('🎉 Basic flow test completed successfully');
  });
  
  test('Test MIND-BLOWING mood button basic flow', async ({ page }) => {
    console.log('🎯 Starting basic flow test for MIND-BLOWING mood');
    
    await page.goto('/home');
    await page.getByRole('button', { name: /MIND-BLOWING/i }).click();
    console.log('✅ Clicked MIND-BLOWING button');
    
    await page.waitForURL('/stacks-recommendations', { timeout: 60000 });
    console.log('✅ Navigated to recommendations page');
    
    await page.screenshot({ path: 'test-results/mind-blowing-recommendations.png' });
    
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    console.log('🎉 MIND-BLOWING flow completed');
  });
  
  test('Test LOVE STORY mood button basic flow', async ({ page }) => {
    console.log('🎯 Starting basic flow test for LOVE STORY mood');
    
    await page.goto('/home');
    await page.getByRole('button', { name: /LOVE STORY/i }).click();
    console.log('✅ Clicked LOVE STORY button');
    
    await page.waitForURL('/stacks-recommendations', { timeout: 60000 });
    console.log('✅ Navigated to recommendations page');
    
    await page.screenshot({ path: 'test-results/love-story-recommendations.png' });
    
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    console.log('🎉 LOVE STORY flow completed');
  });
  
  test('Test MAGICAL mood button basic flow', async ({ page }) => {
    console.log('🎯 Starting basic flow test for MAGICAL mood');
    
    await page.goto('/home');
    await page.getByRole('button', { name: /MAGICAL/i }).click();
    console.log('✅ Clicked MAGICAL button');
    
    await page.waitForURL('/stacks-recommendations', { timeout: 60000 });
    console.log('✅ Navigated to recommendations page');
    
    await page.screenshot({ path: 'test-results/magical-recommendations.png' });
    
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    console.log('🎉 MAGICAL flow completed');
  });
});