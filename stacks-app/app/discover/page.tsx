"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import BookSection from "@/components/BookSection";
import { mockBooks } from "@/lib/mockData";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic with API
    console.log("Searching for:", query);
  };

  // Filter books by genre for different sections
  const fantasyBooks = mockBooks.filter(b => b.genres.includes("Fantasy"));
  const romanceBooks = mockBooks.filter(b => b.genres.includes("Romance"));
  const literaryBooks = mockBooks.filter(b => b.genres.includes("Literary Fiction"));

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="font-black text-2xl uppercase tracking-tight mb-4">
            Discover
          </h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Taylor Swift vibes, books like Severance..."
          />
        </div>
      </div>

      {/* Search Results or Discovery Sections */}
      <div className="py-6">
        {searchQuery ? (
          <div className="px-4">
            <div className="bg-gradient-info border-4 border-black dark:border-white shadow-brutal p-6 text-center">
              <p className="font-black text-white text-lg uppercase">
                Search results for "{searchQuery}"
              </p>
              <p className="text-white text-sm mt-2">
                (Search functionality coming soon)
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Trending Now */}
            <BookSection title="Trending Now" books={mockBooks.slice(0, 5)} size="large" />

            {/* Fantasy Picks */}
            {fantasyBooks.length > 0 && (
              <BookSection title="Fantasy Picks" books={fantasyBooks} size="medium" />
            )}

            {/* Romance Reads */}
            {romanceBooks.length > 0 && (
              <BookSection title="Romance Reads" books={romanceBooks} size="medium" />
            )}

            {/* Literary Fiction */}
            {literaryBooks.length > 0 && (
              <BookSection title="Literary Fiction" books={literaryBooks} size="medium" />
            )}

            {/* All Books */}
            <BookSection title="Explore All" books={mockBooks} size="small" />
          </>
        )}
      </div>
    </div>
  );
}
