'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestSearchPage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  const testAPI = async () => {
    setStatus('Testing...');
    setError('');
    setResponse('');

    try {
      console.log('Starting test...');
      const res = await axios.post('/api/openai-proxy', {
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
      });

      console.log('Response:', res.data);
      setStatus('Success!');
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      console.error('Error:', err);
      setStatus('Failed');
      setError(err.message + '\n' + (err.response?.data ? JSON.stringify(err.response.data) : ''));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button
        onClick={testAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test API
      </button>

      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        {error && (
          <div>
            <strong>Error:</strong>
            <pre className="bg-red-100 p-2 mt-2">{error}</pre>
          </div>
        )}

        {response && (
          <div>
            <strong>Response:</strong>
            <pre className="bg-green-100 p-2 mt-2 text-xs overflow-auto">{response}</pre>
          </div>
        )}

        <div>
          <strong>Debug Info:</strong>
          <pre className="bg-gray-100 p-2 mt-2 text-xs">
{`User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
Online: ${typeof navigator !== 'undefined' ? navigator.onLine : 'N/A'}
Location: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`}
          </pre>
        </div>
      </div>
    </div>
  );
}