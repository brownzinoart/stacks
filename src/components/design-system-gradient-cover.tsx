/**
 * Design System Consistent Gradient Book Cover Component
 * Uses official design tokens from tailwind.config.js
 * No text content - pure visual gradient fallback
 */

'use client';

import { memo } from 'react';

interface GradientCoverProps {
  title: string;
  author: string;
  className?: string;
  showText?: boolean; // Optional - defaults to false for pure gradients
}

// Design system gradient definitions using exact color values from tailwind.config.js
const DESIGN_SYSTEM_GRADIENTS = [
  { from: '#3B82F6', to: '#A78BFA', name: 'blue-purple' },     // primary-blue to primary-purple
  { from: '#EC4899', to: '#FB7185', name: 'pink-orange' },     // primary-pink to primary-orange
  { from: '#14B8A6', to: '#4ADE80', name: 'teal-green' },      // primary-teal to primary-green
  { from: '#A78BFA', to: '#EC4899', name: 'purple-pink' },     // primary-purple to primary-pink
  { from: '#4ADE80', to: '#FBBF24', name: 'green-yellow' },    // primary-green to primary-yellow
  { from: '#FB7185', to: '#FBBF24', name: 'orange-yellow' },   // primary-orange to primary-yellow
  { from: '#3B82F6', to: '#14B8A6', name: 'blue-teal' },       // primary-blue to primary-teal
  { from: '#EC4899', to: '#A78BFA', name: 'pink-purple' },     // primary-pink to primary-purple
  { from: '#14B8A6', to: '#3B82F6', name: 'teal-blue' },       // primary-teal to primary-blue
  { from: '#FBBF24', to: '#FB7185', name: 'yellow-orange' },   // primary-yellow to primary-orange
  { from: '#4ADE80', to: '#14B8A6', name: 'green-teal' },      // primary-green to primary-teal
  { from: '#A78BFA', to: '#3B82F6', name: 'purple-blue' },     // primary-purple to primary-blue
] as const;

const DesignSystemGradientCover = memo(({ 
  title, 
  author, 
  className = '',
  showText = false 
}: GradientCoverProps) => {
  // Generate consistent hash for reproducible gradient selection
  const generateGradientIndex = (title: string, author: string): number => {
    const hash = (title + author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
    return Math.abs(hash) % DESIGN_SYSTEM_GRADIENTS.length;
  };

  const gradientIndex = generateGradientIndex(title, author);
  const gradient = DESIGN_SYSTEM_GRADIENTS[gradientIndex]!;

  return (
    <div 
      className={`relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg ${className}`}
      style={{
        aspectRatio: '2/3',
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
      }}
    >
      {/* Subtle decorative book icon (optional) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 text-white">
        <div className="w-8 h-10 border-2 border-current rounded-sm">
          <div className="w-0.5 h-8 bg-current ml-1.5 mt-1 rounded-full" />
        </div>
      </div>

      {/* Optional text overlay - only if showText is true */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-white">
          <div className="text-center">
            <div className="text-xs font-semibold mb-1 line-clamp-3 leading-tight">
              {title}
            </div>
            <div className="text-[10px] opacity-80 line-clamp-2">
              {author}
            </div>
          </div>
        </div>
      )}

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      
      {/* Rounded corners matching book cover design */}
      <div className="absolute inset-0 rounded-lg" />
    </div>
  );
});

DesignSystemGradientCover.displayName = 'DesignSystemGradientCover';

/**
 * Generate design system gradient URL for service layer
 * Format: gradient-ds:gradientIndex:title:author
 */
export const generateDesignSystemGradientUrl = (title: string, author: string): string => {
  const hash = (title + author).split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);
  const gradientIndex = Math.abs(hash) % DESIGN_SYSTEM_GRADIENTS.length;
  const gradient = DESIGN_SYSTEM_GRADIENTS[gradientIndex]!;
  
  return `gradient-ds:${gradientIndex}:${gradient.from}:${gradient.to}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
};

/**
 * Parse design system gradient URL
 */
export const parseDesignSystemGradientUrl = (url: string) => {
  if (!url.startsWith('gradient-ds:')) return null;
  
  const parts = url.split(':');
  if (parts.length < 6) return null;
  
  return {
    gradientIndex: parseInt(parts[1]!),
    from: parts[2]!,
    to: parts[3]!,
    title: decodeURIComponent(parts[4]!),
    author: decodeURIComponent(parts[5]!)
  };
};

/**
 * Get gradient CSS for inline styles
 */
export const getDesignSystemGradientStyle = (title: string, author: string) => {
  const hash = (title + author).split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);
  const gradientIndex = Math.abs(hash) % DESIGN_SYSTEM_GRADIENTS.length;
  const gradient = DESIGN_SYSTEM_GRADIENTS[gradientIndex]!;
  
  return {
    background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
  };
};

export { DesignSystemGradientCover, DESIGN_SYSTEM_GRADIENTS };