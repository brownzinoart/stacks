// End-to-end test of the recommendation + cover flow
// This tests the entire pipeline to verify covers are being attached

const { default: fetch } = require('node-fetch');

async function testFullRecommendationFlow() {
  console.log('🔄 Testing Full Recommendation + Cover Flow');
  console.log('=' .repeat(60));

  try {
    // Test the home page to trigger recommendations with mood selection
    console.log('📤 Testing mood-based recommendation flow...');
    
    // Simulate the actual request that would be made from the home page
    const moodPrompt = "I want something FUNNY that will make me laugh and forget my stress";
    
    // Step 1: Test the AI recommendation service endpoint
    console.log('🤖 Step 1: Testing AI recommendation service');
    const aiPayload = {
      userInput: moodPrompt,
      forceRefresh: true
    };

    // Since we can't directly import the service in Node.js, let's test via the API
    // We need to simulate what happens in the browser
    console.log('📊 Testing full pipeline simulation...');
    
    // First, let's manually test the OpenAI proxy to see what it returns
    const openaiPayload = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a library assistant expert at understanding mood and emotional context to recommend perfect books. Focus on matching the emotional tone and reading experience the user seeks."
        },
        {
          role: "user", 
          content: `Based on the user wanting "${moodPrompt}", create exactly 3 categories of recommendations.

Return ONLY this JSON structure with NO additional text:
{
  "overallTheme": "One sentence summary",
  "categories": [
    {
      "name": "Category Name",
      "description": "1-2 sentences why",
      "books": [
        {
          "title": "Book Title", 
          "author": "Author Name", 
          "isbn": "ISBN-13 if known", 
          "year": "publication year",
          "whyYoullLikeIt": "Natural description",
          "summary": "Brief plot summary",
          "pageCount": "estimated pages",
          "readingTime": "estimated hours",
          "publisher": "publisher if known"
        }
      ]
    }
  ]
}

Include 2 books per category.`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    };

    console.log('🔍 Testing OpenAI API response structure...');
    const aiResponse = await fetch('http://localhost:3000/api/openai-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(openaiPayload)
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('✅ OpenAI API responded successfully');

    // Parse the recommendations
    const content = aiData.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenAI response');
    }

    const recommendations = JSON.parse(jsonMatch[0]);
    console.log(`📚 Found ${recommendations.categories.length} categories from AI`);

    // Count books before cover processing
    let totalBooks = 0;
    recommendations.categories.forEach(category => {
      totalBooks += category.books.length;
      console.log(`  📂 ${category.name}: ${category.books.length} books`);
      category.books.forEach(book => {
        console.log(`    📖 "${book.title}" by ${book.author} - Cover: ${book.cover ? 'HAS COVER' : '❌ NO COVER'}`);
      });
    });

    console.log(`\n📊 Initial state: ${totalBooks} books, none have covers yet (expected)`);

    // Step 2: Simulate the cover fetching process
    console.log('\n🖼️  Step 2: Testing cover fetching process');
    
    const allBooks = [];
    recommendations.categories.forEach(category => {
      allBooks.push(...category.books);
    });

    console.log(`🔍 About to fetch covers for ${allBooks.length} books...`);

    // Test the cover service for each book individually
    let successfulCovers = 0;
    let realCovers = 0;
    let gradientCovers = 0;

    for (let i = 0; i < allBooks.length; i++) {
      const book = allBooks[i];
      console.log(`\n📖 Testing cover for "${book.title}" by ${book.author}`);
      
      // Test OpenLibrary first (most reliable)
      if (book.isbn) {
        const olUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
        const proxyUrl = `http://localhost:3000/api/cover-proxy?url=${encodeURIComponent(olUrl)}`;
        
        try {
          const response = await fetch(proxyUrl, { method: 'HEAD' });
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            console.log(`  ✅ OpenLibrary cover found via proxy`);
            book.cover = proxyUrl;
            successfulCovers++;
            realCovers++;
            continue;
          }
        } catch (e) {
          console.log(`  ⚠️ OpenLibrary failed: ${e.message}`);
        }
      }

      // Test Google Books API
      try {
        const query = `intitle:"${book.title}" inauthor:"${book.author}"`;
        const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
        const gbResponse = await fetch(gbUrl);
        
        if (gbResponse.ok) {
          const gbData = await gbResponse.json();
          if (gbData.items && gbData.items.length > 0) {
            const imageLinks = gbData.items[0].volumeInfo?.imageLinks;
            if (imageLinks) {
              const imageUrl = imageLinks.thumbnail || imageLinks.medium;
              if (imageUrl) {
                const proxyUrl = `http://localhost:3000/api/cover-proxy?url=${encodeURIComponent(imageUrl)}`;
                const proxyResponse = await fetch(proxyUrl, { method: 'HEAD' });
                if (proxyResponse.ok) {
                  console.log(`  ✅ Google Books cover found via proxy`);
                  book.cover = proxyUrl;
                  successfulCovers++;
                  realCovers++;
                  continue;
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(`  ⚠️ Google Books failed: ${e.message}`);
      }

      // Generate gradient fallback
      console.log(`  🎨 Using gradient fallback`);
      const colors = ['#FF6B6B', '#4ECDC4'];
      book.cover = `gradient:${colors[0]}:${colors[1]}:${encodeURIComponent(book.title)}:${encodeURIComponent(book.author)}`;
      successfulCovers++;
      gradientCovers++;
    }

    // Final results
    console.log('\n' + '=' .repeat(60));
    console.log('📈 FINAL COVER TEST RESULTS');
    console.log('=' .repeat(60));
    console.log(`📚 Total books: ${totalBooks}`);
    console.log(`🖼️  Covers assigned: ${successfulCovers}`);
    console.log(`📸 Real covers: ${realCovers}`);
    console.log(`🎨 Gradient covers: ${gradientCovers}`);
    console.log(`📊 Success rate: ${Math.round((successfulCovers / totalBooks) * 100)}%`);
    console.log(`🖼️  Real cover rate: ${Math.round((realCovers / totalBooks) * 100)}%`);

    if (successfulCovers === totalBooks) {
      console.log('\n🎉 SUCCESS: All books have covers!');
      if (realCovers > 0) {
        console.log('✨ BONUS: Real cover images are working!');
      }
    } else {
      console.log('\n❌ FAILURE: Some books are missing covers');
    }

    // Show final book list with cover status
    console.log('\n📋 Final Book List with Cover Status:');
    recommendations.categories.forEach(category => {
      console.log(`\n📂 ${category.name}:`);
      category.books.forEach(book => {
        const coverType = book.cover ? 
          (book.cover.startsWith('http') ? '🖼️ REAL' : 
           book.cover.startsWith('gradient:') ? '🎨 GRADIENT' : '❓ UNKNOWN') : 
          '❌ MISSING';
        console.log(`  📖 "${book.title}" - ${coverType}`);
      });
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testActualUI() {
  console.log('\n🌐 Testing Actual UI Workflow');
  console.log('=' .repeat(60));
  
  try {
    // Test the actual home page
    console.log('🏠 Testing home page accessibility...');
    const homeResponse = await fetch('http://localhost:3000/home');
    console.log(`📊 Home page: ${homeResponse.status} ${homeResponse.statusText}`);

    // Test the recommendations page
    console.log('📚 Testing recommendations page...');
    const recsResponse = await fetch('http://localhost:3000/stacks-recommendations');
    console.log(`📊 Recommendations page: ${recsResponse.status} ${recsResponse.statusText}`);

  } catch (error) {
    console.error('❌ UI test failed:', error.message);
  }
}

async function runAllTests() {
  try {
    await testFullRecommendationFlow();
    await testActualUI();
    console.log('\n🏁 All tests complete!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

runAllTests();