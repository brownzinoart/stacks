"use client";

interface ReadingTabsProps {
  activeTab: "reading" | "stats";
  onTabChange: (tab: "reading" | "stats") => void;
}

export default function ReadingTabs({ activeTab, onTabChange }: ReadingTabsProps) {
  return (
    <div className="bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
      <div className="flex">
        <button
          onClick={() => onTabChange("reading")}
          className={`flex-1 py-4 font-black uppercase text-sm tracking-tight transition-all ${
            activeTab === "reading"
              ? "border-b-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-secondary dark:hover:bg-dark-primary"
          }`}
        >
          📖 Reading
        </button>
        <button
          onClick={() => onTabChange("stats")}
          className={`flex-1 py-4 font-black uppercase text-sm tracking-tight transition-all ${
            activeTab === "stats"
              ? "border-b-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-secondary dark:hover:bg-dark-primary"
          }`}
        >
          📊 Stats
        </button>
      </div>
    </div>
  );
}
