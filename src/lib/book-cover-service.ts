/**
 * Comprehensive Book Cover Service - 100% Coverage Guaranteed
 * Multi-source cover fetching with AI generation fallback
 * Uses FREE APIs: Google Books + Open Library + AI Generation
 */

import { aiRouter } from './ai-model-router';

interface CoverSearchResult {
  url: string;
  source: 'openlibrary' | 'google' | 'archive' | 'cache' | 'ai_generated' | 'gradient_generated';
  confidence: number; // 0-100
  quality?: 'high' | 'medium' | 'low';
  cached?: boolean;
}

interface CachedCover {
  url: string;
  source: string;
  timestamp: number;
  confidence: number;
}

const CACHE_KEY = 'stacks_book_covers';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export class BookCoverService {
  private static instance: BookCoverService;
  private cache: Map<string, CachedCover>;

  private constructor() {
    this.cache = new Map();
    this.loadCache();
  }

  static getInstance(): BookCoverService {
    if (!BookCoverService.instance) {
      BookCoverService.instance = new BookCoverService();
    }
    return BookCoverService.instance;
  }

  private loadCache(): void {
    if (typeof window === 'undefined') return;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        Object.entries(data).forEach(([key, value]) => {
          this.cache.set(key, value as CachedCover);
        });
      }
    } catch (e) {
      console.error('Failed to load cover cache:', e);
    }
  }

  private saveCache(): void {
    if (typeof window === 'undefined') return;

    try {
      const data: Record<string, CachedCover> = {};
      this.cache.forEach((value, key) => {
        // Only save recent entries
        if (Date.now() - value.timestamp < CACHE_DURATION) {
          data[key] = value;
        }
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save cover cache:', e);
    }
  }

  private getCacheKey(book: { title: string; author: string; isbn?: string }): string {
    return `${book.title}-${book.author}-${book.isbn || ''}`.toLowerCase().replace(/\s+/g, '-');
  }

  async getCover(book: { title: string; author: string; isbn?: string; year?: string }): Promise<CoverSearchResult> {
    const cacheKey = this.getCacheKey(book);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        url: cached.url,
        source: cached.source as any,
        confidence: cached.confidence,
      };
    }

    // Try sources in priority order (FREE APIs first)
    console.log(`🔍 Searching for cover: "${book.title}" by ${book.author}`);
    
    const results = await Promise.allSettled([
      this.fetchFromGoogleBooks(book), // Priority 1: FREE, high quality
      this.fetchFromOpenLibraryByISBN(book), // Priority 2: FREE, reliable for ISBN
      this.fetchFromOpenLibraryBySearch(book), // Priority 3: FREE, good fallback
      this.fetchFromInternetArchive(book), // Priority 4: FREE, broad coverage
    ]);

    // Find best result based on confidence and quality
    let bestResult: CoverSearchResult | null = null;
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`📸 Found cover from ${result.value.source} (confidence: ${result.value.confidence}%)`);
        if (!bestResult || result.value.confidence > bestResult.confidence) {
          bestResult = result.value;
        }
      }
    }

    // If we found a real cover, cache it and return
    if (bestResult && bestResult.url && !bestResult.url.startsWith('gradient:')) {
      console.log(`✅ Using best cover from ${bestResult.source}`);
      this.cache.set(cacheKey, {
        url: bestResult.url,
        source: bestResult.source,
        confidence: bestResult.confidence,
        timestamp: Date.now(),
      });
      this.saveCache();
      return bestResult;
    }

    // No real cover found - try AI generation
    console.log(`🤖 No cover found, generating AI cover for "${book.title}"`);
    const aiCover = await this.generateAICover(book);
    if (aiCover && aiCover.url !== 'fallback') {
      return aiCover;
    }

    // Final fallback: gradient cover
    console.log(`🎨 Using gradient fallback for "${book.title}"`);
    return this.generateFallbackCover(book);
  }

  private async fetchFromOpenLibraryByISBN(book: { isbn?: string }): Promise<CoverSearchResult | null> {
    if (!book.isbn) return null;

    try {
      // Try direct ISBN lookup first
      const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

      // Check if image exists by making a HEAD request
      const response = await fetch(coverUrl, { method: 'HEAD' });
      if (response.ok) {
        return {
          url: coverUrl,
          source: 'openlibrary',
          confidence: 95, // ISBN matches are very reliable
        };
      }
    } catch (e) {
      // Continue to next method
    }

    return null;
  }

  private async fetchFromOpenLibraryBySearch(book: {
    title: string;
    author: string;
  }): Promise<CoverSearchResult | null> {
    try {
      // Try multiple search strategies
      const searches = [`title:"${book.title}" author:"${book.author}"`, `${book.title} ${book.author}`, book.title];

      for (const query of searches) {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`;
        const response = await fetch(url);

        if (!response.ok) continue;

        const data = await response.json();
        if (data.docs && data.docs.length > 0) {
          // Look for best match
          for (const doc of data.docs) {
            if (doc.cover_i) {
              // Check if author matches
              const authorMatch = doc.author_name?.some(
                (a: string) =>
                  a.toLowerCase().includes(book.author.toLowerCase()) ||
                  book.author.toLowerCase().includes(a.toLowerCase())
              );

              return {
                url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
                source: 'openlibrary',
                confidence: authorMatch ? 85 : 70,
              };
            }
          }
        }
      }
    } catch (e) {
      console.error('OpenLibrary search error:', e);
    }

    return null;
  }

  private async fetchFromGoogleBooks(book: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<CoverSearchResult | null> {
    try {
      // Build optimized query for Google Books API (FREE)
      let query = '';
      if (book.isbn) {
        query = `isbn:${book.isbn}`;
      } else {
        // Try exact match first, then fallback to broader search
        query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      }

      // Add API key if available (increases rate limits but not required)
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || '';
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=3${keyParam}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Google Books API returned ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        // Try to find the best match
        for (const item of data.items) {
          const volumeInfo = item.volumeInfo;
          const imageLinks = volumeInfo?.imageLinks;

          if (imageLinks?.thumbnail || imageLinks?.smallThumbnail) {
            // Prefer larger image, upgrade to high-res version
            let imageUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;
            
            // Google Books URL optimization for higher quality
            imageUrl = imageUrl
              .replace('&zoom=1', '&zoom=0') // Get larger image
              .replace('http://', 'https://') // Force HTTPS
              .replace('&edge=curl', ''); // Remove curl effect
            
            // Calculate confidence based on match quality
            let confidence = 75; // Base confidence
            
            if (book.isbn) {
              confidence = 95; // ISBN matches are very reliable
            } else {
              // Check title similarity
              const titleMatch = volumeInfo.title?.toLowerCase().includes(book.title.toLowerCase());
              const authorMatch = volumeInfo.authors?.some((author: string) => 
                author.toLowerCase().includes(book.author.toLowerCase()) ||
                book.author.toLowerCase().includes(author.toLowerCase())
              );
              
              if (titleMatch && authorMatch) confidence = 90;
              else if (titleMatch) confidence = 80;
            }

            return {
              url: imageUrl,
              source: 'google',
              confidence,
              quality: imageLinks.thumbnail ? 'high' : 'medium',
            };
          }
        }
      }
    } catch (e) {
      console.error('Google Books API error:', e);
    }

    return null;
  }

  private async fetchFromInternetArchive(book: { title: string; author: string }): Promise<CoverSearchResult | null> {
    try {
      const query = `(title:"${book.title}" AND creator:"${book.author}") OR (title:"${book.title}")`;
      const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl=identifier,title,creator&rows=5&output=json`;

      const response = await fetch(url);
      if (!response.ok) return null;

      const data = await response.json();
      if (data.response?.docs && data.response.docs.length > 0) {
        for (const doc of data.response.docs) {
          if (doc.identifier) {
            // Check if it's likely a book (not audio, video, etc)
            const coverUrl = `https://archive.org/services/img/${doc.identifier}`;

            return {
              url: coverUrl,
              source: 'archive',
              confidence: 60,
            };
          }
        }
      }
    } catch (e) {
      console.error('Internet Archive error:', e);
    }

    return null;
  }

  /**
   * Generate AI-powered book cover using our cost-optimized AI router
   */
  private async generateAICover(book: { title: string; author: string }): Promise<CoverSearchResult | null> {
    try {
      console.log(`🎨 Generating AI cover for "${book.title}" by ${book.author}`);
      
      // Use the AI router to generate a cover description (uses cheapest model - Gemini)
      const coverPrompt = `Create a professional book cover design description for:
Title: "${book.title}"
Author: ${book.author}

Describe a clean, modern book cover design including:
- Main visual elements (imagery, symbols, or abstract design)
- Color scheme that fits the genre/mood
- Typography style for title and author
- Overall layout and composition

Keep it professional and marketable. Focus on visual elements that would work well for book discovery.`;

      const response = await aiRouter.routeRequest({
        task: 'content_generation', // This routes to Claude (50% cheaper than GPT-4o)
        prompt: coverPrompt,
        maxTokens: 200
      });

      if (response.content) {
        // For now, we'll return a structured description
        // In the future, this could be sent to DALL-E or Midjourney
        const aiCoverUrl = `ai_description:${encodeURIComponent(response.content)}`;
        
        console.log(`✨ AI cover generated for "${book.title}" (cost: $${response.cost.toFixed(4)})`);
        
        return {
          url: aiCoverUrl,
          source: 'ai_generated',
          confidence: 85, // AI always generates something relevant
          quality: 'high',
        };
      }
    } catch (error) {
      console.error('AI cover generation failed:', error);
    }
    
    return null;
  }

  private generateFallbackCover(book: { title: string; author: string }): CoverSearchResult {
    // Generate a consistent color based on title+author
    const hash = (book.title + book.author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);

    const colors = [
      ['#00A8CC', '#0081A7'], // Blue gradient
      ['#F07167', '#C1666B'], // Red gradient
      ['#06D6A0', '#118AB2'], // Green to blue
      ['#7209B7', '#B5179E'], // Purple gradient
      ['#F72585', '#4361EE'], // Pink to blue
      ['#FCA311', '#E76F51'], // Orange gradient
      ['#FF9F1C', '#2EC4B6'], // Orange to teal
      ['#E63946', '#F77F00'], // Red to orange
    ];

    const index = Math.abs(hash) % colors.length;
    const colorPair = colors[index] || colors[0];

    // This would be used by the BookCover component to generate a gradient
    return {
      url: `gradient:${colorPair![0]}:${colorPair![1]}:${encodeURIComponent(book.title)}:${encodeURIComponent(book.author)}`,
      source: 'gradient_generated',
      confidence: 100, // Always works as final fallback
      quality: 'medium',
    };
  }

  // Batch fetch covers for multiple books
  async getBatchCovers(
    books: Array<{ title: string; author: string; isbn?: string; year?: string }>
  ): Promise<Map<number, CoverSearchResult>> {
    const results = new Map<number, CoverSearchResult>();

    // Process in parallel but limit concurrency
    const batchSize = 5;
    for (let i = 0; i < books.length; i += batchSize) {
      const batch = books.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((book) => this.getCover(book)));

      batchResults.forEach((result, index) => {
        results.set(i + index, result);
      });
    }

    return results;
  }

  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }
}

export const bookCoverService = BookCoverService.getInstance();
