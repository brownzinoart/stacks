/**
 * Hardcover API Integration
 *
 * SECURITY: Hardcover requires server-side only access.
 * This client calls our Next.js API route (/api/hardcover)
 * which securely proxies requests to Hardcover's GraphQL API.
 *
 * Documentation: https://docs.hardcover.app/api/getting-started/
 */

interface HardcoverBook {
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

/**
 * Fetch book data from Hardcover via our secure server-side API route
 * @param isbn - Book ISBN-13 or ISBN-10
 * @returns Book data with reviews and tags, or null if not found
 */
export async function getHardcoverBookData(isbn: string): Promise<HardcoverBook | null> {
  try {
    // Call our Next.js API route (runs server-side)
    const response = await fetch(`/api/hardcover?isbn=${encodeURIComponent(isbn)}`);

    if (!response.ok) {
      console.error(`Hardcover API route error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // API route returns null if book not found or API key not configured
    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Hardcover API fetch error:', error);
    return null;
  }
}
