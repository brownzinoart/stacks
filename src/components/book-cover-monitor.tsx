/**
 * Book Cover Success Rate Monitor
 * Tracks and displays cover success rates in real-time
 */

'use client';

import { useState, useEffect } from 'react';
import { BookCover } from './book-cover';
import { CoverAnalyticsDashboard } from './cover-analytics-dashboard';

interface CoverTest {
  title: string;
  author: string;
  isbn?: string;
  expected: 'success' | 'ai' | 'gradient';
  category: string;
}

interface TestResult {
  test: CoverTest;
  result: 'success' | 'failed' | 'fallback' | 'testing';
  source?: string;
  confidence?: number;
  loadTime?: number;
  error?: string;
}

interface MonitorStats {
  total: number;
  successful: number;
  failed: number;
  fallbacks: number;
  successRate: number;
  avgLoadTime: number;
  sourceBreakdown: Record<string, number>;
}

const COMPREHENSIVE_TEST_BOOKS: CoverTest[] = [
  // Popular books - should hit Google Books or OpenLibrary
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780141182636', expected: 'success', category: 'Classic' },
  { title: '1984', author: 'George Orwell', isbn: '9780451524935', expected: 'success', category: 'Classic' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', expected: 'success', category: 'Classic' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', expected: 'success', category: 'Classic' },
  
  // Contemporary popular books
  { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', expected: 'success', category: 'Contemporary' },
  { title: 'Atomic Habits', author: 'James Clear', expected: 'success', category: 'Self-Help' },
  { title: 'The Silent Patient', author: 'Alex Michaelides', expected: 'success', category: 'Thriller' },
  { title: 'Where the Crawdads Sing', author: 'Delia Owens', expected: 'success', category: 'Fiction' },
  
  // Made-up books - should use AI generation or fallback
  { title: 'The Future of Bootstrap Success', author: 'Claude AI', expected: 'ai', category: 'Fictional' },
  { title: 'Cost-Optimized API Strategies', author: 'The Specialist', expected: 'ai', category: 'Fictional' },
  
  // Edge cases
  { title: 'Book with "Quotes" and & Symbols!', author: 'Special Characters', expected: 'gradient', category: 'Edge Case' },
  { title: 'Very Long Title That Goes On And On', author: 'Long Name Author', expected: 'gradient', category: 'Edge Case' },
];

export const BookCoverMonitor = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'testing' | 'analytics'>('testing');

  const categories = ['All', ...new Set(COMPREHENSIVE_TEST_BOOKS.map(book => book.category))];

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setStats(null);

    const testResults: TestResult[] = [];

    // Initialize all tests as "testing"
    const initialResults: TestResult[] = COMPREHENSIVE_TEST_BOOKS.map(test => ({
      test,
      result: 'testing',
    }));
    setResults([...initialResults]);

    // Run tests with staggered timing
    for (let i = 0; i < COMPREHENSIVE_TEST_BOOKS.length; i++) {
      const test = COMPREHENSIVE_TEST_BOOKS[i]!;
      
      try {
        const startTime = Date.now();
        console.log(`🧪 Testing: ${test.title} by ${test.author}`);
        
        // Get cover from service
        const result = await import('@/lib/book-cover-service').then(mod => 
          mod.bookCoverService.getCover(test)
        );
        
        const loadTime = Date.now() - startTime;
        
        // Determine result type
        let resultType: 'success' | 'failed' | 'fallback';
        if (result.url.startsWith('http')) {
          resultType = 'success';
        } else if (result.url.startsWith('ai_description:') || result.url.startsWith('gradient:')) {
          resultType = 'fallback';
        } else {
          resultType = 'failed';
        }

        const testResult: TestResult = {
          test,
          result: resultType,
          source: result.source,
          confidence: result.confidence,
          loadTime,
        };

        testResults.push(testResult);
        
        // Update results incrementally
        setResults(prev => 
          prev.map((r, idx) => idx === i ? testResult : r)
        );

      } catch (error) {
        console.error(`Test failed for ${test.title}:`, error);
        const testResult: TestResult = {
          test,
          result: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          loadTime: 0,
        };
        testResults.push(testResult);
        
        setResults(prev => 
          prev.map((r, idx) => idx === i ? testResult : r)
        );
      }

      // Stagger requests
      if (i < COMPREHENSIVE_TEST_BOOKS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Calculate final stats
    const successful = testResults.filter(r => r.result === 'success').length;
    const failed = testResults.filter(r => r.result === 'failed').length;
    const fallbacks = testResults.filter(r => r.result === 'fallback').length;
    const total = testResults.length;
    const successRate = ((successful + fallbacks) / total) * 100;
    const avgLoadTime = testResults.reduce((sum, r) => sum + (r.loadTime || 0), 0) / total;

    const sourceBreakdown = testResults.reduce((acc, r) => {
      if (r.source) {
        acc[r.source] = (acc[r.source] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    setStats({
      total,
      successful,
      failed,
      fallbacks,
      successRate,
      avgLoadTime,
      sourceBreakdown,
    });

    setIsRunning(false);
  };

  const filteredResults = selectedCategory === 'All' 
    ? results 
    : results.filter(r => r.test.category === selectedCategory);

  const getResultColor = (result: TestResult['result']) => {
    switch (result) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'fallback': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'testing': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getResultIcon = (result: TestResult['result']) => {
    switch (result) {
      case 'success': return '✅';
      case 'fallback': return '🔄';
      case 'failed': return '❌';
      case 'testing': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📊 Book Cover Success Rate Monitor
        </h1>
        <p className="text-gray-600 mb-6">
          Comprehensive testing and monitoring of book cover fetching system.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('testing')}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'testing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🧪 Comprehensive Testing
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📈 Real-time Analytics
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <CoverAnalyticsDashboard />
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div>
          {/* Controls */}
          <div className="flex gap-4 items-center mb-6">
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                isRunning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }`}
            >
              {isRunning ? '🔄 Testing...' : '🚀 Run Comprehensive Test'}
            </button>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stats Dashboard */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="text-2xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-xs text-gray-500">
                  {stats.successful} real + {stats.fallbacks} fallbacks
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="text-2xl font-bold text-blue-600">{stats.successful}</div>
                <div className="text-sm text-gray-600">Real Covers</div>
                <div className="text-xs text-gray-500">From APIs</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="text-2xl font-bold text-purple-600">{stats.fallbacks}</div>
                <div className="text-sm text-gray-600">Smart Fallbacks</div>
                <div className="text-xs text-gray-500">AI + Gradient</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="text-2xl font-bold text-orange-600">{stats.avgLoadTime.toFixed(0)}ms</div>
                <div className="text-sm text-gray-600">Avg Load Time</div>
                <div className="text-xs text-gray-500">Per request</div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {filteredResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((result, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <BookCover
                      title={result.test.title}
                      author={result.test.author}
                      isbn={result.test.isbn}
                      className="w-16 h-20 flex-shrink-0"
                      showSource={true}
                    />
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                        {result.test.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        by {result.test.author}
                      </p>
                      <div className="text-xs text-gray-500">
                        {result.test.category}
                      </div>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getResultColor(result.result)}`}>
                    {getResultIcon(result.result)} {result.result.toUpperCase()}
                  </div>

                  {result.source && (
                    <div className="mt-2 text-xs text-gray-600">
                      Source: <span className="font-medium">{result.source}</span>
                      {result.confidence && (
                        <span className="ml-2">({result.confidence}%)</span>
                      )}
                    </div>
                  )}

                  {result.loadTime && (
                    <div className="mt-1 text-xs text-gray-500">
                      Load time: {result.loadTime}ms
                    </div>
                  )}

                  {result.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && !isRunning && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Ready to test cover success rate
              </h3>
              <p className="text-gray-500">
                Click &quot;Run Comprehensive Test&quot; to evaluate the book cover system
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};