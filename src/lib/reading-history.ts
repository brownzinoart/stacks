/**
 * Reading History Service
 * Tracks user's reading history and calculates book similarity scores
 */

export interface ReadingHistoryBook {
  title: string;
  author: string;
  timestamp: number;
  genres?: string[];
  topics?: string[];
}

export interface SimilarityScore {
  score: number; // 0-100
  reasons: string[];
}

const STORAGE_KEY = 'stacks_reading_history';
const MAX_HISTORY_SIZE = 50;

export class ReadingHistoryService {
  private static instance: ReadingHistoryService;

  private constructor() {}

  static getInstance(): ReadingHistoryService {
    if (!ReadingHistoryService.instance) {
      ReadingHistoryService.instance = new ReadingHistoryService();
    }
    return ReadingHistoryService.instance;
  }

  getHistory(): ReadingHistoryBook[] {
    if (typeof window === 'undefined') return [];

    try {
      const history = localStorage.getItem(STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  addToHistory(book: Omit<ReadingHistoryBook, 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    const history = this.getHistory();

    // Check if book already exists
    const existingIndex = history.findIndex((h) => h.title === book.title && h.author === book.author);

    if (existingIndex !== -1) {
      // Move to front if already exists
      history.splice(existingIndex, 1);
    }

    // Add to front of history
    history.unshift({
      ...book,
      timestamp: Date.now(),
    });

    // Keep only the most recent entries
    const trimmedHistory = history.slice(0, MAX_HISTORY_SIZE);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (e) {
      console.error('Failed to save reading history:', e);
    }
  }

  calculateSimilarity(book: { title: string; author: string; genres?: string[]; topics?: string[] }): SimilarityScore {
    const history = this.getHistory();

    if (history.length === 0) {
      return { score: 0, reasons: [] };
    }

    let score = 0;
    const reasons: string[] = [];
    const weights = {
      sameAuthor: 40,
      recentlyRead: 20,
      similarTopics: 25,
      similarGenres: 15,
    };

    // Check for same author
    const sameAuthorBooks = history.filter((h) => h.author.toLowerCase() === book.author.toLowerCase());

    if (sameAuthorBooks.length > 0) {
      score += weights.sameAuthor;
      reasons.push(
        `You've read ${sameAuthorBooks.length} other book${sameAuthorBooks.length > 1 ? 's' : ''} by ${book.author}`
      );
    }

    // Check for recent books (within last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentBooks = history.filter((h) => h.timestamp > thirtyDaysAgo);

    if (recentBooks.length > 0) {
      // Give bonus if author appears in recent reads
      const recentSameAuthor = recentBooks.some((h) => h.author.toLowerCase() === book.author.toLowerCase());

      if (recentSameAuthor) {
        score += weights.recentlyRead;
        reasons.push('Recently read this author');
      }
    }

    // Check for similar topics (if provided)
    if (book.topics && book.topics.length > 0) {
      const topicMatches = history.filter(
        (h) => h.topics && h.topics.some((t) => book.topics!.some((bt) => bt.toLowerCase() === t.toLowerCase()))
      );

      if (topicMatches.length > 0) {
        const topicScore = Math.min(
          weights.similarTopics,
          (topicMatches.length / history.length) * weights.similarTopics * 2
        );
        score += topicScore;
        reasons.push("Similar to books you've enjoyed");
      }
    }

    // Check for similar genres (if provided)
    if (book.genres && book.genres.length > 0) {
      const genreMatches = history.filter(
        (h) => h.genres && h.genres.some((g) => book.genres!.some((bg) => bg.toLowerCase() === g.toLowerCase()))
      );

      if (genreMatches.length > 0) {
        const genreScore = Math.min(
          weights.similarGenres,
          (genreMatches.length / history.length) * weights.similarGenres * 2
        );
        score += genreScore;

        if (!reasons.some((r) => r.includes('Similar to books'))) {
          reasons.push('Matches your reading preferences');
        }
      }
    }

    // Add some randomness for books that have no matches (5-15%)
    if (score === 0 && history.length > 0) {
      score = 5 + Math.floor(Math.random() * 10);
      reasons.push('New discovery for you');
    }

    return {
      score: Math.min(100, Math.round(score)),
      reasons,
    };
  }

  getTopAuthors(limit: number = 5): { author: string; count: number }[] {
    const history = this.getHistory();
    const authorCounts = new Map<string, number>();

    history.forEach((book) => {
      const author = book.author.toLowerCase();
      authorCounts.set(author, (authorCounts.get(author) || 0) + 1);
    });

    return Array.from(authorCounts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  clearHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear reading history:', e);
    }
  }
}

export const readingHistory = ReadingHistoryService.getInstance();
