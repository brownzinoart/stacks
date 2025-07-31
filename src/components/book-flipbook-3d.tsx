'use client';

import { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import { BookCover } from './book-cover';
import { hapticFeedback, isMobile } from '@/lib/mobile-utils';
import { fetchBookContent, BookContent } from '@/lib/book-content-service';

interface BookFlipbook3DProps {
  book: {
    title: string;
    author: string;
    isbn?: string;
    why?: string;
    genre?: string;
    synopsis?: string;
  };
  onClose: () => void;
}

// Barcode component for back cover
const Barcode = ({ isbn }: { isbn?: string }) => (
  <div className="mt-4">
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="80" height="32" rx="4" fill="#fff" />
      <rect x="6" y="6" width="2" height="20" fill="#222" />
      <rect x="10" y="6" width="1" height="20" fill="#222" />
      <rect x="13" y="6" width="3" height="20" fill="#222" />
      <rect x="18" y="6" width="2" height="20" fill="#222" />
      <rect x="22" y="6" width="1" height="20" fill="#222" />
      <rect x="25" y="6" width="2" height="20" fill="#222" />
      <rect x="29" y="6" width="1" height="20" fill="#222" />
      <rect x="32" y="6" width="3" height="20" fill="#222" />
      <rect x="37" y="6" width="2" height="20" fill="#222" />
      <rect x="41" y="6" width="1" height="20" fill="#222" />
      <rect x="44" y="6" width="2" height="20" fill="#222" />
      <rect x="48" y="6" width="1" height="20" fill="#222" />
      <rect x="51" y="6" width="3" height="20" fill="#222" />
      <rect x="56" y="6" width="2" height="20" fill="#222" />
      <rect x="60" y="6" width="1" height="20" fill="#222" />
      <rect x="63" y="6" width="2" height="20" fill="#222" />
      <rect x="67" y="6" width="1" height="20" fill="#222" />
      <rect x="70" y="6" width="3" height="20" fill="#222" />
      <rect x="75" y="6" width="2" height="20" fill="#222" />
    </svg>
    {isbn && <div className="mt-1 text-xs text-white/70">{isbn}</div>}
  </div>
);

export function BookFlipbook3D({ book, onClose }: BookFlipbook3DProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<any>(null);
  const [content, setContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFlipbookInitialized, setIsFlipbookInitialized] = useState(false);

  // Fetch book content from free APIs
  useEffect(() => {
    fetchBookContent(book)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch book content:', err);
        setLoading(false);
      });
  }, [book]);

  // Initialize page flip with error handling
  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeFlipbook = async () => {
      if (!mounted || !bookRef.current || !content) return;

      // Wait for next tick to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!mounted) return;

      try {
        // Get all page elements
        const pages = bookRef.current.querySelectorAll('.page');
        console.log('Found pages:', pages.length);

        if (pages.length === 0) {
          setError('No pages found to display');
          return;
        }

        // Initialize PageFlip with the container
        const pageFlip = new PageFlip(bookRef.current, {
          width: 400,
          height: 600,
          size: 'stretch',
          minWidth: 315,
          maxWidth: 1000,
          minHeight: 420,
          maxHeight: 1350,
          maxShadowOpacity: 0.5,
          showCover: true,
          mobileScrollSupport: false,
          flippingTime: 1000,
          usePortrait: true,
          startZIndex: 0,
          autoSize: true,
          clickEventForward: true,
          useMouseEvents: true,
          swipeDistance: 30,
          showPageCorners: true,
          disableFlipByClick: false,
          drawShadow: true,
          flippingMode: 'hard',
        });

        pageFlipRef.current = pageFlip;

        // Events with haptic feedback
        pageFlip.on('flip', (e: any) => {
          setCurrentPage(e.data);
          if (isMobile()) hapticFeedback('light');
        });

        pageFlip.on('changeOrientation', () => {
          // updateFromImages is only for image-based flipbooks, not HTML
          console.log('Orientation changed');
        });

        // Load pages - pass NodeList, not container
        pageFlip.loadFromHTML(pages);

        if (mounted) {
          setIsFlipbookInitialized(true);
          console.log('Flipbook initialized successfully');
        }
      } catch (err) {
        console.error('Flipbook initialization error:', err);
        if (mounted) {
          setError('Failed to initialize book viewer. Please try again.');
        }
      }
    };

    if (!loading && content) {
      initTimeout = setTimeout(() => {
        initializeFlipbook();
      }, 0);
    }

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }

      // Only destroy if successfully initialized
      if (isFlipbookInitialized && pageFlipRef.current) {
        try {
          const flipInstance = pageFlipRef.current;
          if (flipInstance.destroy && typeof flipInstance.destroy === 'function') {
            flipInstance.destroy();
          }
        } catch (err) {
          console.error('Error destroying flipbook:', err);
        }
      }
      pageFlipRef.current = null;
    };
  }, [loading, content, isFlipbookInitialized]); // Include isFlipbookInitialized for proper cleanup

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-lg text-white">Loading book content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="max-w-md rounded-lg bg-white p-8">
          <h3 className="mb-4 text-xl font-bold text-red-600">Error</h3>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={onClose}
            className="rounded-full bg-primary-blue px-6 py-2 text-white transition-transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const totalPages = 6 + (content?.excerpts.length || 0); // Fixed pages + dynamic excerpts

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 text-white">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <button onClick={onClose} className="touch-none text-3xl transition-transform hover:scale-110 active:scale-95">
          ×
        </button>
      </div>

      {/* Flipbook container */}
      <div className="relative flex flex-1 items-center justify-center p-4">
        {!isFlipbookInitialized && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
            <div className="text-white">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
              <p>Preparing book...</p>
            </div>
          </div>
        )}
        <div className="flipbook-wrapper">
          <div ref={bookRef} className="flipbook">
            {/* Front Cover - Hard page */}
            <div className="page page-cover page-cover-top" data-density="hard">
              <div className="page-content">
                <div className="relative h-full w-full">
                  {content?.coverUrl ? (
                    <img src={content.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookCover title={book.title} author={book.author} className="h-full w-full" />
                  )}
                  {/* Subtle texture overlay for realism */}
                  <div className="book-texture absolute inset-0 opacity-10 mix-blend-multiply" />
                </div>
              </div>
            </div>

            {/* Inside Front Cover */}
            <div className="page" data-density="hard">
              <div className="page-content page-left">
                <div className="flex h-full flex-col justify-center p-8">
                  <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
                  <p className="mb-4 text-xl text-gray-600">{book.author}</p>
                  {content?.publishYear && (
                    <p className="text-sm text-gray-500">First published {content.publishYear}</p>
                  )}
                  {content && content.pageCount > 0 && (
                    <p className="mt-2 text-sm text-gray-500">{content.pageCount} pages</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Page */}
            <div className="page">
              <div className="page-content page-right">
                <div className="p-8">
                  <h2 className="mb-4 text-2xl font-bold">About This Book</h2>
                  <p className="text-justify leading-relaxed">
                    {content?.description || book.why || 'No description available.'}
                  </p>
                  {book.genre && <p className="mt-4 text-sm text-gray-600">Genre: {book.genre}</p>}
                </div>
              </div>
            </div>

            {/* Excerpt Pages */}
            {content?.excerpts.map((excerpt, index) => (
              <div key={index} className="page">
                <div className="page-content page-left">
                  <div className="p-8">
                    <h3 className="mb-4 text-lg font-semibold">{excerpt.page || `Excerpt ${index + 1}`}</h3>
                    <p className="text-justify text-sm leading-relaxed">{excerpt.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* No excerpts fallback page */}
            {(!content?.excerpts || content.excerpts.length === 0) && (
              <div className="page">
                <div className="page-content page-left">
                  <div className="flex h-full flex-col items-center justify-center p-8">
                    <h3 className="mb-4 text-center text-lg font-semibold">Preview Not Available</h3>
                    <p className="text-center text-gray-600">
                      No preview content is available for this book. Check your local library or bookstore for the full
                      text.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Where to Read More */}
            <div className="page">
              <div className="page-content page-right">
                <div className="p-8">
                  <h3 className="mb-4 text-xl font-bold">Continue Reading</h3>

                  {content?.hasFullText && (
                    <div className="mb-6 rounded-lg bg-green-100 p-4">
                      <p className="mb-2 font-semibold text-green-800">📚 This book is in the public domain!</p>
                      <a
                        href={content.fullTextUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline hover:text-green-700"
                      >
                        Read the full book for free →
                      </a>
                    </div>
                  )}

                  <div className="space-y-3">
                    {book.isbn && (
                      <a
                        href={`https://openlibrary.org/isbn/${book.isbn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        View on Open Library →
                      </a>
                    )}
                    <div className="mt-4">
                      <h4 className="mb-2 font-semibold">Find at Your Library</h4>
                      <p className="text-sm text-gray-600">Check your local library for availability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inside Back Cover */}
            <div className="page" data-density="hard">
              <div className="page-content page-left">
                <div className="flex h-full flex-col p-8">
                  <div className="flex-1">
                    <h3 className="mb-4 text-lg font-semibold">Why We Recommend This</h3>
                    <p className="mb-4 text-sm text-gray-700">
                      {book.why || 'This book was selected based on your interests.'}
                    </p>

                    {content?.metadata.subjects && (
                      <div className="mt-4">
                        <h4 className="mb-2 text-sm font-semibold">Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {(content.metadata.subjects as string[]).slice(0, 5).map((subject, i) => (
                            <span key={i} className="rounded bg-gray-200 px-2 py-1 text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <Barcode isbn={book.isbn} />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Cover - Hard page */}
            <div className="page page-cover page-cover-bottom" data-density="hard">
              <div className="page-content">
                {content?.backCoverUrl ? (
                  <img src={content.backCoverUrl} alt="Back cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900 p-8 text-white">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="mb-4 text-sm opacity-80">
                          {book.synopsis || content?.description?.substring(0, 200) + '...' || ''}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs">Powered by Stacks</p>
                        <p className="mt-1 text-xs">AI-Powered Book Discovery</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      {isFlipbookInitialized && (
        <div className="flex items-center justify-center gap-4 p-4 text-white">
          <button
            onClick={() => pageFlipRef.current?.flipPrev()}
            className="touch-none rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30 active:scale-95"
            disabled={currentPage === 0}
          >
            ← Previous
          </button>
          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => pageFlipRef.current?.flipNext()}
            className="touch-none rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30 active:scale-95"
            disabled={currentPage >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}

      {/* Mobile swipe hints */}
      {isMobile() && currentPage === 0 && (
        <div className="absolute bottom-20 left-0 right-0 animate-pulse text-center text-white">
          <p className="text-sm">Swipe to turn pages</p>
        </div>
      )}
    </div>
  );
}
