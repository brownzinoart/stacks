"use client";

import { useState } from "react";
import { mockStacks, getUserById } from "@/lib/mockData";
import StackCard from "@/components/StackCard";

export default function HomePage() {
  const [globalVizEnabled, setGlobalVizEnabled] = useState(false);

  return (
    <div
      className="min-h-screen dark:bg-dark-primary px-4 py-14 md:py-20 lg:py-28 pb-nav"
      style={{ background: 'linear-gradient(135deg, #38f9d7 0%, #fee140 50%, #f5576c 100%)' }}
    >
      {/* Feed - Cards sit on gradient background */}
      <div className="max-w-lg mx-auto space-y-8 md:space-y-14 lg:space-y-20">
        {mockStacks.map((stack) => {
          const user = getUserById(stack.userId);
          if (!user) return null;

          return (
            <StackCard
              key={stack.id}
              stack={stack}
              user={user}
              globalVizEnabled={globalVizEnabled}
            />
          );
        })}
      </div>
    </div>
  );
}
