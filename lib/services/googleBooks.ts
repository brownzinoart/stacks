/**
 * Google Books Service
 * Consolidated Google Books API integration
 * 
 * Free API - requires API key (optional but recommended)
 * Get key: https://console.cloud.google.com/apis/credentials
 */

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

// Use NEXT_PUBLIC_ env var for client-side, fallback to server-side
const getApiKey = () => 
  process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || process.env.GOOGLE_BOOKS_API_KEY;

// ============================================
// TYPES
// ============================================

export interface GoogleBook {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  pageCount?: number;
  publishedDate?: string;
  imageLinks?: {
    thumbnail?: string;
    small?: string;
    smallThumbnail?: string;
  };
  averageRating?: number;
}

export interface EnrichedBookMetadata {
  synopsis: string;
  pageCount: number;
  publishYear: number;
  genres: string[];
  rating?: number;
}

export interface GoogleBooksData {
  averageRating: number;
  ratingsCount: number;
  description: string;
  coverUrl?: string;
}

// ============================================
// ISBN-BASED LOOKUP (from api/googleBooksApi.ts)
// ============================================

/**
 * Get book data by ISBN
 * Used for book detail enrichment with ratings, description, and cover
 */
export async function getGoogleBooksData(isbn: string): Promise<GoogleBooksData | null> {
  try {
    const apiKey = getApiKey();
    const url = `${GOOGLE_BOOKS_API}?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const volumeInfo = data.items[0].volumeInfo;

    // Extract cover image URL (prefer higher quality)
    const coverUrl = volumeInfo.imageLinks?.thumbnail ||
                     volumeInfo.imageLinks?.smallThumbnail ||
                     undefined;

    return {
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
      description: volumeInfo.description || '',
      coverUrl,
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    return null;
  }
}

// ============================================
// TITLE/AUTHOR SEARCH
// ============================================

/**
 * Search Google Books API by title and/or author
 */
export async function searchBooks(
  query: string,
  author?: string,
  maxResults: number = 10
): Promise<GoogleBook[]> {
  try {
    let searchQuery = `intitle:${encodeURIComponent(query)}`;
    if (author) {
      searchQuery += `+inauthor:${encodeURIComponent(author)}`;
    }

    const apiKey = getApiKey();
    const url = `${GOOGLE_BOOKS_API}?q=${searchQuery}&maxResults=${maxResults}${
      apiKey ? `&key=${apiKey}` : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Google Books API error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      categories: item.volumeInfo.categories,
      pageCount: item.volumeInfo.pageCount,
      publishedDate: item.volumeInfo.publishedDate,
      imageLinks: item.volumeInfo.imageLinks,
      averageRating: item.volumeInfo.averageRating
    }));
  } catch (error) {
    console.error('Error searching Google Books:', error);
    return [];
  }
}

// ============================================
// METADATA ENRICHMENT
// ============================================

/**
 * Enrich book metadata by fetching from Google Books
 */
export async function enrichBookWithMetadata(
  title: string,
  author: string
): Promise<EnrichedBookMetadata | null> {
  const results = await searchBooks(title, author, 1);

  if (results.length === 0) {
    return null;
  }

  const book = results[0];
  if (!book) return null;

  return {
    synopsis: book.description || '',
    pageCount: book.pageCount || 0,
    publishYear: book.publishedDate ? parseInt(book.publishedDate.split('-')[0] || '0') : 0,
    genres: book.categories || [],
    rating: book.averageRating
  };
}

/**
 * Batch fetch metadata for multiple books
 * Processes in batches of 5 to respect rate limits
 */
export async function batchEnrichBooks(
  books: Array<{ title: string; author: string }>
): Promise<Map<string, EnrichedBookMetadata>> {
  const enrichedMap = new Map<string, EnrichedBookMetadata>();

  // Process in batches of 5 to respect rate limits
  const batchSize = 5;
  for (let i = 0; i < books.length; i += batchSize) {
    const batch = books.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map(b => enrichBookWithMetadata(b.title, b.author))
    );

    batch.forEach((book, index) => {
      const metadata = results[index];
      if (metadata) {
        enrichedMap.set(`${book.title}|${book.author}`, metadata);
      }
    });

    // Rate limiting: wait 1 second between batches
    if (i + batchSize < books.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return enrichedMap;
}
