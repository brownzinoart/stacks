import { NextRequest, NextResponse } from 'next/server';
import { findMatchingBooks, callClaude } from '@/lib/services/claude';
import { mockCurrentUserProfile, mockBooksWithMetadata, getBooksReadByUser } from '@/lib/mockData';
import type { SearchResult, BookSearchMatch, NaturalLanguageSearchResult, Book } from '@/lib/mockData';

// Cache for expensive search operations
const searchCache = new Map<string, { results: SearchResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Normalize and validate query
 */
function normalizeQuery(query: string): { normalized: string; error?: string } {
  if (!query || typeof query !== 'string') {
    return { normalized: '', error: 'Query is required and must be a string' };
  }

  const normalized = query.trim().replace(/\s+/g, ' ');

  if (normalized.length < 3) {
    return { normalized, error: 'Query must be at least 3 characters long' };
  }

  if (normalized.length > 500) {
    return { normalized: normalized.slice(0, 500), error: 'Query is too long (max 500 characters)' };
  }

  if (!/[a-zA-Z0-9]/.test(normalized)) {
    return { normalized, error: 'Query must contain at least one letter or number' };
  }

  return { normalized };
}

/**
 * Categorize search results into atmosphere, characters, and plot using Claude
 */
async function categorizeResults(
  query: string,
  results: NaturalLanguageSearchResult[]
): Promise<SearchResult> {
  if (results.length === 0) {
    return {
      query,
      atmosphere: { tags: [], books: [] },
      characters: { tags: [], books: [] },
      plot: { tags: [], books: [] }
    };
  }

  // Build book list for Claude
  const bookList = results.map((r, idx) => 
    `[${idx}] "${r.book.title}" by ${r.book.author} - ${r.matchReasons.join('; ')}`
  ).join('\n');

  const prompt = `You are a book recommendation expert. Categorize these ${results.length} book recommendations into three categories: Atmosphere, Characters, and Plot.

USER'S SEARCH QUERY: "${query}"
PRIMARY FOCUS: All categorization must ladder up to what the user is seeking: "${query}"

BOOKS:
${bookList}

CRITICAL REQUIREMENTS:
1. Each book can ONLY appear in ONE category (no duplicates across categories)
2. You MUST select exactly 2 unique books per category (6 books total)
3. Each category must have different books - no book should appear in multiple categories
4. Categorize based on how each book relates to "${query}" - atmosphere, characters, or plot aspects that match the query

For each category, select the 2 books that best represent that aspect of "${query}":
- ATMOSPHERE: Books where the mood, setting, tone, or vibe matches "${query}"
- CHARACTERS: Books where the character types, dynamics, or personalities match "${query}"
- PLOT: Books where the story structure, themes, or narrative matches "${query}"

For each category:
- Select exactly 2 books that best match that category in relation to "${query}"
- Extract 2-3 descriptive tags that relate to "${query}" and that category
- Explain why each book matches that category aspect of "${query}"

Format your response EXACTLY as JSON:
{
  "atmosphere": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 0, "reasons": ["reason1", "reason2"]},
      {"index": 1, "reasons": ["reason1", "reason2"]}
    ]
  },
  "characters": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 2, "reasons": ["reason1", "reason2"]},
      {"index": 3, "reasons": ["reason1", "reason2"]}
    ]
  },
  "plot": {
    "tags": ["tag1", "tag2", "tag3"],
    "books": [
      {"index": 4, "reasons": ["reason1", "reason2"]},
      {"index": 5, "reasons": ["reason1", "reason2"]}
    ]
  }
}

CRITICAL: 
- Ensure indices 0, 1, 2, 3, 4, 5 are all different (no duplicates)
- You MUST return exactly 2 books per category (6 total)
- All selections must relate back to "${query}"

Return ONLY valid JSON, nothing else.`;

  try {
    const response = await callClaude(prompt, 2000, 15000);
    
    // Try to parse JSON response
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const categorized = JSON.parse(jsonMatch[0]);

    const categories = ['atmosphere', 'characters', 'plot'] as const;
    const usedIndices = new Set<number>();
    
    // Helper function to find next available book index
    const findNextAvailableIndex = (excludeIndices: Set<number>): number | null => {
      for (let i = 0; i < results.length; i++) {
        if (!excludeIndices.has(i)) {
          return i;
        }
      }
      return null;
    };

    // ============================================
    // PASS 1: Process Claude's suggestions and fix duplicates/invalid indices
    // ============================================
    const fixedCategories: Record<string, { tags: string[]; books: Array<{ index: number; reasons: string[] }> }> = {};
    
    categories.forEach(cat => {
      const categoryData = categorized[cat] || { tags: [], books: [] };
      const fixedBooks: Array<{ index: number; reasons: string[] }> = [];
      
      // Process up to 2 books per category from Claude's suggestions
      const booksToProcess = (categoryData.books || []).slice(0, 2);
      
      booksToProcess.forEach((book: { index: number; reasons?: string[] }) => {
        let bookIndex = book.index;
        
        // Validate index
        if (bookIndex < 0 || bookIndex >= results.length) {
          // Invalid index, find a replacement
          const replacementIndex = findNextAvailableIndex(usedIndices);
          if (replacementIndex !== null) {
            bookIndex = replacementIndex;
            console.log(`Replaced invalid book index ${book.index} with ${bookIndex} in category ${cat}`);
          } else {
            // No more books available, mark slot as needing a book (don't return early)
            return;
          }
        }
        
        // If duplicate, find a replacement
        if (usedIndices.has(bookIndex)) {
          const replacementIndex = findNextAvailableIndex(usedIndices);
          if (replacementIndex !== null) {
            bookIndex = replacementIndex;
            console.log(`Replaced duplicate book index ${book.index} with ${bookIndex} in category ${cat}`);
          } else {
            // No more books available, mark slot as needing a book (don't return early)
            return;
          }
        }
        
        // Add to used indices and fixed books
        if (bookIndex >= 0 && bookIndex < results.length) {
          usedIndices.add(bookIndex);
          fixedBooks.push({
            index: bookIndex,
            reasons: book.reasons || results[bookIndex].matchReasons || []
          });
        }
      });
      
      fixedCategories[cat] = {
        tags: categoryData.tags || [],
        books: fixedBooks
      };
    });

    // ============================================
    // PASS 2: Fill remaining slots to ensure 2 books per category
    // ============================================
    // Target: 2 books per category when we have 6+ books available
    const targetBooksPerCategory = results.length >= 6 ? 2 : Math.min(2, Math.floor(results.length / 3) || 1);
    
    // Fill each category up to target, prioritizing categories with fewer books
    let needsMoreBooks = true;
    while (needsMoreBooks) {
      needsMoreBooks = false;
      
      // Process categories in order, filling those that need more books
      categories.forEach(cat => {
        const currentBooks = fixedCategories[cat].books;
        
        // If this category needs more books, try to fill it
        if (currentBooks.length < targetBooksPerCategory) {
          const nextIndex = findNextAvailableIndex(usedIndices);
          if (nextIndex !== null) {
            usedIndices.add(nextIndex);
            currentBooks.push({
              index: nextIndex,
              reasons: results[nextIndex].matchReasons || []
            });
            needsMoreBooks = true; // Continue loop to check other categories
            console.log(`Filled slot in category ${cat} with book index ${nextIndex}`);
          }
        }
      });
      
      // Stop if all categories have reached their target or we've run out of books
      const allCategoriesFull = categories.every(cat => 
        fixedCategories[cat].books.length >= targetBooksPerCategory
      );
      if (allCategoriesFull || usedIndices.size >= results.length) {
        needsMoreBooks = false;
      }
    }

    // ============================================
    // VALIDATION: Log book distribution and warn if needed
    // ============================================
    const bookCounts = categories.map(cat => ({
      category: cat,
      count: fixedCategories[cat].books.length
    }));
    
    console.log(`Book distribution: ${bookCounts.map(b => `${b.category}=${b.count}`).join(', ')} (total results: ${results.length})`);
    
    // Warn if we couldn't provide 2 books per category when we should have
    if (results.length >= 6) {
      const categoriesWithLessThan2 = bookCounts.filter(b => b.count < 2);
      if (categoriesWithLessThan2.length > 0) {
        console.warn(
          `Warning: Could not provide 2 books per category. Categories with <2 books: ${categoriesWithLessThan2.map(b => b.category).join(', ')}. ` +
          `Available books: ${results.length}, Used: ${usedIndices.size}`
        );
      } else {
        console.log(`✓ Successfully provided 2 books per category (${results.length} books available)`);
      }
    } else {
      console.log(`Note: Only ${results.length} books available, cannot guarantee 2 per category`);
    }

    // Transform to SearchResult format
    const transformBooks = (
      categoryBooks: Array<{ index: number; reasons: string[] }>,
      categoryType: 'atmosphere' | 'characters' | 'plot'
    ) => {
      return categoryBooks
        .filter(item => item.index >= 0 && item.index < results.length)
        .slice(0, 2) // Ensure max 2 books
        .map(item => {
          const result = results[item.index];
          return {
            book: result.book,
            matchPercentage: result.matchScore,
            matchReasons: {
              [categoryType]: item.reasons
            }
          } as BookSearchMatch;
        });
    };

    // ============================================
    // FINAL VALIDATION: Ensure exactly 2 books per category with no duplicates
    // ============================================
    const finalUsedIndices = new Set<number>();
    const finalCategories: Record<string, Array<{ index: number; reasons: string[] }>> = {
      atmosphere: [],
      characters: [],
      plot: []
    };
    
    // Collect all books from fixed categories, ensuring no duplicates
    categories.forEach(cat => {
      const categoryBooks = fixedCategories[cat]?.books || [];
      categoryBooks.forEach(book => {
        if (!finalUsedIndices.has(book.index) && book.index >= 0 && book.index < results.length) {
          finalUsedIndices.add(book.index);
          finalCategories[cat].push(book);
        }
      });
    });
    
    // If we have 6+ books available, ensure exactly 2 per category
    if (results.length >= 6) {
      categories.forEach(cat => {
        while (finalCategories[cat].length < 2 && finalUsedIndices.size < results.length) {
          // Find next available book
          for (let i = 0; i < results.length; i++) {
            if (!finalUsedIndices.has(i)) {
              finalUsedIndices.add(i);
              finalCategories[cat].push({
                index: i,
                reasons: results[i].matchReasons || []
              });
              break;
            }
          }
        }
      });
    }
    
    // Final duplicate check - ensure no book appears in multiple categories
    const indexToCategories = new Map<number, string[]>();
    
    categories.forEach(cat => {
      finalCategories[cat].forEach(book => {
        const existing = indexToCategories.get(book.index) || [];
        existing.push(cat);
        indexToCategories.set(book.index, existing);
      });
    });
    
    // Find and remove duplicates
    const duplicatesFound = Array.from(indexToCategories.entries()).filter(([_, cats]) => cats.length > 1);
    
    if (duplicatesFound.length > 0) {
      console.warn(`Duplicate books detected across categories: ${duplicatesFound.length} books appear in multiple categories`);
      duplicatesFound.forEach(([index, cats]) => {
        // Keep in first category, remove from others
        for (let i = 1; i < cats.length; i++) {
          const catToClean = cats[i];
          finalCategories[catToClean] = finalCategories[catToClean].filter(b => b.index !== index);
          finalUsedIndices.delete(index); // Remove from used so we can reuse it
        }
      });
      
      // Refill categories that lost books
      if (results.length >= 6) {
        categories.forEach(cat => {
          while (finalCategories[cat].length < 2 && finalUsedIndices.size < results.length) {
            for (let i = 0; i < results.length; i++) {
              if (!finalUsedIndices.has(i)) {
                finalUsedIndices.add(i);
                finalCategories[cat].push({
                  index: i,
                  reasons: results[i].matchReasons || []
                });
                break;
              }
            }
          }
        });
      }
    }
    
    // Transform to SearchResult format
    const finalResult = {
      query,
      atmosphere: {
        tags: fixedCategories.atmosphere?.tags || [],
        books: transformBooks(finalCategories.atmosphere.slice(0, 2), 'atmosphere')
      },
      characters: {
        tags: fixedCategories.characters?.tags || [],
        books: transformBooks(finalCategories.characters.slice(0, 2), 'characters')
      },
      plot: {
        tags: fixedCategories.plot?.tags || [],
        books: transformBooks(finalCategories.plot.slice(0, 2), 'plot')
      }
    };
    
    // Log final book counts for debugging
    const finalCounts = {
      atmosphere: finalResult.atmosphere.books.length,
      characters: finalResult.characters.books.length,
      plot: finalResult.plot.books.length
    };
    console.log(`Final book counts: atmosphere=${finalCounts.atmosphere}, characters=${finalCounts.characters}, plot=${finalCounts.plot}`);
    
    // Final validation check
    if (results.length >= 6) {
      const allUnique = new Set<string>();
      finalResult.atmosphere.books.forEach(b => allUnique.add(b.book.id));
      finalResult.characters.books.forEach(b => allUnique.add(b.book.id));
      finalResult.plot.books.forEach(b => allUnique.add(b.book.id));
      
      if (allUnique.size !== 6) {
        console.error(`ERROR: Found ${6 - allUnique.size} duplicate books in final result!`);
      } else if (finalCounts.atmosphere === 2 && finalCounts.characters === 2 && finalCounts.plot === 2) {
        console.log('✓ Validation passed: Exactly 2 books per category, no duplicates');
      } else {
        console.warn(`WARNING: Expected 2 books per category, got: atmosphere=${finalCounts.atmosphere}, characters=${finalCounts.characters}, plot=${finalCounts.plot}`);
      }
    }
    
    return finalResult;
  } catch (error) {
    console.error('Categorization failed, using fallback:', error);
    
    // Fallback: distribute results evenly across categories with no duplicates
    // Try to ensure 2 books per category when possible
    const availableBooks = results.slice(0, Math.min(results.length, 6));
    
    // Simple distribution: give 2 books to each category if we have 6+ books
    // Otherwise distribute what we have evenly
    let idx = 0;
    const atmosphereBooks: NaturalLanguageSearchResult[] = [];
    const charactersBooks: NaturalLanguageSearchResult[] = [];
    const plotBooks: NaturalLanguageSearchResult[] = [];
    const usedBookIds = new Set<string>();
    
    // Distribute books round-robin style, ensuring up to 2 per category and no duplicates
    while (idx < availableBooks.length) {
      if (atmosphereBooks.length < 2 && idx < availableBooks.length) {
        const book = availableBooks[idx];
        if (!usedBookIds.has(book.book.id)) {
          usedBookIds.add(book.book.id);
          atmosphereBooks.push(book);
        }
        idx++;
      }
      if (charactersBooks.length < 2 && idx < availableBooks.length) {
        const book = availableBooks[idx];
        if (!usedBookIds.has(book.book.id)) {
          usedBookIds.add(book.book.id);
          charactersBooks.push(book);
        }
        idx++;
      }
      if (plotBooks.length < 2 && idx < availableBooks.length) {
        const book = availableBooks[idx];
        if (!usedBookIds.has(book.book.id)) {
          usedBookIds.add(book.book.id);
          plotBooks.push(book);
        }
        idx++;
      }
      // If all categories have 2 books, stop
      if (atmosphereBooks.length >= 2 && charactersBooks.length >= 2 && plotBooks.length >= 2) {
        break;
      }
      // If we've gone through all books and still need more, break
      if (idx >= availableBooks.length) {
        break;
      }
    }
    
    // Final check: ensure exactly 2 per category if we have enough books
    if (availableBooks.length >= 6) {
      // If any category has less than 2, try to fill from remaining books
      const remainingBooks = availableBooks.filter(b => !usedBookIds.has(b.book.id));
      let remainingIdx = 0;
      
      while (remainingIdx < remainingBooks.length) {
        if (atmosphereBooks.length < 2) {
          const book = remainingBooks[remainingIdx++];
          if (book && !usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            atmosphereBooks.push(book);
          }
        } else if (charactersBooks.length < 2) {
          const book = remainingBooks[remainingIdx++];
          if (book && !usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            charactersBooks.push(book);
          }
        } else if (plotBooks.length < 2) {
          const book = remainingBooks[remainingIdx++];
          if (book && !usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            plotBooks.push(book);
          }
        } else {
          break;
        }
      }
    }

    const extractTags = (books: NaturalLanguageSearchResult[]) => {
      const allReasons = books.flatMap(r => r.matchReasons);
      const uniqueWords = new Set<string>();
      allReasons.forEach(reason => {
        reason.toLowerCase().split(/\s+/).forEach(word => {
          if (word.length > 4) uniqueWords.add(word);
        });
      });
      return Array.from(uniqueWords).slice(0, 3);
    };

    const fallbackResult = {
      query,
      atmosphere: {
        tags: extractTags(atmosphereBooks),
        books: atmosphereBooks.slice(0, 2).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { atmosphere: r.matchReasons }
        }))
      },
      characters: {
        tags: extractTags(charactersBooks),
        books: charactersBooks.slice(0, 2).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { characters: r.matchReasons }
        }))
      },
      plot: {
        tags: extractTags(plotBooks),
        books: plotBooks.slice(0, 2).map(r => ({
          book: r.book,
          matchPercentage: r.matchScore,
          matchReasons: { plot: r.matchReasons }
        }))
      }
    };
    
    // Log fallback distribution
    console.log(
      `Fallback distribution: atmosphere=${fallbackResult.atmosphere.books.length}, ` +
      `characters=${fallbackResult.characters.books.length}, plot=${fallbackResult.plot.books.length} ` +
      `(total available: ${availableBooks.length})`
    );
    
    return fallbackResult;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId } = body;

    // Validate and normalize query
    const { normalized, error: validationError } = normalizeQuery(query);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${userId || 'anonymous'}:${normalized}`;
    const cached = searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        ...cached.results,
        cached: true
      });
    }

    // Get user profile
    const userProfile = mockCurrentUserProfile;
    const readBookIds = getBooksReadByUser(userId || 'user-1');
    const unreadBooks = mockBooksWithMetadata.filter(
      book => !readBookIds.includes(book.id)
    );

    if (unreadBooks.length === 0) {
      return NextResponse.json({
        success: true,
        query: normalized,
        atmosphere: { tags: [], books: [] },
        characters: { tags: [], books: [] },
        plot: { tags: [], books: [] },
        message: 'All matching books have already been read'
      });
    }

    // Get search results from natural language API
    // Request at least 6 books to ensure 2 unique books per category
    let searchResults: NaturalLanguageSearchResult[] = [];
    let usedFallback = false;
    
    try {
      // Request more books than needed to ensure we have enough unique options
      searchResults = await findMatchingBooks(normalized, userProfile, unreadBooks, 8);
      
      // Ensure we have at least 6 books for categorization
      if (searchResults.length < 6) {
        console.warn(`Only found ${searchResults.length} books, need at least 6 for categorization`);
      }
    } catch (error) {
      console.error('Claude search failed, using fallback:', error);
      
      // Use keyword-based fallback
      const fallbackKeywordSearch = (
        query: string,
        books: Book[],
        limit: number = 10
      ): NaturalLanguageSearchResult[] => {
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        const scored = books.map(book => {
          let score = 0;
          const reasons: string[] = [];

          // Check title match
          const titleLower = book.title.toLowerCase();
          if (titleLower.includes(queryLower)) {
            score += 50;
            reasons.push(`Title matches "${query}"`);
          } else {
            queryWords.forEach(word => {
              if (titleLower.includes(word)) {
                score += 10;
              }
            });
          }

          // Check author match
          const authorLower = book.author.toLowerCase();
          if (authorLower.includes(queryLower)) {
            score += 30;
            reasons.push(`Author matches "${query}"`);
          } else {
            queryWords.forEach(word => {
              if (authorLower.includes(word)) {
                score += 8;
              }
            });
          }

          // Check genres
          book.genres.forEach(genre => {
            if (genre.toLowerCase().includes(queryLower)) {
              score += 20;
              reasons.push(`Genre matches: ${genre}`);
            }
          });

          // Check tropes
          const tropes = book.metadata?.tropes || book.tropes || [];
          tropes.forEach(trope => {
            if (trope.toLowerCase().includes(queryLower)) {
              score += 15;
              reasons.push(`Trope matches: ${trope}`);
            }
          });

          // Check mood
          const mood = book.metadata?.mood || [];
          mood.forEach(m => {
            if (m.toLowerCase().includes(queryLower)) {
              score += 25;
              reasons.push(`Mood matches: ${m}`);
            }
          });

          return {
            book,
            matchScore: Math.min(score, 85), // Cap at 85 for fallback
            matchReasons: reasons.length > 0 ? reasons : ['Partial match based on keywords'],
            relevanceToQuery: Math.min(score, 85)
          };
        });

        return scored
          .filter(r => r.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, limit);
      };
      
      searchResults = fallbackKeywordSearch(normalized, unreadBooks, 8);
      usedFallback = true;
      
      if (searchResults.length === 0) {
        return NextResponse.json({
          success: true,
          query: normalized,
          atmosphere: { tags: [], books: [] },
          characters: { tags: [], books: [] },
          plot: { tags: [], books: [] },
          message: 'No books found matching your search'
        });
      }
    }

    // Categorize results (with fallback if Claude fails)
    let categorizedResults: SearchResult;
    try {
      categorizedResults = await categorizeResults(normalized, searchResults);
    } catch (error) {
      console.error('Categorization failed, using simple distribution:', error);
      
      // Simple fallback: distribute results evenly across categories with no duplicates
      const availableBooks = searchResults.slice(0, Math.min(searchResults.length, 6));
      
      let idx = 0;
      const atmosphereBooks: NaturalLanguageSearchResult[] = [];
      const charactersBooks: NaturalLanguageSearchResult[] = [];
      const plotBooks: NaturalLanguageSearchResult[] = [];
      const usedBookIds = new Set<string>();
      
      // Distribute books round-robin style, ensuring up to 2 per category and no duplicates
      while (idx < availableBooks.length) {
        if (atmosphereBooks.length < 2 && idx < availableBooks.length) {
          const book = availableBooks[idx];
          if (!usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            atmosphereBooks.push(book);
          }
          idx++;
        }
        if (charactersBooks.length < 2 && idx < availableBooks.length) {
          const book = availableBooks[idx];
          if (!usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            charactersBooks.push(book);
          }
          idx++;
        }
        if (plotBooks.length < 2 && idx < availableBooks.length) {
          const book = availableBooks[idx];
          if (!usedBookIds.has(book.book.id)) {
            usedBookIds.add(book.book.id);
            plotBooks.push(book);
          }
          idx++;
        }
        if (atmosphereBooks.length >= 2 && charactersBooks.length >= 2 && plotBooks.length >= 2) {
          break;
        }
        if (idx >= availableBooks.length) {
          break;
        }
      }
      
      // Final check: ensure exactly 2 per category if we have enough books
      if (availableBooks.length >= 6) {
        const remainingBooks = availableBooks.filter(b => !usedBookIds.has(b.book.id));
        let remainingIdx = 0;
        
        while (remainingIdx < remainingBooks.length) {
          if (atmosphereBooks.length < 2) {
            const book = remainingBooks[remainingIdx++];
            if (book && !usedBookIds.has(book.book.id)) {
              usedBookIds.add(book.book.id);
              atmosphereBooks.push(book);
            }
          } else if (charactersBooks.length < 2) {
            const book = remainingBooks[remainingIdx++];
            if (book && !usedBookIds.has(book.book.id)) {
              usedBookIds.add(book.book.id);
              charactersBooks.push(book);
            }
          } else if (plotBooks.length < 2) {
            const book = remainingBooks[remainingIdx++];
            if (book && !usedBookIds.has(book.book.id)) {
              usedBookIds.add(book.book.id);
              plotBooks.push(book);
            }
          } else {
            break;
          }
        }
      }

      const extractTags = (books: NaturalLanguageSearchResult[]) => {
        const allReasons = books.flatMap(r => r.matchReasons);
        const uniqueWords = new Set<string>();
        allReasons.forEach(reason => {
          reason.toLowerCase().split(/\s+/).forEach(word => {
            if (word.length > 4) uniqueWords.add(word);
          });
        });
        return Array.from(uniqueWords).slice(0, 3);
      };

      categorizedResults = {
        query: normalized,
        atmosphere: {
          tags: extractTags(atmosphereBooks),
          books: atmosphereBooks.slice(0, 2).map(r => ({
            book: r.book,
            matchPercentage: r.matchScore,
            matchReasons: { atmosphere: r.matchReasons }
          }))
        },
        characters: {
          tags: extractTags(charactersBooks),
          books: charactersBooks.slice(0, 2).map(r => ({
            book: r.book,
            matchPercentage: r.matchScore,
            matchReasons: { characters: r.matchReasons }
          }))
        },
        plot: {
          tags: extractTags(plotBooks),
          books: plotBooks.slice(0, 2).map(r => ({
            book: r.book,
            matchPercentage: r.matchScore,
            matchReasons: { plot: r.matchReasons }
          }))
        }
      };
    }

    // Cache results
    searchCache.set(cacheKey, {
      results: categorizedResults,
      timestamp: Date.now()
    });

    // Cleanup old cache entries
    if (searchCache.size > 100) {
      const oldestKey = searchCache.keys().next().value;
      if (oldestKey) {
        searchCache.delete(oldestKey);
      }
    }

    return NextResponse.json({
      success: true,
      ...categorizedResults
    });

  } catch (error) {
    console.error('Categorized search API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

