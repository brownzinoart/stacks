"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { currentUser, mockStacks, getUserById } from "@/lib/mockData";

type TabType = "my-stacks" | "liked" | "saved";

function StackSection({ title, stacks }: { title: string; stacks: typeof mockStacks }) {
  return (
    <div className="mb-6">
      <h2 className="font-black text-lg uppercase tracking-tight px-4 mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto px-4">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {stacks.map((stack) => {
            const user = getUserById(stack.userId);
            if (!user) return null;

            return (
              <div
                key={stack.id}
                className="w-64 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal rounded-xl flex-shrink-0"
              >
                {/* Stack Image */}
                <div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center border-b-4 border-black dark:border-white">
                  <p className="text-white font-black text-xl">STACK</p>
                  {/* Overlay Badges */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">
                      <p className="text-white font-black text-xs uppercase">
                        {stack.books.length} Books
                      </p>
                    </div>
                    <div className="bg-black/80 border-3 border-white px-2 py-1 rounded-lg">
                      <p className="text-white font-black text-xs uppercase">
                        {stack.likeCount} ❤️
                      </p>
                    </div>
                  </div>
                </div>
                {/* Caption */}
                <div className="p-3">
                  <p className="text-sm font-semibold line-clamp-2">
                    {stack.caption}
                  </p>
                </div>
              </div>
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
    <div className="min-h-screen bg-white dark:bg-dark-primary pb-20">
      {/* Profile Header */}
      <div className="border-b-4 border-black dark:border-white bg-white dark:bg-dark-secondary">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-primary border-4 border-black dark:border-white" />
            <div className="flex-1">
              <h1 className="font-black text-xl uppercase tracking-tight mb-1">
                {currentUser.username}
              </h1>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">
              <p className="font-black text-2xl text-white">24</p>
              <p className="font-black text-xs uppercase tracking-wider text-white">Stacks</p>
            </div>
            <div className="bg-gradient-accent border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">
              <p className="font-black text-2xl text-white">156</p>
              <p className="font-black text-xs uppercase tracking-wider text-white">Likes</p>
            </div>
            <div className="bg-gradient-success border-4 border-black dark:border-white shadow-brutal-sm rounded-xl p-3 text-center">
              <p className="font-black text-2xl text-white">89</p>
              <p className="font-black text-xs uppercase tracking-wider text-white">Books</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b-4 border-black dark:border-white bg-white dark:bg-dark-secondary">
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
      <button className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm rounded-full flex items-center justify-center hover:shadow-brutal transition-all z-50">
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
      className={`flex-1 py-4 font-black text-sm uppercase tracking-tight border-r-4 last:border-r-0 border-black dark:border-white transition-colors ${
        active
          ? "bg-gradient-primary text-white"
          : "bg-white dark:bg-dark-secondary text-black dark:text-white"
      }`}
    >
      {label}
    </button>
  );
}
