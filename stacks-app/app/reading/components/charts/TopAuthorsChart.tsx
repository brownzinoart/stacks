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
