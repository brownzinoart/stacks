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
    <div className="bg-primary-orange rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
            <span className="text-primary-blue">LEARNING</span><br />
            <span className="text-mega">PATHS</span>
          </h2>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., Machine Learning, Spanish History, Photography)"
              className="flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 text-text-primary font-bold placeholder-text-secondary focus:border-primary-blue focus:outline-none outline-bold-thin"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isSearching}
              className="bg-primary-blue text-white px-8 py-4 rounded-2xl font-black text-base hover:scale-105 transition-transform touch-feedback disabled:opacity-50 shadow-backdrop"
            >
              {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </div>
          
          <div className="text-base sm:text-lg text-text-primary font-bold">
            We&apos;ll find 5-10 books to create a comprehensive learning path for your topic
          </div>
        </form>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-teal rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-yellow rounded-full opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-purple rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-green rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
    </div>
  );
}; 