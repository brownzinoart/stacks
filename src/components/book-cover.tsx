/**
 * Prominent Book Cover Component - Real Covers with Enhanced Styling
 * Uses real book covers with prominent, branded presentation and bold outlines
 */

import { getBookCover } from '@/lib/book-covers';

interface BookCoverProps {
  title: string;
  author: string;
  className?: string;
  coverUrl?: string;
}

export const BookCover = ({ title, author, className = "w-16 h-20", coverUrl }: BookCoverProps) => {
  let url = coverUrl;
  if (!url) url = getBookCover(title, author);
  const isRealCover = url && url.startsWith('http');
  
  // Generate decorative elements for placeholders
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hasDecoration = hash % 3 === 0;
  const decorationType = hash % 4;

  return (
    <div className={`${className} rounded-2xl flex-shrink-0 shadow-backdrop-lg hover:rotate-3 transition-all duration-300 relative overflow-hidden outline-bold`}>
      {isRealCover ? (
        // Real book cover with enhanced styling and bold outline
        <>
          <img 
            src={url} 
            alt={`${title} cover`}
            className="w-full h-full object-cover"
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
        <div className={`w-full h-full ${coverUrl} flex items-center justify-center relative`}>
          {/* Decorative elements */}
          {hasDecoration && (
            <>
              {decorationType === 0 && (
                <>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white/40 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/50 rounded-full" />
                </>
              )}
              {decorationType === 1 && (
                <div className="absolute top-1 bottom-1 left-1 w-1 bg-white/60 rounded-full" />
              )}
              {decorationType === 2 && (
                <div className="absolute top-2 left-2 right-2 h-1 bg-white/40 rounded-full" />
              )}
              {decorationType === 3 && (
                <>
                  <div className="absolute top-3 left-3 w-2 h-2 bg-white/50 rounded-full" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-white/50 rounded-full" />
                </>
              )}
            </>
          )}
          
          {/* Book icon */}
          <div className="w-8 h-8 bg-white/50 rounded-lg relative">
            <div className="absolute left-1 top-2 bottom-2 w-1 bg-white/80 rounded-full" />
          </div>
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}
    </div>
  );
}; 