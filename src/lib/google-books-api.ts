/**
 * Google Books API integration for book verification and metadata
 * Enhanced with caching for better performance
 */

import axios from 'axios';
import { apiCache } from './api-cache';

export interface GoogleBookInfo {
  title: string;
  authors?: string[];
  description?: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

export interface GoogleBooksSearchResult {
  items?: Array<{
    id: string;
    volumeInfo: GoogleBookInfo;
  }>;
  totalItems: number;
}

class GoogleBooksAPI {
  private baseURL = 'https://www.googleapis.com/books/v1';
  private apiKey: string | undefined;

  constructor() {
    // API key is optional for basic searches
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  }

  /**
   * Search for books by title and optionally author
   */
  async searchBooks(
    title: string,
    author?: string,
    maxResults: number = 5
  ): Promise<GoogleBooksSearchResult> {
    try {
      // Build search query
      let query = `intitle:"${title}"`;
      if (author) {
        query += ` inauthor:"${author}"`;
      }

      const params: any = {
        q: query,
        maxResults,
        orderBy: 'relevance',
      };

      if (this.apiKey) {
        params.key = this.apiKey;
      }

      const response = await axios.get(`${this.baseURL}/volumes`, { params });
      return response.data;
    } catch (error) {
      console.error('Google Books API error:', error);
      return { totalItems: 0 };
    }
  }

  /**
   * Verify if a book title exists and get its metadata with caching
   */
  async verifyBook(title: string, author?: string): Promise<GoogleBookInfo | null> {
    try {
      // Check cache first
      const cached = await apiCache.getCachedBookInfo(title, author) as GoogleBookInfo | null;
      if (cached) {
        console.log('Using cached book info for:', title);
        return cached;
      }

      const result = await this.searchBooks(title, author, 1);
      
      if (result.items && result.items.length > 0) {
        const book = result.items[0]?.volumeInfo;
        
        if (!book) {
          return null;
        }
        
        // Check if the title is a reasonable match
        const normalizedSearchTitle = this.normalizeTitle(title);
        const normalizedFoundTitle = this.normalizeTitle(book.title);
        
        const similarity = this.calculateSimilarity(normalizedSearchTitle, normalizedFoundTitle);
        
        if (similarity > 0.7) {
          // Cache the successful result
          await apiCache.cacheBookInfo(title, author, book);
          return book;
        }
      }
      
      // Cache null results too to prevent repeated failed lookups
      await apiCache.cacheBookInfo(title, author, null);
      return null;
    } catch (error) {
      console.error('Book verification error:', error);
      return null;
    }
  }

  /**
   * Get book by ISBN
   */
  async getBookByISBN(isbn: string): Promise<GoogleBookInfo | null> {
    try {
      const params: any = {
        q: `isbn:${isbn}`,
      };

      if (this.apiKey) {
        params.key = this.apiKey;
      }

      const response = await axios.get(`${this.baseURL}/volumes`, { params });
      
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].volumeInfo;
      }
      
      return null;
    } catch (error) {
      console.error('ISBN lookup error:', error);
      return null;
    }
  }

  /**
   * Batch verify multiple book titles with optimized caching
   */
  async batchVerifyBooks(
    books: Array<{ title: string; author?: string }>
  ): Promise<Array<{ original: string; verified: GoogleBookInfo | null }>> {
    // Separate cached and uncached books
    const uncachedBooks: Array<{ title: string; author?: string; index: number }> = [];
    const results: Array<{ original: string; verified: GoogleBookInfo | null }> = new Array(books.length);

    // Check cache for all books first
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      if (!book) continue;
      const cached = await apiCache.getCachedBookInfo(book.title, book.author) as GoogleBookInfo | null;
      
      if (cached !== null) {
        results[i] = { original: book.title, verified: cached };
      } else {
        uncachedBooks.push({ ...book, index: i });
      }
    }

    // Process uncached books with concurrency limit
    const concurrencyLimit = 3; // Respect API rate limits
    for (let i = 0; i < uncachedBooks.length; i += concurrencyLimit) {
      const batch = uncachedBooks.slice(i, i + concurrencyLimit);
      
      const batchResults = await Promise.all(
        batch.map(async (book) => {
          const verified = await this.verifyBook(book.title, book.author);
          return { index: book.index, result: { original: book.title, verified } };
        })
      );

      // Insert batch results into final array
      batchResults.forEach(({ index, result }) => {
        results[index] = result;
      });
      
      // Add delay between batches to respect rate limits
      if (i + concurrencyLimit < uncachedBooks.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Normalize title for comparison
   */
  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  /**
   * Calculate similarity between two strings (0-1)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    if (str1.length === 0) return str2.length;
    if (str2.length === 0) return str1.length;

    // Create matrix with proper initialization
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));

    // Initialize first row and column
    for (let i = 0; i <= str2.length; i++) {
      matrix[i]![0] = i;
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        const cost = str2.charAt(i - 1) === str1.charAt(j - 1) ? 0 : 1;
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1, // deletion
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j - 1]! + cost // substitution
        );
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  /**
   * Get book recommendations based on a title
   */
  async getRecommendations(title: string, maxResults: number = 10): Promise<GoogleBookInfo[]> {
    try {
      // First get the book to find its categories
      const book = await this.verifyBook(title);
      
      if (!book || !book.categories || book.categories.length === 0) {
        return [];
      }

      // Search for books in the same category
      const params: any = {
        q: `subject:"${book.categories[0]}"`,
        maxResults,
        orderBy: 'relevance',
      };

      if (this.apiKey) {
        params.key = this.apiKey;
      }

      const response = await axios.get(`${this.baseURL}/volumes`, { params });
      
      if (response.data.items) {
        return response.data.items
          .map((item: any) => item.volumeInfo)
          .filter((b: GoogleBookInfo) => b.title !== title); // Exclude the original book
      }
      
      return [];
    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const googleBooksAPI = new GoogleBooksAPI();