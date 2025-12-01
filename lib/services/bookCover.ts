/**
 * Book Cover Service
 * 
 * Open Library Covers API Integration
 * Free API - no authentication required
 * Rate limit: 100 requests per 5 minutes per IP
 */

export type CoverSize = 'S' | 'M' | 'L';

/**
 * Get Open Library cover URL for an ISBN
 * @param isbn - Book ISBN
 * @param size - Cover size: 'S' (small), 'M' (medium), 'L' (large)
 * @returns Direct URL to cover image
 */
export function getOpenLibraryCover(isbn: string, size: CoverSize = 'L'): string {
  // Returns direct URL to cover image
  // If cover doesn't exist, returns placeholder image
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
}

/**
 * Check if a cover exists for the given ISBN
 * @param isbn - Book ISBN
 * @returns True if cover exists, false otherwise
 */
export async function checkCoverExists(isbn: string): Promise<boolean> {
  try {
    const url = getOpenLibraryCover(isbn, 'S');
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get cover URL with fallback chain
 * Tries Open Library first, then falls back to other sources
 * @param isbn - Book ISBN
 * @param googleBooksCoverUrl - Optional Google Books cover URL as fallback
 * @returns Best available cover URL or gradient fallback
 */
export async function getCoverWithFallback(
  isbn: string,
  googleBooksCoverUrl?: string
): Promise<string> {
  // Try Open Library first
  if (await checkCoverExists(isbn)) {
    return getOpenLibraryCover(isbn, 'L');
  }

  // Fall back to Google Books if available
  if (googleBooksCoverUrl) {
    return googleBooksCoverUrl;
  }

  // Final fallback: gradient placeholder
  return getGradientFallback();
}

/**
 * Generate a gradient fallback placeholder
 * @returns CSS gradient string for use as background
 */
export function getGradientFallback(): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)] || gradients[0]!;
}

