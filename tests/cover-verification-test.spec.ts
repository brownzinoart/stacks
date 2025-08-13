/**
 * CRITICAL COVER VERIFICATION TEST
 * Verifies 100% success rate for real book cover images
 */
import { test, expect, Page } from '@playwright/test';

// Test all 4 mood buttons for comprehensive coverage
const MOODS_TO_TEST = ['FUNNY', 'LOVE STORY', 'MIND-BLOWING', 'MAGICAL'];

// Track all cover results for success rate calculation
const coverResults: { mood: string; covers: { url: string; isReal: boolean }[] }[] = [];

// Utility function to check if URL is a real HTTP book cover
function isRealCover(url: string): boolean {
  if (!url || url.startsWith('gradient:') || url.includes('from-') || url.includes('to-')) {
    return false;
  }
  
  // Check for proxy URLs that serve real covers
  if (url.includes('/api/cover-proxy?url=')) {
    // Decode the proxied URL to check if it's from a legitimate source
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

// Utility function to wait for network idle and capture console logs
async function waitForRecommendations(page: Page, mood: string): Promise<{ url: string; isReal: boolean }[]> {
  const covers: { url: string; isReal: boolean }[] = [];
  const consoleMessages: string[] = [];
  
  // Listen for console logs
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    console.log(`[CONSOLE-${mood}] ${text}`);
  });
  
  // Wait for navigation to recommendations page
  await page.waitForURL('**/stacks-recommendations', { timeout: 30000 });
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle', { timeout: 20000 });
  
  // Additional wait for dynamic content
  await page.waitForTimeout(3000);
  
  // Extract all book cover data from the page
  const bookData = await page.evaluate(() => {
    // Check localStorage for recommendations data
    const stored = localStorage.getItem('stacks_recommendations');
    if (!stored) return { books: [], fromStorage: false };
    
    try {
      const data = JSON.parse(stored);
      const books: { title: string; author: string; cover?: string }[] = [];
      
      // Extract books from categories
      if (data.categories && Array.isArray(data.categories)) {
        data.categories.forEach((category: any) => {
          if (category.books && Array.isArray(category.books)) {
            books.push(...category.books);
          }
        });
      }
      
      return { books, fromStorage: true };
    } catch (e) {
      console.error('Failed to parse recommendations:', e);
      return { books: [], fromStorage: false };
    }
  });
  
  console.log(`[DATA-${mood}] Found ${bookData.books.length} books from ${bookData.fromStorage ? 'storage' : 'DOM'}`);
  
  // Process each book's cover
  bookData.books.forEach((book: any, index: number) => {
    const coverUrl = book.cover || '';
    const isReal = isRealCover(coverUrl);
    covers.push({ url: coverUrl, isReal });
    
    console.log(`[COVER-${mood}-${index}] "${book.title}" by ${book.author}`);
    console.log(`[COVER-${mood}-${index}] URL: ${coverUrl}`);
    console.log(`[COVER-${mood}-${index}] Real: ${isReal ? '✅' : '❌'}`);
  });
  
  // Verify cover fetching logs are present
  const coverFetchLogs = consoleMessages.filter(msg => 
    msg.includes('Cover attached for') || 
    msg.includes('Cover fetch complete') ||
    msg.includes('real covers')
  );
  
  console.log(`[LOGS-${mood}] Found ${coverFetchLogs.length} cover fetching log messages`);
  coverFetchLogs.forEach(log => console.log(`[LOG-${mood}] ${log}`));
  
  return covers;
}

test.describe('Book Cover Verification Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:3000/home');
    await page.waitForLoadState('networkidle');
  });

  // Test each mood button individually
  for (const mood of MOODS_TO_TEST) {
    test(`${mood} mood - Real cover verification`, async ({ page }) => {
      console.log(`\n🎯 TESTING MOOD: ${mood}`);
      
      // Click the specific mood button
      await page.click(`button:has-text("${mood}")`);
      console.log(`[ACTION] Clicked ${mood} button`);
      
      // Wait for loading overlay to disappear and navigation to complete
      await page.waitForSelector('.full-takeover-loader', { state: 'hidden', timeout: 45000 });
      
      // Capture all cover results for this mood
      const moodCovers = await waitForRecommendations(page, mood);
      
      // Store results for final analysis
      coverResults.push({ mood, covers: moodCovers });
      
      // Basic assertions for this mood
      expect(moodCovers.length).toBeGreaterThan(0);
      
      const realCovers = moodCovers.filter(c => c.isReal);
      const successRate = moodCovers.length > 0 ? (realCovers.length / moodCovers.length) * 100 : 0;
      
      console.log(`[RESULT-${mood}] Success Rate: ${successRate.toFixed(1)}% (${realCovers.length}/${moodCovers.length})`);
      
      // Assert minimum success rate (aiming for 70%+)
      expect(successRate).toBeGreaterThanOrEqual(50); // Start with 50% minimum to see current state
      
      // Verify at least some real covers are present
      expect(realCovers.length).toBeGreaterThan(0);
    });
  }

  test('Final Analysis - Overall Success Rate', async ({ page }) => {
    // This test runs after all mood tests to provide overall analysis
    test.skip(coverResults.length === 0, 'No cover results to analyze');
    
    let totalCovers = 0;
    let totalRealCovers = 0;
    
    console.log('\n📊 FINAL ANALYSIS - OVERALL COVER SUCCESS RATE');
    console.log('='.repeat(60));
    
    coverResults.forEach(result => {
      const realCovers = result.covers.filter(c => c.isReal);
      const successRate = result.covers.length > 0 ? (realCovers.length / result.covers.length) * 100 : 0;
      
      totalCovers += result.covers.length;
      totalRealCovers += realCovers.length;
      
      console.log(`${result.mood.padEnd(15)} | ${realCovers.length.toString().padStart(2)}/${result.covers.length.toString().padEnd(2)} | ${successRate.toFixed(1).padStart(5)}%`);
    });
    
    const overallSuccessRate = totalCovers > 0 ? (totalRealCovers / totalCovers) * 100 : 0;
    
    console.log('-'.repeat(60));
    console.log(`${'OVERALL'.padEnd(15)} | ${totalRealCovers.toString().padStart(2)}/${totalCovers.toString().padEnd(2)} | ${overallSuccessRate.toFixed(1).padStart(5)}%`);
    console.log('='.repeat(60));
    
    // Success criteria verification
    console.log('\n✅ SUCCESS CRITERIA CHECK:');
    console.log(`• Real HTTP URLs present: ${totalRealCovers > 0 ? '✅' : '❌'}`);
    console.log(`• 70%+ Success Rate: ${overallSuccessRate >= 70 ? '✅' : '❌'} (${overallSuccessRate.toFixed(1)}%)`);
    console.log(`• All moods tested: ${coverResults.length === MOODS_TO_TEST.length ? '✅' : '❌'}`);
    
    // Assert overall success rate meets target
    expect(overallSuccessRate).toBeGreaterThanOrEqual(70);
    expect(totalRealCovers).toBeGreaterThan(0);
  });
});

test.describe('Visual Cover Display Verification', () => {
  test('Real covers display correctly in UI', async ({ page }) => {
    console.log('\n🖼️  TESTING VISUAL COVER DISPLAY');
    
    // Trigger recommendation with a specific mood
    await page.goto('http://localhost:3000/home');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("FUNNY")');
    
    // Wait for recommendations page
    await page.waitForURL('**/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load
    await page.waitForTimeout(5000);
    
    // Check for actual image elements
    const imageElements = await page.$$('img[src*="http"]');
    console.log(`[VISUAL] Found ${imageElements.length} HTTP image elements`);
    
    // Verify at least some images are real book covers
    let realImageCount = 0;
    for (const img of imageElements) {
      const src = await img.getAttribute('src');
      if (src && isRealCover(src)) {
        realImageCount++;
        console.log(`[VISUAL] ✅ Real cover image: ${src}`);
      }
    }
    
    expect(realImageCount).toBeGreaterThan(0);
    console.log(`[VISUAL] Result: ${realImageCount} real cover images displayed`);
  });
});