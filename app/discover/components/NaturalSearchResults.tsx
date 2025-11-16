"use client";

import { Sparkles, TrendingUp, Loader2, Film, BookOpen } from "lucide-react";
import type { NaturalLanguageSearchResult } from "@/lib/mockData";
import type { SearchProgress } from "../hooks/useNaturalSearch";

interface NaturalSearchResultsProps {
  results: NaturalLanguageSearchResult[];
  query: string;
  progress?: SearchProgress;
  enrichedContext?: {
    movieReferences?: string[];
    excludedReadBooks?: number;
    fallback?: boolean;
  };
  onBookClick?: (bookId: string) => void;
  onExampleClick?: (exampleQuery: string) => void;
}

const PROGRESS_MESSAGES: Record<SearchProgress, string> = {
  idle: '',
  analyzing: 'Analyzing your query...',
  finding: 'Finding matching books...',
  ranking: 'Ranking results...',
  complete: ''
};

const EXAMPLE_QUERIES = [
  "cozy mystery in a bookshop",
  "like Succession but a book",
  "dark academia with secret societies",
  "uplifting after a hard week",
  "psychological thriller with a twist"
];

export default function NaturalSearchResults({
  results,
  query,
  progress = 'complete',
  enrichedContext,
  onBookClick,
  onExampleClick
}: NaturalSearchResultsProps) {
  const isLoading = progress !== 'complete' && progress !== 'idle';
  const isEmpty = results.length === 0 && !isLoading;

  // Loading state with progress
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="text-center py-8 px-4">
          <div className="relative inline-block mb-4">
            <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-spin" strokeWidth={2.5} />
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 absolute -top-1 -right-1 animate-pulse" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-lg text-black dark:text-white mb-2">
            {PROGRESS_MESSAGES[progress]}
          </p>
          {enrichedContext?.movieReferences && enrichedContext.movieReferences.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 border-[3px] border-black dark:border-white rounded-xl inline-flex">
              <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
              <span className="font-semibold text-sm text-purple-600 dark:text-purple-400">
                Detected: {enrichedContext.movieReferences.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Empty state with suggestions
  if (isEmpty) {
    const message = enrichedContext?.excludedReadBooks && enrichedContext.excludedReadBooks > 0
      ? `All ${enrichedContext.excludedReadBooks} matching books have already been read`
      : 'No books found matching your search';

    return (
      <div className="text-center py-16 px-4">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" strokeWidth={2} />
        <p className="font-bold text-xl text-black dark:text-white mb-2">
          {message}
        </p>
        <p className="font-semibold text-gray-600 dark:text-gray-400 mb-6">
          Try a different search or check out these examples:
        </p>
        
        {/* Example Queries */}
        <div className="max-w-md mx-auto space-y-2">
          {EXAMPLE_QUERIES.slice(0, 3).map((example, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick && onExampleClick(example)}
              className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 border-[3px] border-black dark:border-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                "{example}"
              </p>
            </button>
          ))}
        </div>
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
            {enrichedContext?.fallback ? 'KEYWORD SEARCH' : 'AI POWERED'}
          </span>
        </div>
      </div>

      {/* Enrichment Context */}
      {enrichedContext?.movieReferences && enrichedContext.movieReferences.length > 0 && (
        <div className="px-4 flex items-center gap-2 text-sm">
          <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Found books similar to: <span className="text-purple-600 dark:text-purple-400">{enrichedContext.movieReferences.join(', ')}</span>
          </span>
        </div>
      )}

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
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Cascade: Try Google Books fallback
                const googleCover = book.googleBooksCoverUrl;
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
            <div className="absolute inset-0 bg-gradient-accent flex items-center justify-center text-3xl" style={{ display: 'none' }}>
              📚
            </div>
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
