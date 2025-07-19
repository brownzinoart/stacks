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
    <div className="rounded-card bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Search Library</h2>
      
      <div className="space-y-4">
        {/* Search Type Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSearchType('text')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              searchType === 'text'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => setSearchType('isbn')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              searchType === 'isbn'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            📷 ISBN
          </button>
          <button
            onClick={() => setSearchType('voice')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              searchType === 'voice'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            🎤 Voice
          </button>
        </div>
        
        {/* Search Input */}
        {searchType === 'text' && (
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="flex-1 rounded-lg border border-border px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </form>
        )}
        
        {searchType === 'isbn' && (
          <div className="text-center space-y-4">
            <p className="text-text-secondary">Point your camera at a book&apos;s barcode</p>
            <button
              onClick={handleISBNScan}
              className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              📷 Start ISBN Scan
            </button>
          </div>
        )}
        
        {searchType === 'voice' && (
          <div className="text-center space-y-4">
            <p className="text-text-secondary">Tap to speak your search</p>
            <button
              onClick={handleVoiceSearch}
              className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              🎤 Start Voice Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 