"use client";

import { Fragment, useMemo, useState } from "react";
import { Book } from "@/lib/mockData";

interface Props {
  books: Book[];
  onAdd: (bookId: string, start: Date, target?: Date) => void;
}

export default function AddBookModal({ books, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bookId, setBookId] = useState("");
  const [startDate, setStartDate] = useState<string>(toInputValue(new Date()));
  const [targetDate, setTargetDate] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }, [books, query]);

  const add = () => {
    if (!bookId) return;
    const start = startDate ? new Date(startDate) : new Date();
    const target = targetDate ? new Date(targetDate) : undefined;
    onAdd(bookId, start, target);
    setOpen(false);
    setQuery("");
    setBookId("");
    setStartDate(toInputValue(new Date()));
    setTargetDate("");
  };

  return (
    <Fragment>
      <button className="badge-brutal" onClick={() => setOpen(true)}>＋ Add Book</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg card-brutal p-4 bg-white dark:bg-dark-secondary">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-black uppercase tracking-tight">Add a Book</div>
              <button className="badge-brutal" onClick={() => setOpen(false)}>Close</button>
            </div>

            <input
              className="input-brutal mb-3"
              placeholder="Search title or author"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="max-h-48 overflow-y-auto mb-3 space-y-2">
              {filtered.map((b) => (
                <label key={b.id} className={`flex items-center gap-3 p-2 border-2 rounded-xl ${bookId === b.id ? 'border-black' : 'border-gray-300 dark:border-gray-600'}`}>
                  <input
                    type="radio"
                    name="book"
                    value={b.id}
                    checked={bookId === b.id}
                    onChange={() => setBookId(b.id)}
                  />
                  <span className="font-semibold">{b.title}</span>
                  <span className="text-sm opacity-70">— {b.author}</span>
                </label>
              ))}
              {filtered.length === 0 && (
                <div className="text-sm font-semibold opacity-70">No matches</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-black uppercase mb-1">Start Date</div>
                <input className="input-brutal" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <div className="text-xs font-black uppercase mb-1">Target Date (optional)</div>
                <input className="input-brutal" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button className="badge-brutal" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-brutal-touch" onClick={add} disabled={!bookId}>Add</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

function toInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

