"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search books, vibes, authors..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
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
          aria-label="Search books, authors, and vibes"
          autoComplete="off"
          className="w-full px-4 py-3 pl-12 font-semibold text-base bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal-sm rounded-xl focus:outline-none focus:shadow-brutal transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5] text-black dark:text-white" />
      </div>
    </form>
  );
}
