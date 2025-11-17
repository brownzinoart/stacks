"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../components/SearchBar";
import VibeChips from "../../components/VibeChips";
import BookSection from "../../components/BookSection";
import { mockBooksWithMetadata } from "../../lib/mockData";

export default function DiscoverPage() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<"natural" | "browse">("browse");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/discover/results?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setSearchMode("browse");
  };

  const handleVibeClick = (vibe: string) => {
    router.push(`/discover/results?q=${encodeURIComponent(vibe)}`);
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
            loading={false}
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
