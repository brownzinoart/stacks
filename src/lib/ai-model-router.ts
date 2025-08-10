/**
 * AI Model Router - Smart routing for cost optimization
 * Routes requests to the most cost-effective AI model based on task type
 */

import { callAIAPI } from './api-client';

export type AITask = 
  | 'mood_recommendation'     // GPT-4o: Best at understanding mood/emotion
  | 'book_summary'           // Claude: Great at text analysis and summaries  
  | 'topic_bundle'           // Gemini: Excellent at categorization/grouping
  | 'learning_path'          // Gemini: Strong at educational content structuring
  | 'search_query'           // Gemini: Fast and cheap for query processing
  | 'content_generation';    // Claude: High quality content creation

export interface AIRequest {
  task: AITask;
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  cost: number; // Estimated cost in USD
  tokensUsed?: number;
}

/**
 * Cost per 1K tokens (approximate)
 */
const MODEL_COSTS = {
  'gpt-4o': 0.03,
  'claude-3-sonnet': 0.015,
  'gemini-1.5-flash': 0.0, // FREE tier via Google AI Studio!
} as const;

/**
 * Model routing configuration based on task type
 */
const TASK_ROUTING: Record<AITask, keyof typeof MODEL_COSTS> = {
  mood_recommendation: 'gpt-4o',      // GPT-4o excels at emotional understanding
  book_summary: 'claude-3-sonnet',    // Claude is excellent for text analysis
  topic_bundle: 'gemini-1.5-flash',   // Gemini is FREE and great for categorization
  learning_path: 'gemini-1.5-flash',  // Gemini handles structured content well
  search_query: 'gemini-1.5-flash',   // Gemini is FREE and fast for simple processing
  content_generation: 'claude-3-sonnet', // Claude produces high-quality content
};

/**
 * Format prompts for different AI models
 */
class AIModelRouter {
  /**
   * Route AI request to optimal model based on task type
   */
  async routeRequest(request: AIRequest): Promise<AIResponse> {
    const optimalModel = TASK_ROUTING[request.task];
    const estimatedTokens = this.estimateTokens(request.prompt + (request.context || ''));
    const estimatedCost = (estimatedTokens / 1000) * MODEL_COSTS[optimalModel];

    console.log(`[AI Router] Task: ${request.task} → Model: ${optimalModel} (Est. cost: $${estimatedCost.toFixed(4)})`);

    try {
      let response;
      
      switch (optimalModel) {
        case 'gpt-4o':
          response = await this.callOpenAI(request);
          break;
        case 'claude-3-sonnet':
          response = await this.callClaude(request);
          break;
        case 'gemini-1.5-flash':
          response = await this.callGemini(request);
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
      console.error(`[AI Router] Error with ${optimalModel}:`, error);
      // Fallback to GPT-4o if primary model fails
      if (optimalModel !== 'gpt-4o') {
        console.log('[AI Router] Falling back to GPT-4o');
        const fallbackResponse = await this.callOpenAI(request);
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
   * Call OpenAI GPT-4o
   */
  private async callOpenAI(request: AIRequest) {
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

    const response = await callAIAPI('openai', payload);
    return {
      content: response.choices[0].message.content,
      tokensUsed: response.usage?.total_tokens,
    };
  }

  /**
   * Call Anthropic Claude
   */
  private async callClaude(request: AIRequest) {
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

    const response = await callAIAPI('anthropic', payload);
    return {
      content: response.content[0].text,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens,
    };
  }

  /**
   * Call Google Vertex AI Gemini
   */
  private async callGemini(request: AIRequest) {
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

    const response = await callAIAPI('vertex', payload);
    return {
      content: response.candidates[0].content.parts[0].text,
      tokensUsed: response.usageMetadata?.totalTokenCount,
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
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /**
   * Get cost estimate for a request
   */
  getCostEstimate(request: AIRequest): number {
    const model = TASK_ROUTING[request.task];
    const estimatedTokens = this.estimateTokens(request.prompt + (request.context || ''));
    return (estimatedTokens / 1000) * MODEL_COSTS[model];
  }

  /**
   * Get model routing information
   */
  getRoutingInfo(): Record<AITask, { model: string; costPer1k: number }> {
    const info: Record<AITask, { model: string; costPer1k: number }> = {} as any;
    
    Object.entries(TASK_ROUTING).forEach(([task, model]) => {
      info[task as AITask] = {
        model,
        costPer1k: MODEL_COSTS[model],
      };
    });

    return info;
  }
}

// Export singleton instance
export const aiRouter = new AIModelRouter();

// Helper functions for common tasks
export const getBookRecommendations = (mood: string, preferences?: string) =>
  aiRouter.routeRequest({
    task: 'mood_recommendation',
    prompt: `Find books that match this mood: ${mood}`,
    context: preferences,
  });

export const generateBookSummary = (title: string, author?: string) =>
  aiRouter.routeRequest({
    task: 'book_summary',
    prompt: `Create a compelling summary for "${title}"${author ? ` by ${author}` : ''}`,
  });

export const createTopicBundle = (books: string[]) =>
  aiRouter.routeRequest({
    task: 'topic_bundle',
    prompt: `Group these books into logical topic bundles: ${books.join(', ')}`,
  });

export const buildLearningPath = (topic: string, level: string) =>
  aiRouter.routeRequest({
    task: 'learning_path',
    prompt: `Create a learning path for ${topic} at ${level} level`,
  });