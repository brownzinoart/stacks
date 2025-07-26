/**
 * Explore & Learn page - Topic bundles and learning paths
 * Features: Topic search, learning paths, branch aggregation
 */

import { Navigation } from '@/components/navigation';
import { TopicSearch } from '@/features/explore/topic-search';
import { PopularPathsInArea } from '@/features/explore/branch-availability';

const ExplorePage = () => {
  return (
    <div className="flex h-full flex-col bg-bg-light">
      <Navigation />

      <main className="flex-1 overflow-auto px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section with Search */}
          <div className="animate-fade-in-up pop-element-lg relative overflow-hidden rounded-3xl bg-primary-green p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-orange">EXPLORE</span>
                <br />
                <span className="text-mega">& LEARN</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Curated book collections to master
                <br />
                any topic you want to explore!
              </p>

              {/* Search Form */}
              <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                <form className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter a topic (e.g., Machine Learning, Spanish History, Photography)"
                      className="outline-bold-thin flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 font-bold text-text-primary placeholder-text-secondary focus:border-primary-blue focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="touch-feedback shadow-backdrop rounded-2xl bg-primary-blue px-8 py-4 text-base font-black text-white transition-transform hover:scale-105"
                    >
                      SEARCH
                    </button>
                  </div>

                  <div className="text-base font-bold text-text-primary sm:text-lg">
                    We&apos;ll find 5-10 books to create a comprehensive learning path for your topic
                  </div>
                </form>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
            <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
            <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
            <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-yellow opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
            <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
            <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-orange opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
          </div>

          {/* Sample Learning Path - Ancient Egypt */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div>
                  <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                    <span className="text-primary-yellow">SAMPLE</span>
                    <br />
                    <span className="text-mega">LEARNING PATH</span>
                  </h2>
                  <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
                    See how learning paths work with this Ancient Egypt example
                  </p>
                </div>

                <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-xl font-black text-text-primary">
                        Ancient Egypt: From Pharaohs to Pyramids
                      </h3>
                      <p className="text-base font-bold text-text-primary">
                        A comprehensive journey through Egyptian history, culture, and archaeology
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="font-bold text-text-primary">PROGRESS</span>
                        <span className="font-black text-text-primary">2/6 books completed</span>
                      </div>

                      <div className="outline-bold-thin h-3 w-full rounded-full bg-white/60">
                        <div
                          className="h-3 rounded-full bg-primary-green shadow-[0_2px_8px_rgb(0,0,0,0.2)] transition-all duration-300"
                          style={{ width: '33%' }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 rounded-2xl bg-primary-green/20 p-4">
                        <div className="h-3 w-3 rounded-full bg-primary-green"></div>
                        <div>
                          <h4 className="font-black text-text-primary">The Complete Pyramids</h4>
                          <p className="text-sm font-bold text-text-primary">Mark Lehner • Completed</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl bg-primary-green/20 p-4">
                        <div className="h-3 w-3 rounded-full bg-primary-green"></div>
                        <div>
                          <h4 className="font-black text-text-primary">Egyptian Mythology</h4>
                          <p className="text-sm font-bold text-text-primary">Geraldine Pinch • Completed</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4">
                        <div className="h-3 w-3 rounded-full bg-primary-yellow"></div>
                        <div>
                          <h4 className="font-black text-text-primary">The Oxford History of Ancient Egypt</h4>
                          <p className="text-sm font-bold text-text-primary">Ian Shaw • In Progress</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl bg-white/40 p-4 opacity-60">
                        <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                        <div>
                          <h4 className="font-black text-text-primary">Tutankhamun: The Untold Story</h4>
                          <p className="text-sm font-bold text-text-primary">Thomas Hoving • Up Next</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-base font-bold text-text-primary">
                      <span>4/6 available</span>
                      <span>6-8 weeks</span>
                    </div>

                    <button className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-blue px-6 py-3 text-lg font-black text-white transition-transform hover:scale-105">
                      CONTINUE PATH
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
              <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-yellow opacity-30 sm:h-14 sm:w-14" />
              <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
              <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
              <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
              <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-12 sm:w-12" />
            </div>
          </div>

          {/* Popular Paths in Your Area */}
          <div className="animate-fade-in-up animation-delay-400">
            <PopularPathsInArea />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
