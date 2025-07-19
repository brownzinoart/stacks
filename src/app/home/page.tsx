/**
 * Home page - Ultra Bold Gen Z Library Dashboard
 * Massive typography, vibrant colors, dramatic spacing
 */

import { Navigation } from '@/components/navigation';
import { AIPromptInput } from '@/features/home/ai-prompt-input';
import { RecentSearches } from '@/features/home/recent-searches';
import { MyQueue } from '@/features/home/my-queue';
import { ReadingStreak } from '@/features/home/reading-streak';

const HomePage = () => {
  return (
    <div className="flex h-full flex-col bg-bg-light">
      <Navigation />
      
      <main className="flex-1 overflow-auto px-8 py-12">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Hero Section - Match My Mood */}
          <div className="bg-primary-green rounded-xl-card p-12 relative overflow-hidden shadow-mega">
            <div className="relative z-10">
              <h1 className="text-mega font-black text-text-primary mb-6 leading-super-tight">
                Match My<br />
                <span className="text-primary-orange">Mood</span>
              </h1>
              <p className="text-xl text-text-primary mb-8 font-bold leading-tight">
                Tell us what you&apos;re into!<br />
                Get AI book & movie recs ✨
              </p>
              <AIPromptInput />
            </div>
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary-orange rounded-full opacity-30" />
            <div className="absolute top-8 right-16 w-24 h-24 bg-primary-purple rounded-full opacity-20" />
          </div>

          {/* Recent Searches */}
          <RecentSearches />
          
          {/* Bottom Grid - Queue and Reading Streak */}
          <div className="grid gap-12 lg:grid-cols-2">
            <MyQueue />
            <ReadingStreak />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 