import { NextRequest, NextResponse } from 'next/server';
import { findMatchingBooks } from '@/lib/services/claude';
import { extractMovieReferences } from '@/lib/services/tmdb';
import { mockCurrentUserProfile, mockBooksWithMetadata, getBooksReadByUser } from '@/lib/mockData';
import type { NaturalLanguageSearchResult, Book } from '@/lib/mockData';

// Cache for expensive search operations
const searchCache = new Map<string, { results: NaturalLanguageSearchResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Normalize and validate query
 */
function normalizeQuery(query: string): { normalized: string; error?: string } {
  if (!query || typeof query !== 'string') {
    return { normalized: '', error: 'Query is required and must be a string' };
  }

  // Normalize: trim and collapse whitespace
  const normalized = query.trim().replace(/\s+/g, ' ');

  // Validate length
  if (normalized.length < 3) {
    return { normalized, error: 'Query must be at least 3 characters long' };
  }

  if (normalized.length > 500) {
    return { normalized: normalized.slice(0, 500), error: 'Query is too long (max 500 characters)' };
  }

  // Check if query is only punctuation/whitespace
  if (!/[a-zA-Z0-9]/.test(normalized)) {
    return { normalized, error: 'Query must contain at least one letter or number' };
  }

  return { normalized };
}

/**
 * Simple keyword-based fallback when Claude fails
 */
function fallbackKeywordSearch(
  query: string,
  books: Book[],
  limit: number = 10
): NaturalLanguageSearchResult[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scored = books.map(book => {
    let score = 0;
    const reasons: string[] = [];

    // Check title match
    const titleLower = book.title.toLowerCase();
    if (titleLower.includes(queryLower)) {
      score += 50;
      reasons.push(`Title matches "${query}"`);
    } else {
      queryWords.forEach(word => {
        if (titleLower.includes(word)) {
          score += 10;
        }
      });
    }

    // Check author match
    const authorLower = book.author.toLowerCase();
    if (authorLower.includes(queryLower)) {
      score += 30;
      reasons.push(`Author matches "${query}"`);
    } else {
      queryWords.forEach(word => {
        if (authorLower.includes(word)) {
          score += 8;
        }
      });
    }

    // Check genres
    book.genres.forEach(genre => {
      if (genre.toLowerCase().includes(queryLower)) {
        score += 20;
        reasons.push(`Genre matches: ${genre}`);
      }
    });

    // Check tropes
    const tropes = book.metadata?.tropes || book.tropes || [];
    tropes.forEach(trope => {
      if (trope.toLowerCase().includes(queryLower)) {
        score += 15;
        reasons.push(`Trope matches: ${trope}`);
      }
    });

    return {
      book,
      matchScore: Math.min(score, 85), // Cap at 85 for fallback
      matchReasons: reasons.length > 0 ? reasons : ['Partial match based on keywords'],
      relevanceToQuery: Math.min(score, 85)
    };
  });

  return scored
    .filter(r => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (lastError.message.includes('API key') || lastError.message.includes('authentication')) {
        throw lastError;
      }

      // Last attempt, throw error
      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId } = body;

    // Validate and normalize query
    const { normalized, error: validationError } = normalizeQuery(query);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Check cache first (use normalized query)
    const cacheKey = `${userId || 'anonymous'}:${normalized}`;
    const cached = searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Extract movie references for cached results too
      const movieReferences = extractMovieReferences(normalized);
      
      return NextResponse.json({
        success: true,
        query: normalized,
        results: cached.results,
        totalResults: cached.results.length,
        cached: true,
        enrichedContext: {
          excludedReadBooks: getBooksReadByUser(userId || 'user-1').length,
          userProfileUsed: true,
          movieReferences: movieReferences.length > 0 ? movieReferences : undefined
        }
      });
    }

    // Get user profile (mock for now)
    const userProfile = userId === 'user-1' ? mockCurrentUserProfile : mockCurrentUserProfile;

    // Get books user has already read (to filter out)
    const readBookIds = getBooksReadByUser(userId || 'user-1');

    // Filter out books already read
    const unreadBooks = mockBooksWithMetadata.filter(
      book => !readBookIds.includes(book.id)
    );

    // Check if we have any books to search
    if (unreadBooks.length === 0) {
      return NextResponse.json({
        success: true,
        query: normalized,
        results: [],
        totalResults: 0,
        enrichedContext: {
          excludedReadBooks: readBookIds.length,
          userProfileUsed: true,
          message: 'All matching books have already been read'
        }
      });
    }

    let results: NaturalLanguageSearchResult[] = [];
    let usedFallback = false;
    
    // Extract movie references for UI display
    const movieReferences = extractMovieReferences(normalized);

    try {
      // Call Claude to find matches with retry logic
      results = await withRetry(
        () => findMatchingBooks(normalized, userProfile, unreadBooks, 10),
        3,
        1000
      );

      // Validate results
      if (!results || results.length === 0) {
        throw new Error('No results returned from Claude');
      }
    } catch (error) {
      console.error('Claude search failed, using fallback:', error);
      
      // Use keyword-based fallback
      results = fallbackKeywordSearch(normalized, unreadBooks, 10);
      usedFallback = true;

      // If fallback also fails, return empty results with helpful message
      if (results.length === 0) {
        return NextResponse.json({
          success: true,
          query: normalized,
          results: [],
          totalResults: 0,
          enrichedContext: {
            excludedReadBooks: readBookIds.length,
            userProfileUsed: true,
            movieReferences: movieReferences.length > 0 ? movieReferences : undefined,
            message: 'No books found matching your search. Try different keywords or a more general query.'
          },
          fallback: true
        });
      }
    }

    // Store in cache (only cache successful Claude results, not fallbacks)
    if (!usedFallback) {
      searchCache.set(cacheKey, {
        results,
        timestamp: Date.now()
      });

      // Cleanup old cache entries (simple LRU)
      if (searchCache.size > 100) {
        const oldestKey = searchCache.keys().next().value;
        if (oldestKey) {
          searchCache.delete(oldestKey);
        }
      }
    }

    return NextResponse.json({
      success: true,
      query: normalized,
      results,
      totalResults: results.length,
      enrichedContext: {
        excludedReadBooks: readBookIds.length,
        userProfileUsed: true,
        movieReferences: movieReferences.length > 0 ? movieReferences : undefined
      },
      fallback: usedFallback
    });

  } catch (error) {
    console.error('Search API error:', error);

    // Determine error type for better user feedback
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let status = 500;
    let userMessage = 'Internal server error';

    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      status = 503;
      userMessage = 'Search service temporarily unavailable. Please try again later.';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      status = 504;
      userMessage = 'Request timed out. Please try a shorter query or try again.';
    } else if (errorMessage.includes('rate limit')) {
      status = 429;
      userMessage = 'Too many requests. Please wait a moment and try again.';
    }

    return NextResponse.json(
      {
        error: userMessage,
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status }
    );
  }
}
