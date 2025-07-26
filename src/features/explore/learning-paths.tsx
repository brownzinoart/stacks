/**
 * Learning Paths component - displays curated collections of books for specific topics
 * Shows available learning paths with progress tracking and availability
 */

'use client';

const mockLearningPaths = [
  {
    id: 1,
    title: 'Web Development Mastery',
    description: 'From basics to advanced full-stack development',
    books: 8,
    completed: 3,
    available: 6,
    estimatedTime: '6-8 weeks',
  },
  {
    id: 2,
    title: 'Modern Psychology',
    description: 'Understanding the human mind and behavior',
    books: 6,
    completed: 1,
    available: 5,
    estimatedTime: '4-6 weeks',
  },
  {
    id: 3,
    title: 'Financial Literacy',
    description: 'Personal finance and investment fundamentals',
    books: 7,
    completed: 0,
    available: 7,
    estimatedTime: '5-7 weeks',
  },
];

export const LearningPaths = () => {
  const handleStartPath = (pathId: number) => {
    // TODO: Implement learning path enrollment
    console.log('Starting learning path:', pathId);
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-pink p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-huge font-black leading-extra-tight text-text-primary">
            <span className="text-primary-yellow">POPULAR</span>
            <br />
            <span className="text-mega">PATHS</span>
          </h2>
          <button className="text-base font-black text-primary-blue hover:text-primary-blue/80 sm:text-lg">
            VIEW ALL PATHS
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockLearningPaths.map((path) => {
            const progress = (path.completed / path.books) * 100;

            return (
              <div
                key={path.id}
                className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-black text-text-primary">{path.title}</h3>
                    <p className="text-base font-bold text-text-primary">{path.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-text-primary">PROGRESS</span>
                      <span className="font-black text-text-primary">
                        {path.completed}/{path.books} books
                      </span>
                    </div>

                    <div className="outline-bold-thin h-3 w-full rounded-full bg-white/60">
                      <div
                        className="h-3 rounded-full bg-primary-green shadow-[0_2px_8px_rgb(0,0,0,0.2)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-base font-bold text-text-primary">
                    <span>
                      {path.available}/{path.books} available
                    </span>
                    <span>{path.estimatedTime}</span>
                  </div>

                  <button
                    onClick={() => handleStartPath(path.id)}
                    className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-blue px-6 py-3 text-lg font-black text-white transition-transform hover:scale-105"
                  >
                    {path.completed > 0 ? 'CONTINUE PATH' : 'START LEARNING'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-yellow opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-blue opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-green opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-orange opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-purple opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
