/**
 * Book Details Modal Component
 * Clean, focused display of book information separate from the flipbook experience
 */

'use client';

import { useState, useEffect } from 'react';
import { BookCover } from './book-cover';
import { hapticFeedback, isMobile } from '@/lib/mobile-utils';

interface BookDetailsModalProps {
  book: {
    title: string;
    author: string;
    isbn?: string;
    year?: string;
    whyYoullLikeIt?: string;
    why?: string;
    summary?: string;
    pageCount?: string;
    readingTime?: string;
    publisher?: string;
    cover?: string;
  };
  onClose: () => void;
}

export function BookDetailsModal({ book, onClose }: BookDetailsModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleBackdropClick}>
      <div className="animate-fade-in-up max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-mega">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-black text-text-primary">Book Details</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 touch-none items-center justify-center rounded-full bg-gray-100 text-2xl text-text-secondary transition-all hover:scale-110 hover:bg-gray-200 active:scale-95"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Book Cover */}
            <div className="flex-shrink-0 sm:w-48">
              <BookCover
                title={book.title}
                author={book.author}
                coverUrl={book.cover}
                className="mx-auto h-64 w-44 border-4 border-primary-blue shadow-[0_8px_30px_rgb(0,0,0,0.25)] sm:h-72 sm:w-48"
              />
            </div>

            {/* Book Information */}
            <div className="flex-1 space-y-6">
              {/* Title & Author */}
              <div>
                <h1 className="mb-2 text-3xl font-black text-text-primary">{book.title}</h1>
                <p className="text-xl font-bold text-text-secondary">{book.author}</p>
              </div>

              {/* Why You'll Like It */}
              {(book.whyYoullLikeIt || book.why) && (
                <div>
                  <h3 className="mb-3 text-lg font-black text-primary-blue">Why You&apos;ll Love This</h3>
                  <p className="text-base leading-relaxed text-text-primary">{book.whyYoullLikeIt || book.why}</p>
                </div>
              )}

              {/* Summary */}
              {book.summary && (
                <div>
                  <h3 className="mb-3 text-lg font-black text-primary-green">Summary</h3>
                  <p className="text-base leading-relaxed text-text-primary">{book.summary}</p>
                </div>
              )}

              {/* Publication Details */}
              <div>
                <h3 className="mb-3 text-lg font-black text-primary-purple">Publication Details</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {book.year && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-secondary">Year:</span>
                      <span className="text-text-primary">{book.year}</span>
                    </div>
                  )}
                  {book.publisher && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-secondary">Publisher:</span>
                      <span className="text-text-primary">{book.publisher}</span>
                    </div>
                  )}
                  {book.pageCount && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-secondary">Pages:</span>
                      <span className="text-text-primary">{book.pageCount}</span>
                    </div>
                  )}
                  {book.readingTime && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-secondary">Reading Time:</span>
                      <span className="text-text-primary">{book.readingTime}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="col-span-1 flex items-center gap-2 sm:col-span-2">
                      <span className="font-bold text-text-secondary">ISBN:</span>
                      <span className="font-mono text-sm text-text-primary">{book.isbn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="touch-none rounded-full bg-gray-200 px-6 py-3 font-bold text-text-primary transition-all hover:scale-105 hover:bg-gray-300 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
