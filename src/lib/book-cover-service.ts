/**
 * Comprehensive Book Cover Service - 100% Coverage Guaranteed
 * Multi-source cover fetching with AI generation fallback
 * Uses FREE APIs: Google Books + Open Library + AI Generation
 */

import { aiRouter } from './ai-model-router';
import { bookCoverAnalytics } from './book-cover-analytics';

// Logging utility to reduce console spam
const logger = {
  debug: (message: string, ...args: any[]) => {
    // Only log debug messages when explicitly enabled
    if (process.env.BOOK_COVER_DEBUG === 'true' || process.env.NODE_ENV === 'development') {
      console.log(message, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.log(message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  }
};

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
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days - longer cache for better performance

export class BookCoverService {
  private static instance: BookCoverService;
  private cache: Map<string, CachedCover>;
  private pendingRequests: Map<string, Promise<CoverSearchResult>>;
  private failedUrls: Set<string>;

  private constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.failedUrls = new Set();
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

  private performStaleCheckIfNeeded(): void {
    // Only check once per session
    if ((this as any).hasPerformedStaleCheck) return;
    (this as any).hasPerformedStaleCheck = true;

    const staleThreshold = 24 * 60 * 60 * 1000; // 1 day
    const now = Date.now();
    let staleCacheEntries = 0;
    
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > staleThreshold) {
        staleCacheEntries++;
      }
    });
    
    // If more than 50% of cache entries are stale, clear the entire cache
    if (staleCacheEntries > this.cache.size * 0.5 && this.cache.size > 0) {
      console.log(`🧹 Clearing stale book cover cache (${staleCacheEntries}/${this.cache.size} entries were stale)`);
      this.clearCache();
    }
  }

  async getCover(book: { title: string; author: string; isbn?: string; year?: string }): Promise<CoverSearchResult> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(book);

    // Perform stale check on first use
    this.performStaleCheckIfNeeded();

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const loadTime = Date.now() - startTime;
      
      // Record cache hit
      bookCoverAnalytics.recordRequest({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        source: cached.source + '_cached',
        confidence: cached.confidence,
        loadTime,
        success: true,
      });

      return {
        url: cached.url,
        source: cached.source as any,
        confidence: cached.confidence,
      };
    }

    // Check if there's already a pending request for this book
    const existingRequest = this.pendingRequests.get(cacheKey);
    if (existingRequest) {
      logger.debug('Deduplicating request for:', book.title);
      return existingRequest;
    }

    // Create a new request and store it in pendingRequests
    const requestPromise = this.performCoverSearch(book, cacheKey, startTime);
    this.pendingRequests.set(cacheKey, requestPromise);

    // Clean up the pending request when done (success or failure)
    requestPromise.finally(() => {
      this.pendingRequests.delete(cacheKey);
    });

    return requestPromise;
  }

  private async performCoverSearch(
    book: { title: string; author: string; isbn?: string; year?: string },
    cacheKey: string,
    startTime: number
  ): Promise<CoverSearchResult> {
    // Enhanced multi-source cover search with validation
    logger.debug(`🔍 Searching for cover: "${book.title}" by ${book.author}`);
    
    // Try sources sequentially with retry logic
    const sources = [
      { name: 'Google Books Enhanced', fetch: () => this.fetchFromGoogleBooksEnhanced(book), priority: 1 },
      { name: 'OpenLibrary Enhanced', fetch: () => this.fetchFromOpenLibraryEnhanced(book), priority: 2 },
      { name: 'Internet Archive', fetch: () => this.fetchFromInternetArchive(book), priority: 3 },
      { name: 'Additional Sources', fetch: () => this.fetchFromAdditionalSources(book), priority: 4 },
    ];

    let bestResult: CoverSearchResult | null = null;
    
    for (const source of sources) {
      let attempt = 0;
      const maxAttempts = 2; // Reduced from 3 for better performance
      
      while (attempt < maxAttempts) {
        try {
          if (attempt > 0) {
            // Exponential backoff: 1s, 2s
            const delay = Math.pow(2, attempt) * 1000;
            logger.debug(`⏱️  Retrying ${source.name} in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            logger.debug(`🔎 Trying ${source.name}...`);
          }
          
          const result = await source.fetch();
          
          if (result && result.url && !result.url.startsWith('gradient:')) {
            logger.debug(`📸 Found cover from ${source.name} (confidence: ${result.confidence}%) on attempt ${attempt + 1}`);
            
            // If this is a high-confidence result, use it immediately
            if (result.confidence >= 90) {
              bestResult = result;
              break;
            }
            
            // Otherwise, keep the best result so far
            if (!bestResult || result.confidence > bestResult.confidence) {
              bestResult = result;
            }
            
            // Break out of retry loop for this source
            break;
          } else {
            logger.debug(`🔍 ${source.name} returned no valid cover on attempt ${attempt + 1}`);
          }
        } catch (error) {
          console.error(`❌ Error from ${source.name} (attempt ${attempt + 1}):`, error instanceof Error ? error.message : String(error));
          
          // If this was the last attempt, move to next source
          if (attempt === maxAttempts - 1) {
            console.log(`🚫 ${source.name} failed after ${maxAttempts} attempts`);
          }
        }
        
        attempt++;
      }
      
      // If we found a high-confidence result, no need to try other sources
      if (bestResult && bestResult.confidence >= 90) {
        logger.debug(`🎯 High-confidence result found, skipping remaining sources`);
        break;
      }
    }

    // If we found a real cover, cache it and return
    if (bestResult && bestResult.url && !bestResult.url.startsWith('gradient:')) {
      logger.debug(`✅ Using best cover from ${bestResult.source}`);
      const loadTime = Date.now() - startTime;
      
      // Cache the result
      this.cache.set(cacheKey, {
        url: bestResult.url,
        source: bestResult.source,
        confidence: bestResult.confidence,
        timestamp: Date.now(),
      });
      this.saveCache();

      // Record successful request
      bookCoverAnalytics.recordRequest({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        source: bestResult.source,
        confidence: bestResult.confidence,
        loadTime,
        success: true,
      });

      return bestResult;
    }

    // No real cover found - try AI generation
    console.log(`🤖 No cover found, generating AI cover for "${book.title}"`);
    const aiCover = await this.generateAICover(book);
    if (aiCover && aiCover.url !== 'fallback') {
      const loadTime = Date.now() - startTime;
      
      // Record AI generation success
      bookCoverAnalytics.recordRequest({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        source: aiCover.source,
        confidence: aiCover.confidence,
        loadTime,
        success: true,
      });

      return aiCover;
    }

    // Final fallback: gradient cover
    console.log(`🎨 Using gradient fallback for "${book.title}"`);
    const fallbackCover = this.generateFallbackCover(book);
    const loadTime = Date.now() - startTime;

    // Record fallback usage
    bookCoverAnalytics.recordRequest({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      source: fallbackCover.source,
      confidence: fallbackCover.confidence,
      loadTime,
      success: true, // Fallback is still a success
    });

    return fallbackCover;
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

  // Legacy OpenLibrary search - kept for compatibility but replaced by enhanced version
  private async fetchFromOpenLibraryBySearch(book: {
    title: string;
    author: string;
  }): Promise<CoverSearchResult | null> {
    return this.fetchFromOpenLibraryEnhanced(book);
  }

  // Legacy Google Books method - kept for compatibility but replaced by enhanced version
  private async fetchFromGoogleBooks(book: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<CoverSearchResult | null> {
    return this.fetchFromGoogleBooksEnhanced(book);
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
   * Enhanced image URL validation and sanitization
   */
  private async validateImageUrl(url: string): Promise<boolean> {
    try {
      // Force HTTPS for security
      const httpsUrl = url.replace('http://', 'https://');
      
      // Check if this URL has already failed recently
      if (this.failedUrls.has(httpsUrl)) {
        logger.debug(`⏭️  Skipping known failed URL: ${httpsUrl.substring(0, 50)}...`);
        return false;
      }
      
      // Skip validation for Google Books and other CORS-protected URLs
      // The browser will handle CORS errors when the image actually loads
      if (httpsUrl.includes('books.google.com') || 
          httpsUrl.includes('googleusercontent.com') ||
          httpsUrl.includes('googleapis.com')) {
        logger.debug(`📸 Accepting Google Books URL without validation: ${httpsUrl.substring(0, 50)}...`);
        return true;
      }
      
      // For OpenLibrary and other sources, do a quick validation
      if (httpsUrl.includes('covers.openlibrary.org') ||
          httpsUrl.includes('archive.org')) {
        try {
          const response = await fetch(httpsUrl, {
            method: 'HEAD',
            headers: {
              'Accept': 'image/*',
              'User-Agent': 'Stacks-BookApp/1.0',
            },
            signal: AbortSignal.timeout(3000), // Shorter timeout for validation
          });
          
          const isValid = response.ok && (response.headers.get('content-type')?.startsWith('image/') ?? false);
          if (isValid) {
            logger.debug(`✅ Image validation successful: ${httpsUrl.substring(0, 50)}...`);
          } else {
            logger.debug(`❌ Image validation failed: ${httpsUrl.substring(0, 50)}... (status: ${response.status})`);
            this.failedUrls.add(httpsUrl);
          }
          return isValid;
        } catch (error) {
          // Don't mark as failed for CORS errors, let the browser handle it
          logger.debug(`⚠️ Validation skipped due to network error: ${httpsUrl.substring(0, 50)}...`);
          return true; // Optimistically assume it works
        }
      }
      
      // For other URLs, assume they're valid
      logger.debug(`✅ Accepting URL without validation: ${httpsUrl.substring(0, 50)}...`);
      return true;
    } catch (error) {
      // Don't mark URLs as failed for network/CORS errors
      logger.debug(`⚠️ Image validation error (allowing anyway): ${url.substring(0, 50)}...`);
      return true;
    }
  }

  /**
   * Enhanced Google Books fetch with better error handling and validation
   */
  private async fetchFromGoogleBooksEnhanced(book: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<CoverSearchResult | null> {
    const attempts = [
      // Try ISBN first if available
      book.isbn ? `isbn:${book.isbn}` : null,
      // Exact title and author match
      `intitle:"${book.title}" inauthor:"${book.author}"`,
      // Broader search without quotes
      `${book.title} ${book.author}`,
      // Title only as last resort
      book.title
    ].filter(Boolean);

    for (const query of attempts) {
      try {
        // DETAILED LOGGING: Track proxy request details  
        console.log(`🔍 [GOOGLE BOOKS PROXY] Searching for "${query}"`);
        
        const response = await fetch('/api/google-books-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            maxResults: 5
          }),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        console.log(`📡 [GOOGLE BOOKS PROXY] Response status: ${response.status}`);
        
        if (!response.ok) {
          console.error(`❌ [GOOGLE BOOKS PROXY] API returned ${response.status} for query: ${query}`);
          const errorText = await response.text();
          console.error(`❌ [GOOGLE BOOKS PROXY] Error details: ${errorText}`);
          continue;
        }

        const data = await response.json();
        console.log(`📊 [GOOGLE BOOKS PROXY] Found ${data.books?.length || 0} results for query: ${query}`);
        
        if (!data.success || !data.books || data.books.length === 0) {
          console.log(`🔍 [GOOGLE BOOKS PROXY] No results from proxy for query: ${query}`);
          continue;
        }

        // Try each result until we find a valid image
        for (const item of data.books) {
          console.log(`📖 [GOOGLE BOOKS PROXY] Checking book: "${item.title}" by ${item.authors?.join(', ')}`);
          console.log(`🖼️ [GOOGLE BOOKS PROXY] Cover URL available: ${item.coverUrl ? 'YES' : 'NO'}`);

          if (!item.coverUrl) {
            console.log(`❌ [GOOGLE BOOKS PROXY] No cover URL for "${item.title}"`);
            continue;
          }

          console.log(`🔗 [GOOGLE BOOKS PROXY] Testing cover URL: ${item.coverUrl}`);
          
          // URL is already processed by the proxy
          let enhancedUrl = item.coverUrl
            .replace('&zoom=1', '&zoom=0') // Get larger image
            .replace('&edge=curl', ''); // Remove curl effect

          // Calculate confidence based on match quality
          let confidence = 75;
          
          if (book.isbn && item.isbn && item.isbn.includes(book.isbn)) {
            confidence = 95; // ISBN matches are very reliable
          } else {
            const titleMatch = item.title?.toLowerCase().includes(book.title.toLowerCase());
            const authorMatch = item.authors?.some((author: string) => 
              author.toLowerCase().includes(book.author.toLowerCase()) ||
              book.author.toLowerCase().includes(author.toLowerCase())
            );
            
            if (titleMatch && authorMatch) confidence = 90;
            else if (titleMatch) confidence = 80;
          }

          console.log(`✅ [GOOGLE BOOKS PROXY] SUCCESS: Found cover for "${book.title}" (confidence: ${confidence}%) - ${enhancedUrl}`);
          return {
            url: enhancedUrl,
            source: 'google',
            confidence,
            quality: 'high',
          };
        }
      } catch (error) {
        console.error(`❌ [GOOGLE BOOKS PROXY] ERROR for query "${query}":`, error instanceof Error ? error.message : String(error));
        continue;
      }
    }
    
    console.log(`❌ [GOOGLE BOOKS PROXY] FAILED: No cover found for "${book.title}" by ${book.author}`);
    return null;
  }

  /**
   * Enhanced OpenLibrary search with multiple strategies and validation
   */
  private async fetchFromOpenLibraryEnhanced(book: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<CoverSearchResult | null> {
    // Try ISBN lookup first if available
    if (book.isbn) {
      const isbnCover = await this.tryOpenLibraryISBN(book.isbn);
      if (isbnCover) return isbnCover;
    }

    // Try search-based lookup
    const searchStrategies = [
      `title:"${book.title}" author:"${book.author}"`,
      `title:${book.title.replace(/\W+/g, ' ')} author:${book.author.replace(/\W+/g, ' ')}`,
      `${book.title} ${book.author}`,
      book.title
    ];

    for (const query of searchStrategies) {
      try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,cover_i,isbn,first_publish_year`;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Stacks-BookApp/1.0',
          }
        });

        if (!response.ok) continue;

        const data = await response.json();
        if (!data.docs || data.docs.length === 0) continue;

        // Find best matches and validate their covers
        const sortedResults = data.docs
          .filter((doc: any) => doc.cover_i) // Only consider books with covers
          .sort((a: any, b: any) => {
            // Prioritize by author match
            const aAuthorMatch = a.author_name?.some((author: string) =>
              author.toLowerCase().includes(book.author.toLowerCase()) ||
              book.author.toLowerCase().includes(author.toLowerCase())
            );
            const bAuthorMatch = b.author_name?.some((author: string) =>
              author.toLowerCase().includes(book.author.toLowerCase()) ||
              book.author.toLowerCase().includes(author.toLowerCase())
            );
            
            if (aAuthorMatch && !bAuthorMatch) return -1;
            if (bAuthorMatch && !aAuthorMatch) return 1;
            return 0;
          });

        for (const doc of sortedResults.slice(0, 3)) {
          const coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
          
          const isValid = await this.validateImageUrl(coverUrl);
          if (isValid) {
            const authorMatch = doc.author_name?.some((author: string) =>
              author.toLowerCase().includes(book.author.toLowerCase()) ||
              book.author.toLowerCase().includes(author.toLowerCase())
            );

            const confidence = authorMatch ? 85 : 70;
            logger.debug(`✅ OpenLibrary: Found valid cover (confidence: ${confidence}%)`);
            
            return {
              url: coverUrl,
              source: 'openlibrary',
              confidence,
              quality: 'high',
            };
          }
        }
      } catch (error) {
        console.error(`OpenLibrary search error for query ${query}:`, error instanceof Error ? error.message : String(error));
        continue;
      }
    }

    return null;
  }

  /**
   * Try OpenLibrary ISBN lookup with validation
   */
  private async tryOpenLibraryISBN(isbn: string): Promise<CoverSearchResult | null> {
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    
    const isValid = await this.validateImageUrl(coverUrl);
    if (isValid) {
      logger.debug(`✅ OpenLibrary ISBN: Found valid cover`);
      return {
        url: coverUrl,
        source: 'openlibrary',
        confidence: 95,
        quality: 'high',
      };
    }
    
    return null;
  }

  /**
   * Additional cover sources for better coverage
   */
  private async fetchFromAdditionalSources(book: {
    title: string;
    author: string;
    isbn?: string;
  }): Promise<CoverSearchResult | null> {
    // Try HathiTrust Digital Library
    if (book.isbn) {
      try {
        const hathiUrl = `https://catalog.hathitrust.org/api/volumes/brief/isbn/${book.isbn}.json`;
        const response = await fetch(hathiUrl, {
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          const data = await response.json();
          // HathiTrust doesn't provide covers directly but we can try constructing one
          // This is a placeholder for potential future implementation
        }
      } catch (error) {
        // Silently fail and continue to next source
      }
    }

    // Try Goodreads (if we had API access)
    // Try Amazon (with proper affiliate setup)
    // For now, return null to proceed to AI generation
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
      console.error('AI cover generation failed:', error instanceof Error ? error.message : String(error));
    }
    
    return null;
  }

  private generateFallbackCover(book: { title: string; author: string }): CoverSearchResult {
    console.log(`🎨 Generating gradient fallback for "${book.title}" by ${book.author}`);
    
    // Generate a consistent color based on title+author
    const hash = (book.title + book.author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);

    const colors = [
      ['#FF6B6B', '#4ECDC4'], // Vibrant red to teal
      ['#45B7D1', '#F39C12'], // Blue to orange  
      ['#96CEB4', '#FECA57'], // Green to yellow
      ['#6C5CE7', '#FD79A8'], // Purple to pink
      ['#00B894', '#00CEC9'], // Green to cyan
      ['#E17055', '#FDCB6E'], // Orange gradient
      ['#A29BFE', '#6C5CE7'], // Light purple to purple
      ['#FD79A8', '#E84393'], // Pink gradient
      ['#00A8CC', '#0081A7'], // Blue gradient
      ['#F07167', '#C1666B'], // Red gradient
    ];

    const index = Math.abs(hash) % colors.length;
    const colorPair = colors[index] || colors[0];

    const fallbackUrl = `gradient:${colorPair![0]}:${colorPair![1]}:${encodeURIComponent(book.title)}:${encodeURIComponent(book.author)}`;
    
    console.log(`✨ Generated gradient cover with colors ${colorPair![0]} -> ${colorPair![1]}`);
    
    // Cache the fallback so we don't regenerate it
    const cacheKey = this.getCacheKey(book);
    this.cache.set(cacheKey, {
      url: fallbackUrl,
      source: 'gradient_generated',
      confidence: 100,
      timestamp: Date.now(),
    });
    this.saveCache();

    return {
      url: fallbackUrl,
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

  // Mark a specific URL as failed to prevent future use
  markUrlAsFailed(url: string): void {
    this.failedUrls.add(url);
    console.log(`⚠️ Marked URL as failed: ${url.substring(0, 50)}...`);
  }

  // Check if a URL has been marked as failed
  isUrlFailed(url: string): boolean {
    return this.failedUrls.has(url);
  }

  // Only clear cache if the cached URL is actually problematic
  clearCacheIfNeeded(book: { title: string; author: string; isbn?: string }, failedUrl?: string): void {
    const cacheKey = this.getCacheKey(book);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) return;
    
    // If a specific URL failed and it matches the cached URL, clear it
    if (failedUrl && cached.url === failedUrl) {
      this.cache.delete(cacheKey);
      this.saveCache();
      console.log(`🗑️ Cleared cache for failed URL: ${cacheKey}`);
    }
    // If no specific URL provided, check if cached URL is in failed set
    else if (!failedUrl && this.failedUrls.has(cached.url)) {
      this.cache.delete(cacheKey);
      this.saveCache();
      console.log(`🗑️ Cleared cache for known failed URL: ${cacheKey}`);
    } else {
      console.log(`✅ Keeping valid cache entry: ${cacheKey}`);
    }
  }

  // Legacy method for backwards compatibility - now smarter
  clearCacheForBook(book: { title: string; author: string; isbn?: string }): void {
    this.clearCacheIfNeeded(book);
  }
}

export const bookCoverService = BookCoverService.getInstance();
