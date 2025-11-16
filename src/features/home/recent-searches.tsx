/**
 * New Releases component - Ultra Bold Gen Z Design
 * Mobile-optimized new book releases with touch feedback
 */

'use client';

const mockBooks = [
  { title: 'Iron Flame', author: 'Rebecca Yarros', genre: 'Fantasy' },
  { title: 'Fourth Wing', author: 'Rebecca Yarros', genre: 'Fantasy' },
  { title: 'Happy Place', author: 'Emily Henry', genre: 'Romance' },
  { title: 'The Atlas Six', author: 'Olivie Blake', genre: 'Dark Academia' },
  { title: 'Lessons in Chemistry', author: 'Bonnie Garmus', genre: 'Fiction' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Fiction' },
];

export const NewReleases = () => {
  const handleBookClick = (book: any) => {
    console.log('Opening book:', book.title);
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-yellow p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-huge font-black leading-extra-tight text-text-primary">
            <span className="text-primary-purple">NEW</span>
            <br />
            <span className="text-mega">RELEASES</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockBooks.map((book, index) => (
              <button
              key={index}
              onClick={() => handleBookClick(book)}
              className="pop-element touch-feedback mobile-touch rounded-2xl bg-white p-4 text-left transition-all duration-300 hover:scale-105 hover:bg-primary-green hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] focus:outline-none focus:ring-4 focus:ring-text-primary/20 sm:p-6"
            >
              <div className="space-y-2">
                <h3 className="text-base font-black leading-tight text-text-primary sm:text-lg">{book.title}</h3>
                <p className="text-sm font-bold text-text-secondary">{book.author}</p>
                <div className="inline-flex items-center rounded-full bg-primary-blue px-2 py-1 text-xs font-bold text-white">
                  {book.genre}
                </div>
              </div>
              </button>
          ))}
        </div>

        <div className="text-center">
          <button className="touch-feedback rounded-full bg-text-primary px-6 py-3 text-sm font-black text-white transition-transform hover:scale-105">
            VIEW ALL NEW RELEASES →
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
