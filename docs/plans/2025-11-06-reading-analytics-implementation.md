# Reading Analytics Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive, mobile-first reading analytics dashboard within the Reading tab with interactive charts, summary stats, and personalized insights.

**Architecture:** StoryGraph-inspired analytics using Recharts library for visualizations. Mock data with realistic patterns. Hero section dividers between chart groups. Lazy-loaded charts for performance. Mobile-first responsive design.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, react-intersection-observer

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Recharts and intersection observer**

```bash
npm install recharts react-intersection-observer
```

Expected: Dependencies added to package.json

**Step 2: Verify installation**

```bash
npm list recharts react-intersection-observer
```

Expected: Both packages listed with versions

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add recharts and react-intersection-observer dependencies"
```

---

## Task 2: Create Enhanced Data Model Interfaces

**Files:**
- Modify: `lib/mockData.ts`

**Step 1: Add new interfaces to mockData.ts**

Add after existing `ReadingProgress` interface (around line 50):

```typescript
export interface DailyCheckIn {
  date: Date;
  pagesRead: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

export interface ReadingProgressEnhanced extends ReadingProgress {
  startDate: Date;
  finishedDate: Date | null;
  userRating?: number; // 1-5 stars
  dailyCheckIns: DailyCheckIn[];
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
```

**Step 2: Commit**

```bash
git add lib/mockData.ts
git commit -m "feat: add reading analytics data model interfaces"
```

---

## Task 3: Create Mock Reading Progress Data

**Files:**
- Modify: `lib/mockData.ts`

**Step 1: Add mock reading progress data at end of file**

```typescript
// Mock Reading Progress with patterns
export const mockReadingProgress: ReadingProgressEnhanced[] = [
  // The Cruel Prince - Speed read (3 days)
  {
    id: "rp-1",
    bookId: "book-7",
    userId: "user-1",
    startDate: new Date("2024-03-15"),
    finishedDate: new Date("2024-03-18"),
    currentPage: 370,
    totalPages: 370,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-03-15"), pagesRead: 120, timeOfDay: "night" },
      { date: new Date("2024-03-16"), pagesRead: 125, timeOfDay: "night" },
      { date: new Date("2024-03-17"), pagesRead: 125, timeOfDay: "evening" },
    ]
  },
  // Fourth Wing - Currently reading
  {
    id: "rp-2",
    bookId: "book-1",
    userId: "user-1",
    startDate: new Date("2024-10-25"),
    finishedDate: null,
    currentPage: 139,
    totalPages: 498,
    status: "reading",
    dailyCheckIns: [
      { date: new Date("2024-10-25"), pagesRead: 45, timeOfDay: "night" },
      { date: new Date("2024-10-26"), pagesRead: 38, timeOfDay: "evening" },
      { date: new Date("2024-10-28"), pagesRead: 56, timeOfDay: "night" },
    ]
  },
  // Six of Crows - Recent finish
  {
    id: "rp-3",
    bookId: "book-6",
    userId: "user-1",
    startDate: new Date("2024-11-05"),
    finishedDate: new Date("2024-11-15"),
    currentPage: 465,
    totalPages: 465,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-11-05"), pagesRead: 50, timeOfDay: "night" },
      { date: new Date("2024-11-06"), pagesRead: 48, timeOfDay: "night" },
      { date: new Date("2024-11-07"), pagesRead: 45, timeOfDay: "evening" },
      { date: new Date("2024-11-08"), pagesRead: 52, timeOfDay: "night" },
      { date: new Date("2024-11-09"), pagesRead: 46, timeOfDay: "night" },
      { date: new Date("2024-11-10"), pagesRead: 49, timeOfDay: "night" },
      { date: new Date("2024-11-11"), pagesRead: 51, timeOfDay: "evening" },
      { date: new Date("2024-11-12"), pagesRead: 42, timeOfDay: "night" },
      { date: new Date("2024-11-13"), pagesRead: 40, timeOfDay: "night" },
      { date: new Date("2024-11-15"), pagesRead: 42, timeOfDay: "afternoon" },
    ]
  },
  // A Court of Thorns and Roses
  {
    id: "rp-4",
    bookId: "book-2",
    userId: "user-1",
    startDate: new Date("2024-11-01"),
    finishedDate: new Date("2024-11-08"),
    currentPage: 419,
    totalPages: 419,
    status: "finished",
    userRating: 4,
    dailyCheckIns: [
      { date: new Date("2024-11-01"), pagesRead: 60, timeOfDay: "night" },
      { date: new Date("2024-11-02"), pagesRead: 58, timeOfDay: "night" },
      { date: new Date("2024-11-03"), pagesRead: 62, timeOfDay: "evening" },
      { date: new Date("2024-11-04"), pagesRead: 55, timeOfDay: "night" },
      { date: new Date("2024-11-06"), pagesRead: 65, timeOfDay: "night" },
      { date: new Date("2024-11-07"), pagesRead: 59, timeOfDay: "night" },
      { date: new Date("2024-11-08"), pagesRead: 60, timeOfDay: "afternoon" },
    ]
  },
  // The Song of Achilles
  {
    id: "rp-5",
    bookId: "book-4",
    userId: "user-1",
    startDate: new Date("2024-10-20"),
    finishedDate: new Date("2024-11-02"),
    currentPage: 352,
    totalPages: 352,
    status: "finished",
    userRating: 5,
    dailyCheckIns: [
      { date: new Date("2024-10-20"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-21"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-10-22"), pagesRead: 25, timeOfDay: "night" },
      { date: new Date("2024-10-23"), pagesRead: 32, timeOfDay: "afternoon" },
      { date: new Date("2024-10-25"), pagesRead: 27, timeOfDay: "night" },
      { date: new Date("2024-10-26"), pagesRead: 30, timeOfDay: "night" },
      { date: new Date("2024-10-28"), pagesRead: 28, timeOfDay: "evening" },
      { date: new Date("2024-10-29"), pagesRead: 26, timeOfDay: "night" },
      { date: new Date("2024-10-31"), pagesRead: 34, timeOfDay: "night" },
      { date: new Date("2024-11-01"), pagesRead: 32, timeOfDay: "night" },
      { date: new Date("2024-11-02"), pagesRead: 60, timeOfDay: "afternoon" },
    ]
  },
  // The Secret History - Slow read
  {
    id: "rp-6",
    bookId: "book-3",
    userId: "user-1",
    startDate: new Date("2024-08-15"),
    finishedDate: new Date("2024-09-05"),
    currentPage: 559,
    totalPages: 559,
    status: "finished",
    userRating: 4,
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
      { date: new Date("2024-09-05"), pagesRead: 202, timeOfDay: "night" }, // Marathon finish
    ]
  },
];
```

**Step 2: Commit**

```bash
git add lib/mockData.ts
git commit -m "feat: add mock reading progress data with patterns"
```

---

## Task 4: Create Analytics Utility Functions

**Files:**
- Create: `lib/analytics.ts`

**Step 1: Create analytics utility file**

```typescript
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
    const dayDiff = Math.floor(
      (checkIns[i].date.getTime() - checkIns[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)
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
  const daysSinceLastCheckIn = Math.floor(
    (new Date().getTime() - lastCheckIn.date.getTime()) / (1000 * 60 * 60 * 24)
  );

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
    .map(month => ({
      month,
      books: monthCounts[month].books,
      pages: monthCounts[month].pages
    }));
}

function getRatingDistribution(progress: ReadingProgressEnhanced[]): { rating: number; count: number }[] {
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  progress.forEach(p => {
    if (p.userRating) {
      ratingCounts[p.userRating]++;
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
      timePattern[checkIn.timeOfDay]++;
    });
  });

  return timePattern;
}

export function generateFunFacts(stats: ReadingStats, books: Book[]): string[] {
  const facts: string[] = [];

  // Genre fanatic
  if (stats.topGenres.length > 0 && stats.topGenres[0].percentage >= 40) {
    facts.push(`You're a ${stats.topGenres[0].genre.toLowerCase()} fanatic!`);
  }

  // Speed reader
  if (stats.fastestBook.pagesPerDay > 100) {
    facts.push(`Speed demon alert: ${stats.fastestBook.pagesPerDay} pages/day on ${stats.fastestBook.title}!`);
  }

  // Superfan
  if (stats.topAuthors.length > 0 && stats.topAuthors[0].count >= 3) {
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
```

**Step 2: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat: add analytics calculation utility functions"
```

---

## Task 5: Create Summary Stats Grid Component

**Files:**
- Create: `app/reading/components/SummaryStatsGrid.tsx`

**Step 1: Create summary stats component**

```typescript
"use client";

import { ReadingStats } from "@/lib/mockData";

interface SummaryStatsGridProps {
  stats: ReadingStats;
}

export default function SummaryStatsGrid({ stats }: SummaryStatsGridProps) {
  const statCards = [
    {
      emoji: "📚",
      label: "Books Read",
      value: stats.booksRead.toString()
    },
    {
      emoji: "📄",
      label: "Pages Read",
      value: stats.pagesRead.toLocaleString()
    },
    {
      emoji: "⭐",
      label: "Avg Rating",
      value: `${stats.avgRating.toFixed(1)} / 5`
    },
    {
      emoji: "🔥",
      label: "Streak",
      value: `${stats.currentStreak} days`
    },
    {
      emoji: "⚡",
      label: "Fastest Book",
      value: `${stats.fastestBook.days} days`
    },
    {
      emoji: "📊",
      label: "Pages/Day Avg",
      value: stats.readingPace.toString()
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="p-4 md:p-6 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl shadow-brutal-sm"
        >
          <div className="text-3xl mb-1">{card.emoji}</div>
          <div className="text-xs font-black uppercase text-gray-600 dark:text-gray-400 mb-1">
            {card.label}
          </div>
          <div className="text-3xl md:text-4xl font-black">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/reading/components/SummaryStatsGrid.tsx
git commit -m "feat: add summary stats grid component"
```

---

## Task 6: Create Time Period Tabs Component

**Files:**
- Create: `app/reading/components/StatsTimePeriodTabs.tsx`

**Step 1: Create time period tabs component**

```typescript
"use client";

interface StatsTimePeriodTabsProps {
  selected: "all" | "year" | "month";
  onChange: (period: "all" | "year" | "month") => void;
}

export default function StatsTimePeriodTabs({ selected, onChange }: StatsTimePeriodTabsProps) {
  const tabs = [
    { value: "all" as const, label: "ALL TIME" },
    { value: "year" as const, label: "THIS YEAR" },
    { value: "month" as const, label: "THIS MONTH" },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 min-w-[100px] px-4 py-3 border-4 border-black dark:border-white rounded-xl font-black text-sm transition-all ${
            selected === tab.value
              ? "bg-gradient-primary text-white shadow-brutal-sm"
              : "bg-white dark:bg-dark-secondary hover:shadow-brutal-sm"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/reading/components/StatsTimePeriodTabs.tsx
git commit -m "feat: add time period tabs component"
```

---

## Task 7: Create Hero Divider Component

**Files:**
- Create: `app/reading/components/HeroDivider.tsx`

**Step 1: Create hero divider component**

```typescript
"use client";

interface HeroDividerProps {
  title: string;
  subtitle: string;
  gradient: "primary" | "accent" | "success" | "info";
}

export default function HeroDivider({ title, subtitle, gradient }: HeroDividerProps) {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent",
    success: "bg-gradient-success",
    info: "bg-gradient-info",
  };

  return (
    <div
      className={`px-4 py-6 md:px-8 md:py-10 ${gradientClasses[gradient]} border-4 md:border-5 border-black dark:border-white rounded-xl shadow-brutal mb-6 text-center`}
    >
      <h3
        className="text-2xl md:text-4xl font-black uppercase mb-2 text-white"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        {title}
      </h3>
      <p
        className="text-base md:text-xl font-bold text-white"
        style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/reading/components/HeroDivider.tsx
git commit -m "feat: add hero divider component"
```

---

## Task 8: Create Reading Pace Chart Component

**Files:**
- Create: `app/reading/components/charts/ReadingPaceChart.tsx`

**Step 1: Create reading pace chart**

```typescript
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { MonthlyReadingData } from "@/lib/mockData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ReadingPaceChartProps {
  data: MonthlyReadingData[];
}

export default function ReadingPaceChart({ data }: ReadingPaceChartProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Show last 6 months on mobile, all on desktop
  const chartData = isMobile ? data.slice(-6) : data;

  // Find best month
  const bestMonth = data.reduce((max, month) =>
    month.books > max.books ? month : max,
    data[0]
  );

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3 px-4">
        📈 Reading Pace
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm mx-4">
        <div className="overflow-x-auto">
          <div style={{ minWidth: isMobile ? "500px" : "auto" }}>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={1.5} />
                <XAxis
                  dataKey="month"
                  stroke="#000"
                  strokeWidth={2}
                  style={{ fontSize: 11, fontWeight: 900 }}
                />
                <YAxis
                  stroke="#000"
                  strokeWidth={2}
                  style={{ fontSize: 11, fontWeight: 900 }}
                />
                <Bar
                  dataKey="books"
                  fill="url(#barGradient)"
                  stroke="#000"
                  strokeWidth={2}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isMobile && (
          <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
            ← Swipe to see more →
          </div>
        )}

        {bestMonth && (
          <div className="mt-4 text-sm font-bold text-center">
            🔥 <span className="font-black">{bestMonth.month}</span> was your best month! ({bestMonth.books} books)
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create useMediaQuery hook**

Create file: `hooks/useMediaQuery.ts`

```typescript
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
```

**Step 3: Commit**

```bash
git add app/reading/components/charts/ReadingPaceChart.tsx hooks/useMediaQuery.ts
git commit -m "feat: add reading pace bar chart component"
```

---

## Task 9: Create Reading Stats Section Wrapper

**Files:**
- Create: `app/reading/components/ReadingStatsSection.tsx`

**Step 1: Create main stats section wrapper**

```typescript
"use client";

import { useState, useMemo } from "react";
import { calculateStats, generateFunFacts } from "@/lib/analytics";
import { mockReadingProgress, mockBooks } from "@/lib/mockData";
import StatsTimePeriodTabs from "./StatsTimePeriodTabs";
import SummaryStatsGrid from "./SummaryStatsGrid";
import HeroDivider from "./HeroDivider";
import ReadingPaceChart from "./charts/ReadingPaceChart";

export default function ReadingStatsSection() {
  const [timePeriod, setTimePeriod] = useState<"all" | "year" | "month">("year");

  const stats = useMemo(
    () => calculateStats(mockReadingProgress, mockBooks, timePeriod),
    [timePeriod]
  );

  const funFacts = useMemo(
    () => generateFunFacts(stats, mockBooks),
    [stats]
  );

  return (
    <section className="mt-12 mb-24">
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight px-4 mb-4">
        📊 Reading Statistics
      </h2>

      <div className="px-4">
        <StatsTimePeriodTabs selected={timePeriod} onChange={setTimePeriod} />
      </div>

      <div className="px-4">
        <SummaryStatsGrid stats={stats} />
      </div>

      <HeroDivider
        title="Your Reading Journey"
        subtitle={`You've read ${stats.booksRead} books this ${timePeriod === 'all' ? 'lifetime' : timePeriod}! That's ${stats.pagesRead.toLocaleString()} pages of stories.`}
        gradient="primary"
      />

      <ReadingPaceChart data={stats.monthlyReading} />

      {/* Fun Facts */}
      {funFacts.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-lg md:text-xl font-black uppercase mb-3">
            🎉 Fun Facts
          </h3>
          <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm">
            <ul className="space-y-2">
              {funFacts.map((fact, index) => (
                <li key={index} className="text-sm md:text-base font-semibold">
                  • {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add reading stats section wrapper component"
```

---

## Task 10: Integrate Analytics into Reading Page

**Files:**
- Modify: `app/reading/page.tsx`

**Step 1: Import and add ReadingStatsSection to reading page**

Find the existing reading page and add the stats section after the finished books section:

```typescript
import ReadingStatsSection from "./components/ReadingStatsSection";

export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-24">
      {/* Existing content... currently reading cards, finished books */}

      {/* Add stats section */}
      <ReadingStatsSection />
    </div>
  );
}
```

**Step 2: Test in browser**

```bash
npm run dev
```

Navigate to http://localhost:3000/reading

Expected: See summary stats grid, time period tabs, hero divider, and reading pace chart

**Step 3: Commit**

```bash
git add app/reading/page.tsx
git commit -m "feat: integrate reading analytics into reading page"
```

---

## Task 11: Add Genre Distribution Pie Chart

**Files:**
- Create: `app/reading/components/charts/GenreDistributionChart.tsx`

**Step 1: Create genre pie chart component**

```typescript
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { GenreData } from "@/lib/mockData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface GenreDistributionChartProps {
  data: GenreData[];
}

const COLORS = ["#667eea", "#f093fb", "#fbbf24", "#10b981", "#ef4444", "#8b5cf6"];

export default function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Top 5 + Other on mobile
  const chartData = isMobile && data.length > 5
    ? [
        ...data.slice(0, 5),
        {
          genre: "Other",
          count: data.slice(5).reduce((sum, g) => sum + g.count, 0),
          percentage: data.slice(5).reduce((sum, g) => sum + g.percentage, 0)
        }
      ]
    : data;

  const topGenre = data[0];

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3 px-4">
        🎨 Genre Distribution
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm mx-4">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 120}
              stroke="#000"
              strokeWidth={3}
              label={!isMobile}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {chartData.map((genre, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-bold">
              <div
                className="w-4 h-4 border-2 border-black dark:border-white rounded flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="flex-1">{genre.genre}</span>
              <span className="font-black">{genre.percentage}%</span>
              <span className="text-gray-600 dark:text-gray-400">({genre.count})</span>
            </div>
          ))}
        </div>

        {topGenre && topGenre.percentage >= 40 && (
          <div className="mt-4 text-sm font-bold text-center">
            💜 You're a {topGenre.genre.toLowerCase()} fanatic!
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add to ReadingStatsSection**

In `app/reading/components/ReadingStatsSection.tsx`, import and add after ReadingPaceChart:

```typescript
import GenreDistributionChart from "./charts/GenreDistributionChart";

// Inside component, after ReadingPaceChart:
<HeroDivider
  title="Genre Explorer"
  subtitle={`You gravitate toward ${stats.topGenres[0]?.genre || 'various genres'} - your comfort zone!`}
  gradient="accent"
/>

<GenreDistributionChart data={stats.topGenres} />
```

**Step 3: Commit**

```bash
git add app/reading/components/charts/GenreDistributionChart.tsx app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add genre distribution pie chart"
```

---

## Task 12: Add Top Authors Chart

**Files:**
- Create: `app/reading/components/charts/TopAuthorsChart.tsx`

**Step 1: Create top authors horizontal bar chart**

```typescript
"use client";

import { AuthorData } from "@/lib/mockData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface TopAuthorsChartProps {
  data: AuthorData[];
}

export default function TopAuthorsChart({ data }: TopAuthorsChartProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Show top 5 on mobile, top 10 on desktop
  const displayData = isMobile ? data.slice(0, 5) : data.slice(0, 10);
  const maxCount = displayData[0]?.count || 1;

  const topAuthor = data[0];

  return (
    <div className="mb-6 px-4">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3">
        👥 Top Authors
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm">
        <div className="space-y-3">
          {displayData.map((author, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black truncate max-w-[70%]">
                  {author.author}
                </span>
                <span className="text-sm font-black">{author.count} {author.count === 1 ? 'book' : 'books'}</span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white rounded">
                <div
                  className="h-full bg-gradient-primary rounded-sm transition-all"
                  style={{ width: `${(author.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {data.length > displayData.length && (
          <button className="mt-3 text-sm font-black underline w-full text-center">
            View All {data.length} Authors →
          </button>
        )}

        {topAuthor && topAuthor.count >= 3 && (
          <div className="mt-4 text-sm font-bold text-center">
            📚 {topAuthor.author} superfan detected! ({topAuthor.count} books)
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add to ReadingStatsSection**

Import and add after GenreDistributionChart:

```typescript
import TopAuthorsChart from "./charts/TopAuthorsChart";

// After GenreDistributionChart:
<TopAuthorsChart data={stats.topAuthors} />
```

**Step 3: Commit**

```bash
git add app/reading/components/charts/TopAuthorsChart.tsx app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add top authors horizontal bar chart"
```

---

## Task 13: Add Reading Speed Analysis Cards

**Files:**
- Create: `app/reading/components/ReadingSpeedCards.tsx`

**Step 1: Create reading speed cards component**

```typescript
"use client";

import { ReadingStats } from "@/lib/mockData";

interface ReadingSpeedCardsProps {
  stats: ReadingStats;
}

export default function ReadingSpeedCards({ stats }: ReadingSpeedCardsProps) {
  const cards = [
    {
      title: "⚡ Fastest Book",
      book: stats.fastestBook.title,
      metric: `${stats.fastestBook.days} days`,
      detail: `${stats.fastestBook.pagesPerDay} pages/day`,
      gradient: "bg-gradient-success"
    },
    {
      title: "🐌 Slowest Book",
      book: stats.slowestBook.title,
      metric: `${stats.slowestBook.days} days`,
      detail: `${stats.slowestBook.pagesPerDay} pages/day`,
      gradient: "bg-gradient-accent"
    },
    {
      title: "📊 Your Average",
      book: "All Books",
      metric: `${stats.readingPace} pages/day`,
      detail: "Overall pace",
      gradient: "bg-gradient-info"
    }
  ];

  return (
    <div className="mb-6 px-4">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3">
        ⚡ Reading Speed
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.gradient} border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm text-white`}
          >
            <div className="text-xs font-black uppercase mb-2 opacity-90">
              {card.title}
            </div>
            <div className="text-lg font-black mb-1 truncate">
              {card.book}
            </div>
            <div className="text-2xl font-black mb-1">
              {card.metric}
            </div>
            <div className="text-sm font-bold opacity-90">
              {card.detail}
            </div>
          </div>
        ))}
      </div>

      {stats.fastestBook.pagesPerDay > 100 && (
        <div className="mt-4 text-sm font-bold text-center">
          🚀 Speed demon alert: {stats.fastestBook.pagesPerDay} pages/day on {stats.fastestBook.title}!
        </div>
      )}
    </div>
  );
}
```

**Step 2: Add to ReadingStatsSection**

Import and add after TopAuthorsChart:

```typescript
import ReadingSpeedCards from "./ReadingSpeedCards";

// After TopAuthorsChart:
<HeroDivider
  title="Speed Reader Status"
  subtitle={`You crushed ${stats.fastestBook.title} in just ${stats.fastestBook.days} days at ${stats.fastestBook.pagesPerDay} pages/day!`}
  gradient="success"
/>

<ReadingSpeedCards stats={stats} />
```

**Step 3: Commit**

```bash
git add app/reading/components/ReadingSpeedCards.tsx app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add reading speed analysis cards"
```

---

## Task 14: Add Rating Distribution Chart

**Files:**
- Create: `app/reading/components/charts/RatingDistributionChart.tsx`

**Step 1: Create rating distribution bar chart**

```typescript
"use client";

import { ReadingStats } from "@/lib/mockData";

interface RatingDistributionChartProps {
  ratings: ReadingStats["ratingDistribution"];
  avgRating: number;
}

export default function RatingDistributionChart({ ratings, avgRating }: RatingDistributionChartProps) {
  const maxCount = Math.max(...ratings.map(r => r.count));
  const totalBooks = ratings.reduce((sum, r) => sum + r.count, 0);
  const lovedBooks = ratings.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0);
  const lovedPercentage = totalBooks > 0 ? Math.round((lovedBooks / totalBooks) * 100) : 0;

  return (
    <div className="mb-6 px-4">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3">
        ⭐ Rating Distribution
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm">
        <div className="space-y-3">
          {ratings.slice().reverse().map((rating) => (
            <div key={rating.rating}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-black">
                  {rating.rating}⭐
                </span>
                <span className="text-sm font-black">{rating.count} books</span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white rounded">
                <div
                  className="h-full bg-gradient-accent rounded-sm transition-all"
                  style={{ width: `${maxCount > 0 ? (rating.count / maxCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700 space-y-2">
          <div className="text-sm font-bold text-center">
            😊 Average rating: <span className="font-black">{avgRating.toFixed(1)}/5</span>
          </div>
          {lovedPercentage > 0 && (
            <div className="text-sm font-bold text-center">
              🎯 You loved {lovedPercentage}% of what you read!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add to ReadingStatsSection**

Import and add after ReadingSpeedCards:

```typescript
import RatingDistributionChart from "./charts/RatingDistributionChart";

// After ReadingSpeedCards:
<RatingDistributionChart
  ratings={stats.ratingDistribution}
  avgRating={stats.avgRating}
/>
```

**Step 3: Commit**

```bash
git add app/reading/components/charts/RatingDistributionChart.tsx app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add rating distribution chart"
```

---

## Task 15: Add Reading Streak Calendar Heatmap

**Files:**
- Create: `app/reading/components/charts/ReadingStreakHeatmap.tsx`

**Step 1: Create streak heatmap component**

```typescript
"use client";

import { mockReadingProgress } from "@/lib/mockData";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ReadingStreakHeatmapProps {
  currentStreak: number;
}

export default function ReadingStreakHeatmap({ currentStreak }: ReadingStreakHeatmapProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Get last 28 days of activity
  const getLast28Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Find pages read on this day
      let pagesRead = 0;
      mockReadingProgress.forEach(progress => {
        progress.dailyCheckIns.forEach(checkIn => {
          const checkInDate = new Date(checkIn.date);
          if (checkInDate.toDateString() === date.toDateString()) {
            pagesRead += checkIn.pagesRead;
          }
        });
      });

      days.push({ date, pages: pagesRead });
    }

    return days;
  };

  const last28Days = getLast28Days();

  const getActivityColor = (pages: number) => {
    if (pages === 0) return "bg-gray-200 dark:bg-gray-700";
    if (pages < 20) return "bg-green-200 dark:bg-green-800";
    if (pages < 40) return "bg-green-400 dark:bg-green-600";
    return "bg-green-600 dark:bg-green-500";
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-black uppercase mb-3 px-4">
        🔥 Reading Streak
      </h3>

      <div className="overflow-x-auto px-4">
        <div style={{ minWidth: isMobile ? "320px" : "auto" }}>
          <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-[10px] font-black text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Activity grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {last28Days.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square border-2 border-black dark:border-white rounded ${getActivityColor(day.pages)}`}
                  title={`${day.date.toLocaleDateString()}: ${day.pages} pages`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold mb-3">
              <span>Less</span>
              <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white rounded" />
              <div className="w-3 h-3 bg-green-200 dark:bg-green-800 border-2 border-black dark:border-white rounded" />
              <div className="w-3 h-3 bg-green-400 dark:bg-green-600 border-2 border-black dark:border-white rounded" />
              <div className="w-3 h-3 bg-green-600 dark:bg-green-500 border-2 border-black dark:border-white rounded" />
              <span>More</span>
            </div>

            {/* Current streak */}
            <div className="text-sm font-bold text-center">
              🔥 Current streak: <span className="font-black">{currentStreak} days!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add to ReadingStatsSection**

Import and add after RatingDistributionChart:

```typescript
import ReadingStreakHeatmap from "./charts/ReadingStreakHeatmap";

// After RatingDistributionChart:
<HeroDivider
  title="Streak Champion"
  subtitle={`${stats.currentStreak} days strong! You're building an amazing reading habit.`}
  gradient="info"
/>

<ReadingStreakHeatmap currentStreak={stats.currentStreak} />
```

**Step 3: Commit**

```bash
git add app/reading/components/charts/ReadingStreakHeatmap.tsx app/reading/components/ReadingStatsSection.tsx
git commit -m "feat: add reading streak calendar heatmap"
```

---

## Task 16: Final Testing and Polish

**Files:**
- Test all components in browser
- Verify mobile responsiveness
- Check dark mode

**Step 1: Run dev server and test**

```bash
npm run dev
```

Navigate to http://localhost:3000/reading

**Test checklist:**
- [ ] Summary stats display correctly
- [ ] Time period tabs switch between all/year/month
- [ ] Hero dividers render with gradients
- [ ] Reading pace chart shows bars
- [ ] Genre pie chart displays with legend
- [ ] Top authors bars render
- [ ] Reading speed cards show fastest/slowest
- [ ] Rating distribution chart displays
- [ ] Streak heatmap shows activity
- [ ] Fun facts display at bottom

**Step 2: Test mobile (390px)**

In DevTools, switch to iPhone 12 Pro viewport

**Mobile checklist:**
- [ ] 2-column stats grid
- [ ] Horizontal scroll on charts works
- [ ] Hero sections have reduced padding
- [ ] Top 5 authors only
- [ ] Top 5 genres + Other
- [ ] Compact heatmap

**Step 3: Test dark mode**

Toggle dark mode in app

**Dark mode checklist:**
- [ ] White borders on all cards
- [ ] Dark backgrounds
- [ ] Chart axes are white
- [ ] Text is readable

**Step 4: Build for production**

```bash
npm run build
```

Expected: No TypeScript errors, successful build

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete reading analytics dashboard implementation

- Full StoryGraph-inspired analytics
- 6 interactive charts with Recharts
- Mobile-first responsive design
- Hero section dividers
- Mock data with realistic patterns
- Summary stats grid
- Time period filtering
- Fun facts generation
- Dark mode support"
```

---

## Implementation Complete

All tasks completed! The reading analytics dashboard is now fully functional with:

✅ Mock data with realistic patterns
✅ Analytics calculation utilities
✅ Summary stats grid (6 metrics)
✅ Time period filtering (All/Year/Month)
✅ Hero section dividers
✅ Reading pace bar chart
✅ Genre distribution pie chart
✅ Top authors horizontal bars
✅ Reading speed analysis cards
✅ Rating distribution chart
✅ Reading streak heatmap
✅ Fun facts generator
✅ Mobile-first responsive design
✅ Dark mode support

**Next Steps:**
- Test with real users
- Gather feedback on which metrics are most useful
- Consider adding export/share features
- Plan backend API integration
