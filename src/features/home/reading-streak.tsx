/**
 * Reading Plan component - Ultra Bold Gen Z Design
 * Manual page logging with realistic reading tracking
 */

'use client';

import { BookCover } from '@/components/book-cover';
import { useState } from 'react';

const mockReadingPlan = {
  currentBook: {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    totalPages: 400,
    pagesRead: 120,
    dueDate: "2024-08-03", // 14 days from now
    isLibraryBook: true,
  },
  dailyTarget: 20, // pages per day to finish on time
  daysRemaining: 14,
  todayPagesRead: 0, // Start at 0, user logs manually
  isOnTrack: true,
  averagePagesPerDay: 15 // average reading speed
};

export const ReadingStreak = () => {
  const [todayPagesRead, setTodayPagesRead] = useState(mockReadingPlan.todayPagesRead);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [pagesToLog, setPagesToLog] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    totalPages: '',
    dueDate: '',
    isLibraryBook: false
  });

  const progressPercentage = (mockReadingPlan.currentBook.pagesRead / mockReadingPlan.currentBook.totalPages) * 100;
  const pagesRemaining = mockReadingPlan.currentBook.totalPages - mockReadingPlan.currentBook.pagesRead;
  const todayProgress = (todayPagesRead / mockReadingPlan.averagePagesPerDay) * 100;
  const isOnTrack = todayPagesRead >= mockReadingPlan.averagePagesPerDay;

  const handleLogPages = async () => {
    if (!pagesToLog || isNaN(Number(pagesToLog))) return;
    
    setIsLogging(true);
    // Simulate API call
    setTimeout(() => {
      const newPages = todayPagesRead + Number(pagesToLog);
      setTodayPagesRead(newPages);
      setPagesToLog('');
      setShowLogForm(false);
      setIsLogging(false);
    }, 1000);
  };

  const handleQuickLog = (pages: number) => {
    setTodayPagesRead(todayPagesRead + pages);
  };

  return (
    <div className="bg-primary-purple rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div className="relative">
          {/* Status Badge */}
          <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-black shadow-backdrop z-10 ${
            isOnTrack 
              ? 'bg-primary-green text-white' 
              : 'bg-primary-orange text-white'
          }`}>
            {isOnTrack ? 'ON TRACK!' : 'CATCH UP!'}
          </div>

          <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
            <span className="text-primary-yellow">READING</span><br />
            <span className="text-mega">PLAN</span>
          </h1>

          {/* Simple Book Card with External Link */}
          <div className="mb-6">
            <div className="text-right mb-2">
              <button
                onClick={() => setShowAddBookForm(!showAddBookForm)}
                className="text-primary-blue font-black text-sm hover:text-primary-blue/80 transition-colors"
              >
                + Start new book
              </button>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 outline-bold-thin">
              <div className="flex items-start gap-4 sm:gap-6">
                <BookCover 
                  title={mockReadingPlan.currentBook.title} 
                  author={mockReadingPlan.currentBook.author} 
                  className="w-16 h-24 sm:w-20 sm:h-28"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-text-primary text-lg sm:text-xl leading-tight mb-2">
                    {mockReadingPlan.currentBook.title}
                  </h3>
                  <p className="text-text-secondary text-sm sm:text-base font-bold">
                    {mockReadingPlan.currentBook.author}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* At-a-Glance Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary-orange text-white rounded-2xl p-4 text-center shadow-backdrop">
              <div className="text-2xl sm:text-3xl font-black">{mockReadingPlan.daysRemaining}</div>
              <div className="text-xs sm:text-sm font-bold uppercase">Days Left to Return</div>
            </div>
            <div className="bg-primary-yellow text-text-primary rounded-2xl p-4 text-center shadow-backdrop">
              <div className="text-2xl sm:text-3xl font-black">{mockReadingPlan.averagePagesPerDay}</div>
              <div className="text-xs sm:text-sm font-bold uppercase">Pages per Day</div>
            </div>
          </div>


        </div>

        {/* Overall Progress */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-text-primary font-bold text-base sm:text-lg">Book Progress</span>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-text-primary">
                {mockReadingPlan.currentBook.pagesRead}<span className="text-lg">/{mockReadingPlan.currentBook.totalPages}</span>
              </div>
              <div className="text-sm font-bold text-text-primary/80">pages read</div>
            </div>
          </div>
          
          <div className="w-full bg-white/50 rounded-full h-3 sm:h-4 shadow-inner">
            <div
              className="bg-primary-green h-3 sm:h-4 rounded-full transition-all duration-500 shadow-[0_2px_8px_rgb(0,0,0,0.2)]"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Progress */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-text-primary font-bold text-base sm:text-lg">Today&apos;s Progress</span>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-text-primary">
                {todayPagesRead}<span className="text-lg">/{mockReadingPlan.averagePagesPerDay}</span>
              </div>
              <div className="text-sm font-bold text-text-primary/80">pages today</div>
            </div>
          </div>
          
          <div className="w-full bg-white/50 rounded-full h-3 sm:h-4 shadow-inner">
            <div
              className="bg-primary-teal h-3 sm:h-4 rounded-full transition-all duration-500 shadow-[0_2px_8px_rgb(0,0,0,0.2)]"
              style={{ width: `${Math.min(todayProgress, 100)}%` }}
            />
          </div>
          
          {todayPagesRead >= mockReadingPlan.averagePagesPerDay ? (
            <div className="bg-primary-green text-text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full text-center shadow-backdrop">
              <span className="text-base sm:text-lg font-black">AVERAGE BEATEN!</span>
            </div>
          ) : (
            <p className="text-base sm:text-lg text-text-primary font-bold text-center">
              Just {mockReadingPlan.averagePagesPerDay - todayPagesRead} more pages to hit average!
            </p>
          )}
        </div>

                {/* Quick Log Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickLog(5)}
            className="flex-1 bg-white/80 text-text-primary px-3 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform touch-feedback"
          >
            +5 PAGES
          </button>
          <button
            onClick={() => handleQuickLog(10)}
            className="flex-1 bg-white/80 text-text-primary px-3 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform touch-feedback"
          >
            +10 PAGES
          </button>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="flex-1 bg-white/80 text-text-primary px-3 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform touch-feedback"
          >
            +CUSTOM
          </button>
        </div>

        {/* Custom Log Form */}
        {showLogForm && (
          <div className="bg-white/90 rounded-2xl p-4 sm:p-6 outline-bold-thin animate-fade-in-up mt-4">
            <h4 className="font-black text-text-primary text-base sm:text-lg mb-3">Log Pages Read</h4>
            <div className="flex gap-3">
              <input
                type="number"
                value={pagesToLog}
                onChange={(e) => setPagesToLog(e.target.value)}
                placeholder="Pages read..."
                className="flex-1 px-4 py-2 rounded-full bg-white/80 text-text-primary font-bold text-center outline-bold-thin"
                min="1"
                max="100"
              />
              <button
                onClick={handleLogPages}
                disabled={!pagesToLog || isLogging}
                className="bg-primary-blue text-white px-6 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform touch-feedback disabled:opacity-50"
              >
                {isLogging ? 'LOGGING...' : 'LOG'}
              </button>
            </div>
          </div>
        )}

        {/* Add Book Form */}
        {showAddBookForm && (
          <div className="bg-white/95 rounded-2xl p-6 outline-bold-thin animate-fade-in-up">
            <h4 className="font-black text-text-primary text-xl mb-4">Start Your Reading Journey</h4>
            <div className="space-y-4">
              <input
                type="text"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                placeholder="What book are you reading?"
                className="w-full px-4 py-3 rounded-full bg-white text-text-primary font-bold outline-bold-thin"
              />
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                placeholder="Who's the author?"
                className="w-full px-4 py-3 rounded-full bg-white text-text-primary font-bold outline-bold-thin"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newBook.totalPages}
                  onChange={(e) => setNewBook({...newBook, totalPages: e.target.value})}
                  placeholder="Total pages"
                  className="px-4 py-3 rounded-full bg-white text-text-primary font-bold text-center outline-bold-thin"
                />
                <input
                  type="date"
                  value={newBook.dueDate}
                  onChange={(e) => setNewBook({...newBook, dueDate: e.target.value})}
                  className="px-4 py-3 rounded-full bg-white text-text-primary font-bold text-center outline-bold-thin"
                />
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full">
                <input
                  type="checkbox"
                  checked={newBook.isLibraryBook}
                  onChange={(e) => setNewBook({...newBook, isLibraryBook: e.target.checked})}
                  className="w-5 h-5 accent-primary-blue"
                />
                <label className="text-text-primary font-bold">This is a library book with a due date</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    // TODO: Implement add book functionality
                    console.log('Adding book:', newBook);
                    setShowAddBookForm(false);
                    setNewBook({title: '', author: '', totalPages: '', dueDate: '', isLibraryBook: false});
                  }}
                  className="flex-1 bg-primary-green text-white px-6 py-3 rounded-full font-black text-lg hover:scale-105 transition-transform touch-feedback"
                >
                  START READING
                </button>
                <button
                  onClick={() => setShowAddBookForm(false)}
                  className="px-6 py-3 rounded-full font-black text-lg border-2 border-text-primary text-text-primary hover:scale-105 transition-transform touch-feedback"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 left-6 w-14 h-14 sm:w-18 sm:h-18 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-6 right-6 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-8 right-4 w-8 h-8 sm:w-12 sm:h-12 bg-primary-orange rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-8 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-primary-blue rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary-green rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-4 left-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 