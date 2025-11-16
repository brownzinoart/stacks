/**
 * Minimal "What's Next" Feature Test
 * Quick test to verify basic functionality
 */

import { test, expect } from '@playwright/test';

test.describe('What\'s Next Feature - Minimal Test', () => {
  test('Can navigate to discover page', async ({ page }) => {
    // Increase timeout for navigation
    test.setTimeout(60000);
    
    console.log('🔍 Navigating to /discover');
    await page.goto('/discover');
    
    // Wait for page to load but don't wait for network idle
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ Page DOM loaded');
    
    // Check if we're on the right page
    const url = page.url();
    expect(url).toContain('/discover');
    console.log(`✅ URL is correct: ${url}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/discover-page.png', fullPage: true });
    console.log('✅ Screenshot taken');
  });

  test('Check for AI prompt elements', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/discover');
    await page.waitForLoadState('domcontentloaded');
    
    // Look for any form or input elements
    const allInputs = await page.locator('input, textarea').count();
    console.log(`Found ${allInputs} input elements`);
    
    const allButtons = await page.locator('button').count();
    console.log(`Found ${allButtons} button elements`);
    
    // Look for the AI prompt component specifically
    const aiPromptComponent = page.locator('[class*="ai-prompt"]').or(page.locator('form')).or(page.locator('input[type="text"]'));
    const componentCount = await aiPromptComponent.count();
    console.log(`Found ${componentCount} AI prompt-related components`);
    
    // Log some text content to see what's on the page
    const bodyText = await page.locator('body').textContent();
    const hasWhatsNext = bodyText?.includes('WHAT\'S NEXT');
    console.log(`Page contains "WHAT'S NEXT": ${hasWhatsNext}`);
    
    if (hasWhatsNext) {
      console.log('✅ Found "WHAT\'S NEXT" text on page');
    } else {
      console.log('❌ "WHAT\'S NEXT" text not found');
      // Log first 500 chars of body text for debugging
      console.log('Body text preview:', bodyText?.substring(0, 500));
    }
  });
});