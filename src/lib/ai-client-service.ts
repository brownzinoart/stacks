/**
 * Client-Side AI Service - Direct API calls for iOS compatibility
 * Makes direct calls to OpenAI, Anthropic, and Google Vertex AI without proxy routes
 * This service works in static exports and mobile environments
 */

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
  cost: number;
  models: string[];
}

export interface UserAnalysis {
  isComparison: boolean;
  referenceTitle: string;
  referenceType: 'show' | 'movie' | 'book' | 'none';
  aspectsOfInterest: string[];
  emotionalContext: string;
}

export type AITask = 
  | 'mood_recommendation'
  | 'book_summary'
  | 'topic_bundle'
  | 'learning_path'
  | 'search_query'
  | 'content_generation';

export interface AIRequest {
  task: AITask;
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  cost: number;
  tokensUsed?: number;
}

/**
 * Cost per 1K tokens (approximate)
 */
const MODEL_COSTS = {
  'gpt-4o': 0.03,
  'claude-3-sonnet': 0.015,
  'gemini-1.5-flash': 0.0,
} as const;

/**
 * Model routing configuration - optimized for reliability
 */
const TASK_ROUTING: Record<AITask, keyof typeof MODEL_COSTS> = {
  mood_recommendation: 'gpt-4o',
  book_summary: 'gpt-4o',
  topic_bundle: 'gpt-4o',
  learning_path: 'gpt-4o',
  search_query: 'gpt-4o',
  content_generation: 'gpt-4o',
};

/**
 * Direct AI API Client - bypasses proxy routes for iOS compatibility
 */
class DirectAIClient {
  private apiKeys = {
    openai: '',
    anthropic: '',
    gemini: '',
  };

  constructor() {
    // Load API keys from environment variables
    if (typeof window !== 'undefined') {
      this.apiKeys.openai = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
      this.apiKeys.anthropic = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
      this.apiKeys.gemini = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || '';
    }
  }

  /**
   * Route AI request to optimal model
   */
  async routeRequest(request: AIRequest): Promise<AIResponse> {
    const optimalModel = TASK_ROUTING[request.task];
    const estimatedTokens = this.estimateTokens(request.prompt + (request.context || ''));
    const estimatedCost = (estimatedTokens / 1000) * MODEL_COSTS[optimalModel];

    console.log(`[Direct AI Client] Task: ${request.task} → Model: ${optimalModel} (Est. cost: $${estimatedCost.toFixed(4)})`);

    try {
      let response;
      
      switch (optimalModel) {
        case 'gpt-4o':
          response = await this.callOpenAIDirect(request);
          break;
        case 'claude-3-sonnet':
          response = await this.callClaudeDirect(request);
          break;
        case 'gemini-1.5-flash':
          response = await this.callGeminiDirect(request);
          break;
        default:
          throw new Error(`Unknown model: ${optimalModel}`);
      }

      return {
        content: response.content,
        model: optimalModel,
        cost: estimatedCost,
        tokensUsed: response.tokensUsed,
      };
    } catch (error) {
      console.error(`[Direct AI Client] Error with ${optimalModel}:`, error);
      // Fallback to GPT-4o if primary model fails
      if (optimalModel !== 'gpt-4o') {
        console.log('[Direct AI Client] Falling back to GPT-4o');
        const fallbackResponse = await this.callOpenAIDirect(request);
        return {
          content: fallbackResponse.content,
          model: 'gpt-4o (fallback)',
          cost: (estimatedTokens / 1000) * MODEL_COSTS['gpt-4o'],
          tokensUsed: fallbackResponse.tokensUsed,
        };
      }
      throw error;
    }
  }

  /**
   * Direct OpenAI API call with proper CORS handling
   */
  private async callOpenAIDirect(request: AIRequest) {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured. Add NEXT_PUBLIC_OPENAI_API_KEY to environment.');
    }

    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt(request.task),
        },
        {
          role: 'user',
          content: request.context ? `Context: ${request.context}\n\nRequest: ${request.prompt}` : request.prompt,
        },
      ],
      max_tokens: request.maxTokens || 1000,
      temperature: 0.7,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKeys.openai}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Direct AI Client] OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Direct Anthropic API call with proper CORS handling
   */
  private async callClaudeDirect(request: AIRequest) {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not configured. Add NEXT_PUBLIC_ANTHROPIC_API_KEY to environment.');
    }

    const payload = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 1000,
      messages: [
        {
          role: 'user',
          content: `${this.getSystemPrompt(request.task)}\n\n${
            request.context ? `Context: ${request.context}\n\n` : ''
          }${request.prompt}`,
        },
      ],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKeys.anthropic,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Direct AI Client] Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    };
  }

  /**
   * Direct Google Gemini API call with proper CORS handling
   */
  private async callGeminiDirect(request: AIRequest) {
    if (!this.apiKeys.gemini) {
      throw new Error('Google AI API key not configured. Add NEXT_PUBLIC_GOOGLE_AI_API_KEY to environment.');
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${this.getSystemPrompt(request.task)}\n\n${
                request.context ? `Context: ${request.context}\n\n` : ''
              }${request.prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: request.maxTokens || 1000,
        temperature: 0.7,
      },
    };

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKeys.gemini}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Direct AI Client] Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      tokensUsed: data.usageMetadata?.totalTokenCount,
    };
  }

  /**
   * Get system prompt based on task type
   */
  private getSystemPrompt(task: AITask): string {
    const prompts = {
      mood_recommendation: 'You are a library assistant expert at understanding mood and emotional context to recommend perfect books. Focus on matching the emotional tone and reading experience the user seeks.',
      
      book_summary: 'You are a literary analyst who creates concise, insightful book summaries. Focus on key themes, plot points, and what makes each book unique and worth reading.',
      
      topic_bundle: 'You are a librarian who excels at categorizing and grouping books by topic, theme, or subject matter. Create logical, discoverable bundles that help users find related content.',
      
      learning_path: 'You are an educational content specialist who designs progressive learning paths. Structure book recommendations that build knowledge step-by-step from beginner to advanced.',
      
      search_query: 'You are a search optimization specialist. Help users refine and improve their book search queries to find exactly what they\'re looking for.',
      
      content_generation: 'You are a skilled content creator who produces engaging, informative text about books and reading. Write in a friendly, accessible tone that inspires people to read.',
    };

    return prompts[task];
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

/**
 * Client-Side AI Recommendation Service - iOS Compatible
 */
export class ClientAIRecommendationService {
  private abortController: AbortController | null = null;
  private cache = new Map<string, { data: RecommendationResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly QUICK_TIMEOUT = 8000;
  private readonly QUALITY_TIMEOUT = 90000;
  private readonly EMERGENCY_TIMEOUT = 5000;
  
  private apiPerformance = new Map<string, { failures: number; lastFailure: number; avgResponseTime: number }>();
  private readonly FAILURE_THRESHOLD = 3;
  private readonly RECOVERY_TIME = 60000;

  private directClient = new DirectAIClient();

  /**
   * Generate deterministic cache key
   */
  private generateCacheKey(input: string): string {
    return createHash('sha256').update(input.toLowerCase().trim()).digest('hex').slice(0, 16);
  }

  /**
   * Get smart book recommendations with iOS compatibility
   */
  async getSmartRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    const { userInput, forceRefresh = false, onProgress } = request;
    
    console.log('[Client AI Service] Starting smart recommendations for:', userInput);

    // Check cache first
    const cacheKey = this.generateCacheKey(userInput);
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      console.log('[Client AI Service] Using cached recommendations');
      return this.getFromCache(cacheKey)!;
    }

    let totalCost = 0;
    const modelsUsed: string[] = [];

    try {
      onProgress?.(0, 10);
      
      // Skip analysis for simplicity - use default
      const analysisResult = {
        analysis: this.getDefaultAnalysis(userInput),
        cost: 0,
        model: 'quick_analysis'
      };
      
      onProgress?.(0, 25);
      onProgress?.(1, 40);

      const enrichedContext = `User wants books like: "${userInput}"`;

      // Generate recommendations with fallback
      console.log('[Client AI Service] Generating recommendations with fallback chain');
      onProgress?.(2, 60);
      
      let recommendationResult;
      try {
        recommendationResult = await this.getRecommendationsWithFallback(userInput, enrichedContext);
        console.log('[Client AI Service] Recommendation fallback completed successfully');
      } catch (fallbackError: any) {
        console.error('[Client AI Service] Progressive recommendations failed, using emergency:', fallbackError);
        recommendationResult = await this.getEmergencyRecommendations(userInput);
      }
      
      totalCost += recommendationResult.cost;
      modelsUsed.push(recommendationResult.model);
      const recommendations = recommendationResult.recommendations;

      // Fetch book covers
      console.log('[Client AI Service] Fetching book covers');
      onProgress?.(3, 85);
      
      const allBooks: BookRecommendation[] = [];
      for (const category of recommendations.categories) {
        allBooks.push(...category.books);
      }

      let realCoversCount = 0;
      let coverResults: Map<number, any> = new Map();
      
      try {
        console.log('[Client AI Service] Fetching covers with 8s timeout');
        coverResults = await Promise.race([
          bookCoverService.getBatchCovers(allBooks),
          new Promise<Map<number, any>>((resolve) => {
            setTimeout(() => {
              console.log('[Client AI Service] Cover fetch timed out - proceeding with AI books');
              resolve(new Map());
            }, 8000)
          })
        ]);
        console.log(`[Client AI Service] Cover fetch completed: ${coverResults.size} results`);
      } catch (coverError: any) {
        console.log('[Client AI Service] Cover fetch failed but continuing with AI books:', coverError.message);
        coverResults = new Map();
      }
        
      // Apply covers to books
      let bookIndex = 0;
      for (const category of recommendations.categories) {
        for (const book of category.books) {
          const coverResult = coverResults.get(bookIndex);
          if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
            book.cover = coverResult.url;
            realCoversCount++;
            console.log(`[Client AI Service] Real cover attached for "${book.title}": ${coverResult.source}`);
          } else if (coverResult && coverResult.url) {
            book.cover = coverResult.url;
            console.log(`[Client AI Service] Service gradient for "${book.title}"`);
          } else {
            book.cover = this.generateFallbackCover(book.title, book.author);
            console.log(`[Client AI Service] Generated gradient fallback for "${book.title}"`);
          }
          bookIndex++;
        }
      }
      
      const successRate = Math.round((realCoversCount / allBooks.length) * 100);
      console.log(`[Client AI Service] Cover integration result: ${realCoversCount}/${allBooks.length} real covers (${successRate}% success rate)`);
      
      onProgress?.(3, 95);

      const result: RecommendationResponse = {
        ...recommendations,
        userInput,
        timestamp: new Date().toISOString(),
        cost: totalCost,
        models: modelsUsed,
      };

      this.setCache(cacheKey, result);
      
      onProgress?.(3, 100);
      console.log(`[Client AI Service] Recommendations complete! Cost: $${totalCost.toFixed(4)}, Models: ${modelsUsed.join(', ')}`);
      return result;

    } catch (error: any) {
      console.error('[Client AI Service] Complete system failure - using ultimate emergency fallback:', error);
      
      try {
        const emergencyResult = await this.getEmergencyRecommendations(userInput);
        console.log('[Client AI Service] Emergency fallback succeeded');
        return {
          ...emergencyResult.recommendations,
          userInput,
          timestamp: new Date().toISOString(),
          cost: emergencyResult.cost,
          models: [emergencyResult.model],
        };
      } catch (emergencyError: any) {
        console.error('[Client AI Service] Even emergency failed, using hardcoded response:', emergencyError);
        
        return await this.getUltimateHardcodedFallback(userInput);
      }
    }
  }

  /**
   * Progressive recommendations with fallback chain
   */
  private async getRecommendationsWithFallback(userInput: string, enrichedContext: string): Promise<{
    recommendations: any;
    cost: number;
    model: string;
  }> {
    console.log('[Client AI Service] Starting recommendations with progressive fallback');
    
    // Quick Lane: Fast models
    try {
      console.log('[Client AI Service] Trying quick lane for recommendations (8s timeout)');
      const quickResponse = await Promise.race([
        this.directClient.routeRequest({
          task: 'mood_recommendation',
          prompt: this.buildRecommendationPrompt(userInput, enrichedContext),
          context: enrichedContext,
          maxTokens: 1200,
        }),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Quick lane timeout')), this.QUICK_TIMEOUT)
        )
      ]);
      
      const recommendations = this.parseRecommendationResponse(quickResponse.content);
      if (recommendations) {
        console.log('[Client AI Service] Recommendations succeeded in quick lane');
        return {
          recommendations,
          cost: quickResponse.cost,
          model: quickResponse.model
        };
      }
    } catch (error: any) {
      console.log('[Client AI Service] Quick lane failed, trying quality lane:', error.message);
    }
    
    // Quality Lane: Premium models with longer timeout
    try {
      console.log('[Client AI Service] Trying quality lane for recommendations');
      const qualityResponse = await Promise.race([
        this.directClient.routeRequest({
          task: 'mood_recommendation',
          prompt: this.buildRecommendationPrompt(userInput, enrichedContext),
          context: enrichedContext,
          maxTokens: 1500,
        }),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Quality lane timeout')), this.QUALITY_TIMEOUT)
        )
      ]);
      
      const recommendations = this.parseRecommendationResponse(qualityResponse.content);
      if (recommendations) {
        console.log('[Client AI Service] Recommendations succeeded in quality lane');
        return {
          recommendations,
          cost: qualityResponse.cost,
          model: qualityResponse.model + '_quality'
        };
      } else {
        // Try simplified retry
        console.log('[Client AI Service] Quality lane response failed validation - trying simplified retry');
        const simplifiedResponse = await Promise.race([
          this.directClient.routeRequest({
            task: 'mood_recommendation',
            prompt: this.buildSimplifiedRetryPrompt(userInput),
            context: enrichedContext,
            maxTokens: 1000,
          }),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Simplified retry timeout')), this.QUALITY_TIMEOUT)
          )
        ]);
        
        const retryRecommendations = this.parseRecommendationResponse(simplifiedResponse.content);
        if (retryRecommendations) {
          console.log('[Client AI Service] Simplified retry succeeded');
          return {
            recommendations: retryRecommendations,
            cost: qualityResponse.cost + simplifiedResponse.cost,
            model: simplifiedResponse.model + '_retry'
          };
        }
      }
    } catch (error: any) {
      console.log('[Client AI Service] Quality lane completely failed:', error.message);
    }
    
    // Emergency Lane
    console.log('[Client AI Service] Using emergency recommendations fallback');
    return await this.getEmergencyRecommendations(userInput);
  }

  /**
   * Emergency recommendations using contextual fallback
   */
  private async getEmergencyRecommendations(userInput: string): Promise<{
    recommendations: any;
    cost: number;
    model: string;
  }> {
    console.log(`[Client AI Service] Emergency fallback: generating contextual recommendations for "${userInput}"`);
    
    try {
      console.log('[Client AI Service] Trying final emergency AI attempt with 5s timeout');
      const emergencyResponse = await Promise.race([
        this.directClient.routeRequest({
          task: 'mood_recommendation',
          prompt: this.buildSimplifiedRetryPrompt(userInput),
          maxTokens: 600,
        }),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Emergency timeout')), this.EMERGENCY_TIMEOUT)
        )
      ]);
      
      const recommendations = this.parseRecommendationResponse(emergencyResponse.content);
      if (recommendations) {
        console.log('[Client AI Service] Emergency AI succeeded with simplified prompt');
        return {
          recommendations,
          cost: emergencyResponse.cost,
          model: 'emergency_ai_simplified'
        };
      }
    } catch (error: any) {
      console.log('[Client AI Service] Final emergency AI failed, using contextual fallback:', error.message);
    }
    
    // Use contextual emergency fallback
    console.log('[Client AI Service] Using contextual emergency fallback system');
    try {
      const { formatFallbackRecommendations } = await import('./emergency-fallback');
      const contextualRecommendations = await formatFallbackRecommendations(userInput);
      
      console.log(`[Client AI Service] Contextual emergency fallback generated ${contextualRecommendations.categories.length} categories`);
      
      return {
        recommendations: contextualRecommendations,
        cost: 0,
        model: 'contextual_emergency_fallback'
      };
    } catch (fallbackError: any) {
      console.error('[Client AI Service] Contextual fallback failed:', fallbackError);
      throw fallbackError;
    }
  }

  /**
   * Ultimate hardcoded fallback - never fails
   */
  private async getUltimateHardcodedFallback(userInput: string): Promise<RecommendationResponse> {
    const ultimateBooks = [
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
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        whyYoullLikeIt: "A thought-provoking story about infinite possibilities",
        summary: "Between life and death there is a library",
        cover: this.generateFallbackCover("The Midnight Library", "Matt Haig")
      }
    ];

    // Try to fetch real covers even in ultimate fallback
    try {
      console.log('[Ultimate Fallback] Attempting to fetch real covers');
      const coverResults = await Promise.race([
        bookCoverService.getBatchCovers(ultimateBooks),
        new Promise<Map<number, any>>((_, reject) => 
          setTimeout(() => reject(new Error('Ultimate cover timeout')), 3000)
        )
      ]);

      ultimateBooks.forEach((book, index) => {
        const coverResult = coverResults.get(index);
        if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
          book.cover = coverResult.url;
          console.log(`[Ultimate Fallback] Real cover found for "${book.title}"`);
        }
      });
    } catch (coverError) {
      console.error('[Ultimate Fallback] Cover fetching failed:', coverError);
    }

    return {
      overallTheme: `Books related to "${userInput}"`,
      categories: [
        {
          name: "The Plot",
          description: "Books with similar storylines and narrative structure",
          books: ultimateBooks.slice(0, 1)
        },
        {
          name: "The Characters", 
          description: "Books with compelling character development and relationships",
          books: ultimateBooks.slice(1, 2)
        },
        {
          name: "The Atmosphere",
          description: "Books with similar mood, setting, and emotional tone",
          books: ultimateBooks.slice(2, 3)
        }
      ],
      userInput,
      timestamp: new Date().toISOString(),
      cost: 0,
      models: ['ultimate_hardcoded_fallback'],
    };
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
      "name": "The Plot",
      "description": "Books with similar storylines and narrative structure",
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
    },
    {
      "name": "The Characters",
      "description": "Books with compelling character development and relationships",
      "books": [...]
    },
    {
      "name": "The Atmosphere",
      "description": "Books with similar mood, setting, and emotional tone",
      "books": [...]
    }
  ]
}

CRITICAL: You MUST use exactly these 3 category names in this exact order:
1. "The Plot" - for similar storylines, narrative structure, plot devices
2. "The Characters" - for character-driven stories, relationships, character development
3. "The Atmosphere" - for mood, setting, tone, emotional feeling

Include 2-3 books per category with rich, detailed "whyYoullLikeIt" descriptions.`;
  }

  /**
   * Build simplified retry prompt
   */
  private buildSimplifiedRetryPrompt(userInput: string): string {
    return `You are a book recommendation expert. The user wants: "${userInput}"

CRITICAL: You MUST return a JSON response with EXACTLY this structure:

{
  "overallTheme": "Brief description of recommendations",
  "categories": [
    {
      "name": "The Plot",
      "description": "Books with similar storylines",
      "books": [
        {
          "title": "Book Title",
          "author": "Author Name", 
          "whyYoullLikeIt": "Explanation of why this matches the user's request",
          "summary": "Brief book summary"
        }
      ]
    },
    {
      "name": "The Characters",
      "description": "Books with compelling characters",
      "books": [
        {
          "title": "Book Title",
          "author": "Author Name",
          "whyYoullLikeIt": "Explanation of why this matches the user's request", 
          "summary": "Brief book summary"
        }
      ]
    },
    {
      "name": "The Atmosphere",
      "description": "Books with similar mood and setting",
      "books": [
        {
          "title": "Book Title",
          "author": "Author Name",
          "whyYoullLikeIt": "Explanation of why this matches the user's request",
          "summary": "Brief book summary"
        }
      ]
    }
  ]
}

Requirements:
- Include 2-3 books per category
- Each category MUST have at least 1 book
- All fields (title, author, whyYoullLikeIt, summary) are required
- Return ONLY the JSON, no other text`;
  }

  /**
   * Parse recommendation response with strict validation
   */
  private parseRecommendationResponse(content: string): any | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('[Client AI Service] No JSON found in response');
        return null;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!this.validateRecommendationStructure(parsed)) {
        console.warn('[Client AI Service] Invalid recommendation structure - rejecting');
        return null;
      }

      console.log('[Client AI Service] Response validation passed');
      return parsed;
    } catch (error) {
      console.warn('[Client AI Service] Failed to parse recommendation response:', error);
    }
    return null;
  }

  /**
   * Validate recommendation structure
   */
  private validateRecommendationStructure(data: any): boolean {
    try {
      if (!data || typeof data !== 'object') {
        console.warn('[Validation] Missing root object');
        return false;
      }

      if (!data.categories || !Array.isArray(data.categories)) {
        console.warn('[Validation] Missing or invalid categories array');
        return false;
      }

      if (data.categories.length !== 3) {
        console.warn(`[Validation] Expected 3 categories, got ${data.categories.length}`);
        return false;
      }

      for (let i = 0; i < 3; i++) {
        const category = data.categories[i];
        
        if (!category || typeof category !== 'object') {
          console.warn(`[Validation] Category ${i} is not an object`);
          return false;
        }

        if (!category.name || typeof category.name !== 'string') {
          console.warn(`[Validation] Category ${i} missing name`);
          return false;
        }

        if (!category.books || !Array.isArray(category.books)) {
          console.warn(`[Validation] Category ${i} missing books array`);
          return false;
        }

        if (category.books.length === 0) {
          console.warn(`[Validation] Category ${i} has no books`);
          return false;
        }

        for (let j = 0; j < category.books.length; j++) {
          const book = category.books[j];
          
          if (!book || typeof book !== 'object') {
            console.warn(`[Validation] Book ${j} in category ${i} is not an object`);
            return false;
          }

          const requiredFields = ['title', 'author', 'whyYoullLikeIt'];
          for (const field of requiredFields) {
            if (!book[field] || typeof book[field] !== 'string' || book[field].trim().length === 0) {
              console.warn(`[Validation] Book ${j} in category ${i} missing or empty ${field}`);
              return false;
            }
          }
        }
      }

      console.log('[Validation] Complete structure validated');
      return true;

    } catch (error) {
      console.warn('[Validation] Validation failed with error:', error);
      return false;
    }
  }

  /**
   * Get default analysis
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
   * Generate fallback gradient cover
   */
  private generateFallbackCover(title: string, author: string): string {
    const hash = (title + author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
    
    const colors = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#ff9a9e', '#fecfef'],
      ['#E17055', '#FDCB6E'],
    ];
    
    const colorPair = colors[Math.abs(hash) % colors.length] || colors[0]!;
    return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
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
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        const cacheData = { ...data, cacheKey: key };
        localStorage.setItem(`stacks_cache_${key}`, JSON.stringify(cacheData));
      } catch (e) {
        console.warn('[Client AI Service] Failed to persist cache to localStorage:', e);
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
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
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
export const clientAIRecommendationService = new ClientAIRecommendationService();