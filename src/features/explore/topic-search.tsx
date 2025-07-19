/**
 * Topic Search component - allows users to search for learning paths and topic bundles
 * Assembles 5-10 book "learning paths" for comprehensive topic coverage
 */

'use client';

import { useState } from 'react';

export const TopicSearch = () => {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSearching(true);
    // TODO: Implement topic search API call
    console.log('Searching for topic:', topic);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Search Learning Paths
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Machine Learning, Spanish History, Photography)"
            className="flex-1 rounded-lg border border-border px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={!topic.trim() || isSearching}
            className="rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="text-sm text-text-secondary">
          We&apos;ll find 5-10 books to create a comprehensive learning path for your topic
        </div>
      </form>
    </div>
  );
}; 