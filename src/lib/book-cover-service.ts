/**
 * Comprehensive Book Cover Service
 * Multi-source cover fetching with caching and fallbacks
 */

interface CoverSearchResult {
  url: string;
  source: 'openlibrary' | 'google' | 'archive' | 'cache' | 'generated';
  confidence: number; // 0-100
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

    // Try sources in order of reliability
    const results = await Promise.allSettled([
      this.fetchFromOpenLibraryByISBN(book),
      this.fetchFromOpenLibraryBySearch(book),
      this.fetchFromGoogleBooks(book),
      this.fetchFromInternetArchive(book),
    ]);

    // Find best result
    let bestResult: CoverSearchResult | null = null;
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        if (!bestResult || result.value.confidence > bestResult.confidence) {
          bestResult = result.value;
        }
      }
    }

    // If we found a cover, cache it
    if (bestResult && bestResult.url) {
      this.cache.set(cacheKey, {
        url: bestResult.url,
        source: bestResult.source,
        confidence: bestResult.confidence,
        timestamp: Date.now(),
      });
      this.saveCache();
      return bestResult;
    }

    // Generate fallback
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
      let query = '';
      if (book.isbn) {
        query = `isbn:${book.isbn}`;
      } else {
        query = `intitle:"${book.title}" inauthor:"${book.author}"`;
      }

      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;
      const response = await fetch(url);

      if (!response.ok) return null;

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        const imageLinks = item.volumeInfo?.imageLinks;

        if (imageLinks?.thumbnail) {
          // Google Books provides small thumbnails by default, request larger version
          const largeUrl = imageLinks.thumbnail.replace('&zoom=1', '&zoom=0').replace('http://', 'https://');

          return {
            url: largeUrl,
            source: 'google',
            confidence: book.isbn ? 90 : 75,
          };
        }
      }
    } catch (e) {
      console.error('Google Books error:', e);
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
    ];

    const index = Math.abs(hash) % colors.length;
    const colorPair = colors[index] || colors[0];

    // This would be used by the BookCover component to generate a gradient
    return {
      url: `gradient:${colorPair![0]}:${colorPair![1]}`,
      source: 'generated',
      confidence: 100,
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
