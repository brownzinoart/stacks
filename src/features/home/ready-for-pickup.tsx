/**
 * Ready for Pickup component - Ultra Bold Gen Z Design
 * Shows reserved books awaiting library pickup with AR directions
 */

'use client';

import { BookCover } from '@/components/book-cover';

const mockPickupBooks = [
  {
    id: 1,
    title: 'Iron Flame',
    author: 'Rebecca Yarros',
    holdShelf: 'A-12',
    availableUntil: '2025-08-15',
    daysLeft: 6,
  },
  {
    id: 2,
    title: 'Happy Place',
    author: 'Emily Henry',
    holdShelf: 'B-08',
    availableUntil: '2025-08-20',
    daysLeft: 11,
  },
];

export const ReadyForPickup = () => {
  const handleArDirections = () => {
    console.log('AR Directions clicked');
    // TODO: Navigate to AR directions
  };

  const handleBookClick = (book: any) => {
    console.log('Opening book:', book.title);
  };

  if (mockPickupBooks.length === 0) {
    return null; // Don't render if no books
  }

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-orange p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-blue">READY FOR</span>
              <br />
              <span className="text-mega">PICKUP</span>
            </h2>
          </div>
          <div className="shadow-backdrop rounded-full bg-primary-green px-3 py-2 text-sm font-black text-white sm:px-4">
            {mockPickupBooks.length} READY
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {mockPickupBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => handleBookClick(book)}
              className="outline-bold-thin touch-feedback mobile-touch flex w-full items-start gap-6 rounded-2xl border-2 border-transparent bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] sm:gap-8 sm:p-8"
            >
              <BookCover title={book.title} author={book.author} className="h-24 w-16 sm:h-28 sm:w-20" />

              <div className="min-w-0 flex-1 text-left">
                <h3 className="mb-2 text-lg font-black leading-tight text-white sm:mb-3 sm:text-xl">{book.title}</h3>
                <p className="mb-4 text-sm font-bold text-white/80 sm:mb-6 sm:text-base">{book.author}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="shadow-backdrop inline-flex items-center rounded-full bg-primary-blue px-4 py-2 text-sm font-black text-white sm:px-6 sm:py-3 sm:text-base">
                      SHELF {book.holdShelf}
                    </span>
                    <div className="text-sm font-bold text-white/80 sm:text-base">{book.daysLeft} days left</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* AR Directions CTA */}
        <button
          onClick={handleArDirections}
          className="pop-element touch-feedback mobile-touch w-full rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-105 hover:bg-text-primary/90 sm:px-8 sm:py-6 sm:text-lg"
        >
          🔍 GET AR DIRECTIONS TO BOOKS
        </button>

        <div className="text-center">
          <p className="text-base font-bold text-white sm:text-lg">Use AR to find your books in the library!</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float sm:h-18 sm:w-18 absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25" />
      <div className="animate-float-delayed absolute bottom-6 right-6 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-4 top-8 z-0 h-8 w-8 rounded-full bg-primary-yellow opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-8 left-4 z-0 h-12 w-12 rounded-full bg-primary-blue opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-2 top-2 z-0 h-6 w-6 rounded-full bg-primary-green opacity-40 sm:h-8 sm:w-8" />
    </div>
  );
};
