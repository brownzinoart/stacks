"use client";

import { useState } from "react";
import { mockStacks, getUserById } from "@/lib/mockData";
import StackCard from "@/components/StackCard";

export default function HomePage() {
  const [globalVizEnabled, setGlobalVizEnabled] = useState(false);

  return (
    <div
      className="min-h-screen dark:bg-dark-primary pb-24"
      style={{ background: 'linear-gradient(135deg, #38f9d7 0%, #fee140 50%, #f5576c 100%)' }}
    >
      {/* Feed - Cards sit on gradient background */}
      <div className="max-w-lg mx-auto pt-4">
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
