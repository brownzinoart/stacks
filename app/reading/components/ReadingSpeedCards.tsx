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
