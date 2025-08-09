/**
 * Explore page - AR discovery and book finding tools
 * Features: Standard search, AR shelf scan, branch explorer
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { Suspense, lazy } from 'react';

// Lazy load heavy components for better performance
const StandardSearch = lazy(() =>
  import('@/features/ar/standard-search').then((module) => ({ default: module.StandardSearch }))
);
const ARShelfScan = lazy(() =>
  import('@/features/ar/ar-shelf-scan').then((module) => ({ default: module.ARShelfScan }))
);
const BranchExplorer = lazy(() =>
  import('@/features/ar/branch-explorer').then((module) => ({ default: module.BranchExplorer }))
);

// Loading fallback component
const ComponentLoader = () => (
  <div className="animate-pulse rounded-2xl bg-gray-100 p-6">
    <div className="mb-4 h-4 rounded bg-gray-200"></div>
    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
  </div>
);

const ExplorePage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="animate-fade-in-up pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-yellow">EXPLORE</span>
                <br />
                <span className="text-mega">& DISCOVER</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Find books with AR shelf scanning
                <br />
                and explore your library like never before!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-6 z-0 h-14 w-14 rounded-full bg-primary-yellow opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-pink opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
            <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
            <div className="animate-float absolute bottom-12 left-4 z-0 h-10 w-10 rounded-full bg-primary-green opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
            <div className="animate-float-delayed absolute right-4 top-12 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-45 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
          </div>

          {/* Discovery Features */}
          <div className="animate-fade-in-up animation-delay-200">
            <Suspense fallback={<ComponentLoader />}>
              <StandardSearch />
            </Suspense>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <Suspense fallback={<ComponentLoader />}>
              <ARShelfScan />
            </Suspense>
          </div>

          <div className="animate-fade-in-up animation-delay-600">
            <Suspense fallback={<ComponentLoader />}>
              <BranchExplorer />
            </Suspense>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ExplorePage;
