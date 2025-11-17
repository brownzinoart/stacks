/**
 * Google Books API Integration
 * Free API - requires API key
 * Get key: https://console.cloud.google.com/apis/credentials
 */

interface GoogleBooksData {
  averageRating: number;
  ratingsCount: number;
  description: string;
  coverUrl?: string; // For cascade fallback system
}

export async function getGoogleBooksData(isbn: string): Promise<GoogleBooksData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${apiKey ? `&key=${apiKey}` : ''}`;

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
