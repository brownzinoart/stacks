/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { bookCoverService } from '@/lib/book-cover-service';

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
async function getSmartRecommendations(userInput: string) {
  console.log('Starting smart recommendations for:', userInput);

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
    const analysisResp = await axios.post('/api/openai-proxy', {
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
    });

    console.log('Analysis response:', analysisResp.data.choices[0].message.content);

    let analysis;
    try {
      // Clean the response in case of markdown or extra text
      const content = analysisResp.data.choices[0].message.content;
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

    const recoResp = await axios.post('/api/openai-proxy', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a JSON-only response bot. Return only valid JSON for book recommendations.',
        },
        { role: 'user', content: recommendPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    console.log('Recommendation response:', recoResp.data.choices[0].message.content);

    try {
      const content = recoResp.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        console.log('Parsed recommendations:', recommendations);
        
        // Pre-fetch covers for all books
        const allBooks: any[] = [];
        recommendations.categories?.forEach((category: any) => {
          category.books?.forEach((book: any, idx: number) => {
            allBooks.push({
              ...book,
              categoryIdx: recommendations.categories.indexOf(category),
              bookIdx: idx
            });
          });
        });

        console.log('Pre-fetching covers for', allBooks.length, 'books...');
        
        // Fetch covers in parallel
        const coverResults = await bookCoverService.getBatchCovers(allBooks);
        
        // Update recommendations with cover URLs
        let bookIndex = 0;
        recommendations.categories?.forEach((category: any) => {
          category.books?.forEach((book: any) => {
            const coverResult = coverResults.get(bookIndex);
            if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
              book.cover = coverResult.url;
              book.coverSource = coverResult.source;
              book.coverConfidence = coverResult.confidence;
            }
            bookIndex++;
          });
        });
        
        console.log('Cover pre-fetch complete');
        return recommendations;
      } else {
        throw new Error('No JSON found in recommendation response');
      }
    } catch (parseError) {
      console.error('Failed to parse recommendations:', parseError);
      throw parseError;
    }
  } catch (error) {
    console.error('Smart recommendations error:', error);
    throw error;
  }
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

    const userInput = inputValue || selectedMood || '';

    try {
      // Use the new smart recommendation system
      const recommendations = await getSmartRecommendations(userInput);

      setIsLoading(false);

      // Store categorized recommendations
      localStorage.setItem(
        'stacks_recommendations',
        JSON.stringify({
          ...recommendations,
          userInput,
          timestamp: new Date().toISOString(),
        })
      );

      router.push('/stacks-recommendations');
    } catch (err) {
      console.error('Error in recommendation flow:', err);

      // Fallback to simple recommendations
      try {
        const resp = await axios.post('/api/openai-proxy', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: buildSimplePrompt(userInput) }],
          temperature: 0.7,
          max_tokens: 400,
        });

        const content = resp.data.choices?.[0]?.message?.content || '';
        let books = [];

        try {
          const jsonStart = content.indexOf('[');
          const jsonEnd = content.lastIndexOf(']') + 1;
          const jsonString = content.substring(jsonStart, jsonEnd);
          books = JSON.parse(jsonString);
        } catch (parseErr) {
          console.error('Error parsing fallback response:', parseErr);
          books = [];
        }

        setIsLoading(false);
        localStorage.setItem('stacks_recommendations', JSON.stringify({ books, userInput }));
        router.push('/stacks-recommendations');
      } catch (fallbackErr) {
        setIsLoading(false);
        console.error('Fallback also failed:', fallbackErr);
        localStorage.setItem(
          'stacks_recommendations',
          JSON.stringify({
            books: [],
            userInput,
            error: 'Failed to fetch recommendations',
          })
        );
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
            <div className="relative flex-1">
              <input
                type="text"
                placeholder=""
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="outline-bold-thin shadow-backdrop mobile-touch w-full rounded-full bg-white px-6 py-4 text-base font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-white/50 sm:px-8 sm:py-6 sm:text-lg"
              />
              {/* Rotating placeholder examples */}
              {!inputValue && (
                <div className="pointer-events-none absolute inset-0 flex items-center">
                  <span
                    className={`px-6 text-base font-bold text-text-secondary transition-opacity duration-300 sm:px-8 sm:text-lg ${
                      isExampleVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {discoveryExamples[currentExampleIndex]}
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={(!inputValue && !selectedMood) || isLoading}
              className="pop-element touch-feedback mobile-touch flex items-center justify-center rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-110 hover:bg-text-primary/90 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-6 sm:text-lg"
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
            <div className="animate-fade-in-up text-center text-sm font-bold text-text-secondary">
              Finding your perfect match...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
