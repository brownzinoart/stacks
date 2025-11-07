"use client";

import { Search, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  naturalLanguage?: boolean;
}

export default function SearchBar({
  placeholder = "Search books, authors, vibes...",
  onSearch,
  onClear,
  loading = false,
  naturalLanguage = false
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-5 py-[18px] pl-14 pr-14 border-4 border-black dark:border-white
                   bg-white dark:bg-dark-secondary text-black dark:text-white
                   font-semibold text-lg rounded-xl
                   shadow-brutal-sm focus:shadow-brutal-focus
                   focus:outline-none focus:-translate-x-[1px] focus:-translate-y-[1px]
                   transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
          disabled={loading}
        />

        {/* Search Icon or AI Sparkle */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          {naturalLanguage ? (
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
          ) : (
            <Search className="w-6 h-6 text-black dark:text-white" strokeWidth={2.5} />
          )}
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/2 -translate-y-1/2
                     text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400
                     transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* AI Search Helper Text */}
      {naturalLanguage && (
        <p className="mt-2 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Try: "cozy mystery in a bookshop" or "like Succession but a book"
        </p>
      )}
    </form>
  );
}
