"use client";

import { useState } from "react";
import ReadingTabs from "./components/ReadingTabs";
import ReadingPacingSection from "./components/ReadingPacingSection";
import StatsTabContent from "./components/StatsTabContent";

export default function ReadingPage() {
  const [activeTab, setActiveTab] = useState<"reading" | "stats">("reading");

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
      {/* Header and Tabs - Combined sticky container */}
      <div className="sticky top-0 z-40 bg-white dark:bg-dark-secondary">
        {/* Header */}
        <div className="px-4 py-4 border-b-4 border-black dark:border-white">
          <h1 className="font-display text-2xl font-black uppercase tracking-tighter">Reading</h1>
          <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
            Track your progress
          </p>
        </div>

        {/* Tabs */}
        <ReadingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      {activeTab === "reading" ? (
        <div className="pb-24">
          <ReadingPacingSection />
        </div>
      ) : (
        <StatsTabContent />
      )}
    </div>
  );
}
