/**
 * Discover page - Main book discovery hub with AI recommendations and exploration features
 * Features: What's Next AI prompts, More Ways to Discover, New Releases, Community Discoveries, AR features
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { ARShelfScan } from '@/features/ar/ar-shelf-scan';
import { ARDirections } from '@/features/ar/ar-directions';
import AIPromptInput from '@/features/home/ai-prompt-input';
import { NewReleases } from '@/features/home/recent-searches';
import { MoreWaysToDiscover } from '@/features/home/more-ways-to-discover';
import { CommunityDiscoveries } from '@/features/home/community-discoveries';
import { useState, useEffect } from 'react';

const DiscoverPage = () => {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'scan' | 'directions' | null>(null);
  const [selectedLibrary, setSelectedLibrary] = useState<'cary-regional' | 'eva-perry-apex'>('cary-regional');
  const [selectedBook, setSelectedBook] = useState<{
    title: string;
    location: { sectionId: string; floor: number; shelfNumber?: string };
  } | null>(null);

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

          {/* Community Discoveries */}
          <div className="animate-fade-in-up animation-delay-400">
            <CommunityDiscoveries />
          </div>

          {/* AR Features Section */}
          <div className="animate-fade-in-up animation-delay-500">
            <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-teal p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
              <div className="relative z-10">
                <h2 className="mb-4 text-xl font-black text-text-primary sm:mb-6">
                  <span className="text-primary-pink">AR BOOK</span>
                  <br />
                  <span className="text-mega">DISCOVERY</span>
                </h2>
                <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                  Use your camera to discover books
                  <br />
                  and navigate the library like magic!
                </p>

                {/* Feature Selection */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setActiveFeature('scan')}
                    className="touch-feedback shadow-backdrop rounded-2xl bg-primary-purple p-6 text-left transition-transform hover:scale-105"
                  >
                    <div className="space-y-3">
                      <div className="text-4xl">📚</div>
                      <h3 className="text-xl font-black text-text-primary">SHELF SCANNER</h3>
                      <p className="text-base font-bold text-text-primary">
                        Point at shelves to see book recommendations
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveFeature('directions')}
                    className="touch-feedback shadow-backdrop rounded-2xl bg-primary-blue p-6 text-left transition-transform hover:scale-105"
                  >
                    <div className="space-y-3">
                      <div className="text-4xl">🧭</div>
                      <h3 className="text-xl font-black text-text-primary">BOOK NAVIGATOR</h3>
                      <p className="text-base font-bold text-text-primary">Get AR directions to any book location</p>
                    </div>
                  </button>
                </div>

                {/* Library Selection */}
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-black text-text-primary">SELECT YOUR LIBRARY:</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setSelectedLibrary('cary-regional')}
                      className={`touch-feedback rounded-2xl p-4 text-left transition-all ${
                        selectedLibrary === 'cary-regional'
                          ? 'shadow-backdrop bg-primary-yellow'
                          : 'bg-white/80 hover:bg-white/90'
                      }`}
                    >
                      <h4 className="font-black text-text-primary">Cary Regional Library</h4>
                      <p className="text-sm font-bold text-text-secondary">315 Kildaire Farm Rd</p>
                    </button>
                    <button
                      onClick={() => setSelectedLibrary('eva-perry-apex')}
                      className={`touch-feedback rounded-2xl p-4 text-left transition-all ${
                        selectedLibrary === 'eva-perry-apex'
                          ? 'shadow-backdrop bg-primary-yellow'
                          : 'bg-white/80 hover:bg-white/90'
                      }`}
                    >
                      <h4 className="font-black text-text-primary">Eva Perry Regional (Apex)</h4>
                      <p className="text-sm font-bold text-text-secondary">2100 Shepherd&apos;s Vineyard Dr</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="animate-float sm:h-18 sm:w-18 absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-yellow opacity-25 shadow-[0_4px_15px_rgb(0,0,0,0.2)]" />
              <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-green opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-14 sm:w-14" />
              <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-orange opacity-35 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
              <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-purple opacity-20 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-16 sm:w-16" />
              <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-pink opacity-40 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-8 sm:w-8" />
              <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-blue opacity-30 shadow-[0_4px_15px_rgb(0,0,0,0.2)] sm:h-12 sm:w-12" />
            </div>
          </div>

          {/* Active AR Feature */}
          {activeFeature === 'scan' && (
            <div className="animate-fade-in-up animation-delay-600">
              <ARShelfScan />
            </div>
          )}

          {activeFeature === 'directions' && (
            <div className="animate-fade-in-up animation-delay-600">
              {/* Sample Book Selection for Navigation */}
              {!selectedBook && (
                <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-orange p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
                  <div className="relative z-10 space-y-6">
                    <h2 className="text-xl font-black text-text-primary">SELECT A BOOK TO NAVIGATE TO:</h2>

                    <div className="grid gap-4">
                      {selectedLibrary === 'cary-regional' ? (
                        <>
                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: 'The Great Gatsby',
                                location: { sectionId: 'adult-fiction', floor: 2, shelfNumber: 'F-7' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">The Great Gatsby</h3>
                            <p className="text-sm font-bold text-text-secondary">Adult Fiction • Floor 2 • Shelf F-7</p>
                          </button>

                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: "Harry Potter and the Sorcerer's Stone",
                                location: { sectionId: 'childrens', floor: 1, shelfNumber: 'J-15' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">Harry Potter</h3>
                            <p className="text-sm font-bold text-text-secondary">
                              Children&apos;s • Floor 1 • Shelf J-15
                            </p>
                          </button>

                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: 'Educated: A Memoir',
                                location: { sectionId: 'non-fiction', floor: 2, shelfNumber: 'B-22' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">Educated</h3>
                            <p className="text-sm font-bold text-text-secondary">Non-Fiction • Floor 2 • Shelf B-22</p>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: 'Where the Crawdads Sing',
                                location: { sectionId: 'adult-fiction', floor: 1, shelfNumber: 'F-12' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">Where the Crawdads Sing</h3>
                            <p className="text-sm font-bold text-text-secondary">Adult Fiction • Shelf F-12</p>
                          </button>

                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: 'The Very Hungry Caterpillar',
                                location: { sectionId: 'tree-house', floor: 1, shelfNumber: 'P-3' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">The Very Hungry Caterpillar</h3>
                            <p className="text-sm font-bold text-text-secondary">Tree House • Shelf P-3</p>
                          </button>

                          <button
                            onClick={() =>
                              setSelectedBook({
                                title: 'Atomic Habits',
                                location: { sectionId: 'non-fiction', floor: 1, shelfNumber: 'S-18' },
                              })
                            }
                            className="outline-bold-thin rounded-2xl bg-white/80 p-4 text-left backdrop-blur-sm hover:bg-white/90"
                          >
                            <h3 className="font-black text-text-primary">Atomic Habits</h3>
                            <p className="text-sm font-bold text-text-secondary">Non-Fiction • Shelf S-18</p>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedBook && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-black text-text-primary">Navigating to: {selectedBook.title}</h3>
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="font-bold text-primary-blue hover:underline"
                    >
                      Change Book
                    </button>
                  </div>
                  <ARDirections targetBookLocation={selectedBook.location} libraryId={selectedLibrary} />
                </>
              )}
            </div>
          )}

          {/* Instructions Card */}
          {!activeFeature && (
            <div className="animate-fade-in-up animation-delay-700">
              <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-yellow p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
                <div className="relative z-10 space-y-6 sm:space-y-8">
                  <h2 className="text-xl font-black text-text-primary">AR FEATURES - HOW IT WORKS</h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                      <h3 className="mb-3 text-lg font-black text-text-primary">📚 SHELF SCANNER</h3>
                      <ul className="space-y-2 text-base font-bold text-text-primary">
                        <li>• Hold your phone up to book shelves</li>
                        <li>• AI recognizes book titles from spines</li>
                        <li>• Green highlights = recommendations</li>
                        <li>• Blue highlights = available now</li>
                        <li>• Tap books for instant details</li>
                      </ul>
                    </div>

                    <div className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm">
                      <h3 className="mb-3 text-lg font-black text-text-primary">🧭 BOOK NAVIGATOR</h3>
                      <ul className="space-y-2 text-base font-bold text-text-primary">
                        <li>• Select any book in the catalog</li>
                        <li>• Point camera at the floor</li>
                        <li>• Follow the green path overlay</li>
                        <li>• Orange marker = destination</li>
                        <li>• Works on all library floors</li>
                      </ul>
                    </div>
                  </div>

                  <div className="outline-bold-thin rounded-2xl bg-primary-green/20 p-6 backdrop-blur-sm">
                    <p className="text-center text-lg font-black text-text-primary">
                      🎯 NOW AVAILABLE AT CARY & APEX LIBRARIES!
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
                <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DiscoverPage;