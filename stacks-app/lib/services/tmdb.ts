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

    return {
      tmdbId: movie.id,
      title: movie.title,
      year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
      overview: movie.overview,
      genres: movie.genres?.map(g => g.name) || []
    };
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return null;
  }
}

/**
 * Use Claude to extract themes and tropes from movie data
 * This is where the secondary model comes in
 */
export async function extractThemesFromMovie(movieTitle: string): Promise<ExtractedThemes> {
  const movie = await searchMovie(movieTitle);

  if (!movie) {
    return { themes: [], tropes: [], mood: [] };
  }

  // TODO: Implement Claude API call in Task 5
  // For now, return mock data based on known movies
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

  return mockThemeMapping[movie.title] || {
    themes: movie.genres.map(g => g.toLowerCase()),
    tropes: [],
    mood: []
  };
}

/**
 * Extract movie references from natural language query
 * e.g., "like Succession but a book" -> ["Succession"]
 */
export function extractMovieReferences(query: string): string[] {
  const commonPhrases = [
    /like ([A-Z][a-zA-Z\s]+)(?:\s+but|,|$)/gi,
    /similar to ([A-Z][a-zA-Z\s]+)(?:\s+but|,|$)/gi,
    /reminds me of ([A-Z][a-zA-Z\s]+)(?:\s+but|,|$)/gi,
    /(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+vibes/gi,
  ];

  const matches = new Set<string>();

  for (const pattern of commonPhrases) {
    let match;
    while ((match = pattern.exec(query)) !== null) {
      matches.add(match[1].trim());
    }
  }

  return Array.from(matches);
}
