/**
 * Book-related type definitions
 */

export interface BookMetadata {
  synopsis: string;
  themes: string[];          // ["family drama", "corporate intrigue", "betrayal"]
  tropes: string[];          // ["enemies to lovers", "found family", "morally grey protagonist"]
  mood: string[];            // ["dark", "intense", "fast-paced", "character-driven"]
  similarMovies?: string[];  // ["Succession", "The Godfather"] - for reference
  pageCount: number;
  publishYear: number;
  amazonRating?: number;
  goodreadsRating?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string; // Open Library URL (primary)
  googleBooksCoverUrl?: string; // Google Books URL (fallback)
  genres: string[];
  tropes: string[];          // Keep for backward compatibility
  pageCount: number;
  publishYear: number;
  metadata?: BookMetadata;   // Extended metadata for search
}

export type MatchLevel = "high" | "medium" | "low" | "read";

export interface BookMatch {
  book: Book;
  matchLevel: MatchLevel;
}

export interface BookReview {
  id: string;
  username: string;
  stars: number;
  text: string;
  source: 'google' | 'mock';
}

export interface BookDetail extends Book {
  isbn?: string;
  description: string;
  socialProof: {
    isBestseller: boolean;
    bestsellerInfo?: string;
    rating: number;
    ratingsCount: number;
    readerTags: string[];
    reviews: BookReview[];
  };
}

