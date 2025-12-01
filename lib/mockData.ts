/**
 * DEPRECATED: This file is maintained for backward compatibility.
 * 
 * Types have been moved to: lib/types/
 * Data has been moved to: lib/data/
 * Helper functions have been moved to: lib/utils/mockHelpers.ts
 * 
 * Please update imports to use the new locations directly.
 */

// ============================================
// TYPE RE-EXPORTS - From lib/types/
// ============================================
export type {
  Book,
  BookMetadata,
  BookMatch,
  BookReview,
  BookDetail,
  MatchLevel,
  User,
  UserReadingProfile,
  UserLibrary,
  Stack,
  Comment,
  ReadingProgress,
  ReadingProgressEnhanced,
  ReadingStats,
  DailyCheckIn,
  MonthlyReadingData,
  GenreData,
  AuthorData,
  SearchQuery,
  SearchResult,
  BookSearchMatch,
  NaturalLanguageSearchResult,
} from './types';

// ============================================
// DATA RE-EXPORTS - From lib/data/
// ============================================
export {
  // User data
  currentUser,
  mockUsers,
  getUserById,
  // Book data
  mockBooks,
  mockBooksWithMetadata,
  getBookById,
  getSimilarBooks,
  // Stack data
  mockStacks,
  mockComments,
  // Reading data
  mockReadingProgress,
  mockReadingProgressEnhanced,
  mockCurrentUserProfile,
  getBooksReadByUser,
  getUserFavoriteBooks,
} from './data';

// ============================================
// HELPER FUNCTION RE-EXPORTS - From lib/utils/mockHelpers.ts
// ============================================
export {
  getMockSearchResults,
  getMockBookDetail,
  getBookDetailWithAPIs,
} from './utils/mockHelpers';
