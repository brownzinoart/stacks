/**
 * Standard Search component - traditional search with text, ISBN scan, and voice input
 * Provides multiple ways to search for books before AR features
 */

'use client';

import { useState } from 'react';

type SearchType = 'text' | 'isbn' | 'voice';

export const StandardSearch = () => {
  const [searchType, setSearchType] = useState<SearchType>('text');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && searchType !== 'voice') return;

    setIsSearching(true);
    // TODO: Implement search API call
    console.log(`${searchType} search:`, query);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  const handleVoiceSearch = () => {
    // TODO: Implement voice search
    console.log('Starting voice search...');
  };

  const handleISBNScan = () => {
    // TODO: Implement camera ISBN scanning
    console.log('Starting ISBN scan...');
  };

  return (
    <div className="bg-primary-yellow rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
            <span className="text-primary-purple">SEARCH</span><br />
            <span className="text-mega">LIBRARY</span>
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Search Type Tabs */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-2xl outline-bold-thin">
            <button
              onClick={() => setSearchType('text')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-black transition-all duration-300 ${
                searchType === 'text'
                  ? 'bg-primary-blue text-white shadow-backdrop'
                  : 'text-text-primary hover:bg-white/60'
              }`}
            >
              📝 TEXT
            </button>
            <button
              onClick={() => setSearchType('isbn')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-black transition-all duration-300 ${
                searchType === 'isbn'
                  ? 'bg-primary-blue text-white shadow-backdrop'
                  : 'text-text-primary hover:bg-white/60'
              }`}
            >
              📷 ISBN
            </button>
            <button
              onClick={() => setSearchType('voice')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-black transition-all duration-300 ${
                searchType === 'voice'
                  ? 'bg-primary-blue text-white shadow-backdrop'
                  : 'text-text-primary hover:bg-white/60'
              }`}
            >
              🎤 VOICE
            </button>
          </div>
          
          {/* Search Input */}
          {searchType === 'text' && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, author, or keyword..."
                  className="flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 text-text-primary font-bold placeholder-text-secondary focus:border-primary-blue focus:outline-none outline-bold-thin"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="bg-primary-blue text-white px-8 py-4 rounded-2xl font-black text-base hover:scale-105 transition-transform touch-feedback disabled:opacity-50 shadow-backdrop"
                >
                  {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </form>
          )}
          
          {searchType === 'isbn' && (
            <div className="text-center space-y-6">
              <p className="text-text-primary font-bold text-lg">Point your camera at a book&apos;s barcode</p>
              <button
                onClick={handleISBNScan}
                className="bg-primary-blue text-white font-black py-4 px-8 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg"
              >
                📷 START ISBN SCAN
              </button>
            </div>
          )}
          
          {searchType === 'voice' && (
            <div className="text-center space-y-6">
              <p className="text-text-primary font-bold text-lg">Tap to speak your search</p>
              <button
                onClick={handleVoiceSearch}
                className="bg-primary-blue text-white font-black py-4 px-8 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg"
              >
                🎤 START VOICE SEARCH
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-green rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 