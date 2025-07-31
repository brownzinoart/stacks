/**
 * API client that works for both web and mobile environments
 * Handles API calls with proper error handling and mobile compatibility
 */

import { mobileFetch, isCapacitor, getApiUrl } from './mobile-api';

// Configuration for different API endpoints
const API_CONFIG = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    keyEnv: 'NEXT_PUBLIC_OPENAI_API_KEY',
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    keyEnv: 'NEXT_PUBLIC_ANTHROPIC_API_KEY',
  },
  backend: {
    url: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  },
};

// For mobile apps, we'll need to use a backend proxy since API keys can't be exposed
// This is a simplified version - in production, use your backend API
export const callAIAPI = async (provider: 'openai' | 'anthropic', payload: any) => {
  if (isCapacitor()) {
    // For mobile, route through your backend
    const backendUrl = `${API_CONFIG.backend.url}/api/ai/${provider}`;
    const response = await mobileFetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI API call failed: ${response.status}`);
    }

    return response.json();
  } else {
    // For web development, use the Next.js API route
    const response = await fetch(`/api/${provider}-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI API call failed: ${response.status}`);
    }

    return response.json();
  }
};

// Example: Call OpenAI for book recommendations
export const getBookRecommendations = async (prompt: string) => {
  const payload = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful library assistant that recommends books based on mood and preferences.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  };

  return callAIAPI('openai', payload);
};

// Backend API calls
export const backendAPI = {
  // Search books
  searchBooks: async (query: string) => {
    const url = `${getApiUrl()}/api/books/search?q=${encodeURIComponent(query)}`;
    const response = await mobileFetch(url);

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    return response.json();
  },

  // Get library availability
  getAvailability: async (isbn: string, libraryId: string) => {
    const url = `${getApiUrl()}/api/availability/${isbn}?library=${libraryId}`;
    const response = await mobileFetch(url);

    if (!response.ok) {
      throw new Error('Failed to get availability');
    }

    return response.json();
  },

  // User queue operations
  addToQueue: async (bookId: string, userId: string) => {
    const url = `${getApiUrl()}/api/queue`;
    const response = await mobileFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to queue');
    }

    return response.json();
  },
};
