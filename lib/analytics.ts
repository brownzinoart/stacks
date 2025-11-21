import { ReadingProgressEnhanced, ReadingStats, Book, MonthlyReadingData, GenreData, AuthorData } from './mockData';

export function calculateStats(
  progress: ReadingProgressEnhanced[],
  books: Book[],
  period: 'all' | 'year' | 'month'
): ReadingStats {
  // Filter by period
  const now = new Date();
  const filteredProgress = progress.filter(p => {
    if (!p.finishedDate) return false;

    switch (period) {
      case 'year':
        return p.finishedDate.getFullYear() === now.getFullYear();
      case 'month':
        return p.finishedDate.getMonth() === now.getMonth() &&
               p.finishedDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const booksRead = filteredProgress.length;
  const pagesRead = filteredProgress.reduce((sum, p) => sum + p.totalPages, 0);

  // Average rating (only rated books)
  const ratedBooks = filteredProgress.filter(p => p.userRating);
  const avgRating = ratedBooks.length > 0
    ? ratedBooks.reduce((sum, p) => sum + (p.userRating || 0), 0) / ratedBooks.length
    : 0;

  // Streaks
  const allCheckIns = progress.flatMap(p => p.dailyCheckIns).sort((a, b) => a.date.getTime() - b.date.getTime());
  const { current, longest } = calculateStreaks(allCheckIns);

  // Fastest and slowest books
  const { fastest, slowest } = getFastestAndSlowest(filteredProgress, books);

  // Reading pace
  const readingPace = calculateReadingPace(filteredProgress);

  // Top genres
  const topGenres = getGenreDistribution(filteredProgress, books);

  // Top authors
  const topAuthors = getTopAuthors(filteredProgress, books);

  // Monthly reading
  const monthlyReading = getMonthlyReading(filteredProgress);

  // Rating distribution
  const ratingDistribution = getRatingDistribution(filteredProgress);

  // Time of day preference
  const timeOfDayPreference = getTimeOfDayPattern(progress);

  return {
    userId: "user-1",
    period,
    booksRead,
    pagesRead,
    avgRating,
    currentStreak: current,
    longestStreak: longest,
    fastestBook: fastest,
    slowestBook: slowest,
    topGenres,
    topAuthors,
    monthlyReading,
    ratingDistribution,
    readingPace,
    timeOfDayPreference
  };
}

function calculateStreaks(checkIns: { date: Date; pagesRead: number }[]): { current: number; longest: number } {
  if (checkIns.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < checkIns.length; i++) {
    const current = checkIns[i];
    const previous = checkIns[i - 1];
    if (!current || !previous) continue;
    const dayDiff = Math.floor(
      (current.date.getTime() - previous.date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (dayDiff > 1) {
      tempStreak = 1;
    }
  }

  // Calculate current streak from most recent check-in
  const lastCheckIn = checkIns[checkIns.length - 1];
  const daysSinceLastCheckIn = lastCheckIn ? Math.floor(
    (new Date().getTime() - lastCheckIn.date.getTime()) / (1000 * 60 * 60 * 24)
  ) : Infinity;

  currentStreak = daysSinceLastCheckIn <= 1 ? tempStreak : 0;

  return { current: currentStreak, longest: longestStreak };
}

function getFastestAndSlowest(
  progress: ReadingProgressEnhanced[],
  books: Book[]
): {
  fastest: { bookId: string; title: string; days: number; pagesPerDay: number };
  slowest: { bookId: string; title: string; days: number; pagesPerDay: number };
} {
  const finishedBooks = progress.filter(p => p.finishedDate);

  if (finishedBooks.length === 0) {
    return {
      fastest: { bookId: "", title: "N/A", days: 0, pagesPerDay: 0 },
      slowest: { bookId: "", title: "N/A", days: 0, pagesPerDay: 0 }
    };
  }

  const booksWithDays = finishedBooks.map(p => {
    const days = Math.ceil(
      (p.finishedDate!.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const book = books.find(b => b.id === p.bookId);
    return {
      bookId: p.bookId,
      title: book?.title || "Unknown",
      days,
      pagesPerDay: Math.round(p.totalPages / days)
    };
  });

  const fastest = booksWithDays.reduce((min, book) => book.days < min.days ? book : min);
  const slowest = booksWithDays.reduce((max, book) => book.days > max.days ? book : max);

  return { fastest, slowest };
}

function calculateReadingPace(progress: ReadingProgressEnhanced[]): number {
  const allCheckIns = progress.flatMap(p => p.dailyCheckIns);
  const totalPages = allCheckIns.reduce((sum, c) => sum + c.pagesRead, 0);
  const uniqueDays = new Set(allCheckIns.map(c => c.date.toDateString())).size;

  return uniqueDays > 0 ? Math.round(totalPages / uniqueDays) : 0;
}

export function getGenreDistribution(
  progress: ReadingProgressEnhanced[],
  books: Book[]
): GenreData[] {
  const genreCounts: Record<string, number> = {};
  const finishedBooks = progress.filter(p => p.finishedDate);

  finishedBooks.forEach(p => {
    const book = books.find(b => b.id === p.bookId);
    if (book) {
      book.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  const total = finishedBooks.length;
  const genreData = Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  return genreData;
}

export function getTopAuthors(
  progress: ReadingProgressEnhanced[],
  books: Book[]
): AuthorData[] {
  const authorCounts: Record<string, number> = {};
  const finishedBooks = progress.filter(p => p.finishedDate);

  finishedBooks.forEach(p => {
    const book = books.find(b => b.id === p.bookId);
    if (book) {
      authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    }
  });

  return Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMonthlyReading(progress: ReadingProgressEnhanced[]): MonthlyReadingData[] {
  const monthCounts: Record<string, { books: number; pages: number }> = {};

  progress.filter(p => p.finishedDate).forEach(p => {
    const month = p.finishedDate!.toLocaleString('default', { month: 'short' });
    if (!monthCounts[month]) {
      monthCounts[month] = { books: 0, pages: 0 };
    }
    monthCounts[month].books++;
    monthCounts[month].pages += p.totalPages;
  });

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return monthOrder
    .filter(month => monthCounts[month])
    .map(month => {
      const monthData = monthCounts[month];
      if (!monthData) return null;
      return {
        month,
        books: monthData.books,
        pages: monthData.pages
      };
    })
    .filter((item): item is { month: string; books: number; pages: number } => item !== null);
}

function getRatingDistribution(progress: ReadingProgressEnhanced[]): { rating: number; count: number }[] {
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  progress.forEach(p => {
    if (p.userRating && p.userRating >= 1 && p.userRating <= 5) {
      ratingCounts[p.userRating] = (ratingCounts[p.userRating] || 0) + 1;
    }
  });

  return Object.entries(ratingCounts).map(([rating, count]) => ({
    rating: parseInt(rating),
    count
  }));
}

function getTimeOfDayPattern(
  progress: ReadingProgressEnhanced[]
): { morning: number; afternoon: number; evening: number; night: number } {
  const timePattern = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  progress.forEach(p => {
    p.dailyCheckIns.forEach(checkIn => {
      if (checkIn) {
        timePattern[checkIn.timeOfDay]++;
      }
    });
  });

  return timePattern;
}

export function generateFunFacts(stats: ReadingStats, books: Book[]): string[] {
  const facts: string[] = [];

  // Genre fanatic
  if (stats.topGenres.length > 0 && stats.topGenres[0] && stats.topGenres[0].percentage >= 40) {
    facts.push(`You're a ${stats.topGenres[0].genre.toLowerCase()} fanatic!`);
  }

  // Speed reader
  if (stats.fastestBook && stats.fastestBook.pagesPerDay > 100) {
    facts.push(`Speed demon alert: ${stats.fastestBook.pagesPerDay} pages/day on ${stats.fastestBook.title}!`);
  }

  // Superfan
  if (stats.topAuthors.length > 0 && stats.topAuthors[0] && stats.topAuthors[0].count >= 3) {
    facts.push(`${stats.topAuthors[0].author} superfan detected! (${stats.topAuthors[0].count} books)`);
  }

  // Night owl
  const totalReadings = Object.values(stats.timeOfDayPreference).reduce((a, b) => a + b, 0);
  const nightPercentage = Math.round((stats.timeOfDayPreference.night / totalReadings) * 100);
  if (nightPercentage >= 50) {
    facts.push(`Night owl reader - ${nightPercentage}% after 8pm`);
  }

  // Pages milestone
  if (stats.pagesRead >= 10000) {
    facts.push(`That's enough pages to climb Mount Everest! (${stats.pagesRead.toLocaleString()} pages)`);
  }

  // Movie comparison
  const movieEquivalent = Math.floor(stats.pagesRead / 200);
  if (movieEquivalent > 10) {
    facts.push(`Could've watched ${movieEquivalent} movies instead`);
  }

  return facts;
}
