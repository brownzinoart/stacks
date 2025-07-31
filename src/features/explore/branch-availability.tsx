/**
 * Popular Paths in Your Area component - shows location-based learning path recommendations
 * Displays trending and popular learning paths based on user's location and interests
 */

'use client';

const mockPopularPaths = [
  {
    id: 1,
    title: 'Local History & Culture',
    description: 'Discover the rich history of your city and region',
    books: 5,
    participants: 127,
    estimatedTime: '4-6 weeks',
    popularity: 'high',
  },
  {
    id: 2,
    title: 'Tech Skills for Beginners',
    description: 'Essential programming and digital skills for career growth',
    books: 7,
    participants: 89,
    estimatedTime: '6-8 weeks',
    popularity: 'medium',
  },
  {
    id: 3,
    title: 'Sustainable Living',
    description: 'Eco-friendly practices and environmental awareness',
    books: 6,
    participants: 203,
    estimatedTime: '5-7 weeks',
    popularity: 'high',
  },
  {
    id: 4,
    title: 'Creative Writing Workshop',
    description: 'Develop your storytelling and writing skills',
    books: 4,
    participants: 56,
    estimatedTime: '3-5 weeks',
    popularity: 'medium',
  },
];

export const PopularPathsInArea = () => {
  const handleStartPath = (pathId: number) => {
    // TODO: Implement learning path enrollment
    console.log('Starting popular path:', pathId);
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return 'bg-primary-green';
      case 'medium':
        return 'bg-primary-yellow';
      default:
        return 'bg-primary-orange';
    }
  };

  const getPopularityText = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return 'TRENDING';
      case 'medium':
        return 'POPULAR';
      default:
        return 'NEW';
    }
  };

  return (
    <div className="pop-element-lg relative overflow-hidden rounded-3xl bg-primary-blue p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div>
          <h2 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
            <span className="text-primary-yellow">POPULAR PATHS</span>
            <br />
            <span className="text-mega">IN YOUR AREA</span>
          </h2>
          <p className="mb-6 text-lg font-bold text-text-primary sm:text-xl">
            Discover what others in your community are learning
            <br />
            and join the conversation!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockPopularPaths.map((path) => (
            <div
              key={path.id}
              className="outline-bold-thin rounded-2xl bg-white/80 p-6 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-black text-text-primary">{path.title}</h3>
                    <p className="text-base font-bold text-text-primary">{path.description}</p>
                  </div>

                  <div
                    className={`shadow-backdrop rounded-full px-3 py-1 text-xs font-black text-white ${getPopularityColor(path.popularity)}`}
                  >
                    {getPopularityText(path.popularity)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-text-primary">PARTICIPANTS</span>
                    <span className="font-black text-text-primary">{path.participants} people</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-bold text-text-primary">BOOKS</span>
                    <span className="font-black text-text-primary">{path.books} books</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-bold text-text-primary">DURATION</span>
                    <span className="font-black text-text-primary">{path.estimatedTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartPath(path.id)}
                  className="touch-feedback shadow-backdrop w-full rounded-2xl bg-primary-green px-6 py-3 text-lg font-black text-text-primary transition-transform hover:scale-105"
                >
                  JOIN PATH
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="text-base font-black text-primary-yellow hover:text-primary-yellow/80 sm:text-lg">
            VIEW ALL LOCAL PATHS
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="animate-float absolute left-6 top-6 z-0 h-12 w-12 rounded-full bg-primary-teal opacity-25 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute bottom-8 left-4 z-0 h-10 w-10 rounded-full bg-primary-pink opacity-30 sm:h-14 sm:w-14" />
      <div className="animate-float-slow absolute left-2 top-12 z-0 h-8 w-8 rounded-full bg-primary-green opacity-35 sm:h-12 sm:w-12" />
      <div className="animate-float absolute bottom-4 right-8 z-0 h-12 w-12 rounded-full bg-primary-orange opacity-20 sm:h-16 sm:w-16" />
      <div className="animate-float-delayed absolute right-4 top-6 z-0 h-6 w-6 rounded-full bg-primary-purple opacity-40 sm:h-8 sm:w-8" />
      <div className="animate-float-slow absolute bottom-12 right-2 z-0 h-10 w-10 rounded-full bg-primary-yellow opacity-30 sm:h-12 sm:w-12" />
    </div>
  );
};
