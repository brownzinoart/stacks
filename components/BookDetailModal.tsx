"use client";

import { Book } from "../lib/mockData";
import Modal from "./Modal";
import Badge from "./Badge";
import { Plus, BookMarked, Heart } from "lucide-react";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  matchLevel?: "high" | "medium" | "low" | "read";
}

export default function BookDetailModal({
  book,
  isOpen,
  onClose,
  matchLevel,
}: BookDetailModalProps) {
  if (!book) return null;

  const matchColors = {
    high: "bg-accent-teal",
    medium: "bg-accent-yellow",
    low: "bg-accent-coral",
    read: "bg-light-borderSecondary dark:bg-dark-borderSecondary",
  };

  const matchLabels = {
    high: "High Match",
    medium: "Medium Match",
    low: "Low Match",
    read: "Already Read",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="space-y-6">
        {/* Book Header */}
        <div className="flex gap-6">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="w-32 h-48 bg-gradient-secondary border-[5px] border-light-border dark:border-dark-border shadow-brutal rounded-[20px] flex items-center justify-center">
              <p className="text-white font-black text-xs text-center px-2">
                {book.title}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text mb-2">
              {book.title}
            </h3>
            <p className="font-bold text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
              by {book.author}
            </p>

            {/* Match Badge */}
            {matchLevel && (
              <div className="mb-4">
                <Badge variant={matchLevel === "high" ? "success" : matchLevel === "medium" ? "secondary" : "accent"}>
                  {matchLabels[matchLevel]}
                </Badge>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl px-3 py-2">
                <p className="text-xs font-black uppercase text-light-textTertiary dark:text-dark-textTertiary">
                  Pages
                </p>
                <p className="text-lg font-black text-light-text dark:text-dark-text">
                  {book.pageCount}
                </p>
              </div>
              <div className="bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl px-3 py-2">
                <p className="text-xs font-black uppercase text-light-textTertiary dark:text-dark-textTertiary">
                  Year
                </p>
                <p className="text-lg font-black text-light-text dark:text-dark-text">
                  {book.publishYear}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
            Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <Badge key={genre} variant="primary">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tropes */}
        {book.tropes && book.tropes.length > 0 && (
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
              Tropes
            </h4>
            <div className="flex flex-wrap gap-2">
              {book.tropes.map((trope) => (
                <Badge key={trope} variant="secondary">
                  {trope}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3 pt-4 border-t-[5px] border-light-border dark:border-dark-border">
          <button className="btn-brutal bg-accent-cyan text-white flex items-center justify-center gap-2">
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add to Stack</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-brutal bg-accent-yellow text-light-text dark:text-dark-text flex items-center justify-center gap-2">
              <BookMarked className="w-5 h-5 stroke-[3]" />
              <span>Want to Read</span>
            </button>
            <button className="btn-brutal bg-accent-coral text-white flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 stroke-[3]" />
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
