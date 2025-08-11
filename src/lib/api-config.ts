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
    // IMPORTANT: Update this to your computer's actual IP address
    const devServerIp = '192.168.86.190'; // Your Mac's IP from earlier
    const actualPort = '3000';
    const baseUrl = `http://${devServerIp}:${actualPort}`;
    
    console.log('[API Config] Using mobile base URL:', baseUrl);
    console.log('[API Config] Dev server should be running with: npm run dev');
    console.log('[API Config] Make sure your dev server is accessible from your phone');
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
        'X-Requested-With': 'XMLHttpRequest', // Help with CORS
        ...options.headers,
      },
      // Add timeout for mobile networks
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('[API] Request failed:', error);

    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw new Error('Request timeout. Please check your connection and try again.');
    }

    // Provide helpful error messages for common issues
    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
      if (isCapacitor()) {
        throw new Error(
          'Cannot connect to server. Make sure your development server is running and accessible from your phone.'
        );
      }
      throw new Error('Network error. Please check your internet connection.');
    }

    throw error;
  }
}

// Helper for checking network connectivity
export function checkNetworkConnectivity(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.onLine) {
      resolve(false);
      return;
    }

    // Try to fetch a small resource to verify connectivity
    fetch('/manifest.json', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}
