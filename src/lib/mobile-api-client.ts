/**
 * Mobile-optimized API client with enhanced error handling and retry logic
 */

interface MobileApiOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

class MobileApiClient {
  private isMobile: boolean;
  private defaultTimeout: number;
  
  constructor() {
    this.isMobile = this.detectMobile();
    this.defaultTimeout = this.isMobile ? 60000 : 30000; // 60s for mobile, 30s for desktop
  }
  
  private detectMobile(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const userAgent = navigator.userAgent || '';
      const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window;
      const smallScreen = window.innerWidth <= 768;
      
      return isMobileUA || (hasTouch && smallScreen);
    } catch {
      return false;
    }
  }
  
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error('Request timeout');
        error.name = 'TimeoutError';
        reject(error);
      }, timeout);
    });
  }
  
  async request<T = any>(
    url: string,
    options: RequestInit & MobileApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.isMobile ? 3 : 2,
      retryDelay = 1000,
      ...fetchOptions
    } = options;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add mobile-specific headers
        const headers = {
          'Content-Type': 'application/json',
          'X-Client-Type': this.isMobile ? 'mobile' : 'desktop',
          'X-Network-Info': this.getNetworkInfo(),
          ...fetchOptions.headers,
        };
        
        const controller = new AbortController();
        
        // Create fetch promise with timeout
        const fetchPromise = fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });
        
        const timeoutPromise = this.createTimeoutPromise(timeout);
        
        const response = await Promise.race([
          fetchPromise,
          timeoutPromise,
        ]);
        
        // Clear timeout
        controller.abort();
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        let data: T;
        
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as T;
        }
        
        return {
          success: true,
          data,
          status: response.status,
        };
        
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on certain errors
        if (
          error.name === 'AbortError' ||
          error.message?.includes('cancelled') ||
          (error.status >= 400 && error.status < 500) // Client errors
        ) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt);
          await this.delay(delay);
        }
      }
    }
    
    // All retries failed
    return {
      success: false,
      error: this.formatError(lastError),
    };
  }
  
  private getNetworkInfo(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return JSON.stringify({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      });
    }
    return 'unknown';
  }
  
  private formatError(error: Error | null): string {
    if (!error) return 'Unknown error occurred';
    
    if (error.name === 'TimeoutError') {
      return this.isMobile
        ? 'Request timed out. Mobile networks can be slower - please try again or connect to WiFi.'
        : 'Request timed out. Please check your internet connection and try again.';
    }
    
    if (error.message?.includes('fetch')) {
      return 'Network error. Please check your internet connection.';
    }
    
    if (error.message?.includes('JSON')) {
      return 'Server response error. Please try again.';
    }
    
    return error.message || 'An unexpected error occurred';
  }
  
  // Convenience methods
  async get<T = any>(url: string, options?: MobileApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  async post<T = any>(url: string, data?: any, options?: MobileApiOptions): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  // Health check for mobile connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/api/health', { timeout: 5000, retries: 1 });
      return response.success;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const mobileApiClient = new MobileApiClient();
export type { ApiResponse, MobileApiOptions };