/**
 * Enhanced AI Recommendation Service with Model Router Integration
 * Optimizes costs by routing to the most appropriate AI model for each task
 */

import { aiRouter, type AITask } from './ai-model-router';
import { bookCoverService } from './book-cover-service';
import { createHash } from 'crypto';

export interface RecommendationRequest {
  userInput: string;
  forceRefresh?: boolean;
  onProgress?: (stage: number, progress?: number) => void;
}

export interface BookRecommendation {
  title: string;
  author: string;
  isbn?: string;
  year?: string;
  whyYoullLikeIt: string;
  summary: string;
  pageCount?: string;
  readingTime?: string;
  publisher?: string;
  cover?: string;
}

export interface RecommendationCategory {
  name: string;
  description: string;
  books: BookRecommendation[];
}

export interface RecommendationResponse {
  overallTheme: string;
  categories: RecommendationCategory[];
  userInput: string;
  timestamp: string;
  cost: number; // Total cost in USD
  models: string[]; // Models used
}

export interface UserAnalysis {
  isComparison: boolean;
  referenceTitle: string;
  referenceType: 'show' | 'movie' | 'book' | 'none';
  aspectsOfInterest: string[];
  emotionalContext: string;
}

/**
 * Deterministic cache key generation using SHA256
 */
function generateCacheKey(input: string): string {
  return createHash('sha256').update(input.toLowerCase().trim()).digest('hex').slice(0, 16);
}

/**
 * Fetch OMDb data for enrichment
 */
async function fetchOmdbData(title: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY || '95cb8a0d';
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
    console.warn('OMDb API error:', e);
  }
  return null;
}

/**
 * Enhanced AI Recommendation Service
 */
export class AIRecommendationService {
  private abortController: AbortController | null = null;
  private cache = new Map<string, { data: RecommendationResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MOBILE_TIMEOUT = 15000; // Optimized: 15 seconds for mobile
  private readonly WEB_TIMEOUT = 12000; // Optimized: 12 seconds for web

  /**
   * Extract potential reference from user input for parallel OMDb lookup
   */
  private extractPotentialReference(input: string): boolean {
    const lowerInput = input.toLowerCase();
    return lowerInput.includes('like') && (
      lowerInput.includes('movie') || 
      lowerInput.includes('show') || 
      lowerInput.includes('tv') ||
      lowerInput.includes('series') ||
      lowerInput.includes('film')
    );
  }

  /**
   * Get smart book recommendations with optimized AI routing
   */
  async getSmartRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    // Cancel any existing request
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    const { userInput, forceRefresh = false, onProgress } = request;
    
    console.log('[AI Service] Starting smart recommendations for:', userInput);

    // Check cache first
    const cacheKey = generateCacheKey(userInput);
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      console.log('[AI Service] Using cached recommendations');
      return this.getFromCache(cacheKey)!;
    }

    let totalCost = 0;
    const modelsUsed: string[] = [];

    try {
      // OPTIMIZED: Parallel processing for speed improvement
      console.log('[AI Service] Starting parallel optimization workflow');
      onProgress?.(0, 10);
      
      // Set optimized timeout - reduced for faster responses
      const isMobile = this.isMobileDevice();
      const timeout = 15000; // Unified 15-second timeout for faster responses
      
      console.log(`[AI Service] Using optimized ${timeout}ms timeout`);
      
      // PARALLEL STAGE 1 & 2: Analysis + OMDb enrichment simultaneously
      const analysisPromise = aiRouter.routeRequest({
        task: 'search_query' as AITask,
        prompt: this.buildAnalysisPrompt(userInput),
        maxTokens: 200,
      });
      
      // Pre-emptively start OMDb lookup for potential references
      const potentialOmdbPromise = this.extractPotentialReference(userInput)
        ? fetchOmdbData(userInput)
        : Promise.resolve(null);
      
      onProgress?.(0, 25);
      
      // Wait for both analysis and potential OMDb data
      const [analysisResponse, omdbData] = await Promise.all([
        Promise.race([analysisPromise, new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis timeout')), timeout)
        )]),
        potentialOmdbPromise
      ]);
      
      totalCost += (analysisResponse as any).cost;
      modelsUsed.push((analysisResponse as any).model);
      
      let analysis: UserAnalysis;
      try {
        const content = (analysisResponse as any).content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in analysis response');
        }
      } catch (parseError) {
        console.warn('[AI Service] Failed to parse analysis, using defaults');
        analysis = this.getDefaultAnalysis(userInput);
      }
      
      console.log('[AI Service] Analysis result:', analysis);
      onProgress?.(1, 40);

      // Build enriched context from parallel OMDb data
      let enrichedContext = '';
      if (omdbData && (analysis.referenceType === 'show' || analysis.referenceType === 'movie')) {
        enrichedContext = `\nReference: ${omdbData.title} - ${omdbData.plot}\nGenres: ${omdbData.genres}\nTone: ${omdbData.rated}`;
        console.log('[AI Service] Using parallel OMDb enrichment');
      }

      // STAGE 3: Generate recommendations with reduced timeout
      console.log('[AI Service] Stage 3: Generating recommendations (optimized)');
      onProgress?.(2, 60);
      
      const recommendationPromise = aiRouter.routeRequest({
        task: 'mood_recommendation' as AITask,
        prompt: this.buildRecommendationPrompt(userInput, enrichedContext),
        context: enrichedContext,
        maxTokens: 1500,
      });
      
      const recommendationResponse = await Promise.race([
        recommendationPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Recommendation timeout')), timeout))
      ]);
      
      totalCost += (recommendationResponse as any).cost;
      modelsUsed.push((recommendationResponse as any).model);

      let recommendations;
      try {
        const content = (recommendationResponse as any).content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in recommendation response');
        }
      } catch (parseError) {
        console.error('[AI Service] Failed to parse recommendations:', parseError);
        throw new Error('Failed to parse AI response');
      }

      // PARALLEL STAGE 4: Start cover fetching while building response
      console.log('[AI Service] Stage 4: Parallel cover fetching');
      onProgress?.(3, 80);
      
      const allBooks: BookRecommendation[] = [];
      for (const category of recommendations.categories) {
        allBooks.push(...category.books);
      }

      console.log(`[AI Service] Pre-fetching covers for ${allBooks.length} books across ${recommendations.categories.length} categories`);
      console.log('[AI Service] Categories:', recommendations.categories.map((c: any) => `${c.name} (${c.books.length} books)`).join(', '));
      
      // Build response immediately, fetch covers in background
      const result: RecommendationResponse = {
        ...recommendations,
        userInput,
        timestamp: new Date().toISOString(),
        cost: totalCost,
        models: modelsUsed,
      };
      
      // Start cover fetching in background (non-blocking)
      bookCoverService.getBatchCovers(allBooks).then(coverResults => {
        console.log(`[AI Service] Background cover service returned ${coverResults.size} results`);
        
        // Apply covers to the books
        let coversAttached = 0;
        let bookIndex = 0;
        for (const category of result.categories) {
          for (const book of category.books) {
            const coverResult = coverResults.get(bookIndex);
            if (coverResult && coverResult.url) {
              book.cover = coverResult.url;
              coversAttached++;
            } else {
              // Generate a fallback cover if none was found
              book.cover = this.generateFallbackCover(book.title, book.author);
            }
            bookIndex++;
          }
        }
        console.log(`[AI Service] Background covers attached: ${coversAttached}/${allBooks.length}`);
      }).catch(error => {
        console.error('[AI Service] Background cover fetching failed:', error);
        // Apply fallback covers
        for (const category of result.categories) {
          for (const book of category.books) {
            book.cover = this.generateFallbackCover(book.title, book.author);
          }
        }
      });

      // Cache the result immediately
      this.setCache(cacheKey, result);
      
      onProgress?.(3, 100);
      console.log(`[AI Service] Recommendations complete! Cost: $${totalCost.toFixed(4)}, Models: ${modelsUsed.join(', ')}`);
      return result;

    } catch (error: any) {
      console.error('[AI Service] Error generating recommendations:', error);
      
      // Enhanced error handling with mobile-specific messages
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      } else if (error.message?.includes('timeout')) {
        const isMobile = this.isMobileDevice();
        const msg = isMobile 
          ? 'Request timed out. Mobile networks can be slower - please try again or connect to WiFi.'
          : 'Request timed out. Please check your internet connection and try again.';
        throw new Error(msg);
      } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.message?.includes('Failed to parse')) {
        // Retry once with a simpler prompt
        console.log('[AI Service] Retrying with fallback prompt...');
        return this.getSmartRecommendationsWithFallback(userInput, onProgress);
      } else {
        throw new Error('Failed to generate recommendations. Please try again.');
      }
    }
  }

  /**
   * Cancel ongoing requests
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Build analysis prompt for user intent understanding
   */
  private buildAnalysisPrompt(userInput: string): string {
    return `Analyze this book request: "${userInput}"
  
Return ONLY valid JSON with this exact structure:
{
  "isComparison": true or false,
  "referenceTitle": "title if comparing to something, otherwise empty string",
  "referenceType": "show" or "movie" or "book" or "none",
  "aspectsOfInterest": ["choose from: plot, characters, themes, atmosphere, writing_style"],
  "emotionalContext": "one sentence description"
}

No other text, just the JSON object.`;
  }

  /**
   * Build recommendation prompt
   */
  private buildRecommendationPrompt(userInput: string, enrichedContext: string): string {
    return `Based on the user wanting books like "${userInput}", create exactly 3 categories of recommendations.
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
  }

  /**
   * Get default analysis when parsing fails
   */
  private getDefaultAnalysis(userInput: string): UserAnalysis {
    return {
      isComparison: false,
      referenceTitle: '',
      referenceType: 'none',
      aspectsOfInterest: ['themes'],
      emotionalContext: userInput,
    };
  }

  /**
   * Cache management
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const age = Date.now() - cached.timestamp;
    return age < this.CACHE_DURATION;
  }

  private getFromCache(key: string): RecommendationResponse | null {
    return this.cache.get(key)?.data || null;
  }

  private setCache(key: string, data: RecommendationResponse): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Store in localStorage as well for persistence
    if (typeof window !== 'undefined') {
      try {
        const cacheData = {
          ...data,
          cacheKey: key,
        };
        localStorage.setItem(`stacks_cache_${key}`, JSON.stringify(cacheData));
      } catch (e) {
        console.warn('[AI Service] Failed to persist cache to localStorage:', e);
      }
    }
  }

  /**
   * Fallback method with simpler prompts for better reliability
   */
  private async getSmartRecommendationsWithFallback(
    userInput: string, 
    onProgress?: (stage: number, progress?: number) => void
  ): Promise<RecommendationResponse> {
    console.log('[AI Service] Using fallback recommendation method');
    
    try {
      onProgress?.(2, 70);
      
      // Simple, reliable prompt that's less likely to cause parsing issues
      const fallbackResponse = await aiRouter.routeRequest({
        task: 'mood_recommendation' as AITask,
        prompt: `Give me 6 book recommendations for someone who wants "${userInput}". 
        
        Return ONLY this JSON format:
        {
          "overallTheme": "Brief theme description",
          "categories": [
            {
              "name": "Category 1",
              "description": "Why these books fit",
              "books": [
                {
                  "title": "Book Title",
                  "author": "Author Name",
                  "whyYoullLikeIt": "Simple reason why you'll like it",
                  "summary": "Brief plot summary"
                }
              ]
            }
          ]
        }
        
        No other text, just valid JSON.`,
        maxTokens: 1000,
      });
      
      const content = fallbackResponse.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in fallback response');
      }
      
      const recommendations = JSON.parse(jsonMatch[0]);
      
      // Pre-fetch covers for fallback recommendations too
      const allBooks: BookRecommendation[] = [];
      for (const category of recommendations.categories) {
        allBooks.push(...category.books);
      }

      console.log(`[AI Service] Pre-fetching covers for ${allBooks.length} fallback books`);
      
      try {
        const coverResults = await bookCoverService.getBatchCovers(allBooks);
        console.log(`[AI Service] Fallback cover service returned ${coverResults.size} results`);
        
        // Apply covers to the books with detailed logging
        let bookIndex = 0;
        let coversAttached = 0;
        for (const category of recommendations.categories) {
          for (const book of category.books) {
            const coverResult = coverResults.get(bookIndex);
            if (coverResult && coverResult.url) {
              book.cover = coverResult.url;
              coversAttached++;
              console.log(`[AI Service] ✅ Fallback cover attached for "${book.title}": ${coverResult.source}`);
            } else {
              // Generate a fallback cover if none was found
              const fallbackCover = this.generateFallbackCover(book.title, book.author);
              book.cover = fallbackCover;
              console.log(`[AI Service] 🎨 Generated gradient fallback for "${book.title}"`);
            }
            bookIndex++;
          }
        }

        console.log(`[AI Service] Fallback: attached ${coversAttached} covers out of ${allBooks.length} books`);
      } catch (coverError) {
        console.error('[AI Service] Fallback cover pre-fetching failed:', coverError);
        // Add gradient covers for all books if batch fetch fails
        for (const category of recommendations.categories) {
          for (const book of category.books) {
            if (!book.cover) {
              book.cover = this.generateFallbackCover(book.title, book.author);
            }
          }
        }
        console.log('[AI Service] Applied gradient covers due to fallback fetch failure');
      }
      
      return {
        ...recommendations,
        userInput,
        timestamp: new Date().toISOString(),
        cost: fallbackResponse.cost,
        models: [fallbackResponse.model],
      };
      
    } catch (fallbackError) {
      console.error('[AI Service] Fallback also failed:', fallbackError);
      throw new Error('Unable to generate recommendations. Please try a different search.');
    }
  }

  /**
   * Mobile device detection (server-side safe)
   */
  private isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const userAgent = navigator.userAgent || '';
      const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window;
      const smallScreen = window.innerWidth <= 768;
      
      return isMobile || (hasTouch && smallScreen);
    } catch (e) {
      console.warn('[AI Service] Mobile detection failed:', e);
      return false;
    }
  }

  /**
   * Generate a fallback gradient cover for a book
   */
  private generateFallbackCover(title: string, author: string): string {
    const hash = (title + author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
    
    const colors = [
      ['#FF6B6B', '#4ECDC4'], // Red to teal
      ['#45B7D1', '#F39C12'], // Blue to orange  
      ['#96CEB4', '#FECA57'], // Green to yellow
      ['#6C5CE7', '#FD79A8'], // Purple to pink
      ['#00B894', '#00CEC9'], // Green to cyan
      ['#E17055', '#FDCB6E'], // Orange gradient
    ];
    
    const colorPair = colors[Math.abs(hash) % colors.length] || colors[0]!;
    return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      // Clear localStorage cache entries
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('stacks_cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }
}

// Export singleton instance
export const aiRecommendationService = new AIRecommendationService();