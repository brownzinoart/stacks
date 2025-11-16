/**
 * Reviews Service Abstraction Layer
 *
 * PURPOSE: Provides a clean interface for fetching book reviews that can be
 * easily swapped between mock data (current) and real data sources (production).
 *
 * PRODUCTION OPTIONS (when "its go time"):
 * 1. Goodreads Alternative APIs:
 *    - LibraryThing API (https://www.librarything.com/services/keys.php)
 *    - StoryGraph (no public API yet, but community-requested)
 *    - Literal.club (community book app, check for API availability)
 *
 * 2. Web Scraping Services:
 *    - ScraperAPI for Goodreads/Amazon reviews
 *    - Apify scrapers for book review sites
 *    - Custom scraper with rate limiting
 *
 * 3. User-Generated Within App:
 *    - Build own review system with database
 *    - Integrate with Hardcover's user review API (requires authentication)
 *    - Hybrid: seed with scraped data, grow with user reviews
 *
 * 4. Paid Review Data APIs:
 *    - Google Books API (includes some reviews, already integrated)
 *    - Amazon Product Advertising API (requires approval)
 *    - Book review aggregation services
 */

export interface BookReview {
  id: string;
  username: string;
  rating: number; // 1-5 stars
  text: string;
  date?: string;
  verified?: boolean; // For verified purchase/reader badges
  helpfulCount?: number; // For sorting by usefulness
}

export interface ReviewSource {
  name: string;
  attribution: string; // e.g., "Reviews from Hardcover"
  attributionUrl: string;
}

export interface ReviewsData {
  reviews: BookReview[];
  source: ReviewSource;
  totalCount: number; // Total reviews available (may be more than returned)
}

/**
 * Fetch book reviews from current data source
 * @param isbn - Book ISBN (preferred identifier for matching across platforms)
 * @param bookId - Internal book ID (fallback)
 * @param limit - Maximum number of reviews to return (default: 3)
 * @returns Reviews data with source attribution
 */
export async function getBookReviews(
  isbn?: string,
  bookId?: string,
  limit: number = 3
): Promise<ReviewsData> {
  // CURRENT: Return mock data
  // FUTURE: Swap this implementation for real API calls
  return getMockReviews(bookId, limit);
}

/**
 * Mock reviews implementation
 * TODO: Replace with real API integration when production review source is selected
 */
function getMockReviews(bookId?: string, limit: number = 3): ReviewsData {
  // Mock review pool (simulates variety)
  const mockReviewPool: BookReview[] = [
    {
      id: "r1",
      username: "bookworm_92",
      rating: 5,
      text: "Absolutely loved this! The characters felt so real and the mystery kept me guessing until the very end.",
      date: "2024-01-15",
      verified: true,
      helpfulCount: 24,
    },
    {
      id: "r2",
      username: "mystery_fan",
      rating: 4,
      text: "Great cozy mystery! Perfect for a rainy afternoon. The small town setting was charming.",
      date: "2024-01-10",
      verified: true,
      helpfulCount: 18,
    },
    {
      id: "r3",
      username: "reader_extraordinaire",
      rating: 5,
      text: "This book has everything: complex characters, a twisty plot, and beautiful writing. Highly recommend!",
      date: "2024-01-05",
      verified: false,
      helpfulCount: 31,
    },
    {
      id: "r4",
      username: "cozy_corner",
      rating: 4,
      text: "The atmosphere was perfect and I loved the quirky cast of characters. A bit slow at the start but worth it.",
      date: "2023-12-28",
      verified: true,
      helpfulCount: 12,
    },
    {
      id: "r5",
      username: "page_turner",
      rating: 5,
      text: "Could not put this down! The pacing was perfect and the mystery was cleverly crafted.",
      date: "2023-12-20",
      verified: true,
      helpfulCount: 27,
    },
  ];

  // Return subset based on limit
  const reviews = mockReviewPool.slice(0, limit);

  return {
    reviews,
    source: {
      name: "Hardcover",
      attribution: "Reviews from Hardcover",
      attributionUrl: "https://hardcover.app",
    },
    totalCount: mockReviewPool.length,
  };
}

/**
 * FUTURE IMPLEMENTATION EXAMPLES:
 *
 * Example 1: Hardcover Authenticated Reviews
 * async function getHardcoverReviews(isbn: string): Promise<ReviewsData> {
 *   const response = await fetch('/api/hardcover/reviews', {
 *     method: 'POST',
 *     body: JSON.stringify({ isbn }),
 *   });
 *   const data = await response.json();
 *   return {
 *     reviews: data.reviews.map(r => ({
 *       id: r.id,
 *       username: r.user.username,
 *       rating: r.rating,
 *       text: r.text,
 *     })),
 *     source: { name: 'Hardcover', attribution: 'Reviews from', attributionUrl: 'https://hardcover.app' },
 *     totalCount: data.total,
 *   };
 * }
 *
 * Example 2: Web Scraping Service
 * async function getScrapedReviews(isbn: string): Promise<ReviewsData> {
 *   const response = await fetch('/api/reviews/scrape', {
 *     method: 'POST',
 *     body: JSON.stringify({ isbn, source: 'goodreads' }),
 *   });
 *   // Parse and normalize scraped data
 * }
 *
 * Example 3: Multiple Source Aggregation
 * async function getAggregatedReviews(isbn: string): Promise<ReviewsData> {
 *   const [hardcover, librarything, google] = await Promise.all([
 *     getHardcoverReviews(isbn),
 *     getLibraryThingReviews(isbn),
 *     getGoogleReviews(isbn),
 *   ]);
 *   // Merge, deduplicate, and sort by helpfulness
 * }
 */
