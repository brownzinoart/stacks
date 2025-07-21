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
    popularity: 'high'
  },
  {
    id: 2,
    title: 'Tech Skills for Beginners',
    description: 'Essential programming and digital skills for career growth',
    books: 7,
    participants: 89,
    estimatedTime: '6-8 weeks',
    popularity: 'medium'
  },
  {
    id: 3,
    title: 'Sustainable Living',
    description: 'Eco-friendly practices and environmental awareness',
    books: 6,
    participants: 203,
    estimatedTime: '5-7 weeks',
    popularity: 'high'
  },
  {
    id: 4,
    title: 'Creative Writing Workshop',
    description: 'Develop your storytelling and writing skills',
    books: 4,
    participants: 56,
    estimatedTime: '3-5 weeks',
    popularity: 'medium'
  },
];

export const PopularPathsInArea = () => {
  const handleStartPath = (pathId: number) => {
    // TODO: Implement learning path enrollment
    console.log('Starting popular path:', pathId);
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'high': return 'bg-primary-green';
      case 'medium': return 'bg-primary-yellow';
      default: return 'bg-primary-orange';
    }
  };

  const getPopularityText = (popularity: string) => {
    switch (popularity) {
      case 'high': return 'TRENDING';
      case 'medium': return 'POPULAR';
      default: return 'NEW';
    }
  };

  return (
    <div className="bg-primary-blue rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgb(0,0,0,0.3)] relative overflow-hidden pop-element-lg">
      <div className="space-y-6 sm:space-y-8 relative z-10">
        <div>
          <h2 className="text-huge font-black text-text-primary leading-extra-tight mb-4 sm:mb-6">
            <span className="text-primary-yellow">POPULAR PATHS</span><br />
            <span className="text-mega">IN YOUR AREA</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-primary font-bold mb-6">
            Discover what others in your community are learning<br />
            and join the conversation!
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {mockPopularPaths.map((path) => (
            <div key={path.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 outline-bold-thin hover:scale-105 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-black text-text-primary text-lg mb-2">{path.title}</h3>
                    <p className="text-base text-text-primary font-bold">{path.description}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-black text-white shadow-backdrop ${getPopularityColor(path.popularity)}`}>
                    {getPopularityText(path.popularity)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-text-primary font-bold">PARTICIPANTS</span>
                    <span className="font-black text-text-primary">{path.participants} people</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span className="text-text-primary font-bold">BOOKS</span>
                    <span className="font-black text-text-primary">{path.books} books</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span className="text-text-primary font-bold">DURATION</span>
                    <span className="font-black text-text-primary">{path.estimatedTime}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleStartPath(path.id)}
                  className="w-full bg-primary-green text-text-primary font-black py-3 px-6 rounded-2xl hover:scale-105 transition-transform touch-feedback shadow-backdrop text-lg"
                >
                  JOIN PATH
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button className="text-primary-yellow hover:text-primary-yellow/80 text-base sm:text-lg font-black">
            VIEW ALL LOCAL PATHS
          </button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary-teal rounded-full opacity-25 animate-float z-0" />
      <div className="absolute bottom-8 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-primary-pink rounded-full opacity-30 animate-float-delayed z-0" />
      <div className="absolute top-12 left-2 w-8 h-8 sm:w-12 sm:h-12 bg-primary-green rounded-full opacity-35 animate-float-slow z-0" />
      <div className="absolute bottom-4 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-primary-orange rounded-full opacity-20 animate-float z-0" />
      <div className="absolute top-6 right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-purple rounded-full opacity-40 animate-float-delayed z-0" />
      <div className="absolute bottom-12 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-yellow rounded-full opacity-30 animate-float-slow z-0" />
    </div>
  );
}; 