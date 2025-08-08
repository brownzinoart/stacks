'use client';

import { useState, useEffect } from 'react';
import { BookCover } from './book-cover';
import { hapticFeedback, isMobile } from '@/lib/mobile-utils';
import { fetchBookContent, BookContent } from '@/lib/book-content-service';

interface BookFlipbookCustom3DProps {
  book: {
    title: string;
    author: string;
    isbn?: string;
    why?: string;
    whyYoullLikeIt?: string;
    summary?: string;
    pageCount?: string;
    readingTime?: string;
    publisher?: string;
    year?: string;
    genre?: string;
    synopsis?: string;
  };
  onClose: () => void;
}

export function BookFlipbookCustom3D({ book, onClose }: BookFlipbookCustom3DProps) {
  const [content, setContent] = useState<BookContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(-1); // -1 means book is closed
  const [flippedPages, setFlippedPages] = useState<Set<number>>(new Set());

  // Calculate total pages (fixed pages + dynamic excerpts)
  const totalPages = 3 + Math.ceil((content?.excerpts.length || 0) / 2); // 3 fixed + excerpt pages

  // Fetch book content
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

  const turnPage = (direction: number) => {
    if (direction > 0 && currentPage < totalPages) {
      // Turn page forward
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      if (newPage > 0) {
        setFlippedPages((prev) => new Set([...prev, newPage - 1]));
      }

      if (isMobile()) hapticFeedback('light');
    } else if (direction < 0 && currentPage > -1) {
      // Turn page backward
      if (currentPage > 0) {
        setFlippedPages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentPage - 1);
          return newSet;
        });
      }
      setCurrentPage(currentPage - 1);

      if (isMobile()) hapticFeedback('light');
    }
  };

  const handlePageClick = (pageIndex: number) => {
    if (pageIndex === currentPage - 1) {
      turnPage(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') turnPage(1);
      if (e.key === 'ArrowLeft') turnPage(-1);
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-lg text-white">Loading book content...</div>
      </div>
    );
  }

  const getPageIndicator = () => {
    if (currentPage === -1) return 'Click to open';
    if (currentPage === 0) return 'Cover';
    if (currentPage === totalPages) return 'Back Cover';
    return `Page ${currentPage * 2} - ${currentPage * 2 + 1}`;
  };

  // Group excerpts into pages (2 per page)
  const excerptPages = [];
  if (content?.excerpts) {
    for (let i = 0; i < content.excerpts.length; i += 2) {
      excerptPages.push({
        left: content.excerpts[i],
        right: content.excerpts[i + 1],
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 text-white">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <button onClick={onClose} className="touch-none text-3xl transition-transform hover:scale-110 active:scale-95">
          ×
        </button>
      </div>

      {/* 3D Book container */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flipbook-wrapper">
          <div className="flipbook" onClick={() => currentPage === -1 && turnPage(1)}>
            <div className="book-spine" />

            {/* Front Cover - Page 0 */}
            <div
              className={`page p0 ${flippedPages.has(0) ? 'flipped' : ''}`}
              data-page="0"
              onClick={() => handlePageClick(0)}
            >
              <div className="page-face front">
                <div className="page-content p-0">
                  {content?.coverUrl ? (
                    <img
                      src={content.coverUrl}
                      alt={book.title}
                      className="h-full w-full rounded-lg object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-primary-purple p-8 text-white">
                      <h1 className="mb-4 text-center text-4xl font-black">{book.title}</h1>
                      <p className="text-center text-xl opacity-90">{book.author}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="page-face back">
                <div className="page-content">
                  <h2>Welcome</h2>
                  <p className="mt-4 text-sm">{book.synopsis || 'Inside front cover'}</p>
                </div>
              </div>
            </div>

            {/* Page 1 - Title & Description */}
            <div
              className={`page p1 ${flippedPages.has(1) ? 'flipped' : ''}`}
              data-page="1"
              onClick={() => handlePageClick(1)}
            >
              <div className="page-face front">
                <div className="page-content">
                  <h2>{book.title}</h2>
                  <p className="mb-4 text-lg text-gray-600">by {book.author}</p>
                  {content?.publishYear && (
                    <p className="text-sm text-gray-500">First published {content.publishYear}</p>
                  )}
                  {content && content.pageCount > 0 && (
                    <p className="mt-2 text-sm text-gray-500">{content.pageCount} pages</p>
                  )}
                </div>
              </div>
              <div className="page-face back">
                <div className="page-content">
                  <h2>Book Details</h2>

                  {/* Why You'll Like It */}
                  {(book.whyYoullLikeIt || book.why) && (
                    <div className="mb-4">
                      <h3 className="mb-2 text-base font-semibold text-primary-blue">Why You&apos;ll Like It</h3>
                      <p className="text-justify text-sm">{book.whyYoullLikeIt || book.why}</p>
                    </div>
                  )}

                  {/* Summary */}
                  {(book.summary || content?.description) && (
                    <div className="mb-4">
                      <h3 className="mb-2 text-base font-semibold text-primary-blue">Summary</h3>
                      <p className="text-justify text-sm">{book.summary || content?.description}</p>
                    </div>
                  )}

                  {/* Publication Details */}
                  <div className="mt-4 space-y-1 text-xs text-gray-600">
                    {(book.year || content?.publishYear) && <p>Published: {book.year || content?.publishYear}</p>}
                    {book.publisher && <p>Publisher: {book.publisher}</p>}
                    {(book.pageCount || (content && content.pageCount > 0)) && (
                      <p>Pages: {book.pageCount || content?.pageCount}</p>
                    )}
                    {book.readingTime && <p>Reading Time: {book.readingTime}</p>}
                    {book.isbn && <p>ISBN: {book.isbn}</p>}
                    {book.genre && <p>Genre: {book.genre}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt Pages */}
            {excerptPages.map((excerptPage, index) => (
              <div
                key={index}
                className={`page p${index + 2} ${flippedPages.has(index + 2) ? 'flipped' : ''}`}
                data-page={index + 2}
                onClick={() => handlePageClick(index + 2)}
              >
                <div className="page-face front">
                  <div className="page-content">
                    {excerptPage.left && (
                      <>
                        <h3 className="mb-4 text-lg font-semibold">
                          {excerptPage.left.page || `Excerpt ${index * 2 + 1}`}
                        </h3>
                        <p className="text-justify text-sm">{excerptPage.left.text}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="page-face back">
                  <div className="page-content">
                    {excerptPage.right ? (
                      <>
                        <h3 className="mb-4 text-lg font-semibold">
                          {excerptPage.right.page || `Excerpt ${index * 2 + 2}`}
                        </h3>
                        <p className="text-justify text-sm">{excerptPage.right.text}</p>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">This page is intentionally left blank</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Back Cover - Last Page */}
            <div
              className={`page p${totalPages - 1} ${flippedPages.has(totalPages - 1) ? 'flipped' : ''}`}
              data-page={totalPages - 1}
              onClick={() => handlePageClick(totalPages - 1)}
            >
              <div className="page-face front">
                <div className="page-content">
                  <h3 className="mb-4 text-lg font-semibold">Continue Reading</h3>
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
                  {book.isbn && (
                    <a
                      href={`https://openlibrary.org/isbn/${book.isbn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-4 block text-blue-600 hover:underline"
                    >
                      View on Open Library →
                    </a>
                  )}
                </div>
              </div>
              <div className="page-face back">
                <div className="page-content">
                  <h2>Stacks</h2>
                  <p className="mb-4 text-sm">AI-Powered Book Discovery</p>
                  {content?.backCoverUrl ? (
                    <img
                      src={content.backCoverUrl}
                      alt="Back cover"
                      className="h-full w-full rounded-lg object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="mt-8 text-sm text-gray-600">
                      <p>{book.synopsis || content?.description?.substring(0, 200) + '...' || ''}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-4 p-4 text-white">
        <button
          onClick={() => turnPage(-1)}
          className="touch-none rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30 active:scale-95 disabled:opacity-30"
          disabled={currentPage <= -1}
        >
          ← Previous
        </button>
        <span className="min-w-[120px] text-center text-sm">{getPageIndicator()}</span>
        <button
          onClick={() => turnPage(1)}
          className="touch-none rounded-full bg-white/20 px-4 py-2 transition-colors hover:bg-white/30 active:scale-95 disabled:opacity-30"
          disabled={currentPage >= totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
