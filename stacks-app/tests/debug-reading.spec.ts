import { test } from '@playwright/test';

test('debug reading page', async ({ page }) => {
  await page.goto('http://localhost:3000/reading');
  await page.waitForLoadState('networkidle');

  // Get all book titles
  const titles = await page.locator('.font-black.text-lg').allTextContents();
  console.log('Book titles found:', titles);

  // Get all status badges
  const badges = await page.locator('.inline-block').filter({
    hasText: /TRACK|BEHIND|AHEAD/
  }).allTextContents();
  console.log('Status badges:', badges);

  // Count cards
  const cardCount = await page.locator('.card-brutal').count();
  console.log('Total cards found:', cardCount);
});
