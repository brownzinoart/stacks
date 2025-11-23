"use client";

import { useMemo, useState } from "react";
import { getBookById, ReadingProgressEnhanced } from "@/lib/mockData";

interface Props {
  progress: ReadingProgressEnhanced;
  targetDate: Date | null;
  onTargetDateChange: (date: Date | null) => void;
  onCheckIn: (pagesRead: number) => void;
}

export default function CurrentlyReadingCard({ progress, targetDate, onTargetDateChange, onCheckIn }: Props) {
  const book = getBookById(progress.bookId)!;
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<string>(targetDate ? toInputValue(targetDate) : "");
  const [checkIn, setCheckIn] = useState("");

  const remainingPages = Math.max(0, progress.totalPages - progress.currentPage);

  const { dailyGoal, paceState, paceText, progressPct, idealPct } = useMemo(() => {
    // Daily goal requires target date & days remaining
    let dailyGoal = 0;
    let paceState: "ahead" | "on" | "slightly-behind" | "behind" = "on";
    let paceText = "✓ ON TRACK";
    const pct = Math.round((progress.currentPage / progress.totalPages) * 100);
    let idealPct = pct;

    if (targetDate) {
      const daysRemaining = daysBetween(new Date(), targetDate);
      if (daysRemaining > 0) {
        dailyGoal = Math.ceil((progress.totalPages - progress.currentPage) / daysRemaining);

        // Ideal progress vs actual progress based on elapsed from start
        const elapsed = Math.max(1, daysBetween(progress.startDate, new Date()));
        const totalWindow = Math.max(1, daysBetween(progress.startDate, targetDate));
        idealPct = Math.min(100, Math.round((elapsed / totalWindow) * 100));
        const deltaPct = pct - idealPct;
        if (deltaPct > 5) {
          paceState = "ahead";
          paceText = `🔥 AHEAD BY ${Math.round((deltaPct / 100) * progress.totalPages)} PAGES`;
        } else if (deltaPct < -5) {
          paceState = "behind";
          paceText = `BEHIND: +${Math.abs(Math.round((deltaPct / 100) * progress.totalPages))} PAGES`;
        } else if (deltaPct < -2) {
          paceState = "slightly-behind";
          paceText = "⚠️ SLIGHTLY BEHIND";
        }
      }
    }
    return { dailyGoal, paceState, paceText, progressPct: pct, idealPct };
  }, [progress.currentPage, progress.totalPages, progress.startDate, targetDate]);

  const saveDate = () => {
    const d = tempDate ? new Date(tempDate) : null;
    onTargetDateChange(d);
    setShowPicker(false);
  };

  const submitCheckIn = () => {
    const pages = parseInt(checkIn, 10);
    if (!Number.isFinite(pages) || pages <= 0) return;
    onCheckIn(pages);
    setCheckIn("");
  };

  return (
    <div className="card-brutal p-4 bg-white dark:bg-dark-secondary">
      {/* Pace badge */}
      <div className={`inline-block px-3 py-1 text-xs font-black tracking-wide rounded-lg border-2 ${
        paceClass(paceState)
      }`}>{paceText}</div>

      {/* Header */}
      <div className="mt-3 flex gap-4">
        <div className="w-16 h-24 flex-shrink-0 rounded-lg border-2 border-black overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="font-black text-lg leading-5 tracking-tight">{book.title}</div>
          <div className="text-sm font-semibold opacity-70">{book.author}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="h-3 w-full bg-sky-100 dark:bg-sky-900 rounded-full overflow-hidden border-2 border-black relative">
          {/* Ideal progress indicator (if target date is set) */}
          {targetDate && idealPct > progressPct && idealPct < 100 && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500 z-10" 
              style={{ left: `${idealPct}%` }}
            />
          )}
          {/* Actual progress */}
          <div 
            className={`h-full transition-colors ${
              paceState === "ahead" 
                ? "bg-emerald-600 dark:bg-emerald-400"
                : paceState === "slightly-behind"
                ? "bg-yellow-500 dark:bg-yellow-400"
                : paceState === "behind"
                ? "bg-amber-600 dark:bg-amber-400"
                : "bg-sky-600 dark:bg-sky-400"
            }`} 
            style={{ width: `${progressPct}%` }} 
          />
        </div>
        <div className="mt-1 text-xs font-black uppercase tracking-wide opacity-80">
          {progress.currentPage} / {progress.totalPages} pages • {progressPct}%
          {targetDate && idealPct !== progressPct && (
            <span className="ml-2 opacity-60">(ideal: {idealPct}%)</span>
          )}
        </div>
      </div>

      {/* Goals */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="card-brutal p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wide opacity-70">Target Date</div>
              <div className="text-lg font-black">{targetDate ? formatShortDate(targetDate) : "—"}</div>
            </div>
            <button className="badge-brutal" onClick={() => { setTempDate(targetDate ? toInputValue(targetDate) : ""); setShowPicker(true); }}>
              ✏️ Edit
            </button>
          </div>
          {showPicker && (
            <div className="mt-3 p-3 border-2 border-black rounded-xl bg-white dark:bg-dark-primary">
              <div className="text-xs font-black uppercase mb-2">Set Target Date</div>
              <input
                type="date"
                className="input-brutal"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />
              <div className="mt-3 flex gap-2">
                <button className="badge-brutal" onClick={() => setShowPicker(false)}>Cancel</button>
                <button className="badge-brutal" onClick={saveDate}>Save</button>
              </div>
            </div>
          )}
        </div>
        <div className="card-brutal p-3">
          <div className="text-[10px] font-black uppercase tracking-wide opacity-70">Daily Goal</div>
          <div className="text-lg font-black">{dailyGoal > 0 ? `${dailyGoal} pages` : "—"}</div>
          {targetDate && remainingPages > 0 && (
            <div className="mt-1 text-[11px] font-semibold opacity-80">
              {remainingPages} pages left by {formatShortDate(targetDate)}
            </div>
          )}
        </div>
      </div>

      {/* Check-in */}
      <div className="mt-4">
        <div className="text-xs font-black uppercase tracking-wide mb-2">Today's Check-in</div>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="Pages read"
            className="input-brutal"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <button className="btn-brutal-touch whitespace-nowrap" onClick={submitCheckIn}>Add</button>
        </div>
      </div>
    </div>
  );
}

function daysBetween(a: Date, b: Date) {
  const ms = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function paceClass(state: "ahead" | "on" | "slightly-behind" | "behind") {
  if (state === "ahead") return "bg-emerald-200 border-black";
  if (state === "behind") return "bg-amber-200 border-black";
  if (state === "slightly-behind") return "bg-yellow-200 border-black";
  return "bg-sky-200 border-black";
}

