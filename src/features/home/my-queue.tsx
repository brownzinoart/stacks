/**
 * My Queue component - Ultra Bold Gen Z Design
 * Mobile-optimized book cards with prominent real book covers and touch feedback
 */

'use client';

import { BookCover } from '@/components/book-cover';

const mockQueueBooks = [
  {
    id: 1,
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    status: 'ready',
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'hold',
  },
  {
    id: 3,
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    status: 'hold',
  },
];

export const MyQueue = () => {
  const handleBookClick = (book: any) => {
    // TODO: Navigate to book details
    console.log('Opening book:', book.title);
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-pink">BOOK</span>
              <br />
              <span className="text-mega">QUEUE</span>
            </h1>
          </div>
          <div className="shadow-backdrop rounded-full bg-primary-orange px-3 py-2 text-sm font-black text-white sm:px-4">
            {mockQueueBooks.length} BOOKS
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {mockQueueBooks.length === 0 ? (
            <div className="py-12 text-center sm:py-16">
              <h3 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">Nothing here yet!</h3>
              <p className="text-base font-medium text-text-secondary sm:text-lg">
                Search for something amazing to add to your queue
              </p>
            </div>
          ) : (
            mockQueueBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="outline-bold-thin touch-feedback mobile-touch flex w-full items-start gap-6 rounded-2xl border-2 border-transparent p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary-green/20 hover:bg-gray-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] sm:gap-8 sm:p-8"
              >
                <BookCover title={book.title} author={book.author} className="h-28 w-20 sm:h-32 sm:w-24" />

                <div className="min-w-0 flex-1 text-left">
                  <h3 className="mb-2 text-lg font-black leading-tight text-text-primary sm:mb-3 sm:text-xl">
                    {book.title}
                  </h3>
                  <p className="mb-4 text-sm font-bold text-text-secondary sm:mb-6 sm:text-base">{book.author}</p>

                  <div>
                    <span
                      className={`shadow-backdrop inline-flex items-center rounded-full px-4 py-2 text-sm font-black sm:px-6 sm:py-3 sm:text-base ${
                        book.status === 'ready'
                          ? 'bg-primary-green text-text-primary'
                          : 'bg-primary-yellow text-text-primary'
                      }`}
                    >
                      {book.status === 'ready' ? 'READY TO READ!' : 'ON HOLD'}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {mockQueueBooks.length > 0 && (
          <button className="pop-element touch-feedback mobile-touch w-full rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-105 hover:bg-text-primary/90 sm:px-8 sm:py-6 sm:text-lg">
            VIEW ALL BOOKS →
          </button>
        )}
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-4 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-6 right-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-8 top-2 z-0 h-8 w-8 rounded-full bg-primary-yellow opacity-35 sm:h-12 sm:w-12" />
      <div className="sm:w-18 sm:h-18 animate-float absolute bottom-8 left-6 z-0 h-14 w-14 rounded-full bg-primary-green opacity-20" />
      <div className="animate-float-delayed absolute left-2 top-10 z-0 h-6 w-6 rounded-full bg-primary-blue opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-2 right-2 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
