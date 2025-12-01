/**
 * Reading analytics type definitions
 */

export interface ReadingProgress {
  id: string;
  bookId: string;
  startDate: string;
  endDate: string;
  currentPage: number;
  totalPages: number;
  status: "reading" | "finished" | "abandoned";
}

export interface DailyCheckIn {
  date: Date;
  pagesRead: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export interface ReadingProgressEnhanced extends Omit<ReadingProgress, 'startDate' | 'endDate'> {
  startDate: Date;
  finishedDate: Date | null;
  userRating?: number; // 1-5 stars
  dailyCheckIns: DailyCheckIn[];
  userId: string;
}

export interface ReadingStats {
  userId: string;
  period: "all" | "year" | "month";
  booksRead: number;
  pagesRead: number;
  avgRating: number;
  currentStreak: number;
  longestStreak: number;
  fastestBook: { bookId: string; title: string; days: number; pagesPerDay: number };
  slowestBook: { bookId: string; title: string; days: number; pagesPerDay: number };
  topGenres: { genre: string; count: number; percentage: number }[];
  topAuthors: { author: string; count: number }[];
  monthlyReading: { month: string; books: number; pages: number }[];
  ratingDistribution: { rating: number; count: number }[];
  readingPace: number; // avg pages per day
  timeOfDayPreference: { morning: number; afternoon: number; evening: number; night: number };
}

export interface MonthlyReadingData {
  month: string;
  books: number;
  pages: number;
}

export interface GenreData {
  genre: string;
  count: number;
  percentage: number;
}

export interface AuthorData {
  author: string;
  count: number;
}

