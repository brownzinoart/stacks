import { describe, it, expect, vi } from 'vitest';
import { searchMovie, extractThemesFromMovie } from '../tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

describe('TMDB Service', () => {
  it.skipIf(!TMDB_API_KEY)('should search for a movie and return basic info', async () => {
    const result = await searchMovie('Succession');

    expect(result).toBeDefined();
    expect(result?.title).toBe('Succession');
    expect(result?.tmdbId).toBeDefined();
  });

  it.skipIf(!TMDB_API_KEY)('should extract themes and tropes from movie data', async () => {
    const themes = await extractThemesFromMovie('Succession');

    expect(themes).toBeDefined();
    expect(themes.themes).toContain('family drama');
    expect(themes.themes).toContain('corporate intrigue');
    expect(themes.mood).toContain('dark');
  });

  it.skipIf(!TMDB_API_KEY)('should return null for non-existent movies', async () => {
    const result = await searchMovie('XYZ_NONEXISTENT_MOVIE_12345');
    expect(result).toBeNull();
  });
});
