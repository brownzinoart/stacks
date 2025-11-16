import { NextRequest, NextResponse } from 'next/server';
import { searchMovie, extractThemesFromMovie, extractMovieReferences } from '@/lib/services/tmdb';

/**
 * Test endpoint to verify TMDB API is working
 * GET /api/test/tmdb?movie=Succession
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movieTitle = searchParams.get('movie') || 'Succession';

  const results: any = {
    timestamp: new Date().toISOString(),
    movieTitle,
    apiKeyConfigured: !!process.env.TMDB_API_KEY,
    apiKeyLength: process.env.TMDB_API_KEY?.length || 0,
  };

  try {
    // Test 1: Extract movie references
    const testQuery = `like ${movieTitle} but a book`;
    const movieRefs = extractMovieReferences(testQuery);
    results.movieReferences = {
      query: testQuery,
      extracted: movieRefs,
      success: movieRefs.length > 0
    };

    // Test 2: Search TMDB for movie
    const movieData = await searchMovie(movieTitle);
    results.movieSearch = {
      success: !!movieData,
      data: movieData ? {
        tmdbId: movieData.tmdbId,
        title: movieData.title,
        year: movieData.year,
        genres: movieData.genres,
        overview: movieData.overview?.substring(0, 200) + '...'
      } : null,
      error: movieData ? null : 'Movie not found or API error'
    };

    // Test 3: Extract themes (requires Claude API too)
    if (movieData) {
      try {
        const themes = await extractThemesFromMovie(movieTitle);
        results.themeExtraction = {
          success: true,
          themes: themes.themes,
          tropes: themes.tropes,
          mood: themes.mood,
          source: 'TMDB + Claude'
        };
      } catch (error) {
        results.themeExtraction = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          note: 'Theme extraction requires Claude API key'
        };
      }
    } else {
      results.themeExtraction = {
        success: false,
        error: 'Cannot extract themes without movie data',
        note: 'Movie search failed first'
      };
    }

    // Overall status
    results.overallStatus = results.movieSearch.success ? 'SUCCESS' : 'FAILED';
    results.summary = results.movieSearch.success
      ? `TMDB API is working! Found "${movieData?.title}" (ID: ${movieData?.tmdbId})`
      : 'TMDB API test failed. Check API key configuration.';

    return NextResponse.json(results, {
      status: results.movieSearch.success ? 200 : 503
    });

  } catch (error) {
    results.error = error instanceof Error ? error.message : 'Unknown error';
    results.overallStatus = 'ERROR';
    
    return NextResponse.json(results, { status: 500 });
  }
}

