/**
 * Stacks page - Personal reading hub and main dashboard
 * Features: Mood-based recommendations, discovery options, queue, reading streak, borrowed books, community discoveries
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import { AIPromptInput } from '@/features/home/ai-prompt-input';
import { NewReleases } from '@/features/home/recent-searches';
import { MyQueue } from '@/features/home/my-queue';
import { ReadingStreak } from '@/features/home/reading-streak';
import { BorrowedBooks } from '@/features/stacks/borrowed-books';
import { MoreWaysToDiscover } from '@/features/home/more-ways-to-discover';
import { ReadyForPickup } from '@/features/home/ready-for-pickup';
import { CommunityDiscoveries } from '@/features/home/community-discoveries';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section - What's Next */}
          <div
            className="animate-fade-in-up pop-element-lg relative rounded-3xl bg-primary-green p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12"
            style={{ overflow: 'visible' }}
          >
            {/* Character with Book - Single image showing both character and book */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('/maincharacter.png')`,
                  backgroundSize: 'auto 180%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '75% 45%',
                  opacity: 0.65,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25)) brightness(1.08) contrast(1.15) saturate(0.95)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>

            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-orange">WHAT&apos;S</span>
                <br />
                <span className="text-mega">NEXT?</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Tell us what you&apos;re into!
                <br />
                Get instant recommendations for your next read!
              </p>
              <AIPromptInput />
            </div>

            {/* Enhanced decorative elements - only render after mount to avoid hydration issues */}
            {mounted && (
              <>
                <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
                <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-purple opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
                <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
                <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
                <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-blue opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
              </>
            )}
          </div>

          {/* More Ways to Discover */}
          <div className="animate-fade-in-up animation-delay-200">
            <MoreWaysToDiscover />
          </div>

          {/* New Releases */}
          <div className="animate-fade-in-up animation-delay-300">
            <NewReleases />
          </div>

          {/* Borrowed Books */}
          <div className="animate-fade-in-up animation-delay-400">
            <BorrowedBooks />
          </div>

          {/* Ready for Pickup */}
          <div className="animate-fade-in-up animation-delay-500">
            <ReadyForPickup />
          </div>

          {/* Bottom Grid - Queue and Reading Streak */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up animation-delay-600">
              <MyQueue />
            </div>
            <div className="animate-fade-in-up animation-delay-700">
              <ReadingStreak />
            </div>
          </div>

          {/* Community Discoveries */}
          <div className="animate-fade-in-up animation-delay-800">
            <CommunityDiscoveries />
          </div>
        </div>
      </div>
      <PWAInstallPrompt />
    </MobileLayout>
  );
};

export default HomePage;
