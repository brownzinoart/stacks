const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  release_date: string;
  vote_average: number;
}

export interface MovieSearchResult {
  tmdbId: number;
  title: string;
  year?: number;
  overview: string;
  genres: string[];
}

export interface ExtractedThemes {
  themes: string[];
  tropes: string[];
  mood: string[];
}

/**
 * Search for a movie by name on TMDB
 */
export async function searchMovie(query: string): Promise<MovieSearchResult | null> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB_API_KEY not set, skipping movie search');
    return null;
  }

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      console.error('TMDB API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    const movie = data.results?.[0] as TMDBMovie | undefined;

    if (!movie) {
      return null;
    }

    // Search endpoint returns genre_ids, not full genre objects
    // We need to fetch full movie details to get genre names
    // For now, return basic info and fetch genres separately if needed
    const genreIds = (movie as any).genre_ids || [];
    
    // Fetch full movie details to get genre names
    let genres: string[] = [];
    try {
      const detailResponse = await fetch(
        `${TMDB_API_BASE}/movie/${movie.id}?api_key=${TMDB_API_KEY}`
      );
      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        genres = detailData.genres?.map((g: { id: number; name: string }) => g.name) || [];
      }
    } catch (err) {
      // If detail fetch fails, continue without genres
      console.warn('Failed to fetch movie details for genres:', err);
    }

    return {
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
      overview: movie.overview,
      genres: genres.length > 0 ? genres : []
    };
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return null;
  }
}

// Cache for TMDB movie themes (longer TTL since movies don't change)
const movieThemeCache = new Map<string, { themes: ExtractedThemes; timestamp: number }>();
const MOVIE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Use Claude to extract themes and tropes from movie data
 * This is where the secondary model comes in
 */
export async function extractThemesFromMovie(movieTitle: string): Promise<ExtractedThemes> {
  // Check cache first
  const cacheKey = movieTitle.toLowerCase().trim();
  const cached = movieThemeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < MOVIE_CACHE_TTL) {
    return cached.themes;
  }

  const movie = await searchMovie(movieTitle);

  if (!movie) {
    // Fallback to mock data for known movies if TMDB fails
    const mockThemeMapping: Record<string, ExtractedThemes> = {
      'Succession': {
        themes: ['family drama', 'corporate intrigue', 'power struggles', 'betrayal', 'wealth', 'succession'],
        tropes: ['dysfunctional family', 'corporate thriller', 'morally grey characters', 'dark comedy'],
        mood: ['dark', 'intense', 'character-driven', 'satirical']
      },
      'Gone Girl': {
        themes: ['marriage', 'deception', 'media manipulation', 'revenge', 'sociopathy'],
        tropes: ['unreliable narrator', 'twist ending', 'psychological thriller', 'toxic relationship'],
        mood: ['dark', 'suspenseful', 'twisted', 'psychological']
      },
      'The Social Network': {
        themes: ['ambition', 'friendship betrayal', 'success', 'innovation', 'legal battles'],
        tropes: ['rise to power', 'genius protagonist', 'friendship breakup', 'based on true story'],
        mood: ['fast-paced', 'intense', 'smart', 'dialogue-heavy']
      },
      'Interstellar': {
        themes: ['survival', 'love transcends time', 'sacrifice', 'humanity\'s future', 'family'],
        tropes: ['space exploration', 'time dilation', 'father-daughter bond', 'science saves humanity'],
        mood: ['epic', 'emotional', 'thought-provoking', 'visually stunning']
      }
    };

    const mockResult = mockThemeMapping[movieTitle] || {
      themes: [],
      tropes: [],
      mood: []
    };
    
    // Cache mock result too
    movieThemeCache.set(cacheKey, { themes: mockResult, timestamp: Date.now() });
    return mockResult;
  }

  // Use Claude to extract themes from movie data
  try {
    // Dynamic import to avoid circular dependency
    const claudeModule = await import('./claude');
    const callClaude = claudeModule.callClaude;
    
    const prompt = `Extract themes, tropes, and mood from this movie:

Title: ${movie.title}
Overview: ${movie.overview}
Genres: ${movie.genres.join(', ')}

Return themes, tropes, and mood as comma-separated lists. Format:
THEMES: theme1, theme2, theme3
TROPES: trope1, trope2, trope3
MOOD: mood1, mood2, mood3

Focus on what makes this movie distinctive and what book readers might seek.`;

    const response = await callClaude(prompt, 500, 5000);
    
    // Parse Claude's response
    const themes: string[] = [];
    const tropes: string[] = [];
    const mood: string[] = [];

    const themesMatch = response.match(/THEMES?:\s*(.+?)(?:\n|TROPES|MOOD|$)/i);
    if (themesMatch) {
      themes.push(...themesMatch[1].split(',').map(t => t.trim()).filter(t => t));
    }

    const tropesMatch = response.match(/TROPES?:\s*(.+?)(?:\n|MOOD|$)/i);
    if (tropesMatch) {
      tropes.push(...tropesMatch[1].split(',').map(t => t.trim()).filter(t => t));
    }

    const moodMatch = response.match(/MOOD:\s*(.+?)(?:\n|$)/i);
    if (moodMatch) {
      mood.push(...moodMatch[1].split(',').map(m => m.trim()).filter(m => m));
    }

    // Fallback: if parsing fails, use genres as themes
    if (themes.length === 0 && tropes.length === 0 && mood.length === 0) {
      themes.push(...movie.genres.map(g => g.toLowerCase()));
    }

    const result: ExtractedThemes = { themes, tropes, mood };
    
    // Cache the result
    movieThemeCache.set(cacheKey, { themes: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error('Error extracting themes from movie with Claude:', error);
    
    // Fallback to basic extraction from genres
    const fallback: ExtractedThemes = {
      themes: movie.genres.map(g => g.toLowerCase()),
      tropes: [],
      mood: []
    };
    
    // Cache fallback
    movieThemeCache.set(cacheKey, { themes: fallback, timestamp: Date.now() });
    
    return fallback;
  }
}

/**
 * Extract movie references from natural language query
 * e.g., "like Succession but a book" -> ["Succession"]
 * e.g., "books like the movie scarface" -> ["scarface"]
 */
export function extractMovieReferences(query: string): string[] {
  const commonPhrases = [
    // "books like the movie [title]" or "like the movie [title]"
    /(?:books?\s+)?like\s+(?:the\s+)?(?:movie|film|show|series)\s+([A-Z][a-zA-Z0-9\s]+?)(?:\s+but|\s+book|,|$|\.)/gi,
    // "like [Title] but a book"
    /like\s+([A-Z][a-zA-Z\s]+?)(?:\s+but|,|$|\.)/gi,
    // "similar to [Title]"
    /similar\s+to\s+([A-Z][a-zA-Z\s]+?)(?:\s+but|,|$|\.)/gi,
    // "reminds me of [Title]"
    /reminds\s+me\s+of\s+([A-Z][a-zA-Z\s]+?)(?:\s+but|,|$|\.)/gi,
    // "[Title] vibes"
    /(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+vibes/gi,
  ];

  const matches = new Set<string>();

  for (const pattern of commonPhrases) {
    let match;
    // Reset regex lastIndex to avoid issues with global regex
    pattern.lastIndex = 0;
    while ((match = pattern.exec(query)) !== null) {
      let extracted = match[1].trim();
      // Remove common prefixes
      extracted = extracted.replace(/^(the|a|an)\s+/i, '').trim();
      // Remove "movie", "film", etc. from start (in case pattern captured it)
      extracted = extracted.replace(/^(movie|film|show|series)\s+/i, '').trim();
      // Remove common suffixes
      extracted = extracted.replace(/\s+(movie|film|show|series|book|books)$/i, '').trim();
      // Filter out common words and ensure it's a valid movie title
      const extractedLower = extracted.toLowerCase();
      if (extracted && extracted.length > 2 && 
          !['the', 'movie', 'film', 'show', 'series', 'book', 'books'].includes(extractedLower) &&
          !extractedLower.startsWith('movie ') && !extractedLower.startsWith('film ')) {
        matches.add(extracted);
      }
    }
  }

  return Array.from(matches);
}
