"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { MonthlyReadingData } from "../../../../lib/mockData";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

interface ReadingPaceChartProps {
  data: MonthlyReadingData[];
}

export default function ReadingPaceChart({ data }: ReadingPaceChartProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Show last 6 months on mobile, all on desktop
  const chartData = isMobile ? data.slice(-6) : data;

  // Find best month
  const bestMonth = data.length > 0 ? data.reduce((max, month) =>
    month.books > max.books ? month : max,
    data[0]!
  ) : null;

  return (
    <div className="mb-6">
      <h3 className="font-display text-lg md:text-xl font-black uppercase mb-3 px-4">
        📈 Reading Pace
      </h3>

      <div className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm mx-4">
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

        {bestMonth && (
          <div className="mt-4 text-sm font-bold text-center">
            🔥 <span className="font-black">{bestMonth.month}</span> was your best month! ({bestMonth.books} books)
          </div>
        )}
      </div>
    </div>
  );
}
