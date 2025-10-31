export default function ReadingPage() {
  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b-4 border-black dark:border-white">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Reading</h1>
          <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
            Track your progress
          </p>
        </div>
      </header>

      {/* Placeholder content */}
      <div className="p-4">
        <div className="card-brutal p-8 text-center">
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Your reading pacing dashboard will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
