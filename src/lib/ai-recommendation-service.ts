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
  // Progressive timeout strategy
  private readonly QUICK_TIMEOUT = 8000; // Fast lane: 8 seconds for quick models
  private readonly QUALITY_TIMEOUT = 30000; // Quality lane: 30 seconds for premium models
  private readonly EMERGENCY_TIMEOUT = 5000; // Emergency: 5 seconds for cached/simple responses
  
  // Circuit breaker for API performance tracking
  private apiPerformance = new Map<string, { failures: number; lastFailure: number; avgResponseTime: number }>();
  private readonly FAILURE_THRESHOLD = 3;
  private readonly RECOVERY_TIME = 60000; // 1 minute recovery period

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
      
      // Progressive timeout strategy: start fast, escalate if needed
      console.log('[AI Service] Using progressive timeout strategy: Quick→Quality→Emergency');
      
      // STAGE 1: Analysis with progressive fallback
      console.log('[AI Service] Stage 1: Analysis with progressive fallback');
      let analysisResult;
      try {
        analysisResult = await this.getAnalysisWithFallback(userInput);
        console.log('[AI Service] 🎯 Analysis fallback completed successfully');
      } catch (fallbackError: any) {
        console.error('[AI Service] 🚨 Progressive analysis completely failed, using emergency:', fallbackError);
        analysisResult = {
          analysis: this.getDefaultAnalysis(userInput),
          cost: 0,
          model: 'emergency_analysis_fallback'
        };
      }
      
      // Pre-emptively start OMDb lookup for potential references
      const potentialOmdbPromise = this.extractPotentialReference(userInput)
        ? fetchOmdbData(userInput)
        : Promise.resolve(null);
      
      onProgress?.(0, 25);
      
      // Get OMDb data if available
      const omdbData = await potentialOmdbPromise;
      
      totalCost += analysisResult.cost;
      modelsUsed.push(analysisResult.model);
      const analysis = analysisResult.analysis;
      
      console.log('[AI Service] Analysis result:', analysis);
      onProgress?.(1, 40);

      // Build enriched context from parallel OMDb data
      let enrichedContext = '';
      if (omdbData && (analysis.referenceType === 'show' || analysis.referenceType === 'movie')) {
        enrichedContext = `\nReference: ${omdbData.title} - ${omdbData.plot}\nGenres: ${omdbData.genres}\nTone: ${omdbData.rated}`;
        console.log('[AI Service] Using parallel OMDb enrichment');
      }

      // STAGE 3: Generate recommendations with progressive fallback
      console.log('[AI Service] Stage 3: Generating recommendations with fallback chain');
      onProgress?.(2, 60);
      
      let recommendationResult;
      try {
        recommendationResult = await this.getRecommendationsWithFallback(userInput, enrichedContext);
        console.log('[AI Service] 🎯 Recommendation fallback completed successfully');
      } catch (fallbackError: any) {
        console.error('[AI Service] 🚨 Progressive recommendations completely failed, using emergency:', fallbackError);
        recommendationResult = await this.getEmergencyRecommendations(userInput);
      }
      
      totalCost += recommendationResult.cost;
      modelsUsed.push(recommendationResult.model);
      const recommendations = recommendationResult.recommendations;

      // STAGE 4: Fetch real covers before returning results
      console.log('[AI Service] Stage 4: Fetching book covers');
      onProgress?.(3, 85);
      
      const allBooks: BookRecommendation[] = [];
      for (const category of recommendations.categories) {
        allBooks.push(...category.books);
      }

      // Fetch real covers with timeout
      console.log(`[AI Service] Fetching covers for ${allBooks.length} books`);
      try {
        const coverResults = await Promise.race([
          bookCoverService.getBatchCovers(allBooks),
          new Promise<Map<number, any>>((_, reject) => 
            setTimeout(() => reject(new Error('Cover fetch timeout')), 10000) // 10 second timeout
          )
        ]);
        
        // Apply covers to books
        let bookIndex = 0;
        let realCoversCount = 0;
        for (const category of recommendations.categories) {
          for (const book of category.books) {
            const coverResult = coverResults.get(bookIndex);
            if (coverResult && coverResult.url) {
              book.cover = coverResult.url;
              if (!coverResult.url.startsWith('gradient:')) {
                realCoversCount++;
              }
              console.log(`[AI Service] ✅ Cover attached for "${book.title}": ${coverResult.source}`);
            } else {
              // Generate fallback if no cover found
              book.cover = this.generateFallbackCover(book.title, book.author);
              console.log(`[AI Service] 🎨 Using gradient fallback for "${book.title}"`);
            }
            bookIndex++;
          }
        }
        console.log(`[AI Service] Cover fetch complete: ${realCoversCount} real covers, ${allBooks.length - realCoversCount} gradients`);
        onProgress?.(3, 95);
      } catch (coverError) {
        console.warn('[AI Service] Cover fetching failed, using gradients:', coverError);
        // Apply gradient covers as fallback
        for (const category of recommendations.categories) {
          for (const book of category.books) {
            if (!book.cover) {
              book.cover = this.generateFallbackCover(book.title, book.author);
            }
          }
        }
      }

      // Build complete response with covers already attached
      const result: RecommendationResponse = {
        ...recommendations,
        userInput,
        timestamp: new Date().toISOString(),
        cost: totalCost,
        models: modelsUsed,
      };

      // Cache the result immediately
      this.setCache(cacheKey, result);
      
      onProgress?.(3, 100);
      console.log(`[AI Service] Recommendations complete! Cost: $${totalCost.toFixed(4)}, Models: ${modelsUsed.join(', ')}`);
      return result;

    } catch (error: any) {
      console.error('[AI Service] 🚨 Complete system failure - using ultimate emergency fallback:', error);
      
      try {
        // Try emergency recommendations one more time
        const emergencyResult = await this.getEmergencyRecommendations(userInput);
        console.log('[AI Service] ✅ Emergency fallback succeeded');
        return {
          ...emergencyResult.recommendations,
          userInput,
          timestamp: new Date().toISOString(),
          cost: emergencyResult.cost,
          models: [emergencyResult.model],
        };
      } catch (emergencyError: any) {
        console.error('[AI Service] 🆘 Even emergency failed, using hardcoded response:', emergencyError);
        
        // Ultimate hardcoded fallback - this should NEVER fail
        return {
          overallTheme: `Books related to "${userInput}"`,
          categories: [
            {
              name: "Popular Picks",
              description: "Well-loved books that many readers enjoy",
              books: [
                {
                  title: "The Seven Husbands of Evelyn Hugo",
                  author: "Taylor Jenkins Reid",
                  whyYoullLikeIt: "A captivating story about love, ambition, and the price of fame",
                  summary: "Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story",
                  cover: this.generateFallbackCover("The Seven Husbands of Evelyn Hugo", "Taylor Jenkins Reid")
                },
                {
                  title: "Where the Crawdads Sing", 
                  author: "Delia Owens",
                  whyYoullLikeIt: "A beautiful blend of mystery and coming-of-age story",
                  summary: "A young woman survives alone in the marshes of North Carolina",
                  cover: this.generateFallbackCover("Where the Crawdads Sing", "Delia Owens")
                }
              ]
            }
          ],
          userInput,
          timestamp: new Date().toISOString(),
          cost: 0,
          models: ['ultimate_hardcoded_fallback'],
        };
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
   * Circuit breaker: Record API performance
   */
  private recordApiPerformance(endpoint: string, success: boolean, responseTime: number): void {
    const key = endpoint;
    const existing = this.apiPerformance.get(key) || { failures: 0, lastFailure: 0, avgResponseTime: 0 };
    
    if (success) {
      // Success: reduce failure count and update average response time
      existing.failures = Math.max(0, existing.failures - 1);
      existing.avgResponseTime = existing.avgResponseTime * 0.8 + responseTime * 0.2; // Moving average
    } else {
      // Failure: increment failure count and record timestamp
      existing.failures += 1;
      existing.lastFailure = Date.now();
    }
    
    this.apiPerformance.set(key, existing);
    console.log(`[Circuit Breaker] ${key}: failures=${existing.failures}, avgTime=${existing.avgResponseTime.toFixed(0)}ms`);
  }
  
  /**
   * Circuit breaker: Check if endpoint should be avoided
   */
  private shouldAvoidEndpoint(endpoint: string): boolean {
    const perf = this.apiPerformance.get(endpoint);
    if (!perf) return false;
    
    // Avoid if we've had too many recent failures
    if (perf.failures >= this.FAILURE_THRESHOLD) {
      const timeSinceLastFailure = Date.now() - perf.lastFailure;
      if (timeSinceLastFailure < this.RECOVERY_TIME) {
        console.log(`[Circuit Breaker] Avoiding ${endpoint} due to recent failures`);
        return true;
      }
      // Reset after recovery time
      perf.failures = 0;
      this.apiPerformance.set(endpoint, perf);
    }
    
    // Avoid if response times are consistently too slow (>25s)
    if (perf.avgResponseTime > 25000) {
      console.log(`[Circuit Breaker] Avoiding ${endpoint} due to slow response times (${perf.avgResponseTime.toFixed(0)}ms)`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Enhanced AI request with circuit breaker
   */
  private async makeAIRequestWithCircuitBreaker(
    task: AITask,
    prompt: string,
    maxTokens: number,
    timeout: number,
    context?: string
  ): Promise<any> {
    const endpointKey = `${task}_${timeout}`;
    const startTime = Date.now();
    
    try {
      // Check circuit breaker before making request
      if (this.shouldAvoidEndpoint(endpointKey)) {
        throw new Error(`Circuit breaker: Avoiding ${endpointKey}`);
      }
      
      const response = await Promise.race([
        aiRouter.routeRequest({
          task,
          prompt,
          context,
          maxTokens,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`${task} timeout after ${timeout}ms`)), timeout)
        )
      ]);
      
      // Record success
      const responseTime = Date.now() - startTime;
      this.recordApiPerformance(endpointKey, true, responseTime);
      
      return response;
    } catch (error) {
      // Record failure
      const responseTime = Date.now() - startTime;
      this.recordApiPerformance(endpointKey, false, responseTime);
      throw error;
    }
  }

  /**
   * Progressive analysis with fallback chain
   */
  private async getAnalysisWithFallback(userInput: string): Promise<{
    analysis: UserAnalysis;
    cost: number;
    model: string;
  }> {
    console.log('[AI Service] 🚀 Starting analysis with progressive fallback for:', JSON.stringify(userInput.substring(0, 50)));
    
    // Quick Lane: Fast models with short timeout
    try {
      console.log('[AI Service] 📞 Trying quick lane for analysis (8s timeout)');
      console.log('[AI Service] 🔧 Circuit breaker values - QUICK_TIMEOUT:', this.QUICK_TIMEOUT);
      
      const quickResponse = await this.makeAIRequestWithCircuitBreaker(
        'search_query' as AITask,
        this.buildAnalysisPrompt(userInput),
        200,
        this.QUICK_TIMEOUT
      );
      
      console.log('[AI Service] 📨 Quick analysis response received:', !!quickResponse);
      
      const analysis = this.parseAnalysisResponse(quickResponse.content);
      if (analysis) {
        console.log('[AI Service] ✅ Analysis succeeded in quick lane');
        return {
          analysis,
          cost: quickResponse.cost,
          model: quickResponse.model
        };
      }
    } catch (error: any) {
      const errorMessage = (error as Error)?.message || String(error) || 'Unknown error';
      console.log('[AI Service] ⚡ Quick lane failed, trying quality lane:', errorMessage);
    }
    
    // Quality Lane: Premium models with longer timeout
    try {
      console.log('[AI Service] Trying quality lane for analysis (30s timeout)');
      const qualityResponse = await this.makeAIRequestWithCircuitBreaker(
        'search_query' as AITask,
        this.buildAnalysisPrompt(userInput),
        200,
        this.QUALITY_TIMEOUT
      );
      
      const analysis = this.parseAnalysisResponse(qualityResponse.content);
      if (analysis) {
        console.log('[AI Service] ✅ Analysis succeeded in quality lane');
        return {
          analysis,
          cost: qualityResponse.cost,
          model: qualityResponse.model + '_quality'
        };
      }
    } catch (error: any) {
      const errorMessage = (error as Error)?.message || String(error) || 'Unknown error';
      console.log('[AI Service] ⚡ Quality lane failed, using emergency fallback:', errorMessage);
    }
    
    // Emergency Lane: Use default analysis
    console.log('[AI Service] 🚨 Using emergency analysis fallback');
    return {
      analysis: this.getDefaultAnalysis(userInput),
      cost: 0,
      model: 'emergency_fallback'
    };
  }
  
  /**
   * Progressive recommendations with fallback chain
   */
  private async getRecommendationsWithFallback(userInput: string, enrichedContext: string): Promise<{
    recommendations: any;
    cost: number;
    model: string;
  }> {
    console.log('[AI Service] Starting recommendations with progressive fallback');
    
    // Quick Lane: Fast models
    try {
      console.log('[AI Service] Trying quick lane for recommendations (8s timeout)');
      const quickResponse = await this.makeAIRequestWithCircuitBreaker(
        'mood_recommendation' as AITask,
        this.buildRecommendationPrompt(userInput, enrichedContext),
        1200,
        this.QUICK_TIMEOUT,
        enrichedContext
      );
      
      const recommendations = this.parseRecommendationResponse(quickResponse.content);
      if (recommendations) {
        console.log('[AI Service] ✅ Recommendations succeeded in quick lane');
        return {
          recommendations,
          cost: quickResponse.cost,
          model: quickResponse.model
        };
      }
    } catch (error: any) {
      const errorMessage = (error as Error)?.message || String(error) || 'Unknown error';
      console.log('[AI Service] ⚡ Quick lane failed, trying quality lane:', errorMessage);
    }
    
    // Quality Lane: Premium models
    try {
      console.log('[AI Service] Trying quality lane for recommendations (30s timeout)');
      const qualityResponse = await this.makeAIRequestWithCircuitBreaker(
        'mood_recommendation' as AITask,
        this.buildRecommendationPrompt(userInput, enrichedContext),
        1500,
        this.QUALITY_TIMEOUT,
        enrichedContext
      );
      
      const recommendations = this.parseRecommendationResponse(qualityResponse.content);
      if (recommendations) {
        console.log('[AI Service] ✅ Recommendations succeeded in quality lane');
        return {
          recommendations,
          cost: qualityResponse.cost,
          model: qualityResponse.model + '_quality'
        };
      }
    } catch (error: any) {
      const errorMessage = (error as Error)?.message || String(error) || 'Unknown error';
      console.log('[AI Service] ⚡ Quality lane failed, trying emergency fallback:', errorMessage);
    }
    
    // Emergency Lane: Use cached/simple response
    console.log('[AI Service] 🚨 Using emergency recommendations fallback');
    return await this.getEmergencyRecommendations(userInput);
  }
  
  /**
   * Parse analysis response with error handling
   */
  private parseAnalysisResponse(content: string): UserAnalysis | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('[AI Service] Failed to parse analysis response:', error);
    }
    return null;
  }
  
  /**
   * Parse recommendation response with error handling
   */
  private parseRecommendationResponse(content: string): any | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('[AI Service] Failed to parse recommendation response:', error);
    }
    return null;
  }
  
  /**
   * Emergency recommendations using simple local generation
   */
  private async getEmergencyRecommendations(userInput: string): Promise<{
    recommendations: any;
    cost: number;
    model: string;
  }> {
    try {
      console.log('[AI Service] Generating emergency recommendations with 5s timeout');
      const emergencyResponse = await this.makeAIRequestWithCircuitBreaker(
        'mood_recommendation' as AITask,
        `Simple book recommendations for: "${userInput}". Return JSON with 2 categories, 2 books each.`,
        800,
        this.EMERGENCY_TIMEOUT
      );
      
      const recommendations = this.parseRecommendationResponse(emergencyResponse.content);
      if (recommendations) {
        return {
          recommendations,
          cost: emergencyResponse.cost,
          model: 'emergency_ai'
        };
      }
    } catch (error: any) {
      const errorMessage = (error as Error)?.message || String(error) || 'Unknown error';
      console.log('[AI Service] Emergency AI failed, using hardcoded fallback:', errorMessage);
    }
    
    // Ultimate fallback: hardcoded response
    return {
      recommendations: {
        overallTheme: `Books related to "${userInput}"`,
        categories: [
          {
            name: "Popular Picks",
            description: "Well-loved books that many readers enjoy",
            books: [
              {
                title: "The Seven Husbands of Evelyn Hugo",
                author: "Taylor Jenkins Reid",
                whyYoullLikeIt: "A captivating story about love, ambition, and the price of fame",
                summary: "Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story",
                cover: this.generateFallbackCover("The Seven Husbands of Evelyn Hugo", "Taylor Jenkins Reid")
              },
              {
                title: "Where the Crawdads Sing",
                author: "Delia Owens",
                whyYoullLikeIt: "A beautiful blend of mystery and coming-of-age story",
                summary: "A young woman survives alone in the marshes of North Carolina",
                cover: this.generateFallbackCover("Where the Crawdads Sing", "Delia Owens")
              }
            ]
          },
          {
            name: "Timeless Classics",
            description: "Enduring stories that never go out of style",
            books: [
              {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                whyYoullLikeIt: "A powerful story about justice, morality, and growing up",
                summary: "A young girl learns about prejudice and justice in the American South",
                cover: this.generateFallbackCover("To Kill a Mockingbird", "Harper Lee")
              },
              {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                whyYoullLikeIt: "Witty dialogue and timeless romance with strong characters",
                summary: "Elizabeth Bennet navigates love and social expectations in Regency England",
                cover: this.generateFallbackCover("Pride and Prejudice", "Jane Austen")
              }
            ]
          }
        ]
      },
      cost: 0,
      model: 'hardcoded_emergency'
    };
  }
  
  /**
   * Asynchronous cover loading that runs in background
   */
  private async loadCoversAsync(books: BookRecommendation[]): Promise<void> {
    console.log(`[AI Service] Starting background cover loading for ${books.length} books`);
    
    try {
      // Load covers with generous timeout since this is non-blocking
      const coverResults = await Promise.race([
        bookCoverService.getBatchCovers(books),
        new Promise<Map<number, any>>((_, reject) => 
          setTimeout(() => reject(new Error('Background cover timeout')), 15000)
        )
      ]);
      
      console.log(`[AI Service] Background: loaded ${coverResults.size} covers`);
      
      // Update books with actual covers (this would require a callback mechanism
      // or event system to update the UI - for now just log success)
      let coversFound = 0;
      coverResults.forEach((coverResult, index) => {
        if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
          coversFound++;
        }
      });
      
      console.log(`[AI Service] 🎨 Background cover loading complete: ${coversFound}/${books.length} real covers found`);
      
    } catch (error: any) {
      console.log('[AI Service] Background cover loading failed (non-critical):', error.message);
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
      ['#667eea', '#764ba2'], // Blue to purple gradient
      ['#f093fb', '#f5576c'], // Pink to coral gradient
      ['#4facfe', '#00f2fe'], // Light blue to cyan gradient
      ['#43e97b', '#38f9d7'], // Green to turquoise gradient
      ['#fa709a', '#fee140'], // Pink to yellow gradient
      ['#a8edea', '#fed6e3'], // Mint to pink gradient
      ['#ff9a9e', '#fecfef'], // Coral to light pink gradient
      ['#667eea', '#764ba2'], // Deep blue to purple gradient
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