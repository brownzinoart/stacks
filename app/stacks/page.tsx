"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { currentUser, mockStacks, getUserById } from "../../lib/mockData";

type TabType = "my-stacks" | "liked" | "saved";

function StackSection({ title, stacks }: { title: string; stacks: typeof mockStacks }) {
  return (
    <div className="mb-6">
      <h2 className="text-h2-mobile md:text-h2-tablet lg:text-h2-desktop font-black uppercase px-4 mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto px-4 pb-6">
        <div className="flex gap-4 pt-2 pl-3" style={{ width: "max-content" }}>
          {stacks.map((stack) => {
            const user = getUserById(stack.userId);
            if (!user) return null;

            return (
              <article key={stack.id} className="card-brutal w-64 flex-shrink-0 overflow-hidden">
                {/* Stack Image */}
                <div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center overflow-hidden">
                  {/* Conditional Image or Gradient Fallback */}
                  {stack.photo ? (
                    <Image
                      src={stack.photo}
                      alt={stack.caption}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  ) : (
                    <p className="text-white font-black text-xl">STACK</p>
                  )}
                  {/* Overlay Badges */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-10">
                    <div className="bg-black/80 border-[3px] border-white px-2 py-1 rounded-lg">
                      <p className="text-white font-black text-xs uppercase">
                        {stack.books.length} Books
                      </p>
                    </div>
                    <div className="bg-black/80 border-[3px] border-white px-2 py-1 rounded-lg">
                      <p className="text-white font-black text-xs uppercase">
                        {stack.likeCount} ❤️
                      </p>
                    </div>
                  </div>
                </div>
                {/* Caption */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold line-clamp-2">
                    {stack.caption}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StacksPage() {
  const [activeTab, setActiveTab] = useState<TabType>("my-stacks");

  // Filter stacks based on active tab (for now, just show all as "my-stacks")
  const displayStacks = mockStacks;

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      {/* Profile Header */}
      <div className="border-b-[5px] border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-primary border-[5px] border-light-border dark:border-dark-border shadow-brutal-badge" />
            <div className="flex-1">
              <h1 className="text-h2-mobile md:text-h2-tablet lg:text-h2-desktop font-black uppercase mb-1">
                {currentUser.username}
              </h1>
              <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-accent-purple border-[5px] border-light-border dark:border-dark-border shadow-brutal-badge rounded-[20px] p-3 text-center transition-all duration-[120ms] ease-in-out hover:translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[-6px_6px_0_0_rgb(var(--shadow-color))] cursor-pointer">
              <p className="font-black text-4xl text-white">24</p>
              <p className="font-black text-xs uppercase tracking-wider text-white/80">Stacks</p>
            </div>
            <div className="bg-accent-coral border-[5px] border-light-border dark:border-dark-border shadow-brutal-badge rounded-[20px] p-3 text-center transition-all duration-[120ms] ease-in-out hover:translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[-6px_6px_0_0_rgb(var(--shadow-color))] cursor-pointer">
              <p className="font-black text-4xl text-white">156</p>
              <p className="font-black text-xs uppercase tracking-wider text-white/80">Likes</p>
            </div>
            <div className="bg-accent-teal border-[5px] border-light-border dark:border-dark-border shadow-brutal-badge rounded-[20px] p-3 text-center transition-all duration-[120ms] ease-in-out hover:translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[-6px_6px_0_0_rgb(var(--shadow-color))] cursor-pointer">
              <p className="font-black text-4xl text-white">89</p>
              <p className="font-black text-xs uppercase tracking-wider text-white/80">Books</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b-[5px] border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary">
        <div className="max-w-lg mx-auto flex">
          <TabButton
            label="My Stacks"
            active={activeTab === "my-stacks"}
            onClick={() => setActiveTab("my-stacks")}
          />
          <TabButton
            label="Liked"
            active={activeTab === "liked"}
            onClick={() => setActiveTab("liked")}
          />
          <TabButton
            label="Saved"
            active={activeTab === "saved"}
            onClick={() => setActiveTab("saved")}
          />
        </div>
      </div>

      {/* Horizontal Scroll Sections */}
      <div className="py-6 space-y-8">
        {/* Recent Stacks */}
        <StackSection title="Recent Stacks" stacks={displayStacks} />

        {/* Most Liked */}
        <StackSection title="Most Liked" stacks={displayStacks.slice().reverse()} />

        {/* This Month */}
        <StackSection title="This Month" stacks={displayStacks.slice(0, 2)} />

        {/* Earlier This Year */}
        <StackSection title="Earlier This Year" stacks={displayStacks.slice(1, 3)} />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 fab-brutal bg-gradient-primary z-50 transition-all duration-[120ms] ease-in-out hover:translate-x-[7px] hover:-translate-y-[7px] hover:shadow-[-12px_12px_0_0_rgb(var(--shadow-color))] active:bg-accent-cyanHover">
        <Plus className="w-8 h-8 text-white stroke-[3]" />
      </button>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 font-black text-sm uppercase tracking-tight border-r-[5px] last:border-r-0 border-light-border dark:border-dark-border transition-colors ${
        active
          ? "bg-accent-teal text-white"
          : "bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text"
      }`}
    >
      {label}
    </button>
  );
}
