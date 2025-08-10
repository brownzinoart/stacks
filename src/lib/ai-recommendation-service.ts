/**
 * Enhanced AI Recommendation Service with Model Router Integration
 * Optimizes costs by routing to the most appropriate AI model for each task
 */

import { aiRouter, type AITask } from './ai-model-router';
import { createHash } from 'crypto';

export interface RecommendationRequest {
  userInput: string;
  forceRefresh?: boolean;
  onProgress?: (stage: number) => void;
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
      // Stage 1: Analyze user intent (optimized with Gemini for speed/cost)
      onProgress?.(0);
      console.log('[AI Service] Stage 1: Analyzing user intent');
      
      const analysisResponse = await aiRouter.routeRequest({
        task: 'search_query' as AITask,
        prompt: this.buildAnalysisPrompt(userInput),
        maxTokens: 200,
      });
      
      totalCost += analysisResponse.cost;
      modelsUsed.push(analysisResponse.model);
      
      let analysis: UserAnalysis;
      try {
        const content = analysisResponse.content;
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

      // Stage 2: Enrich with OMDb if needed
      onProgress?.(1);
      let enrichedContext = '';
      if ((analysis.referenceType === 'show' || analysis.referenceType === 'movie') && analysis.referenceTitle) {
        console.log('[AI Service] Stage 2: Enriching with OMDb data');
        const omdb = await fetchOmdbData(analysis.referenceTitle);
        if (omdb) {
          enrichedContext = `\nReference: ${omdb.title} - ${omdb.plot}\nGenres: ${omdb.genres}\nTone: ${omdb.rated}`;
        }
      } else {
        console.log('[AI Service] Stage 2: Skipping enrichment (not needed)');
      }

      // Stage 3: Generate categorized recommendations (GPT-4o for best quality)
      onProgress?.(2);
      console.log('[AI Service] Stage 3: Generating recommendations');
      
      const recommendationResponse = await aiRouter.routeRequest({
        task: 'mood_recommendation' as AITask,
        prompt: this.buildRecommendationPrompt(userInput, enrichedContext),
        context: enrichedContext,
        maxTokens: 1500,
      });
      
      totalCost += recommendationResponse.cost;
      modelsUsed.push(recommendationResponse.model);

      let recommendations;
      try {
        const content = recommendationResponse.content;
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

      const result: RecommendationResponse = {
        ...recommendations,
        userInput,
        timestamp: new Date().toISOString(),
        cost: totalCost,
        models: modelsUsed,
      };

      // Cache the result
      this.setCache(cacheKey, result);
      
      console.log(`[AI Service] Recommendations complete! Cost: $${totalCost.toFixed(4)}, Models: ${modelsUsed.join(', ')}`);
      return result;

    } catch (error: any) {
      console.error('[AI Service] Error generating recommendations:', error);
      
      // Enhanced error handling with specific error types
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        throw new Error('Network error. Please check your internet connection.');
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