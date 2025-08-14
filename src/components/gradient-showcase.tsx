/**
 * Gradient Showcase Component
 * Demonstrates all design system gradient combinations for book covers
 * Use this for testing and visual verification
 */

'use client';

import { DesignSystemGradientCover, DESIGN_SYSTEM_GRADIENTS } from './design-system-gradient-cover';

const SAMPLE_BOOKS = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: '1984', author: 'George Orwell' },
  { title: 'Pride and Prejudice', author: 'Jane Austen' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { title: 'Lord of the Flies', author: 'William Golding' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { title: 'Harry Potter', author: 'J.K. Rowling' },
  { title: 'The Da Vinci Code', author: 'Dan Brown' },
  { title: 'Gone Girl', author: 'Gillian Flynn' },
  { title: 'The Hunger Games', author: 'Suzanne Collins' },
  { title: 'Fifty Shades of Grey', author: 'E.L. James' }
];

interface GradientShowcaseProps {
  className?: string;
  showText?: boolean;
}

export default function GradientShowcase({ 
  className = '', 
  showText = false 
}: GradientShowcaseProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Design System Book Cover Gradients
        </h2>
        <p className="text-gray-600">
          Consistent, beautiful gradients using design tokens from tailwind.config.js
        </p>
      </div>

      {/* Gradient Color Reference */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
            <span className="text-sm">primary-blue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#A78BFA' }}></div>
            <span className="text-sm">primary-purple</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#EC4899' }}></div>
            <span className="text-sm">primary-pink</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FB7185' }}></div>
            <span className="text-sm">primary-orange</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#14B8A6' }}></div>
            <span className="text-sm">primary-teal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#4ADE80' }}></div>
            <span className="text-sm">primary-green</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FBBF24' }}></div>
            <span className="text-sm">primary-yellow</span>
          </div>
        </div>
      </div>

      {/* All Gradient Combinations */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          All {DESIGN_SYSTEM_GRADIENTS.length} Gradient Combinations
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {DESIGN_SYSTEM_GRADIENTS.map((gradient, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-16 h-20 rounded-lg shadow-sm mb-2"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
                }}
              >
                {/* Subtle book icon */}
                <div className="flex items-center justify-center h-full text-white/10">
                  <div className="w-6 h-8 border border-current rounded-sm">
                    <div className="w-0.5 h-6 bg-current ml-1 mt-1 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{gradient.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Books with Gradients */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Sample Book Covers (Consistent Hash-Based Selection)
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SAMPLE_BOOKS.map((book, index) => (
            <div key={index} className="text-center">
              <DesignSystemGradientCover
                title={book.title}
                author={book.author}
                className="w-16 h-20 mx-auto mb-2"
                showText={showText}
              />
              <div className="text-xs text-gray-600 line-clamp-2">
                <div className="font-medium">{book.title}</div>
                <div className="opacity-75">{book.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* With Text Option */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          With Text Overlay (Optional)
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SAMPLE_BOOKS.slice(0, 6).map((book, index) => (
            <div key={index} className="text-center">
              <DesignSystemGradientCover
                title={book.title}
                author={book.author}
                className="w-16 h-20 mx-auto mb-2"
                showText={true}
              />
              <div className="text-xs text-gray-600">Text Overlay</div>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">
          Implementation Notes
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Uses exact colors from <code className="bg-blue-100 px-1 rounded">tailwind.config.js</code> design tokens</li>
          <li>• Hash-based selection ensures same book always gets same gradient</li>
          <li>• Replaces expensive AI-generated covers with consistent, beautiful gradients</li>
          <li>• Backwards compatible with existing <code className="bg-blue-100 px-1 rounded">gradient:</code> format</li>
          <li>• New format: <code className="bg-blue-100 px-1 rounded">gradient-ds:</code> for design system gradients</li>
          <li>• Optional text overlay for fallback scenarios</li>
          <li>• Matches existing book cover sizing and rounded corners</li>
        </ul>
      </div>
    </div>
  );
}