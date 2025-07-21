/**
 * New Releases component - Ultra Bold Gen Z Design
 * Mobile-optimized new book releases with touch feedback
 */

'use client';

const mockNewReleases = [
  { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Sci-Fi' },
  { title: 'The Four Winds', author: 'Kristin Hannah', genre: 'Historical' },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi' },
  { title: 'Malibu Rising', author: 'Taylor Jenkins Reid', genre: 'Fiction' },
  { title: 'The Push', author: 'Ashley Audrain', genre: 'Thriller' },
];

export const NewReleases = () => {
  const handleBookClick = (book: any) => {
    // TODO: Navigate to book details
    console.log('Opening book:', book.title);
  };

  return (
    <div className="bg-primary-yellow rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h1 className="text-huge font-black text-text-primary leading-extra-tight">
            <span className="text-primary-purple">NEW</span><br />
            <span className="text-mega">RELEASES</span>
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockNewReleases.map((book, index) => (
            <button
              key={index}
              onClick={() => handleBookClick(book)}
              className="bg-white text-left p-4 sm:p-6 rounded-2xl hover:bg-primary-green hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-text-primary/20 pop-element touch-feedback mobile-touch"
            >
              <div className="space-y-2">
                <h3 className="font-black text-text-primary text-base sm:text-lg leading-tight">
                  {book.title}
                </h3>
                <p className="text-text-secondary text-sm font-bold">
                  {book.author}
                </p>
                <div className="inline-flex items-center bg-primary-blue text-white px-2 py-1 rounded-full text-xs font-bold">
                  {book.genre}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <button className="bg-text-primary text-white px-6 py-3 rounded-full font-black text-sm hover:scale-105 transition-transform touch-feedback">
            VIEW ALL NEW RELEASES →
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-green rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 