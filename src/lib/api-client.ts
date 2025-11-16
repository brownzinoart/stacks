/**
 * API client that works for both web and mobile environments
 * Handles API calls with proper error handling and mobile compatibility
 */

import { apiCall, getApiBaseUrl } from './api-config';

// Compatibility helpers
const isCapacitor = () => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.Capacitor ||
    (window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'
  );
};

const getApiUrl = () => getApiBaseUrl();
const mobileFetch = async (url: string, options?: RequestInit) => {
  // Use the apiCall helper which handles mobile/web differences
  const endpoint = url.replace(getApiBaseUrl(), '');
  return fetch(url, options);
};

// Configuration for AI API endpoints
const API_CONFIG = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    keyEnv: 'NEXT_PUBLIC_OPENAI_API_KEY',
  },
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    keyEnv: 'NEXT_PUBLIC_ANTHROPIC_API_KEY',
  },
};

// Enhanced AI API client with support for all three models
export const callAIAPI = async (provider: 'openai' | 'anthropic' | 'vertex', payload: any) => {
  // All requests route through Next.js API routes
  let endpoint = `/api/${provider}-proxy`;
  if (provider === 'vertex') {
    endpoint = '/api/vertex-ai-proxy';
  }
  
  const url = `${getApiUrl()}${endpoint}`;
  const response = await mobileFetch(url, {
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

// API calls - all routed through Next.js API routes
export const api = {
  // Search books
  searchBooks: async (query: string, limit = 20, source = 'all') => {
    const url = `${getApiUrl()}/api/books/search?q=${encodeURIComponent(query)}&limit=${limit}&source=${source}`;
    const response = await mobileFetch(url);

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    return response.json();
  },

  // Get AI recommendations
  getRecommendations: async (mood?: string, preferences?: any, limit = 10) => {
    if (mood) {
      // POST for mood-based recommendations
      const url = `${getApiUrl()}/api/books/recommendations`;
      const response = await mobileFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, preferences, limit }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return response.json();
    } else {
      // GET for default recommendations
      const url = `${getApiUrl()}/api/books/recommendations?limit=${limit}`;
      const response = await mobileFetch(url);

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return response.json();
    }
  },

  // User preferences
  getUserPreferences: async (userId?: string) => {
    const url = userId 
      ? `${getApiUrl()}/api/user/preferences?user_id=${userId}`
      : `${getApiUrl()}/api/user/preferences`;
    const response = await mobileFetch(url);

    if (!response.ok) {
      throw new Error('Failed to get preferences');
    }

    return response.json();
  },

  updateUserPreferences: async (userId: string, preferences: any) => {
    const url = `${getApiUrl()}/api/user/preferences`;
    const response = await mobileFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, preferences }),
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }

    return response.json();
  },

  // User queue operations
  getUserQueue: async (userId: string) => {
    const url = `${getApiUrl()}/api/user/queue?user_id=${userId}`;
    const response = await mobileFetch(url);

    if (!response.ok) {
      throw new Error('Failed to get queue');
    }

    return response.json();
  },

  addToQueue: async (userId: string, book: { title: string; author: string; isbn?: string; cover_url?: string }) => {
    const url = `${getApiUrl()}/api/user/queue`;
    const response = await mobileFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, ...book }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to queue');
    }

    return response.json();
  },

  removeFromQueue: async (userId: string, itemId: string) => {
    const url = `${getApiUrl()}/api/user/queue?user_id=${userId}&item_id=${itemId}`;
    const response = await mobileFetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove from queue');
    }

    return response.json();
  },
};
