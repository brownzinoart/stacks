/**
 * Search-related type definitions
 */

import type { Book } from './book';
import type { UserReadingProfile } from './user';

export interface SearchQuery {
  raw: string;                    // Original user query
  enriched?: {
    movieReferences?: {
      title: string;
      tmdbId: number;
      themes: string[];
      tropes: string[];
    }[];
    extractedThemes: string[];
    extractedMoods: string[];
    extractedTropes: string[];
  };
  userContext?: {
    profile: UserReadingProfile;
    recentReads: Book[];
    preferredGenres: string[];
  };
}

export interface NaturalLanguageSearchResult {
  book: Book;
  matchScore: number;           // 0-100
  matchReasons: string[];       // ["Matches your love of dark academia", "Similar to Gone Girl"]
  relevanceToQuery: number;     // 0-100
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

