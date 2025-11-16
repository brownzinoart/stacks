import { test, expect } from '@playwright/test';

test('Mood button should navigate to recommendations', async ({ page }) => {
  // Navigate to home page
  await page.goto('/home');
  await page.waitForSelector('button:has-text("FUNNY")', { timeout: 10000 });
  
  console.log('Clicking FUNNY mood button...');
  
  // Click the FUNNY mood button
  await page.click('button:has-text("FUNNY")');
  
  // Wait for navigation to recommendations page (allowing time for emergency fallback)
  await expect(page).toHaveURL('/stacks-recommendations', { timeout: 30000 });
  
  console.log('✅ Successfully navigated to recommendations page');
  
  // Verify recommendations page content is visible (check for the main heading)
  await expect(page.locator('h1:has-text("RECOMMENDATIONS")')).toBeVisible({ timeout: 10000 });
  
  console.log('✅ Recommendations page loaded successfully');
});