"use client";

import { ReadingStats } from "../../../lib/mockData";

interface ReadingSpeedCardProps {
  stats: ReadingStats;
}

export default function ReadingSpeedCard({ stats }: ReadingSpeedCardProps) {
  return (
    <div className="mb-8 px-4">
      <h3 className="text-lg md:text-xl font-black uppercase mb-4">
        ⚡ Reading Speed
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-6 shadow-brutal-badge">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fastest Book */}
          <div>
            <div className="text-xs font-black uppercase mb-2 text-light-textTertiary dark:text-dark-textTertiary">
              🚀 Fastest
            </div>
            <div className="text-base font-bold mb-1 truncate" title={stats.fastestBook.title}>
              {stats.fastestBook.title}
            </div>
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {stats.fastestBook.days} days
            </div>
            <div className="text-sm font-bold text-light-textSecondary dark:text-dark-textSecondary">
              {stats.fastestBook.pagesPerDay} pages/day
            </div>
          </div>

          {/* Average Pace */}
          <div className="border-l-0 md:border-l-4 border-black dark:border-white md:pl-6">
            <div className="text-xs font-black uppercase mb-2 text-light-textTertiary dark:text-dark-textTertiary">
              📊 Average
            </div>
            <div className="text-base font-bold mb-1">
              All Books
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.readingPace} pages/day
            </div>
            <div className="text-sm font-bold text-light-textSecondary dark:text-dark-textSecondary">
              Overall pace
            </div>
          </div>

          {/* Slowest Book */}
          <div className="border-l-0 md:border-l-4 border-black dark:border-white md:pl-6">
            <div className="text-xs font-black uppercase mb-2 text-light-textTertiary dark:text-dark-textTertiary">
              🐌 Slowest
            </div>
            <div className="text-base font-bold mb-1 truncate" title={stats.slowestBook.title}>
              {stats.slowestBook.title}
            </div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
              {stats.slowestBook.days} days
            </div>
            <div className="text-sm font-bold text-light-textSecondary dark:text-dark-textSecondary">
              {stats.slowestBook.pagesPerDay} pages/day
            </div>
          </div>
        </div>

        {stats.fastestBook.pagesPerDay > 100 && (
          <div className="mt-4 pt-4 border-t-2 border-black dark:border-white text-sm font-bold text-center">
            🔥 Speed demon alert: {stats.fastestBook.pagesPerDay} pages/day on {stats.fastestBook.title}!
          </div>
        )}
      </div>
    </div>
  );
}
