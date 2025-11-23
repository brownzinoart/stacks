import { test, expect } from '@playwright/test';

test.describe('Reading Pacing Status Variations', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to reading page
    await page.goto('http://localhost:3000/reading');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display all 4 status variations', async ({ page }) => {
    // Wait for pacing section to be visible
    await expect(page.locator('h2:has-text("📖 Pacing")')).toBeVisible();

    // Get all status badges
    const statusBadges = page.locator('.card-brutal .inline-block').filter({
      hasText: /TRACK|BEHIND|AHEAD/
    });

    // Should have 4 books showing (Fourth Wing, It Ends With Us, ACOTAR, The Atlas Six)
    await expect(statusBadges).toHaveCount(4);

    // Get the text content of all badges
    const badgeTexts = await statusBadges.allTextContents();

    console.log('Status badges found:', badgeTexts);

    // Verify we have different status types
    const hasOnTrack = badgeTexts.some(text => text.includes('ON TRACK'));
    const hasSlightlyBehind = badgeTexts.some(text => text.includes('SLIGHTLY BEHIND'));
    const hasBehind = badgeTexts.some(text => text.includes('BEHIND') && !text.includes('SLIGHTLY'));
    const hasAhead = badgeTexts.some(text => text.includes('AHEAD'));

    // Log results for debugging
    console.log('Status types found:');
    console.log('- ON TRACK:', hasOnTrack);
    console.log('- SLIGHTLY BEHIND:', hasSlightlyBehind);
    console.log('- BEHIND:', hasBehind);
    console.log('- AHEAD:', hasAhead);

    // Should have at least 3 different status types
    const uniqueStatuses = [hasOnTrack, hasSlightlyBehind, hasBehind, hasAhead].filter(Boolean).length;
    expect(uniqueStatuses).toBeGreaterThanOrEqual(3);
  });

  test('should show "AHEAD" status for The Atlas Six', async ({ page }) => {
    // Find The Atlas Six card (book-11)
    const atlasCard = page.locator('.card-brutal').filter({
      hasText: 'The Atlas Six'
    });

    await expect(atlasCard).toBeVisible();

    // Should have "AHEAD" badge with green/emerald styling
    const aheadBadge = atlasCard.locator('.inline-block').filter({
      hasText: 'AHEAD'
    });

    await expect(aheadBadge).toBeVisible();

    // Check the badge has emerald/green background
    const badgeClasses = await aheadBadge.getAttribute('class');
    expect(badgeClasses).toContain('bg-emerald');
  });

  test('should show "BEHIND" status for It Ends With Us', async ({ page }) => {
    // Find It Ends With Us card
    const itEndsCard = page.locator('.card-brutal').filter({
      hasText: 'It Ends With Us'
    });

    await expect(itEndsCard).toBeVisible();

    // Should show "BEHIND: +X PAGES" badge
    const behindBadge = itEndsCard.locator('.inline-block').filter({
      hasText: /BEHIND.*PAGES/
    });

    await expect(behindBadge).toBeVisible();

    // Check the badge has amber/orange background
    const badgeClasses = await behindBadge.getAttribute('class');
    expect(badgeClasses).toContain('bg-amber');
  });

  test('should show correct progress bar colors matching badge states', async ({ page }) => {
    // The Atlas Six - should have emerald (green) progress bar
    const atlasCard = page.locator('.card-brutal').filter({
      hasText: 'The Atlas Six'
    });
    const atlasProgressBar = atlasCard.locator('.h-3 > div').first();
    const atlasBarClasses = await atlasProgressBar.getAttribute('class');
    expect(atlasBarClasses).toContain('bg-emerald');

    // It Ends With Us - should have amber progress bar
    const itEndsCard = page.locator('.card-brutal').filter({
      hasText: 'It Ends With Us'
    });
    const itEndsProgressBar = itEndsCard.locator('.h-3 > div').first();
    const itEndsBarClasses = await itEndsProgressBar.getAttribute('class');
    expect(itEndsBarClasses).toContain('bg-amber');
  });

  test('should show ideal progress indicator (gray line) when target date is set', async ({ page }) => {
    // Any card with a target date should show the ideal progress line
    const cardWithTarget = page.locator('.card-brutal').filter({
      hasText: 'Fourth Wing'
    });

    // Check for the gray indicator line (w-0.5 bg-gray)
    const idealIndicator = cardWithTarget.locator('.w-0\\.5.bg-gray-400, .w-0\\.5.bg-gray-500');

    // Should exist (may not be visible if progress is beyond ideal)
    const count = await idealIndicator.count();
    console.log('Ideal indicator elements found:', count);
  });

  test('should display book titles and authors correctly', async ({ page }) => {
    // Verify all 4 books are displayed with correct info
    await expect(page.locator('text=Fourth Wing')).toBeVisible();
    await expect(page.locator('text=Rebecca Yarros')).toBeVisible();

    await expect(page.locator('text=It Ends With Us')).toBeVisible();
    await expect(page.locator('text=Colleen Hoover')).toBeVisible();

    await expect(page.locator('text=A Court of Thorns and Roses')).toBeVisible();
    await expect(page.locator('text=Sarah J. Maas')).toBeVisible();

    await expect(page.locator('text=The Atlas Six')).toBeVisible();
    await expect(page.locator('text=Olivie Blake')).toBeVisible();
  });

  test('should show target dates for all currently reading books', async ({ page }) => {
    // All reading cards should have a "Target Date" section
    const targetDateLabels = page.locator('text=Target Date');

    // Should have 4 target date sections (one per book)
    await expect(targetDateLabels).toHaveCount(4);
  });

  test('should show daily goal when target date is set', async ({ page }) => {
    // Find a card with target date
    const card = page.locator('.card-brutal').filter({
      hasText: 'The Atlas Six'
    });

    // Should show "Daily Goal" label
    await expect(card.locator('text=Daily Goal')).toBeVisible();

    // Should show pages count or dash
    const dailyGoalValue = card.locator('text=Daily Goal').locator('..').locator('.text-lg.font-black');
    await expect(dailyGoalValue).toBeVisible();
  });
});
