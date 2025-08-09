/**
 * Community Discoveries component - Ultra Bold Gen Z Design
 * Shows what others in the area are discovering
 */

'use client';

import { useRouter } from 'next/navigation';
import { BookCover } from '@/components/book-cover';

const mockCommunityBooks = [
  {
    id: 1,
    title: 'The Atlas Six',
    author: 'Olivie Blake',
    discoveredBy: 12,
    locationTag: 'Campus Library',
  },
  {
    id: 2,
    title: 'Babel',
    author: 'R.F. Kuang',
    discoveredBy: 8,
    locationTag: 'Downtown Branch',
  },
  {
    id: 3,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    discoveredBy: 15,
    locationTag: 'Your Area',
  },
];

export const CommunityDiscoveries = () => {
  const handleBookClick = (book: any) => {
    console.log('Opening community book:', book.title);
  };

  const handleViewMore = () => {
    console.log('View more community discoveries');
    // TODO: Navigate to community discoveries page
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-pink p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-blue">COMMUNITY</span>
              <br />
              <span className="text-mega">DISCOVERIES</span>
            </h2>
          </div>
          <div className="shadow-backdrop rounded-full bg-primary-yellow px-3 py-2 text-sm font-black text-text-primary sm:px-4">
            LOCAL PICKS
          </div>
        </div>

        <p className="text-lg font-bold text-text-primary sm:text-xl">See what readers near you are discovering!</p>

        <div className="space-y-4 sm:space-y-6">
          {mockCommunityBooks.map((book, index) => (
            <button
              key={book.id}
              onClick={() => handleBookClick(book)}
              className="outline-bold-thin touch-feedback mobile-touch flex w-full items-start gap-4 rounded-2xl border-2 border-transparent bg-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-white/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] sm:gap-6 sm:p-6"
            >
              <BookCover title={book.title} author={book.author} className="h-20 w-14 sm:h-24 sm:w-16" />

              <div className="min-w-0 flex-1 text-left">
                <h3 className="mb-1 text-base font-black leading-tight text-white sm:mb-2 sm:text-lg">{book.title}</h3>
                <p className="mb-3 text-sm font-bold text-white/80 sm:mb-4 sm:text-base">{book.author}</p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="shadow-backdrop inline-flex items-center rounded-full bg-primary-green px-3 py-1 text-xs font-black text-white sm:px-4 sm:py-2 sm:text-sm">
                    {book.discoveredBy} readers
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/30 px-3 py-1 text-xs font-bold text-white sm:px-4 sm:py-2 sm:text-sm">
                    📍 {book.locationTag}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-orange text-lg font-black text-white sm:h-10 sm:w-10 sm:text-xl">
                  {index + 1}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleViewMore}
          className="pop-element touch-feedback mobile-touch w-full rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-105 hover:bg-text-primary/90 sm:px-8 sm:py-6 sm:text-lg"
        >
          EXPLORE MORE COMMUNITY PICKS →
        </button>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-4 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-6 right-4 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-8 top-2 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float sm:h-18 sm:w-18 absolute bottom-8 left-6 z-0 h-14 w-14 rounded-full bg-primary-yellow opacity-20" />
      <div className="animate-float-delayed absolute left-2 top-10 z-0 h-6 w-6 rounded-full bg-primary-green opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-4 left-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
