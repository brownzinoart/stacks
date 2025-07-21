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
    status: 'ready'
  },
  { 
    id: 2, 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    status: 'hold'
  },
  { 
    id: 3, 
    title: 'The Silent Patient', 
    author: 'Alex Michaelides', 
    status: 'hold'
  },
];

export const MyQueue = () => {
  const handleBookClick = (book: any) => {
    // TODO: Navigate to book details
    console.log('Opening book:', book.title);
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-huge font-black text-text-primary leading-extra-tight">
              <span className="text-primary-pink">BOOK</span><br />
              <span className="text-mega">QUEUE</span>
            </h1>
          </div>
          <div className="bg-primary-orange text-white text-sm font-black px-3 sm:px-4 py-2 rounded-full shadow-backdrop">
            {mockQueueBooks.length} BOOKS
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {mockQueueBooks.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Nothing here yet!</h3>
              <p className="text-text-secondary text-base sm:text-lg font-medium">
                Search for something amazing to add to your queue
              </p>
            </div>
          ) : (
            mockQueueBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="w-full flex items-start gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-2 border-transparent hover:border-primary-green/20 outline-bold-thin touch-feedback mobile-touch"
              >
                <BookCover 
                  title={book.title} 
                  author={book.author} 
                  className="w-20 h-28 sm:w-24 sm:h-32"
                />
                
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-black text-text-primary text-lg sm:text-xl leading-tight mb-2 sm:mb-3">{book.title}</h3>
                  <p className="text-text-secondary text-sm sm:text-base font-bold mb-4 sm:mb-6">{book.author}</p>
                  
                  <div>
                    <span className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-black shadow-backdrop ${
                      book.status === 'ready'
                        ? 'bg-primary-green text-text-primary'
                        : 'bg-primary-yellow text-text-primary'
                    }`}>
                      {book.status === 'ready' ? 'READY TO READ!' : 'ON HOLD'}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        {mockQueueBooks.length > 0 && (
          <button className="w-full bg-text-primary text-white font-black py-4 sm:py-6 px-6 sm:px-8 rounded-full hover:bg-text-primary/90 hover:scale-105 transition-all duration-300 pop-element text-base sm:text-lg touch-feedback mobile-touch">
            VIEW ALL BOOKS →
          </button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-6 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-6 right-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-2 right-8 w-8 h-8 sm:w-12 sm:h-12 bg-primary-yellow rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-8 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-green rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-10 left-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary-blue rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-orange rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 