"use client";

import { mockReadingProgressEnhanced } from "../../../../lib/mockData";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

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
      mockReadingProgressEnhanced.forEach(progress => {
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
