/**
 * Book Cover Analytics Service
 * Tracks success rates, performance metrics, and issues
 */

interface CoverAnalytics {
  timestamp: number;
  title: string;
  author: string;
  isbn?: string;
  source: string;
  confidence: number;
  loadTime: number;
  success: boolean;
  error?: string;
  retryCount: number;
}

interface AnalyticsSummary {
  totalRequests: number;
  successRate: number;
  averageLoadTime: number;
  sourceBreakdown: Record<string, { count: number; successRate: number }>;
  errorTypes: Record<string, number>;
  recentIssues: CoverAnalytics[];
  performanceMetrics: {
    p50LoadTime: number;
    p90LoadTime: number;
    p99LoadTime: number;
  };
}

class BookCoverAnalyticsService {
  private static instance: BookCoverAnalyticsService;
  private analytics: CoverAnalytics[] = [];
  private readonly MAX_ENTRIES = 10000; // Keep last 10k entries
  private readonly STORAGE_KEY = 'book_cover_analytics';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): BookCoverAnalyticsService {
    if (!BookCoverAnalyticsService.instance) {
      BookCoverAnalyticsService.instance = new BookCoverAnalyticsService();
    }
    return BookCoverAnalyticsService.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.analytics = data.slice(-this.MAX_ENTRIES); // Keep only recent entries
      }
    } catch (error) {
      console.error('Failed to load analytics from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      // Only keep recent entries
      const recentAnalytics = this.analytics.slice(-this.MAX_ENTRIES);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentAnalytics));
    } catch (error) {
      console.error('Failed to save analytics to storage:', error);
    }
  }

  recordRequest(data: {
    title: string;
    author: string;
    isbn?: string;
    source: string;
    confidence: number;
    loadTime: number;
    success: boolean;
    error?: string;
    retryCount?: number;
  }): void {
    const entry: CoverAnalytics = {
      timestamp: Date.now(),
      ...data,
      retryCount: data.retryCount || 0,
    };

    this.analytics.push(entry);

    // Keep array size manageable
    if (this.analytics.length > this.MAX_ENTRIES) {
      this.analytics = this.analytics.slice(-this.MAX_ENTRIES);
    }

    this.saveToStorage();

    // Log important events
    if (!data.success) {
      console.warn(`📊 Cover failed: "${data.title}" - ${data.error || 'Unknown error'}`);
    } else if (data.retryCount && data.retryCount > 0) {
      console.log(`📊 Cover recovered after ${data.retryCount} retries: "${data.title}"`);
    }
  }

  getSummary(timeRangeHours = 24): AnalyticsSummary {
    const cutoff = Date.now() - (timeRangeHours * 60 * 60 * 1000);
    const recentEntries = this.analytics.filter(entry => entry.timestamp > cutoff);

    if (recentEntries.length === 0) {
      return {
        totalRequests: 0,
        successRate: 0,
        averageLoadTime: 0,
        sourceBreakdown: {},
        errorTypes: {},
        recentIssues: [],
        performanceMetrics: { p50LoadTime: 0, p90LoadTime: 0, p99LoadTime: 0 }
      };
    }

    const totalRequests = recentEntries.length;
    const successfulRequests = recentEntries.filter(e => e.success).length;
    const successRate = (successfulRequests / totalRequests) * 100;
    
    const loadTimes = recentEntries.map(e => e.loadTime).sort((a, b) => a - b);
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    
    // Calculate percentiles
    const p50Index = Math.floor(loadTimes.length * 0.5);
    const p90Index = Math.floor(loadTimes.length * 0.9);
    const p99Index = Math.floor(loadTimes.length * 0.99);
    
    const performanceMetrics = {
      p50LoadTime: loadTimes[p50Index] || 0,
      p90LoadTime: loadTimes[p90Index] || 0,
      p99LoadTime: loadTimes[p99Index] || 0,
    };

    // Source breakdown
    const sourceBreakdown: Record<string, { count: number; successRate: number }> = {};
    recentEntries.forEach(entry => {
      if (!sourceBreakdown[entry.source]) {
        sourceBreakdown[entry.source] = { count: 0, successRate: 0 };
      }
      sourceBreakdown[entry.source]!.count++;
    });

    // Calculate success rate per source
    Object.keys(sourceBreakdown).forEach(source => {
      const sourceEntries = recentEntries.filter(e => e.source === source);
      const sourceSuccesses = sourceEntries.filter(e => e.success).length;
      sourceBreakdown[source]!.successRate = (sourceSuccesses / sourceEntries.length) * 100;
    });

    // Error types
    const errorTypes: Record<string, number> = {};
    recentEntries.filter(e => !e.success && e.error).forEach(entry => {
      const errorKey = entry.error || 'Unknown';
      errorTypes[errorKey] = (errorTypes[errorKey] || 0) + 1;
    });

    // Recent issues (last 10 failures)
    const recentIssues = recentEntries
      .filter(e => !e.success)
      .slice(-10)
      .reverse();

    return {
      totalRequests,
      successRate,
      averageLoadTime,
      sourceBreakdown,
      errorTypes,
      recentIssues,
      performanceMetrics,
    };
  }

  getSourcePerformance(): Array<{
    source: string;
    requests: number;
    successRate: number;
    avgLoadTime: number;
    reliability: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    const summary = this.getSummary(168); // Last week
    
    return Object.entries(summary.sourceBreakdown).map(([source, data]) => {
      const sourceEntries = this.analytics.filter(e => e.source === source);
      const avgLoadTime = sourceEntries.reduce((sum, e) => sum + e.loadTime, 0) / sourceEntries.length;
      
      let reliability: 'excellent' | 'good' | 'fair' | 'poor';
      if (data.successRate >= 95) reliability = 'excellent';
      else if (data.successRate >= 85) reliability = 'good';
      else if (data.successRate >= 70) reliability = 'fair';
      else reliability = 'poor';

      return {
        source,
        requests: data.count,
        successRate: data.successRate,
        avgLoadTime,
        reliability,
      };
    }).sort((a, b) => b.successRate - a.successRate);
  }

  clearData(): void {
    this.analytics = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  exportData(): string {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      summary: this.getSummary(168), // Last week
      fullData: this.analytics.slice(-1000), // Last 1000 entries
    }, null, 2);
  }

  // Real-time monitoring
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const summary = this.getSummary(1); // Last hour
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (summary.totalRequests === 0) {
      return {
        status: 'healthy',
        issues: ['No recent activity'],
        recommendations: ['System is ready']
      };
    }

    // Check success rate
    if (summary.successRate < 90) {
      issues.push(`Success rate is ${summary.successRate.toFixed(1)}% (target: >90%)`);
    }

    // Check load times
    if (summary.averageLoadTime > 3000) {
      issues.push(`Average load time is ${summary.averageLoadTime.toFixed(0)}ms (target: <3s)`);
    }

    // Check for recurring errors
    const topError = Object.entries(summary.errorTypes)[0];
    if (topError && topError[1] > 3) {
      issues.push(`Frequent error: "${topError[0]}" (${topError[1]} occurrences)`);
    }

    // Generate recommendations
    if (summary.successRate < 95) {
      recommendations.push('Consider adding more image sources to the fallback chain');
    }
    
    if (summary.averageLoadTime > 2000) {
      recommendations.push('Implement image URL pre-validation to reduce failed requests');
    }

    const status = issues.length === 0 ? 'healthy' : 
                  issues.length <= 2 ? 'degraded' : 'critical';

    return { status, issues, recommendations };
  }
}

export const bookCoverAnalytics = BookCoverAnalyticsService.getInstance();