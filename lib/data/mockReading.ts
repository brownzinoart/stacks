/**
 * Mock reading progress and profile data
 */

import type { ReadingProgress, ReadingProgressEnhanced, UserReadingProfile, Book } from '../types';
import { mockBooksWithMetadata } from './mockBooks';

// Current user's reading progress
export const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    bookId: "book-2",
    startDate: "2024-10-20",
    endDate: "2024-11-10",
    currentPage: 156,
    totalPages: 419,
    status: "reading",
  },
];

// Mock Reading Progress with patterns
export const mockReadingProgressEnhanced: ReadingProgressEnhanced[] = [
  // The Cruel Prince - Lightning fast binge read! (finished in 2 days)
  {
    id: "rp-1",
    bookId: "book-7",
    userId: "user-1",
    startDate: new Date("2024-03-15"),
    finishedDate: new Date("2024-03-17"),
    currentPage: 370,
    totalPages: 370,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-03-15"), pagesRead: 185, timeOfDay: "night" },
      { date: new Date("2024-03-16"), pagesRead: 140, timeOfDay: "evening" },
      { date: new Date("2024-03-17"), pagesRead: 45, timeOfDay: "morning" },
    ]
  },
  // Fourth Wing - Currently reading - SLIGHTLY BEHIND (-3% delta)
  {
    id: "rp-2",
    bookId: "book-1",
    userId: "user-1",
    startDate: new Date("2025-11-01"),
    finishedDate: null,
    currentPage: 234, // 47% - slightly behind ideal of 50%
    totalPages: 498,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2025-11-01"), pagesRead: 25, timeOfDay: "night" },
      { date: new Date("2025-11-02"), pagesRead: 22, timeOfDay: "evening" },
      { date: new Date("2025-11-03"), pagesRead: 20, timeOfDay: "night" },
      { date: new Date("2025-11-05"), pagesRead: 18, timeOfDay: "afternoon" },
      { date: new Date("2025-11-07"), pagesRead: 23, timeOfDay: "night" },
      { date: new Date("2025-11-09"), pagesRead: 21, timeOfDay: "evening" },
      { date: new Date("2025-11-11"), pagesRead: 19, timeOfDay: "night" },
      { date: new Date("2025-11-13"), pagesRead: 17, timeOfDay: "afternoon" },
      { date: new Date("2025-11-15"), pagesRead: 20, timeOfDay: "night" },
      { date: new Date("2025-11-17"), pagesRead: 16, timeOfDay: "evening" },
      { date: new Date("2025-11-19"), pagesRead: 18, timeOfDay: "night" },
      { date: new Date("2025-11-21"), pagesRead: 15, timeOfDay: "afternoon" },
    ],
  },
  // It Ends With Us - BEHIND (-8% delta)
  {
    id: "rp-8",
    bookId: "book-5",
    userId: "user-1",
    startDate: new Date("2025-11-05"),
    finishedDate: null,
    currentPage: 123, // 32% - behind ideal of 40%
    totalPages: 384,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2025-11-05"), pagesRead: 15, timeOfDay: "morning" },
      { date: new Date("2025-11-06"), pagesRead: 12, timeOfDay: "afternoon" },
      { date: new Date("2025-11-08"), pagesRead: 14, timeOfDay: "night" },
      { date: new Date("2025-11-10"), pagesRead: 11, timeOfDay: "evening" },
      { date: new Date("2025-11-12"), pagesRead: 13, timeOfDay: "afternoon" },
      { date: new Date("2025-11-14"), pagesRead: 10, timeOfDay: "night" },
      { date: new Date("2025-11-16"), pagesRead: 12, timeOfDay: "morning" },
      { date: new Date("2025-11-18"), pagesRead: 9, timeOfDay: "evening" },
      { date: new Date("2025-11-20"), pagesRead: 14, timeOfDay: "night" },
      { date: new Date("2025-11-22"), pagesRead: 13, timeOfDay: "afternoon" },
    ],
  },
  // Six of Crows - Solid 5-star read (finished early June)
  {
    id: "rp-3",
    bookId: "book-6",
    userId: "user-1",
    startDate: new Date("2024-06-01"),
    finishedDate: new Date("2024-06-12"),
    currentPage: 465,
    totalPages: 465,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-06-01"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-06-02"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-06-03"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-06-05"), pagesRead: 52, timeOfDay: "afternoon" },
      { date: new Date("2024-06-07"), pagesRead: 46, timeOfDay: "night" },
      { date: new Date("2024-06-08"), pagesRead: 49, timeOfDay: "night" },
      { date: new Date("2024-06-09"), pagesRead: 51, timeOfDay: "evening" },
      { date: new Date("2024-06-10"), pagesRead: 42, timeOfDay: "night" },
      { date: new Date("2024-06-11"), pagesRead: 40, timeOfDay: "night" },
      { date: new Date("2024-06-12"), pagesRead: 42, timeOfDay: "afternoon" },
    ]
  },
  // A Court of Thorns and Roses - ON TRACK (+1% delta)
  {
    id: "rp-4",
    bookId: "book-2",
    userId: "user-1",
    startDate: new Date("2025-11-08"),
    finishedDate: null,
    currentPage: 214, // 51% - on track with ideal of 50%
    totalPages: 419,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2025-11-08"), pagesRead: 18, timeOfDay: "night" },
      { date: new Date("2025-11-09"), pagesRead: 16, timeOfDay: "evening" },
      { date: new Date("2025-11-10"), pagesRead: 14, timeOfDay: "night" },
      { date: new Date("2025-11-11"), pagesRead: 15, timeOfDay: "afternoon" },
      { date: new Date("2025-11-12"), pagesRead: 13, timeOfDay: "night" },
      { date: new Date("2025-11-13"), pagesRead: 15, timeOfDay: "evening" },
      { date: new Date("2025-11-14"), pagesRead: 12, timeOfDay: "night" },
      { date: new Date("2025-11-15"), pagesRead: 14, timeOfDay: "afternoon" },
      { date: new Date("2025-11-16"), pagesRead: 14, timeOfDay: "night" },
      { date: new Date("2025-11-18"), pagesRead: 15, timeOfDay: "evening" },
      { date: new Date("2025-11-19"), pagesRead: 13, timeOfDay: "night" },
      { date: new Date("2025-11-20"), pagesRead: 15, timeOfDay: "afternoon" },
      { date: new Date("2025-11-21"), pagesRead: 14, timeOfDay: "night" },
      { date: new Date("2025-11-22"), pagesRead: 14, timeOfDay: "evening" },
      { date: new Date("2025-11-23"), pagesRead: 12, timeOfDay: "morning" },
    ],
  },
  // The Song of Achilles - Beautiful but heartbreaking (finished in January)
  {
    id: "rp-5",
    bookId: "book-4",
    userId: "user-1",
    startDate: new Date("2024-01-05"),
    finishedDate: new Date("2024-01-12"),
    currentPage: 352,
    totalPages: 352,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-01-05"), pagesRead: 52, timeOfDay: "night" },
      { date: new Date("2024-01-06"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-01-07"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-01-08"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-01-10"), pagesRead: 43, timeOfDay: "afternoon" },
      { date: new Date("2024-01-11"), pagesRead: 47, timeOfDay: "night" },
      { date: new Date("2024-01-12"), pagesRead: 67, timeOfDay: "night" },
    ]
  },
  // The Secret History - Slow burn (took 3 weeks, meh ending)
  {
    id: "rp-6",
    bookId: "book-3",
    userId: "user-1",
    startDate: new Date("2024-08-15"),
    finishedDate: new Date("2024-09-05"),
    currentPage: 559,
    totalPages: 559,
    status: "finished",
    userRating: 3,
    dailyCheckIns: [
      { date: new Date("2024-08-15"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-08-16"), pagesRead: 25, timeOfDay: "evening" },
      { date: new Date("2024-08-18"), pagesRead: 30, timeOfDay: "afternoon" },
      { date: new Date("2024-08-20"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-08-22"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-08-24"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-08-26"), pagesRead: 25, timeOfDay: "night" },
      { date: new Date("2024-08-28"), pagesRead: 28, timeOfDay: "night" },
      { date: new Date("2024-08-30"), pagesRead: 24, timeOfDay: "afternoon" },
      { date: new Date("2024-09-01"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-09-02"), pagesRead: 27, timeOfDay: "evening" },
      { date: new Date("2024-09-03"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-09-04"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-09-05"), pagesRead: 202, timeOfDay: "night" }, // Marathon finish to just get it done
    ]
  },
  // Normal People - Gave up after 150 pages (not my vibe)
  {
    id: "rp-7",
    bookId: "book-8",
    userId: "user-1",
    startDate: new Date("2024-04-12"),
    finishedDate: null,
    currentPage: 152,
    totalPages: 266,
    status: "abandoned",
    dailyCheckIns: [
      { date: new Date("2024-04-12"), pagesRead: 38, timeOfDay: "night" },
      { date: new Date("2024-04-13"), pagesRead: 35, timeOfDay: "evening" },
      { date: new Date("2024-04-15"), pagesRead: 29, timeOfDay: "afternoon" },
      { date: new Date("2024-04-18"), pagesRead: 22, timeOfDay: "night" },
      { date: new Date("2024-04-21"), pagesRead: 28, timeOfDay: "night" },
    ]
  },
  // Iron Flame - Devoured it! (Feb 2024)
  {
    id: "rp-9",
    bookId: "book-9",
    userId: "user-1",
    startDate: new Date("2024-02-10"),
    finishedDate: new Date("2024-02-22"),
    currentPage: 623,
    totalPages: 623,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-02-10"), pagesRead: 62, timeOfDay: "night" },
      { date: new Date("2024-02-11"), pagesRead: 58, timeOfDay: "morning" },
      { date: new Date("2024-02-12"), pagesRead: 55, timeOfDay: "night" },
      { date: new Date("2024-02-13"), pagesRead: 48, timeOfDay: "evening" },
      { date: new Date("2024-02-15"), pagesRead: 52, timeOfDay: "afternoon" },
      { date: new Date("2024-02-16"), pagesRead: 60, timeOfDay: "night" },
      { date: new Date("2024-02-17"), pagesRead: 54, timeOfDay: "night" },
      { date: new Date("2024-02-19"), pagesRead: 50, timeOfDay: "morning" },
      { date: new Date("2024-02-20"), pagesRead: 56, timeOfDay: "evening" },
      { date: new Date("2024-02-21"), pagesRead: 63, timeOfDay: "night" },
      { date: new Date("2024-02-22"), pagesRead: 65, timeOfDay: "afternoon" },
    ]
  },
  // House of Earth and Blood - Epic but exhausting (May 2024)
  {
    id: "rp-10",
    bookId: "book-10",
    userId: "user-1",
    startDate: new Date("2024-05-01"),
    finishedDate: new Date("2024-05-28"),
    currentPage: 803,
    totalPages: 803,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-05-01"), pagesRead: 35, timeOfDay: "night" },
      { date: new Date("2024-05-02"), pagesRead: 32, timeOfDay: "evening" },
      { date: new Date("2024-05-04"), pagesRead: 28, timeOfDay: "afternoon" },
      { date: new Date("2024-05-06"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-05-08"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-05-10"), pagesRead: 33, timeOfDay: "morning" },
      { date: new Date("2024-05-12"), pagesRead: 29, timeOfDay: "evening" },
      { date: new Date("2024-05-14"), pagesRead: 31, timeOfDay: "afternoon" },
      { date: new Date("2024-05-16"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-05-18"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-05-20"), pagesRead: 30, timeOfDay: "morning" },
      { date: new Date("2024-05-22"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-05-24"), pagesRead: 32, timeOfDay: "afternoon" },
      { date: new Date("2024-05-26"), pagesRead: 148, timeOfDay: "night" },
      { date: new Date("2024-05-27"), pagesRead: 160, timeOfDay: "afternoon" },
      { date: new Date("2024-05-28"), pagesRead: 140, timeOfDay: "night" },
    ]
  },
  // The Atlas Six - Reading ahead of schedule! (+10% delta - AHEAD)
  {
    id: "rp-11",
    bookId: "book-11",
    userId: "user-1",
    startDate: new Date("2025-11-18"),
    finishedDate: null,
    currentPage: 82, // 22% complete
    totalPages: 373,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2025-11-18"), pagesRead: 20, timeOfDay: "night" },
      { date: new Date("2025-11-19"), pagesRead: 18, timeOfDay: "evening" },
      { date: new Date("2025-11-20"), pagesRead: 16, timeOfDay: "night" },
      { date: new Date("2025-11-21"), pagesRead: 14, timeOfDay: "afternoon" },
      { date: new Date("2025-11-22"), pagesRead: 14, timeOfDay: "night" },
    ],
  },
  // Circe - Madeline Miller does it again! (Oct 2024)
  {
    id: "rp-12",
    bookId: "book-12",
    userId: "user-1",
    startDate: new Date("2024-10-08"),
    finishedDate: new Date("2024-10-20"),
    currentPage: 400,
    totalPages: 400,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-10-08"), pagesRead: 35, timeOfDay: "night" },
      { date: new Date("2024-10-09"), pagesRead: 32, timeOfDay: "evening" },
      { date: new Date("2024-10-10"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-11"), pagesRead: 28, timeOfDay: "afternoon" },
      { date: new Date("2024-10-12"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-10-13"), pagesRead: 36, timeOfDay: "evening" },
      { date: new Date("2024-10-14"), pagesRead: 31, timeOfDay: "night" },
      { date: new Date("2024-10-15"), pagesRead: 33, timeOfDay: "afternoon" },
      { date: new Date("2024-10-16"), pagesRead: 29, timeOfDay: "night" },
      { date: new Date("2024-10-17"), pagesRead: 35, timeOfDay: "evening" },
      { date: new Date("2024-10-18"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-10-19"), pagesRead: 30, timeOfDay: "afternoon" },
      { date: new Date("2024-10-20"), pagesRead: 55, timeOfDay: "night" },
    ]
  },
];

// Current user's reading profile
export const mockCurrentUserProfile: UserReadingProfile = {
  userId: "user-1",
  favoriteGenres: ["Thriller", "Dark Fantasy", "Science Fiction"],
  favoriteAuthors: ["Andy Weir", "Leigh Bardugo", "Alex Michaelides"],
  favoriteTropes: ["unreliable narrator", "plot twist", "dark academia", "found family"],
  dislikedTropes: ["love triangle", "instalove"],
  preferredMood: ["dark", "suspenseful", "character-driven"],
  readingHistory: [
    { bookId: "book-1", rating: 5, finishedDate: "2024-10-15" },
    { bookId: "book-3", rating: 5, finishedDate: "2024-09-22" },
    { bookId: "book-4", rating: 4, finishedDate: "2024-08-10" },
    // Removed book-5 (The House in the Cerulean Sea) so it can appear in cozy fantasy searches
  ],
  engagementHistory: {
    likedStackIds: ["stack-1", "stack-3"],
    savedStackIds: ["stack-2"],
    commentedStackIds: ["stack-1"]
  }
};

// Get books user has already read
export function getBooksReadByUser(userId: string): string[] {
  if (userId === "user-1") {
    return mockCurrentUserProfile.readingHistory.map(h => h.bookId);
  }
  return [];
}

// Get user's favorite books (rating >= 4)
export function getUserFavoriteBooks(userId: string): Book[] {
  if (userId === "user-1") {
    const favoriteIds = mockCurrentUserProfile.readingHistory
      .filter(h => h.rating && h.rating >= 4)
      .map(h => h.bookId);
    return mockBooksWithMetadata.filter(b => favoriteIds.includes(b.id));
  }
  return [];
}

