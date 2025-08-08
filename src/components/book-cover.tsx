/**
 * Prominent Book Cover Component - Real Covers with Enhanced Styling
 * Uses real book covers with prominent, branded presentation and bold outlines
 */

import { getBookCover } from '@/lib/book-covers';
import { useState, useEffect, memo } from 'react';

interface BookCoverProps {
  title: string;
  author: string;
  className?: string;
  coverUrl?: string;
}

const BookCover = memo(({ title, author, className = 'w-16 h-20', coverUrl }: BookCoverProps) => {
  let url = coverUrl;
  if (!url) url = getBookCover(title, author);
  const isRealCover = url && url.startsWith('http');

  // Generate decorative elements for placeholders
  const hash = title.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const hasDecoration = hash % 3 === 0;
  const decorationType = hash % 4;

  return (
    <div
      className={`${className} shadow-backdrop-lg outline-bold relative flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300 hover:rotate-3`}
    >
      {isRealCover ? (
        // Real book cover with enhanced styling and bold outline
        <>
          <img
            src={url}
            alt={`${title} cover`}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Enhanced overlay for real covers */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </>
      ) : (
        // Branded placeholder with enhanced styling and bold outline
        <div className={`h-full w-full ${coverUrl} relative flex items-center justify-center`}>
          {/* Decorative elements */}
          {hasDecoration && (
            <>
              {decorationType === 0 && (
                <>
                  <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-white/40" />
                  <div className="absolute bottom-2 left-2 h-2 w-2 rounded-full bg-white/50" />
                </>
              )}
              {decorationType === 1 && <div className="absolute bottom-1 left-1 top-1 w-1 rounded-full bg-white/60" />}
              {decorationType === 2 && <div className="absolute left-2 right-2 top-2 h-1 rounded-full bg-white/40" />}
              {decorationType === 3 && (
                <>
                  <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-white/50" />
                  <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-white/50" />
                </>
              )}
            </>
          )}

          {/* Book icon */}
          <div className="relative h-8 w-8 rounded-lg bg-white/50">
            <div className="absolute bottom-2 left-1 top-2 w-1 rounded-full bg-white/80" />
          </div>

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
    </div>
  );
});

BookCover.displayName = 'BookCover';

export { BookCover };
