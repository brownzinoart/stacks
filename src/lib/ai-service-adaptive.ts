/**
 * Adaptive AI Service - Automatically chooses the right implementation
 * 
 * This service intelligently switches between:
 * - Original proxy-based service (for web development)
 * - Client-side direct API service (for iOS/static builds)
 * 
 * The service detects the environment and ensures 100% iOS compatibility
 */

import type { 
  RecommendationRequest, 
  RecommendationResponse,
  BookRecommendation,
  RecommendationCategory,
  UserAnalysis 
} from './ai-recommendation-service';

// Re-export types for compatibility
export type { 
  RecommendationRequest, 
  RecommendationResponse,
  BookRecommendation,
  RecommendationCategory,
  UserAnalysis 
};

/**
 * Environment detection utility
 */
class EnvironmentDetector {
  /**
   * Check if we're in a static export environment (iOS app)
   */
  static isStaticExport(): boolean {
    // In static exports, API routes don't exist
    // We can detect this by checking if we're in browser and certain conditions
    if (typeof window === 'undefined') {
      return false; // Server-side, use proxy routes
    }

    // Check for Capacitor (iOS app environment)
    if ((window as any).Capacitor) {
      console.log('[Environment] Detected Capacitor - using client-side AI service');
      return true;
    }

    // Check if API routes are available by testing a known route
    // This is a fallback detection method
    try {
      // If we're in a static export, fetch to API routes will fail immediately
      // But we don't want to actually make the request, so we check other indicators
      
      // Check if we have client-side API keys (indicates static export setup)
      const hasClientKeys = !!(
        process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
        process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
      );

      if (hasClientKeys) {
        console.log('[Environment] Detected client-side API keys - using client-side AI service');
        return true;
      }

      // Default to proxy routes for web development
      console.log('[Environment] Using proxy-based AI service for web development');
      return false;
    } catch (error) {
      console.log('[Environment] Error detecting environment, defaulting to client-side:', error);
      return true; // Safer to default to client-side
    }
  }

  /**
   * Check if API routes are available (async test)
   */
  static async testAPIRoutes(): Promise<boolean> {
    try {
      // Quick test to see if API routes exist
      const response = await fetch('/api/openai-proxy', {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(1000) // 1 second timeout
      });
      return response.ok;
    } catch (error) {
      console.log('[Environment] API routes not available:', error);
      return false;
    }
  }
}

/**
 * Adaptive AI Recommendation Service
 * Automatically selects the optimal implementation based on environment
 */
class AdaptiveAIRecommendationService {
  private serviceInstance: any = null;
  private serviceType: 'proxy' | 'client' | null = null;

  /**
   * Get the appropriate service instance
   */
  private async getService() {
    if (this.serviceInstance && this.serviceType) {
      return this.serviceInstance;
    }

    // Determine which service to use
    const useClientService = EnvironmentDetector.isStaticExport();

    if (useClientService) {
      console.log('[Adaptive AI] Loading client-side AI service for iOS compatibility');
      try {
        const { clientAIRecommendationService } = await import('./ai-client-service');
        this.serviceInstance = clientAIRecommendationService;
        this.serviceType = 'client';
        console.log('[Adaptive AI] ✅ Client-side AI service loaded successfully');
      } catch (error) {
        console.error('[Adaptive AI] Failed to load client-side service, falling back to proxy:', error);
        // Fallback to proxy service
        const { aiRecommendationService } = await import('./ai-recommendation-service');
        this.serviceInstance = aiRecommendationService;
        this.serviceType = 'proxy';
      }
    } else {
      console.log('[Adaptive AI] Loading proxy-based AI service for web development');
      try {
        const { aiRecommendationService } = await import('./ai-recommendation-service');
        this.serviceInstance = aiRecommendationService;
        this.serviceType = 'proxy';
        console.log('[Adaptive AI] ✅ Proxy-based AI service loaded successfully');
      } catch (error) {
        console.error('[Adaptive AI] Failed to load proxy service, falling back to client:', error);
        // Fallback to client service
        const { clientAIRecommendationService } = await import('./ai-client-service');
        this.serviceInstance = clientAIRecommendationService;
        this.serviceType = 'client';
      }
    }

    return this.serviceInstance;
  }

  /**
   * Get smart book recommendations - main API
   */
  async getSmartRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const service = await this.getService();
    console.log(`[Adaptive AI] Using ${this.serviceType} service for recommendations`);
    
    try {
      const result = await service.getSmartRecommendations(request);
      console.log(`[Adaptive AI] ✅ Recommendations successful via ${this.serviceType} service`);
      return result;
    } catch (error) {
      console.error(`[Adaptive AI] ❌ ${this.serviceType} service failed:`, error);
      
      // If proxy service fails, try client service as fallback
      if (this.serviceType === 'proxy') {
        console.log('[Adaptive AI] 🔄 Attempting fallback to client-side service');
        try {
          const { clientAIRecommendationService } = await import('./ai-client-service');
          const result = await clientAIRecommendationService.getSmartRecommendations(request);
          console.log('[Adaptive AI] ✅ Fallback to client service successful');
          
          // Update our service instance for future calls
          this.serviceInstance = clientAIRecommendationService;
          this.serviceType = 'client';
          
          return result;
        } catch (fallbackError) {
          console.error('[Adaptive AI] ❌ Fallback to client service also failed:', fallbackError);
          throw new Error('Both proxy and client AI services failed. Please check your configuration.');
        }
      }
      
      // If client service fails, no good fallback available
      throw error;
    }
  }

  /**
   * Cancel ongoing requests
   */
  async cancel(): Promise<void> {
    if (this.serviceInstance && this.serviceInstance.cancel) {
      await this.serviceInstance.cancel();
    }
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    if (this.serviceInstance && this.serviceInstance.clearCache) {
      await this.serviceInstance.clearCache();
    }
  }

  /**
   * Get service status and configuration info
   */
  async getServiceInfo(): Promise<{
    serviceType: 'proxy' | 'client' | null;
    isCapacitor: boolean;
    hasClientKeys: boolean;
    environment: string;
  }> {
    const isCapacitor = !!(typeof window !== 'undefined' && (window as any).Capacitor);
    const hasClientKeys = !!(
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
    );

    // Initialize service to determine type
    await this.getService();

    return {
      serviceType: this.serviceType,
      isCapacitor,
      hasClientKeys,
      environment: typeof window === 'undefined' ? 'server' : 'client',
    };
  }

  /**
   * Test both services and return compatibility report
   */
  async testServices(): Promise<{
    proxyService: { available: boolean; error?: string };
    clientService: { available: boolean; error?: string };
    recommendation: 'proxy' | 'client';
  }> {
    const results = {
      proxyService: { available: false, error: undefined as string | undefined },
      clientService: { available: false, error: undefined as string | undefined },
      recommendation: 'client' as 'proxy' | 'client',
    };

    // Test proxy service
    try {
      if (typeof window !== 'undefined') {
        const apiAvailable = await EnvironmentDetector.testAPIRoutes();
        results.proxyService.available = apiAvailable;
        if (!apiAvailable) {
          results.proxyService.error = 'API routes not accessible';
        }
      } else {
        results.proxyService.error = 'Server-side environment';
      }
    } catch (error) {
      results.proxyService.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test client service
    try {
      const hasKeys = !!(
        process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
        process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
      );
      
      if (hasKeys) {
        results.clientService.available = true;
      } else {
        results.clientService.error = 'No client-side API keys configured';
      }
    } catch (error) {
      results.clientService.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Determine recommendation
    const isCapacitor = !!(typeof window !== 'undefined' && (window as any).Capacitor);
    if (isCapacitor || !results.proxyService.available) {
      results.recommendation = 'client';
    } else {
      results.recommendation = 'proxy';
    }

    return results;
  }
}

// Export singleton instance
export const adaptiveAIService = new AdaptiveAIRecommendationService();

// Default export for backward compatibility
export default adaptiveAIService;