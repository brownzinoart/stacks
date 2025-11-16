// Test the API through the proxy
const axios = require('axios');

async function testProxy() {
  console.log('Testing API call through proxy...');

  try {
    const response = await axios.post(
      'http://192.168.86.174:8080/api/openai-proxy',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a test bot. Reply with "Proxy is working!"',
          },
          { role: 'user', content: 'Test proxy' },
        ],
        temperature: 0.1,
        max_tokens: 50,
      },
      {
        timeout: 15000, // 15 second timeout for proxy
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Proxy API call successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Proxy API call failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testProxy();
