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
