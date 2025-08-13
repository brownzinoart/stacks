/**
 * Kids page - Child-friendly book discovery and reading activities
 * Features: Age-appropriate recommendations, reading games, and family content
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';

const KidsPage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Page Header */}
          <div className="animate-fade-in-up text-center">
            <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary">
              <span className="text-primary-pink">KIDS</span>
              <br />
              <span className="text-mega text-primary-orange">CORNER</span>
            </h1>
            <p className="text-lg font-bold text-text-primary sm:text-xl">
              Fun books and reading adventures for young explorers!
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-yellow p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10 text-center space-y-6">
              <div className="text-8xl">🚧</div>
              <h2 className="text-huge font-black text-text-primary">
                COMING SOON!
              </h2>
              <p className="text-xl font-bold text-text-primary">
                We&apos;re building something amazing for our youngest readers.
                <br />
                Check back soon for interactive stories, reading games, and age-appropriate book recommendations!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-pink opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="animate-float-delayed absolute right-8 top-8 z-0 h-12 w-12 rounded-full bg-primary-blue opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="animate-float-slow absolute bottom-6 left-8 z-0 h-10 w-10 rounded-full bg-primary-green opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="animate-float absolute bottom-8 right-6 z-0 h-14 w-14 rounded-full bg-primary-purple opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default KidsPage;