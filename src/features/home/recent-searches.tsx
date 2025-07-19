/**
 * Recent Searches component - Ultra Bold Gen Z Design
 * Massive typography with playful, dramatic styling
 */

'use client';

const mockRecentSearches = [
  'sci-fi adventure',
  'cozy mysteries',
  'productivity books',
  'fantasy romance',
  'historical fiction',
];

export const RecentSearches = () => {
  const handleSearchClick = (search: string) => {
    // TODO: Implement search functionality
    console.log('Searching for:', search);
  };

  if (mockRecentSearches.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary-yellow rounded-xl-card p-12 shadow-mega relative overflow-hidden">
      <div className="space-y-8 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wider">HELLO</h2>
            <h1 className="text-huge font-black text-text-primary leading-extra-tight">
              check out<br />
              <span className="text-mega text-primary-purple">RECENT</span><br />
              <span className="text-mega">SEARCHES</span>
            </h1>
          </div>
          <button className="w-12 h-12 rounded-full bg-text-primary text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {mockRecentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearchClick(search)}
              className="bg-white text-text-primary font-bold px-6 py-4 rounded-pill text-lg hover:bg-primary-green hover:scale-105 hover:shadow-card-hover transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-text-primary/20"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-teal rounded-full opacity-20" />
      <div className="absolute bottom-4 left-8 w-16 h-16 bg-primary-pink rounded-full opacity-30" />
    </div>
  );
}; 