import { NextRequest, NextResponse } from 'next/server';

/**
 * Hardcover API Proxy
 * Server-side only endpoint to securely call Hardcover GraphQL API
 * Hardcover requires backend-only access (not browser-safe)
 */

const HARDCOVER_API_ENDPOINT = 'https://api.hardcover.app/v1/graphql';

interface HardcoverBookData {
  title: string;
  rating: number;
  ratingsCount: number;
  reviews: Array<{
    id: string;
    user: { username: string };
    rating: number;
    text: string;
  }>;
  tags: string[];
}

export async function GET(request: NextRequest) {
  // Get ISBN from query parameters
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get('isbn');

  if (!isbn) {
    return NextResponse.json(
      { error: 'ISBN parameter is required' },
      { status: 400 }
    );
  }

  // Check for API key
  const apiKey = process.env.HARDCOVER_API_KEY;
  if (!apiKey) {
    console.warn('HARDCOVER_API_KEY not configured - returning null');
    return NextResponse.json(null);
  }

  try {
    // Use search query - ISBN is indexed in Hardcover's search
    // Documentation: isbns field is included in default searchable fields
    const query = `
      query SearchBookByISBN($isbn: String!) {
        search(
          query: $isbn,
          query_type: "Book"
        ) {
          ... on Book {
            id
            title
            subtitle
            description
            rating
            ratings_count
            cached_tags
            contributions {
              author {
                id
                name
              }
            }
          }
        }
      }
    `;

    const response = await fetch(HARDCOVER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Stacks-Reading-App/1.0',
      },
      body: JSON.stringify({
        query,
        variables: { isbn },
      }),
    });

    if (!response.ok) {
      console.error(`Hardcover API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(null);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Hardcover GraphQL errors:', data.errors);
      return NextResponse.json(null);
    }

    const searchResults = data.data?.search;
    if (!searchResults || searchResults.length === 0) {
      console.log(`No Hardcover book found for ISBN: ${isbn}`);
      return NextResponse.json(null);
    }

    const book = searchResults[0];

    // Transform to our API format
    const result: HardcoverBookData = {
      title: book.title || '',
      rating: book.rating || 0,
      ratingsCount: book.ratings_count || 0,
      reviews: [], // Reviews are handled separately - see reviews service
      tags: book.cached_tags || [],
    };

    // Cache for 1 hour (Hardcover data doesn't change frequently)
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });

  } catch (error) {
    console.error('Hardcover API fetch error:', error);
    return NextResponse.json(null);
  }
}
