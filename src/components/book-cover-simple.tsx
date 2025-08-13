/**
 * Simplified Book Cover Component
 * Shows placeholder immediately, loads real cover in background
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

  // Generate a consistent gradient fallback
  const generateGradient = () => {
    const hash = (title + author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
    
    const gradients = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-blue-500',
      'from-purple-400 to-pink-600',
      'from-yellow-400 to-red-500',
      'from-pink-400 to-purple-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-blue-600',
      'from-orange-400 to-red-600'
    ];
    
    return gradients[Math.abs(hash) % gradients.length];
  };

  useEffect(() => {
    // If we have a cover URL, try to use it
    if (coverUrl && coverUrl.startsWith('http')) {
      setImageUrl(coverUrl);
      setIsLoading(false);
    } else if (coverUrl && coverUrl.startsWith('gradient:')) {
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

  const gradient = generateGradient();

  // Show gradient placeholder
  if (hasError || !imageUrl) {
    return (
      <div 
        className={`relative bg-gradient-to-br ${gradient} ${className}`}
        style={{ aspectRatio: '2/3' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
          <div className="text-center">
            <div className="text-xs font-bold opacity-90 line-clamp-2">{title}</div>
            <div className="text-[10px] opacity-75 mt-1">{author}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show real cover
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '2/3' }}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`} />
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