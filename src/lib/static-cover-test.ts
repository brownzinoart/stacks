/**
 * Test script for Static Cover Mapping System
 * Run this to verify all homepage books have static covers
 */

import { getStaticCover, hasStaticCover, debugStaticCovers, getAllStaticCoverMappings } from './static-cover-mapping';

// All homepage demo books that should have static covers
const homepageBooks = [
  { title: 'Fourth Wing', author: 'Rebecca Yarros' },
  { title: 'Lessons in Chemistry', author: 'Bonnie Garmus' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin' },
  { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid' },
  { title: 'Atomic Habits', author: 'James Clear' },
  { title: 'The Silent Patient', author: 'Alex Michaelides' },
  { title: 'Iron Flame', author: 'Rebecca Yarros' },
  { title: 'Happy Place', author: 'Emily Henry' },
  { title: 'The Atlas Six', author: 'Olivie Blake' },
  { title: 'Babel', author: 'R.F. Kuang' },
  { title: 'The Midnight Library', author: 'Matt Haig' },
];

/**
 * Test static cover mapping for all homepage books
 */
export function testStaticCoverMapping(): void {
  console.log('🧪 Testing Static Cover Mapping System');
  console.log('=====================================\n');
  
  // Show all available mappings
  debugStaticCovers();
  console.log('');
  
  let successCount = 0;
  let failureCount = 0;
  
  console.log('📖 Testing homepage books:');
  console.log('---------------------------');
  
  for (const book of homepageBooks) {
    const staticCover = getStaticCover(book.title, book.author);
    const hasStatic = hasStaticCover(book.title, book.author);
    
    if (staticCover && hasStatic) {
      console.log(`✅ "${book.title}" by ${book.author}`);
      console.log(`   → ${staticCover}`);
      successCount++;
    } else {
      console.log(`❌ "${book.title}" by ${book.author} - NO STATIC COVER FOUND`);
      failureCount++;
    }
    console.log('');
  }
  
  console.log('📊 Test Results:');
  console.log(`   ✅ Success: ${successCount}/${homepageBooks.length} books`);
  console.log(`   ❌ Missing: ${failureCount}/${homepageBooks.length} books`);
  
  if (failureCount === 0) {
    console.log('🎉 ALL HOMEPAGE BOOKS HAVE STATIC COVERS!');
    console.log('   API calls for homepage books will be eliminated.');
  } else {
    console.log('⚠️  Some books are missing static covers.');
    console.log('   These books will still use API fallback.');
  }
  
  // Test edge cases
  console.log('\n🔍 Testing edge cases:');
  console.log('----------------------');
  
  // Test non-existent book
  const nonExistent = getStaticCover('Non-existent Book', 'Unknown Author');
  console.log(`Non-existent book: ${nonExistent ? 'FOUND (ERROR!)' : 'Not found (correct)'}`);
  
  // Test title variations
  const titleVariations = [
    { title: 'atomic habits', author: 'james clear' }, // lowercase
    { title: 'ATOMIC HABITS', author: 'JAMES CLEAR' }, // uppercase
    { title: 'Atomic Habits: An Easy...', author: 'James Clear' }, // with subtitle
  ];
  
  for (const variation of titleVariations) {
    const result = getStaticCover(variation.title, variation.author);
    console.log(`Title variation "${variation.title}": ${result ? 'Found' : 'Not found'}`);
  }
  
  console.log('');
}

/**
 * Get performance metrics for static cover system
 */
export function getStaticCoverMetrics() {
  const mappings = getAllStaticCoverMappings();
  const homepageBooksCount = homepageBooks.length;
  const coverage = (mappings.length / homepageBooksCount) * 100;
  
  return {
    totalMappings: mappings.length,
    homepageBooksCount,
    coverage: Math.round(coverage),
    expectedApiCallReduction: homepageBooksCount,
  };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testStaticCoverMapping();
}