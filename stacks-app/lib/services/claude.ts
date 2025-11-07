import Anthropic from '@anthropic-ai/sdk';
import type { UserReadingProfile, Book, SearchResult } from '../mockData';
import { extractMovieReferences, extractThemesFromMovie } from './tmdb';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for test environment
});

const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Generic Claude API call
 */
export async function callClaude(prompt: string, maxTokens: number = 1024): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set in environment');
  }

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const textContent = message.content.find(block => block.type === 'text');
    return textContent ? textContent.text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * SECONDARY MODEL: Enrich query with TMDB data and user context
 */
export async function enrichQueryWithContext(
  rawQuery: string,
  userProfile: UserReadingProfile
): Promise<{
  enrichedQuery: string;
  userContextSummary: string;
  movieThemes: string[];
}> {
  // Extract movie references
  const movieRefs = extractMovieReferences(rawQuery);
  const movieThemes: string[] = [];

  // Fetch themes from TMDB for each movie reference
  for (const movieTitle of movieRefs) {
    const themes = await extractThemesFromMovie(movieTitle);
    movieThemes.push(...themes.themes, ...themes.tropes, ...themes.mood);
  }

  // Build user context summary
  const userContextSummary = `
User's favorite genres: ${userProfile.favoriteGenres.join(', ')}
User's favorite tropes: ${userProfile.favoriteTropes.join(', ')}
User's preferred mood: ${userProfile.preferredMood.join(', ')}
User dislikes: ${userProfile.dislikedTropes.join(', ')}
Recently rated highly: ${userProfile.readingHistory.filter(h => h.rating && h.rating >= 4).length} books
  `.trim();

  // Use Claude to enrich the query
  const prompt = `You are a book recommendation expert. A user searched for: "${rawQuery}"

${movieRefs.length > 0 ? `Movie references detected: ${movieRefs.join(', ')}
Themes from these movies: ${movieThemes.join(', ')}` : ''}

User's reading preferences:
${userContextSummary}

Your task: Expand this search query into a detailed description of what the user is looking for in their next book. Include:
1. Core themes and tropes they're seeking
2. Mood/atmosphere
3. Any specific elements mentioned
4. How their past preferences should influence recommendations

Return ONLY the enriched query description (2-3 sentences), nothing else.`;

  const enrichedQuery = await callClaude(prompt, 300);

  return {
    enrichedQuery,
    userContextSummary,
    movieThemes
  };
}

/**
 * PRIMARY MODEL: Find matching books using Claude's semantic understanding
 */
export async function findMatchingBooks(
  query: string,
  userProfile: UserReadingProfile,
  bookCatalog: Book[],
  limit: number = 10
): Promise<SearchResult[]> {
  // Step 1: Enrich query with context
  const enrichment = await enrichQueryWithContext(query, userProfile);

  // Step 2: Build book catalog for Claude
  const bookDescriptions = bookCatalog
    .map((book, index) => {
      const metadata = book.metadata;
      return `
[${index}] "${book.title}" by ${book.author} (${book.publishYear})
Genres: ${book.genres.join(', ')}
Tropes: ${metadata?.tropes?.join(', ') || book.tropes.join(', ')}
Themes: ${metadata?.themes?.join(', ') || 'N/A'}
Mood: ${metadata?.mood?.join(', ') || 'N/A'}
Synopsis: ${metadata?.synopsis || 'N/A'}
Pages: ${book.pageCount}
      `.trim();
    })
    .join('\n\n');

  // Step 3: Ask Claude to match books to enriched query
  const prompt = `You are a book recommendation expert. Find the best matching books for this user.

USER'S SEARCH: "${query}"

ENRICHED CONTEXT: ${enrichment.enrichedQuery}

USER'S READING PROFILE:
${enrichment.userContextSummary}

AVAILABLE BOOKS:
${bookDescriptions}

Your task: Recommend the top ${limit} books that best match the user's search and preferences. For each book:
1. Provide the book index number
2. Give a match score (0-100)
3. Explain 2-3 specific reasons why it matches (reference themes, tropes, or user preferences)

Format your response EXACTLY like this (one book per line):
[index]|score|reason 1; reason 2; reason 3

Example:
0|95|Matches your love of psychological thrillers; Features unreliable narrator you enjoy; Dark and suspenseful mood
3|87|Similar themes to Gone Girl; Complex protagonist; Twist ending

Return ONLY the book recommendations in this format, nothing else.`;

  const response = await callClaude(prompt, 2000);

  // Step 4: Parse Claude's response
  const lines = response.trim().split('\n').filter(line => line.trim());
  const results: SearchResult[] = [];

  for (const line of lines) {
    const match = line.match(/\[(\d+)\]\|(\d+)\|(.*)/);
    if (!match) continue;

    const [, indexStr, scoreStr, reasonsStr] = match;
    const bookIndex = parseInt(indexStr);
    const matchScore = parseInt(scoreStr);
    const matchReasons = reasonsStr.split(';').map(r => r.trim()).filter(r => r);

    if (bookIndex >= 0 && bookIndex < bookCatalog.length) {
      results.push({
        book: bookCatalog[bookIndex],
        matchScore,
        matchReasons,
        relevanceToQuery: matchScore // Same for now
      });
    }
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, limit);
}
