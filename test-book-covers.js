// Test script to verify book covers are being fetched and stored properly

async function testMoodSelection(mood) {
  console.log(`\n🔍 Testing mood selection: ${mood}`);
  console.log('=' .repeat(50));
  
  try {
    // First, make the search request through the AI proxy
    const searchPayload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a library assistant expert at understanding mood and emotional context to recommend perfect books. Focus on matching the emotional tone and reading experience the user seeks."
        },
        {
          role: "user",
          content: `Based on the user wanting books like "${mood}", create exactly 3 categories of recommendations.\n\nReturn ONLY this JSON structure with NO additional text:\n{\n  "overallTheme": "One sentence summary",\n  "categories": [\n    {\n      "name": "Category Name",\n      "description": "1-2 sentences why",\n      "books": [\n        {\n          "title": "Book Title", \n          "author": "Author Name", \n          "isbn": "ISBN-13 if known", \n          "year": "publication year",\n          "whyYoullLikeIt": "Natural description",\n          "summary": "Brief plot summary",\n          "pageCount": "estimated pages",\n          "readingTime": "estimated hours",\n          "publisher": "publisher if known"\n        }\n      ]\n    }\n  ]\n}\n\nInclude 2 books per category.`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    };

    console.log('📤 Sending request to OpenAI proxy...');
    const response = await fetch('http://localhost:3000/api/openai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload)
    });

    if (\!response.ok) {
      throw new Error(`HTTP error\! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Received response from OpenAI');
    
    // Parse the recommendations
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (\!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const recommendations = JSON.parse(jsonMatch[0]);
    console.log(`📚 Found ${recommendations.categories.length} categories`);
    
    // Count books and check for covers
    let totalBooks = 0;
    let booksWithCovers = 0;
    
    recommendations.categories.forEach(category => {
      console.log(`\n  📂 ${category.name}: ${category.books.length} books`);
      category.books.forEach(book => {
        totalBooks++;
        if (book.cover) {
          booksWithCovers++;
          const coverType = book.cover.startsWith('http') ? 'URL' : 
                           book.cover.startsWith('gradient:') ? 'Gradient' : 'Unknown';
          console.log(`    📖 "${book.title}" - Cover: ${coverType}`);
        } else {
          console.log(`    📖 "${book.title}" - Cover: ❌ MISSING`);
        }
      });
    });
    
    console.log(`\n📊 Summary: ${booksWithCovers}/${totalBooks} books have covers`);
    
    if (booksWithCovers === 0) {
      console.log('⚠️  WARNING: No books have covers\! The fix may not be working.');
    } else if (booksWithCovers < totalBooks) {
      console.log('⚠️  WARNING: Some books are missing covers.');
    } else {
      console.log('✅ SUCCESS: All books have covers\!');
    }
    
    return { totalBooks, booksWithCovers };
    
  } catch (error) {
    console.error(`❌ Error testing ${mood}:`, error.message);
    return { totalBooks: 0, booksWithCovers: 0 };
  }
}

async function runTests() {
  console.log('🚀 Starting Book Cover Test Suite');
  console.log('=' .repeat(50));
  
  const moods = ['FUNNY', 'LOVE STORY'];
  const results = [];
  
  for (const mood of moods) {
    const result = await testMoodSelection(mood);
    results.push({ mood, ...result });
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Final summary
  console.log('\n' + '=' .repeat(50));
  console.log('📈 FINAL TEST RESULTS');
  console.log('=' .repeat(50));
  
  let totalBooksOverall = 0;
  let booksWithCoversOverall = 0;
  
  results.forEach(result => {
    totalBooksOverall += result.totalBooks;
    booksWithCoversOverall += result.booksWithCovers;
    const percentage = result.totalBooks > 0 
      ? Math.round((result.booksWithCovers / result.totalBooks) * 100) 
      : 0;
    console.log(`${result.mood}: ${result.booksWithCovers}/${result.totalBooks} books with covers (${percentage}%)`);
  });
  
  const overallPercentage = totalBooksOverall > 0 
    ? Math.round((booksWithCoversOverall / totalBooksOverall) * 100) 
    : 0;
  
  console.log('\n' + '=' .repeat(50));
  console.log(`OVERALL: ${booksWithCoversOverall}/${totalBooksOverall} books with covers (${overallPercentage}%)`);
  
  if (overallPercentage === 100) {
    console.log('🎉 ALL TESTS PASSED\! Book covers are working perfectly\!');
  } else if (overallPercentage > 0) {
    console.log('⚠️  PARTIAL SUCCESS: Some books have covers, but not all.');
  } else {
    console.log('❌ FAILURE: No books have covers. The issue is not fixed.');
  }
}

// Run the tests
runTests().catch(console.error);
ENDSCRIPT < /dev/null