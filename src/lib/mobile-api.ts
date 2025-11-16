/**
 * Mobile API handler for Capacitor
 * Handles API requests in mobile environment with proper CORS and authentication
 */

// Type declarations for Capacitor
interface CapacitorWindow extends Window {
  Capacitor?: any;
}

declare const window: CapacitorWindow;

// Check if we're running in Capacitor
export const isCapacitor = () => {
  return typeof window !== 'undefined' && window.Capacitor !== undefined;
};

// Get the API base URL based on environment
export const getApiUrl = () => {
  if (isCapacitor()) {
    // Use production API URL for mobile apps
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.stacks-library.com';
  }
  // Use relative URLs for web
  return '';
};

// Mobile-safe fetch wrapper with enhanced error handling
export const mobileFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  if (!isCapacitor()) {
    // Use regular fetch for web
    return fetch(url, options);
  }

  // For mobile, we'll use regular fetch but with absolute URLs
  // In a real app, you'd use Capacitor HTTP plugin
  const fullUrl = url.startsWith('http') ? url : `${getApiUrl()}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      // Add mobile-specific headers
      headers: {
        ...options?.headers,
        'User-Agent': 'StacksMobileApp/1.0',
      }
    });
    
    return response;
  } catch (error: unknown) {
    console.error('[Mobile Fetch] API request failed:', error);
    
    // Enhanced error messages for mobile users
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (errorMessage.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

// Helper to make API calls with proper mobile handling
export const apiCall = async <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${getApiUrl()}/api${endpoint}`;

  const response = await mobileFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
};
