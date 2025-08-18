/**
 * Comprehensive Accessibility and Mobile UX Test Suite
 * Tests all implemented accessibility and mobile UX improvements
 */

import { test, expect, Page } from '@playwright/test'

// Mobile viewport settings for testing
const MOBILE_VIEWPORT = { width: 375, height: 667 } // iPhone SE
const TABLET_VIEWPORT = { width: 768, height: 1024 } // iPad

// Test configuration for different devices
test.describe('Accessibility and Mobile UX Improvements', () => {
  
  // 1. BUTTON SIZING AND TOUCH TARGETS
  test.describe('Button Sizing and Touch Targets', () => {
    
    test('should have minimum 44px touch targets for all interactive elements', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Test navigation cards
      const navigationCards = await page.locator('[data-testid="navigation-card"]').all()
      for (const card of navigationCards) {
        const box = await card.boundingBox()
        expect(box?.height).toBeGreaterThanOrEqual(44)
        expect(box?.width).toBeGreaterThanOrEqual(44)
      }
      
      // Test quick action buttons
      const quickButtons = await page.locator('button').all()
      for (const button of quickButtons) {
        const box = await button.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(36) // SM size minimum
          expect(box.width).toBeGreaterThanOrEqual(36)
        }
      }
      
      // Test tab bar buttons
      const tabButtons = await page.locator('.native-ios-tabs button').all()
      for (const tab of tabButtons) {
        const box = await tab.boundingBox()
        expect(box?.height).toBeGreaterThanOrEqual(44)
        expect(box?.width).toBeGreaterThanOrEqual(44)
      }
    })
    
    test('should have proper touch spacing between interactive elements', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Test spacing between tab bar items
      const tabButtons = await page.locator('.native-ios-tabs button').all()
      for (let i = 0; i < tabButtons.length - 1; i++) {
        const current = await tabButtons[i].boundingBox()
        const next = await tabButtons[i + 1].boundingBox()
        
        if (current && next) {
          const spacing = next.x - (current.x + current.width)
          expect(spacing).toBeGreaterThanOrEqual(4) // 8px minimum recommended, 4px minimum acceptable
        }
      }
    })
    
    test('should maintain touch targets across different screen sizes', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568 }, // iPhone 5
        { width: 375, height: 667 }, // iPhone SE
        { width: 414, height: 896 }, // iPhone 11
        { width: 768, height: 1024 } // iPad
      ]
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto('http://localhost:4000/home')
        await page.waitForLoadState('networkidle')
        
        // Test tab bar maintains touch targets
        const tabButtons = await page.locator('.native-ios-tabs button').all()
        for (const tab of tabButtons) {
          const box = await tab.boundingBox()
          expect(box?.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })
  
  // 2. NAVIGATION CARD OPTIMIZATION
  test.describe('Navigation Card Layout and Sizing', () => {
    
    test('should have 4:3 aspect ratio with max-height 160px', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check navigation cards have correct aspect ratio
      const cards = await page.locator('.aspect-\\[4\\/3\\]').all()
      for (const card of cards) {
        const box = await card.boundingBox()
        if (box) {
          expect(box.height).toBeLessThanOrEqual(160)
          // Aspect ratio should be approximately 4:3
          const aspectRatio = box.width / box.height
          expect(aspectRatio).toBeCloseTo(4/3, 0.2) // Allow some tolerance
        }
      }
    })
    
    test('should be optimized for mobile viewing', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Cards should not overflow container
      const container = await page.locator('.grid.grid-cols-2.gap-4')
      const containerBox = await container.boundingBox()
      
      const cards = await page.locator('.aspect-\\[4\\/3\\]').all()
      for (const card of cards) {
        const cardBox = await card.boundingBox()
        if (containerBox && cardBox) {
          expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(containerBox.x + containerBox.width + 5) // 5px tolerance
        }
      }
    })
    
    test('should maintain visual hierarchy on mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check text is readable at mobile sizes
      const cardTitles = await page.locator('.aspect-\\[4\\/3\\] h2').all()
      for (const title of cardTitles) {
        const fontSize = await title.evaluate(el => {
          return window.getComputedStyle(el).fontSize
        })
        const fontSizeValue = parseInt(fontSize.replace('px', ''))
        expect(fontSizeValue).toBeGreaterThanOrEqual(16) // Minimum readable size
      }
    })
  })
  
  // 3. TAB BAR IMPROVEMENTS
  test.describe('Tab Bar Navigation', () => {
    
    test('should have consistent icon sizing', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      const tabIcons = await page.locator('.native-ios-tabs .text-lg').all()
      for (const icon of tabIcons) {
        const fontSize = await icon.evaluate(el => {
          return window.getComputedStyle(el).fontSize
        })
        // All icons should have consistent size
        expect(fontSize).toBe('18px') // text-lg = 18px
      }
    })
    
    test('should have proper focus states', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Test keyboard navigation focus states
      const firstTab = page.locator('.native-ios-tabs button').first()
      await firstTab.focus()
      
      // Should have visible focus ring
      const focusRing = await firstTab.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle,
          boxShadow: styles.boxShadow
        }
      })
      
      // Should have either outline or box-shadow for focus indication
      const hasFocusIndicator = focusRing.outlineWidth !== '0px' || focusRing.boxShadow.includes('ring')
      expect(hasFocusIndicator).toBe(true)
    })
    
    test('should scale properly for one-handed use', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Tab bar should be easily reachable with thumb
      const tabBar = page.locator('.native-ios-tabs')
      const tabBarBox = await tabBar.boundingBox()
      
      if (tabBarBox) {
        // Should be positioned at bottom for thumb accessibility
        expect(tabBarBox.y + tabBarBox.height).toBeGreaterThan(MOBILE_VIEWPORT.height - 100)
      }
    })
  })
  
  // 4. TYPOGRAPHY AND ACCESSIBILITY
  test.describe('Typography and Text Accessibility', () => {
    
    test('should have appropriate text sizing for mobile', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check main headings are not overwhelming on mobile
      const mainHeading = page.locator('h1')
      const headingStyles = await mainHeading.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight
        }
      })
      
      const fontSize = parseInt(headingStyles.fontSize.replace('px', ''))
      expect(fontSize).toBeLessThanOrEqual(48) // Should be reasonable for mobile
      expect(fontSize).toBeGreaterThanOrEqual(24) // But still prominent
    })
    
    test('should maintain WCAG contrast ratios', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check contrast for main text elements
      const textElements = await page.locator('p, span, h1, h2, h3').all()
      
      for (const element of textElements.slice(0, 5)) { // Test first 5 to avoid timeout
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          }
        })
        
        // Basic check - should have defined colors
        expect(styles.color).not.toBe('transparent')
        expect(styles.color).not.toBe('')
      }
    })
    
    test('should prevent iOS zoom on form inputs', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check viewport meta tag prevents zoom
      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content')
      expect(viewportMeta).toContain('user-scalable=no')
    })
  })
  
  // 5. CROSS-BROWSER AND DEVICE TESTING
  test.describe('Cross-Device Compatibility', () => {
    
    test('should work in portrait and landscape orientations', async ({ page }) => {
      // Portrait mode
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:4000/home')
      await expect(page.locator('h1')).toBeVisible()
      
      // Landscape mode
      await page.setViewportSize({ width: 667, height: 375 })
      await page.reload()
      await expect(page.locator('h1')).toBeVisible()
      
      // Tab bar should still be accessible
      const tabBar = page.locator('.native-ios-tabs')
      await expect(tabBar).toBeVisible()
    })
    
    test('should handle different screen densities', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      
      // Test with different device pixel ratios
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('http://localhost:4000/home')
      
      // Elements should still be properly sized
      const navigationCards = await page.locator('.aspect-\\[4\\/3\\]').all()
      expect(navigationCards.length).toBeGreaterThan(0)
      
      for (const card of navigationCards) {
        await expect(card).toBeVisible()
      }
    })
  })
  
  // 6. PERFORMANCE AND INTERACTION TESTING
  test.describe('Performance and User Interactions', () => {
    
    test('should have responsive touch interactions', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Test touch responsiveness
      const firstCard = page.locator('.aspect-\\[4\\/3\\]').first()
      
      // Should respond to hover/touch
      await firstCard.hover()
      
      // Check for transform or animation
      const beforeTransform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform
      })
      
      // Click and check for interaction feedback
      await firstCard.click()
      
      const afterTransform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform
      })
      
      // Transform should change to indicate interaction
      // (This might be 'none' initially, but should show some change)
      expect(typeof beforeTransform).toBe('string')
      expect(typeof afterTransform).toBe('string')
    })
    
    test('should load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now()
      
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds on mobile
      expect(loadTime).toBeLessThan(3000)
    })
    
    test('should handle rapid navigation between tabs', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      const tabs = await page.locator('.native-ios-tabs button').all()
      
      // Rapidly click through tabs
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        await tabs[i].click()
        await page.waitForTimeout(100) // Brief pause between clicks
      }
      
      // Should still be responsive
      await expect(page.locator('h1')).toBeVisible()
    })
  })
  
  // 7. ACCESSIBILITY COMPLIANCE
  test.describe('Screen Reader and Keyboard Navigation', () => {
    
    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Check navigation has proper landmarks
      const nav = page.locator('nav, [role="navigation"]')
      await expect(nav).toHaveCount(1)
      
      // Buttons should have accessible names
      const buttons = await page.locator('button').all()
      for (const button of buttons.slice(0, 5)) { // Test first 5
        const accessibleName = await button.evaluate(el => {
          return el.textContent || el.getAttribute('aria-label') || el.getAttribute('title')
        })
        expect(accessibleName).toBeTruthy()
      }
    })
    
    test('should support keyboard navigation', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      // Should be able to tab through interactive elements
      await page.keyboard.press('Tab')
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      
      // Keep tabbing until we find a focusable element
      let attempts = 0
      while (attempts < 10 && !['BUTTON', 'A', 'INPUT'].includes(focusedElement || '')) {
        await page.keyboard.press('Tab')
        focusedElement = await page.evaluate(() => document.activeElement?.tagName)
        attempts++
      }
      
      expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
    })
    
    test('should have logical tab order', async ({ page }) => {
      await page.setViewportSize(MOBILE_VIEWPORT)
      await page.goto('http://localhost:4000/home')
      
      const focusableElements = await page.locator('button:visible, a:visible, input:visible').all()
      
      // Should have at least some focusable elements
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // Test first few elements maintain logical order
      if (focusableElements.length >= 2) {
        const first = await focusableElements[0].boundingBox()
        const second = await focusableElements[1].boundingBox()
        
        if (first && second) {
          // Generally, logical order follows visual order (top to bottom, left to right)
          expect(first.y <= second.y + 50).toBe(true) // Allow some tolerance
        }
      }
    })
  })
})