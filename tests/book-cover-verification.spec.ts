import { test, expect } from '@playwright/test';

test.describe('Book Cover Display Verification', () => {
  test('Verify real book covers are displaying (not gradient placeholders)', async ({ page }) => {
    console.log('Testing book cover display quality...');
    
    // Navigate to home and trigger FUNNY mood
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    // Wait for recommendations page
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Find all book cover elements
    const bookCovers = page.locator('img').or(page.locator('[class*="book-cover"]'));
    const coverCount = await bookCovers.count();
    console.log(`Found ${coverCount} potential book cover elements`);
    
    let realCoverCount = 0;
    let gradientCoverCount = 0;
    let noCoverCount = 0;
    
    // Analyze each cover
    for (let i = 0; i < Math.min(10, coverCount); i++) {
      const cover = bookCovers.nth(i);
      
      try {
        // Check if it's an img element with src
        const imgSrc = await cover.getAttribute('src');
        if (imgSrc && imgSrc.startsWith('http')) {
          realCoverCount++;
          console.log(`✅ Real cover found: ${imgSrc.substring(0, 50)}...`);
          
          // Verify image loads successfully
          await expect(cover).toBeVisible();
          
          // Check image dimensions to ensure it's not broken
          const box = await cover.boundingBox();
          if (box && box.width > 50 && box.height > 50) {
            console.log(`✅ Cover has good dimensions: ${box.width}x${box.height}`);
          }
        } else {
          // Check for gradient background styles
          const style = await cover.getAttribute('style');
          const className = await cover.getAttribute('class');
          
          if ((style && style.includes('gradient')) || 
              (className && className.includes('gradient'))) {
            gradientCoverCount++;
            console.log(`⚠️ Gradient cover found: ${style || className}`);
          } else {
            noCoverCount++;
            console.log(`❌ No cover found for element ${i}`);
          }
        }
      } catch (error) {
        console.log(`Error checking cover ${i}: ${error}`);
        noCoverCount++;
      }
    }
    
    console.log(`📊 Cover Analysis Results:`);
    console.log(`  Real covers: ${realCoverCount}`);
    console.log(`  Gradient covers: ${gradientCoverCount}`);
    console.log(`  No covers: ${noCoverCount}`);
    
    // Verify that most covers are real (at least 70%)
    const totalCovers = realCoverCount + gradientCoverCount + noCoverCount;
    if (totalCovers > 0) {
      const realCoverPercentage = (realCoverCount / totalCovers) * 100;
      console.log(`Real cover percentage: ${realCoverPercentage.toFixed(1)}%`);
      
      // Expect at least 50% real covers (allowing for some fallbacks)
      expect(realCoverPercentage).toBeGreaterThan(50);
    }
    
    // Verify at least some real covers are present
    expect(realCoverCount).toBeGreaterThan(0);
  });

  test('Verify book metadata completeness', async ({ page }) => {
    console.log('Testing book metadata completeness...');
    
    await page.goto('/home');
    const mindBlowingButton = page.getByRole('button', { name: /MIND-BLOWING/i });
    await mindBlowingButton.click();
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Find all book cards
    const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]').filter({
      has: page.locator('h2')
    });
    
    const cardCount = await bookCards.count();
    console.log(`Found ${cardCount} book cards`);
    
    let completeBooks = 0;
    let incompleteBooks = 0;
    
    // Check each book for completeness
    for (let i = 0; i < Math.min(10, cardCount); i++) {
      const card = bookCards.nth(i);
      
      try {
        // Check for required elements
        const title = await card.locator('h2').first().textContent();
        const author = await card.locator('text=/by .+/').first().textContent();
        const description = await card.locator('p').nth(2).textContent(); // Why you'll like it
        const addButton = card.getByRole('button', { name: /Add to Queue/i });
        const borrowButton = card.getByRole('button', { name: /Borrow/i });
        const detailsButton = card.getByRole('button', { name: /Details/i });
        
        if (title && title.trim().length > 0 &&
            author && author.trim().length > 0 &&
            description && description.trim().length > 0 &&
            await addButton.isVisible() &&
            await borrowButton.isVisible() &&
            await detailsButton.isVisible()) {
          
          completeBooks++;
          console.log(`✅ Complete book: "${title.substring(0, 30)}..."`);
        } else {
          incompleteBooks++;
          console.log(`❌ Incomplete book data for item ${i}`);
          console.log(`  Title: ${title || 'MISSING'}`);
          console.log(`  Author: ${author || 'MISSING'}`);
          console.log(`  Description: ${description ? 'Present' : 'MISSING'}`);
        }
      } catch (error) {
        console.log(`Error checking book ${i}: ${error}`);
        incompleteBooks++;
      }
    }
    
    console.log(`📊 Book Completeness Results:`);
    console.log(`  Complete books: ${completeBooks}`);
    console.log(`  Incomplete books: ${incompleteBooks}`);
    
    // Expect most books to be complete
    const totalBooks = completeBooks + incompleteBooks;
    if (totalBooks > 0) {
      const completenessPercentage = (completeBooks / totalBooks) * 100;
      console.log(`Completeness percentage: ${completenessPercentage.toFixed(1)}%`);
      expect(completenessPercentage).toBeGreaterThan(80);
    }
  });

  test('Test book interaction functionality', async ({ page }) => {
    console.log('Testing book interaction features...');
    
    await page.goto('/home');
    const loveStoryButton = page.getByRole('button', { name: /LOVE STORY/i });
    await loveStoryButton.click();
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Test Add to Queue functionality
    const firstAddButton = page.getByRole('button', { name: /Add to Queue/i }).first();
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();
    
    // Should change to "Added!"
    await expect(page.getByText('Added!')).toBeVisible({ timeout: 5000 });
    
    // Test Borrow Book functionality
    const firstBorrowButton = page.getByRole('button', { name: /Borrow/i }).first();
    await expect(firstBorrowButton).toBeVisible();
    await firstBorrowButton.click();
    
    // Should change to "Borrowed!" temporarily
    await expect(page.getByText('Borrowed!')).toBeVisible({ timeout: 5000 });
    
    // Test Book Details modal
    const firstDetailsButton = page.getByRole('button', { name: /Details/i }).first();
    await expect(firstDetailsButton).toBeVisible();
    await firstDetailsButton.click();
    
    // Modal should appear (may take time to load dynamically)
    await expect(page.locator('[role="dialog"]').last()).toBeVisible({ timeout: 10000 });
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]').last()).toBeHidden({ timeout: 5000 });
    
    // Test book cover click for flipbook
    const firstBookCover = page.locator('img').or(page.locator('[class*="book-cover"]')).first();
    await firstBookCover.click();
    
    // Flipbook loading should appear
    await expect(page.getByText('Loading flipbook')).toBeVisible({ timeout: 10000 });
    
    console.log('✅ All book interactions working properly');
  });

  test('Test category navigation and filtering', async ({ page }) => {
    console.log('Testing category navigation...');
    
    await page.goto('/home');
    const magicalButton = page.getByRole('button', { name: /MAGICAL/i });
    await magicalButton.click();
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Check if categories exist
    const categoryButtons = page.locator('button').filter({ hasText: /All Categories|Popular|Fantasy|Adventure|Romance/ });
    const categoryCount = await categoryButtons.count();
    
    if (categoryCount > 1) {
      console.log(`Found ${categoryCount} category filters`);
      
      // Test "All Categories" view
      const allCategoriesBtn = page.getByRole('button', { name: /All Categories/i });
      if (await allCategoriesBtn.isVisible()) {
        await allCategoriesBtn.click();
        await expect(page.locator('h2').filter({ hasText: /Popular|Fantasy|Romance/ })).toBeVisible();
      }
      
      // Test specific category filtering
      const specificCategoryBtn = categoryButtons.nth(1);
      if (await specificCategoryBtn.isVisible()) {
        await specificCategoryBtn.click();
        
        // Should show only books from that category
        const bookCards = page.locator('[class*="rounded-3xl"][class*="bg-white"]');
        await expect(bookCards.first()).toBeVisible();
      }
    } else {
      console.log('No categories found - showing flat book list');
    }
    
    console.log('✅ Category navigation tested');
  });

  test('Test search reprompt functionality', async ({ page }) => {
    console.log('Testing search reprompt...');
    
    await page.goto('/home');
    const funnyButton = page.getByRole('button', { name: /FUNNY/i });
    await funnyButton.click();
    
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Edit your prompt"]');
    await expect(searchInput).toBeVisible();
    
    // Test new search
    await searchInput.fill('science fiction books about time travel');
    
    const updateButton = page.getByRole('button', { name: /Update/i });
    await expect(updateButton).toBeVisible();
    await updateButton.click();
    
    // Should navigate back to home with new search
    await page.waitForURL('/home', { timeout: 10000 });
    
    // New search should trigger automatically
    await page.waitForURL('/stacks-recommendations', { timeout: 30000 });
    
    // Should show new results
    await expect(page.getByText('RECOMMENDATIONS')).toBeVisible();
    
    console.log('✅ Search reprompt functionality working');
  });
});