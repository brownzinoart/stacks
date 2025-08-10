/**
 * Performance monitoring for AR features
 * Tracks memory usage, processing times, and user experience metrics
 */

interface PerformanceMetrics {
  ocrProcessingTime: number;
  memoryUsageMB: number;
  cacheHitRate: number;
  recognitionAccuracy: number;
  batteryImpact: 'low' | 'medium' | 'high';
  timestamp: number;
}

class ARPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTimes = new Map<string, number>();
  private totalOCRRequests = 0;
  private cacheHits = 0;

  /**
   * Start timing an operation
   */
  startTiming(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  /**
   * End timing and record duration
   */
  endTiming(operation: string): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.startTimes.delete(operation);
    
    console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * Record OCR processing metrics
   */
  recordOCRProcessing(processingTime: number, booksFound: number): void {
    this.totalOCRRequests++;
    
    const metrics: PerformanceMetrics = {
      ocrProcessingTime: processingTime,
      memoryUsageMB: this.getMemoryUsage(),
      cacheHitRate: this.getCacheHitRate(),
      recognitionAccuracy: booksFound > 0 ? 1 : 0, // Simplified
      batteryImpact: this.estimateBatteryImpact(processingTime),
      timestamp: Date.now(),
    };
    
    this.metrics.push(metrics);
    
    // Keep only last 50 metrics
    if (this.metrics.length > 50) {
      this.metrics.shift();
    }
  }

  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * Get current memory usage (approximation)
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  /**
   * Calculate cache hit rate
   */
  private getCacheHitRate(): number {
    return this.totalOCRRequests > 0 ? this.cacheHits / this.totalOCRRequests : 0;
  }

  /**
   * Estimate battery impact based on processing time
   */
  private estimateBatteryImpact(processingTime: number): 'low' | 'medium' | 'high' {
    if (processingTime < 1000) return 'low';
    if (processingTime < 3000) return 'medium';
    return 'high';
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    avgOCRTime: number;
    avgMemoryUsage: number;
    cacheHitRate: number;
    avgRecognitionAccuracy: number;
    recommendedOptimizations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        avgOCRTime: 0,
        avgMemoryUsage: 0,
        cacheHitRate: 0,
        avgRecognitionAccuracy: 0,
        recommendedOptimizations: [],
      };
    }

    const avgOCRTime = this.metrics.reduce((sum, m) => sum + m.ocrProcessingTime, 0) / this.metrics.length;
    const avgMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsageMB, 0) / this.metrics.length;
    const cacheHitRate = this.getCacheHitRate();
    const avgRecognitionAccuracy = this.metrics.reduce((sum, m) => sum + m.recognitionAccuracy, 0) / this.metrics.length;

    const optimizations: string[] = [];
    
    if (avgOCRTime > 2000) {
      optimizations.push('Consider reducing image resolution or preprocessing');
    }
    
    if (avgMemoryUsage > 100) {
      optimizations.push('High memory usage detected - check for memory leaks');
    }
    
    if (cacheHitRate < 0.3) {
      optimizations.push('Low cache hit rate - consider extending cache TTL');
    }
    
    if (avgRecognitionAccuracy < 0.5) {
      optimizations.push('Low recognition accuracy - improve image quality or OCR settings');
    }

    return {
      avgOCRTime: Math.round(avgOCRTime),
      avgMemoryUsage: Math.round(avgMemoryUsage),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      avgRecognitionAccuracy: Math.round(avgRecognitionAccuracy * 100) / 100,
      recommendedOptimizations: optimizations,
    };
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      detailedMetrics: this.metrics.slice(-10), // Last 10 measurements
    }, null, 2);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = [];
    this.startTimes.clear();
    this.totalOCRRequests = 0;
    this.cacheHits = 0;
  }
}

// Export singleton instance
export const performanceMonitor = new ARPerformanceMonitor();