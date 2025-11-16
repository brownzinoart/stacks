/**
 * Reading Plan component - Ultra Bold Gen Z Design
 * Manual page logging with realistic reading tracking
 */

'use client';

import { BookCover } from '@/components/book-cover';
import { useState } from 'react';
import dayjs from 'dayjs';

const initialReadingPlan = {
  currentBook: {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    totalPages: 400,
    pagesRead: 120,
    dueDate: dayjs().add(15, 'day').format('YYYY-MM-DD'), // 15 days from now
    isLibraryBook: true,
  },
  todayPagesRead: 0, // Start at 0, user logs manually
};

export const ReadingStreak = () => {
  const [readingPlan, setReadingPlan] = useState(initialReadingPlan);
  const [todayPagesRead, setTodayPagesRead] = useState(initialReadingPlan.todayPagesRead);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [pagesToLog, setPagesToLog] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    totalPages: '',
    dueDate: '',
    isLibraryBook: false,
  });

  // Calculate derived values
  const pagesRead = readingPlan.currentBook.pagesRead + todayPagesRead;
  const totalPages = readingPlan.currentBook.totalPages;
  const dueDate = readingPlan.currentBook.dueDate;
  const daysRemaining = Math.max(dayjs(dueDate).diff(dayjs(), 'day'), 1);
  const pagesRemaining = Math.max(totalPages - pagesRead, 0);
  const averagePagesPerDay = pagesRemaining > 0 ? Math.ceil(pagesRemaining / daysRemaining) : 0;

  const progressPercentage = (pagesRead / totalPages) * 100;
  const todayProgress = (todayPagesRead / averagePagesPerDay) * 100;
  const isOnTrack = todayPagesRead >= averagePagesPerDay;

  const handleLogPages = async () => {
    if (!pagesToLog || isNaN(Number(pagesToLog))) return;
    setIsLogging(true);
    setTimeout(() => {
      const newPages = todayPagesRead + Number(pagesToLog);
      setTodayPagesRead(newPages);
      setPagesToLog('');
      setShowLogForm(false);
      setIsLogging(false);
    }, 500);
  };

  const handleQuickLog = (pages: number) => {
    setTodayPagesRead(todayPagesRead + pages);
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-purple p-6 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-8">
      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="relative">
          {/* Status Badge */}
          <div
            className={`shadow-backdrop absolute -right-2 -top-2 z-10 rounded-full px-3 py-1 text-xs font-black ${
              isOnTrack ? 'bg-primary-green text-white' : 'bg-primary-orange text-white'
            }`}
          >
            {isOnTrack ? 'ON TRACK!' : 'CATCH UP!'}
          </div>

          <h1 className="mb-3 text-2xl md:text-3xl font-black leading-extra-tight text-text-primary sm:mb-4">
            <span className="text-primary-yellow">READING</span>
            <br />
            <span className="text-3xl md:text-4xl">PLAN</span>
          </h1>

          {/* Simple Book Card with External Link */}
          <div className="mb-6">
            <div className="mb-2 text-right">
              <button
                onClick={() => setShowAddBookForm(!showAddBookForm)}
                className="text-sm font-black text-primary-blue transition-colors hover:text-primary-blue/80"
              >
                + Start new book
              </button>
            </div>

            <div className="outline-bold-thin rounded-2xl bg-white/20 p-4 backdrop-blur-sm sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <BookCover
                  title={readingPlan.currentBook.title}
                  author={readingPlan.currentBook.author}
                  className="h-20 w-14 sm:h-24 sm:w-16"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-base font-black leading-tight text-text-primary sm:text-lg">
                    {readingPlan.currentBook.title}
                  </h3>
                  <p className="text-sm font-bold text-text-secondary">{readingPlan.currentBook.author}</p>
                </div>
              </div>
            </div>
          </div>

          {/* At-a-Glance Metrics */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="shadow-backdrop rounded-2xl bg-primary-orange p-3 text-center text-white">
              <div className="text-xl font-black sm:text-2xl">{daysRemaining}</div>
              <div className="text-xs font-bold uppercase">Days Left to Return</div>
            </div>
            <div className="shadow-backdrop rounded-2xl bg-primary-yellow p-3 text-center text-text-primary">
              <div className="text-xl font-black sm:text-2xl">{averagePagesPerDay}</div>
              <div className="text-xs font-bold uppercase">Pages per Day</div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-sm font-bold text-text-primary sm:text-base">Book Progress</span>
            <div className="text-right">
              <div className="text-lg font-black text-text-primary sm:text-xl">
                {pagesRead}
                <span className="text-base">/{totalPages}</span>
              </div>
              <div className="text-xs font-bold text-text-primary/80">pages read</div>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-white/50 shadow-inner sm:h-4">
            <div
              className="h-3 rounded-full bg-primary-green shadow-[0_2px_8px_rgb(0,0,0,0.2)] transition-all duration-500 sm:h-4"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Progress */}
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-sm font-bold text-text-primary sm:text-base">Today&apos;s Progress</span>
            <div className="text-right">
              <div className="text-lg font-black text-text-primary sm:text-xl">
                {todayPagesRead}
                <span className="text-base">/{averagePagesPerDay}</span>
              </div>
              <div className="text-xs font-bold text-text-primary/80">pages today</div>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-white/50 shadow-inner sm:h-4">
            <div
              className="h-3 rounded-full bg-primary-teal shadow-[0_2px_8px_rgb(0,0,0,0.2)] transition-all duration-500 sm:h-4"
              style={{ width: `${Math.min(todayProgress, 100)}%` }}
            />
          </div>

          {todayPagesRead >= averagePagesPerDay ? (
            <div className="shadow-backdrop rounded-full bg-primary-green px-4 py-2 text-center text-text-primary">
              <span className="text-sm font-black sm:text-base">AVERAGE BEATEN!</span>
            </div>
          ) : (
            <p className="text-center text-sm font-bold text-text-primary sm:text-base">
              Just {averagePagesPerDay - todayPagesRead} more pages to hit average!
            </p>
          )}
        </div>

        {/* Quick Log Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickLog(5)}
            className="touch-feedback flex-1 rounded-full bg-white/80 px-3 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 min-h-touch-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            +5 PAGES
          </button>
          <button
            onClick={() => handleQuickLog(10)}
            className="touch-feedback flex-1 rounded-full bg-white/80 px-3 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 min-h-touch-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            +10 PAGES
          </button>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="touch-feedback flex-1 rounded-full bg-white/80 px-3 py-3 text-sm font-bold text-text-primary transition-transform hover:scale-105 min-h-touch-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            +CUSTOM
          </button>
        </div>

        {/* Custom Log Form */}
        {showLogForm && (
          <div className="outline-bold-thin animate-fade-in-up mt-4 rounded-2xl bg-white/90 p-4 sm:p-6">
            <h4 className="mb-3 text-base font-black text-text-primary sm:text-lg">Log Pages Read</h4>
            <div className="flex gap-3">
              <input
                type="number"
                value={pagesToLog}
                onChange={(e) => setPagesToLog(e.target.value)}
                placeholder="Pages read..."
                className="outline-bold-thin flex-1 rounded-full bg-white/80 px-4 py-2 text-center font-bold text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                min="1"
                max="100"
              />
              <button
                onClick={handleLogPages}
                disabled={!pagesToLog || isLogging}
                className="touch-feedback rounded-full bg-primary-blue px-6 py-3 text-sm font-black text-white transition-transform hover:scale-105 disabled:opacity-50 min-h-touch-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              >
                {isLogging ? 'LOGGING...' : 'LOG'}
              </button>
            </div>
          </div>
        )}

        {/* Add Book Form */}
        {showAddBookForm && (
          <div className="outline-bold-thin animate-fade-in-up rounded-2xl bg-white/95 p-6">
            <h4 className="mb-4 text-xl font-black text-text-primary">Start Your Reading Journey</h4>
            <div className="space-y-4">
              <input
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                placeholder="What book are you reading?"
                className="outline-bold-thin w-full rounded-full bg-white px-4 py-3 font-bold text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              />
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                placeholder="Who's the author?"
                className="outline-bold-thin w-full rounded-full bg-white px-4 py-3 font-bold text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newBook.totalPages}
                  onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })}
                  placeholder="Total pages"
                  className="outline-bold-thin rounded-full bg-white px-4 py-3 text-center font-bold text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                />
                <input
                  type="date"
                  value={newBook.dueDate}
                  onChange={(e) => setNewBook({ ...newBook, dueDate: e.target.value })}
                  className="outline-bold-thin rounded-full bg-white px-4 py-3 text-center font-bold text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                />
              </div>
              <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={newBook.isLibraryBook}
                  onChange={(e) => setNewBook({ ...newBook, isLibraryBook: e.target.checked })}
                  className="h-5 w-5 accent-primary-blue"
                />
                <label className="font-bold text-text-primary">This is a library book with a due date</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    // TODO: Implement add book functionality
                    console.log('Adding book:', newBook);
                    setShowAddBookForm(false);
                    setNewBook({ title: '', author: '', totalPages: '', dueDate: '', isLibraryBook: false });
                  }}
                  className="touch-feedback flex-1 rounded-full bg-primary-green px-6 py-3 text-base font-black text-white transition-transform hover:scale-105 min-h-touch-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2"
                >
                  START READING
                </button>
                <button
                  onClick={() => setShowAddBookForm(false)}
                  className="touch-feedback rounded-full border-2 border-text-primary px-6 py-3 text-base font-black text-text-primary transition-transform hover:scale-105 min-h-touch-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="sm:w-18 sm:h-18 animate-float absolute left-6 top-4 z-0 h-14 w-14 rounded-full bg-primary-teal opacity-25" />
      <div className="animate-float-delayed absolute bottom-6 right-6 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute right-4 top-8 z-0 h-8 w-8 rounded-full bg-primary-orange opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-8 left-4 z-0 h-12 w-12 rounded-full bg-primary-blue opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-2 top-2 z-0 h-6 w-6 rounded-full bg-primary-green opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-4 left-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
