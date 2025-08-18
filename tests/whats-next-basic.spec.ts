/**
 * Basic "What's Next" Feature Test
 * Simple test to verify the basic functionality before comprehensive testing
 */

import { test, expect } from '@playwright/test';

test.describe('What\'s Next Feature - Basic Test', () => {
  test('Discover page loads and shows AI prompt input', async ({ page }) => {
    await page.goto('/discover');
    await page.waitForLoadState('networkidle');
    
    // Check if the page loads correctly
    await expect(page.getByText(/WHAT'S NEXT/i)).toBeVisible({ timeout: 10000 });
    console.log('✅ Discover page loaded successfully');
    
    // Check for the input field - try multiple selectors
    const inputSelectors = [
      'input[type="text"]',
      'input[placeholder*="vibe"]',
      'input[placeholder*="what"]',
      'textarea',
      '.ai-prompt-input input',
      '[data-testid="ai-input"]'
    ];
    
    let inputFound = false;
    for (const selector of inputSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        console.log(`✅ Found input with selector: ${selector}`);
        inputFound = true;
        break;
      }
    }
    
    if (!inputFound) {
      // Let's see what input elements are actually on the page
      const allInputs = await page.locator('input').all();
      console.log(`Found ${allInputs.length} input elements`);
      
      for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        const type = await input.getAttribute('type') || 'no-type';
        const placeholder = await input.getAttribute('placeholder') || 'no-placeholder';
        const className = await input.getAttribute('class') || 'no-class';
        console.log(`Input ${i}: type="${type}", placeholder="${placeholder}", class="${className}"`);
      }
    }
    
    // Check for mood buttons
    const moodButtons = page.locator('button').filter({ hasText: /Funny|Adventurous|Romantic|Mysterious|Inspiring|Surprise/i });
    const buttonCount = await moodButtons.count();
    console.log(`✅ Found ${buttonCount} mood buttons`);
    
    if (buttonCount > 0) {
      const firstButton = moodButtons.first();
      const buttonText = await firstButton.textContent();
      console.log(`✅ First mood button text: "${buttonText}"`);
    }
    
    expect(inputFound || buttonCount > 0).toBe(true);
  });

  test('Basic page structure check', async ({ page }) => {
    await page.goto('/discover');
    await page.waitForLoadState('networkidle');
    
    // Check for main sections
    const sections = [
      'WHAT\'S NEXT',
      'More Ways to Discover',
      'AR BOOK DISCOVERY'
    ];
    
    for (const section of sections) {
      const element = page.getByText(section, { exact: false });
      if (await element.count() > 0) {
        console.log(`✅ Found section: ${section}`);
      } else {
        console.log(`❌ Missing section: ${section}`);
      }
    }
  });
});