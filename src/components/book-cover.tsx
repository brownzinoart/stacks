/**
 * 100% Coverage Book Cover Component
 * Uses optimized API chain: Static → Google Books → Open Library → AI Generation → Gradient Fallback
 * GUARANTEE: Every book gets a cover, no exceptions!
 */

'use client';

import { bookCoverService } from '@/lib/book-cover-service';
import { useState, useEffect, memo } from 'react';
import NextImage from 'next/image';
import { generateDesignSystemGradientUrl, parseDesignSystemGradientUrl, DesignSystemGradientCover } from './design-system-gradient-cover';

// Detect if running in Capacitor (iOS offline mode)
const isCapacitor = () => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.Capacitor ||
    (window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'
  );
};

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
    console.log(`📖 [BookCover] Initializing for "${title}" by ${author}`);
    
    // Define helper function using design system gradients
    const generateEmergencyFallback = (): string => {
      return generateDesignSystemGradientUrl(title, author);
    };
    
    // Now define fetchCover that uses the helper functions
    async function fetchCover(retryAttempt = 0) {
      try {
        console.log(`🔍 [BookCover] Fetching cover for "${title}" (attempt ${retryAttempt + 1})`);
        setCoverState(prev => ({ ...prev, isLoading: true, error: undefined, retryCount: retryAttempt }));
        
        const result = await bookCoverService.getCover({
          title,
          author,
          isbn
        });
        
        console.log(`📋 [BookCover] Service returned: ${result.source} cover for "${title}" (confidence: ${result.confidence}%)`);
        console.log(`🎯 [BookCover] Cover URL: ${result.url}`);
        
        // Trust the book cover service - it already does validation
        // Skip client-side validation to avoid CORS issues
        
        console.log(`🎨 [BookCover] Setting final cover for "${title}": ${result.source}`);
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
        console.error(`❌ [BookCover] Fetch failed for "${title}":`, error);
        
        // If this was a retry attempt, give up and use fallback
        if (retryAttempt >= 2) {
          // Debug: console.log(`🆘 [BookCover] All attempts exhausted for "${title}", using emergency fallback`);
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
          // Debug: console.log(`🔄 [BookCover] Retrying fetch for "${title}" in 1s (attempt ${retryAttempt + 1}/2)`);
          setTimeout(() => fetchCover(retryAttempt + 1), 1000);
        }
      }
    }

    // If coverUrl is provided, trust it and use it directly
    if (coverUrl) {
      // Debug: console.log(`📖 [BookCover] Using provided URL for "${title}"`);
      // If it's a gradient (old or new format), use it as-is
      if (coverUrl.startsWith('gradient:') || coverUrl.startsWith('gradient-ds:')) {
        setCoverState({
          url: coverUrl,
          source: 'provided',
          confidence: 100,
          isLoading: false,
          loadSuccess: true,
          retryCount: 0
        });
        return;
      }
      // For HTTP URLs, trust them (the book-cover-service already validated)
      setCoverState({
        url: coverUrl,
        source: 'provided',
        confidence: 100,
        isLoading: false,
        loadSuccess: true,
        retryCount: 0
      });
      return;
    }

    if (title && author) {
      fetchCover();
    }
  }, [title, author, isbn, coverUrl]);

  // Determine cover type
  const isStaticCover = coverState.url.startsWith('/demo book covers/') || coverState.url.startsWith('/demo%20book%20covers/');
  const isRealCover = coverState.url.startsWith('http');
  const isAIGenerated = coverState.url.startsWith('ai_description:');
  const isGradient = coverState.url.startsWith('gradient:');
  const isDesignSystemGradient = coverState.url.startsWith('gradient-ds:');

  // Debug logging for cover type detection
  if (coverState.url && !coverState.isLoading) {
    console.log(`🎨 [BookCover] Cover type detection for "${title}":`, {
      url: coverState.url,
      isStaticCover,
      isRealCover,
      isGradient,
      isDesignSystemGradient,
      source: coverState.source
    });
  }

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

    if (isStaticCover) {
      // Static cover from our demo book covers collection
      console.log(`🏠 [BookCover] Rendering STATIC cover for "${title}": ${coverState.url}`);
      return (
        <>
          <NextImage
            src={coverState.url}
            alt={`${title} by ${author}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
            priority={true} // Static covers should load with high priority
            onError={(e) => {
              console.error('❌ [BookCover] Static cover load error for:', coverState.url);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              
              // Fallback to design system gradient if static cover fails
              const fallbackUrl = generateDesignSystemGradientUrl(title, author);
              setCoverState(prev => ({
                ...prev,
                url: fallbackUrl,
                source: 'static_fallback',
                confidence: 100,
                error: 'Static cover failed, using fallback'
              }));
            }}
            onLoad={() => {
              setCoverState(prev => ({ ...prev, loadSuccess: true, error: undefined }));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          {showSource && (
            <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-1 rounded-bl">
              STATIC
            </div>
          )}
        </>
      );
    }

    if (isRealCover) {
      // Real book cover from Google Books or Open Library
      console.log(`🌐 [BookCover] Rendering REAL cover for "${title}": ${coverState.url}`);
      
      // Use native HTML img for iOS/Capacitor to avoid WebView rendering issues
      if (isCapacitor()) {
        console.log(`📱 [BookCover] Using native HTML img for iOS: "${title}"`);
        return (
          <>
            <img
              src={coverState.url}
              alt={`${title} by ${author}`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ [BookCover] Native img load error for:', coverState.url);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                
                // Immediate fallback to gradient for iOS
                console.log(`🎨 [BookCover] iOS img failed, using gradient fallback for "${title}"`);
                const fallbackUrl = generateDesignSystemGradientUrl(title, author);
                
                setCoverState(prev => ({
                  ...prev,
                  url: fallbackUrl,
                  source: 'ios_img_fallback',
                  confidence: 100,
                  error: 'iOS native img failed, using gradient'
                }));
              }}
              onLoad={() => {
                console.log(`✅ [BookCover] Native img loaded successfully for "${title}"`);
                setCoverState(prev => ({ ...prev, loadSuccess: true, error: undefined }));
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
            {showSource && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-1 rounded-bl">
                iOS IMG
              </div>
            )}
          </>
        );
      }
      
      // Use Next.js Image for web browsers
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
                // Debug: console.log('Image failed, triggering retry mechanism');
                // Mark the current URL as failed and only clear if it's the cached one
                bookCoverService.markUrlAsFailed(coverState.url);
                bookCoverService.clearCacheIfNeeded({ title, author, isbn }, coverState.url);
                // Generate design system fallback URL
                const fallbackUrl = generateDesignSystemGradientUrl(title, author);
                
                setCoverState(prev => ({
                  ...prev,
                  url: fallbackUrl,
                  source: 'emergency_fallback',
                  confidence: 100,
                  error: 'Image load failed, using fallback'
                }));
              } else {
                // Final fallback using design system
                const finalFallbackUrl = generateDesignSystemGradientUrl(title, author);
                
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

    if (isDesignSystemGradient) {
      // Use the new design system gradient component
      return (
        <DesignSystemGradientCover 
          title={title}
          author={author}
          className="h-full w-full"
          showText={false}
        />
      );
    }

    if (isGradient) {
      // Legacy gradient support for backward compatibility
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
