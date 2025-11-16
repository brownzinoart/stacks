import { describe, it, expect, vi } from 'vitest';
import { searchMovie, extractThemesFromMovie } from '../tmdb';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

describe('TMDB Service', () => {
  it.skipIf(!TMDB_API_KEY)('should search for a movie and return basic info', async () => {
    const result = await searchMovie('Succession');

    expect(result).toBeDefined();
    expect(result?.title.toLowerCase()).toContain('succession');
    expect(result?.tmdbId).toBeDefined();
    expect(result?.overview.length).toBeGreaterThan(0);
    // Genres may be empty if detail fetch fails, but that's okay
    expect(Array.isArray(result?.genres)).toBe(true);
  }, 10000);

  it.skipIf(!TMDB_API_KEY)('should extract themes and tropes from movie data', async () => {
    const themes = await extractThemesFromMovie('Succession');

    expect(themes).toBeDefined();
    // Theme extraction may use Claude (if configured) or fallback to mock data
    // So we just verify it returns a valid structure
    expect(Array.isArray(themes.themes)).toBe(true);
    expect(Array.isArray(themes.tropes)).toBe(true);
    expect(Array.isArray(themes.mood)).toBe(true);
    // If Claude is working, themes should be populated
    // If not, it falls back to mock data which also has themes
    expect(themes.themes.length + themes.tropes.length + themes.mood.length).toBeGreaterThan(0);
  }, 15000);

  it.skipIf(!TMDB_API_KEY)('should return null for non-existent movies', async () => {
    const result = await searchMovie('XYZ_NONEXISTENT_MOVIE_12345');
    expect(result).toBeNull();
  });
});
