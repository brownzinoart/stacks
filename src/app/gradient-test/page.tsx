/**
 * Gradient Test Page
 * Shows all design system gradients in action
 */

import Link from 'next/link';
import GradientShowcase from '../../components/gradient-showcase';
import { BookCover } from '../../components/book-cover';
import { BookCoverSimple } from '../../components/book-cover-simple';

export default function GradientTestPage() {
  const sampleBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780142437223' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { title: '1984', author: 'George Orwell' },
    { title: 'Pride and Prejudice', author: 'Jane Austen' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Design System Book Cover Gradients
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Beautiful, consistent gradient fallbacks using our design system tokens. 
            These replace expensive AI-generated covers while maintaining visual appeal and brand consistency.
          </p>
        </div>

        {/* Main Gradient Showcase */}
        <GradientShowcase className="mb-12" />

        {/* Component Integration Tests */}
        <div className="space-y-8">
          {/* BookCover Component Test */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              BookCover Component Integration
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sampleBooks.map((book, index) => (
                <div key={index} className="text-center">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    isbn={book.isbn}
                    className="w-20 h-28 mx-auto mb-2"
                    showSource={true}
                  />
                  <div className="text-xs text-gray-600">
                    <div className="font-medium line-clamp-2">{book.title}</div>
                    <div className="opacity-75">{book.author}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              These will fall back to design system gradients if real covers aren&apos;t available.
            </p>
          </div>

          {/* BookCoverSimple Component Test */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              BookCoverSimple Component Integration
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sampleBooks.map((book, index) => (
                <div key={index} className="text-center">
                  <BookCoverSimple
                    title={book.title}
                    author={book.author}
                    isbn={book.isbn}
                    className="w-20 h-28 mx-auto mb-2"
                  />
                  <div className="text-xs text-gray-600">
                    <div className="font-medium line-clamp-2">{book.title}</div>
                    <div className="opacity-75">{book.author}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Simplified component with immediate gradient fallback.
            </p>
          </div>

          {/* Cost Savings Info */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-3 text-green-900">
              💰 Cost Savings
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <p>• <strong>Before:</strong> $0.02-$0.05 per AI-generated gradient cover</p>
              <p>• <strong>After:</strong> $0.00 per design system gradient cover</p>
              <p>• <strong>Visual Quality:</strong> More consistent and brand-aligned</p>
              <p>• <strong>Performance:</strong> Instant rendering, no API calls</p>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">
              🔧 Technical Implementation
            </h3>
            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <strong>New Files Created:</strong>
                <ul className="mt-1 ml-4 list-disc space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">src/components/design-system-gradient-cover.tsx</code> - Main component</li>
                  <li><code className="bg-blue-100 px-1 rounded">src/styles/book-cover-gradients.css</code> - CSS utilities</li>
                  <li><code className="bg-blue-100 px-1 rounded">src/components/gradient-showcase.tsx</code> - Testing component</li>
                </ul>
              </div>
              <div>
                <strong>Updated Files:</strong>
                <ul className="mt-1 ml-4 list-disc space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">src/components/book-cover.tsx</code> - Integrated new gradients</li>
                  <li><code className="bg-blue-100 px-1 rounded">src/components/book-cover-simple.tsx</code> - Updated fallback</li>
                  <li><code className="bg-blue-100 px-1 rounded">src/lib/book-cover-service.ts</code> - Service layer integration</li>
                  <li><code className="bg-blue-100 px-1 rounded">src/app/globals.css</code> - Added CSS import</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-blue hover:bg-primary-purple transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}