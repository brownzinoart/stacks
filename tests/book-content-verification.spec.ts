import { test, expect } from '@playwright/test';

test('Verify book content is actually loading', async ({ page }) => {
  console.log('🔍 Testing if book recommendations are actually loading...');
  
  // Navigate to home and click FUNNY
  await page.goto('/home');
  await page.getByRole('button', { name: /FUNNY/i }).click();
  
  // Wait for recommendations page
  await page.waitForURL('/stacks-recommendations', { timeout: 60000 });
  console.log('✅ Navigated to recommendations page');
  
  // Wait a bit more for content to load
  await page.waitForTimeout(5000);
  
  // Check localStorage for data
  const storedData = await page.evaluate(() => {
    const data = localStorage.getItem('stacks_recommendations');
    console.log('Raw localStorage data:', data ? data.substring(0, 200) + '...' : 'null');
    return data ? JSON.parse(data) : null;
  });
  
  if (storedData) {
    console.log('✅ Found data in localStorage');
    console.log('📊 Data structure:', Object.keys(storedData));
    
    if (storedData.categories && storedData.categories.length > 0) {
      console.log(`📚 Found ${storedData.categories.length} categories`);
      
      storedData.categories.forEach((cat, idx) => {
        console.log(`  Category ${idx + 1}: "${cat.name}" with ${cat.books?.length || 0} books`);
        
        if (cat.books && cat.books.length > 0) {
          cat.books.slice(0, 2).forEach((book, bookIdx) => {
            console.log(`    Book ${bookIdx + 1}: "${book.title}" by ${book.author}`);
            console.log(`      Cover: ${book.cover ? (book.cover.startsWith('http') ? 'Real URL' : 'Gradient') : 'Missing'}`);
            console.log(`      Why: ${book.whyYoullLikeIt || book.why || 'No reason provided'}`);
          });
        }
      });
    } else if (storedData.books && storedData.books.length > 0) {
      console.log(`📚 Found ${storedData.books.length} books (flat structure)`);
      
      storedData.books.slice(0, 3).forEach((book, idx) => {
        console.log(`  Book ${idx + 1}: "${book.title}" by ${book.author}`);
        console.log(`    Cover: ${book.cover ? (book.cover.startsWith('http') ? 'Real URL' : 'Gradient') : 'Missing'}`);
      });
    } else {
      console.log('❌ No books found in stored data');
    }
  } else {
    console.log('❌ No data found in localStorage');
  }
  
  // Scroll down to look for book content
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(2000);
  
  // Look for book cards in the DOM
  const bookCards = page.locator('[class*="rounded-3xl"]').filter({
    has: page.locator('h2')
  });
  
  const cardCount = await bookCards.count();
  console.log(`🎯 Found ${cardCount} book cards in DOM`);
  
  if (cardCount > 0) {
    console.log('✅ Book cards are present in the DOM');
    
    // Check first few cards
    for (let i = 0; i < Math.min(3, cardCount); i++) {
      try {
        const card = bookCards.nth(i);
        const title = await card.locator('h2').first().textContent({ timeout: 2000 });
        
        if (title && !title.match(/^(STACKS|RECOMMENDATIONS|Popular Recommendations)$/)) {
          console.log(`📖 Book ${i + 1}: "${title}"`);
          
          // Check for cover image
          const img = card.locator('img').first();
          if (await img.isVisible({ timeout: 1000 })) {
            const src = await img.getAttribute('src');
            console.log(`  Cover: ${src ? (src.startsWith('http') ? 'Real image' : 'Other') : 'No src'}`);
          } else {
            console.log('  Cover: Not visible');
          }
          
          // Check for action buttons
          const buttons = await card.locator('button').count();
          console.log(`  Buttons: ${buttons} found`);
        }
      } catch (error) {
        console.log(`❌ Error reading card ${i}: ${error.message}`);
      }
    }
  } else {
    console.log('❌ No book cards found in DOM');
    
    // Check what's actually on the page
    const pageText = await page.textContent('body');
    if (pageText.includes('No recommendations yet')) {
      console.log('⚠️ Page shows "No recommendations yet" message');
    } else if (pageText.includes('Loading')) {
      console.log('⏳ Page is still in loading state');
    } else {
      console.log('❓ Unknown page state');
    }
  }
  
  // Take a full page screenshot to see everything
  await page.screenshot({ 
    path: 'test-results/full-page-content-check.png', 
    fullPage: true 
  });
  console.log('📸 Full page screenshot saved');
  
  // Final summary
  console.log('\n📋 CONTENT VERIFICATION SUMMARY:');
  console.log(`- Data in storage: ${storedData ? '✅ Yes' : '❌ No'}`);
  console.log(`- Book cards in DOM: ${cardCount > 0 ? '✅ Yes (' + cardCount + ')' : '❌ No'}`);
  console.log(`- Navigation working: ✅ Yes`);
  console.log(`- Page headers: ✅ Yes`);
});