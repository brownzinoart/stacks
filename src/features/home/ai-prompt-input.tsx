/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect } from 'react';

const moodOptions = [
  { label: 'FUNNY', color: 'bg-primary-orange hover:bg-primary-pink' },
  { label: 'MIND-BLOWING', color: 'bg-primary-yellow hover:bg-primary-teal' },
  { label: 'LOVE STORY', color: 'bg-primary-pink hover:bg-primary-purple' },
  { label: 'MAGICAL', color: 'bg-primary-purple hover:bg-primary-blue' },
];

const discoveryExamples = [
  "Find books like Walking Dead",
  "I'm stressed, need something calming",
  "Show me time travel books",
  "I want to learn psychology",
  "Give me something that will make me cry",
  "I need a book for my book club",
  "Something like Harry Potter for adults",
  "I want to read about space",
];

export const AIPromptInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isExampleVisible, setIsExampleVisible] = useState(true);

  // Rotate through examples every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsExampleVisible(false);
      setTimeout(() => {
        setCurrentExampleIndex((prev) => (prev + 1) % discoveryExamples.length);
        setIsExampleVisible(true);
      }, 300); // Fade out duration
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue && !selectedMood) return;
    
    setIsLoading(true);
    setSearchResults([]);
    
    // TODO: Implement AI search functionality
    console.log('Searching for:', inputValue || selectedMood);
    
    // Simulate API call with mock results
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "The Road",
          author: "Cormac McCarthy",
          cover: "https://covers.openlibrary.org/b/id/8576271-L.jpg",
          reason: "Post-apocalyptic survival story like Walking Dead",
          libraryAvailable: true,
          libraryName: "Central Library"
        },
        {
          id: 2,
          title: "Station Eleven",
          author: "Emily St. John Mandel",
          cover: "https://covers.openlibrary.org/b/id/8576272-L.jpg",
          reason: "Dystopian world rebuilding after collapse",
          libraryAvailable: true,
          libraryName: "Downtown Branch"
        },
        {
          id: 3,
          title: "World War Z",
          author: "Max Brooks",
          cover: "https://covers.openlibrary.org/b/id/8576273-L.jpg",
          reason: "Zombie apocalypse from multiple perspectives",
          libraryAvailable: false,
          libraryName: null
        }
      ];
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
    setInputValue(''); // Clear text input when mood is selected
    setSearchResults([]); // Clear previous results
  };

  const handleLibraryCheck = (bookId: number) => {
    // TODO: Implement library availability check
    console.log('Checking library availability for book:', bookId);
  };

  return (
    <div className="space-y-6 sm:space-y-8 relative">
      {/* Character Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] sm:w-[1200px] sm:h-[1200px] opacity-30 transform translate-x-1/4 sm:translate-x-0 -mt-90 sm:-mt-160 -mb-20 sm:-mb-80">
          <img 
            src="/maincharacter.png" 
            alt="Reading character"
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
            }}
          />
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Mood Selection */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.label)}
              disabled={isLoading}
              className={`${mood.color} text-text-primary font-black py-4 sm:py-6 px-4 sm:px-6 rounded-3xl text-base sm:text-lg transition-all duration-300 hover:scale-110 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-white/50 pop-element touch-feedback mobile-touch ${
                selectedMood === mood.label ? 'ring-4 ring-white/50 scale-105' : ''
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: mood.color.includes('primary-orange') ? '#FB7185' : mood.color.includes('primary-yellow') ? '#FBBF24' : mood.color.includes('primary-pink') ? '#EC4899' : '#A78BFA' }}
            >
              {mood.label}
            </button>
          ))}
        </div>
      
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder=""
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-4 sm:py-6 rounded-full bg-white outline-bold-thin text-text-primary focus:outline-none focus:ring-4 focus:ring-white/50 text-base sm:text-lg font-bold shadow-backdrop mobile-touch"
              />
              {/* Rotating placeholder examples */}
              {!inputValue && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <span className={`px-6 sm:px-8 text-base sm:text-lg font-bold text-text-secondary transition-opacity duration-300 ${
                    isExampleVisible ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {discoveryExamples[currentExampleIndex]}
                  </span>
                </div>
              )}
            </div>
                      <button
            type="submit"
            disabled={(!inputValue && !selectedMood) || isLoading}
            className="bg-text-primary text-white px-6 sm:px-8 py-4 sm:py-6 rounded-full font-black text-base sm:text-lg hover:bg-text-primary/90 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pop-element focus:outline-none focus:ring-4 focus:ring-white/50 touch-feedback mobile-touch flex items-center justify-center"
          >
            {isLoading ? (
              <div className="loading-pulse">LOADING</div>
            ) : (
              <>
                <span className="sm:hidden">Find Next Read</span>
                <span className="hidden sm:inline">→</span>
              </>
            )}
          </button>
          </div>
          
          {/* Loading state feedback */}
          {isLoading && (
            <div className="text-center text-text-secondary text-sm font-bold animate-fade-in-up">
              Finding your perfect match...
            </div>
          )}
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-black text-text-primary">AI Recommendations</h3>
            <div className="space-y-4">
              {searchResults.map((book) => (
                <div key={book.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 outline-bold-thin">
                  <div className="flex items-start gap-4">
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg object-cover shadow-backdrop"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-text-primary text-base sm:text-lg mb-1">{book.title}</h4>
                      <p className="text-text-secondary text-sm sm:text-base font-bold mb-2">{book.author}</p>
                      <p className="text-text-primary/80 text-sm mb-3">{book.reason}</p>
                      
                      <div className="flex items-center gap-3">
                        {book.libraryAvailable ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                            <span className="text-sm font-bold text-primary-green">Available at {book.libraryName}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary-orange rounded-full"></div>
                            <span className="text-sm font-bold text-primary-orange">Check other libraries</span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleLibraryCheck(book.id)}
                          className="bg-primary-blue text-white px-3 py-1 rounded-full text-xs font-bold hover:scale-105 transition-transform touch-feedback"
                        >
                          {book.libraryAvailable ? 'RESERVE' : 'FIND'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button className="bg-primary-green text-text-primary px-6 py-3 rounded-full font-black text-sm hover:scale-105 transition-transform touch-feedback">
                VIEW ALL RECOMMENDATIONS →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 