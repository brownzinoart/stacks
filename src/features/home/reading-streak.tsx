/**
 * Reading Streak component - Ultra Bold Gen Z Design
 * Massive typography with dramatic progress tracking
 */

'use client';

const mockStreakData = {
  currentStreak: 7,
  longestStreak: 23,
  todayPages: 8,
  dailyGoal: 10,
  weekProgress: [true, true, false, true, true, true, false],
};

export const ReadingStreak = () => {
  const progressPercentage = (mockStreakData.todayPages / mockStreakData.dailyGoal) * 100;
  const isGoalMet = mockStreakData.todayPages >= mockStreakData.dailyGoal;

  return (
    <div className="bg-primary-purple rounded-xl-card p-12 shadow-mega relative overflow-hidden">
      <div className="space-y-8 relative z-10">
        <div>
          <h2 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wider">YOUR</h2>
          <h1 className="text-huge font-black text-text-primary leading-extra-tight mb-4">
            <span className="text-primary-yellow">READING</span><br />
            <span className="text-mega">STREAK</span>
          </h1>
          <div className="bg-primary-orange text-white px-6 py-4 rounded-pill inline-flex items-center gap-3 shadow-card">
            <span className="text-3xl font-black">{mockStreakData.currentStreak}</span>
            <div>
              <div className="text-sm font-black uppercase">DAYS</div>
              <div className="text-xs opacity-90 font-bold">IN A ROW! 🔥</div>
            </div>
          </div>
          <p className="text-sm text-text-primary/80 mt-4 font-bold">
            Longest streak: {mockStreakData.longestStreak} days
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-text-primary font-bold text-lg">Today&apos;s reading</span>
            <div className="text-right">
              <div className="text-2xl font-black text-text-primary">
                {mockStreakData.todayPages}<span className="text-lg">/{mockStreakData.dailyGoal}</span>
              </div>
              <div className="text-sm font-bold text-text-primary/80">pages</div>
            </div>
          </div>
          
          <div className="w-full bg-white/50 rounded-pill h-4 shadow-inner">
            <div 
              className="bg-primary-green h-4 rounded-pill transition-all duration-500 shadow-card"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          {isGoalMet ? (
            <div className="bg-primary-green text-text-primary px-6 py-3 rounded-pill text-center shadow-card">
              <span className="text-lg font-black">🎉 GOAL SMASHED!</span>
            </div>
          ) : (
            <p className="text-lg text-text-primary font-bold text-center">
              Just {mockStreakData.dailyGoal - mockStreakData.todayPages} more pages to go! 💪
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {mockStreakData.weekProgress.map((completed, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 hover:scale-110 ${
                completed 
                  ? 'bg-primary-green text-text-primary shadow-card' 
                  : 'bg-white/50 text-text-secondary'
              }`}
            >
              {completed ? '✓' : index + 1}
            </div>
          ))}
        </div>

        <button className="w-full bg-white text-text-primary font-black py-6 px-8 rounded-pill hover:bg-primary-yellow hover:scale-105 transition-all duration-300 shadow-card text-lg">
          LOG MORE PAGES! 📖
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-teal rounded-full opacity-20" />
      <div className="absolute bottom-8 right-8 w-20 h-20 bg-primary-pink rounded-full opacity-30" />
    </div>
  );
}; 