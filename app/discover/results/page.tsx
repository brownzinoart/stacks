"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Shuffle, Loader2 } from "lucide-react";
import type { SearchResult, BookSearchMatch } from "@/lib/mockData";

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
  const query = searchParams?.get("q") || "";

  const [searchValue, setSearchValue] = useState(query);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      
      // Call the categorized search API
      fetch('/api/search/categorized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId: 'user-1' // TODO: Get from auth context
        })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Search failed (${res.status})`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            // Ensure we have the correct structure
            setResults({
              query: data.query || query,
              atmosphere: data.atmosphere || { tags: [], books: [] },
              characters: data.characters || { tags: [], books: [] },
              plot: data.plot || { tags: [], books: [] }
            });
          } else {
            throw new Error(data.error || 'Search failed');
          }
        })
        .catch((err) => {
          console.error('Search error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load search results');
        })
        .finally(() => {
          setLoading(false);
        });
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

  if (loading || !results) {
    return (
      <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
        <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl font-black text-light-text dark:text-dark-text"
                aria-label="Go back"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="font-black text-xl text-light-text dark:text-dark-text">Search Results</h1>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-light-text dark:text-dark-text font-bold text-lg mb-2">
            {loading ? 'Searching for books...' : 'Loading results...'}
          </p>
          {query && (
            <p className="text-light-textSecondary dark:text-dark-textSecondary font-semibold text-sm">
              "{query}"
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
        <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="text-2xl font-black text-light-text dark:text-dark-text"
                aria-label="Go back"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="font-black text-xl text-light-text dark:text-dark-text">Search Results</h1>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="p-6 bg-red-100 dark:bg-red-900/30 border-[5px] border-red-600 dark:border-red-500 rounded-xl">
            <p className="font-bold text-red-900 dark:text-red-200 mb-2">Error loading results</p>
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            <button
              onClick={() => router.push("/discover")}
              className="mt-4 px-6 py-3 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      {/* Fixed Header with Search */}
      <div className="sticky top-0 z-40 bg-light-secondary dark:bg-dark-secondary border-b-[5px] border-light-border dark:border-dark-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="text-2xl font-black text-light-text dark:text-dark-text"
              aria-label="Go back"
            >
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            <h1 className="font-black text-xl text-light-text dark:text-dark-text flex-1">
              Search Results
            </h1>
            <button
              onClick={handleRandomize}
              className="px-4 py-3 bg-accent-yellow text-light-text dark:text-dark-text border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
              aria-label="Randomize results"
            >
              <Shuffle size={20} strokeWidth={3} />
            </button>
          </div>
          {query && (
            <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-2 px-1">
              "{query}"
            </p>
          )}
          <form onSubmit={handleSearchSubmit} className="mt-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="describe your reading vibe..."
              className="w-full px-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text shadow-brutal-badge focus:outline-none focus:shadow-brutal-input-focus focus:border-accent-cyan transition-all"
            />
          </form>
        </div>
      </div>

      {/* Results Container */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Check if we have any results */}
        {results.atmosphere.books.length === 0 && 
         results.characters.books.length === 0 && 
         results.plot.books.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-bold text-xl text-light-text dark:text-dark-text mb-2">
              No books found
            </p>
            <p className="font-semibold text-light-textSecondary dark:text-dark-textSecondary mb-6">
              {results.query ? `No results for "${results.query}"` : 'Try a different search'}
            </p>
            <button
              onClick={() => router.push("/discover")}
              className="px-6 py-3 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              Start New Search
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}

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
  books: BookSearchMatch[];
}

function ResultSection({ icon, title, tags, tagColor, books }: ResultSectionProps) {
  const router = useRouter();

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h2 className="font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text">
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
        {books.length === 0 ? (
          <div className="text-center py-8 px-4 bg-light-secondary dark:bg-dark-secondary border-[3px] border-light-border dark:border-dark-border rounded-xl">
            <p className="font-semibold text-sm text-light-textSecondary dark:text-dark-textSecondary">
              No books found in this category
            </p>
          </div>
        ) : (
          books.map((bookMatch) => (
          <div
            key={bookMatch.book.id}
            onClick={() => router.push(`/discover/book/${bookMatch.book.id}`)}
            className="flex gap-4 p-4 bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border rounded-[20px] shadow-brutal hover:shadow-brutal-hover transition-all cursor-pointer"
          >
            {/* Book Cover */}
            <div className="w-[90px] h-[135px] flex-shrink-0 border-[3px] border-light-border dark:border-dark-border rounded-xl overflow-hidden relative">
              <img
                src={bookMatch.book.cover}
                alt={`${bookMatch.book.title} cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Cascade: Try Google Books fallback
                  const googleCover = bookMatch.book.googleBooksCoverUrl;
                  if (googleCover && e.currentTarget.src !== googleCover) {
                    e.currentTarget.src = googleCover;
                  } else {
                    // Final fallback: hide img, show placeholder
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }
                }}
              />
              {/* Styled placeholder (hidden by default) */}
              <div className="absolute inset-0 bg-gradient-accent flex items-center justify-center text-4xl" style={{ display: 'none' }}>
                📚
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-base leading-tight mb-1.5 text-light-text dark:text-dark-text">
                  {bookMatch.book.title}
                </h3>
                <p className="font-semibold text-sm text-light-textSecondary dark:text-dark-textSecondary mb-2">
                  {bookMatch.book.author}
                </p>
                <p className="font-medium text-xs text-light-textSecondary dark:text-dark-textSecondary leading-relaxed line-clamp-2">
                  {Object.values(bookMatch.matchReasons).flat().join(" • ")}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 mt-3">
                <div className="px-4 py-2 bg-accent-purple border-[3px] border-light-border dark:border-dark-border rounded-xl text-xs font-black uppercase text-white shadow-brutal-badge">
                  {bookMatch.matchPercentage}% Match
                </div>
                <span className="text-xs font-bold text-light-textTertiary dark:text-dark-textTertiary uppercase">
                  {bookMatch.book.pageCount} pages
                </span>
              </div>
            </div>
          </div>
        ))
        )}
      </div>
    </section>
  );
}
