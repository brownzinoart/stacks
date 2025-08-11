/**
 * 100% Coverage Book Cover Component
 * Uses optimized API chain: Google Books → Open Library → AI Generation → Gradient Fallback
 * GUARANTEE: Every book gets a cover, no exceptions!
 */

import { bookCoverService } from '@/lib/book-cover-service';
import { useState, useEffect, memo } from 'react';
import NextImage from 'next/image';

interface BookCoverProps {
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
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
  retryCount?: number;
  loadSuccess?: boolean;
}

const BookCover = memo(({ 
  title, 
  author, 
  isbn,
  coverUrl,
  className = 'w-16 h-20',
  showSource = false 
}: BookCoverProps) => {
  const [coverState, setCoverState] = useState<CoverState>({
    url: '',
    source: 'loading',
    confidence: 0,
    isLoading: true,
    retryCount: 0,
    loadSuccess: false
  });

  useEffect(() => {
    // If coverUrl is provided, validate it first
    if (coverUrl) {
      setCoverState(prev => ({ ...prev, isLoading: true }));
      
      // Test if provided URL works
      const img = new Image();
      img.onload = () => {
        setCoverState({
          url: coverUrl,
          source: 'provided',
          confidence: 100,
          isLoading: false,
          loadSuccess: true,
          retryCount: 0
        });
      };
      img.onerror = () => {
        console.warn('Provided cover URL failed, falling back to search:', coverUrl);
        // Fall back to search if provided URL fails
        setCoverState(prev => ({ ...prev, isLoading: true }));
        fetchCover();
      };
      img.src = coverUrl;
      return;
    }

    const fetchCover = async (retryAttempt = 0) => {
      try {
        setCoverState(prev => ({ ...prev, isLoading: true, error: undefined, retryCount: retryAttempt }));
        
        const result = await bookCoverService.getCover({
          title,
          author,
          isbn
        });
        
        // If it's a real image URL, validate it before setting
        if (result.url.startsWith('http')) {
          const isValid = await validateImageLoad(result.url);
          if (!isValid && retryAttempt < 2) {
            console.warn(`Cover URL validation failed, retrying (${retryAttempt + 1}/2):`, result.url);
            // Mark this specific URL as failed and clear cache only if it matches
            bookCoverService.markUrlAsFailed(result.url);
            bookCoverService.clearCacheIfNeeded({ title, author, isbn }, result.url);
            return fetchCover(retryAttempt + 1);
          }
        }
        
        setCoverState({
          url: result.url,
          source: result.source,
          confidence: result.confidence,
          quality: result.quality,
          isLoading: false,
          loadSuccess: true,
          retryCount: retryAttempt
        });
      } catch (error) {
        console.error('Cover fetch failed:', error);
        
        // If this was a retry attempt, give up and use fallback
        if (retryAttempt >= 2) {
          setCoverState(prev => ({
            ...prev,
            url: generateEmergencyFallback(),
            source: 'emergency_fallback',
            confidence: 100,
            isLoading: false,
            error: 'All attempts failed, using emergency fallback',
            retryCount: retryAttempt
          }));
        } else {
          // Retry once
          console.log(`Retrying cover fetch (${retryAttempt + 1}/2)`);
          setTimeout(() => fetchCover(retryAttempt + 1), 1000);
        }
      }
    };

    const validateImageLoad = (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
      });
    };

    const generateEmergencyFallback = (): string => {
      // Generate a hash-based color for consistent fallback
      const hash = (title + author).split('').reduce((acc, char) => {
        return (acc << 5) - acc + char.charCodeAt(0);
      }, 0);
      
      const colors = [
        ['#FF6B6B', '#4ECDC4'], // Red to teal
        ['#45B7D1', '#F39C12'], // Blue to orange  
        ['#96CEB4', '#FECA57'], // Green to yellow
        ['#6C5CE7', '#FD79A8'], // Purple to pink
        ['#00B894', '#00CEC9'], // Green to cyan
        ['#E17055', '#FDCB6E'], // Orange gradient
      ];
      
      const colorPair = colors[Math.abs(hash) % colors.length] || colors[0]!;
      return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
    };

    if (title && author) {
      fetchCover();
    }
  }, [title, author, isbn, coverUrl]);

  // Determine cover type
  const isRealCover = coverState.url.startsWith('http');
  const isAIGenerated = coverState.url.startsWith('ai_description:');
  const isGradient = coverState.url.startsWith('gradient:');

  // Render different cover types
  const renderCover = () => {
    if (coverState.isLoading) {
      return (
        <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center relative">
          <div className="animate-pulse text-white/60 text-2xl">📚</div>
          {coverState.retryCount! > 0 && (
            <div className="absolute bottom-1 right-1 text-xs text-white/50">
              Retry {coverState.retryCount}
            </div>
          )}
        </div>
      );
    }

    if (isRealCover) {
      // Real book cover from Google Books or Open Library
      return (
        <>
          <NextImage
            src={coverState.url}
            alt={`${title} by ${author}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
            priority={false}
            onError={(e) => {
              console.error('Image load error for:', coverState.url);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              
              // Trigger fallback mechanism
              if (coverState.retryCount! < 2) {
                console.log('Image failed, triggering retry mechanism');
                // Mark the current URL as failed and only clear if it's the cached one
                bookCoverService.markUrlAsFailed(coverState.url);
                bookCoverService.clearCacheIfNeeded({ title, author, isbn }, coverState.url);
                // fetchCover is not available in this scope, so create a new fallback URL
                const fallbackUrl = (() => {
                  const hash = (title + author).split('').reduce((acc, char) => {
                    return (acc << 5) - acc + char.charCodeAt(0);
                  }, 0);
                  
                  const colors = [
                    ['#FF6B6B', '#4ECDC4'], // Red to teal
                    ['#45B7D1', '#F39C12'], // Blue to orange  
                    ['#96CEB4', '#FECA57'], // Green to yellow
                    ['#6C5CE7', '#FD79A8'], // Purple to pink
                    ['#00B894', '#00CEC9'], // Green to cyan
                    ['#E17055', '#FDCB6E'], // Orange gradient
                  ];
                  
                  const colorPair = colors[Math.abs(hash) % colors.length] || colors[0]!;
                  return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
                })();
                
                setCoverState(prev => ({
                  ...prev,
                  url: fallbackUrl,
                  source: 'emergency_fallback',
                  confidence: 100,
                  error: 'Image load failed, using fallback'
                }));
              } else {
                // Final fallback
                console.log('All retries exhausted, using emergency fallback');
                const finalFallbackUrl = (() => {
                  const hash = (title + author).split('').reduce((acc, char) => {
                    return (acc << 5) - acc + char.charCodeAt(0);
                  }, 0);
                  
                  const colors = [
                    ['#FF6B6B', '#4ECDC4'], // Red to teal
                    ['#45B7D1', '#F39C12'], // Blue to orange  
                    ['#96CEB4', '#FECA57'], // Green to yellow
                    ['#6C5CE7', '#FD79A8'], // Purple to pink
                    ['#00B894', '#00CEC9'], // Green to cyan
                    ['#E17055', '#FDCB6E'], // Orange gradient
                  ];
                  
                  const colorPair = colors[Math.abs(hash) % colors.length] || colors[0]!;
                  return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
                })();
                
                setCoverState(prev => ({
                  ...prev,
                  url: finalFallbackUrl,
                  source: 'emergency_fallback',
                  confidence: 100,
                  error: 'Image load failed after retries'
                }));
              }
            }}
            onLoad={() => {
              setCoverState(prev => ({ ...prev, loadSuccess: true, error: undefined }));
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
      
      {/* Enhanced debugging info */}
      {showSource && !coverState.isLoading && (
        <div className="absolute bottom-0 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded-tr space-y-1">
          <div>{coverState.source} ({coverState.confidence}%)</div>
          {coverState.retryCount! > 0 && (
            <div className="text-yellow-300">Retries: {coverState.retryCount}</div>
          )}
          {coverState.loadSuccess && (
            <div className="text-green-300">✓</div>
          )}
          {coverState.error && (
            <div className="text-red-300">⚠️</div>
          )}
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
