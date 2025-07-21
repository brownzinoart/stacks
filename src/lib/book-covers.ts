/**
 * Real book cover system for Stacks - Prominent Gen Z Design
 * Uses real book covers with enhanced styling and prominence
 */

export interface BookCoverData {
  title: string;
  author: string;
  coverUrl?: string;
  isbn?: string;
  genre?: string;
}

/**
 * Get real book cover URL from OpenLibrary API
 * Enhanced with better error handling and fallbacks
 */
export const getBookCoverUrl = async (title: string, author: string): Promise<string> => {
  try {
    // Search for the book using OpenLibrary API
    const searchQuery = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://openlibrary.org/search.json?title=${searchQuery}&limit=1`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      const book = data.docs[0];
      
      // Try to get cover image
      if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }
      
      // Fallback to ISBN cover
      if (book.isbn && book.isbn.length > 0) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
      }
    }
    
    // Return null if no cover found - we'll use placeholder
    return '';
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return '';
  }
};

/**
 * Predefined book data with real cover URLs from OpenLibrary
 * These are the actual cover IDs I found from the API
 */
export const bookData: Record<string, BookCoverData> = {
  'The Seven Husbands of Evelyn Hugo': {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://covers.openlibrary.org/b/id/8354226-L.jpg'
  },
  'Atomic Habits': {
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://covers.openlibrary.org/b/id/12539702-L.jpg'
  },
  'The Silent Patient': {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    coverUrl: 'https://covers.openlibrary.org/b/id/9407338-L.jpg'
  }
};

/**
 * Get book cover with fallback to branded placeholder
 */
export const getBookCover = (title: string, author: string): string => {
  const bookKey = title;
  
  const bookInfo = bookData[bookKey];
  if (bookInfo?.coverUrl) {
    return bookInfo.coverUrl;
  }
  
  // Return a branded placeholder based on title hash
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = [
    'bg-primary-green',
    'bg-primary-teal', 
    'bg-primary-purple',
    'bg-primary-pink',
    'bg-primary-orange',
    'bg-primary-yellow',
    'bg-primary-blue'
  ];
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex] || 'bg-primary-green'; // fallback to a default color if undefined
}; 