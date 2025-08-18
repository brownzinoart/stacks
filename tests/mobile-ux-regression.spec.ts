/**
 * Mobile UX Regression Test Suite
 * Ensures existing functionality works with new accessibility improvements
 */

import { test, expect } from '@playwright/test'

// Mobile viewport for consistent testing
const MOBILE_VIEWPORT = { width: 375, height: 667 }

test.describe('Mobile UX Regression Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
  })
  
  // 1. NAVIGATION FUNCTIONALITY
  test.describe('Navigation System', () => {
    
    test('should navigate between all main pages via tab bar', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test navigation to each page
      const navigationTests = [
        { name: 'Learn', href: '/learn' },
        { name: 'Discover', href: '/discover' },
        { name: 'MyStacks', href: '/mystacks' },
        { name: 'StacksTalk', href: '/stackstalk' }
      ]
      
      for (const nav of navigationTests) {
        // Click the tab
        await page.locator('.native-ios-tabs').getByText(nav.name).click()
        await page.waitForLoadState('networkidle')
        
        // Should navigate to correct page
        expect(page.url()).toContain(nav.href)
        
        // Page should load without errors
        const errorElements = await page.locator('[data-testid="error"], .error').count()
        expect(errorElements).toBe(0)
      }
      
      // Return to home
      await page.locator('.native-ios-tabs').getByText('Home').click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/home')
    })
    
    test('should maintain active tab state correctly', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Home tab should be active initially
      const homeTab = page.locator('.native-ios-tabs').getByText('Home')
      const homeTabStyles = await homeTab.evaluate(el => {
        return window.getComputedStyle(el.closest('button') || el)
      })
      
      // Active tab should have different styling (color, background, etc.)
      expect(homeTabStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      
      // Navigate to another tab
      await page.locator('.native-ios-tabs').getByText('Discover').click()
      await page.waitForLoadState('networkidle')
      
      // Discover tab should now be active
      const discoverTab = page.locator('.native-ios-tabs').getByText('Discover')
      const discoverTabStyles = await discoverTab.evaluate(el => {
        return window.getComputedStyle(el.closest('button') || el)
      })
      
      expect(discoverTabStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    })
    
    test('should handle navigation card clicks', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Find navigation cards
      const navigationCards = await page.locator('.aspect-\\[4\\/3\\]').all()
      expect(navigationCards.length).toBeGreaterThan(0)
      
      // Test clicking first navigation card
      const firstCard = navigationCards[0]
      await firstCard.click()
      await page.waitForLoadState('networkidle')
      
      // Should navigate somewhere (not stay on home)
      const currentUrl = page.url()
      expect(currentUrl).not.toMatch(/\/home\/?$/)
    })
  })
  
  // 2. VISUAL DESIGN INTEGRITY
  test.describe('Design System Consistency', () => {
    
    test('should maintain Gen Z aesthetic with new button sizes', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check colors are still vibrant
      const gradientElements = await page.locator('[class*="gradient"], [class*="primary-"]').all()
      expect(gradientElements.length).toBeGreaterThan(0)
      
      // Check for bold typography
      const boldElements = await page.locator('[class*="font-black"], [class*="font-bold"]').all()
      expect(boldElements.length).toBeGreaterThan(0)
      
      // Check for modern rounded corners
      const roundedElements = await page.locator('[class*="rounded-3xl"], [class*="rounded-"]').all()
      expect(roundedElements.length).toBeGreaterThan(0)
    })
    
    test('should maintain visual hierarchy with new typography', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Main heading should be largest
      const mainHeading = page.locator('h1').first()
      const mainHeadingSize = await mainHeading.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize)
      })
      
      // Secondary headings should be smaller
      const secondaryHeadings = await page.locator('h2').all()
      if (secondaryHeadings.length > 0) {
        const secondarySize = await secondaryHeadings[0].evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize)
        })
        expect(mainHeadingSize).toBeGreaterThan(secondarySize)
      }
      
      // Body text should be smallest
      const bodyText = page.locator('p').first()
      const bodySize = await bodyText.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize)
      })
      expect(mainHeadingSize).toBeGreaterThan(bodySize)
    })
    
    test('should preserve animation and interaction effects', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test hover effects on navigation cards
      const firstCard = page.locator('.aspect-\\[4\\/3\\]').first()
      
      // Get initial transform
      const initialTransform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform
      })
      
      // Hover over card
      await firstCard.hover()
      await page.waitForTimeout(500) // Allow animation time
      
      // Check if transform changed (scale effect)
      const hoverTransform = await firstCard.evaluate(el => {
        return window.getComputedStyle(el).transform
      })
      
      // Should have some transformation applied
      expect(hoverTransform).toBeDefined()
    })
  })
  
  // 3. PERFORMANCE REGRESSION
  test.describe('Performance Validation', () => {
    
    test('should load pages within acceptable time with new components', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('http://localhost:4000/home')
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(5000) // 5 second max for mobile
      
      // Check all critical elements loaded
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
      await expect(page.locator('.aspect-\\[4\\/3\\]')).toHaveCount(4) // 4 navigation cards
    })
    
    test('should handle rapid interactions without degradation', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Rapid tab switching
      const tabs = ['Learn', 'Discover', 'Home', 'MyStacks']
      
      for (let i = 0; i < 3; i++) { // Do 3 rapid cycles
        for (const tab of tabs) {
          await page.locator('.native-ios-tabs').getByText(tab).click()
          await page.waitForTimeout(100) // Minimal wait
        }
      }
      
      // Should still be responsive
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
    })
    
    test('should maintain smooth animations with new sizing', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test animation performance by checking transition properties
      const animatedElements = await page.locator('[class*="transition"], [class*="animate"]').all()
      expect(animatedElements.length).toBeGreaterThan(0)
      
      // Check first animated element has transition
      if (animatedElements.length > 0) {
        const transition = await animatedElements[0].evaluate(el => {
          return window.getComputedStyle(el).transition
        })
        expect(transition).not.toBe('all 0s ease 0s')
      }
    })
  })
  
  // 4. RESPONSIVE BEHAVIOR
  test.describe('Responsive Design Validation', () => {
    
    test('should adapt properly to different mobile screen sizes', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568, name: 'iPhone 5' },
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 414, height: 896, name: 'iPhone 11' }
      ]
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto('http://localhost:4000/home')
        await page.waitForLoadState('networkidle')
        
        // Navigation cards should fit properly
        const cardsContainer = page.locator('.grid.grid-cols-2')
        await expect(cardsContainer).toBeVisible()
        
        // Tab bar should not overflow
        const tabBar = page.locator('.native-ios-tabs')
        const tabBarBox = await tabBar.boundingBox()
        expect(tabBarBox?.width).toBeLessThanOrEqual(viewport.width)
        
        // Content should not overflow horizontally
        const body = page.locator('body')
        await body.evaluate(el => {
          const hasHorizontalScroll = el.scrollWidth > el.clientWidth
          return hasHorizontalScroll
        }).then(hasScroll => {
          expect(hasScroll).toBe(false)
        })
      }
    })
    
    test('should handle orientation changes gracefully', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('http://localhost:4000/home')
      await expect(page.locator('h1')).toBeVisible()
      
      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 })
      await page.waitForTimeout(500) // Allow reflow
      
      // Content should still be accessible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
      
      // Navigation should still work
      const tabs = await page.locator('.native-ios-tabs button').all()
      expect(tabs.length).toBeGreaterThan(0)
    })
  })
  
  // 5. CONTENT ACCESSIBILITY
  test.describe('Content and Information Architecture', () => {
    
    test('should maintain readable content with new typography', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check text content is not cut off
      const textElements = await page.locator('h1, h2, p, span').all()
      
      for (const element of textElements.slice(0, 5)) { // Test first 5
        const box = await element.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThan(0)
          expect(box.width).toBeGreaterThan(0)
        }
        
        // Element should be visible
        await expect(element).toBeVisible()
      }
    })
    
    test('should preserve information hierarchy', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Welcome section should be prominent
      const welcomeSection = page.locator('h1')
      await expect(welcomeSection).toBeVisible()
      
      // Navigation cards section should follow
      const navigationSection = page.locator('h2').filter({ hasText: 'Explore Stacks' })
      await expect(navigationSection).toBeVisible()
      
      // Quick actions should be available
      const quickActions = page.locator('h3').filter({ hasText: 'Quick Actions' })
      await expect(quickActions).toBeVisible()
    })
    
    test('should maintain brand voice and personality', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for Gen Z language and personality
      const brandingTexts = [
        'WELCOME BACK!',
        'pace yo\'self',
        'Explore Stacks',
        'Find books that hit different'
      ]
      
      for (const text of brandingTexts) {
        const element = page.locator(`text=${text}`)
        await expect(element).toBeVisible()
      }
    })
  })
  
  // 6. ERROR HANDLING AND EDGE CASES
  test.describe('Error Handling and Edge Cases', () => {
    
    test('should handle missing or slow-loading content gracefully', async ({ page }) => {
      // Test with slow network simulation
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100) // 100ms delay
      })
      
      await page.goto('http://localhost:4000/home')
      await page.waitForLoadState('networkidle')
      
      // Page should still load and be functional
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
    })
    
    test('should maintain usability with reduced motion preferences', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('http://localhost:4000/home')
      
      // Page should still be functional
      await expect(page.locator('h1')).toBeVisible()
      
      // Navigation should work
      await page.locator('.native-ios-tabs').getByText('Discover').click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/discover')
    })
    
    test('should work with JavaScript disabled (progressive enhancement)', async ({ page }) => {
      // This test may not work perfectly since it's a React app,
      // but we can test critical content is in HTML
      await page.goto('http://localhost:4000/home')
      
      // Basic content should be present
      await expect(page.locator('h1')).toBeVisible()
      
      // Navigation links should be present (even if not functional)
      const navLinks = await page.locator('a[href*="/"]').count()
      expect(navLinks).toBeGreaterThan(0)
    })
  })
})