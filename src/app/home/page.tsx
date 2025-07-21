/**
 * Home page - Ultra Bold Gen Z Library Dashboard
 * Mobile-optimized with AI-powered book discovery
 */

import { Navigation } from '@/components/navigation';
import { AIPromptInput } from '@/features/home/ai-prompt-input';
import { NewReleases } from '@/features/home/recent-searches';
import { MyQueue } from '@/features/home/my-queue';
import { ReadingStreak } from '@/features/home/reading-streak';

const HomePage = () => {
  return (
    <div className="flex h-full flex-col bg-bg-light">
      <Navigation />
      
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section - Match My Mood */}
          <div className="bg-primary-green rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.3)] animate-fade-in-up pop-element-lg">
            <div className="relative z-10">
              <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
                <span className="text-primary-orange">MATCH MY</span><br />
                <span className="text-mega">MOOD</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-primary mb-6 sm:mb-8 font-bold leading-tight">
                Tell us what you&apos;re into!<br />
                Get instant recommendations for your next read!
              </p>
              <AIPromptInput />
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute top-6 left-6 w-16 h-16 sm:w-20 sm:h-20 bg-primary-yellow rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute top-2 right-12 w-12 h-12 sm:w-16 sm:h-16 bg-primary-purple rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
            <div className="absolute bottom-6 right-6 w-8 h-8 sm:w-12 sm:h-12 bg-primary-teal rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
            <div className="absolute bottom-12 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute top-12 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-blue rounded-full opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
          </div>

          {/* New Releases */}
          <div className="animate-fade-in-up animation-delay-200">
            <NewReleases />
          </div>
          
          {/* Bottom Grid - Queue and Reading Streak */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up animation-delay-400">
              <MyQueue />
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <ReadingStreak />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage; 