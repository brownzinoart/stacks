/**
 * Real-time Book Cover Analytics Dashboard
 * Shows current performance metrics and health status
 */

'use client';

import { useState, useEffect } from 'react';
import { bookCoverAnalytics } from '@/lib/book-cover-analytics';

interface DashboardData {
  summary: any;
  sourcePerformance: any[];
  health: any;
  lastUpdate: number;
}

export const CoverAnalyticsDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      const summary = bookCoverAnalytics.getSummary(24); // Last 24 hours
      const sourcePerformance = bookCoverAnalytics.getSourcePerformance();
      const health = bookCoverAnalytics.getHealthStatus();
      
      setData({
        summary,
        sourcePerformance,
        health,
        lastUpdate: Date.now(),
      });
    } catch (error) {
      console.error('Failed to refresh analytics data:', error);
    }
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshData();
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good': return 'text-blue-700 bg-blue-100';
      case 'fair': return 'text-yellow-700 bg-yellow-100';
      case 'poor': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  const { summary, sourcePerformance, health } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cover Performance Dashboard</h2>
          <p className="text-gray-600">Real-time monitoring of book cover system</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Last updated: {new Date(data.lastUpdate).toLocaleTimeString()}
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-3 py-1 text-sm rounded transition-all ${
              isRefreshing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isRefreshing ? '↻' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Health Status */}
      <div className={`p-4 rounded-lg border ${getHealthColor(health.status)}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getHealthIcon(health.status)}</span>
          <div>
            <h3 className="font-semibold capitalize">{health.status} Status</h3>
            {health.issues.length > 0 ? (
              <ul className="text-sm mt-1 space-y-1">
                {health.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">All systems operating normally</p>
            )}
          </div>
        </div>
        
        {health.recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <h4 className="text-sm font-medium mb-1">Recommendations:</h4>
            <ul className="text-sm space-y-1">
              {health.recommendations.map((rec: string, index: number) => (
                <li key={index}>💡 {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {summary.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
          <div className="text-xs text-gray-500">
            {summary.totalRequests} requests (24h)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {summary.averageLoadTime.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600">Avg Load Time</div>
          <div className="text-xs text-gray-500">
            P90: {summary.performanceMetrics.p90LoadTime}ms
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(summary.sourceBreakdown).length}
          </div>
          <div className="text-sm text-gray-600">Active Sources</div>
          <div className="text-xs text-gray-500">
            Cover providers
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {Object.keys(summary.errorTypes).length}
          </div>
          <div className="text-sm text-gray-600">Error Types</div>
          <div className="text-xs text-gray-500">
            Unique failures
          </div>
        </div>
      </div>

      {/* Source Performance */}
      {sourcePerformance.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Source Performance</h3>
            <p className="text-sm text-gray-600">Success rates and performance by cover source</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Source</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Requests</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Success Rate</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Avg Load Time</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Reliability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sourcePerformance.map((source, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {source.source.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {source.requests}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {source.successRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {source.avgLoadTime.toFixed(0)}ms
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getReliabilityColor(source.reliability)}`}>
                        {source.reliability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Issues */}
      {summary.recentIssues.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Issues</h3>
            <p className="text-sm text-gray-600">Latest failures and problems</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {summary.recentIssues.slice(0, 5).map((issue: any, index: number) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">&quot;{issue.title}&quot;</h4>
                    <p className="text-sm text-gray-600">by {issue.author}</p>
                    {issue.error && (
                      <p className="text-sm text-red-600 mt-1">{issue.error}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(issue.timestamp).toLocaleTimeString()}
                    </div>
                    {issue.retryCount > 0 && (
                      <div className="text-xs text-yellow-600">
                        {issue.retryCount} retries
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            const data = bookCoverAnalytics.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cover-analytics-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          📊 Export Data
        </button>
        
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all analytics data?')) {
              bookCoverAnalytics.clearData();
              refreshData();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          🗑️ Clear Data
        </button>
      </div>
    </div>
  );
};