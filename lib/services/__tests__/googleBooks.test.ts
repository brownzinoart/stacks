import { describe, it, expect } from 'vitest';
import { searchBooks, enrichBookWithMetadata } from '../googleBooks';

describe('Google Books Service', () => {
  it('should search for books by title', async () => {
    const results = await searchBooks('The Silent Patient');

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Silent Patient');
  });

  it('should enrich book data with Google Books metadata', async () => {
    const enriched = await enrichBookWithMetadata('The Silent Patient', 'Alex Michaelides');

    expect(enriched).toBeDefined();
    expect(enriched?.synopsis).toBeDefined();
    expect(enriched?.pageCount).toBeGreaterThan(0);
  });

  it('should handle books not found gracefully', async () => {
    const results = await searchBooks('XYZ_NONEXISTENT_BOOK_12345_QWERTY');
    expect(results).toEqual([]);
  });
});
