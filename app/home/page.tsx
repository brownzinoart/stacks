"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { mockStacks, getUserById } from "../../lib/mockData";
import StackCard from "../../components/StackCard";

export default function HomePage() {
  const [globalVizEnabled, setGlobalVizEnabled] = useState(false);
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  // Filter stacks based on active hashtag
  const filteredStacks = useMemo(() => {
    if (!activeHashtag) return mockStacks;
    return mockStacks.filter((stack) =>
      stack.hashtags?.includes(activeHashtag)
    );
  }, [activeHashtag]);

  const handleHashtagClick = (hashtag: string) => {
    setActiveHashtag(hashtag);

    // Smooth scroll to top with easing
    const scrollToTop = () => {
      const currentScroll = window.scrollY;
      const duration = 800; // ms
      const start = performance.now();

      const easeInOutCubic = (t: number) => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const scroll = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, currentScroll * (1 - ease));

        if (progress < 1) {
          requestAnimationFrame(scroll);
        }
      };

      requestAnimationFrame(scroll);
    };

    scrollToTop();
  };

  const handleClearFilter = () => {
    setActiveHashtag(null);
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary px-4 py-14 md:py-20 lg:py-28 pb-nav relative overflow-hidden">
      {/* Atmospheric background mesh - subtle */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen">
        <div className="absolute inset-0 bg-mesh-warm"></div>
      </div>

      {/* Filter Banner */}
      {activeHashtag && (
        <div className="max-w-lg mx-auto mb-6 sticky top-14 md:top-20 lg:top-28 z-40 scroll-animate-initial slam-in">
          <div className="bg-riso-blue text-white px-6 py-4 rounded-xl border-[5px] border-black dark:border-white shadow-brutal-button flex items-center justify-between">
            <p className="font-display font-black text-lg uppercase tracking-tight">
              Showing #{activeHashtag}
            </p>
            <button
              onClick={handleClearFilter}
              aria-label="Clear filter"
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Feed - Cards sit on warm beige background */}
      <div className="max-w-lg mx-auto space-y-8 md:space-y-14 lg:space-y-20">
        {filteredStacks.map((stack) => {
          const user = getUserById(stack.userId);
          if (!user) return null;

          return (
            <StackCard
              key={stack.id}
              stack={stack}
              user={user}
              globalVizEnabled={globalVizEnabled}
              onHashtagClick={handleHashtagClick}
            />
          );
        })}
      </div>
    </div>
  );
}
