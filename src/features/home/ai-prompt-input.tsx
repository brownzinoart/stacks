/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-config';

const moodOptions = [
  { label: 'FUNNY', color: 'bg-primary-orange hover:bg-primary-pink' },
  { label: 'MIND-BLOWING', color: 'bg-primary-yellow hover:bg-primary-teal' },
  { label: 'LOVE STORY', color: 'bg-primary-pink hover:bg-primary-purple' },
  { label: 'MAGICAL', color: 'bg-primary-purple hover:bg-primary-blue' },
];

const discoveryExamples = [
  'Find books like Walking Dead',
  "I'm stressed, need something calming",
  'Show me time travel books',
  'I want to learn psychology',
  'Give me something that will make me cry',
  'I need a book for my book club',
  'Something like Harry Potter for adults',
  'I want to read about space',
];

// Multi-stage intelligent recommendation system
async function getSmartRecommendations(userInput: string, forceRefresh: boolean = false) {
  console.log('Starting smart recommendations for:', userInput);

  // Check cache first - create hash of input for consistent caching
  const inputHash = btoa(userInput.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
  const cacheKey = `stacks_cache_${inputHash}`;
  const cachedData = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;

  if (cachedData && !forceRefresh) {
    try {
      const parsed = JSON.parse(cachedData);
      const cacheAge = Date.now() - new Date(parsed.timestamp).getTime();
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

      if (cacheAge < CACHE_DURATION) {
        console.log('Using cached recommendations for:', userInput);
        return parsed.recommendations;
      } else {
        console.log('Cache expired, fetching fresh recommendations');
        if (typeof window !== 'undefined') localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.log('Invalid cache data, removing');
      if (typeof window !== 'undefined') localStorage.removeItem(cacheKey);
    }
  }

  // Stage 1: Analyze user intent with clearer JSON instructions
  const analysisPrompt = `Analyze this book request: "${userInput}"
  
  Return ONLY valid JSON with this exact structure:
  {
    "isComparison": true or false,
    "referenceTitle": "title if comparing to something, otherwise empty string",
    "referenceType": "show" or "movie" or "book" or "none",
    "aspectsOfInterest": ["choose from: plot, characters, themes, atmosphere, writing_style"],
    "emotionalContext": "one sentence description"
  }
  
  No other text, just the JSON object.`;

  try {
    // Use consistent API base URL configuration
    const baseUrl = getApiBaseUrl();
    const apiUrl = `${baseUrl}/api/openai-proxy`;

    console.log('[Mobile Debug] Making analysis API call to:', apiUrl);
    console.log('[Mobile Debug] Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('[Mobile Debug] Window protocol:', typeof window !== 'undefined' ? window.location.protocol : 'SSR');
    console.log(
      '[Mobile Debug] Is Capacitor:',
      typeof window !== 'undefined' && (window as any).Capacitor !== undefined
    );
    console.log('[Mobile Debug] Using base URL:', baseUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const analysisResp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON-only response bot. Return only valid JSON, no markdown, no explanation.',
          },
          { role: 'user', content: analysisPrompt },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[Mobile Debug] Analysis API response status:', analysisResp.status);
    
    if (!analysisResp.ok) {
      throw new Error(`API request failed with status ${analysisResp.status}`);
    }

    const analysisData = await analysisResp.json();
    console.log('[Mobile Debug] Analysis API response data:', analysisData);

    if (!analysisData.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response structure');
    }

    console.log('Analysis response:', analysisData.choices[0].message.content);

    let analysis;
    try {
      // Clean the response in case of markdown or extra text
      const content = analysisData.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse analysis:', parseError);
      // Default analysis
      analysis = {
        isComparison: false,
        referenceTitle: '',
        referenceType: 'none',
        aspectsOfInterest: ['themes'],
        emotionalContext: userInput,
      };
    }

    console.log('Parsed analysis:', analysis);

    // Stage 2: Enrich with OMDB if needed
    let enrichedContext = '';
    if ((analysis.referenceType === 'show' || analysis.referenceType === 'movie') && analysis.referenceTitle) {
      const omdb = await fetchOmdbData(analysis.referenceTitle);
      if (omdb) {
        enrichedContext = `\nReference: ${omdb.title} - ${omdb.plot}\nGenres: ${omdb.genres}\nTone: ${omdb.rated}`;
      }
    }

    // Stage 3: Generate categorized recommendations with robust descriptions
    const recommendPrompt = `Based on the user wanting books like "${userInput}", create exactly 3 categories of recommendations.
    ${enrichedContext}
    
    Return ONLY this JSON structure with NO additional text:
    {
      "overallTheme": "One sentence summary",
      "categories": [
        {
          "name": "The Atmosphere",
          "description": "1-2 sentences why",
          "books": [
            {
              "title": "Book Title", 
              "author": "Author Name", 
              "isbn": "ISBN-13 if known", 
              "year": "publication year",
              "whyYoullLikeIt": "Natural, compelling description that explains the book's appeal without repetitive phrasing",
              "summary": "Brief plot summary for book details section",
              "pageCount": "estimated pages",
              "readingTime": "estimated hours",
              "publisher": "publisher if known"
            }
          ]
        }
      ]
    }
    
    IMPORTANT for "whyYoullLikeIt" field:
    - Write natural, engaging descriptions WITHOUT repetitive "You'll like this because..." phrasing
    - Use varied sentence starters like: "This gripping tale...", "A haunting story that...", "Perfect for readers who...", "The emotional depth...", etc.
    - Be specific about themes, atmosphere, characters, or plot elements
    - Explain WHY it connects to the user's original request naturally
    - Make it 2-4 sentences that flow naturally and compellingly
    - Example: "This haunting tale follows the last man on Earth as he battles vampire-like creatures while grappling with profound loneliness and what it means to be human. The psychological tension and moral complexity will keep you questioning every decision, perfect for fans of isolated survival horror."
    
    Create 3 different categories using names like:
    - "The Atmosphere" (for mood/setting/tone)
    - "The Characters" (for character-driven stories)  
    - "The Plot" (for similar storylines)
    - "The Themes" (for similar concepts/messages)
    - "The Writing Style" (for similar prose/narrative)
    - "The World Building" (for fantasy/sci-fi)
    - "The Emotions" (for similar feelings)
    - "The Mystery" (for suspense/thriller elements)
    
    Include 2-3 books per category with rich, detailed "whyYoullLikeIt" descriptions.`;

    const recoController = new AbortController();
    const recoTimeoutId = setTimeout(() => recoController.abort(), 20000); // 20 second timeout

    const recoResp = await fetch(`${baseUrl}/api/openai-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON-only response bot. Return only valid JSON for book recommendations.',
          },
          { role: 'user', content: recommendPrompt },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
      signal: recoController.signal,
    });

    clearTimeout(recoTimeoutId);

    if (!recoResp.ok) {
      throw new Error(`Recommendation API request failed with status ${recoResp.status}`);
    }

    const recoData = await recoResp.json();
    console.log('Recommendation response:', recoData.choices[0].message.content);

    try {
      const content = recoData.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        console.log('Parsed recommendations:', recommendations);

        // Skip cover pre-fetching to avoid timeouts - covers will be loaded lazily on the recommendations page
        console.log('Skipping cover pre-fetch for faster, more reliable loading');

        // Cache the successful recommendations
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              recommendations,
              timestamp: new Date().toISOString(),
            })
          );
        }
        console.log('Cached recommendations for future use');

        return recommendations;
      } else {
        throw new Error('No JSON found in recommendation response');
      }
    } catch (parseError) {
      console.error('Failed to parse recommendations:', parseError);
      throw parseError;
    }
  } catch (error: any) {
    console.error('[Mobile Debug] Smart recommendations error:', error);
    console.error('[Mobile Debug] Error message:', error.message);

    // Check for common mobile network issues
    if (error.name === 'AbortError' || error.message.includes('aborted')) {
      console.error('[Mobile Debug] Request timeout - common on mobile networks');
      error.mobileError = 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('fetch') || error.message.includes('Network')) {
      console.error('[Mobile Debug] Network error - check if API is accessible');
      error.mobileError = 'Network error. Please check your internet connection.';
    } else if (error.message.includes('Failed to fetch')) {
      console.error('[Mobile Debug] CORS or network issue - fetch failed');
      error.mobileError = 'Connection blocked. Please try again.';
    }

    throw error;
  }
}

// Helper: fetch OMDb metadata
async function fetchOmdbData(title: string) {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || process.env.OMDB_API_KEY || '95cb8a0d';
  // Try to extract just the title for OMDb
  const cleanTitle = title.replace(/.*like (the )?(show|movie|film|series)?/i, '').trim();
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.Response !== 'False') {
        return {
          plot: data.Plot,
          genres: data.Genre,
          rated: data.Rated,
          title: data.Title,
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Fallback for simple recommendations (kept for compatibility)
function buildSimplePrompt(input: string) {
  return `${input}\n\nPlease recommend 5 books in JSON array format: [{"title": "", "author": "", "cover": "", "why": ""}].`;
}

export const AIPromptInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isExampleVisible, setIsExampleVisible] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleSubmit = async (e: React.FormEvent, forceRefresh: boolean = false) => {
    e.preventDefault();

    // Show error feedback if no input
    if (!inputValue && !selectedMood) {
      setShowError(true);
      // Shake animation for the input
      const inputEl = document.querySelector('.search-input-container');
      if (inputEl) {
        inputEl.classList.add('animate-shake');
        setTimeout(() => {
          inputEl.classList.remove('animate-shake');
        }, 500);
      }
      // Clear error after 3 seconds
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setShowError(false);
    setIsLoading(true);
    setSearchResults([]);

    const userInput = inputValue || selectedMood || '';

    try {
      // Log for mobile debugging
      console.log('[Mobile Debug] Starting search with input:', userInput);

      // Use the new smart recommendation system
      console.log('[Mobile Debug] About to call getSmartRecommendations');
      const recommendations = await getSmartRecommendations(userInput, forceRefresh);
      console.log('[Mobile Debug] getSmartRecommendations completed successfully');

      console.log('[Mobile Debug] Got recommendations:', recommendations);
      setIsLoading(false);

      // Store categorized recommendations
      let dataStored = false;
      if (typeof window !== 'undefined') {
        try {
          const dataToStore = {
            ...recommendations,
            userInput,
            timestamp: new Date().toISOString(),
          };
          console.log('[Mobile Debug] Storing recommendations data:', dataToStore);
          localStorage.setItem('stacks_recommendations', JSON.stringify(dataToStore));
          console.log('[Mobile Debug] Data stored successfully');
          dataStored = true;
        } catch (storageError) {
          console.error('[Mobile Debug] Failed to store data:', storageError);
        }
      }

      // Only navigate if data was stored successfully
      if (dataStored || typeof window === 'undefined') {
        console.log('[Mobile Debug] About to navigate to /stacks-recommendations');
        router.push('/stacks-recommendations');
      } else {
        console.error('[Mobile Debug] Navigation cancelled - data storage failed');
        setIsLoading(false);
        setErrorMessage('Failed to save recommendations. Please try again.');
        setShowError(true);
      }
    } catch (err: any) {
      console.error('[Mobile Debug] Error in recommendation flow:', err);
      console.error('[Mobile Debug] Error stack:', err.stack);

      // Fallback to simple recommendations
      try {
        console.log('[Mobile Debug] Attempting fallback simple recommendations');
        const fallbackBaseUrl = getApiBaseUrl();
        const apiUrl = `${fallbackBaseUrl}/api/openai-proxy`;

        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 15000); // 15 second timeout

        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: buildSimplePrompt(userInput) }],
            temperature: 0.7,
            max_tokens: 400,
          }),
          signal: fallbackController.signal,
        });

        clearTimeout(fallbackTimeoutId);

        if (!resp.ok) {
          throw new Error(`Fallback API request failed with status ${resp.status}`);
        }

        const fallbackData = await resp.json();
        console.log('[Mobile Debug] Fallback API response received');
        const content = fallbackData.choices?.[0]?.message?.content || '';
        let books = [];

        try {
          const jsonStart = content.indexOf('[');
          const jsonEnd = content.lastIndexOf(']') + 1;
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            const jsonString = content.substring(jsonStart, jsonEnd);
            books = JSON.parse(jsonString);
            console.log('[Mobile Debug] Parsed', books.length, 'books from fallback');
          } else {
            console.log('[Mobile Debug] No JSON array found in fallback response');
          }
        } catch (parseErr) {
          console.error('[Mobile Debug] Error parsing fallback response:', parseErr);
          // Create minimal fallback books if parsing fails
          books = [
            { title: 'Sample Book 1', author: 'Author 1', why: 'Fallback recommendation', cover: '' },
            { title: 'Sample Book 2', author: 'Author 2', why: 'Fallback recommendation', cover: '' },
          ];
        }

        console.log('[Mobile Debug] Storing fallback recommendations with', books.length, 'books');
        setIsLoading(false);

        let fallbackDataStored = false;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('stacks_recommendations', JSON.stringify({ books, userInput }));
            console.log('[Mobile Debug] Fallback data stored successfully');
            fallbackDataStored = true;
          } catch (storageError) {
            console.error('[Mobile Debug] Failed to store fallback data:', storageError);
          }
        }

        if (fallbackDataStored || typeof window === 'undefined') {
          console.log('[Mobile Debug] Navigating to recommendations page (fallback)');
          router.push('/stacks-recommendations');
        } else {
          console.error('[Mobile Debug] Fallback navigation cancelled - storage failed');
          setErrorMessage('Failed to save recommendations. Please try again.');
          setShowError(true);
        }
      } catch (fallbackErr: any) {
        setIsLoading(false);
        console.error('[Mobile Debug] Fallback also failed:', fallbackErr);

        // Final fallback - create basic recommendations to prevent total failure
        const basicBooks = [
          {
            title: 'The Stand',
            author: 'Stephen King',
            why: 'Post-apocalyptic survival like The Walking Dead',
            cover: '',
          },
          {
            title: 'World War Z',
            author: 'Max Brooks',
            why: 'Zombie apocalypse survival guide',
            cover: '',
          },
          {
            title: 'The Road',
            author: 'Cormac McCarthy',
            why: 'Father-son survival in post-apocalyptic world',
            cover: '',
          },
        ];

        console.log('[Mobile Debug] Using emergency fallback books');

        // Store emergency fallback data
        let emergencyDataStored = false;
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'stacks_recommendations',
              JSON.stringify({
                books: basicBooks,
                userInput,
                emergency: true,
                timestamp: new Date().toISOString(),
              })
            );
            console.log('[Mobile Debug] Emergency fallback data stored');
            emergencyDataStored = true;
          } catch (storageError) {
            console.error('[Mobile Debug] Failed to store emergency fallback data:', storageError);
          }
        }

        // Navigate to show fallback content (always navigate in emergency case to prevent total failure)
        console.log('[Mobile Debug] Navigating to recommendations page (emergency fallback)');
        router.push('/stacks-recommendations');
      }
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
    <div className="relative space-y-6 sm:space-y-8">
      {/* Content Layer */}
      <div className="relative z-10">
        {/* Mood Selection */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.label)}
              disabled={isLoading}
              className={`${mood.color} pop-element touch-feedback mobile-touch rounded-3xl px-4 py-4 text-base font-black text-text-primary transition-all duration-300 hover:rotate-1 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50 sm:px-6 sm:py-6 sm:text-lg ${
                selectedMood === mood.label ? 'scale-105 ring-4 ring-white/50' : ''
              } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              style={{
                backgroundColor: mood.color.includes('primary-orange')
                  ? '#FB7185'
                  : mood.color.includes('primary-yellow')
                    ? '#FBBF24'
                    : mood.color.includes('primary-pink')
                      ? '#EC4899'
                      : '#A78BFA',
              }}
            >
              {mood.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="search-input-container relative flex-1">
              <input
                type="text"
                placeholder=""
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="outline-bold-thin shadow-backdrop mobile-touch w-full rounded-full bg-white px-6 py-4 text-base font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-white/50 sm:px-8 sm:py-6 sm:text-lg"
              />
              {/* Rotating placeholder examples - Layout stable version */}
              {!inputValue && (
                <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                  <div className="relative h-full w-full">
                    {discoveryExamples.map((example, index) => (
                      <span
                        key={index}
                        className={`absolute left-6 top-1/2 -translate-y-1/2 transform px-0 text-base font-bold text-text-secondary transition-all duration-300 sm:left-8 sm:text-lg ${
                          index === currentExampleIndex && isExampleVisible
                            ? 'translate-y-[-50%] opacity-100'
                            : index === currentExampleIndex
                              ? 'translate-y-[-30%] opacity-0'
                              : 'translate-y-[-70%] opacity-0'
                        }`}
                        style={{
                          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={(!inputValue && !selectedMood) || isLoading}
              onClick={(e) => {
                console.log('[Mobile Debug] Submit button clicked');
                console.log('[Mobile Debug] Input value:', inputValue);
                console.log('[Mobile Debug] Selected mood:', selectedMood);
                console.log('[Mobile Debug] Is loading:', isLoading);
              }}
              className="pop-element touch-feedback mobile-touch flex items-center justify-center rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-110 hover:bg-text-primary/90 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-6 sm:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-pulse">FINDING</div>
                  <span className="animate-bounce">...</span>
                </div>
              ) : (
                <>
                  <span className="sm:hidden">Find Next Read</span>
                  <span className="hidden sm:inline">→</span>
                </>
              )}
            </button>

            {/* Refresh button - stable layout version */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || (!inputValue && !selectedMood)}
              className={`pop-element touch-feedback mobile-touch flex items-center justify-center rounded-full bg-primary-orange px-4 py-4 text-base font-black text-white transition-all duration-300 hover:scale-110 hover:bg-primary-orange/90 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-not-allowed sm:px-6 sm:py-6 sm:text-lg ${
                inputValue || selectedMood ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              title="Get fresh recommendations"
              style={{ transitionProperty: 'opacity, transform, background-color' }}
            >
              {isLoading ? (
                <div className="loading-pulse">...</div>
              ) : (
                <>
                  <span className="sm:hidden">🔄</span>
                  <span className="hidden sm:inline">🔄</span>
                </>
              )}
            </button>
          </div>

          {/* Loading state feedback - height stable */}
          <div className="flex min-h-[24px] items-center justify-center">
            {isLoading && (
              <div className="animate-fade-in-up text-center text-sm font-bold text-text-secondary">
                Finding your perfect match...
              </div>
            )}
            {showError && !isLoading && (
              <div className="animate-fade-in-up text-center text-sm font-bold text-red-600">
                {errorMessage || "Please select a mood or enter what you're looking for!"}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
