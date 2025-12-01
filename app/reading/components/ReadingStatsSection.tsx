"use client";

import { useState, useMemo } from "react";
import { calculateStats, generateFunFacts } from "../../../lib/analytics";
import { mockReadingProgressEnhanced, mockBooks } from "../../../lib/mockData";
import StatsTimePeriodTabs from "./StatsTimePeriodTabs";
import SummaryStatsGrid from "./SummaryStatsGrid";
import HeroDivider from "./HeroDivider";
import ReadingPaceChart from "./charts/ReadingPaceChart";
import GenreDistributionChart from "./charts/GenreDistributionChart";
import TopAuthorsChart from "./charts/TopAuthorsChart";
import ReadingSpeedCards from "./ReadingSpeedCards";
import RatingDistributionChart from "./charts/RatingDistributionChart";
import ReadingStreakHeatmap from "./charts/ReadingStreakHeatmap";

export default function ReadingStatsSection() {
  const [timePeriod, setTimePeriod] = useState<"all" | "year" | "month">("year");

  const stats = useMemo(
    () => calculateStats(mockReadingProgressEnhanced, mockBooks, timePeriod),
    [timePeriod]
  );

  const funFacts = useMemo(
    () => generateFunFacts(stats, mockBooks),
    [stats]
  );

  return (
    <section className="mt-12 mb-24">
      <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight px-4 mb-4">
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

      <HeroDivider
        title="Genre Explorer"
        subtitle={`You gravitate toward ${stats.topGenres[0]?.genre || 'various genres'} - your comfort zone!`}
        gradient="accent"
      />

      <GenreDistributionChart data={stats.topGenres} />

      <TopAuthorsChart data={stats.topAuthors} />

      <HeroDivider
        title="Speed Reader Status"
        subtitle={`You crushed ${stats.fastestBook.title} in just ${stats.fastestBook.days} days at ${stats.fastestBook.pagesPerDay} pages/day!`}
        gradient="success"
      />

      <ReadingSpeedCards stats={stats} />

      <RatingDistributionChart
        ratings={stats.ratingDistribution}
        avgRating={stats.avgRating}
      />

      <HeroDivider
        title="Streak Champion"
        subtitle={`${stats.currentStreak} days strong! You're building an amazing reading habit.`}
        gradient="info"
      />

      <ReadingStreakHeatmap currentStreak={stats.currentStreak} />

      {/* Fun Facts */}
      {funFacts.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="font-display text-lg md:text-xl font-black uppercase mb-3">
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
