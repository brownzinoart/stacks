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
  
  if (movieRefs.length > 0) {
    console.log(`[TMDB] Movie references detected in query "${rawQuery}": ${movieRefs.join(', ')}`);
  }
  
  // Parallelize TMDB lookups
  const movieThemePromises = movieRefs.map(movieTitle => extractThemesFromMovie(movieTitle));
  const movieThemeResults = await Promise.all(movieThemePromises);
  
  // Flatten themes from all movies
  const movieThemes: string[] = [];
  movieThemeResults.forEach((themes, idx) => {
    if (themes.themes.length > 0 || themes.tropes.length > 0 || themes.mood.length > 0) {
      console.log(`[TMDB] Extracted themes for "${movieRefs[idx]}": ${[...themes.themes, ...themes.tropes, ...themes.mood].join(', ')}`);
    }
    movieThemes.push(...themes.themes, ...themes.tropes, ...themes.mood);
  });
  
  if (movieThemes.length > 0) {
    console.log(`[TMDB] Total movie themes extracted: ${movieThemes.length} (will enhance query understanding)`);
  }

  // Build user context summary (optimized)
  const highRatedCount = userProfile.readingHistory.filter(h => h.rating && h.rating >= 4).length;
  const userContextSummary = `Favorite genres: ${userProfile.favoriteGenres.join(', ')}
Favorite tropes: ${userProfile.favoriteTropes.join(', ')}
Preferred mood: ${userProfile.preferredMood.join(', ')}
Dislikes: ${userProfile.dislikedTropes.join(', ')}
Highly rated books: ${highRatedCount}`;

  // Optimized prompt (reduced tokens) - PRIORITIZE USER QUERY
  const prompt = `Book recommendation expert. User search: "${rawQuery}"

${movieRefs.length > 0 ? `Movie references detected: ${movieRefs.join(', ')}
Movie themes/tropes/mood: ${movieThemes.join(', ')}
Use these themes to understand what the user wants, but the original query "${rawQuery}" is PRIMARY.` : ''}

User preferences (SECONDARY context only - do not override query intent): ${userContextSummary}

Expand the USER'S QUERY "${rawQuery}" into what they seek (2-3 sentences). 
CRITICAL: Focus PRIMARILY on the QUERY'S themes, tropes, and mood. 
${movieRefs.length > 0 ? 'Use movie themes to enhance understanding, but the query intent is PRIMARY. ' : ''}
User preferences are ONLY for additional context - do not let them override the query.

Return ONLY the description.`;

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
  // Build context about movie themes if available
  const movieContext = enrichment.movieThemes.length > 0 
    ? `\nMOVIE THEMES DETECTED (use to understand query intent): ${enrichment.movieThemes.join(', ')}`
    : '';
  
  const prompt = `You are a book recommendation expert. Match books to the user's search query.

USER'S SEARCH QUERY: "${query}"
${movieContext}

AVAILABLE BOOKS:
${bookDescriptions}

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. PRIMARY FOCUS: Match books based SOLELY on the user's search query "${query}"
2. If movie themes are provided, use them ONLY to understand what the user wants from "${query}" - do not override the query
3. Look for books where genres, mood, themes, and tropes match the QUERY keywords and intent
4. User profile data is SECONDARY - only use it if the query is ambiguous, otherwise ignore it
5. The query "${query}" is the PRIMARY source of truth - everything must ladder up to it

Match scoring guidelines:
- For "cozy fantasy", prioritize books with "cozy", "whimsical", "heartwarming", "uplifting" moods
- For "dark", prioritize books with "dark", "suspenseful", "intense" moods
- For movie references, match the themes/tropes/mood of that movie type
- Score based on how well the book matches "${query}" specifically

Your task: Find the top ${limit} books that match "${query}". For each book:
1. Provide the book index number [0-${bookCatalog.length - 1}]
2. Give a match score (0-100) based on how well it matches "${query}"
3. Explain 2-3 reasons why it matches the query keywords and intent

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
