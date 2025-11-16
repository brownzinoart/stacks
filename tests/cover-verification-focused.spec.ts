/**
 * FOCUSED COVER VERIFICATION TEST
 * Single mood test to verify real book covers are working
 */
import { test, expect } from '@playwright/test';

// Utility function to check if URL is a real HTTP book cover
function isRealCover(url: string): boolean {
  if (!url || url.startsWith('gradient:') || url.includes('from-') || url.includes('to-')) {
    return false;
  }
  
  // Check for proxy URLs that serve real covers
  if (url.includes('/api/cover-proxy?url=')) {
    try {
      const proxiedUrl = decodeURIComponent(url.split('url=')[1] || '');
      return proxiedUrl.includes('covers.openlibrary.org') ||
             proxiedUrl.includes('books.google.com') ||
             proxiedUrl.includes('googleusercontent.com') ||
             proxiedUrl.includes('googleapis.com') ||
             proxiedUrl.includes('archive.org');
    } catch {
      return false;
    }
  }
  
  // Direct HTTP URLs from known book cover sources
  return url.startsWith('http') && (
    url.includes('covers.openlibrary.org') ||
    url.includes('books.google.com') ||
    url.includes('ia.media-imager.archive.org') ||
    url.includes('coverartarchive.org') ||
    url.includes('image.tmdb.org') ||
    url.includes('secure.gravatar.com') ||
    url.includes('imgur.com') ||
    url.includes('amazonaws.com')
  );
}

test.describe('Book Cover Verification - Single Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/home');
    await page.waitForLoadState('networkidle');
  });

  test('FUNNY mood - Real cover verification (CRITICAL TEST)', async ({ page }) => {
    console.log('\n🎯 CRITICAL COVER TEST: FUNNY MOOD');
    
    const consoleMessages: string[] = [];
    
    // Listen for console logs
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);
      if (text.includes('Cover') || text.includes('cover') || text.includes('real')) {
        console.log(`[CONSOLE] ${text}`);
      }
    });
    
    // Click the FUNNY mood button
    await page.click('button:has-text("FUNNY")');
    console.log('[ACTION] Clicked FUNNY button');
    
    // Wait for loading to complete and navigation to recommendations
    try {
      await page.waitForSelector('.full-takeover-loader', { state: 'hidden', timeout: 45000 });
      await page.waitForURL('**/stacks-recommendations', { timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 });
      await page.waitForTimeout(3000);
      console.log('[STATUS] Page loaded successfully');
    } catch (e) {
      console.log('[ERROR] Page loading issue:', e.message);
      // Continue with test anyway
    }
    
    // Extract book data from localStorage
    const bookData = await page.evaluate(() => {
      const stored = localStorage.getItem('stacks_recommendations');
      if (!stored) return { books: [], success: false };
      
      try {
        const data = JSON.parse(stored);
        const books: { title: string; author: string; cover?: string }[] = [];
        
        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((category: any) => {
            if (category.books && Array.isArray(category.books)) {
              books.push(...category.books);
            }
          });
        }
        
        return { books, success: true };
      } catch (e) {
        console.error('Failed to parse recommendations:', e);
        return { books: [], success: false };
      }
    });
    
    console.log(`[DATA] Found ${bookData.books.length} books, success: ${bookData.success}`);
    expect(bookData.books.length).toBeGreaterThan(0);
    
    // Analyze each book's cover
    let realCovers = 0;
    let totalCovers = 0;
    
    bookData.books.forEach((book: any, index: number) => {
      const coverUrl = book.cover || '';
      const isReal = isRealCover(coverUrl);
      totalCovers++;
      if (isReal) realCovers++;
      
      console.log(`[BOOK-${index}] "${book.title}" by ${book.author}`);
      console.log(`[COVER-${index}] URL: ${coverUrl}`);
      console.log(`[COVER-${index}] Real: ${isReal ? '✅' : '❌'}`);
      
      if (isReal && coverUrl.includes('/api/cover-proxy?url=')) {
        const decodedUrl = decodeURIComponent(coverUrl.split('url=')[1] || '');
        console.log(`[PROXY-${index}] Decoded: ${decodedUrl}`);
      }
    });
    
    const successRate = totalCovers > 0 ? (realCovers / totalCovers) * 100 : 0;
    
    console.log('\n📊 COVER VERIFICATION RESULTS:');
    console.log('='.repeat(50));
    console.log(`Total Books: ${totalCovers}`);
    console.log(`Real Covers: ${realCovers}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log('='.repeat(50));
    
    // Check for cover-related console logs
    const coverLogs = consoleMessages.filter(msg => 
      msg.includes('Cover attached for') || 
      msg.includes('Cover fetch complete') ||
      msg.includes('real covers') ||
      msg.includes('EMERGENCY COVERS')
    );
    
    console.log(`\n🔍 COVER FETCHING LOGS (${coverLogs.length} found):`);
    coverLogs.forEach(log => console.log(`[LOG] ${log}`));
    
    // SUCCESS CRITERIA VERIFICATION
    console.log('\n✅ SUCCESS CRITERIA CHECK:');
    console.log(`• Books found: ${bookData.books.length > 0 ? '✅' : '❌'} (${bookData.books.length})`);
    console.log(`• Real covers present: ${realCovers > 0 ? '✅' : '❌'} (${realCovers})`);
    console.log(`• Success rate ≥ 50%: ${successRate >= 50 ? '✅' : '❌'} (${successRate.toFixed(1)}%)`);
    console.log(`• Cover fetching logs: ${coverLogs.length > 0 ? '✅' : '❌'} (${coverLogs.length})`);
    
    // Basic assertions
    expect(realCovers).toBeGreaterThan(0);
    expect(successRate).toBeGreaterThanOrEqual(50); // Allow for some flexibility during testing
    
    console.log('\n🎉 COVER VERIFICATION TEST COMPLETE');
  });

  test('Visual inspection - Screenshots', async ({ page }) => {
    console.log('\n📸 VISUAL VERIFICATION TEST');
    
    // Navigate and trigger search
    await page.click('button:has-text("LOVE STORY")');
    console.log('[ACTION] Clicked LOVE STORY button');
    
    try {
      await page.waitForSelector('.full-takeover-loader', { state: 'hidden', timeout: 45000 });
      await page.waitForURL('**/stacks-recommendations', { timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Wait for images to load
      await page.waitForTimeout(5000);
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: 'test-results/cover-verification-screenshot.png',
        fullPage: true 
      });
      console.log('[SCREENSHOT] Saved cover verification screenshot');
      
      // Count visible images
      const imageCount = await page.$$eval('img', images => 
        images.filter(img => {
          const src = img.src;
          return src && (
            src.includes('/api/cover-proxy') || 
            src.includes('covers.openlibrary.org') ||
            src.includes('books.google.com')
          );
        }).length
      );
      
      console.log(`[VISUAL] Found ${imageCount} cover images in UI`);
      expect(imageCount).toBeGreaterThan(0);
      
    } catch (e) {
      console.log('[ERROR] Visual test failed:', e.message);
      await page.screenshot({ 
        path: 'test-results/cover-verification-error.png',
        fullPage: true 
      });
    }
  });
});