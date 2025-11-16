/**
 * Simplified Book Cover Component
 * Shows placeholder immediately, loads real cover in background
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DesignSystemGradientCover } from './design-system-gradient-cover';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
  className?: string;
  priority?: boolean;
}

export function BookCoverSimple({
  title,
  author,
  coverUrl,
  isbn,
  className = '',
  priority = false
}: BookCoverProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a consistent gradient fallback using design system
  const generateGradient = () => {
    // This will be replaced by the DesignSystemGradientCover component
    return '';
  };

  useEffect(() => {
    // If we have a cover URL, try to use it
    if (coverUrl && coverUrl.startsWith('http')) {
      setImageUrl(coverUrl);
      setIsLoading(false);
    } else if (coverUrl && (coverUrl.startsWith('gradient:') || coverUrl.startsWith('gradient-ds:'))) {
      // It's already a gradient placeholder
      setHasError(true);
      setIsLoading(false);
    } else {
      // Try to fetch from Google Books as a simple fallback
      const searchQuery = isbn || `${title} ${author}`.replace(/ /g, '+');
      const googleBooksUrl = `https://books.google.com/books/content?id=${searchQuery}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`;
      
      // Create a simple image to test if it loads
      const img = new window.Image();
      img.onload = () => {
        setImageUrl(googleBooksUrl);
        setIsLoading(false);
      };
      img.onerror = () => {
        // Fallback to gradient
        setHasError(true);
        setIsLoading(false);
      };
      img.src = googleBooksUrl;
      
      // Timeout after 3 seconds
      setTimeout(() => {
        if (isLoading) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 3000);
    }
  }, [title, author, coverUrl, isbn, isLoading]);

  // Show design system gradient placeholder
  if (hasError || !imageUrl) {
    return (
      <DesignSystemGradientCover 
        title={title}
        author={author}
        className={className}
        showText={true}
      />
    );
  }

  // Show real cover
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '2/3' }}>
      {isLoading && (
        <div className="absolute inset-0">
          <DesignSystemGradientCover 
            title={title}
            author={author}
            className="w-full h-full animate-pulse"
            showText={false}
          />
        </div>
      )}
      <Image
        src={imageUrl}
        alt={`Cover of ${title}`}
        fill
        className="object-cover"
        priority={priority}
        onError={() => {
          setHasError(true);
          setImageUrl('');
        }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}