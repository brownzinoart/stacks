"use client";

import { ReadingStats } from "../../../../lib/mockData";

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
      <h3 className="font-display text-lg md:text-xl font-black uppercase mb-3">
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
