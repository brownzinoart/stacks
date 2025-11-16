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
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-yellow p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-purple">SEARCH</span>
            <br />
            <span className="text-mega">LIBRARY</span>
          </h2>
        </div>

        <div className="space-y-6">
          {/* Search Type Tabs */}
          <div className="outline-bold-thin flex gap-2 rounded-2xl bg-white/80 p-2 backdrop-blur-sm">
            <button
              onClick={() => setSearchType('text')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition-all duration-300 sm:text-base ${
                searchType === 'text'
                  ? 'shadow-backdrop bg-primary-blue text-white'
                  : 'text-text-primary hover:bg-white/60'
              }`}
            >
              📝 TEXT
            </button>
            <button
              onClick={() => setSearchType('isbn')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition-all duration-300 sm:text-base ${
                searchType === 'isbn'
                  ? 'shadow-backdrop bg-primary-blue text-white'
                  : 'text-text-primary hover:bg-white/60'
              }`}
            >
              📷 ISBN
            </button>
            <button
              onClick={() => setSearchType('voice')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition-all duration-300 sm:text-base ${
                searchType === 'voice'
                  ? 'shadow-backdrop bg-primary-blue text-white'
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
                  className="outline-bold-thin flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 font-bold text-text-primary placeholder-text-secondary focus:border-primary-blue focus:outline-none"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="touch-feedback shadow-backdrop hover:shadow-backdrop-lg rounded-2xl bg-primary-blue px-8 py-4 text-base font-black text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                >
                  {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </form>
          )}

          {searchType === 'isbn' && (
            <div className="space-y-6 text-center">
              <p className="text-lg font-bold text-text-primary">Point your camera at a book&apos;s barcode</p>
              <button
                onClick={handleISBNScan}
                className="touch-feedback shadow-backdrop hover:shadow-backdrop-lg rounded-2xl bg-primary-blue px-8 py-4 text-lg font-black text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                📷 START ISBN SCAN
              </button>
            </div>
          )}

          {searchType === 'voice' && (
            <div className="space-y-6 text-center">
              <p className="text-lg font-bold text-text-primary">Tap to speak your search</p>
              <button
                onClick={handleVoiceSearch}
                className="touch-feedback shadow-backdrop hover:shadow-backdrop-lg rounded-2xl bg-primary-blue px-8 py-4 text-lg font-black text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                🎤 START VOICE SEARCH
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
