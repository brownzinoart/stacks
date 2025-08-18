// Test the API directly to debug the issue
const axios = require('axios');

async function testAPI() {
  console.log('Testing direct API call...');

  try {
    const response = await axios.post(
      'http://localhost:3000/api/openai-proxy',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a test bot. Reply with "API is working!"',
          },
          { role: 'user', content: 'Test' },
        ],
        temperature: 0.1,
        max_tokens: 50,
      },
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API call successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ API call failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
