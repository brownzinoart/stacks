# Search Results & Book Detail Overlay Implementation Plan

## Overview
This plan details the complete implementation of the natural language search results page and book detail overlay for the Stacks reading social app. All designs are prototyped in `design_system/search-results-prototype.html` and `design_system/book-detail-overlay-prototype.html`.

**Engineer Context**: This assumes zero knowledge of the codebase. All file paths, component structures, and API integrations are specified explicitly.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Phase 1: Data Layer Setup](#phase-1-data-layer-setup)
3. [Phase 2: Search Results Page](#phase-2-search-results-page)
4. [Phase 3: Book Detail Overlay](#phase-3-book-detail-overlay)
5. [Phase 4: API Integrations](#phase-4-api-integrations)
6. [Phase 5: Library Settings](#phase-5-library-settings)
7. [Testing & Verification](#testing--verification)

---

## Prerequisites

### Tech Stack Verification
```bash
cd stacks-app
node --version  # Should be v20+
npm --version   # Should be 10+
```

### Dependencies Already Installed
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3.4
- lucide-react (icons)

### Design System Reference
- Colors: `/app/globals.css` (warm neutrals: #F4EFEA, #383838, #6FC2FF, etc.)
- Components: `/design_system/v2.0_refined_design_system.html`
- No gradients on buttons (solid colors only)
- Offset shadows: `-8px 8px 0px #383838`
- Border weights: 5px (cards), 3px (badges), 2px (inputs)

---

## Phase 1: Data Layer Setup

### 1.1 Add New TypeScript Interfaces

**File**: `lib/mockData.ts`

Add these interfaces after the existing ones (after line 58):

```typescript
// ============================================
// SEARCH RESULTS & BOOK DETAIL TYPES
// ============================================

export interface SearchResult {
  query: string;
  atmosphere: {
    tags: string[];
    books: BookSearchMatch[];
  };
  characters: {
    tags: string[];
    books: BookSearchMatch[];
  };
  plot: {
    tags: string[];
    books: BookSearchMatch[];
  };
}

export interface BookSearchMatch {
  book: Book;
  matchPercentage: number;
  matchReasons: {
    atmosphere?: string[];
    characters?: string[];
    plot?: string[];
  };
}

export interface BookDetail extends Book {
  isbn?: string;
  description: string;
  socialProof: {
    isBestseller: boolean;
    bestsellerInfo?: string;
    rating: number;
    ratingsCount: number;
    readerTags: string[];
    reviews: BookReview[];
  };
}

export interface BookReview {
  id: string;
  username: string;
  stars: number;
  text: string;
  source: 'hardcover' | 'google';
}

export interface UserLibrary {
  name: string;
  catalogUrl: string;
  type: 'bibliocommons' | 'overdrive' | 'other';
}
```

### 1.2 Add Mock Data Functions

**File**: `lib/mockData.ts` (add at the end, before exports)

```typescript
// ============================================
// MOCK SEARCH RESULTS
// ============================================

export function getMockSearchResults(query: string): SearchResult {
  // For MVP, return hardcoded results for "cozy mystery small town"
  // TODO: Replace with actual search API call

  return {
    query: query,
    atmosphere: {
      tags: ["Cozy", "Small-town", "Intimate"],
      books: [
        {
          book: {
            id: "search-book-1",
            title: "A Cozy Murder in Maple Grove",
            author: "Sarah Bennett",
            cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
            pageCount: 320,
            publishYear: 2023,
          },
          matchPercentage: 92,
          matchReasons: {
            atmosphere: ["Cozy setting", "Small town vibe", "Intimate feel"],
          },
        },
        {
          book: {
            id: "search-book-2",
            title: "The Bookshop Mystery",
            author: "Emma Collins",
            cover: "https://covers.openlibrary.org/b/isbn/9780593548219-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Bookshop", "Coastal Town"],
            pageCount: 285,
            publishYear: 2024,
          },
          matchPercentage: 88,
          matchReasons: {
            atmosphere: ["Sleepy coastal village", "Dusty bookshop"],
          },
        },
      ],
    },
    characters: {
      tags: ["Amateur Sleuth", "Quirky Cast", "Found Family"],
      books: [
        {
          book: {
            id: "search-book-3",
            title: "Death by Scone",
            author: "Margaret Hastings",
            cover: "https://covers.openlibrary.org/b/isbn/9780062843098-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Quirky Characters"],
            pageCount: 298,
            publishYear: 2023,
          },
          matchPercentage: 85,
          matchReasons: {
            characters: ["Witty baker protagonist", "Eccentric locals"],
          },
        },
        {
          book: {
            id: "search-book-4",
            title: "The Garden Club Murders",
            author: "Helen Carter",
            cover: "https://covers.openlibrary.org/b/isbn/9780593359426-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Found Family"],
            pageCount: 342,
            publishYear: 2024,
          },
          matchPercentage: 83,
          matchReasons: {
            characters: ["Retired teacher sleuth", "Unlikely allies"],
          },
        },
      ],
    },
    plot: {
      tags: ["Mystery", "Slow-burn", "Twisty"],
      books: [
        {
          book: {
            id: "search-book-5",
            title: "Murder at the Village Fair",
            author: "Patricia Reed",
            cover: "https://covers.openlibrary.org/b/isbn/9780593156537-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Mystery", "Slow Burn"],
            pageCount: 315,
            publishYear: 2023,
          },
          matchPercentage: 90,
          matchReasons: {
            plot: ["Festive fair setting", "Layers of secrets"],
          },
        },
        {
          book: {
            id: "search-book-6",
            title: "The Secret Society",
            author: "Diana Woods",
            cover: "https://covers.openlibrary.org/b/isbn/9780593465912-L.jpg",
            genres: ["Mystery", "Thriller"],
            tropes: ["Twisty", "Hidden Societies"],
            pageCount: 365,
            publishYear: 2024,
          },
          matchPercentage: 87,
          matchReasons: {
            plot: ["Twisty reveals", "Hidden societies"],
          },
        },
      ],
    },
  };
}

export function getMockBookDetail(bookId: string): BookDetail | null {
  // For MVP, return hardcoded detail for search-book-1
  // TODO: Replace with actual API calls (Hardcover, Google Books, NYT)

  if (bookId === "search-book-1") {
    return {
      id: "search-book-1",
      title: "A Cozy Murder in Maple Grove",
      author: "Sarah Bennett",
      cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
      isbn: "9780593356890",
      genres: ["Mystery", "Cozy Mystery"],
      tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
      pageCount: 320,
      publishYear: 2023,
      description: "When the town librarian is found dead among the dusty stacks, amateur sleuth Eleanor Thompson must navigate a cast of quirky suspects and long-buried secrets in her small New England town. With its cozy atmosphere, clever twists, and a protagonist you'll root for, this charming mystery is perfect for fans of slow-burn whodunits.",
      socialProof: {
        isBestseller: false,
        rating: 4.2,
        ratingsCount: 1847,
        readerTags: ["Cozy", "Character-driven", "Twisty", "Atmospheric"],
        reviews: [
          {
            id: "review-1",
            username: "booklover23",
            stars: 5,
            text: "Perfect cozy mystery! The small-town setting felt so real and the characters were absolutely charming. Couldn't put it down.",
            source: "hardcover",
          },
          {
            id: "review-2",
            username: "mystery_fan",
            stars: 4,
            text: "Great plot twists and a protagonist you can't help but root for. Exactly what I was looking for in a cozy mystery.",
            source: "hardcover",
          },
        ],
      },
    };
  }

  return null;
}
```

### 1.3 Verification Steps

```bash
# From stacks-app directory
npm run build

# Should compile without errors
# If TypeScript errors occur, fix interface definitions
```

---

## Phase 2: Search Results Page

### 2.1 Create Search Results Route

**File**: `app/discover/results/page.tsx` (NEW FILE)

```typescript
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Shuffle } from "lucide-react";
import { getMockSearchResults, SearchResult } from "@/lib/mockData";

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(query);
  const [results, setResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (query) {
      // TODO: Replace with actual API call
      const mockResults = getMockSearchResults(query);
      setResults(mockResults);
    }
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/discover/results?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleRandomize = () => {
    // TODO: Implement randomized book recommendations
    alert("Random mode coming soon!");
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-light-primary dark:bg-dark-primary flex items-center justify-center">
        <p className="text-light-text-primary dark:text-dark-text-primary font-semibold">
          Loading results...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      {/* Fixed Header with Search */}
      <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-2xl font-black text-light-text-primary dark:text-dark-text-primary"
              aria-label="Go back"
            >
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="describe your reading vibe..."
                className="w-full px-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text-primary dark:text-dark-text-primary shadow-brutal-badge focus:outline-none focus:shadow-brutal-focus focus:border-accent-cyan transition-all"
              />
            </form>
            <button
              onClick={handleRandomize}
              className="px-4 py-3 bg-accent-yellow border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
              aria-label="Randomize results"
            >
              <Shuffle size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Atmosphere Section */}
        <ResultSection
          icon="🌟"
          title="Atmosphere"
          tags={results.atmosphere.tags}
          tagColor="bg-accent-cyan"
          books={results.atmosphere.books}
        />

        {/* Characters Section */}
        <ResultSection
          icon="💫"
          title="Characters"
          tags={results.characters.tags}
          tagColor="bg-accent-purple text-white"
          books={results.characters.books}
        />

        {/* Plot Section */}
        <ResultSection
          icon="📖"
          title="Plot"
          tags={results.plot.tags}
          tagColor="bg-accent-coral text-white"
          books={results.plot.books}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-6 py-4 bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm shadow-brutal-sm hover:shadow-brutal transition-all">
            Refine Search
          </button>
          <button
            onClick={() => router.push("/discover")}
            className="flex-1 px-6 py-4 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-sm hover:shadow-brutal transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

// ResultSection Component
interface ResultSectionProps {
  icon: string;
  title: string;
  tags: string[];
  tagColor: string;
  books: Array<{
    book: any;
    matchPercentage: number;
    matchReasons: any;
  }>;
}

function ResultSection({ icon, title, tags, tagColor, books }: ResultSectionProps) {
  const router = useRouter();

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h2 className="font-black text-2xl uppercase tracking-tight text-light-text-primary dark:text-dark-text-primary">
          {title}
        </h2>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-6 py-2 border-[3px] border-light-border dark:border-dark-border rounded-xl text-xs font-black uppercase shadow-brutal-badge ${tagColor}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Book Cards */}
      <div className="flex flex-col gap-4">
        {books.map((bookMatch) => (
          <div
            key={bookMatch.book.id}
            onClick={() => router.push(`/discover/book/${bookMatch.book.id}`)}
            className="flex gap-4 p-4 bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border rounded-[20px] shadow-brutal hover:shadow-brutal-hover transition-all cursor-pointer"
          >
            {/* Book Cover */}
            <div
              className="w-[90px] h-[135px] flex-shrink-0 border-[3px] border-light-border dark:border-dark-border rounded-xl overflow-hidden"
              style={{
                backgroundImage: `url(${bookMatch.book.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!bookMatch.book.cover && (
                <div className="w-full h-full bg-gradient-accent flex items-center justify-center text-4xl">
                  📚
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-base leading-tight mb-1.5 text-light-text-primary dark:text-dark-text-primary">
                  {bookMatch.book.title}
                </h3>
                <p className="font-semibold text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  {bookMatch.book.author}
                </p>
                <p className="font-medium text-xs text-light-text-secondary dark:text-dark-text-secondary leading-relaxed line-clamp-2">
                  {Object.values(bookMatch.matchReasons).flat().join(" • ")}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <div className="px-4 py-2 bg-accent-purple border-[3px] border-light-border dark:border-dark-border rounded-xl text-xs font-black uppercase text-white shadow-brutal-badge">
                  {bookMatch.matchPercentage}% Match
                </div>
                <span className="text-xs font-bold text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
                  {bookMatch.book.pageCount} pages
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 2.2 Update Discover Page Search Handler

**File**: `app/discover/page.tsx`

Replace the `handleSearch` function (line 13-16):

```typescript
const handleSearch = (query: string) => {
  if (query.trim()) {
    router.push(`/discover/results?q=${encodeURIComponent(query)}`);
  }
};
```

Add router import at top:

```typescript
import { useRouter } from "next/navigation";

// Inside component:
const router = useRouter();
```

### 2.3 Verification Steps

```bash
cd stacks-app
npm run dev
```

**Manual Testing:**
1. Navigate to `http://localhost:3000/discover`
2. Type "cozy mystery small town" in search bar
3. Press Enter
4. Verify navigation to `/discover/results?q=cozy+mystery+small+town`
5. Verify 3 sections display (Atmosphere, Characters, Plot)
6. Verify 2 books per section with covers, titles, authors
7. Verify match badges show percentages
8. Verify search input is editable and pre-filled
9. Test back button returns to discover
10. Test "Start Over" button returns to discover

---

## Phase 3: Book Detail Overlay

### 3.1 Create Book Detail Route

**File**: `app/discover/book/[id]/page.tsx` (NEW FILE)

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, ExternalLink } from "lucide-react";
import { getMockBookDetail, BookDetail } from "@/lib/mockData";

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [userLibrary, setUserLibrary] = useState<string>("San Francisco Public Library");

  useEffect(() => {
    // TODO: Replace with actual API calls
    const bookDetail = getMockBookDetail(bookId);
    setBook(bookDetail);

    // Load user's library preference from localStorage
    const savedLibrary = localStorage.getItem("userLibrary");
    if (savedLibrary) {
      setUserLibrary(savedLibrary);
    }
  }, [bookId]);

  if (!book) {
    return (
      <div className="fixed inset-0 bg-light-text-primary/80 dark:bg-dark-text-primary/80 flex items-center justify-center z-[1000]">
        <p className="text-white font-semibold">Loading...</p>
      </div>
    );
  }

  const handleLibraryClick = () => {
    // Deep link to library catalog
    // TODO: Use stored library catalog URL pattern
    const catalogUrl = `https://sfpl.bibliocommons.com/v2/search?query=${encodeURIComponent(book.isbn || book.title)}`;
    window.open(catalogUrl, "_blank");
  };

  const handleBookshopClick = () => {
    // TODO: Use Bookshop.org affiliate link
    const bookshopUrl = `https://bookshop.org/search?keywords=${encodeURIComponent(book.isbn || book.title)}`;
    window.open(bookshopUrl, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-light-text-primary/80 dark:bg-dark-text-primary/80 flex items-center justify-center z-[1000] p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) router.back();
      }}
    >
      {/* Modal */}
      <div className="bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border rounded-[20px] shadow-brutal max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="sticky top-4 right-4 float-right ml-4 mb-4 w-11 h-11 bg-accent-coral border-[3px] border-light-border dark:border-dark-border rounded-full shadow-brutal-badge flex items-center justify-center text-white font-black text-2xl hover:shadow-brutal transition-all z-10"
          aria-label="Close"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="p-6 clear-both">
          {/* Book Header */}
          <div className="flex gap-5 mb-6">
            {/* Cover */}
            <div
              className="w-[140px] h-[210px] flex-shrink-0 border-[5px] border-light-border dark:border-dark-border rounded-xl overflow-hidden shadow-brutal-badge"
              style={{
                backgroundImage: `url(${book.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!book.cover && (
                <div className="w-full h-full bg-gradient-accent flex items-center justify-center text-5xl">
                  📚
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="font-black text-2xl leading-tight text-light-text-primary dark:text-dark-text-primary">
                {book.title}
              </h1>
              <p className="font-semibold text-lg text-light-text-secondary dark:text-dark-text-secondary">
                {book.author}
              </p>
              <div className="text-xs font-bold text-light-text-tertiary dark:text-dark-text-tertiary uppercase">
                <span className="mr-3">📖 {book.pageCount} pages</span>
                <span>📅 {book.publishYear}</span>
              </div>

              {/* Overall Match Badge */}
              <div className="mt-3 p-4 bg-accent-purple border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-sm text-center">
                <div className="font-black text-4xl text-white">92%</div>
                <div className="font-black text-xs text-white uppercase">Overall Match</div>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text-primary dark:text-dark-text-primary">
              What Readers Are Saying
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              {book.socialProof.isBestseller && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
                  <span className="text-lg">🏆</span>
                  <span>NYT Bestseller</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-5 py-2.5 bg-light-secondary dark:bg-dark-secondary border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge">
                <span className="text-lg">⭐</span>
                <span>{book.socialProof.rating} ({book.socialProof.ratingsCount.toLocaleString()} ratings)</span>
              </div>
            </div>

            {/* Reader Tags */}
            <div className="mb-4">
              <p className="text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Readers loved:
              </p>
              <div className="flex flex-wrap gap-2">
                {book.socialProof.readerTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-accent-teal border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Why You'll Love This */}
          <section className="mb-6 p-5 bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge">
            <h2 className="font-black text-base uppercase mb-4 text-light-text-primary dark:text-dark-text-primary">
              Why You'll Love This
            </h2>

            <div className="flex items-baseline gap-2 mb-4 flex-wrap">
              <span className="text-xs font-bold uppercase text-light-text-tertiary dark:text-dark-text-tertiary">
                Your search:
              </span>
              <span className="font-black text-base text-accent-purple italic">
                "cozy mystery small town"
              </span>
            </div>

            <p className="font-medium text-[15px] leading-relaxed text-light-text-primary dark:text-dark-text-primary">
              This book delivers exactly that cozy small-town atmosphere you're craving, with an intimate cast of quirky characters you'll want to spend time with. The mystery unfolds slowly with clever twists that keep you guessing—perfect if you're in the mood for a slow-burn whodunit that feels like visiting a charming New England village.
            </p>
          </section>

          {/* Reviews Section */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text-primary dark:text-dark-text-primary">
              Recent Reviews
            </h2>

            <div className="flex flex-col gap-3 mb-3">
              {book.socialProof.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-3.5 bg-light-primary dark:bg-dark-primary border-2 border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">{"⭐".repeat(review.stars)}</span>
                    <span className="text-xs font-bold text-light-text-secondary dark:text-dark-text-secondary">
                      @{review.username}
                    </span>
                  </div>
                  <p className="text-sm font-medium italic text-light-text-primary dark:text-dark-text-primary leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Attribution */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              <span className="text-xs font-semibold text-light-text-tertiary dark:text-dark-text-tertiary">
                Reviews from
              </span>
              <a
                href="https://hardcover.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-accent-purple hover:underline"
              >
                Hardcover →
              </a>
            </div>
          </section>

          {/* Description */}
          <section className="mb-6">
            <h2 className="font-black text-base uppercase mb-3 text-light-text-primary dark:text-dark-text-primary">
              Description
            </h2>
            <p className="font-medium text-[15px] leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
              {book.description}
            </p>
          </section>

          {/* Get This Book */}
          <section>
            <h2 className="font-black text-base uppercase mb-4 text-light-text-primary dark:text-dark-text-primary">
              Get This Book
            </h2>

            {/* Primary CTAs */}
            <div className="flex flex-col gap-3 mb-2">
              <button
                onClick={handleBookshopClick}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                <span className="text-xl">📖</span>
                Buy on Bookshop.org
              </button>
              <button
                onClick={handleLibraryClick}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-cyan text-white border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
              >
                <span className="text-xl">📚</span>
                Check {userLibrary}
              </button>
            </div>

            {/* Library Note */}
            <div className="text-center py-2 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
              Using {userLibrary} · <a href="/settings" className="underline">Change library</a>
            </div>

            {/* More Options */}
            <div className="mt-6 pt-5 border-t-2 border-light-border-secondary dark:border-dark-border-secondary">
              <h3 className="font-black text-sm uppercase text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                More Options
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://libro.fm/search?q=${encodeURIComponent(book.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 bg-light-secondary dark:bg-dark-secondary border-2 border-light-border-secondary dark:border-dark-border-secondary rounded-xl hover:border-light-border dark:hover:border-dark-border hover:shadow-brutal-badge transition-all"
                >
                  <span className="text-2xl flex-shrink-0">🎧</span>
                  <div className="flex-1">
                    <div className="font-black text-[15px] text-light-text-primary dark:text-dark-text-primary">
                      Listen on Libro.fm
                    </div>
                    <div className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                      Audiobook • Supports indie bookstores
                    </div>
                  </div>
                  <ExternalLink size={16} strokeWidth={3} className="text-light-text-tertiary dark:text-dark-text-tertiary" />
                </a>

                <a
                  href={`https://hardcover.app/books/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 bg-light-secondary dark:bg-dark-secondary border-2 border-light-border-secondary dark:border-dark-border-secondary rounded-xl hover:border-light-border dark:hover:border-dark-border hover:shadow-brutal-badge transition-all"
                >
                  <span className="text-2xl flex-shrink-0">💬</span>
                  <div className="flex-1">
                    <div className="font-black text-[15px] text-light-text-primary dark:text-dark-text-primary">
                      View on Hardcover
                    </div>
                    <div className="text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                      See more reviews & ratings
                    </div>
                  </div>
                  <ExternalLink size={16} strokeWidth={3} className="text-light-text-tertiary dark:text-dark-text-tertiary" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Verification Steps

**Manual Testing:**
1. From search results page, click any book card
2. Verify modal overlay appears with dark backdrop
3. Verify all sections render correctly:
   - Book header with cover + match %
   - Social proof (badges, tags, reviews)
   - "Why You'll Love This" with search echo
   - Reviews with star ratings
   - Description
   - CTA buttons
   - More Options links
4. Test close button (X)
5. Test clicking backdrop to close
6. Test "Check [Library]" button opens new tab
7. Test "Buy on Bookshop.org" button opens new tab
8. Test Libro.fm and Hardcover links open new tabs
9. Test back navigation returns to results

---

## Phase 4: API Integrations

### 4.1 Create API Utility Files

**File**: `lib/api/bookCoverApi.ts` (NEW FILE)

```typescript
/**
 * Open Library Covers API Integration
 * Free API - no authentication required
 * Rate limit: 100 requests per 5 minutes per IP
 */

export type CoverSize = 'S' | 'M' | 'L';

export function getOpenLibraryCover(isbn: string, size: CoverSize = 'L'): string {
  // Returns direct URL to cover image
  // If cover doesn't exist, returns placeholder image
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
}

export async function checkCoverExists(isbn: string): Promise<boolean> {
  try {
    const url = getOpenLibraryCover(isbn, 'S');
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
```

**File**: `lib/api/hardcoverApi.ts` (NEW FILE)

```typescript
/**
 * Hardcover API Integration (GraphQL)
 * Free API - requires API key from settings
 * Documentation: https://hardcover.app/docs/api
 */

const HARDCOVER_API_ENDPOINT = 'https://api.hardcover.app/v1/graphql';

interface HardcoverBook {
  title: string;
  rating: number;
  ratingsCount: number;
  reviews: Array<{
    id: string;
    user: { username: string };
    rating: number;
    text: string;
  }>;
  tags: string[];
}

export async function getHardcoverBookData(isbn: string): Promise<HardcoverBook | null> {
  try {
    const query = `
      query GetBook($isbn: String!) {
        book(isbn: $isbn) {
          title
          rating
          ratingsCount
          reviews(limit: 2) {
            id
            user { username }
            rating
            text
          }
          tags {
            name
          }
        }
      }
    `;

    const response = await fetch(HARDCOVER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add API key from environment variable
        // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HARDCOVER_API_KEY}`
      },
      body: JSON.stringify({
        query,
        variables: { isbn },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Hardcover API error:', data.errors);
      return null;
    }

    const book = data.data?.book;
    if (!book) return null;

    return {
      title: book.title,
      rating: book.rating || 0,
      ratingsCount: book.ratingsCount || 0,
      reviews: book.reviews?.map((r: any) => ({
        id: r.id,
        user: { username: r.user.username },
        rating: r.rating,
        text: r.text,
      })) || [],
      tags: book.tags?.map((t: any) => t.name) || [],
    };
  } catch (error) {
    console.error('Hardcover API fetch error:', error);
    return null;
  }
}
```

**File**: `lib/api/googleBooksApi.ts` (NEW FILE)

```typescript
/**
 * Google Books API Integration
 * Free API - requires API key
 * Get key: https://console.cloud.google.com/apis/credentials
 */

interface GoogleBooksData {
  averageRating: number;
  ratingsCount: number;
  description: string;
}

export async function getGoogleBooksData(isbn: string): Promise<GoogleBooksData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const volumeInfo = data.items[0].volumeInfo;

    return {
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
      description: volumeInfo.description || '',
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    return null;
  }
}
```

**File**: `lib/api/nytBestsellerApi.ts` (NEW FILE)

```typescript
/**
 * New York Times Bestseller API
 * Free API - requires API key
 * Get key: https://developer.nytimes.com/
 * Rate limit: 500 requests per day, 5 per minute
 */

interface BestsellerInfo {
  isBestseller: boolean;
  listName?: string;
  weeksOnList?: number;
  rank?: number;
}

export async function checkBestseller(isbn: string): Promise<BestsellerInfo> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NYT_API_KEY;
    if (!apiKey) {
      return { isBestseller: false };
    }

    // Check current combined print and ebook list
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return { isBestseller: false };
    }

    const book = data.results.books.find((b: any) =>
      b.primary_isbn13 === isbn || b.primary_isbn10 === isbn
    );

    if (book) {
      return {
        isBestseller: true,
        listName: data.results.list_name,
        weeksOnList: book.weeks_on_list,
        rank: book.rank,
      };
    }

    return { isBestseller: false };
  } catch (error) {
    console.error('NYT API error:', error);
    return { isBestseller: false };
  }
}
```

### 4.2 Environment Variables Setup

**File**: `.env.local` (NEW FILE - DO NOT COMMIT)

```bash
# API Keys
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your_key_here
NEXT_PUBLIC_NYT_API_KEY=your_key_here
NEXT_PUBLIC_HARDCOVER_API_KEY=your_key_here
```

**File**: `.env.example` (NEW FILE - FOR DOCUMENTATION)

```bash
# Google Books API Key
# Get from: https://console.cloud.google.com/apis/credentials
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=

# New York Times API Key
# Get from: https://developer.nytimes.com/
NEXT_PUBLIC_NYT_API_KEY=

# Hardcover API Key (optional)
# Get from: https://hardcover.app/settings
NEXT_PUBLIC_HARDCOVER_API_KEY=
```

### 4.3 Update getMockBookDetail to Use APIs

**File**: `lib/mockData.ts`

Replace the `getMockBookDetail` function:

```typescript
export async function getBookDetailWithAPIs(bookId: string, isbn?: string): Promise<BookDetail | null> {
  // For MVP: Start with mock data, gradually replace with API calls
  const mockDetail = getMockBookDetail(bookId);

  if (!mockDetail || !isbn) {
    return mockDetail;
  }

  try {
    // Fetch from APIs in parallel
    const [hardcoverData, googleData, bestsellerInfo] = await Promise.all([
      getHardcoverBookData(isbn),
      getGoogleBooksData(isbn),
      checkBestseller(isbn),
    ]);

    // Merge API data with mock data
    return {
      ...mockDetail,
      isbn,
      socialProof: {
        isBestseller: bestsellerInfo.isBestseller,
        bestsellerInfo: bestsellerInfo.isBestseller
          ? `${bestsellerInfo.listName} • ${bestsellerInfo.weeksOnList} weeks`
          : undefined,
        rating: hardcoverData?.rating || googleData?.averageRating || mockDetail.socialProof.rating,
        ratingsCount: hardcoverData?.ratingsCount || googleData?.ratingsCount || mockDetail.socialProof.ratingsCount,
        readerTags: hardcoverData?.tags || mockDetail.socialProof.readerTags,
        reviews: hardcoverData?.reviews.map(r => ({
          id: r.id,
          username: r.user.username,
          stars: r.rating,
          text: r.text,
          source: 'hardcover' as const,
        })) || mockDetail.socialProof.reviews,
      },
      description: googleData?.description || mockDetail.description,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    // Fall back to mock data on error
    return mockDetail;
  }
}
```

### 4.4 Verification Steps

**API Key Setup:**
1. Get Google Books API key from https://console.cloud.google.com/apis/credentials
2. Get NYT API key from https://developer.nytimes.com/
3. (Optional) Get Hardcover API key from https://hardcover.app/settings
4. Create `.env.local` file with keys
5. Restart dev server: `npm run dev`

**Testing API Integration:**
1. Open book detail overlay
2. Open browser DevTools > Network tab
3. Verify API requests to:
   - `covers.openlibrary.org` (cover image)
   - `api.hardcover.app` (reviews/ratings)
   - `googleapis.com/books` (Google Books fallback)
   - `api.nytimes.com` (bestseller status)
4. Check console for any API errors
5. Verify social proof data updates from APIs

---

## Phase 5: Library Settings

### 5.1 Create Library Settings Page

**File**: `app/settings/page.tsx` (UPDATE EXISTING)

Add library selection feature:

```typescript
"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SettingsPage() {
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");

  useEffect(() => {
    // Load saved library
    const saved = localStorage.getItem("userLibrary");
    if (saved) {
      setSelectedLibrary(saved);
    }
  }, []);

  const handleLibrarySelect = (libraryName: string) => {
    setSelectedLibrary(libraryName);
    localStorage.setItem("userLibrary", libraryName);
    alert(`Library set to: ${libraryName}`);
  };

  // TODO: Replace with actual library database
  const mockLibraries = [
    { name: "San Francisco Public Library", type: "bibliocommons" },
    { name: "New York Public Library", type: "bibliocommons" },
    { name: "Los Angeles Public Library", type: "overdrive" },
    { name: "Chicago Public Library", type: "bibliocommons" },
    { name: "Seattle Public Library", type: "bibliocommons" },
  ];

  const filteredLibraries = librarySearch
    ? mockLibraries.filter(lib =>
        lib.name.toLowerCase().includes(librarySearch.toLowerCase())
      )
    : mockLibraries;

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-black text-3xl uppercase mb-6">Settings</h1>

        {/* Library Selection */}
        <section className="mb-8">
          <h2 className="font-black text-xl uppercase mb-4">Your Library</h2>
          <p className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Select your local library to check book availability
          </p>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              size={20}
              strokeWidth={3}
            />
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search for your library..."
              className="w-full pl-12 pr-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text-primary dark:text-dark-text-primary shadow-brutal-badge focus:outline-none focus:shadow-brutal-focus focus:border-accent-cyan transition-all"
            />
          </div>

          {/* Library List */}
          <div className="flex flex-col gap-2">
            {filteredLibraries.map((library) => (
              <button
                key={library.name}
                onClick={() => handleLibrarySelect(library.name)}
                className={`p-4 text-left border-[3px] rounded-xl font-bold transition-all ${
                  selectedLibrary === library.name
                    ? "bg-accent-cyan text-white border-light-border dark:border-dark-border shadow-brutal-badge"
                    : "bg-light-secondary dark:bg-dark-secondary border-light-border-secondary dark:border-dark-border-secondary hover:border-light-border dark:hover:border-dark-border"
                }`}
              >
                {library.name}
                {selectedLibrary === library.name && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

### 5.2 Create Library Database

**File**: `lib/libraryDatabase.ts` (NEW FILE)

```typescript
/**
 * Library database with catalog URL patterns
 * Supports BiblioCommons, OverDrive, and other ILS systems
 */

export interface Library {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'bibliocommons' | 'overdrive' | 'sirsi' | 'innovative' | 'other';
  catalogUrlPattern: string;
  // URL pattern uses {ISBN} or {TITLE} placeholder
}

export const libraryDatabase: Library[] = [
  {
    id: "sfpl",
    name: "San Francisco Public Library",
    city: "San Francisco",
    state: "CA",
    type: "bibliocommons",
    catalogUrlPattern: "https://sfpl.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "nypl",
    name: "New York Public Library",
    city: "New York",
    state: "NY",
    type: "bibliocommons",
    catalogUrlPattern: "https://nypl.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "lapl",
    name: "Los Angeles Public Library",
    city: "Los Angeles",
    state: "CA",
    type: "overdrive",
    catalogUrlPattern: "https://lapl.overdrive.com/search?query={ISBN}",
  },
  {
    id: "cpl",
    name: "Chicago Public Library",
    city: "Chicago",
    state: "IL",
    type: "bibliocommons",
    catalogUrlPattern: "https://chipublib.bibliocommons.com/v2/search?query={ISBN}",
  },
  {
    id: "spl",
    name: "Seattle Public Library",
    city: "Seattle",
    state: "WA",
    type: "bibliocommons",
    catalogUrlPattern: "https://seattle.bibliocommons.com/v2/search?query={ISBN}",
  },
  // TODO: Add more libraries from ABA member directory
  // Expand to 100+ major US libraries
];

export function getLibraryById(id: string): Library | undefined {
  return libraryDatabase.find(lib => lib.id === id);
}

export function getLibraryCatalogUrl(library: Library, isbn?: string, title?: string): string {
  const searchTerm = isbn || title || '';
  return library.catalogUrlPattern.replace('{ISBN}', searchTerm).replace('{TITLE}', searchTerm);
}

export function searchLibraries(query: string): Library[] {
  const lowerQuery = query.toLowerCase();
  return libraryDatabase.filter(lib =>
    lib.name.toLowerCase().includes(lowerQuery) ||
    lib.city.toLowerCase().includes(lowerQuery) ||
    lib.state.toLowerCase().includes(lowerQuery)
  );
}
```

### 5.3 Update Book Detail to Use Library Database

**File**: `app/discover/book/[id]/page.tsx`

Update the library button handler:

```typescript
import { getLibraryById, getLibraryCatalogUrl } from "@/lib/libraryDatabase";

// Inside component:
const handleLibraryClick = () => {
  // Load user's library preference
  const libraryId = localStorage.getItem("userLibraryId");
  const library = libraryId ? getLibraryById(libraryId) : null;

  if (library && book.isbn) {
    const catalogUrl = getLibraryCatalogUrl(library, book.isbn, book.title);
    window.open(catalogUrl, "_blank");
  } else {
    // Fallback to generic search
    alert("Please set up your library in Settings");
    router.push("/settings");
  }
};
```

---

## Testing & Verification

### Integration Testing Checklist

**Search Flow:**
- [ ] Search from discover page navigates to results
- [ ] Search input is editable on results page
- [ ] Random button shows alert (functionality pending)
- [ ] Back button returns to discover
- [ ] Start Over returns to discover

**Results Page:**
- [ ] 3 sections display (Atmosphere, Characters, Plot)
- [ ] 2 books per section
- [ ] Book cards show cover, title, author, match %, page count
- [ ] Vibe tags display correctly
- [ ] Book cards are clickable
- [ ] Hover states work on cards

**Book Detail Modal:**
- [ ] Modal opens when clicking book card
- [ ] Close button (X) works
- [ ] Clicking backdrop closes modal
- [ ] Back browser button closes modal
- [ ] All sections render correctly
- [ ] Social proof displays (badges, tags, reviews)
- [ ] "Why You'll Love This" shows search query
- [ ] Reviews show stars and text
- [ ] Description displays
- [ ] CTA buttons work
- [ ] Library button opens correct catalog URL
- [ ] Bookshop.org button opens search
- [ ] Libro.fm link opens in new tab
- [ ] Hardcover link opens in new tab

**Settings:**
- [ ] Library search filters list
- [ ] Selecting library saves to localStorage
- [ ] Selected library shows checkmark
- [ ] Library name appears in book detail modal

**API Integration:**
- [ ] Book covers load from Open Library
- [ ] Hardcover reviews display (if API key set)
- [ ] Google Books fallback works
- [ ] NYT bestseller badge shows when applicable
- [ ] API errors don't break UI (fallback to mock data)

### Performance Testing

```bash
cd stacks-app
npm run build
npm start
```

**Metrics to Check:**
- Page load time < 2s
- Book detail modal opens < 500ms
- API requests complete < 3s
- No console errors
- Responsive on mobile (390px width)

### Browser Compatibility

Test on:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

---

## Deployment Notes

### Environment Variables

**Production `.env.production`:**
```bash
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=prod_key_here
NEXT_PUBLIC_NYT_API_KEY=prod_key_here
NEXT_PUBLIC_HARDCOVER_API_KEY=prod_key_here
```

### Build Command

```bash
npm run build
```

Verify no build errors. Check output for:
- Route generation success
- Static/dynamic route detection
- Bundle size warnings

### Post-Deployment Verification

1. Navigate to `/discover`
2. Search "cozy mystery small town"
3. Verify results page loads
4. Click any book
5. Verify modal opens with all data
6. Test library button opens correct URL
7. Check API calls in Network tab

---

## Future Enhancements

### Phase 6 (Post-MVP):
- Actual natural language search (ML model)
- Real-time library availability API (if available)
- Bookshop.org affiliate program integration
- User reading history integration
- Personalized match algorithm
- Expand library database to 1000+ libraries
- Add audiobook availability via Libro.fm API
- Social sharing for book recommendations
- Save favorite books

### Known Limitations:
- Search results are currently hardcoded for "cozy mystery small town"
- Library availability is via deep link (not real-time)
- Hardcover API requires manual setup
- Book covers may not exist for all ISBNs
- NYT bestseller data is current list only (not historical)

---

## Support & Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Open Library API: https://openlibrary.org/dev/docs/api/covers
- Hardcover API: https://hardcover.app/docs/api
- Google Books API: https://developers.google.com/books
- NYT Books API: https://developer.nytimes.com/docs/books-product/1/overview

**Design System:**
- Reference: `design_system/v2.0_refined_design_system.html`
- Prototypes: `design_system/search-results-prototype.html`, `design_system/book-detail-overlay-prototype.html`

**Codebase:**
- Mock data: `lib/mockData.ts`
- Components: `components/`
- Pages: `app/`
- Styles: `app/globals.css`, `tailwind.config.ts`

---

**End of Implementation Plan**

This plan is complete and ready for execution. All file paths, code examples, and verification steps are provided. Follow phases sequentially for best results.
