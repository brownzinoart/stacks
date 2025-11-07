"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import type { NaturalLanguageSearchResult } from "@/lib/mockData";

interface NaturalSearchResultsProps {
  results: NaturalLanguageSearchResult[];
  query: string;
  onBookClick?: (bookId: string) => void;
}

export default function NaturalSearchResults({
  results,
  query,
  onBookClick
}: NaturalSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={2} />
        <p className="font-bold text-xl text-black dark:text-white mb-2">
          No matches found
        </p>
        <p className="font-semibold text-gray-600 dark:text-gray-400">
          Try a different search or adjust your preferences
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="font-black text-2xl uppercase tracking-tight text-black dark:text-white">
          {results.length} {results.length === 1 ? 'Match' : 'Matches'}
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30
                      border-[3px] border-black dark:border-white rounded-xl">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={3} />
          <span className="font-black text-sm text-purple-600 dark:text-purple-400">
            AI POWERED
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <SearchResultCard
            key={result.book.id}
            result={result}
            rank={index + 1}
            onClick={() => onBookClick?.(result.book.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  result: NaturalLanguageSearchResult;
  rank: number;
  onClick?: () => void;
}

function SearchResultCard({ result, rank, onClick }: SearchResultCardProps) {
  const { book, matchScore, matchReasons } = result;

  // Determine match level color
  const getMatchColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left group"
    >
      <div className="bg-white dark:bg-dark-secondary border-[5px] border-black dark:border-white
                    rounded-[20px] shadow-brutal hover:shadow-brutal-hover
                    transition-all hover:-translate-x-1 hover:-translate-y-1
                    overflow-hidden">
        <div className="p-6 flex gap-4">
          {/* Rank Badge */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                        bg-gradient-primary border-[3px] border-black dark:border-white
                        rounded-xl shadow-brutal-badge">
            <span className="font-black text-2xl text-white">
              {rank}
            </span>
          </div>

          {/* Book Cover */}
          <div className="flex-shrink-0 w-24 h-36 relative border-4 border-black dark:border-white
                        rounded-xl overflow-hidden shadow-brutal-sm">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            {/* Match Score */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-3 py-1 ${getMatchColor(matchScore)}
                            border-[3px] border-black dark:border-white rounded-xl shadow-brutal-badge`}>
                <span className="font-black text-sm text-white">
                  {matchScore}% MATCH
                </span>
              </div>
              {matchScore >= 90 && (
                <div className="px-3 py-1 bg-gradient-accent
                              border-[3px] border-black dark:border-white rounded-xl shadow-brutal-badge">
                  <span className="font-black text-sm text-white flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" strokeWidth={3} />
                    TOP PICK
                  </span>
                </div>
              )}
            </div>

            {/* Title & Author */}
            <h3 className="font-black text-xl text-black dark:text-white mb-1
                         group-hover:text-purple-600 dark:group-hover:text-purple-400
                         transition-colors line-clamp-2">
              {book.title}
            </h3>
            <p className="font-bold text-sm text-gray-600 dark:text-gray-400 mb-3">
              by {book.author}
            </p>

            {/* Match Reasons */}
            <div className="space-y-2">
              {matchReasons.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 mt-1.5 flex-shrink-0" />
                  <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 leading-tight">
                    {reason}
                  </p>
                </div>
              ))}
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {book.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800
                           border-[3px] border-black dark:border-white
                           rounded-xl font-bold text-xs uppercase"
                >
                  {genre}
                </span>
              ))}
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800
                             border-[3px] border-black dark:border-white
                             rounded-xl font-bold text-xs">
                {book.pageCount}p
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
