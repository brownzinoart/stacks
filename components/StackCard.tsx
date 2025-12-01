"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { Stack, User, MatchLevel } from "../lib/mockData";
import { useScrollAnimation } from "../lib/useScrollAnimation";
import HashtagBadge from "./HashtagBadge";

interface StackCardProps {
  stack: Stack;
  user: User;
  globalVizEnabled?: boolean;
  onHashtagClick?: (hashtag: string) => void;
}

const getMatchBadge = (level: MatchLevel) => {
  switch (level) {
    case "high":
      return {
        percentage: Math.floor(Math.random() * 11) + 85, // 85-95%
        label: "MATCH",
        bgColor: "bg-[#10b981]", // Green
        textColor: "text-white"
      };
    case "medium":
      return {
        percentage: Math.floor(Math.random() * 16) + 60, // 60-75%
        label: "MATCH",
        bgColor: "bg-[#f59e0b]", // Orange
        textColor: "text-white"
      };
    case "low":
      return {
        percentage: Math.floor(Math.random() * 16) + 25, // 25-40%
        label: "MATCH",
        bgColor: "bg-[#ef4444]", // Red
        textColor: "text-white"
      };
    case "read":
      return {
        percentage: null,
        label: "READ",
        bgColor: "bg-[#6b7280]", // Gray
        textColor: "text-white"
      };
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

// Helper function to render caption with clickable hashtags
const renderCaptionWithHashtags = (
  caption: string,
  onHashtagClick?: (hashtag: string) => void
) => {
  // Match hashtags: # followed by alphanumeric characters
  const hashtagRegex = /(#\w+)/g;
  const parts = caption.split(hashtagRegex);

  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <HashtagBadge
          key={index}
          hashtag={part}
          onClick={onHashtagClick}
        />
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function StackCard({ stack, user, globalVizEnabled = false, onHashtagClick }: StackCardProps) {
  const [localVizEnabled, setLocalVizEnabled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const vizActive = globalVizEnabled || localVizEnabled;
  const ref = useScrollAnimation("up");

  return (
    <article
      ref={ref}
      className="card-brutal group hover:-translate-y-1 hover:shadow-[-10px_10px_0_0_rgb(var(--shadow-color))] transition-all duration-300"
    >
      {/* Header - Profile + Menu */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[5px] border-light-border dark:border-dark-border bg-gradient-to-r from-transparent via-riso-pink/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-riso-purple-pink border-[3px] border-light-border dark:border-dark-border shadow-brutal-badge transition-transform hover:scale-110 hover:rotate-3" />
          <Link href={`/profile/${user.id}`} className="link-motherduck font-display font-black text-base uppercase tracking-tight hover:text-riso-purple transition-colors">
            {user.username}
          </Link>
        </div>
        <button className="p-2 hover:bg-light-primary dark:hover:bg-dark-primary rounded-lg transition-all hover:rotate-90 duration-300">
          <MoreHorizontal className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Stack Image */}
      <div className="relative w-full border-b-[5px] border-light-border dark:border-dark-border overflow-hidden">
        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 duotone-image">
          <Image
            src={stack.photo}
            alt={stack.caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 640px"
          />

          {/* Stack Viz overlay on books when active */}
          {vizActive && (
            <div className="absolute inset-0 flex items-center justify-center px-6 py-2 md:px-8 md:py-2" style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.75) 100%)'
            }}>
              {/* Fixed container constrained to image bounds - no scroll */}
              <div className="w-full h-full overflow-hidden flex items-center justify-center">
                <div className="flex flex-col gap-2 md:gap-2 w-full max-w-md">
                  {stack.books.map((bookMatch) => {
                    const badge = getMatchBadge(bookMatch.matchLevel);
                    return (
                      <div key={bookMatch.book.id} className="flex items-center gap-3 md:gap-4">
                        {/* Match percentage badge */}
                        <div className={`flex-shrink-0 w-[60px] md:w-[70px] px-2.5 py-1.5 border-[3px] border-black dark:border-white rounded-lg shadow-brutal-badge ${badge.bgColor} text-center`}>
                          {badge.percentage !== null ? (
                            <>
                              <div className={`text-base md:text-lg font-black leading-none ${badge.textColor}`}>
                                {badge.percentage}%
                              </div>
                              <div className={`text-[8px] font-black uppercase tracking-wider ${badge.textColor} opacity-90 mt-0.5`}>
                                {badge.label}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={`text-lg md:text-xl font-black leading-none ${badge.textColor}`}>
                                ✓
                              </div>
                              <div className={`text-[8px] font-black uppercase tracking-wider ${badge.textColor} opacity-90 mt-0.5`}>
                                {badge.label}
                              </div>
                            </>
                          )}
                        </div>
                        {/* Book title */}
                        <div className="flex-1 bg-white/95 dark:bg-gray-900/95 border-4 border-black dark:border-white rounded-lg shadow-brutal-sm px-3 py-2 md:px-4 md:py-3">
                          <p className="text-xs md:text-sm font-black uppercase tracking-tight leading-tight">
                            {bookMatch.book.title}
                          </p>
                          <p className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1">
                            {bookMatch.book.author}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stack Viz toggle button */}
        {!globalVizEnabled && (
          <button
            onClick={() => setLocalVizEnabled(!localVizEnabled)}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
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
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-light-borderSecondary dark:border-dark-borderSecondary">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="transition-all hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-8 h-8 stroke-[3] transition-all ${
                isLiked
                  ? 'fill-riso-red stroke-riso-red scale-110'
                  : 'hover:stroke-riso-red'
              }`}
            />
          </button>
          <button className="transition-all hover:scale-110 active:scale-95 hover:text-riso-blue">
            <MessageCircle className="w-8 h-8 stroke-[3]" />
          </button>
          <button className="transition-all hover:scale-110 active:scale-95 hover:text-riso-green">
            <Send className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="transition-all hover:scale-110 active:scale-95"
        >
          <Bookmark
            className={`w-8 h-8 stroke-[3] transition-all ${
              isBookmarked
                ? 'fill-riso-yellow stroke-riso-yellow scale-110'
                : 'hover:stroke-riso-yellow'
            }`}
          />
        </button>
      </div>

      {/* Like Count */}
      <div className="px-4 py-3">
        <p className="font-display font-black text-base uppercase tracking-tight">{formatNumber(stack.likeCount)} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-base leading-snug">
          <Link href={`/profile/${user.id}`} className="link-motherduck font-display font-black mr-2 uppercase hover:text-riso-purple transition-colors">
            {user.username}
          </Link>
          <span className="font-semibold text-lg inline-flex flex-wrap gap-2 items-center">
            {renderCaptionWithHashtags(stack.caption, onHashtagClick)}
          </span>
        </p>
      </div>

      {/* View Comments */}
      {stack.commentCount > 0 && (
        <div className="px-4 pb-3">
          <Link href={`/stacks/${stack.id}`} className="text-sm font-display font-black text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider hover:text-riso-blue transition-colors inline-flex items-center gap-1">
            View all {stack.commentCount} comments
          </Link>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-4">
        <p className="font-mono text-xs font-bold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-widest">{formatDate(stack.createdAt)}</p>
      </div>
    </article>
  );
}
