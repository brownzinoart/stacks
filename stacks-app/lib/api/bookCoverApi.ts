/**
 * Open Library Covers API Integration
 * Free API - no authentication required
 * Rate limit: 100 requests per 5 minutes per IP
 */

export type CoverSize = 'S' | 'M' | 'L';

export function getOpenLibraryCover(isbn: string, size: CoverSize = 'L'): string {
  // Returns direct URL to cover image
  // If cover doesn't exist, returns placeholder image
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
}

export async function checkCoverExists(isbn: string): Promise<boolean> {
  try {
    const url = getOpenLibraryCover(isbn, 'S');
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
