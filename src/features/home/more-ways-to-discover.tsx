/**
 * More Ways to Discover component - Ultra Bold Gen Z Design
 * Discovery-focused cards matching existing design patterns
 */

'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';

export const MoreWaysToDiscover = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleBrowseTopics = async () => {
    setIsLoading('topics');
    // Navigate to discovery page for topic exploration
    router.push('/discovery');
  };

  const handleTrendingDiscoveries = async () => {
    setIsLoading('trending');
    // Navigate to stacks-recommendations with trending parameter
    router.push('/stacks-recommendations?trending=true');
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-huge font-black leading-extra-tight text-text-primary">
            <span className="text-primary-orange">MORE WAYS</span>
            <br />
            <span className="text-mega">TO DISCOVER</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Browse Topics */}
          <button
            onClick={handleBrowseTopics}
            disabled={isLoading === 'topics'}
            className="outline-bold-thin touch-feedback mobile-touch rounded-2xl bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] disabled:opacity-70 sm:p-8"
          >
            <div className="text-center">
              <div className="mb-4 text-4xl sm:text-5xl">{isLoading === 'topics' ? '⏳' : '📚'}</div>
              <h3 className="mb-2 text-lg font-black text-white sm:text-xl">
                {isLoading === 'topics' ? 'LOADING...' : 'BROWSE TOPICS'}
              </h3>
              <p className="text-sm font-bold text-white/80 sm:text-base">Explore by category</p>
            </div>
          </button>

          {/* Trending Discoveries */}
          <button
            onClick={handleTrendingDiscoveries}
            disabled={isLoading === 'trending'}
            className="outline-bold-thin touch-feedback mobile-touch rounded-2xl bg-white/20 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] disabled:opacity-70 sm:p-8"
          >
            <div className="text-center">
              <div className="mb-4 text-4xl sm:text-5xl">{isLoading === 'trending' ? '⏳' : '🔥'}</div>
              <h3 className="mb-2 text-lg font-black text-white sm:text-xl">
                {isLoading === 'trending' ? 'LOADING...' : 'TRENDING NOW'}
              </h3>
              <p className="text-sm font-bold text-white/80 sm:text-base">What&apos;s hot right now</p>
            </div>
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-4 top-6 z-0 h-12 w-12 rounded-full bg-primary-yellow opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-6 right-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-8 top-2 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float sm:h-18 sm:w-18 absolute bottom-8 left-6 z-0 h-14 w-14 rounded-full bg-primary-green opacity-20" />
      <div className="animate-float-delayed absolute left-2 top-10 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
    </div>
  );
};
