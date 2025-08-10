/**
 * API Response Optimizer - Phase 3 Optimization
 * Implements response compression, caching, and optimization strategies
 */

import { LimitedCache } from './memory-manager';

// Response caching with intelligent TTL
const responseCache = new LimitedCache<string, any>(100);
const compressionCache = new LimitedCache<string, string>(50);

export interface OptimizedResponse<T = any> {
  data: T;
  cached: boolean;
  compressed: boolean;
  timestamp: number;
  ttl: number;
}

export interface CacheConfig {
  ttl: number;
  compress: boolean;
  key?: string;
}

/**
 * Default cache configurations for different API endpoints
 */
const DEFAULT_CACHE_CONFIGS: Record<string, CacheConfig> = {
  '/api/books/search': { ttl: 5 * 60 * 1000, compress: true }, // 5 minutes
  '/api/books/recommendations': { ttl: 15 * 60 * 1000, compress: true }, // 15 minutes
  '/api/library/availability': { ttl: 2 * 60 * 1000, compress: false }, // 2 minutes
  '/api/user/preferences': { ttl: 30 * 60 * 1000, compress: false }, // 30 minutes
  '/api/books/content': { ttl: 60 * 60 * 1000, compress: true }, // 1 hour
};

class APIOptimizer {
  /**
   * Optimized fetch wrapper with caching and compression
   */
  async optimizedFetch<T = any>(
    url: string,
    options: RequestInit = {},
    cacheConfig?: Partial<CacheConfig>
  ): Promise<OptimizedResponse<T>> {
    const config = this.getEffectiveConfig(url, cacheConfig);
    const cacheKey = this.generateCacheKey(url, options, config);
    
    // Try cache first
    const cachedResponse = this.getCachedResponse<T>(cacheKey, config.ttl);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Add optimized headers
    const optimizedOptions = this.addOptimizedHeaders(options);
    
    try {
      const response = await fetch(url, optimizedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const optimizedResponse = await this.createOptimizedResponse(data, config);
      
      // Cache the response
      this.setCachedResponse(cacheKey, optimizedResponse);
      
      return optimizedResponse;
    } catch (error) {
      // Return stale cache if available on error
      const staleResponse = responseCache.get(cacheKey);
      if (staleResponse) {
        console.warn('[API Optimizer] Using stale cache due to network error:', error);
        return { ...staleResponse, cached: true };
      }
      
      throw error;
    }
  }

  /**
   * Batch multiple API requests with smart deduplication
   */
  async batchRequests<T = any>(
    requests: Array<{ url: string; options?: RequestInit; config?: Partial<CacheConfig> }>
  ): Promise<OptimizedResponse<T>[]> {
    // Deduplicate identical requests
    const uniqueRequests = this.deduplicateRequests(requests);
    
    // Execute requests in parallel with concurrency limit
    const results = await this.executeWithConcurrencyLimit(
      uniqueRequests,
      5 // Max 5 concurrent requests
    );
    
    return results;
  }

  /**
   * Preload API responses based on user behavior
   */
  async preloadResponses(urls: string[]): Promise<void> {
    const preloadPromises = urls.map(async (url) => {
      try {
        await this.optimizedFetch(url, {}, { ttl: 10 * 60 * 1000 }); // 10 minute TTL
      } catch (error) {
        console.warn('[API Optimizer] Preload failed for:', url, error);
      }
    });
    
    await Promise.allSettled(preloadPromises);
  }

  /**
   * Intelligent response compression
   */
  private async compressResponse(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    const compressionKey = this.hash(jsonString);
    
    // Check compression cache
    const cached = compressionCache.get(compressionKey);
    if (cached) {
      return cached;
    }
    
    // Simple compression using deflate (in real implementation, use a proper library)
    const compressed = await this.deflateString(jsonString);
    compressionCache.set(compressionKey, compressed);
    
    return compressed;
  }

  /**
   * Decompress response data
   */
  private async decompressResponse(compressed: string): Promise<any> {
    const jsonString = await this.inflateString(compressed);
    return JSON.parse(jsonString);
  }

  private getEffectiveConfig(url: string, override?: Partial<CacheConfig>): CacheConfig {
    const pathname = new URL(url, window.location.origin).pathname;
    const defaultConfig = DEFAULT_CACHE_CONFIGS[pathname] || { 
      ttl: 5 * 60 * 1000, 
      compress: false 
    };
    
    return { ...defaultConfig, ...override };
  }

  private generateCacheKey(url: string, options: RequestInit, config: CacheConfig): string {
    const keyBase = config.key || `${url}:${JSON.stringify(options)}`;
    return this.hash(keyBase);
  }

  private getCachedResponse<T>(cacheKey: string, ttl: number): OptimizedResponse<T> | null {
    const cached = responseCache.get(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > ttl) {
      responseCache.clear(); // Clear expired entry
      return null;
    }
    
    return { ...cached, cached: true };
  }

  private setCachedResponse<T>(cacheKey: string, response: OptimizedResponse<T>): void {
    responseCache.set(cacheKey, response);
  }

  private async createOptimizedResponse<T>(
    data: T, 
    config: CacheConfig
  ): Promise<OptimizedResponse<T>> {
    let finalData = data;
    let compressed = false;
    
    if (config.compress && this.shouldCompress(data)) {
      try {
        const compressedData = await this.compressResponse(data);
        finalData = compressedData as T;
        compressed = true;
      } catch (error) {
        console.warn('[API Optimizer] Compression failed:', error);
      }
    }
    
    return {
      data: finalData,
      cached: false,
      compressed,
      timestamp: Date.now(),
      ttl: config.ttl
    };
  }

  private addOptimizedHeaders(options: RequestInit): RequestInit {
    const headers = new Headers(options.headers);
    
    // Add compression headers
    headers.set('Accept-Encoding', 'gzip, deflate, br');
    
    // Add cache control
    headers.set('Cache-Control', 'public, max-age=300');
    
    // Add performance hints
    headers.set('Priority', 'high');
    
    return { ...options, headers };
  }

  private shouldCompress(data: any): boolean {
    const jsonString = JSON.stringify(data);
    return jsonString.length > 1024; // Only compress responses > 1KB
  }

  private deduplicateRequests(
    requests: Array<{ url: string; options?: RequestInit; config?: Partial<CacheConfig> }>
  ): Array<{ url: string; options?: RequestInit; config?: Partial<CacheConfig> }> {
    const seen = new Set<string>();
    return requests.filter(req => {
      const key = `${req.url}:${JSON.stringify(req.options)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private async executeWithConcurrencyLimit<T>(
    requests: Array<{ url: string; options?: RequestInit; config?: Partial<CacheConfig> }>,
    limit: number
  ): Promise<OptimizedResponse<T>[]> {
    const results: OptimizedResponse<T>[] = [];
    const executing: Promise<void>[] = [];

    for (const request of requests) {
      const promise = this.optimizedFetch<T>(
        request.url, 
        request.options || {}, 
        request.config
      ).then(result => {
        results.push(result);
      });

      executing.push(promise);

      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  }

  // Simple hash function for cache keys
  private hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  // Simplified compression (in real implementation, use proper compression library)
  private async deflateString(str: string): Promise<string> {
    // This is a placeholder - in real implementation, use:
    // - CompressionStream API (modern browsers)
    // - pako library for broader support
    // - Server-side compression
    return btoa(str); // Base64 encoding as placeholder
  }

  private async inflateString(compressed: string): Promise<string> {
    // This is a placeholder - in real implementation, use proper decompression
    return atob(compressed); // Base64 decoding as placeholder
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    responseCache.clear();
    compressionCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { responseCache: number; compressionCache: number } {
    return {
      responseCache: responseCache.size(),
      compressionCache: compressionCache.size()
    };
  }
}

// Export singleton instance
export const apiOptimizer = new APIOptimizer();