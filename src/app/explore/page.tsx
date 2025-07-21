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
      
      <main className="flex-1 overflow-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Hero Section with Search */}
          <div className="bg-primary-green rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.3)] animate-fade-in-up pop-element-lg">
            <div className="relative z-10">
              <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
                <span className="text-primary-orange">EXPLORE</span><br />
                <span className="text-mega">& LEARN</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-primary mb-6 sm:mb-8 font-bold leading-tight">
                Curated book collections to master<br />
                any topic you want to explore!
              </p>
              
              {/* Search Form */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin">
                <form className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter a topic (e.g., Machine Learning, Spanish History, Photography)"
                      className="flex-1 rounded-2xl border-2 border-text-primary px-6 py-4 text-text-primary font-bold placeholder-text-secondary focus:border-primary-blue focus:outline-none outline-bold-thin"
                    />
                    <button
                      type="submit"
                      className="bg-primary-blue text-white px-8 py-4 rounded-2xl font-black text-base hover:scale-105 transition-transform touch-feedback shadow-backdrop"
                    >
                      SEARCH
                    </button>
                  </div>
                  
                  <div className="text-base sm:text-lg text-text-primary font-bold">
                    We&apos;ll find 5-10 books to create a comprehensive learning path for your topic
                  </div>
                </form>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-teal rounded-full opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
            <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
            <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-yellow rounded-full opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float z-0" />
            <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-purple rounded-full opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-delayed z-0" />
            <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-orange rounded-full opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] animate-float-slow z-0" />
          </div>

          {/* Sample Learning Path - Ancient Egypt */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="bg-primary-purple rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
              <div className="space-y-6 sm:space-y-8 relative z-10">
                <div>
                  <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
                    <span className="text-primary-yellow">SAMPLE</span><br />
                    <span className="text-mega">LEARNING PATH</span>
                  </h2>
                  <p className="text-lg sm:text-xl text-text-primary font-bold mb-6">
                    See how learning paths work with this Ancient Egypt example
                  </p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-black text-text-primary text-xl mb-3">Ancient Egypt: From Pharaohs to Pyramids</h3>
                      <p className="text-base text-text-primary font-bold">A comprehensive journey through Egyptian history, culture, and archaeology</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-text-primary font-bold">PROGRESS</span>
                        <span className="font-black text-text-primary">2/6 books completed</span>
                      </div>
                      
                      <div className="w-full bg-white/60 rounded-full h-3 outline-bold-thin">
                        <div 
                          className="bg-primary-green h-3 rounded-full transition-all duration-300 shadow-[0_2px_8px_rgb(0,0,0,0.2)]"
                          style={{ width: '33%' }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 bg-primary-green/20 rounded-2xl">
                        <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                        <div>
                          <h4 className="font-black text-text-primary">The Complete Pyramids</h4>
                          <p className="text-sm text-text-primary font-bold">Mark Lehner • Completed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-primary-green/20 rounded-2xl">
                        <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                        <div>
                          <h4 className="font-black text-text-primary">Egyptian Mythology</h4>
                          <p className="text-sm text-text-primary font-bold">Geraldine Pinch • Completed</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                        <div className="w-3 h-3 bg-primary-yellow rounded-full"></div>
                        <div>
                          <h4 className="font-black text-text-primary">The Oxford History of Ancient Egypt</h4>
                          <p className="text-sm text-text-primary font-bold">Ian Shaw • In Progress</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-white/40 rounded-2xl opacity-60">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <div>
                          <h4 className="font-black text-text-primary">Tutankhamun: The Untold Story</h4>
                          <p className="text-sm text-text-primary font-bold">Thomas Hoving • Up Next</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-base text-text-primary font-bold">
                      <span>4/6 available</span>
                      <span>6-8 weeks</span>
                    </div>
                    
                    <button className="w-full bg-primary-blue text-white font-black py-3 px-6 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg">
                      CONTINUE PATH
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
              <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-yellow rounded-full opacity-30 animate-float-delayed z-0" />
              <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 animate-float-slow z-0" />
              <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-green rounded-full opacity-20 animate-float z-0" />
              <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-40 animate-float-delayed z-0" />
              <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-pink rounded-full opacity-30 animate-float-slow z-0" />
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