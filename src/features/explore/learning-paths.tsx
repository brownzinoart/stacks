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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Popular Learning Paths</h2>
        <button className="text-accent hover:text-accent/80 text-sm font-medium">
          View all paths
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockLearningPaths.map((path) => {
          const progress = (path.completed / path.books) * 100;
          
          return (
            <div key={path.id} className="rounded-card bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">{path.title}</h3>
                  <p className="text-sm text-text-secondary">{path.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-medium">{path.completed}/{path.books} books</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>{path.available}/{path.books} available</span>
                  <span>{path.estimatedTime}</span>
                </div>
                
                <button
                  onClick={() => handleStartPath(path.id)}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {path.completed > 0 ? 'Continue Path' : 'Start Learning'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 