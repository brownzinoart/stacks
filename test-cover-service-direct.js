// Direct test of the book cover service to verify it's working
// This tests the cover service in isolation

const { default: fetch } = require('node-fetch');

async function testCoverServiceDirectly() {
  console.log('🧪 Testing Book Cover Service Directly');
  console.log('=' .repeat(50));

  const testBooks = [
    { title: 'The Midnight Library', author: 'Matt Haig', isbn: '9780525559474' },
    { title: 'Catch-22', author: 'Joseph Heller', isbn: '9781451626650' },
    { title: 'Good Omens', author: 'Terry Pratchett', isbn: '9780060853976' },
  ];

  for (const book of testBooks) {
    console.log(`\n📚 Testing: "${book.title}" by ${book.author}`);
    
    try {
      // Test the proxy directly with known cover URLs
      const testUrls = [
        `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
        `https://covers.openlibrary.org/b/id/8576271-L.jpg`, // Fallback test
      ];

      for (const testUrl of testUrls) {
        console.log(`  🔍 Testing proxy with: ${testUrl.substring(0, 50)}...`);
        
        try {
          const proxyUrl = `http://localhost:3000/api/cover-proxy?url=${encodeURIComponent(testUrl)}`;
          const response = await fetch(proxyUrl, { method: 'HEAD' });
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            console.log(`  ✅ Proxy SUCCESS: ${response.status} - ${contentType}`);
            
            // If this works, test full fetch
            const fullResponse = await fetch(proxyUrl);
            if (fullResponse.ok) {
              const buffer = await fullResponse.arrayBuffer();
              console.log(`  📦 Full fetch: ${buffer.byteLength} bytes received`);
              break; // Success, move to next book
            }
          } else {
            console.log(`  ❌ Proxy FAILED: ${response.status} - ${response.statusText}`);
          }
        } catch (error) {
          console.log(`  ❌ Proxy ERROR: ${error.message}`);
        }
      }

      // Test Google Books API directly
      console.log(`  🔍 Testing Google Books API...`);
      const query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
      
      try {
        const gbResponse = await fetch(gbUrl);
        if (gbResponse.ok) {
          const gbData = await gbResponse.json();
          if (gbData.items && gbData.items.length > 0) {
            const imageLinks = gbData.items[0].volumeInfo?.imageLinks;
            if (imageLinks) {
              const imageUrl = imageLinks.thumbnail || imageLinks.medium;
              console.log(`  ✅ Google Books: Found cover URL`);
              
              // Test the proxy with Google Books URL
              if (imageUrl) {
                const proxyUrl = `http://localhost:3000/api/cover-proxy?url=${encodeURIComponent(imageUrl)}`;
                const proxyResponse = await fetch(proxyUrl, { method: 'HEAD' });
                if (proxyResponse.ok) {
                  console.log(`  ✅ Google Books via proxy: SUCCESS`);
                } else {
                  console.log(`  ❌ Google Books via proxy: FAILED - ${proxyResponse.status}`);
                }
              }
            } else {
              console.log(`  ⚠️  Google Books: No image links found`);
            }
          } else {
            console.log(`  ⚠️  Google Books: No results found`);
          }
        } else {
          console.log(`  ❌ Google Books API: ${gbResponse.status}`);
        }
      } catch (error) {
        console.log(`  ❌ Google Books ERROR: ${error.message}`);
      }

    } catch (error) {
      console.error(`❌ Overall error for "${book.title}":`, error.message);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Direct Cover Service Test Complete');
}

// Test specific proxy scenarios
async function testProxyScenarios() {
  console.log('\n🔧 Testing Proxy Scenarios');
  console.log('=' .repeat(50));

  const testScenarios = [
    {
      name: 'OpenLibrary ISBN',
      url: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
    },
    {
      name: 'OpenLibrary ID',
      url: 'https://covers.openlibrary.org/b/id/8576271-L.jpg'
    },
    {
      name: 'Google Books (should fail without proxy)',
      url: 'https://books.google.com/books/content/images/frontcover/test.jpg'
    }
  ];

  for (const scenario of testScenarios) {
    console.log(`\n📋 ${scenario.name}`);
    console.log(`URL: ${scenario.url}`);
    
    // Test direct access (should fail for CORS-protected URLs)
    try {
      console.log('  🔗 Testing direct access...');
      const directResponse = await fetch(scenario.url, { method: 'HEAD' });
      console.log(`  📊 Direct: ${directResponse.status} - ${directResponse.statusText}`);
    } catch (error) {
      console.log(`  ❌ Direct failed: ${error.message}`);
    }

    // Test via proxy
    try {
      console.log('  🔄 Testing via proxy...');
      const proxyUrl = `http://localhost:3000/api/cover-proxy?url=${encodeURIComponent(scenario.url)}`;
      const proxyResponse = await fetch(proxyUrl, { method: 'HEAD' });
      console.log(`  📊 Proxy: ${proxyResponse.status} - ${proxyResponse.headers.get('content-type')}`);
    } catch (error) {
      console.log(`  ❌ Proxy failed: ${error.message}`);
    }
  }
}

async function runAllTests() {
  try {
    await testCoverServiceDirectly();
    await testProxyScenarios();
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

runAllTests();