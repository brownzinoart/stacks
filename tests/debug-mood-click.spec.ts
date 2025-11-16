import { test } from '@playwright/test';

test('Debug mood button click', async ({ page }) => {
  // Enable console logging
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    } else if (msg.text().includes('[')) {
      console.log(`[BROWSER LOG] ${msg.text()}`);
    }
  });

  // Navigate to home page
  await page.goto('/home');
  await page.waitForSelector('button:has-text("FUNNY")', { timeout: 10000 });
  
  console.log('About to click FUNNY button');
  
  // Click the FUNNY mood button
  await page.click('button:has-text("FUNNY")');
  
  console.log('Clicked FUNNY button, waiting 30 seconds to see what happens...');
  
  // Wait for a long time to see what happens
  await page.waitForTimeout(30000);
  
  console.log('Current URL:', await page.url());
});