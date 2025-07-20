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
          <div className="bg-primary-green rounded-3xl p-12 relative overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.3)]">
            <div className="relative z-10">
              <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-6">
                <span className="text-primary-orange">MATCH MY</span><br />
                <span className="text-mega">MOOD</span>
              </h1>
              <p className="text-xl text-text-primary mb-8 font-bold leading-tight">
                Tell us what you&apos;re into!<br />
                Get AI book & movie recs
              </p>
              <AIPromptInput />
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-yellow rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="absolute top-4 left-4 w-16 h-16 bg-primary-purple rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-primary-teal rounded-full opacity-50 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
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