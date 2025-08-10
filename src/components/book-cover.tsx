/**
 * 100% Coverage Book Cover Component
 * Uses optimized API chain: Google Books → Open Library → AI Generation → Gradient Fallback
 * GUARANTEE: Every book gets a cover, no exceptions!
 */

import { bookCoverService } from '@/lib/book-cover-service';
import { useState, useEffect, memo } from 'react';
import Image from 'next/image';

interface BookCoverProps {
  title: string;
  author: string;
  isbn?: string;
  className?: string;
  showSource?: boolean; // For debugging
}

interface CoverState {
  url: string;
  source: string;
  confidence: number;
  quality?: string;
  isLoading: boolean;
  error?: string;
}

const BookCover = memo(({ 
  title, 
  author, 
  isbn,
  className = 'w-16 h-20',
  showSource = false 
}: BookCoverProps) => {
  const [coverState, setCoverState] = useState<CoverState>({
    url: '',
    source: 'loading',
    confidence: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchCover = async () => {
      try {
        setCoverState(prev => ({ ...prev, isLoading: true, error: undefined }));
        
        const result = await bookCoverService.getCover({
          title,
          author,
          isbn
        });
        
        setCoverState({
          url: result.url,
          source: result.source,
          confidence: result.confidence,
          quality: result.quality,
          isLoading: false
        });
      } catch (error) {
        console.error('Cover fetch failed:', error);
        setCoverState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load cover'
        }));
      }
    };

    if (title && author) {
      fetchCover();
    }
  }, [title, author, isbn]);

  // Determine cover type
  const isRealCover = coverState.url.startsWith('http');
  const isAIGenerated = coverState.url.startsWith('ai_description:');
  const isGradient = coverState.url.startsWith('gradient:');

  // Render different cover types
  const renderCover = () => {
    if (coverState.isLoading) {
      return (
        <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="animate-pulse text-white/60">📚</div>
        </div>
      );
    }

    if (isRealCover) {
      // Real book cover from Google Books or Open Library
      return (
        <>
          <Image
            src={coverState.url}
            alt={`${title} by ${author}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
            priority={false}
            onError={(e) => {
              // Auto-fallback if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              setCoverState(prev => ({ ...prev, error: 'Image failed to load' }));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
        </>
      );
    }

    if (isAIGenerated) {
      // AI-generated cover description (could be enhanced with actual image generation)
      const description = decodeURIComponent(coverState.url.replace('ai_description:', ''));
      return (
        <div className="h-full w-full bg-gradient-to-br from-purple-500 to-blue-600 flex flex-col items-center justify-center p-2 text-white">
          <div className="text-center">
            <div className="text-xs font-medium mb-1 truncate">{title}</div>
            <div className="text-xs opacity-80 truncate">{author}</div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {showSource && (
            <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-1 rounded-tl">
              AI
            </div>
          )}
        </div>
      );
    }

    if (isGradient) {
      // Parse gradient data: gradient:color1:color2:title:author
      const parts = coverState.url.split(':');
      const color1 = parts[1] || '#00A8CC';
      const color2 = parts[2] || '#0081A7';
      
      return (
        <div 
          className="h-full w-full flex flex-col items-center justify-center p-2 text-white"
          style={{
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
          }}
        >
          <div className="text-center">
            <div className="text-xs font-medium mb-1 truncate">{title}</div>
            <div className="text-xs opacity-80 truncate">{author}</div>
          </div>
          
          {/* Decorative book icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
            <div className="w-6 h-8 border-2 border-white/40 rounded-sm">
              <div className="w-0.5 h-6 bg-white/40 ml-1 mt-1 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      );
    }

    return (
      <div className="h-full w-full bg-gray-400 flex items-center justify-center text-white">
        📖
      </div>
    );
  };

  return (
    <div className={`${className} relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl group`}>
      {renderCover()}
      
      {/* Optional source indicator for debugging */}
      {showSource && !coverState.isLoading && (
        <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded-tr">
          {coverState.source} ({coverState.confidence}%)
        </div>
      )}
      
      {/* Quality indicator */}
      {coverState.quality === 'high' && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
      )}
    </div>
  );
});

BookCover.displayName = 'BookCover';

export { BookCover };
