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
    <div className="bg-primary-pink rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-huge font-black text-text-primary leading-extra-tight">
            <span className="text-primary-yellow">POPULAR</span><br />
            <span className="text-mega">PATHS</span>
          </h2>
          <button className="text-primary-blue hover:text-primary-blue/80 text-base sm:text-lg font-black">
            VIEW ALL PATHS
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockLearningPaths.map((path) => {
            const progress = (path.completed / path.books) * 100;
            
            return (
              <div key={path.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin hover:scale-105 transition-transform duration-300">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-text-primary text-lg mb-3">{path.title}</h3>
                    <p className="text-base text-text-primary font-bold">{path.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-text-primary font-bold">PROGRESS</span>
                      <span className="font-black text-text-primary">{path.completed}/{path.books} books</span>
                    </div>
                    
                    <div className="w-full bg-white/60 rounded-full h-3 outline-bold-thin">
                      <div 
                        className="bg-primary-green h-3 rounded-full transition-all duration-300 shadow-[0_2px_8px_rgb(0,0,0,0.2)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-base text-text-primary font-bold">
                    <span>{path.available}/{path.books} available</span>
                    <span>{path.estimatedTime}</span>
                  </div>
                  
                  <button
                    onClick={() => handleStartPath(path.id)}
                    className="w-full bg-primary-blue text-white font-black py-3 px-6 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg"
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
      <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-yellow rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-blue rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-green rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-orange rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-purple rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 