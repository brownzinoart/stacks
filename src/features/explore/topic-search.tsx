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
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-orange p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-blue">LEARNING</span>
            <br />
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
              className="outline-bold-thin flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 font-bold text-text-primary placeholder-text-secondary focus:border-primary-blue focus:outline-none"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isSearching}
              className="touch-feedback shadow-backdrop hover:shadow-backdrop-lg rounded-2xl bg-primary-blue px-8 py-4 text-base font-black text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            >
              {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </div>

          <div className="text-base font-bold text-text-primary sm:text-lg">
            We&apos;ll find 5-10 books to create a comprehensive learning path for your topic
          </div>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-yellow opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-green opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
    </div>
  );
};
