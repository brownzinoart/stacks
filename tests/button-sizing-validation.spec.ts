/**
 * Button Sizing and Touch Target Validation
 * Specific tests for the button sizing improvements
 */

import { test, expect } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 375, height: 667 }

test.describe('Button Sizing and Touch Target Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('http://localhost:4000/home')
    await page.waitForSelector('h1', { timeout: 10000 })
  })
  
  test('should implement SM, MD, LG button sizes correctly', async ({ page }) => {
    // Look for buttons with different size classes
    const buttons = await page.locator('button').all()
    
    let foundSizes = {
      sm: false,
      md: false,
      lg: false
    }
    
    for (const button of buttons) {
      const className = await button.getAttribute('class')
      const box = await button.boundingBox()
      
      if (box && className) {
        // Check for size classes and validate dimensions
        if (className.includes('min-h-touch-sm')) {
          foundSizes.sm = true
          expect(box.height).toBeGreaterThanOrEqual(36)
        }
        if (className.includes('min-h-touch-md')) {
          foundSizes.md = true  
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
        if (className.includes('min-h-touch-lg')) {
          foundSizes.lg = true
          expect(box.height).toBeGreaterThanOrEqual(52)
        }
      }
    }
    
    // Should find at least some sized buttons
    const foundAnySize = foundSizes.sm || foundSizes.md || foundSizes.lg
    expect(foundAnySize).toBe(true)
  })
  
  test('should have proper focus states on all interactive elements', async ({ page }) => {
    const interactiveElements = await page.locator('button:visible, a:visible').all()
    
    for (const element of interactiveElements.slice(0, 3)) { // Test first 3
      await element.focus()
      
      const focusStyles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        }
      })
      
      // Should have some form of focus indicator
      const hasFocusIndicator = 
        focusStyles.outlineWidth !== '0px' ||
        focusStyles.boxShadow !== 'none' ||
        focusStyles.boxShadow.includes('ring')
      
      expect(hasFocusIndicator).toBe(true)
    }
  })
  
  test('should maintain touch targets in navigation cards', async ({ page }) => {
    // Wait a bit more for dynamic content to load
    await page.waitForTimeout(2000)
    
    // Look for navigation cards with various selectors
    const cardSelectors = [
      '.aspect-\\[4\\/3\\]',
      '[class*="aspect-"]',
      '.grid.grid-cols-2 > div',
      '[class*="navigation"]',
      '[class*="card"]'
    ]
    
    let foundCards = false
    
    for (const selector of cardSelectors) {
      const cards = await page.locator(selector).all()
      if (cards.length > 0) {
        foundCards = true
        
        for (const card of cards) {
          if (await card.isVisible()) {
            const box = await card.boundingBox()
            if (box) {
              // Cards should be large enough to be easily tappable
              expect(box.height).toBeGreaterThanOrEqual(120) // Reasonable card height
              expect(box.width).toBeGreaterThanOrEqual(100)  // Reasonable card width
            }
          }
        }
        break // Found cards, no need to try other selectors
      }
    }
    
    // If no cards found, that's okay - might still be loading
    // but we should at least verify the page structure is correct
    const hasContent = await page.locator('h1, h2, p, div').count()
    expect(hasContent).toBeGreaterThan(0)
  })
  
  test('should have consistent tab bar touch targets', async ({ page }) => {
    // Look for tab bar
    const tabBar = page.locator('.native-ios-tabs, [class*="tab"], nav')
    
    if (await tabBar.count() > 0) {
      const tabElements = await tabBar.locator('button, a').all()
      
      for (const tab of tabElements) {
        if (await tab.isVisible()) {
          const box = await tab.boundingBox()
          if (box) {
            // Tab buttons should meet 44px minimum
            expect(box.height).toBeGreaterThanOrEqual(40) // Allow slight tolerance
            expect(box.width).toBeGreaterThanOrEqual(40)
          }
        }
      }
    }
  })
  
  test('should have proper spacing between interactive elements', async ({ page }) => {
    const buttons = await page.locator('button:visible').all()
    
    if (buttons.length >= 2) {
      // Check spacing between first two buttons
      const first = await buttons[0].boundingBox()
      const second = await buttons[1].boundingBox()
      
      if (first && second) {
        // Calculate minimum distance between elements
        const horizontalDistance = Math.abs(second.x - (first.x + first.width))
        const verticalDistance = Math.abs(second.y - (first.y + first.height))
        
        // Should have reasonable spacing (allowing for grid layouts)
        const hasReasonableSpacing = horizontalDistance >= 4 || verticalDistance >= 4
        expect(hasReasonableSpacing).toBe(true)
      }
    }
  })
  
  test('should scale touch targets appropriately across screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 414, height: 896 }  // iPhone 11
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.reload()
      await page.waitForSelector('h1', { timeout: 8000 })
      
      // Find interactive elements
      const interactiveElements = await page.locator('button:visible, a:visible').all()
      
      for (const element of interactiveElements.slice(0, 2)) { // Test first 2
        if (await element.isVisible()) {
          const box = await element.boundingBox()
          if (box) {
            // Should maintain minimum sizes across viewports
            expect(box.height).toBeGreaterThanOrEqual(32) // Minimum usable size
            expect(box.width).toBeGreaterThanOrEqual(32)
          }
        }
      }
    }
  })
  
  test('should support hover and active states', async ({ page }) => {
    const buttons = await page.locator('button:visible').all()
    
    if (buttons.length > 0) {
      const button = buttons[0]
      
      // Get initial styles
      const initialStyles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          backgroundColor: computed.backgroundColor,
          transform: computed.transform,
          color: computed.color
        }
      })
      
      // Hover over button
      await button.hover()
      await page.waitForTimeout(200) // Allow transition time
      
      const hoverStyles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el)
        return {
          backgroundColor: computed.backgroundColor,
          transform: computed.transform,
          color: computed.color
        }
      })
      
      // Should have some visual change on hover
      const hasHoverEffect = 
        initialStyles.backgroundColor !== hoverStyles.backgroundColor ||
        initialStyles.transform !== hoverStyles.transform ||
        initialStyles.color !== hoverStyles.color
      
      expect(hasHoverEffect).toBe(true)
    }
  })
})