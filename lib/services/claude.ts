import Anthropic from '@anthropic-ai/sdk';
import type { UserReadingProfile, Book, NaturalLanguageSearchResult } from '../mockData';
import { extractMovieReferences, extractThemesFromMovie } from './tmdb';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for test environment
  timeout: 10000, // 10 second timeout
});

const MODEL = 'claude-3-5-haiku-20241022';

/**
 * Generic Claude API call with timeout
 */
export async function callClaude(prompt: string, maxTokens: number = 1024, timeoutMs: number = 10000): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set in environment');
  }

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });

    // Race between API call and timeout
    const apiPromise = anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const message = await Promise.race([apiPromise, timeoutPromise]);
    const textContent = message.content.find(block => block.type === 'text');
    return textContent ? textContent.text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * SECONDARY MODEL: Enrich query with TMDB data and user context
 * Optimized with parallelization
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
  
  // Parallelize TMDB lookups
  const movieThemePromises = movieRefs.map(movieTitle => extractThemesFromMovie(movieTitle));
  const movieThemeResults = await Promise.all(movieThemePromises);
  
  // Flatten themes from all movies
  const movieThemes: string[] = [];
  movieThemeResults.forEach(themes => {
    movieThemes.push(...themes.themes, ...themes.tropes, ...themes.mood);
  });

  // Build user context summary (optimized)
  const highRatedCount = userProfile.readingHistory.filter(h => h.rating && h.rating >= 4).length;
  const userContextSummary = `Favorite genres: ${userProfile.favoriteGenres.join(', ')}
Favorite tropes: ${userProfile.favoriteTropes.join(', ')}
Preferred mood: ${userProfile.preferredMood.join(', ')}
Dislikes: ${userProfile.dislikedTropes.join(', ')}
Highly rated books: ${highRatedCount}`;

  // Optimized prompt (reduced tokens)
  const prompt = `Book recommendation expert. User search: "${rawQuery}"

${movieRefs.length > 0 ? `Movie refs: ${movieRefs.join(', ')}
Themes: ${movieThemes.join(', ')}` : ''}

User preferences (for context only): ${userContextSummary}

Expand query into what user seeks (2-3 sentences). Focus on the QUERY'S themes, tropes, and mood. User preferences are secondary context. Return ONLY the description.`;

  const enrichedQuery = await callClaude(prompt, 300, 8000);

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
): Promise<NaturalLanguageSearchResult[]> {
  // Step 1: Enrich query with context (but don't let it override the query intent)
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

  // Step 3: Ask Claude to match books to query
  const prompt = `You are a book recommendation expert. Match books to the user's search query.

USER'S SEARCH QUERY: "${query}"

AVAILABLE BOOKS:
${bookDescriptions}

CRITICAL INSTRUCTIONS:
- Match books based SOLELY on the search query "${query}"
- Look for books where genres, mood, themes, and tropes match the query keywords
- For "cozy fantasy", prioritize books with "cozy", "whimsical", "heartwarming", "uplifting" moods
- For "dark", prioritize books with "dark", "suspenseful", "intense" moods
- Ignore any other context - ONLY match the query

Your task: Find the top ${limit} books that match "${query}". For each book:
1. Provide the book index number [0-${bookCatalog.length - 1}]
2. Give a match score (0-100) based on how well it matches the query
3. Explain 2-3 reasons why it matches the query keywords

Format EXACTLY like this (one book per line):
[index]|score|reason 1; reason 2; reason 3

Example for "cozy fantasy":
5|98|Cozy fantasy genre; Heartwarming and whimsical mood; Found family trope
9|95|Cozy mood and uplifting themes; Fantasy setting; Wholesome atmosphere

Return ONLY the recommendations, nothing else.`;

  const response = await callClaude(prompt, 2000);

  // Step 4: Parse Claude's response with fallback strategies
  const results = parseClaudeResponse(response, bookCatalog, limit);

  if (results.length === 0) {
    console.warn('Claude returned no parseable results, response:', response.substring(0, 200));
  }

  return results;
}

/**
 * Parse Claude response with multiple fallback strategies
 */
function parseClaudeResponse(
  response: string,
  bookCatalog: Book[],
  limit: number
): NaturalLanguageSearchResult[] {
  const lines = response.trim().split('\n').filter(line => line.trim());
  const results: NaturalLanguageSearchResult[] = [];
  const seenIndices = new Set<number>();

  // Strategy 1: Primary format [index]|score|reason 1; reason 2
  for (const line of lines) {
    // Try primary format
    let match = line.match(/\[(\d+)\]\s*[|]\s*(\d+)\s*[|]\s*(.*)/);
    
    // Try alternative formats
    if (!match) {
      match = line.match(/\[(\d+)\]\s*-\s*(\d+)\s*-\s*(.*)/);
    }
    if (!match) {
      match = line.match(/(\d+)\s*[|]\s*(\d+)\s*[|]\s*(.*)/);
    }
    if (!match) {
      match = line.match(/Book\s*(\d+)[:]\s*(\d+)%[:\s]*(.*)/i);
    }

    if (!match) continue;

    const [, indexStr, scoreStr, reasonsStr] = match;
    const bookIndex = parseInt(indexStr, 10);
    const matchScore = Math.min(Math.max(parseInt(scoreStr, 10) || 0, 0), 100);
    
    // Validate index
    if (isNaN(bookIndex) || bookIndex < 0 || bookIndex >= bookCatalog.length) {
      continue;
    }

    // Skip duplicates
    if (seenIndices.has(bookIndex)) {
      continue;
    }

    seenIndices.add(bookIndex);

    // Parse reasons (handle various separators)
    const matchReasons = reasonsStr
      .split(/[;|]|and/)
      .map(r => r.trim())
      .filter(r => r.length > 0);

    // Ensure at least one reason
    if (matchReasons.length === 0) {
      matchReasons.push('Matches your search criteria');
    }

    results.push({
      book: bookCatalog[bookIndex],
      matchScore,
      matchReasons: matchReasons.slice(0, 3), // Limit to 3 reasons
      relevanceToQuery: matchScore
    });
  }

  // Strategy 2: If no results, try to extract book indices from response
  if (results.length === 0) {
    const indexMatches = response.matchAll(/\[(\d+)\]/g);
    for (const match of indexMatches) {
      const bookIndex = parseInt(match[1], 10);
      if (!isNaN(bookIndex) && bookIndex >= 0 && bookIndex < bookCatalog.length && !seenIndices.has(bookIndex)) {
        seenIndices.add(bookIndex);
        results.push({
          book: bookCatalog[bookIndex],
          matchScore: 70, // Default score
          matchReasons: ['Mentioned in search results'],
          relevanceToQuery: 70
        });
      }
    }
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, limit);
}
