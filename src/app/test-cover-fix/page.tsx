'use client';

import { BookCover } from '@/components/book-cover';
import { useState, useEffect } from 'react';
import { bookCoverService } from '@/lib/book-cover-service';
import Image from 'next/image';

const TEST_BOOKS = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780141982618"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935"
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "9780747532699"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769174"
  }
];

interface CoverResult {
  title: string;
  author: string;
  isbn?: string;
  result?: any;
  error?: string;
  loadTime?: number;
}

export default function TestCoverFixPage() {
  const [results, setResults] = useState<CoverResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testCoverService = async () => {
    setIsLoading(true);
    setResults([]);

    console.log('🧪 Starting book cover service test...');

    for (const book of TEST_BOOKS) {
      const startTime = Date.now();
      try {
        console.log(`🔍 Testing: "${book.title}" by ${book.author}`);
        const result = await bookCoverService.getCover(book);
        const loadTime = Date.now() - startTime;
        
        console.log(`✅ Result for "${book.title}":`, result);
        
        setResults(prev => [...prev, {
          ...book,
          result,
          loadTime
        }]);
      } catch (error) {
        const loadTime = Date.now() - startTime;
        console.error(`❌ Error for "${book.title}":`, error);
        
        setResults(prev => [...prev, {
          ...book,
          error: error instanceof Error ? error.message : String(error),
          loadTime
        }]);
      }
    }

    setIsLoading(false);
    console.log('🧪 Test completed!');
  };

  const clearCache = () => {
    bookCoverService.clearCache();
    setResults([]);
    console.log('🗑️ Cache cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Cover Service Test</h1>
        
        <div className="mb-8 space-x-4">
          <button
            onClick={testCoverService}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Cover Service'}
          </button>
          
          <button
            onClick={clearCache}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Clear Cache
          </button>
        </div>

        {/* Visual Test */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Visual Test - Book Covers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {TEST_BOOKS.map((book, index) => (
              <div key={index} className="text-center">
                <BookCover
                  title={book.title}
                  author={book.author}
                  isbn={book.isbn}
                  className="w-32 h-48 mx-auto mb-2"
                  showSource={true}
                />
                <div className="text-sm text-gray-600">
                  <div className="font-medium truncate">{book.title}</div>
                  <div className="truncate">{book.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Test Results */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Service Test Results</h2>
          
          {results.length === 0 && !isLoading && (
            <div className="text-gray-500 text-center py-8">
              Click &quot;Test Cover Service&quot; to run the test
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="mt-2 text-gray-600">Testing cover service...</div>
            </div>
          )}

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {result.title} by {result.author}
                    </h3>
                    {result.isbn && (
                      <div className="text-sm text-gray-600 mb-2">ISBN: {result.isbn}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.loadTime}ms
                  </div>
                </div>

                {result.result && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.result.source === 'google' ? 'bg-blue-100 text-blue-800' :
                        result.result.source === 'openlibrary' ? 'bg-green-100 text-green-800' :
                        result.result.source === 'ai_generated' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.result.source}
                      </span>
                      <span className="text-sm text-gray-600">
                        {result.result.confidence}% confidence
                      </span>
                      {result.result.quality && (
                        <span className="text-sm text-gray-600">
                          {result.result.quality} quality
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 break-all">
                      URL: {result.result.url}
                    </div>

                    {result.result.url.startsWith('http') && (
                      <div className="mt-2">
                        <div className="relative w-16 h-24">
                          <Image
                            src={result.result.url}
                            alt={`Cover for ${result.title}`}
                            fill
                            className="object-cover rounded border"
                            onLoad={() => console.log(`✅ Image loaded: ${result.title}`)}
                            onError={() => console.log(`❌ Image failed: ${result.title}`)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result.error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}