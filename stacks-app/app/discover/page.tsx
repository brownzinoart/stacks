"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import VibeChips from "@/components/VibeChips";
import BookSection from "@/components/BookSection";
import { useNaturalSearch } from "./hooks/useNaturalSearch";
import NaturalSearchResults from "./components/NaturalSearchResults";
import { mockBooksWithMetadata } from "@/lib/mockData";

export default function DiscoverPage() {
  const [searchMode, setSearchMode] = useState<"natural" | "browse">("browse");
  const { query, results, loading, error, progress, enrichedContext, search, clearResults } = useNaturalSearch();

  const handleSearch = (query: string) => {
    setSearchMode("natural");
    search(query);
  };

  const handleClear = () => {
    clearResults();
    setSearchMode("browse");
  };

  const handleVibeClick = (vibe: string) => {
    search(vibe);
    setSearchMode("natural");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-24">
      {/* Header with Search */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary
                    border-b-[5px] border-black dark:border-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <h1 className="font-black text-4xl uppercase tracking-tight text-black dark:text-white mb-6">
            Discover
          </h1>

          <SearchBar
            placeholder="Try: 'cozy mystery in a bookshop' or 'like Succession'"
            onSearch={handleSearch}
            onClear={handleClear}
            loading={loading}
            naturalLanguage={true}
          />

          {/* Quick Vibe Chips */}
          {searchMode === "browse" && (
            <div className="mt-4">
              <VibeChips onVibeClick={handleVibeClick} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto">
        {/* Error State */}
        {error && (
          <div className="mx-4 mt-6 p-4 bg-red-100 dark:bg-red-900/30
                        border-4 border-red-600 rounded-xl">
            <p className="font-bold text-red-900 dark:text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* Loading State with Progress */}
        {searchMode === "natural" && loading && (
          <div className="py-6 px-4">
            <NaturalSearchResults
              results={[]}
              query={query}
              progress={progress}
              enrichedContext={enrichedContext}
              onBookClick={(bookId) => {
                console.log("Book clicked:", bookId);
                // TODO: Navigate to book detail page
              }}
              onExampleClick={(exampleQuery) => {
                handleSearch(exampleQuery);
              }}
            />
          </div>
        )}

        {/* Search Results */}
        {searchMode === "natural" && !loading && !error && (
          <div className="py-6 px-4">
            <NaturalSearchResults
              results={results}
              query={query}
              progress={progress}
              enrichedContext={enrichedContext}
              onBookClick={(bookId) => {
                console.log("Book clicked:", bookId);
                // TODO: Navigate to book detail page
              }}
              onExampleClick={(exampleQuery) => {
                handleSearch(exampleQuery);
              }}
            />
          </div>
        )}

        {/* Browse Mode - Curated Sections */}
        {searchMode === "browse" && (
          <div className="py-6">
            <BookSection
              title="Trending Now"
              books={mockBooksWithMetadata.slice(0, 5).map(b => ({
                ...b,
                matchLevel: "high" as const
              }))}
            />

            <BookSection
              title="Dark Academia"
              books={mockBooksWithMetadata.filter(b =>
                b.metadata?.tropes?.includes("dark academia")
              ).map(b => ({
                ...b,
                matchLevel: "medium" as const
              }))}
            />

            <BookSection
              title="Cozy Reads"
              books={mockBooksWithMetadata.filter(b =>
                b.metadata?.mood?.includes("cozy")
              ).map(b => ({
                ...b,
                matchLevel: "medium" as const
              }))}
            />

            <BookSection
              title="Psychological Thrillers"
              books={mockBooksWithMetadata.filter(b =>
                b.genres.includes("Thriller") || b.genres.includes("Psychological")
              ).map(b => ({
                ...b,
                matchLevel: "high" as const
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
