"use client";

import { useState, useMemo } from "react";
import { calculateStats, generateFunFacts } from "../../../../lib/analytics";
import { mockReadingProgressEnhanced, mockBooks } from "../../../../lib/mockData";
import StatsTimePeriodTabs from "./StatsTimePeriodTabs";
import SummaryStatsGrid from "./SummaryStatsGrid";
import GenreAndAuthorsSection from "./GenreAndAuthorsSection";
import ReadingSpeedCard from "./ReadingSpeedCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

export default function StatsTabContent() {
  const [timePeriod, setTimePeriod] = useState<"all" | "year" | "month">("all");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const stats = useMemo(
    () => calculateStats(mockReadingProgressEnhanced, mockBooks, timePeriod),
    [timePeriod]
  );

  const funFacts = useMemo(() => generateFunFacts(stats, mockBooks), [stats]);

  const chartData = isMobile ? stats.monthlyReading.slice(-6) : stats.monthlyReading;

  const getLast28Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      let pagesRead = 0;
      mockReadingProgressEnhanced.forEach((progress) => {
        progress.dailyCheckIns.forEach((checkIn) => {
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
    <div className="pb-24">
      {/* Time Period Selector */}
      <div className="px-4 pt-6">
        <StatsTimePeriodTabs selected={timePeriod} onChange={setTimePeriod} />
      </div>

      {/* Summary Stats Grid */}
      <div className="px-4">
        <SummaryStatsGrid stats={stats} />
      </div>

      {/* Reading Pace Chart */}
      <div className="mb-8 px-4">
        <h3 className="text-lg md:text-xl font-black uppercase mb-4">📈 Reading Pace</h3>

        <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-4 shadow-brutal-badge">
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
        </div>
      </div>

      {/* Genre & Authors Combined */}
      <GenreAndAuthorsSection genreData={stats.topGenres} authorData={stats.topAuthors} />

      {/* Reading Speed */}
      <ReadingSpeedCard stats={stats} />

      {/* Reading Streak Heatmap */}
      <div className="mb-8 px-4">
        <h3 className="text-lg md:text-xl font-black uppercase mb-4">🔥 Reading Streak</h3>

        <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-4 shadow-brutal-badge">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
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
                className={`aspect-square border-2 border-black dark:border-white rounded ${getActivityColor(
                  day.pages
                )}`}
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
            🔥 Current streak: <span className="font-black">{stats.currentStreak} days!</span>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      {funFacts.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-lg md:text-xl font-black uppercase mb-4">🎉 Fun Facts</h3>
          <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-4 shadow-brutal-badge">
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
    </div>
  );
}
