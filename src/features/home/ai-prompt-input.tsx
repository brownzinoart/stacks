/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

// Helper: classify request
function classifyRequest(input: string): 'show' | 'theme' | 'learn' {
  const learnKeywords = ['learn', 'teach', 'understand', 'study', 'explain'];
  if (learnKeywords.some((kw) => input.toLowerCase().includes(kw))) return 'learn';
  // crude: if "like" and a known show/movie pattern, treat as show
  if (/like (the )?(show|movie|film|series)?/i.test(input)) return 'show';
  // fallback: theme
  return 'theme';
}

// Helper: fetch OMDb metadata
async function fetchOmdbData(title: string) {
  const apiUrl = process.env.NEXT_PUBLIC_OMDB_API || process.env.OMDB_API;
  if (!apiUrl) return null;
  // Try to extract just the title for OMDb
  const cleanTitle = title.replace(/.*like (the )?(show|movie|film|series)?/i, '').trim();
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=95cb8a0d`;
  try {
    const res = await axios.get(url);
    if (res.data && res.data.Response !== 'False') {
      return {
        plot: res.data.Plot,
        genres: res.data.Genre,
        rated: res.data.Rated,
        title: res.data.Title,
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Helper: build enriched prompt
function buildPrompt(type: 'show' | 'theme' | 'learn', input: string, omdb: any) {
  if (type === 'show' && omdb) {
    return `I'd like to read books like ${omdb.title}, with plot: ${omdb.plot}; genres: ${omdb.genres}; tone: ${omdb.rated}. Recommend me 5 novels.`;
  }
  if (type === 'theme') {
    return `I'd like to read books about ${input}—stories that explore this theme. Recommend me 5 novels.`;
  }
  if (type === 'learn') {
    return `I'd like to learn about ${input}, with clear explanations, real-world examples, and engaging exercises. Recommend me 5 nonfiction books.`;
  }
  return input;
}

export const AIPromptInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isExampleVisible, setIsExampleVisible] = useState(true);
  const router = useRouter();

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
    
    // 1. Classify
    const userInput = inputValue || selectedMood || '';
    const type = classifyRequest(userInput);
    let omdb = null;
    let prompt = '';

    // 2. Fetch OMDb if show
    if (type === 'show') {
      omdb = await fetchOmdbData(userInput);
    }

    // 3. Build prompt (request JSON output)
    prompt = buildPrompt(type, userInput, omdb) +
      '\n\nPlease recommend 5 books in the following JSON array format: [{"title": "", "author": "", "cover": "", "why": ""}]. If you do not know the cover, leave it blank.';

    // 4. Call OpenAI proxy
    try {
      const resp = await axios.post('/api/openai-proxy', {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 400,
      });
      const content = resp.data.choices?.[0]?.message?.content || '';
      // Try to extract JSON from the response
      let books = [];
      try {
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']') + 1;
        const jsonString = content.substring(jsonStart, jsonEnd);
        books = JSON.parse(jsonString);
      } catch (err) {
        console.error('Error parsing GPT response as JSON:', err, content);
        books = [{ title: 'Error parsing recommendations', author: '', cover: '', why: content }];
      }
      setIsLoading(false);
      // Store in localStorage for retrieval on recommendations page
      localStorage.setItem('stacks_recommendations', JSON.stringify({ books, userInput }));
      router.push('/stacks-recommendations');
    } catch (err) {
      setIsLoading(false);
      setSearchResults([{ id: 1, title: 'Error fetching recommendations', author: '', cover: '', reason: '', libraryAvailable: false, libraryName: null }]);
      console.error('Error fetching recommendations:', err);
    }
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