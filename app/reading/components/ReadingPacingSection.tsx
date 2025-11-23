"use client";

import { useMemo, useState } from "react";
import { getBookById, mockBooks, mockReadingProgressEnhanced, ReadingProgressEnhanced } from "../../../lib/mockData";
import CompletedSummary from "./pacing/CompletedSummary";
import CurrentlyReadingCard from "./pacing/CurrentlyReadingCard";
import AddBookModal from "./pacing/AddBookModal";

export default function ReadingPacingSection() {
  const [items, setItems] = useState<ReadingProgressEnhanced[]>(() => {
    const base = mockReadingProgressEnhanced.filter((p) => p.status === "reading");
    // hydrate any saved target dates from localStorage or use mock data targetDate
    if (typeof window !== "undefined") {
      return base.map((it) => {
        try {
          const raw = window.localStorage.getItem(lsKey(it.bookId));
          if (raw) {
            const d = new Date(raw);
            if (!isNaN(d.getTime())) {
              return { ...(it as any), _targetDate: d } as any;
            }
          }
          // Fall back to mock data targetDate if no localStorage value
          if ((it as any)._targetDate) {
            return it as any;
          }
          return it as any;
        } catch {
          // Fall back to mock data targetDate if localStorage fails
          if ((it as any)._targetDate) {
            return it as any;
          }
          return it as any;
        }
      });
    }
    return base as any;
  });

  const completed = useMemo(
    () => mockReadingProgressEnhanced.filter((p) => p.status === "finished" && p.finishedDate),
    []
  );

  const handleCheckIn = (id: string, value: number, mode: "increment" | "bookmark") => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const today = new Date();

        let nextPage: number;
        let pagesRead: number;

        if (mode === "bookmark") {
          // User entered the page number they're on
          nextPage = Math.min(it.totalPages, value);
          pagesRead = nextPage - it.currentPage;
        } else {
          // User entered pages read (increment mode)
          nextPage = Math.min(it.totalPages, it.currentPage + value);
          pagesRead = value;
        }

        return {
          ...it,
          currentPage: nextPage,
          dailyCheckIns: [
            ...it.dailyCheckIns,
            { date: today, pagesRead, timeOfDay: getTimeOfDay(today) },
          ],
        };
      })
    );
  };

  const handleTargetDateChange = (id: string, target: Date | null) => {
    // Only tracked locally in UI; store using a symbol on the item via type cast
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it as any;
        const next = { ...(it as any), _targetDate: target } as any;
        // persist by bookId for demo
        try {
          const key = lsKey(it.bookId);
          if (!target) window.localStorage.removeItem(key);
          else window.localStorage.setItem(key, target.toISOString());
        } catch {}
        return next;
      })
    );
  };

  const handleAddBook = (bookId: string, startDate: Date, targetDate?: Date) => {
    const book = getBookById(bookId);
    if (!book) return;
    const newItem: ReadingProgressEnhanced = {
      id: `rp-ui-${Date.now()}`,
      bookId: book.id,
      userId: "user-1",
      startDate,
      finishedDate: null,
      currentPage: 0,
      totalPages: book.pageCount,
      status: "reading",
      dailyCheckIns: [],
    } as any;
    (newItem as any)._targetDate = targetDate;
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <section className="mt-6">
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">📖 Pacing</h2>
        <AddBookModal
          books={mockBooks.filter(b => !items.some(it => it.bookId === b.id))}
          onAdd={(bookId, start, target) => handleAddBook(bookId, start, target || undefined)}
        />
      </div>

      {/* Completed snapshot */}
      <div className="px-4 mb-4">
        <CompletedSummary finished={completed} />
      </div>

      {/* Currently reading list */}
      <div className="space-y-4 px-4">
        {items.length === 0 && (
          <div className="card-brutal p-6 text-center font-black uppercase">
            Start a book to begin pacing
          </div>
        )}
        {items.map((it) => (
          <CurrentlyReadingCard
            key={it.id}
            progress={it}
            targetDate={(it as any)._targetDate || null}
            onTargetDateChange={(d) => handleTargetDateChange(it.id, d)}
            onCheckIn={(value, mode) => handleCheckIn(it.id, value, mode)}
          />
        ))}
      </div>

      {/* All Books List with Completion Status */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-black uppercase tracking-tight mb-4">📚 All Books</h3>
        <div className="space-y-3">
          {mockReadingProgressEnhanced.map((progress) => {
            const book = getBookById(progress.bookId);
            if (!book) return null;

            const completionPercentage = Math.round((progress.currentPage / progress.totalPages) * 100);
            const isFinished = progress.status === "finished";

            return (
              <div
                key={progress.id}
                className="bg-white dark:bg-dark-secondary border-4 border-black dark:border-white rounded-xl p-4 shadow-brutal-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-12 h-16 object-cover border-2 border-black dark:border-white rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm leading-tight truncate">{book.title}</h4>
                    <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary font-semibold truncate">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-2">
                  {progress.status === "abandoned" ? (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 rounded-lg border-2 border-black dark:border-white w-[70px] justify-center">
                      <span className="font-black text-xs uppercase text-white">DNF</span>
                    </div>
                  ) : isFinished ? (
                    <div className="flex items-center gap-1 bg-gradient-to-br from-[#11998e] to-[#38ef7d] px-3 py-1 rounded-lg border-2 border-black dark:border-white w-[70px] justify-center">
                      <span className="text-lg leading-none text-white">✓</span>
                      <span className="font-black text-xs uppercase text-white">Done</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-gradient-to-br from-[#2563eb] to-[#0891b2] px-3 py-1 rounded-lg border-2 border-black dark:border-white w-[70px] justify-center">
                      <span className="font-black text-xs uppercase text-white">{completionPercentage}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getTimeOfDay(date: Date): "morning" | "afternoon" | "evening" | "night" {
  const h = date.getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

function lsKey(bookId: string) {
  return `reading:pacing:targetDate:${bookId}`;
}
