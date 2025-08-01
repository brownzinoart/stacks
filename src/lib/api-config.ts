/**
 * API configuration for different environments
 */

// Detect if running in Capacitor (mobile app)
const isCapacitor = () => {
  if (typeof window === 'undefined') return false;
  
  // Check multiple ways to detect Capacitor
  return !!(
    window.Capacitor ||
    (window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'
  );
};

// Get the base URL for API calls
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  
  // Log detection info
  console.log('[API Config] Detection info:', {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    hasCapacitor: !!window.Capacitor,
    isCapacitorDetected: isCapacitor(),
    devServerIp: process.env.NEXT_PUBLIC_DEV_SERVER_IP,
  });
  
  if (isCapacitor()) {
    // Mobile app - use your computer's IP address
    const devServerIp = process.env.NEXT_PUBLIC_DEV_SERVER_IP || '192.168.1.100';
    const devPort = process.env.NEXT_PUBLIC_DEV_PORT || '3000';
    const baseUrl = `http://${devServerIp}:${devPort}`;
    console.log('[API Config] Using mobile base URL:', baseUrl);
    return baseUrl;
  }
  
  // Web browser
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  console.log('[API Config] Using web base URL:', baseUrl);
  return baseUrl;
}

// Helper to make API calls with proper error handling
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log('[API] Making request to:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('[API] Request failed:', error);
    
    // Provide helpful error messages for common issues
    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
      if (isCapacitor()) {
        throw new Error('Cannot connect to server. Make sure your development server is running and accessible from your phone.');
      }
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
}