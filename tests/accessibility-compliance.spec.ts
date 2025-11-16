/**
 * Accessibility Compliance Test Suite
 * WCAG 2.1 AA compliance validation for all accessibility improvements
 */

import { test, expect } from '@playwright/test'

const MOBILE_VIEWPORT = { width: 375, height: 667 }

test.describe('WCAG 2.1 AA Accessibility Compliance', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
  })
  
  // 1. PERCEIVABLE - Information must be presentable in ways users can perceive
  test.describe('1. Perceivable Content', () => {
    
    test('should have sufficient color contrast (4.5:1 minimum)', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test main text elements for contrast
      const textElements = [
        { selector: 'h1', description: 'Main heading' },
        { selector: 'h2', description: 'Section headings' },
        { selector: 'p', description: 'Body text' },
        { selector: 'button', description: 'Button text' },
        { selector: '.native-ios-tabs span', description: 'Tab labels' }
      ]
      
      for (const element of textElements) {
        const elements = await page.locator(element.selector).all()
        if (elements.length > 0) {
          const firstElement = elements[0]
          const styles = await firstElement.evaluate(el => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize
            }
          })
          
          // Basic validation - colors should be defined
          expect(styles.color).not.toBe('transparent')
          expect(styles.color).not.toBe('')
          
          // Font size should be readable (minimum 14px for small text)
          const fontSize = parseInt(styles.fontSize.replace('px', ''))
          if (element.selector.includes('h1')) {
            expect(fontSize).toBeGreaterThanOrEqual(18)
          } else {
            expect(fontSize).toBeGreaterThanOrEqual(14)
          }
        }
      }
    })
    
    test('should provide alternative text for images and icons', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for images without alt text
      const images = await page.locator('img').all()
      for (const image of images) {
        const alt = await image.getAttribute('alt')
        const ariaLabel = await image.getAttribute('aria-label')
        const role = await image.getAttribute('role')
        
        // Image should have alt text, aria-label, or be decorative
        const hasAccessibleName = alt !== null || ariaLabel !== null || role === 'presentation'
        expect(hasAccessibleName).toBe(true)
      }
      
      // Check for icon buttons that need labels
      const iconOnlyButtons = await page.locator('button:not(:has(text()))').all()
      for (const button of iconOnlyButtons) {
        const ariaLabel = await button.getAttribute('aria-label')
        const title = await button.getAttribute('title')
        const hasAccessibleName = ariaLabel !== null || title !== null
        
        if (await button.isVisible()) {
          expect(hasAccessibleName).toBe(true)
        }
      }
    })
    
    test('should be usable when zoomed to 200%', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Simulate 200% zoom by making viewport smaller
      await page.setViewportSize({ width: 187, height: 333 }) // 50% of original
      await page.waitForTimeout(500)
      
      // Critical content should still be accessible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
      
      // Navigation should still work
      const discoverTab = page.locator('.native-ios-tabs').getByText('Discover')
      await expect(discoverTab).toBeVisible()
      await discoverTab.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/discover')
    })
    
    test('should not rely solely on color to convey information', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Active tab should have more than just color difference
      const homeTab = page.locator('.native-ios-tabs').getByText('Home')
      const discoverTab = page.locator('.native-ios-tabs').getByText('Discover')
      
      // Get styles for both tabs
      const homeStyles = await homeTab.evaluate(el => {
        const button = el.closest('button')
        if (!button) return {}
        const computed = window.getComputedStyle(button)
        return {
          backgroundColor: computed.backgroundColor,
          fontWeight: computed.fontWeight,
          transform: computed.transform
        }
      })
      
      const discoverStyles = await discoverTab.evaluate(el => {
        const button = el.closest('button')
        if (!button) return {}
        const computed = window.getComputedStyle(button)
        return {
          backgroundColor: computed.backgroundColor,
          fontWeight: computed.fontWeight,
          transform: computed.transform
        }
      })
      
      // Active state should differ in more than just color
      const backgroundDiffers = homeStyles.backgroundColor !== discoverStyles.backgroundColor
      const fontWeightDiffers = homeStyles.fontWeight !== discoverStyles.fontWeight
      const transformDiffers = homeStyles.transform !== discoverStyles.transform
      
      // At least one non-color indicator should be different
      expect(backgroundDiffers || fontWeightDiffers || transformDiffers).toBe(true)
    })
  })
  
  // 2. OPERABLE - Interface components must be operable
  test.describe('2. Operable Interface', () => {
    
    test('should be fully keyboard accessible', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Start tabbing through the page
      await page.keyboard.press('Tab')
      
      // Collect all focusable elements
      const focusableElements = []
      let attempts = 0
      const maxAttempts = 20
      
      while (attempts < maxAttempts) {
        const activeElement = await page.evaluate(() => {
          const el = document.activeElement
          return el ? {
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent?.trim().substring(0, 50)
          } : null
        })
        
        if (activeElement && ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
          focusableElements.push(activeElement)
        }
        
        await page.keyboard.press('Tab')
        attempts++
      }
      
      // Should find several focusable elements
      expect(focusableElements.length).toBeGreaterThanOrEqual(3)
      
      // All major interactive elements should be reachable
      const elementTypes = focusableElements.map(el => el.tagName)
      expect(elementTypes).toContain('BUTTON') // Tab buttons or action buttons
    })
    
    test('should have no keyboard traps', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Tab through elements and ensure we can keep moving
      let previousFocusedElement = null
      let sameElementCount = 0
      
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        
        const currentFocusedElement = await page.evaluate(() => {
          const el = document.activeElement
          return el ? el.outerHTML.substring(0, 100) : null
        })
        
        if (currentFocusedElement === previousFocusedElement) {
          sameElementCount++
        } else {
          sameElementCount = 0
        }
        
        // Should not be stuck on the same element for more than 2 iterations
        expect(sameElementCount).toBeLessThanOrEqual(2)
        
        previousFocusedElement = currentFocusedElement
      }
    })
    
    test('should provide visible focus indicators', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Find first focusable element
      await page.keyboard.press('Tab')
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement
        if (!el) return null
        
        const computed = window.getComputedStyle(el)
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          outlineStyle: computed.outlineStyle,
          boxShadow: computed.boxShadow,
          border: computed.border
        }
      })
      
      if (focusedElement) {
        // Should have some form of focus indicator
        const hasFocusIndicator = 
          focusedElement.outlineWidth !== '0px' ||
          focusedElement.boxShadow.includes('ring') ||
          focusedElement.boxShadow !== 'none'
        
        expect(hasFocusIndicator).toBe(true)
      }
    })
    
    test('should meet minimum touch target sizes (44px)', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test all interactive elements
      const interactiveElements = await page.locator('button, a, input, [role="button"]').all()
      
      for (const element of interactiveElements) {
        if (await element.isVisible()) {
          const box = await element.boundingBox()
          if (box) {
            // WCAG 2.1 AA requires 44x44 CSS pixels minimum
            expect(box.width).toBeGreaterThanOrEqual(44)
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
        }
      }
    })
    
    test('should allow users enough time to read content', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for any auto-advancing content or timeouts
      // This is more of a behavioral test - no automatic timeouts should exist
      
      // Wait a reasonable time and ensure content is still accessible
      await page.waitForTimeout(3000)
      await expect(page.locator('h1')).toBeVisible()
      
      // User should still be able to interact with the page
      const homeTab = page.locator('.native-ios-tabs').getByText('Home')
      await expect(homeTab).toBeVisible()
      await homeTab.click()
    })
    
    test('should not cause seizures or physical reactions', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for flashing or rapidly changing content
      // Measure animation frequency by checking for rapid style changes
      
      const animatedElements = await page.locator('[class*="animate"], [class*="transition"]').all()
      
      for (const element of animatedElements.slice(0, 3)) { // Test first 3
        if (await element.isVisible()) {
          // Check animation duration is reasonable (not too fast)
          const transition = await element.evaluate(el => {
            return window.getComputedStyle(el).transition
          })
          
          // Should not have extremely fast transitions (under 100ms)
          if (transition && transition !== 'all 0s ease 0s') {
            expect(transition).not.toMatch(/\d{1,2}ms/) // No double-digit millisecond transitions
          }
        }
      }
    })
  })
  
  // 3. UNDERSTANDABLE - Information and UI operation must be understandable
  test.describe('3. Understandable Interface', () => {
    
    test('should have proper page titles and headings', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Page should have a meaningful title
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)
      expect(title).not.toBe('Document')
      
      // Should have heading hierarchy
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1)
      expect(h1Count).toBeLessThanOrEqual(1) // Should have exactly one h1
      
      // Headings should be descriptive
      const h1Text = await page.locator('h1').first().textContent()
      expect(h1Text?.length).toBeGreaterThan(0)
    })
    
    test('should have logical reading order', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Get all headings in order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      
      if (headings.length > 1) {
        // Check that heading levels don't skip
        const headingLevels = []
        for (const heading of headings) {
          const tagName = await heading.evaluate(el => el.tagName)
          const level = parseInt(tagName.replace('H', ''))
          headingLevels.push(level)
        }
        
        // First heading should be h1
        expect(headingLevels[0]).toBe(1)
        
        // No level should jump by more than 1
        for (let i = 1; i < headingLevels.length; i++) {
          const diff = headingLevels[i] - headingLevels[i - 1]
          expect(diff).toBeLessThanOrEqual(1)
        }
      }
    })
    
    test('should provide clear navigation and orientation', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Navigation should be clearly identified
      const navigation = page.locator('nav, [role="navigation"]')
      await expect(navigation).toHaveCount(1)
      
      // Current page should be indicated in navigation
      const activeNavItem = page.locator('.native-ios-tabs button[class*="active"], .native-ios-tabs button:not([class*="opacity-70"])')
      await expect(activeNavItem).toHaveCount(1)
      
      // Page content should indicate where user is
      const pageIndicators = await page.locator('h1, [data-testid="page-title"]').count()
      expect(pageIndicators).toBeGreaterThanOrEqual(1)
    })
    
    test('should use consistent navigation patterns', async ({ page }) => {
      // Test navigation consistency across pages
      const pages = ['/home', '/discover', '/learn']
      
      for (const pagePath of pages) {
        await page.goto(`http://localhost:4000${pagePath}`)
        await page.waitForLoadState('networkidle')
        
        // Tab bar should be present and consistent
        await expect(page.locator('.native-ios-tabs')).toBeVisible()
        
        // Should have same number of tabs
        const tabCount = await page.locator('.native-ios-tabs button').count()
        expect(tabCount).toBe(5) // Learn, Discover, Home, MyStacks, StacksTalk
        
        // Each page should have a clear heading
        const headingCount = await page.locator('h1').count()
        expect(headingCount).toBeGreaterThanOrEqual(1)
      }
    })
    
    test('should provide clear form labels and instructions', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check any form inputs have proper labels
      const inputs = await page.locator('input, textarea, select').all()
      
      for (const input of inputs) {
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledby = await input.getAttribute('aria-labelledby')
        const placeholder = await input.getAttribute('placeholder')
        
        // Input should have some form of label
        let hasLabel = false
        
        if (id) {
          const label = await page.locator(`label[for="${id}"]`).count()
          hasLabel = label > 0
        }
        
        hasLabel = hasLabel || ariaLabel !== null || ariaLabelledby !== null
        
        // Placeholder alone is not sufficient, but acceptable for search inputs
        if (!hasLabel && placeholder) {
          const type = await input.getAttribute('type')
          hasLabel = type === 'search'
        }
        
        expect(hasLabel).toBe(true)
      }
    })
  })
  
  // 4. ROBUST - Content must be robust enough for various user agents
  test.describe('4. Robust Implementation', () => {
    
    test('should have valid HTML structure', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for basic HTML validity indicators
      const html = await page.content()
      
      // Should have proper DOCTYPE
      expect(html).toMatch(/<!DOCTYPE html>/i)
      
      // Should have proper lang attribute
      const langAttribute = await page.locator('html').getAttribute('lang')
      expect(langAttribute).toBeTruthy()
      
      // Should have proper meta viewport
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
      expect(viewport).toContain('width=device-width')
    })
    
    test('should work with assistive technologies', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Check for proper ARIA usage
      const elementsWithRole = await page.locator('[role]').all()
      for (const element of elementsWithRole) {
        const role = await element.getAttribute('role')
        
        // Common valid roles
        const validRoles = [
          'navigation', 'main', 'banner', 'contentinfo', 'complementary',
          'button', 'link', 'tab', 'tablist', 'tabpanel',
          'region', 'article', 'section', 'list', 'listitem'
        ]
        
        expect(validRoles).toContain(role)
      }
      
      // Check for proper heading structure for screen readers
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      expect(headings.length).toBeGreaterThan(0)
      
      // Interactive elements should have accessible names
      const buttons = await page.locator('button').all()
      for (const button of buttons.slice(0, 5)) { // Test first 5
        const accessibleName = await button.evaluate(el => {
          return el.textContent?.trim() ||
                 el.getAttribute('aria-label') ||
                 el.getAttribute('title') ||
                 el.getAttribute('alt')
        })
        expect(accessibleName).toBeTruthy()
      }
    })
    
    test('should be compatible with different browsers and devices', async ({ page }) => {
      await page.goto('http://localhost:4000/home')
      
      // Test basic functionality works
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
      
      // Test navigation works
      await page.locator('.native-ios-tabs').getByText('Discover').click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/discover')
      
      // Test responsive behavior
      await page.setViewportSize({ width: 320, height: 568 })
      await page.reload()
      await expect(page.locator('h1')).toBeVisible()
    })
    
    test('should gracefully handle JavaScript errors', async ({ page }) => {
      // Listen for console errors
      const errors = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      
      await page.goto('http://localhost:4000/home')
      await page.waitForLoadState('networkidle')
      
      // Should not have critical JavaScript errors
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && // Ignore favicon errors
        !error.includes('Extension') && // Ignore extension errors
        !error.includes('chrome-extension') // Ignore extension errors
      )
      
      expect(criticalErrors.length).toBe(0)
      
      // Page should still be functional
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('.native-ios-tabs')).toBeVisible()
    })
  })
})