import { NextRequest, NextResponse } from 'next/server';
import { findMatchingBooks } from '@/lib/services/claude';
import { mockCurrentUserProfile, mockBooksWithMetadata, getBooksReadByUser } from '@/lib/mockData';
import type { NaturalLanguageSearchResult } from '@/lib/mockData';

// Cache for expensive search operations
const searchCache = new Map<string, { results: NaturalLanguageSearchResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId } = body;

    // Validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${userId || 'anonymous'}:${query}`;
    const cached = searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        query,
        results: cached.results,
        totalResults: cached.results.length,
        cached: true,
        enrichedContext: {
          excludedReadBooks: getBooksReadByUser(userId || 'user-1').length,
          userProfileUsed: true
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

    // Call Claude to find matches
    const results: NaturalLanguageSearchResult[] = await findMatchingBooks(
      query,
      userProfile,
      unreadBooks,
      10
    );

    // Store in cache
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

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults: results.length,
      enrichedContext: {
        excludedReadBooks: readBookIds.length,
        userProfileUsed: true
      }
    });

  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
