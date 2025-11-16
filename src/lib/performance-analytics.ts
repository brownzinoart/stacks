/**
 * Performance Analytics - Phase 3 Optimization
 * Comprehensive performance monitoring and real user metrics collection
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface WebVitals {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
}

interface CustomMetrics {
  timeToInteractive: number | null;
  bundleLoadTime: number | null;
  apiResponseTime: number | null;
  memoryUsage: number | null;
  cacheHitRate: number | null;
}

class PerformanceAnalytics {
  private metrics: PerformanceMetric[] = [];
  private webVitals: WebVitals = {
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    TTFB: null
  };
  private customMetrics: CustomMetrics = {
    timeToInteractive: null,
    bundleLoadTime: null,
    apiResponseTime: null,
    memoryUsage: null,
    cacheHitRate: null
  };
  private observer?: PerformanceObserver;
  private isSupported = typeof window !== 'undefined' && 'performance' in window;

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (!this.isSupported) {
      console.warn('[Performance Analytics] Performance API not supported');
      return;
    }

    this.setupPerformanceObserver();
    this.measureWebVitals();
    this.measureCustomMetrics();
    this.setupReporting();
  }

  /**
   * Set up performance observer for various metrics
   */
  private setupPerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.processPerformanceEntry(entry);
      });
    });

    // Observe different types of performance entries
    try {
      this.observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift', 'first-input'] });
    } catch (error) {
      console.warn('[Performance Analytics] Some performance observers not supported:', error);
      
      // Fallback to individual observations
      this.setupFallbackObservations();
    }
  }

  /**
   * Setup fallback observations for older browsers
   */
  private setupFallbackObservations(): void {
    const supportedTypes = ['navigation', 'resource', 'paint'];
    
    supportedTypes.forEach(type => {
      try {
        this.observer?.observe({ entryTypes: [type] });
      } catch (error) {
        console.warn(`[Performance Analytics] ${type} observer not supported`);
      }
    });
  }

  /**
   * Process individual performance entries
   */
  private processPerformanceEntry(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: entry.name,
      value: entry.startTime + (entry.duration || 0),
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent
    };

    this.metrics.push(metric);

    // Process specific entry types
    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.processPaintEntry(entry as PerformancePaintTiming);
        break;
      case 'layout-shift':
        this.processLayoutShiftEntry(entry as any);
        break;
      case 'first-input':
        this.processFirstInputEntry(entry as any);
        break;
      case 'resource':
        this.processResourceEntry(entry as PerformanceResourceTiming);
        break;
    }
  }

  /**
   * Process navigation timing entries
   */
  private processNavigationEntry(entry: PerformanceNavigationTiming): void {
    this.webVitals.TTFB = entry.responseStart - entry.fetchStart;
    
    // Calculate Time to Interactive (simplified)
    this.customMetrics.timeToInteractive = entry.loadEventEnd - entry.fetchStart;
  }

  /**
   * Process paint timing entries
   */
  private processPaintEntry(entry: PerformancePaintTiming): void {
    if (entry.name === 'first-contentful-paint') {
      this.webVitals.FCP = entry.startTime;
    }
  }

  /**
   * Process layout shift entries for CLS
   */
  private processLayoutShiftEntry(entry: any): void {
    if (entry.value && !entry.hadRecentInput) {
      this.webVitals.CLS = (this.webVitals.CLS || 0) + entry.value;
    }
  }

  /**
   * Process first input entries for FID
   */
  private processFirstInputEntry(entry: any): void {
    this.webVitals.FID = entry.processingStart - entry.startTime;
  }

  /**
   * Process resource timing entries
   */
  private processResourceEntry(entry: PerformanceResourceTiming): void {
    // Track bundle load times
    if (entry.name.includes('/_next/static/')) {
      const loadTime = entry.responseEnd - entry.startTime;
      if (!this.customMetrics.bundleLoadTime || loadTime > this.customMetrics.bundleLoadTime) {
        this.customMetrics.bundleLoadTime = loadTime;
      }
    }

    // Track API response times
    if (entry.name.includes('/api/')) {
      const responseTime = entry.responseEnd - entry.requestStart;
      this.customMetrics.apiResponseTime = responseTime;
    }
  }

  /**
   * Measure Web Vitals using specialized APIs
   */
  private measureWebVitals(): void {
    // Measure LCP using Largest Contentful Paint API
    this.measureLCP();
    
    // Additional measurements
    this.measureMemoryUsage();
  }

  /**
   * Measure Largest Contentful Paint
   */
  private measureLCP(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.webVitals.LCP = lastEntry.startTime;
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Stop observing after page load
      window.addEventListener('load', () => {
        setTimeout(() => lcpObserver.disconnect(), 0);
      });
    } catch (error) {
      console.warn('[Performance Analytics] LCP measurement not supported:', error);
    }
  }

  /**
   * Measure memory usage
   */
  private measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.customMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  /**
   * Measure custom application metrics
   */
  private measureCustomMetrics(): void {
    // Measure cache hit rate (from API optimizer)
    this.measureCacheHitRate();
    
    // Set up continuous monitoring
    this.setupContinuousMonitoring();
  }

  /**
   * Measure cache hit rate from API calls
   */
  private measureCacheHitRate(): void {
    let totalRequests = 0;
    let cacheHits = 0;

    // Hook into fetch to track API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0] as string;
      
      if (url.includes('/api/')) {
        totalRequests++;
        
        // Check if response comes from cache
        const response = await originalFetch(...args);
        const cacheStatus = response.headers.get('x-cache-status');
        
        if (cacheStatus === 'hit' || response.headers.get('cache-control')?.includes('max-age')) {
          cacheHits++;
        }
        
        this.customMetrics.cacheHitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
        
        return response;
      }
      
      return originalFetch(...args);
    };
  }

  /**
   * Set up continuous performance monitoring
   */
  private setupContinuousMonitoring(): void {
    // Monitor every 30 seconds
    setInterval(() => {
      this.measureMemoryUsage();
      this.reportMetrics();
    }, 30000);
    
    // Report on page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });
    
    // Report before page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  /**
   * Set up performance reporting
   */
  private setupReporting(): void {
    // Report initial metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.reportMetrics();
      }, 1000);
    });
  }

  /**
   * Generate performance report
   */
  generateReport(): any {
    return {
      webVitals: this.webVitals,
      customMetrics: this.customMetrics,
      url: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      deviceInfo: this.getDeviceInfo(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Get connection information
   */
  private getConnectionInfo(): any {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (!connection) {
      return null;
    }
    
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): any {
    return {
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // LCP recommendations
    if (this.webVitals.LCP && this.webVitals.LCP > 2500) {
      recommendations.push('Optimize Largest Contentful Paint - consider image optimization and preloading');
    }
    
    // FID recommendations
    if (this.webVitals.FID && this.webVitals.FID > 100) {
      recommendations.push('Reduce First Input Delay - consider code splitting and reducing main thread work');
    }
    
    // CLS recommendations
    if (this.webVitals.CLS && this.webVitals.CLS > 0.1) {
      recommendations.push('Improve Cumulative Layout Shift - reserve space for dynamic content');
    }
    
    // Memory recommendations
    if (this.customMetrics.memoryUsage && this.customMetrics.memoryUsage > 50) {
      recommendations.push('High memory usage detected - consider memory optimization');
    }
    
    // Cache recommendations
    if (this.customMetrics.cacheHitRate !== null && this.customMetrics.cacheHitRate < 50) {
      recommendations.push('Low cache hit rate - optimize caching strategy');
    }
    
    return recommendations;
  }

  /**
   * Report metrics (in production, send to analytics service)
   */
  private reportMetrics(): void {
    const report = this.generateReport();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance Analytics] Report:', report);
    }
    
    // In production, send to analytics service
    // this.sendToAnalyticsService(report);
  }

  /**
   * Send metrics to analytics service (placeholder)
   */
  private sendToAnalyticsService(report: any): void {
    // Implementation would send data to your analytics service
    // Example: Google Analytics, DataDog, New Relic, etc.
    
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/analytics/performance', JSON.stringify(report));
    } else {
      fetch('/api/analytics/performance', {
        method: 'POST',
        body: JSON.stringify(report),
        headers: {
          'Content-Type': 'application/json'
        },
        keepalive: true
      }).catch(error => {
        console.warn('[Performance Analytics] Failed to send metrics:', error);
      });
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): { webVitals: WebVitals; customMetrics: CustomMetrics } {
    return {
      webVitals: { ...this.webVitals },
      customMetrics: { ...this.customMetrics }
    };
  }

  /**
   * Clear collected metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.webVitals = {
      FCP: null,
      LCP: null,
      FID: null,
      CLS: null,
      TTFB: null
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.observer?.disconnect();
  }
}

// Export singleton instance
export const performanceAnalytics = new PerformanceAnalytics();

// Auto-initialize
if (typeof window !== 'undefined') {
  performanceAnalytics.init();
}