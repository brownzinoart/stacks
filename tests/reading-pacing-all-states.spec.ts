import { test, expect } from '@playwright/test';

test.describe('Reading Pacing - All 4 States', () => {
  test('should display all 4 pacing states', async ({ page }) => {
    await page.goto('/reading');
    await page.waitForLoadState('networkidle');

    // Get all status badges
    const badges = await page.locator('.card-brutal .inline-block').filter({
      hasText: /TRACK|BEHIND|AHEAD/
    }).allTextContents();

    console.log('Status badges found:', badges);

    // Verify we have 4 badges
    expect(badges).toHaveLength(4);

    // Verify each state type appears
    const hasAhead = badges.some(text => text.includes('AHEAD'));
    const hasOnTrack = badges.some(text => text.includes('ON TRACK'));
    const hasSlightlyBehind = badges.some(text => text.includes('SLIGHTLY BEHIND'));
    const hasBehind = badges.some(text =>
      text.includes('BEHIND') && !text.includes('SLIGHTLY')
    );

    expect(hasAhead).toBeTruthy();
    expect(hasOnTrack).toBeTruthy();
    expect(hasSlightlyBehind).toBeTruthy();
    expect(hasBehind).toBeTruthy();
  });

  test('should show correct badge colors for each state', async ({ page }) => {
    await page.goto('/reading');
    await page.waitForLoadState('networkidle');

    // The Atlas Six - AHEAD (green/emerald)
    const atlasCard = page.locator('.card-brutal').filter({
      hasText: 'The Atlas Six'
    });
    const atlasBadge = atlasCard.locator('.inline-block').first();
    await expect(atlasBadge).toHaveClass(/bg-emerald/);

    // It Ends With Us - BEHIND (amber)
    const itEndsCard = page.locator('.card-brutal').filter({
      hasText: 'It Ends With Us'
    });
    const itEndsBadge = itEndsCard.locator('.inline-block').first();
    await expect(itEndsBadge).toHaveClass(/bg-amber/);

    // Fourth Wing - SLIGHTLY BEHIND (yellow)
    const fourthCard = page.locator('.card-brutal').filter({
      hasText: 'Fourth Wing'
    });
    const fourthBadge = fourthCard.locator('.inline-block').first();
    await expect(fourthBadge).toHaveClass(/bg-yellow/);

    // ACOTAR - ON TRACK (sky blue)
    const acotarCard = page.locator('.card-brutal').filter({
      hasText: 'A Court of Thorns and Roses'
    });
    const acotarBadge = acotarCard.locator('.inline-block').first();
    await expect(acotarBadge).toHaveClass(/bg-sky/);
  });
});
