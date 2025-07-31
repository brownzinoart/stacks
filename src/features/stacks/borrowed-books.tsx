/**
 * Borrowed Books component - Ultra Bold Gen Z Design
 * Shows currently borrowed library books with due dates and renewal options
 */

'use client';

import { BookCover } from '@/components/book-cover';

const mockBorrowedBooks = [
  {
    id: 1,
    title: 'Fourth Wing',
    author: 'Rebecca Yarros',
    dueDate: '2025-08-15',
    daysLeft: 12,
    renewable: true,
  },
  {
    id: 2,
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus', 
    dueDate: '2025-08-18',
    daysLeft: 15,
    renewable: true,
  },
  {
    id: 3,
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    dueDate: '2025-08-05',
    daysLeft: 2,
    renewable: false,
  },
];

export const BorrowedBooks = () => {
  const handleRenewBook = (book: any) => {
    console.log('Renewing book:', book.title);
  };

  const handleBookClick = (book: any) => {
    console.log('Opening book:', book.title);
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-teal">YOUR</span>
              <br />
              <span className="text-mega">BOOKS</span>
            </h2>
          </div>
          <div className="shadow-backdrop rounded-full bg-primary-teal px-3 py-2 text-sm font-black text-white sm:px-4">
            {mockBorrowedBooks.length} BORROWED
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {mockBorrowedBooks.map((book) => (
            <div
              key={book.id}
              className="touch-feedback flex items-center gap-4 rounded-2xl bg-bg-light p-4 shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.98] sm:gap-6 sm:p-6"
              onClick={() => handleBookClick(book)}
            >
              <div className="flex-shrink-0">
                <BookCover title={book.title} author={book.author} className="w-12 h-16" />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-base font-black text-text-primary sm:text-lg">
                    {book.title}
                  </h3>
                  <p className="text-sm font-bold text-text-secondary">
                    {book.author}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`rounded-full px-3 py-1 text-xs font-black ${
                    book.daysLeft <= 3 
                      ? 'bg-primary-orange/20 text-primary-orange' 
                      : book.daysLeft <= 7
                      ? 'bg-primary-yellow/20 text-primary-yellow'
                      : 'bg-primary-green/20 text-primary-green'
                  }`}>
                    {book.daysLeft} DAYS LEFT
                  </div>

                  {book.renewable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenewBook(book);
                      }}
                      className="touch-feedback rounded-full bg-primary-blue px-3 py-1 text-xs font-black text-white shadow-backdrop transition-all duration-200 hover:scale-105"
                    >
                      RENEW
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold text-text-secondary">
                  Due: {new Date(book.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="touch-feedback shadow-backdrop rounded-2xl bg-primary-teal px-6 py-3 text-lg font-black text-white transition-transform hover:scale-105">
            VIEW ALL BORROWED
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 right-4 z-0 h-10 w-10 rounded-full bg-primary-blue opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-green opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
    </div>
  );
};