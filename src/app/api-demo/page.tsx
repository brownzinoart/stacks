'use client';

import { useState } from 'react';

/**
 * Complete API Demo - Bootstrap Success Edition
 * Demonstrates all implemented APIs working together
 * Cost: <$5/month for full functionality
 */

export default function APIDemoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [availability, setAvailability] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(prev => ({ ...prev, search: true }));
    try {
      const response = await fetch(`http://localhost:3001/api/books/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const handleGetRecommendations = async (mood: string) => {
    setLoading(prev => ({ ...prev, recommendations: true }));
    try {
      const response = await fetch('http://localhost:3001/api/books/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, limit: 3 })
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Recommendations error:', error);
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  };

  const handleCheckAvailability = async (isbn: string) => {
    setLoading(prev => ({ ...prev, availability: true }));
    try {
      const response = await fetch(`http://localhost:3001/api/books/${isbn}/availability`);
      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Availability error:', error);
    } finally {
      setLoading(prev => ({ ...prev, availability: false }));
    }
  };

  const handleGetQueue = async () => {
    setLoading(prev => ({ ...prev, queue: true }));
    try {
      const response = await fetch('http://localhost:3001/api/user/demo-user/queue');
      const data = await response.json();
      setQueue(data);
    } catch (error) {
      console.error('Queue error:', error);
    } finally {
      setLoading(prev => ({ ...prev, queue: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Complete API Demo - Bootstrap Edition
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Full backend functionality with FREE APIs. Total cost: <strong className="text-green-600">&lt;$5/month</strong>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Google Books (FREE)</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Open Library (FREE)</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">WorldCat (FREE)</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">AI Router ($2-3/mo)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Book Search */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              📚 Book Search API
              <span className="ml-2 text-sm font-normal text-green-600">(FREE)</span>
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for books..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading.search}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading.search ? '⏳' : 'Search'}
                </button>
              </div>
              
              {searchResults && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Found {searchResults.total} results • {searchResults.cached ? 'Cached' : 'Fresh'} • 
                    Source: {searchResults.source}
                  </div>
                  {searchResults.books.map((book: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-semibold text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-600">by {book.authors.join(', ')}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {book.source} • {Math.round(book.confidence * 100)}% match
                        </span>
                        {book.isbn && (
                          <button
                            onClick={() => handleCheckAvailability(book.isbn)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Check Libraries
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🤖 AI Recommendations
              <span className="ml-2 text-sm font-normal text-orange-600">($0.001/request)</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['adventurous', 'contemplative', 'escapist'].map(mood => (
                  <button
                    key={mood}
                    onClick={() => handleGetRecommendations(mood)}
                    disabled={loading.recommendations}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 disabled:opacity-50 capitalize"
                  >
                    {mood}
                  </button>
                ))}
              </div>
              
              {loading.recommendations && (
                <div className="text-center py-8">
                  <div className="animate-spin text-2xl">🧠</div>
                  <div className="mt-2 text-gray-600">Generating personalized recommendations...</div>
                </div>
              )}
              
              {recommendations && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Mood: <strong>{recommendations.mood}</strong> • 
                    {recommendations.cached ? ' Cached' : ' Fresh AI generation'}
                  </div>
                  {recommendations.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                      <div className="font-semibold text-gray-900">{rec.title}</div>
                      <div className="text-sm text-gray-600">by {rec.author}</div>
                      <div className="text-xs text-purple-700 mt-2">{rec.match_reason}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Match confidence: {Math.round(rec.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Library Availability */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              🏛️ Library Availability
              <span className="ml-2 text-sm font-normal text-green-600">(FREE)</span>
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCheckAvailability('9780141182636')}
                  disabled={loading.availability}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Check "The Great Gatsby"
                </button>
                <button
                  onClick={() => handleCheckAvailability('9780451524935')}
                  disabled={loading.availability}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Check "1984"
                </button>
              </div>
              
              {loading.availability && (
                <div className="text-center py-4">
                  <div className="animate-pulse text-xl">🔍</div>
                  <div className="mt-2 text-gray-600">Checking libraries...</div>
                </div>
              )}
              
              {availability && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    ISBN: {availability.isbn} • 
                    Found in {availability.availability.total_libraries} libraries • 
                    {availability.availability.available_count} available now
                  </div>
                  {availability.availability.libraries.map((lib: any, index: number) => (
                    <div key={index} className={`border rounded-lg p-3 ${
                      lib.status === 'available' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{lib.name}</div>
                          <div className="text-sm text-gray-600">{lib.distance} • {lib.call_number}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          lib.status === 'available' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {lib.available_copies}/{lib.total_copies} available
                        </div>
                      </div>
                      {lib.due_date && (
                        <div className="text-xs text-gray-500 mt-1">Due back: {lib.due_date}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Queue */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              📋 User Queue Management
              <span className="ml-2 text-sm font-normal text-blue-600">(FREE)</span>
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleGetQueue}
                disabled={loading.queue}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.queue ? '⏳' : 'Load My Queue'}
              </button>
              
              {queue && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    User: {queue.user_id} • {queue.total} books in queue
                  </div>
                  {queue.queue.map((item: any, index: number) => (
                    <div key={index} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-gray-600">by {item.author}</div>
                          <div className="text-xs text-gray-500">
                            Added: {new Date(item.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          item.status === 'available'
                            ? 'bg-green-200 text-green-800'
                            : item.status === 'hold'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        <div className="mt-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              💰 Total Monthly Costs: &lt;$5
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-green-700">Book Search</div>
                <div className="text-2xl font-bold text-green-600">$0</div>
                <div className="text-gray-600">Google Books + Open Library (FREE)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-blue-700">Library Data</div>
                <div className="text-2xl font-bold text-blue-600">$0</div>
                <div className="text-gray-600">WorldCat API (FREE tier)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-purple-700">AI Recommendations</div>
                <div className="text-2xl font-bold text-purple-600">$2-3</div>
                <div className="text-gray-600">Claude + Gemini (optimized)</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="font-semibold text-orange-700">Book Covers</div>
                <div className="text-2xl font-bold text-orange-600">$0-1</div>
                <div className="text-gray-600">FREE APIs + AI fallback</div>
              </div>
            </div>
            <div className="mt-6 text-gray-700">
              <strong>Result:</strong> Professional library app at bootstrap costs! 🚀
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}