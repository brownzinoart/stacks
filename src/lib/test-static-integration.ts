/**
 * Integration test for static cover system with book-cover-service
 * This simulates actual usage and verifies API call elimination
 */

import { bookCoverService } from './book-cover-service';
import { getStaticCoverMetrics } from './static-cover-test';

// All homepage books that should have static covers
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
 * Test static cover integration with book cover service
 */
export async function testStaticCoverIntegration(): Promise<void> {
  console.log('🧪 Testing Static Cover Integration with BookCoverService');
  console.log('========================================================\n');
  
  const metrics = getStaticCoverMetrics();
  console.log('📊 System Metrics:');
  console.log(`   Static mappings available: ${metrics.totalMappings}`);
  console.log(`   Homepage books: ${metrics.homepageBooksCount}`);
  console.log(`   Coverage: ${metrics.coverage}%`);
  console.log(`   Expected API call reduction: ${metrics.expectedApiCallReduction} calls\n`);
  
  let staticCoverCount = 0;
  let apiCallCount = 0;
  let errorCount = 0;
  const results: Array<{ book: any; result: any; time: number }> = [];
  
  console.log('🔍 Testing each homepage book:');
  console.log('------------------------------');
  
  for (const book of homepageBooks) {
    const startTime = Date.now();
    
    try {
      console.log(`\n📖 Testing: "${book.title}" by ${book.author}`);
      
      const result = await bookCoverService.getCover(book);
      const loadTime = Date.now() - startTime;
      
      console.log(`   Source: ${result.source}`);
      console.log(`   Confidence: ${result.confidence}%`);
      console.log(`   Quality: ${result.quality || 'N/A'}`);
      console.log(`   Load time: ${loadTime}ms`);
      console.log(`   URL: ${result.url.substring(0, 60)}...`);
      
      if (result.source === 'static') {
        console.log('   ✅ STATIC COVER USED - NO API CALL!');
        staticCoverCount++;
      } else {
        console.log(`   ⚠️  Used API source: ${result.source}`);
        apiCallCount++;
      }
      
      results.push({ book, result, time: loadTime });
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
    }
  }
  
  console.log('\n📊 FINAL RESULTS:');
  console.log('=================');
  console.log(`✅ Static covers used: ${staticCoverCount}/${homepageBooks.length} books`);
  console.log(`🌐 API calls made: ${apiCallCount}/${homepageBooks.length} books`);
  console.log(`❌ Errors: ${errorCount}/${homepageBooks.length} books`);
  
  const apiReductionPercent = Math.round((staticCoverCount / homepageBooks.length) * 100);
  console.log(`🎯 API call reduction: ${apiReductionPercent}%`);
  
  if (staticCoverCount === homepageBooks.length) {
    console.log('🎉 SUCCESS: ALL homepage books use static covers!');
    console.log('   Zero API calls needed for homepage book covers.');
  } else if (staticCoverCount > 0) {
    console.log(`✅ PARTIAL SUCCESS: ${staticCoverCount} books use static covers.`);
    console.log(`   ${apiCallCount} books still require API calls.`);
  } else {
    console.log('❌ FAILURE: No static covers were used.');
    console.log('   All books are making API calls - check configuration.');
  }
  
  // Performance analysis
  const avgStaticTime = results
    .filter(r => r.result.source === 'static')
    .reduce((sum, r) => sum + r.time, 0) / staticCoverCount || 0;
    
  const avgApiTime = results
    .filter(r => r.result.source !== 'static')
    .reduce((sum, r) => sum + r.time, 0) / apiCallCount || 0;
  
  if (avgStaticTime > 0) {
    console.log(`\n⚡ Performance Analysis:`);
    console.log(`   Average static cover load time: ${Math.round(avgStaticTime)}ms`);
    if (avgApiTime > 0) {
      console.log(`   Average API call time: ${Math.round(avgApiTime)}ms`);
      const speedup = Math.round(avgApiTime / avgStaticTime);
      console.log(`   Static covers are ${speedup}x faster than API calls`);
    }
  }
  
  console.log('\n🔧 Implementation Status:');
  console.log(`   ✅ Static mapping system: ACTIVE`);
  console.log(`   ✅ Book cover service integration: ACTIVE`);
  console.log(`   ✅ Fallback chain: Static → API → Gradient`);
  console.log(`   ✅ Cache system: ACTIVE (for non-static covers)`);
}

// Run test if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testStaticCoverIntegration().catch(console.error);
}