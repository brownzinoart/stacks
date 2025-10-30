"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Stack, User, MatchLevel } from "@/lib/mockData";

interface StackCardProps {
  stack: Stack;
  user: User;
  globalVizEnabled?: boolean;
}

const getMatchBadge = (level: MatchLevel) => {
  switch (level) {
    case "high":
      return { emoji: "❤️", label: "Love" };
    case "medium":
      return { emoji: "⭐", label: "Maybe" };
    case "low":
      return { emoji: "👀", label: "Outside usual" };
    case "read":
      return { emoji: "✓", label: "Read" };
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export default function StackCard({ stack, user, globalVizEnabled = false }: StackCardProps) {
  const [localVizEnabled, setLocalVizEnabled] = useState(false);
  const vizActive = globalVizEnabled || localVizEnabled;

  return (
    <article className="mb-6 bg-white dark:bg-dark-secondary border-4 border-black dark:border-white shadow-brutal">
      {/* Header - Profile + Menu */}
      <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary border-4 border-black dark:border-white shadow-brutal-sm" />
          <Link href={`/profile/${user.id}`} className="font-black text-base uppercase tracking-tight">
            {user.username}
          </Link>
        </div>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Stack Image */}
      <div className="relative w-full border-b-4 border-black dark:border-white">
        <div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center">
          <p className="text-white font-black text-2xl">STACK PHOTO</p>

          {/* Stack Viz overlay on books when active */}
          {vizActive && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
              {stack.books.map((bookMatch) => {
                const badge = getMatchBadge(bookMatch.matchLevel);
                return (
                  <div
                    key={bookMatch.book.id}
                    className="relative flex-shrink-0 w-12 h-16 bg-white/90 rounded-xl flex items-center justify-center"
                  >
                    <span className="text-2xl">{badge.emoji}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stack Viz toggle button */}
        {!globalVizEnabled && (
          <button
            onClick={() => setLocalVizEnabled(!localVizEnabled)}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all"
            title="Toggle Stack Viz"
          >
            {vizActive ? (
              <EyeOff className="w-4 h-4 text-white" />
            ) : (
              <Eye className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black dark:border-white">
        <div className="flex items-center gap-5">
          <button className="hover:opacity-70 transition">
            <Heart className="w-8 h-8 stroke-[3]" />
          </button>
          <button className="hover:opacity-70 transition">
            <MessageCircle className="w-8 h-8 stroke-[3]" />
          </button>
          <button className="hover:opacity-70 transition">
            <Send className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
        <button className="hover:opacity-70 transition">
          <Bookmark className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* Like Count */}
      <div className="px-4 py-3">
        <p className="font-black text-base uppercase tracking-tight">{formatNumber(stack.likeCount)} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-base leading-snug">
          <Link href={`/profile/${user.id}`} className="font-black mr-2 uppercase">
            {user.username}
          </Link>
          <span className="font-semibold">{stack.caption}</span>
        </p>
      </div>

      {/* View Comments */}
      {stack.commentCount > 0 && (
        <div className="px-4 pb-3">
          <Link href={`/stacks/${stack.id}`} className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:opacity-70 transition">
            View all {stack.commentCount} comments
          </Link>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-4">
        <p className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">{formatDate(stack.createdAt)}</p>
      </div>
    </article>
  );
}
