'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BookCover } from '@/components/book-cover';
import { MobileLayout } from '@/components/mobile-layout';
import { SimilarityBadge } from '@/components/similarity-badge';
import { LibraryAvailability } from '@/components/library-availability';
import { hapticFeedback, isMobile } from '@/lib/mobile-utils';
import { readingHistory, type SimilarityScore } from '@/lib/reading-history';

// Dynamic imports for heavy components
const BookFlipbookCustom3D = dynamic(
  () => import('@/components/book-flipbook-custom-3d').then((mod) => ({ default: mod.BookFlipbookCustom3D })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-lg text-white">Loading flipbook...</div>
      </div>
    ),
  }
);

const BookDetailsModal = dynamic(
  () => import('@/components/book-details-modal').then((mod) => ({ default: mod.BookDetailsModal })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-lg text-white">Loading details...</div>
      </div>
    ),
  }
);

const getQueue = () => {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('stacks_queue') || '[]');
    }
    return [];
  } catch {
    return [];
  }
};
const setQueue = (queue: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('stacks_queue', JSON.stringify(queue));
  }
};

const isRealCoverUrl = (url: string) => url && url.startsWith('http');

// Book data fetching moved to BookDetails3D component

const StacksRecommendationsPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [userInput, setUserInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});
  const [borrowed, setBorrowed] = useState<{ [key: number]: boolean }>({});
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [flipbookBook, setFlipbookBook] = useState<any>(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [detailsBook, setDetailsBook] = useState<any>(null);
  const [coverUrls, setCoverUrls] = useState<{ [key: number]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [similarityScores, setSimilarityScores] = useState<{ [key: number]: SimilarityScore }>({});
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const startY = useRef<number | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Load recommendations from localStorage on mount
  useEffect(() => {
    console.log('[Recommendations Debug] Loading data from localStorage');
    const data = localStorage.getItem('stacks_recommendations');
    console.log('[Recommendations Debug] Raw data:', data);
    console.log('[Recommendations Debug] Data length:', data?.length);

    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('🎉🎉🎉 RECOMMENDATIONS PAGE v2.0 - COVER FIX ACTIVE 🎉🎉🎉');
        console.log('[Recommendations Debug] Parsed data:', parsed);
        console.log('[Recommendations Debug] Parsed data keys:', Object.keys(parsed));
        setUserInput(parsed.userInput || '');
        setSearchValue(parsed.userInput || '');

        // Handle new categorized format
        if (parsed.categories) {
          console.log('[Recommendations Debug] Using categories format, found', parsed.categories.length, 'categories');
          console.log('[Recommendations Debug] Categories:', parsed.categories);
          
          // Log cover status for each book
          parsed.categories.forEach((cat: any) => {
            console.log(`📚 Category: ${cat.name}`);
            cat.books.forEach((book: any, idx: number) => {
              console.log(`  📖 Book ${idx + 1}: "${book.title}" - Cover: ${book.cover ? book.cover.substring(0, 50) + '...' : 'NO COVER'}`);
            });
          });
          setCategories(parsed.categories);
          // Flatten all books for display with category info
          let cumulativeIndex = 0;
          const allBooks = parsed.categories.flatMap((cat: any) =>
            cat.books.map((book: any) => {
              const bookWithData = {
                ...book,
                category: cat.name,
                globalIdx: cumulativeIndex, // Use cumulative index for proper mapping
              };
              cumulativeIndex++;
              return bookWithData;
            })
          );

          // Deduplicate books by title, author, and ISBN
          const deduplicateBooks = (books: any[]) => {
            const seen = new Map<string, any>();
            const deduplicated = books.filter((book) => {
              // Create a unique key for each book
              const key = `${book.title?.toLowerCase().trim()}-${book.author?.toLowerCase().trim()}-${book.isbn || ''}`;
              
              if (seen.has(key)) {
                console.log(`📚 Removing duplicate: "${book.title}" by ${book.author} from ${book.category}`);
                return false;
              } 
              
              seen.set(key, book);
              return true;
            });
            
            console.log(`📚 Deduplication: ${books.length} → ${deduplicated.length} books (removed ${books.length - deduplicated.length} duplicates)`);
            return deduplicated;
          };

          const uniqueBooks = deduplicateBooks(allBooks);
          console.log('[Recommendations Debug] Setting', uniqueBooks.length, 'unique books from categories');
          console.log('[Recommendations Debug] Unique books:', uniqueBooks);
          setBooks(uniqueBooks);
        } else if (parsed.books) {
          // Fallback for old format
          console.log('[Recommendations Debug] Using fallback format, found', (parsed.books || []).length, 'books');
          console.log('[Recommendations Debug] Books array:', parsed.books);
          setBooks(parsed.books || []);
        } else {
          // Emergency case - no valid data found
          console.log('[Recommendations Debug] No valid books or categories found in data');
          console.log('[Recommendations Debug] Available keys:', Object.keys(parsed));
          setBooks([]);
        }
      } catch (parseError) {
        console.error('[Recommendations Debug] Failed to parse recommendations data:', parseError);
        console.error('[Recommendations Debug] Raw data that failed to parse:', data);
      }
    } else {
      console.log('[Recommendations Debug] No data found in localStorage');
      // Check if there's any other storage key
      console.log('[Recommendations Debug] All localStorage keys:', Object.keys(localStorage));
    }
  }, []);

  // Update 'added' state when books change
  useEffect(() => {
    const queue = getQueue();
    const addedState: { [key: number]: boolean } = {};
    books.forEach((book, idx) => {
      if (queue.find((b: any) => b.title === book.title && b.author === book.author)) {
        addedState[idx] = true;
      }
    });
    setAdded(addedState);
  }, [books]);

  // Calculate similarity scores for all books (memoized for performance)
  const calculatedSimilarityScores = useMemo(() => {
    const scores: { [key: number]: SimilarityScore } = {};
    books.forEach((book, idx) => {
      const similarity = readingHistory.calculateSimilarity({
        title: book.title,
        author: book.author,
        genres: book.genres,
        topics: book.topics,
      });
      scores[idx] = similarity;
    });
    return scores;
  }, [books]);

  // Update similarity scores when calculated scores change
  useEffect(() => {
    setSimilarityScores(calculatedSimilarityScores);
  }, [calculatedSimilarityScores]);

  // Books should already have covers from pre-fetch, but we'll still check for any missing ones
  useEffect(() => {
    const fetchCovers = async () => {
      const updates: { [key: number]: string } = {};
      const booksNeedingCovers: Array<{ book: any; idx: number }> = [];

      // Find books that don't have covers
      books.forEach((book, idx) => {
        if (!book.cover || !book.cover.startsWith('http')) {
          booksNeedingCovers.push({ book, idx });
        }
      });

      if (booksNeedingCovers.length === 0) return;

      // Use our enhanced cover service for remaining books
      const { bookCoverService } = await import('@/lib/book-cover-service');
      const coverResults = await bookCoverService.getBatchCovers(booksNeedingCovers.map((item) => item.book));

      booksNeedingCovers.forEach((item, resultIdx) => {
        const coverResult = coverResults.get(resultIdx);
        if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
          updates[item.idx] = coverResult.url;
        }
      });

      if (Object.keys(updates).length > 0) {
        setCoverUrls((prev) => ({ ...prev, ...updates }));
      }
    };

    if (books.length > 0) fetchCovers();
  }, [books]);

  const handleAddToQueue = async (book: any, idx: number) => {
    const queue = getQueue();
    if (!queue.find((b: any) => b.title === book.title && b.author === book.author)) {
      queue.push(book);
      setQueue(queue);
      setAdded((prev) => ({ ...prev, [idx]: true }));
      // Add haptic feedback on mobile
      if (isMobileDevice) {
        await hapticFeedback('medium');
      }
    }
  };

  const handleBorrow = async (book: any, idx: number) => {
    setBorrowed((prev) => ({ ...prev, [idx]: true }));

    // Add to reading history
    readingHistory.addToHistory({
      title: book.title,
      author: book.author,
      genres: book.genres,
      topics: book.topics,
    });

    // Recalculate similarity scores after adding to history
    const updatedScores: { [key: number]: SimilarityScore } = {};
    books.forEach((b, i) => {
      const similarity = readingHistory.calculateSimilarity({
        title: b.title,
        author: b.author,
        genres: b.genres,
        topics: b.topics,
      });
      updatedScores[i] = similarity;
    });
    setSimilarityScores(updatedScores);

    setTimeout(() => setBorrowed((prev) => ({ ...prev, [idx]: false })), 1500);
    // Add haptic feedback on mobile
    if (isMobile()) {
      await hapticFeedback('medium');
    }
  };

  const handleBookDetails = async (book: any, idx: number) => {
    setDetailsBook(book);
    setShowBookDetails(true);
    // Add haptic feedback on mobile
    if (isMobileDevice) {
      await hapticFeedback('light');
    }
  };

  const handleBookCoverClick = async (book: any, idx: number) => {
    setFlipbookBook(book);
    setShowFlipbook(true);
    // Add haptic feedback on mobile
    if (isMobile()) {
      await hapticFeedback('medium');
    }
  };

  // Touch handlers for pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && e.touches[0]) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null || !e.touches[0]) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;
    if (distance > 0 && distance < 150) {
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      setIsRefreshing(true);
      setPullDistance(0);
      window.location.reload();
    } else {
      setPullDistance(0);
    }
    startY.current = null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Save new search to localStorage and reload page
    localStorage.setItem('stacks_recommendations', JSON.stringify({ books: [], userInput: searchValue }));
    window.location.reload();
  };

  return (
    <MobileLayout>
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <button onClick={() => router.push('/home')} className="transition-colors hover:text-primary-blue">
            Home
          </button>
          <span>›</span>
          <span className="font-semibold text-text-primary">Recommendations</span>
          {userInput && (
            <>
              <span>›</span>
              <span className="max-w-[200px] truncate text-text-primary">{userInput}</span>
            </>
          )}
        </div>
      </div>

      <div
        className="relative flex flex-col items-center px-4 pb-12"
        onTouchStart={isMobileDevice ? handleTouchStart : undefined}
        onTouchMove={isMobileDevice ? handleTouchMove : undefined}
        onTouchEnd={isMobileDevice ? handleTouchEnd : undefined}
      >
        {/* Pull to refresh indicator */}
        {pullDistance > 0 && (
          <div
            className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center transition-all"
            style={{
              height: `${Math.min(pullDistance, 100)}px`,
              opacity: Math.min(pullDistance / 100, 1),
            }}
          >
            <div
              className={`h-8 w-8 animate-spin rounded-full border-b-2 border-primary-blue ${pullDistance > 80 ? 'border-primary-green' : ''}`}
            ></div>
          </div>
        )}
        {/* Decorative elements */}
        <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25" />
        <div className="animate-float-delayed absolute bottom-6 right-6 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
        <div className="animate-float-slow absolute right-4 top-8 z-0 h-8 w-8 rounded-full bg-primary-orange opacity-35 sm:h-12 sm:w-12" />
        <div className="animate-float absolute bottom-8 left-4 z-0 h-12 w-12 rounded-full bg-primary-blue opacity-20 sm:h-16 sm:w-16" />
        <div className="animate-float-delayed absolute right-2 top-2 z-0 h-6 h-8 w-6 rounded-full bg-primary-green opacity-40 sm:w-8" />
        <div className="animate-float-slow absolute bottom-4 left-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />

        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <h1 className="mb-6 text-4xl font-black leading-extra-tight text-text-primary sm:text-huge">
            <span className="text-primary-yellow">STACKS</span>
            <br />
            <span className="text-3xl sm:text-mega">RECOMMENDATIONS</span>
          </h1>
          {/* Enhanced reprompt section */}
          <div
            className={`${isMobileDevice ? 'sticky top-0 z-40 -mx-4 mb-4 bg-bg-light/95 px-4 py-4 shadow-lg backdrop-blur-lg' : 'mb-8'}`}
          >
            {userInput && (
              <div className="mb-3">
                <p className="mb-1 text-sm font-semibold text-text-secondary">Your original prompt:</p>
                <div className="inline-block rounded-full bg-white/50 px-4 py-2">
                  <span className="font-bold text-text-primary">{userInput}</span>
                </div>
              </div>
            )}
            <form onSubmit={handleSearch} className="flex items-center gap-2 sm:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="outline-bold-thin shadow-backdrop w-full rounded-full bg-white px-4 py-3 text-base font-bold text-text-primary sm:px-6 sm:py-4 sm:text-lg"
                  placeholder="Edit your prompt or try something new..."
                />
              </div>
              <button
                type="submit"
                className="touch-none rounded-full bg-primary-blue px-5 py-3 text-base font-black text-white transition-transform hover:scale-105 active:scale-95 sm:px-6 sm:py-4 sm:text-lg"
                onClick={() => isMobileDevice && hapticFeedback('medium')}
              >
                Update
              </button>
            </form>
            <p className="mt-2 px-2 text-xs text-text-secondary">
              💡 Tip: Try different angles like &quot;books with similar plot twists&quot; or &quot;same emotional
              journey&quot;
            </p>
          </div>

          {/* Category filter pills */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`touch-none whitespace-nowrap rounded-full px-4 py-2 font-bold transition-all ${
                    activeCategory === 'all'
                      ? 'scale-105 bg-primary-blue text-white'
                      : 'bg-white hover:scale-105 active:scale-95'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      if (isMobileDevice) hapticFeedback('light');
                    }}
                    className={`touch-none whitespace-nowrap rounded-full px-4 py-2 font-bold transition-all ${
                      activeCategory === cat.name
                        ? 'scale-105 bg-primary-blue text-white'
                        : 'bg-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category sections display */}
          {categories.length > 0 && activeCategory === 'all' ? (
            // Show all categories as sections
            <div className="space-y-12">
              {(() => {
                let cumulativeIdx = 0;
                return categories.map((category: any, catIdx: number) => (
                  <div key={catIdx} className="space-y-6">
                    <div className="mb-4 border-l-4 border-primary-blue pl-4">
                      <h2 className="mb-2 text-2xl font-black text-text-primary sm:text-3xl">{category.name}</h2>
                      <p className="text-base text-text-secondary">{category.description}</p>
                    </div>
                    <div className="space-y-6">
                      {category.books.map((book: any, bookIdx: number) => {
                        const globalIdx = cumulativeIdx++;
                        return (
                        <div
                          key={globalIdx}
                          className="outline-bold-thin relative flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-[0_10px_40px_rgb(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] sm:flex-row sm:items-start sm:gap-8 sm:p-6"
                        >
                          {/* Clickable Book Cover */}
                          <div className="flex-shrink-0">
                            <div
                              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                              onClick={() => handleBookCoverClick(book, globalIdx)}
                            >
                              <BookCover
                                title={book.title}
                                author={book.author}
                                coverUrl={book.cover || coverUrls[globalIdx]}
                                className="outline-bold-lg h-56 w-40 border-4 border-primary-blue shadow-[0_8px_30px_rgb(0,0,0,0.25)] sm:h-56 sm:w-40"
                              />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 text-center sm:text-left">
                            <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                              <h2 className="text-xl font-black text-text-primary sm:text-2xl">{book.title}</h2>
                              {(() => {
                                const score = similarityScores[globalIdx];
                                return score && score.score > 0 ? <SimilarityBadge score={score} /> : null;
                              })()}
                            </div>
                            <p className="mb-2 text-base font-bold text-text-secondary sm:text-lg">{book.author}</p>
                            <p className="mb-3 text-sm text-text-primary/80 sm:text-base">
                              {book.whyYoullLikeIt || book.why}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
                              <button
                                className={`touch-none rounded-full bg-primary-green px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2 ${added[globalIdx] ? 'bg-primary-blue' : ''}`}
                                onClick={() => handleAddToQueue(book, globalIdx)}
                                disabled={added[globalIdx]}
                              >
                                {added[globalIdx] ? 'Added!' : 'Add to Queue'}
                              </button>
                              <button
                                className={`touch-none rounded-full bg-primary-yellow px-5 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2 ${borrowed[globalIdx] ? 'bg-primary-green' : ''}`}
                                onClick={() => handleBorrow(book, globalIdx)}
                                disabled={borrowed[globalIdx]}
                              >
                                {borrowed[globalIdx] ? 'Borrowed!' : 'Borrow Book'}
                              </button>
                              <button
                                className="touch-none rounded-full bg-primary-blue px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2"
                                onClick={() => handleBookDetails(book, globalIdx)}
                              >
                                Book Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
            </div>
          ) : null}

          {/* Current category info when filtered */}
          {categories.length > 0 && activeCategory !== 'all' && (
            <div className="mb-6 border-l-4 border-primary-blue pl-4">
              <h2 className="mb-2 text-2xl font-black text-text-primary sm:text-3xl">{activeCategory}</h2>
              <p className="text-base text-text-secondary">
                {categories.find((cat: any) => cat.name === activeCategory)?.description}
              </p>
            </div>
          )}

          {/* Books display for filtered view or no categories */}
          {(categories.length === 0 || activeCategory !== 'all') && (
            <div className="space-y-6">
              {books.length === 0 ? (
                <div className="rounded-3xl bg-white/90 p-8 text-center">
                  <h3 className="mb-4 text-2xl font-black text-text-primary">No recommendations yet!</h3>
                  <p className="mb-6 text-text-secondary">Try searching for something you&apos;re interested in.</p>
                  <button
                    onClick={() => router.push('/home')}
                    className="rounded-full bg-primary-blue px-6 py-3 font-bold text-white transition-transform hover:scale-105"
                  >
                    Go Back
                  </button>
                </div>
              ) : (
                books
                  .filter((book) => activeCategory === 'all' || book.category === activeCategory)
                  .map((book, idx) => (
                    <div
                      key={idx}
                      className="outline-bold-thin relative flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-[0_10px_40px_rgb(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.01] sm:flex-row sm:items-start sm:gap-8 sm:p-6"
                    >
                      {/* Clickable Book Cover */}
                      <div className="flex-shrink-0">
                        <div
                          className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                          onClick={() => handleBookCoverClick(book, book.globalIdx || idx)}
                        >
                          <BookCover
                            title={book.title}
                            author={book.author}
                            coverUrl={book.cover || coverUrls[book.globalIdx || idx]}
                            className="outline-bold-lg h-56 w-40 border-4 border-primary-blue shadow-[0_8px_30px_rgb(0,0,0,0.25)] sm:h-56 sm:w-40"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                          <h2 className="text-xl font-black text-text-primary sm:text-2xl">{book.title}</h2>
                          {(() => {
                            const score = similarityScores[book.globalIdx || idx];
                            return score && score.score > 0 ? <SimilarityBadge score={score} /> : null;
                          })()}
                        </div>
                        <p className="mb-2 text-base font-bold text-text-secondary sm:text-lg">{book.author}</p>
                        <p className="mb-3 text-sm text-text-primary/80 sm:text-base">
                          {book.whyYoullLikeIt || book.why}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
                          <button
                            className={`touch-none rounded-full bg-primary-green px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2 ${added[book.globalIdx || idx] ? 'bg-primary-blue' : ''}`}
                            onClick={() => handleAddToQueue(book, book.globalIdx || idx)}
                            disabled={added[book.globalIdx || idx]}
                          >
                            {added[book.globalIdx || idx] ? 'Added!' : 'Add to Queue'}
                          </button>
                          <button
                            className={`touch-none rounded-full bg-primary-yellow px-5 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2 ${borrowed[book.globalIdx || idx] ? 'bg-primary-green' : ''}`}
                            onClick={() => handleBorrow(book, book.globalIdx || idx)}
                            disabled={borrowed[book.globalIdx || idx]}
                          >
                            {borrowed[book.globalIdx || idx] ? 'Borrowed!' : 'Borrow Book'}
                          </button>
                          <button
                            className="touch-none rounded-full bg-primary-blue px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2"
                            onClick={() => handleBookDetails(book, book.globalIdx || idx)}
                          >
                            Book Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* Demo Showcase Card - Shows all features */}
          {books.length > 0 && (
            <div className="mt-12 space-y-6">
              <div className="border-l-4 border-primary-pink pl-4">
                <h2 className="mb-2 text-2xl font-black text-text-primary sm:text-3xl">✨ Feature Showcase</h2>
                <p className="text-base text-text-secondary">Example card showing all available features</p>
              </div>

              <div className="outline-bold-thin relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 p-1">
                <div className="outline-bold-thin relative flex flex-col gap-4 rounded-3xl bg-white/95 p-4 shadow-[0_10px_40px_rgb(0,0,0,0.15)] sm:gap-8 sm:p-6">
                  {/* Demo indicator */}
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-primary-pink px-3 py-1 text-xs font-black text-white">
                    DEMO
                  </div>

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <BookCover
                        title="The Midnight Library"
                        author="Matt Haig"
                        coverUrl="https://covers.openlibrary.org/b/id/10471875-L.jpg"
                        className="outline-bold-lg h-56 w-40 border-4 border-primary-blue shadow-[0_8px_30px_rgb(0,0,0,0.25)] sm:h-56 sm:w-40"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
                      {/* Title, Author, and Similarity */}
                      <div>
                        <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                          <h2 className="text-xl font-black text-text-primary sm:text-2xl">The Midnight Library</h2>
                          <SimilarityBadge
                            score={{
                              score: 95,
                              reasons: [
                                "You've read 3 other books by Matt Haig",
                                "Similar to books you've enjoyed",
                                'Matches your reading preferences',
                              ],
                            }}
                          />
                        </div>
                        <p className="mb-1 text-base font-bold text-text-secondary sm:text-lg">Matt Haig</p>

                        {/* Metadata badges */}
                        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                          <span className="rounded-full bg-primary-yellow px-3 py-1 text-xs font-bold text-text-primary">
                            Fiction
                          </span>
                          <span className="rounded-full bg-primary-orange px-3 py-1 text-xs font-bold text-white">
                            Philosophical
                          </span>
                          <span className="rounded-full bg-primary-purple px-3 py-1 text-xs font-bold text-white">
                            Bestseller
                          </span>
                          <span className="rounded-full bg-primary-green px-3 py-1 text-xs font-bold text-white">
                            Staff Pick
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-text-primary">
                            ⭐ 4.5 · 288 pages · 5hr read
                          </span>
                        </div>
                      </div>

                      {/* Why recommendation */}
                      <p className="text-sm text-text-primary/80 sm:text-base">
                        A dazzling novel about all the choices that go into a life well lived. Between life and death
                        there is a library, and within that library, the shelves go on forever. Every book provides a
                        chance to try another life you could have lived.
                      </p>

                      {/* Publication info */}
                      <p className="text-xs text-text-secondary">2020 · Penguin Random House · ISBN: 9780525559474</p>

                      {/* Action buttons */}
                      <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
                        <button className="touch-none rounded-full bg-primary-green px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2">
                          Add to Queue
                        </button>
                        <button className="touch-none rounded-full bg-primary-yellow px-5 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2">
                          Borrow Book
                        </button>
                        <button className="touch-none rounded-full bg-primary-blue px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2">
                          Learn More
                        </button>
                        <button className="touch-none rounded-full border-2 border-primary-purple bg-white px-5 py-3 text-sm font-bold text-primary-purple transition-transform hover:scale-105 hover:bg-primary-purple hover:text-white active:scale-95 sm:px-4 sm:py-2">
                          Share
                        </button>
                      </div>

                      {/* Library Availability */}
                      <div className="mt-4 rounded-lg bg-gray-50 p-3">
                        <h4 className="mb-2 text-sm font-bold text-text-primary">Library Availability</h4>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Brooklyn Public Library</span>
                            <span className="font-bold text-primary-green">3 copies available</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Queens Library</span>
                            <span className="font-bold text-primary-orange">2 holds</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">NYPL - Grand Central</span>
                            <span className="font-bold text-primary-green">Available now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showFlipbook && flipbookBook && (
          <BookFlipbookCustom3D book={flipbookBook} onClose={() => setShowFlipbook(false)} />
        )}
        {showBookDetails && detailsBook && (
          <BookDetailsModal book={detailsBook} onClose={() => setShowBookDetails(false)} />
        )}
      </div>
    </MobileLayout>
  );
};

export default StacksRecommendationsPage;
