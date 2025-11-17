#!/usr/bin/env tsx
/**
 * Test script for discover search functionality
 * Tests with "books like the movie scarface" query
 * 
 * Usage:
 *   npm run dev  # Start the server first
 *   npx tsx scripts/test-discover-search.ts
 * 
 * Or set API_URL environment variable:
 *   API_URL=http://localhost:3000 npx tsx scripts/test-discover-search.ts
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testDiscoverSearch() {
  const testQuery = 'books like the movie scarface';
  
  console.log('🧪 Testing Discover Search');
  console.log(`Query: "${testQuery}"`);
  console.log('─'.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/search/categorized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: testQuery,
        userId: 'user-1'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    console.log('\n✅ API Response Received');
    console.log('─'.repeat(60));
    
    // Validate structure
    console.log('\n📊 Results Structure:');
    console.log(`Query: ${data.query}`);
    console.log(`Success: ${data.success}`);
    
    // Check categories
    const categories = ['atmosphere', 'characters', 'plot'];
    const categoryCounts: Record<string, number> = {};
    const allBookIds = new Set<string>();
    let totalBooks = 0;
    
    console.log('\n📚 Category Distribution:');
    for (const category of categories) {
      const categoryData = data[category];
      if (!categoryData) {
        console.error(`❌ Missing category: ${category}`);
        continue;
      }
      
      const books = categoryData.books || [];
      categoryCounts[category] = books.length;
      totalBooks += books.length;
      
      console.log(`\n${category.toUpperCase()}:`);
      console.log(`  Books: ${books.length}`);
      console.log(`  Tags: ${(categoryData.tags || []).join(', ') || 'None'}`);
      
      // Check for duplicates
      books.forEach((bookMatch: any, idx: number) => {
        const bookId = bookMatch.book?.id;
        if (bookId) {
          if (allBookIds.has(bookId)) {
            console.error(`  ❌ DUPLICATE: Book "${bookMatch.book.title}" (ID: ${bookId}) appears in multiple categories!`);
          } else {
            allBookIds.add(bookId);
            console.log(`  [${idx + 1}] ${bookMatch.book.title} by ${bookMatch.book.author}`);
            console.log(`      Match: ${bookMatch.matchPercentage}%`);
            console.log(`      Reasons: ${JSON.stringify(bookMatch.matchReasons)}`);
          }
        }
      });
    }
    
    // Validation checks
    console.log('\n🔍 Validation Results:');
    console.log('─'.repeat(60));
    
    let allPassed = true;
    
    // Check 1: Exactly 6 books total
    if (totalBooks === 6) {
      console.log('✅ Total books: 6 (correct)');
    } else {
      console.error(`❌ Total books: ${totalBooks} (expected 6)`);
      allPassed = false;
    }
    
    // Check 2: Exactly 2 books per category
    for (const category of categories) {
      const count = categoryCounts[category];
      if (count === 2) {
        console.log(`✅ ${category}: 2 books (correct)`);
      } else {
        console.error(`❌ ${category}: ${count} books (expected 2)`);
        allPassed = false;
      }
    }
    
    // Check 3: No duplicates
    if (allBookIds.size === totalBooks) {
      console.log('✅ No duplicate books across categories');
    } else {
      console.error(`❌ Found duplicates: ${totalBooks} books but only ${allBookIds.size} unique IDs`);
      allPassed = false;
    }
    
    // Check 4: Results match query (basic check)
    console.log('\n📝 Query Relevance Check:');
    const queryLower = testQuery.toLowerCase();
    const hasScarface = queryLower.includes('scarface');
    const hasMovie = queryLower.includes('movie');
    
    if (hasScarface || hasMovie) {
      console.log('✅ Query contains movie reference (scarface/movie)');
      console.log('   (TMDB integration should be triggered - check server logs)');
    }
    
    // Check if results seem relevant
    const allTitles = Object.values(data)
      .filter((cat: any) => cat?.books)
      .flatMap((cat: any) => cat.books.map((b: any) => b.book.title.toLowerCase()))
      .join(' ');
    
    console.log(`\n📖 Sample titles: ${allTitles.substring(0, 100)}...`);
    
    // Check 5: Verify no duplicate book IDs
    const allBookIdsList: string[] = [];
    categories.forEach(category => {
      const categoryData = data[category];
      (categoryData?.books || []).forEach((bookMatch: any) => {
        if (bookMatch.book?.id) {
          allBookIdsList.push(bookMatch.book.id);
        }
      });
    });
    
    const uniqueBookIds = new Set(allBookIdsList);
    if (uniqueBookIds.size === allBookIdsList.length) {
      console.log('✅ No duplicate book IDs found');
    } else {
      console.error(`❌ Found ${allBookIdsList.length - uniqueBookIds.size} duplicate book IDs`);
      allPassed = false;
    }
    
    console.log('\n' + '─'.repeat(60));
    if (allPassed) {
      console.log('✅ ALL VALIDATIONS PASSED');
    } else {
      console.log('❌ SOME VALIDATIONS FAILED');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testDiscoverSearch();

