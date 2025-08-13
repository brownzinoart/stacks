import { test, expect } from '@playwright/test';

const moodButtons = ['FUNNY', 'MIND-BLOWING', 'LOVE STORY', 'MAGICAL'];

for (const mood of moodButtons) {
  test(`${mood} mood button should navigate to recommendations`, async ({ page }) => {
    // Navigate to home page
    await page.goto('/home');
    await page.waitForSelector(`button:has-text("${mood}")`, { timeout: 10000 });
    
    console.log(`Clicking ${mood} mood button...`);
    
    // Click the mood button
    await page.click(`button:has-text("${mood}")`);
    
    // Wait for navigation to recommendations page
    await expect(page).toHaveURL('/stacks-recommendations', { timeout: 30000 });
    
    console.log(`✅ ${mood} successfully navigated to recommendations page`);
    
    // Verify recommendations page content is visible
    await expect(page.locator('h1:has-text("RECOMMENDATIONS")')).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ ${mood} recommendations page loaded successfully`);
  });
}