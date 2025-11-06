"use client";

interface StatsTimePeriodTabsProps {
  selected: "all" | "year" | "month";
  onChange: (period: "all" | "year" | "month") => void;
}

export default function StatsTimePeriodTabs({ selected, onChange }: StatsTimePeriodTabsProps) {
  const tabs = [
    { value: "all" as const, label: "ALL TIME" },
    { value: "year" as const, label: "THIS YEAR" },
    { value: "month" as const, label: "THIS MONTH" },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 min-w-[100px] px-4 py-3 border-4 border-black dark:border-white rounded-xl font-black text-sm transition-all ${
            selected === tab.value
              ? "bg-gradient-primary text-white shadow-brutal-sm"
              : "bg-white dark:bg-dark-secondary hover:shadow-brutal-sm"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
