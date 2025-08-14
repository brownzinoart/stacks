/**
 * Home page - Personal reading dashboard and library management hub
 * Features: Reading queue, streak tracking, borrowed books, pickup notifications
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';
import PWAInstallPrompt from '@/components/pwa-install-prompt';
import { MyQueue } from '@/features/home/my-queue';
import { ReadingStreak } from '@/features/home/reading-streak';
import { BorrowedBooks } from '@/features/stacks/borrowed-books';
import { ReadyForPickup } from '@/features/home/ready-for-pickup';
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
          {/* Hero Section - Personal Dashboard */}
          <div
            className="animate-fade-in-up pop-element-lg relative rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12"
            style={{ overflow: 'visible' }}
          >
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-yellow">YOUR</span>
                <br />
                <span className="text-mega">LIBRARY</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Track your reading journey
                <br />
                and manage your personal collection!
              </p>
            </div>

            {/* Enhanced decorative elements - only render after mount to avoid hydration issues */}
            {mounted && (
              <>
                <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-orange opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-20 sm:w-20" />
                <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-green opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
                <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-purple opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
                <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-teal opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
                <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-pink opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
              </>
            )}
          </div>

          {/* Borrowed Books */}
          <div className="animate-fade-in-up animation-delay-200">
            <BorrowedBooks />
          </div>

          {/* Ready for Pickup */}
          <div className="animate-fade-in-up animation-delay-300">
            <ReadyForPickup />
          </div>

          {/* Bottom Grid - Queue and Reading Streak */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up animation-delay-400">
              <MyQueue />
            </div>
            <div className="animate-fade-in-up animation-delay-500">
              <ReadingStreak />
            </div>
          </div>
        </div>
      </div>
      <PWAInstallPrompt />
    </MobileLayout>
  );
};

export default HomePage;