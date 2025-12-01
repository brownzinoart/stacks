/**
 * Mock data helper functions for search results and book details
 */

import type { SearchResult, BookDetail, Book } from '../types';

/**
 * Get mock search results for a query
 * For MVP, returns hardcoded results for "cozy mystery small town"
 * TODO: Replace with actual search API call
 */
export function getMockSearchResults(query: string): SearchResult {
  return {
    query: query,
    atmosphere: {
      tags: ["Cozy", "Small-town", "Intimate"],
      books: [
        {
          book: {
            id: "search-book-1",
            title: "A Cozy Murder in Maple Grove",
            author: "Sarah Bennett",
            cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
            pageCount: 320,
            publishYear: 2023,
          },
          matchPercentage: 92,
          matchReasons: {
            atmosphere: ["Cozy setting", "Small town vibe", "Intimate feel"],
          },
        },
        {
          book: {
            id: "search-book-2",
            title: "The Bookshop Mystery",
            author: "Emma Collins",
            cover: "https://covers.openlibrary.org/b/isbn/9780593548219-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Bookshop", "Coastal Town"],
            pageCount: 285,
            publishYear: 2024,
          },
          matchPercentage: 88,
          matchReasons: {
            atmosphere: ["Sleepy coastal village", "Dusty bookshop"],
          },
        },
      ],
    },
    characters: {
      tags: ["Amateur Sleuth", "Quirky Cast", "Found Family"],
      books: [
        {
          book: {
            id: "search-book-3",
            title: "Death by Scone",
            author: "Margaret Hastings",
            cover: "https://covers.openlibrary.org/b/isbn/9780062843098-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Quirky Characters"],
            pageCount: 298,
            publishYear: 2023,
          },
          matchPercentage: 85,
          matchReasons: {
            characters: ["Witty baker protagonist", "Eccentric locals"],
          },
        },
        {
          book: {
            id: "search-book-4",
            title: "The Garden Club Murders",
            author: "Helen Carter",
            cover: "https://covers.openlibrary.org/b/isbn/9780593359426-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Amateur Sleuth", "Found Family"],
            pageCount: 342,
            publishYear: 2024,
          },
          matchPercentage: 83,
          matchReasons: {
            characters: ["Retired teacher sleuth", "Unlikely allies"],
          },
        },
      ],
    },
    plot: {
      tags: ["Mystery", "Slow-burn", "Twisty"],
      books: [
        {
          book: {
            id: "search-book-5",
            title: "Murder at the Village Fair",
            author: "Patricia Reed",
            cover: "https://covers.openlibrary.org/b/isbn/9780593156537-L.jpg",
            genres: ["Mystery", "Cozy Mystery"],
            tropes: ["Mystery", "Slow Burn"],
            pageCount: 315,
            publishYear: 2023,
          },
          matchPercentage: 90,
          matchReasons: {
            plot: ["Festive fair setting", "Layers of secrets"],
          },
        },
        {
          book: {
            id: "search-book-6",
            title: "The Secret Society",
            author: "Diana Woods",
            cover: "https://covers.openlibrary.org/b/isbn/9780593465912-L.jpg",
            genres: ["Mystery", "Thriller"],
            tropes: ["Twisty", "Hidden Societies"],
            pageCount: 365,
            publishYear: 2024,
          },
          matchPercentage: 87,
          matchReasons: {
            plot: ["Twisty reveals", "Hidden societies"],
          },
        },
      ],
    },
  };
}

/**
 * Get mock book detail by ID
 * For MVP, returns hardcoded detail for search-book-1
 * TODO: Replace with actual search API (currently mock data)
 */
export function getMockBookDetail(bookId: string): BookDetail | null {
  if (bookId === "search-book-1") {
    return {
      id: "search-book-1",
      title: "A Cozy Murder in Maple Grove",
      author: "Sarah Bennett",
      cover: "https://covers.openlibrary.org/b/isbn/9780593356890-L.jpg",
      isbn: "9780593356890",
      genres: ["Mystery", "Cozy Mystery"],
      tropes: ["Amateur Sleuth", "Small Town", "Cozy"],
      pageCount: 320,
      publishYear: 2023,
      description: "When the town librarian is found dead among the dusty stacks, amateur sleuth Eleanor Thompson must navigate a cast of quirky suspects and long-buried secrets in her small New England town. With its cozy atmosphere, clever twists, and a protagonist you'll root for, this charming mystery is perfect for fans of slow-burn whodunits.",
      socialProof: {
        isBestseller: false,
        rating: 4.2,
        ratingsCount: 1847,
        readerTags: ["Cozy", "Character-driven", "Twisty", "Atmospheric"],
        reviews: [
          {
            id: "review-1",
            username: "booklover23",
            stars: 5,
            text: "Perfect cozy mystery! The small-town setting felt so real and the characters were absolutely charming. Couldn't put it down.",
            source: "mock",
          },
          {
            id: "review-2",
            username: "mystery_fan",
            stars: 4,
            text: "Great plot twists and a protagonist you can't help but root for. Exactly what I was looking for in a cozy mystery.",
            source: "mock",
          },
        ],
      },
    };
  }

  return null;
}

/**
 * Get book detail with API enrichment
 * For MVP: Start with mock data, gradually replace with API calls
 */
export async function getBookDetailWithAPIs(bookId: string, isbn?: string): Promise<BookDetail | null> {
  const mockDetail = getMockBookDetail(bookId);

  if (!mockDetail || !isbn) {
    return mockDetail;
  }

  try {
    // Import service functions dynamically to avoid circular dependencies
    const { getGoogleBooksData } = await import('../services/googleBooks');
    const { checkBestseller } = await import('../api/nytBestsellerApi');
    const { getBookReviews } = await import('../services/reviews');

    // Fetch from APIs in parallel
    const [googleData, bestsellerInfo, reviewsData] = await Promise.all([
      getGoogleBooksData(isbn),
      checkBestseller(isbn),
      getBookReviews(isbn, bookId, 3), // Fetch 3 reviews for book detail page
    ]);

    // Merge API data with mock data
    return {
      ...mockDetail,
      isbn,
      googleBooksCoverUrl: googleData?.coverUrl, // For cascade fallback
      socialProof: {
        isBestseller: bestsellerInfo.isBestseller,
        bestsellerInfo: bestsellerInfo.isBestseller
          ? `${bestsellerInfo.listName} • ${bestsellerInfo.weeksOnList} weeks`
          : undefined,
        rating: googleData?.averageRating || mockDetail.socialProof.rating,
        ratingsCount: googleData?.ratingsCount || mockDetail.socialProof.ratingsCount,
        readerTags: mockDetail.socialProof.readerTags,
        // Use reviews service (currently mock, but abstracted for future real data)
        reviews: reviewsData.reviews.map(r => ({
          id: r.id,
          username: r.username,
          stars: r.rating,
          text: r.text,
          source: 'google' as const,
        })),
      },
      description: googleData?.description || mockDetail.description,
    };
  } catch (error) {
    console.error('API fetch error:', error);
    // Fall back to mock data on error
    return mockDetail;
  }
}

