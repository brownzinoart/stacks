/**
 * Static Cover Mapping System
 * Maps homepage demo books to their static cover images
 * This eliminates API calls for known demo books and ensures fast loading
 */

interface StaticCoverMapping {
  title: string;
  author: string;
  coverPath: string;
  confidence: number;
}

/**
 * Static covers for all homepage demo books
 * These files exist in /public/demo book covers/
 */
export const STATIC_COVER_MAPPINGS: StaticCoverMapping[] = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    coverPath: '/demo%20book%20covers/atomic_habits.jpg',
    confidence: 100,
  },
  {
    title: 'Babel',
    author: 'R.F. Kuang',
    coverPath: '/demo%20book%20covers/babel.jpg',
    confidence: 100,
  },
  {
    title: 'Fourth Wing',
    author: 'Rebecca Yarros',
    coverPath: '/demo%20book%20covers/fourthwing.webp',
    confidence: 100,
  },
  {
    title: 'Happy Place',
    author: 'Emily Henry',
    coverPath: '/demo%20book%20covers/happy_place.jpg',
    confidence: 100,
  },
  {
    title: 'Iron Flame',
    author: 'Rebecca Yarros',
    coverPath: '/demo%20book%20covers/iron_flame.jpg',
    confidence: 100,
  },
  {
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    coverPath: '/demo%20book%20covers/lessons_in_chemistry.jpg',
    confidence: 100,
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    coverPath: '/demo%20book%20covers/silent_patient.jpg',
    confidence: 100,
  },
  {
    title: 'The Atlas Six',
    author: 'Olivie Blake',
    coverPath: '/demo%20book%20covers/the_atlas_six.jpg',
    confidence: 100,
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverPath: '/demo%20book%20covers/the_midnight_library.jpg',
    confidence: 100,
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverPath: '/demo%20book%20covers/the_seven_husbands_of_evelyn_hugo.jpg',
    confidence: 100,
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverPath: '/demo%20book%20covers/tomorrow_tomorrow_tomorrow.jpg',
    confidence: 100,
  },
];

/**
 * Create a lookup map for O(1) access by title-author key
 */
const createCoverLookupMap = (): Map<string, StaticCoverMapping> => {
  const map = new Map<string, StaticCoverMapping>();
  
  for (const mapping of STATIC_COVER_MAPPINGS) {
    // Create normalized key for exact matching
    const exactKey = normalizeBookKey(mapping.title, mapping.author);
    map.set(exactKey, mapping);
    
    // Also create title-only key as fallback
    const titleOnlyKey = normalizeTitle(mapping.title);
    if (!map.has(titleOnlyKey)) {
      map.set(titleOnlyKey, mapping);
    }
  }
  
  return map;
};

/**
 * Normalize book key for consistent matching
 */
function normalizeBookKey(title: string, author: string): string {
  const normalizedTitle = normalizeTitle(title);
  const normalizedAuthor = normalizeAuthor(author);
  return `${normalizedTitle}|${normalizedAuthor}`;
}

/**
 * Normalize title for consistent matching
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Normalize author name for consistent matching
 */
function normalizeAuthor(author: string): string {
  return author
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Create the lookup map once
const STATIC_COVER_LOOKUP = createCoverLookupMap();

/**
 * Get static cover for a book if it exists
 * @param title Book title
 * @param author Book author
 * @returns Static cover path or null if not found
 */
export function getStaticCover(title: string, author: string): string | null {
  if (!title || !author) return null;
  
  // Try exact title-author match first
  const exactKey = normalizeBookKey(title, author);
  const exactMatch = STATIC_COVER_LOOKUP.get(exactKey);
  if (exactMatch) {
    console.log(`📚 [STATIC COVER] Found exact match for "${title}" by ${author}: ${exactMatch.coverPath}`);
    return exactMatch.coverPath;
  }
  
  // Try title-only match as fallback
  const titleOnlyKey = normalizeTitle(title);
  const titleMatch = STATIC_COVER_LOOKUP.get(titleOnlyKey);
  if (titleMatch) {
    console.log(`📚 [STATIC COVER] Found title-only match for "${title}": ${titleMatch.coverPath}`);
    return titleMatch.coverPath;
  }
  
  // No static cover found
  return null;
}

/**
 * Check if a book has a static cover available
 * @param title Book title
 * @param author Book author
 * @returns true if static cover exists
 */
export function hasStaticCover(title: string, author: string): boolean {
  return getStaticCover(title, author) !== null;
}

/**
 * Get all available static cover mappings
 * @returns Array of all static cover mappings
 */
export function getAllStaticCoverMappings(): StaticCoverMapping[] {
  return [...STATIC_COVER_MAPPINGS];
}

/**
 * Debug function to log all available static covers
 */
export function debugStaticCovers(): void {
  console.log('📚 Available static covers:');
  STATIC_COVER_MAPPINGS.forEach((mapping, index) => {
    console.log(`  ${index + 1}. "${mapping.title}" by ${mapping.author} → ${mapping.coverPath}`);
  });
  console.log(`📊 Total: ${STATIC_COVER_MAPPINGS.length} static covers available`);
}