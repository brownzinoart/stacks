/**
 * Recommendation Orchestrator
 * Coordinates the recommendation workflow without mixing concerns
 * Handles caching, progress tracking, and service coordination
 */

import { cacheManager } from './unified-cache-manager';
import { createRecommendationTracker, ProgressTracker } from './progress-tracker';
import { aiRouter } from './ai-model-router';
import { bookCoverService } from './book-cover-service';

export interface RecommendationRequest {
  userInput: string;
  forceRefresh?: boolean;
  onProgress?: (stage: number, progress?: number) => void;
}

export interface RecommendationResponse {
  overallTheme: string;
  categories: RecommendationCategory[];
  userInput: string;
  timestamp: string;
  cost: number;
  models: string[];
}

export interface RecommendationCategory {
  name: string;
  description: string;
  books: BookRecommendation[];
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

export class RecommendationOrchestrator {
  private activeTrackers = new Map<string, ProgressTracker>();
  private activeRequests = new Map<string, Promise<RecommendationResponse>>();

  /**
   * Get smart recommendations with caching and progress tracking
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const { userInput, forceRefresh = false, onProgress } = request;
    const cacheKey = cacheManager.generateKey(userInput);
    
    console.log(`[Orchestrator] Starting recommendations for: "${userInput}"`);
    
    // REQUEST DEDUPLICATION: Check if identical request is already in progress
    if (!forceRefresh && this.activeRequests.has(cacheKey)) {
      console.log(`[Orchestrator] 🔄 Deduplicating request for: "${userInput}"`);
      const existingRequest = this.activeRequests.get(cacheKey);
      
      // Add progress callback to existing tracker
      if (onProgress) {
        const existingTracker = this.activeTrackers.get(cacheKey);
        if (existingTracker) {
          existingTracker.addCallback(onProgress);
        }
      }
      
      return existingRequest!;
    }
    
    // Create new request promise and store it for deduplication
    const requestPromise = this.executeRecommendationRequest(userInput, cacheKey, onProgress, forceRefresh);
    this.activeRequests.set(cacheKey, requestPromise);
    
    // Clean up when request completes (success or failure)
    requestPromise.finally(() => {
      this.activeRequests.delete(cacheKey);
    });
    
    return requestPromise;
  }

  private async executeRecommendationRequest(
    userInput: string, 
    cacheKey: string, 
    onProgress?: (stage: number, progress?: number) => void,
    forceRefresh = false
  ): Promise<RecommendationResponse> {
    // Create and start progress tracker
    const tracker = createRecommendationTracker();
    this.activeTrackers.set(cacheKey, tracker);
    
    if (onProgress) {
      tracker.addCallback(onProgress);
    }
    
    tracker.start();
    
    try {
      // Stage 0: Check cache unless force refresh
      tracker.updateStage(0, 25);
      
      if (!forceRefresh) {
        const cached = await cacheManager.get<RecommendationResponse>(cacheKey);
        if (cached) {
          console.log(`[Orchestrator] ✅ Cache hit for "${userInput}"`);
          tracker.complete();
          this.activeTrackers.delete(cacheKey);
          return cached;
        }
      }
      
      // Stage 1: Generate AI recommendations
      tracker.updateStage(1, 40);
      const aiResponse = await this.generateAIRecommendations(userInput, tracker);
      
      // Stage 2: Prepare immediate response (without waiting for covers)
      tracker.updateStage(2, 85);
      
      const immediateResponse: RecommendationResponse = {
        overallTheme: aiResponse.overallTheme || 'Book Recommendations',
        categories: aiResponse.categories || [],
        cost: aiResponse.cost || 0,
        models: aiResponse.models || [],
        userInput,
        timestamp: new Date().toISOString(),
      };
      
      // Add placeholder covers immediately
      this.addPlaceholderCovers(immediateResponse);
      
      // Stage 3: Finalize and cache immediate response
      tracker.updateStage(3, 95);
      
      // Cache the immediate response (covers will be enhanced in background)
      await cacheManager.set(cacheKey, immediateResponse);
      
      // Start background cover enhancement (non-blocking)
      this.enhanceCoversInBackground(cacheKey, immediateResponse);
      
      tracker.complete();
      this.activeTrackers.delete(cacheKey);
      
      console.log(`[Orchestrator] ✅ Immediate recommendations completed for "${userInput}"`);
      return immediateResponse;
      
    } catch (error) {
      console.error(`[Orchestrator] ❌ Error generating recommendations:`, error);
      tracker.abort();
      this.activeTrackers.delete(cacheKey);
      
      // Return emergency fallback
      return this.getEmergencyFallback(userInput);
    }
  }

  /**
   * Cancel active recommendation request
   */
  cancelRequest(userInput: string): void {
    const cacheKey = cacheManager.generateKey(userInput);
    const tracker = this.activeTrackers.get(cacheKey);
    
    if (tracker) {
      console.log(`[Orchestrator] Cancelling request for "${userInput}"`);
      tracker.abort();
      this.activeTrackers.delete(cacheKey);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheManager.getStats();
  }

  /**
   * Clear recommendation cache
   */
  async clearCache(): Promise<void> {
    await cacheManager.clearAll();
  }

  // PRIVATE METHODS

  private async generateAIRecommendations(
    userInput: string, 
    tracker: ProgressTracker
  ): Promise<Partial<RecommendationResponse>> {
    console.log(`[Orchestrator] Generating AI recommendations for "${userInput}"`);
    
    // Build AI prompt
    const prompt = this.buildRecommendationPrompt(userInput);
    
    try {
      // Try primary AI models first
      tracker.updateStage(1, 50);
      const response = await aiRouter.routeRequest({
        task: 'mood_recommendation',
        prompt,
        maxTokens: 1500
      });
      
      tracker.updateStage(1, 70);
      
      // Validate and parse response
      const recommendations = this.parseAndValidateResponse(response.content);
      if (recommendations) {
        return {
          ...recommendations,
          cost: response.cost,
          models: [response.model]
        };
      }
      
      throw new Error('Invalid AI response structure');
      
    } catch (error) {
      console.warn(`[Orchestrator] AI generation failed, using fallback:`, error);
      
      // Use contextual emergency fallback
      const { formatFallbackRecommendations } = await import('./emergency-fallback');
      const fallbackResponse = await formatFallbackRecommendations(userInput);
      
      return {
        ...fallbackResponse,
        cost: 0,
        models: ['emergency_fallback']
      };
    }
  }

  private async enhanceWithCovers(
    response: Partial<RecommendationResponse>,
    tracker: ProgressTracker
  ): Promise<Partial<RecommendationResponse>> {
    if (!response.categories) return response;
    
    console.log(`[Orchestrator] Enhancing with covers`);
    
    // Collect all books for batch cover processing
    const allBooks: BookRecommendation[] = [];
    response.categories.forEach(category => {
      allBooks.push(...category.books);
    });
    
    if (allBooks.length === 0) return response;
    
    try {
      // Non-blocking cover fetch with timeout
      const coverPromise = bookCoverService.getBatchCovers(allBooks);
      const timeoutPromise = new Promise<Map<number, any>>((resolve) => {
        setTimeout(() => {
          console.log('[Orchestrator] Cover fetch timed out, proceeding without covers');
          resolve(new Map());
        }, 8000);
      });
      
      const coverResults = await Promise.race([coverPromise, timeoutPromise]);
      
      // Apply covers to books
      let bookIndex = 0;
      let realCoversCount = 0;
      
      response.categories.forEach(category => {
        category.books.forEach(book => {
          const coverResult = coverResults.get(bookIndex);
          if (coverResult && coverResult.url) {
            book.cover = coverResult.url;
            if (!coverResult.url.startsWith('gradient:')) {
              realCoversCount++;
            }
          } else {
            // Generate fallback gradient
            book.cover = this.generateFallbackCover(book.title, book.author);
          }
          bookIndex++;
        });
      });
      
      const successRate = Math.round((realCoversCount / allBooks.length) * 100);
      console.log(`[Orchestrator] Cover enhancement: ${realCoversCount}/${allBooks.length} real covers (${successRate}%)`);
      
    } catch (error) {
      console.warn('[Orchestrator] Cover enhancement failed:', error);
      
      // Apply fallback covers to all books
      response.categories.forEach(category => {
        category.books.forEach(book => {
          if (!book.cover) {
            book.cover = this.generateFallbackCover(book.title, book.author);
          }
        });
      });
    }
    
    return response;
  }

  private buildRecommendationPrompt(userInput: string): string {
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

  private parseAndValidateResponse(content: string): any | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate structure
      if (!parsed.categories || !Array.isArray(parsed.categories) || parsed.categories.length !== 3) {
        return null;
      }

      // Validate each category has books
      for (const category of parsed.categories) {
        if (!category.books || !Array.isArray(category.books) || category.books.length === 0) {
          return null;
        }
        
        // Validate each book has required fields
        for (const book of category.books) {
          if (!book.title || !book.author || !book.whyYoullLikeIt) {
            return null;
          }
        }
      }

      return parsed;
    } catch (error) {
      console.warn('[Orchestrator] Response parsing failed:', error);
      return null;
    }
  }

  private async getEmergencyFallback(userInput: string): Promise<RecommendationResponse> {
    console.log(`[Orchestrator] Using emergency fallback for "${userInput}"`);
    
    try {
      const { formatFallbackRecommendations } = await import('./emergency-fallback');
      const fallbackResponse = await formatFallbackRecommendations(userInput);
      
      return {
        ...fallbackResponse,
        userInput,
        timestamp: new Date().toISOString(),
        cost: 0,
        models: ['emergency_fallback']
      };
    } catch (error) {
      console.error('[Orchestrator] Emergency fallback failed:', error);
      
      // Absolute last resort
      return {
        overallTheme: `Emergency recommendations for "${userInput}"`,
        categories: [
          {
            name: "The Plot",
            description: "Books with engaging storylines",
            books: [{
              title: "The Midnight Library",
              author: "Matt Haig",
              whyYoullLikeIt: "A thought-provoking story about infinite possibilities",
              summary: "Between life and death there is a library",
              cover: this.generateFallbackCover("The Midnight Library", "Matt Haig")
            }]
          },
          {
            name: "The Characters",
            description: "Books with memorable characters",
            books: [{
              title: "Project Hail Mary",
              author: "Andy Weir",
              whyYoullLikeIt: "Science adventure with humor and hope",
              summary: "A man wakes up alone on a spaceship with no memory",
              cover: this.generateFallbackCover("Project Hail Mary", "Andy Weir")
            }]
          },
          {
            name: "The Atmosphere",
            description: "Books with distinctive moods",
            books: [{
              title: "Klara and the Sun",
              author: "Kazuo Ishiguro",
              whyYoullLikeIt: "Beautiful exploration of love and humanity",
              summary: "An artificial friend observes the world",
              cover: this.generateFallbackCover("Klara and the Sun", "Kazuo Ishiguro")
            }]
          }
        ],
        userInput,
        timestamp: new Date().toISOString(),
        cost: 0,
        models: ['absolute_emergency_fallback']
      };
    }
  }

  private addPlaceholderCovers(response: RecommendationResponse): void {
    if (!response.categories) return;
    
    console.log('[Orchestrator] Adding placeholder covers for immediate display');
    
    response.categories.forEach(category => {
      category.books.forEach(book => {
        if (!book.cover) {
          book.cover = this.generateFallbackCover(book.title, book.author);
        }
      });
    });
  }

  private async enhanceCoversInBackground(cacheKey: string, response: RecommendationResponse): Promise<void> {
    console.log('[Orchestrator] Starting background cover enhancement');
    
    if (!response.categories) return;
    
    try {
      // Collect all books for batch processing
      const allBooks: BookRecommendation[] = [];
      response.categories.forEach(category => {
        allBooks.push(...category.books);
      });
      
      if (allBooks.length === 0) return;
      
      // Fetch real covers in background
      const coverResults = await bookCoverService.getBatchCovers(allBooks);
      
      // Apply real covers to books
      let bookIndex = 0;
      let realCoversCount = 0;
      
      response.categories.forEach(category => {
        category.books.forEach(book => {
          const coverResult = coverResults.get(bookIndex);
          if (coverResult && coverResult.url && !coverResult.url.startsWith('gradient:')) {
            book.cover = coverResult.url;
            realCoversCount++;
          }
          bookIndex++;
        });
      });
      
      // Update cache with enhanced covers
      if (realCoversCount > 0) {
        await cacheManager.set(cacheKey, response, { customTTL: 24 * 60 * 60 * 1000 }); // 24h for enhanced
        console.log(`[Orchestrator] Background enhancement complete: ${realCoversCount}/${allBooks.length} real covers added`);
      }
      
    } catch (error) {
      console.warn('[Orchestrator] Background cover enhancement failed:', error);
    }
  }

  private generateFallbackCover(title: string, author: string): string {
    const hash = (title + author).split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
    
    const colors = [
      ['#FF6B6B', '#4ECDC4'],
      ['#45B7D1', '#F39C12'], 
      ['#96CEB4', '#FECA57'],
      ['#6C5CE7', '#FD79A8']
    ];
    
    const colorPair = colors[Math.abs(hash) % colors.length];
    if (!colorPair) {
      return `gradient:#6C5CE7:#FD79A8:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
    }
    return `gradient:${colorPair[0]}:${colorPair[1]}:${encodeURIComponent(title)}:${encodeURIComponent(author)}`;
  }
}

// Export singleton instance
export const recommendationOrchestrator = new RecommendationOrchestrator();