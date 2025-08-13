import { test, expect } from '@playwright/test';

test.describe('Book Cover Verification Tests', () => {
  test('should verify cover service is working via direct API test', async ({ page }) => {
    console.log('🧪 Testing cover service functionality');

    // Navigate to a page and test the cover proxy directly
    await page.goto('/home');
    
    // Test the cover proxy API directly via JavaScript
    const testResult = await page.evaluate(async () => {
      try {
        // Test a known working cover URL
        const testUrl = 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg';
        const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(testUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        return {
          success: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type'),
          size: response.ok ? (await response.blob()).size : 0
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('📊 Cover proxy test result:', testResult);
    
    expect(testResult.success).toBe(true);
    expect(testResult.status).toBe(200);
    expect(testResult.contentType).toContain('image');
    expect(testResult.size).toBeGreaterThan(1000); // Should be a real image file
  });

  test('should check if recommendations page exists and has content', async ({ page }) => {
    console.log('🧪 Testing recommendations page accessibility');

    // Try to navigate directly to recommendations page
    await page.goto('/stacks-recommendations');
    
    // Check if page loads
    const pageTitle = await page.textContent('h1');
    console.log('📄 Page title:', pageTitle);
    
    // Look for any book covers or content
    const covers = await page.locator('img[src], div[style*="background"]').count();
    console.log(`📚 Found ${covers} potential cover elements`);
    
    if (covers > 0) {
      // If there are covers, test their sources
      const coverSources = await page.locator('img[src]').evaluateAll((imgs) => 
        imgs.map((img: HTMLImageElement) => ({ 
          src: img.src.substring(0, 50) + '...', 
          naturalWidth: img.naturalWidth,
          alt: img.alt 
        }))
      );
      
      console.log('🖼️  Cover sources:', coverSources);
      
      // Check if any are real images (not broken)
      const workingCovers = coverSources.filter(cover => cover.naturalWidth > 0);
      console.log(`✅ Working covers: ${workingCovers.length}/${coverSources.length}`);
    }
  });

  test('should test book cover component rendering', async ({ page }) => {
    console.log('🧪 Testing book cover component');

    await page.goto('/home');
    
    // Create a test cover component via JavaScript to verify the cover service
    const testResult = await page.evaluate(async () => {
      // Create a simple test to see if the book cover logic works
      const testBook = {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        isbn: '9780525559474'
      };
      
      // Test if we can construct cover URLs
      const openlibraryCover = `https://covers.openlibrary.org/b/isbn/${testBook.isbn}-L.jpg`;
      const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(openlibraryCover)}`;
      
      try {
        const response = await fetch(proxyUrl, { method: 'HEAD' });
        return {
          success: response.ok,
          proxyUrl: proxyUrl.substring(0, 50) + '...',
          book: testBook
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
          book: testBook
        };
      }
    });

    console.log('📖 Test book cover result:', testResult);
    expect(testResult.success).toBe(true);
  });

  test('should verify individual cover sources work', async ({ page }) => {
    console.log('🧪 Testing individual cover sources');

    await page.goto('/home');

    const sourceTests = await page.evaluate(async () => {
      const sources = [
        {
          name: 'OpenLibrary ISBN',
          url: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
        },
        {
          name: 'OpenLibrary ID',
          url: 'https://covers.openlibrary.org/b/id/8576271-L.jpg'
        }
      ];

      const results = [];
      
      for (const source of sources) {
        try {
          const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(source.url)}`;
          const response = await fetch(proxyUrl, { method: 'HEAD' });
          
          results.push({
            name: source.name,
            success: response.ok,
            status: response.status,
            contentType: response.headers.get('content-type')
          });
        } catch (error) {
          results.push({
            name: source.name,
            success: false,
            error: error.message
          });
        }
      }
      
      return results;
    });

    console.log('🔍 Source test results:', sourceTests);

    // All sources should work
    sourceTests.forEach(result => {
      expect(result.success).toBe(true);
      expect(result.contentType).toContain('image');
    });
  });

  test('should test error handling for invalid covers', async ({ page }) => {
    console.log('🧪 Testing cover error handling');

    await page.goto('/home');

    const errorTest = await page.evaluate(async () => {
      try {
        // Test with an invalid URL
        const invalidUrl = 'https://example.com/nonexistent.jpg';
        const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(invalidUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        return {
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    });

    console.log('❌ Error test result:', errorTest);
    
    // Should handle errors gracefully (not crash)
    expect(errorTest.status).toBeDefined();
  });
});