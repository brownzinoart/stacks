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
        <p className="text-light-text dark:text-dark-text font-semibold">
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
              className="text-2xl font-black text-light-text dark:text-dark-text"
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
                className="w-full px-4 py-3 border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text shadow-brutal-badge focus:outline-none focus:shadow-brutal-input-focus focus:border-accent-cyan transition-all"
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
        ))}
      </div>
    </section>
  );
}
