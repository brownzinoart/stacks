import { describe, it, expect, vi } from 'vitest';
import { callClaude, enrichQueryWithContext, findMatchingBooks } from '../claude';
import { mockCurrentUserProfile, mockBooksWithMetadata } from '../../mockData';

describe('Claude Service', () => {
  it('should call Claude API with a prompt', async () => {
    const response = await callClaude('What are common themes in Gone Girl?');

    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  }, 15000); // 15 second timeout for API call

  it('should enrich query with TMDB and user context', async () => {
    const enriched = await enrichQueryWithContext(
      'Books like Succession',
      mockCurrentUserProfile
    );

    // Check that enriched query contains relevant family/power themes
    const queryLower = enriched.enrichedQuery.toLowerCase();
    const hasRelevantThemes =
      queryLower.includes('family') ||
      queryLower.includes('power') ||
      queryLower.includes('succession') ||
      queryLower.includes('corporate');

    expect(hasRelevantThemes).toBe(true);
    expect(enriched.userContextSummary).toBeDefined();
    expect(enriched.userContextSummary).toContain('Thriller');
  }, 15000); // 15 second timeout for API call

  it('should find matching books using Claude', async () => {
    const results = await findMatchingBooks(
      'dark psychological thriller with a twist',
      mockCurrentUserProfile,
      mockBooksWithMetadata
    );

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchScore).toBeGreaterThan(0);
    expect(results[0].matchReasons).toBeDefined();
    expect(results[0].book).toBeDefined();
    expect(results[0].book.title).toBeDefined();
  }, 20000); // 20 second timeout for API call (two Claude calls)
});
