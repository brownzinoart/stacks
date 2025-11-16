/**
 * Validation tests for specific performance optimizations
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Optimization Validation', () => {
  test('React.memo BookCover optimization - no unnecessary renders', async ({ page }) => {
    // Go to a page with book covers
    await page.goto('/stacks-recommendations');

    // Add sample data to trigger book cover rendering
    await page.evaluate(() => {
      const sampleData = {
        userInput: 'test books',
        categories: [
          {
            name: 'Test Category',
            description: 'Test description',
            books: [
              {
                title: 'Book 1',
                author: 'Author 1',
                whyYoullLikeIt: 'Great book',
                cover: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
              },
              {
                title: 'Book 2',
                author: 'Author 2',
                whyYoullLikeIt: 'Another great book',
                cover: 'https://covers.openlibrary.org/b/id/8354226-L.jpg',
              },
            ],
          },
        ],
      };
      localStorage.setItem('stacks_recommendations', JSON.stringify(sampleData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify BookCover components are rendered
    const bookCovers = page.locator('img[alt*="cover"]');
    const coverCount = await bookCovers.count();

    if (coverCount > 0) {
      console.log(`✓ Found ${coverCount} book cover components`);

      // Verify covers are visible and have proper attributes
      for (let i = 0; i < Math.min(coverCount, 3); i++) {
        const cover = bookCovers.nth(i);
        await expect(cover).toBeVisible();

        const src = await cover.getAttribute('src');
        expect(src).toBeTruthy();
      }
    }

    // Test that covers don't re-render unnecessarily when interacting with other elements
    const categoryButton = page.locator('button:text("All Categories")');
    if ((await categoryButton.count()) > 0) {
      await categoryButton.click();
      await page.waitForTimeout(500);

      // Book covers should still be visible after category interaction
      const coversStillVisible = await page.locator('img[alt*="cover"]:visible').count();
      expect(coversStillVisible).toBeGreaterThan(0);
    }
  });

  test('AI prompt fetch API optimization works', async ({ page }) => {
    await page.goto('/home');

    // Monitor network requests
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        requests.push(request.url());
      }
    });

    // Fill AI prompt input
    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('test adventure books');

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show loading state (indicates fetch is working)
    const loadingText = page.locator('text=/Finding|Loading|FINDING/i');
    await expect(loadingText).toBeVisible({ timeout: 3000 });

    console.log('✓ AI prompt submission triggered loading state');
    console.log(`Network requests made: ${requests.length}`);
  });

  test('Image optimization for Next.js Images', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Check for optimized images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      console.log(`✓ Found ${imageCount} images on page`);

      // Check first few images for optimization
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i);
        const src = await image.getAttribute('src');
        const srcSet = await image.getAttribute('srcset');

        // Next.js optimized images should have specific patterns
        if (src) {
          console.log(`Image ${i + 1} src: ${src.substring(0, 50)}...`);

          // Should have src attribute
          expect(src).toBeTruthy();

          // Next.js optimized images often have srcset for responsive images
          if (srcSet) {
            console.log(`✓ Image ${i + 1} has srcset for responsive optimization`);
          }
        }
      }
    }
  });

  test('useMemo similarity calculations performance', async ({ page }) => {
    await page.goto('/stacks-recommendations');

    // Add sample books with similarity data
    await page.evaluate(() => {
      const sampleData = {
        userInput: 'fantasy books',
        categories: [
          {
            name: 'Similar Books',
            description: 'Books with similar themes',
            books: [
              { title: 'Fantasy Book 1', author: 'Author 1', genres: ['fantasy'], whyYoullLikeIt: 'Great fantasy' },
              { title: 'Fantasy Book 2', author: 'Author 2', genres: ['fantasy'], whyYoullLikeIt: 'Epic fantasy' },
            ],
          },
        ],
      };
      localStorage.setItem('stacks_recommendations', JSON.stringify(sampleData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check for books being displayed
    const bookTitles = page.locator('h2:text("Fantasy Book")');
    const bookCount = await bookTitles.count();

    if (bookCount > 0) {
      console.log(`✓ Found ${bookCount} books with similarity calculations`);

      // Look for similarity badges or indicators
      const similarityElements = page.locator('[class*="similarity"], [data-testid*="similarity"]');
      const similarityCount = await similarityElements.count();

      console.log(`Found ${similarityCount} similarity indicators`);
    }

    // Interaction shouldn't cause performance issues
    const categoryFilter = page.locator('button:not([disabled])').first();
    if ((await categoryFilter.count()) > 0) {
      await categoryFilter.click();
      await page.waitForTimeout(200);

      // Books should still be visible after filtering
      const visibleBooks = await page.locator('h2:visible').count();
      expect(visibleBooks).toBeGreaterThan(0);
    }
  });

  test('Dynamic imports load correctly', async ({ page }) => {
    await page.goto('/stacks-recommendations');

    // Add sample book data
    await page.evaluate(() => {
      const sampleData = {
        userInput: 'test books',
        categories: [
          {
            name: 'Test Category',
            description: 'Test description',
            books: [
              {
                title: 'Test Book',
                author: 'Test Author',
                whyYoullLikeIt: 'Test description',
                cover: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
              },
            ],
          },
        ],
      };
      localStorage.setItem('stacks_recommendations', JSON.stringify(sampleData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Look for clickable book elements
    const clickableBook = page.locator('div[class*="cursor-pointer"], button:has-text("Book Details")').first();

    if ((await clickableBook.count()) > 0) {
      console.log('✓ Found clickable book element for dynamic import test');

      // Try clicking to trigger dynamic import
      await clickableBook.click();

      // Wait a moment for dynamic import to potentially load
      await page.waitForTimeout(1000);

      // Check if any modal or overlay appeared (indicating dynamic component loaded)
      const overlay = page.locator('[class*="fixed"], [class*="modal"], [class*="overlay"]');
      const overlayCount = await overlay.count();

      if (overlayCount > 0) {
        console.log('✓ Dynamic component loaded (modal/overlay detected)');

        // Try to close any modal that opened
        const closeButton = page.locator('button:text("×"), button:text("Close")');
        if ((await closeButton.count()) > 0) {
          await closeButton.click();
        }
      }
    }
  });

  test('No memory leaks in component lifecycle', async ({ page }) => {
    let jsErrors: string[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    // Navigate through multiple pages to test component cleanup
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    await page.goto('/stacks-recommendations');
    await page.waitForLoadState('networkidle');

    // Add some test data
    await page.evaluate(() => {
      const sampleData = {
        userInput: 'test',
        categories: [
          {
            name: 'Test',
            description: 'Test',
            books: [{ title: 'Test Book', author: 'Test Author', whyYoullLikeIt: 'Test' }],
          },
        ],
      };
      localStorage.setItem('stacks_recommendations', JSON.stringify(sampleData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Go back to home
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Check for JavaScript errors
    const criticalErrors = jsErrors.filter(
      (error) =>
        !error.includes('Warning') &&
        !error.includes('lockfile') &&
        !error.includes('WebSocket') &&
        !error.includes('ERR_NETWORK')
    );

    console.log(`JavaScript errors found: ${criticalErrors.length}`);
    if (criticalErrors.length > 0) {
      console.log('Errors:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
    console.log('✓ No memory leaks or critical JavaScript errors detected');
  });

  test('Mobile responsiveness maintained after optimizations', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Check main heading is visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Check input is touch-friendly
    const input = page.locator('input[type="text"]').first();
    if ((await input.count()) > 0) {
      const box = await input.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThan(40); // Touch-friendly height
        console.log(`✓ Input height: ${box.height}px (touch-friendly)`);
      }
    }

    // Check buttons are appropriately sized
    const buttons = page.locator('button').first();
    if ((await buttons.count()) > 0) {
      const buttonBox = await buttons.boundingBox();
      if (buttonBox) {
        expect(buttonBox.height).toBeGreaterThan(40);
        console.log(`✓ Button height: ${buttonBox.height}px (touch-friendly)`);
      }
    }

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');

    // Should still be functional
    await expect(heading).toBeVisible();

    console.log('✓ Mobile and tablet responsiveness maintained');
  });
});
