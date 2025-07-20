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
    <div className="bg-primary-yellow rounded-3xl p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden">
      <div className="space-y-8 relative z-10">
        <div>
          {/* Trending Badge */}
          <div className="inline-flex items-center bg-primary-orange text-white px-3 py-1 rounded-full text-xs font-black mb-3 shadow-[0_4px_15px_rgb(0,0,0,0.2)]">
            TRENDING
          </div>
          <h2 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wider">YOUR</h2>
          <h1 className="text-huge font-black text-text-primary leading-extra-tight">
            <span className="text-primary-purple">RECENT</span><br />
            <span className="text-mega">SEARCHES</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {mockRecentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearchClick(search)}
              className="bg-white text-text-primary font-black px-6 py-4 rounded-full text-lg hover:bg-primary-green hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-text-primary/20 shadow-[0_4px_15px_rgb(0,0,0,0.2)]"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-teal rounded-full opacity-20" />
      <div className="absolute bottom-4 left-8 w-16 h-16 bg-primary-pink rounded-full opacity-30" />
      <div className="absolute top-1/2 -left-4 w-20 h-20 bg-primary-blue rounded-full opacity-25" />
      <div className="absolute bottom-8 right-16 w-12 h-12 bg-primary-green rounded-full opacity-40" />
    </div>
  );
}; 