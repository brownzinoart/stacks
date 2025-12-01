"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { GenreData, AuthorData } from "../../../lib/mockData";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

interface GenreAndAuthorsSectionProps {
  genreData: GenreData[];
  authorData: AuthorData[];
}

const COLORS = ["#667eea", "#f093fb", "#fbbf24", "#10b981", "#ef4444", "#8b5cf6"];

export default function GenreAndAuthorsSection({
  genreData,
  authorData,
}: GenreAndAuthorsSectionProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Top 5 genres for mobile
  const chartData = isMobile && genreData.length > 5
    ? [
        ...genreData.slice(0, 5),
        {
          genre: "Other",
          count: genreData.slice(5).reduce((sum, g) => sum + g.count, 0),
          percentage: genreData.slice(5).reduce((sum, g) => sum + g.percentage, 0),
        },
      ]
    : genreData;

  const displayAuthors = isMobile ? authorData.slice(0, 5) : authorData.slice(0, 10);
  const maxAuthorCount = displayAuthors[0]?.count || 1;

  return (
    <div className="mb-8 px-4">
      <h3 className="font-display text-lg md:text-xl font-black uppercase mb-4">
        🎭 Genres & Authors
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Genre Distribution */}
        <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-4 shadow-brutal-badge">
          <h4 className="text-sm font-black uppercase mb-3 text-light-textSecondary dark:text-dark-textSecondary">
            🎨 Genre Distribution
          </h4>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData as any}
                dataKey="count"
                nameKey="genre"
                cx="50%"
                cy="50%"
                outerRadius={60}
                stroke="#000"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-1.5">
            {chartData.slice(0, 4).map((genre, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold">
                <div
                  className="w-3 h-3 border-2 border-black dark:border-white rounded flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate">{genre.genre}</span>
                <span className="font-black">{genre.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Authors */}
        <div className="bg-white dark:bg-dark-secondary border-[3px] border-black dark:border-white rounded-xl p-4 shadow-brutal-badge">
          <h4 className="text-sm font-black uppercase mb-3 text-light-textSecondary dark:text-dark-textSecondary">
            👥 Top Authors
          </h4>

          <div className="space-y-2.5">
            {displayAuthors.slice(0, isMobile ? 5 : 7).map((author, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black truncate max-w-[70%]">
                    {author.author}
                  </span>
                  <span className="text-xs font-black">
                    {author.count} {author.count === 1 ? "book" : "books"}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white rounded">
                  <div
                    className="h-full bg-gradient-primary rounded-sm transition-all"
                    style={{ width: `${(author.count / maxAuthorCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
