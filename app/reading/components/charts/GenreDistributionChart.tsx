"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { GenreData } from "../../../../lib/mockData";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

interface GenreDistributionChartProps {
  data: GenreData[];
}

const COLORS = ["#667eea", "#f093fb", "#fbbf24", "#10b981", "#ef4444", "#8b5cf6"];

export default function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Top 5 + Other on mobile
  const chartData: (GenreData & { [key: string]: any })[] = isMobile && data.length > 5
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
