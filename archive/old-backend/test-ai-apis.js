/**
 * Test script to verify all AI APIs are working correctly
 * Run with: node test-ai-apis.js
 */

const testAIAPIs = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing AI API Integration...\n');

  // Test 1: OpenAI (GPT-4o)
  console.log('1. Testing OpenAI GPT-4o...');
  try {
    const response = await fetch(`${baseUrl}/api/openai-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say "OpenAI works!" in 3 words' }],
        max_tokens: 10
      })
    });
    
    const data = await response.json();
    if (data.choices?.[0]?.message?.content) {
      console.log('✅ OpenAI:', data.choices[0].message.content.trim());
    } else {
      console.log('❌ OpenAI failed:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ OpenAI error:', error.message);
  }

  // Test 2: Anthropic (Claude)
  console.log('\n2. Testing Anthropic Claude...');
  try {
    const response = await fetch(`${baseUrl}/api/anthropic-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say Claude works in 3 words' }]
      })
    });
    
    const data = await response.json();
    if (data.content?.[0]?.text) {
      console.log('✅ Claude:', data.content[0].text.trim());
    } else {
      console.log('❌ Claude failed:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Claude error:', error.message);
  }

  // Test 3: Google Gemini
  console.log('\n3. Testing Google Gemini...');
  try {
    const response = await fetch(`${baseUrl}/api/vertex-ai-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say "Gemini works!" in 3 words' }]
        }],
        generationConfig: { maxOutputTokens: 10 }
      })
    });
    
    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('✅ Gemini:', data.candidates[0].content.parts[0].text.trim());
    } else {
      console.log('❌ Gemini failed:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Gemini error:', error.message);
  }

  // Test 4: AI Router
  console.log('\n4. Testing AI Router Cost Optimization...');
  try {
    const { aiRouter } = await import('./src/lib/ai-model-router.js');
    const routingInfo = aiRouter.getRoutingInfo();
    
    console.log('📊 Cost-optimized routing:');
    Object.entries(routingInfo).forEach(([task, info]) => {
      const cost = info.costPer1k === 0 ? 'FREE' : `$${info.costPer1k}/1K tokens`;
      console.log(`   ${task}: ${info.model} (${cost})`);
    });
  } catch (error) {
    console.log('❌ Router test failed:', error.message);
  }

  console.log('\n🎉 AI API testing complete!');
  console.log('\n💰 Cost Summary:');
  console.log('   • GPT-4o: $0.03/1K tokens (mood recommendations only)');
  console.log('   • Claude: $0.015/1K tokens (summaries, content)');
  console.log('   • Gemini: FREE (bulk operations, categorization)');
};

// Run the test
testAIAPIs().catch(console.error);