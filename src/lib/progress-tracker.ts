/**
 * Progress Tracker
 * Centralized progress management for async operations
 * Prevents memory leaks and provides consistent progress reporting
 */

export interface ProgressStage {
  id: number;
  name: string;
  description: string;
  weight: number; // Relative weight for progress calculation
}

export interface ProgressState {
  currentStage: number;
  progress: number; // 0-100
  isActive: boolean;
  startTime: number;
  stages: ProgressStage[];
}

export type ProgressCallback = (stage: number, progress?: number) => void;

export class ProgressTracker {
  private state: ProgressState;
  private callbacks = new Set<ProgressCallback>();
  private abortController: AbortController | null = null;
  private cleanupFunctions: (() => void)[] = [];

  constructor(stages: ProgressStage[]) {
    this.state = {
      currentStage: 0,
      progress: 0,
      isActive: false,
      startTime: 0,
      stages
    };
  }

  /**
   * Start progress tracking
   */
  start(): void {
    if (this.state.isActive) {
      console.warn('[Progress] Tracker already active');
      return;
    }

    console.log('[Progress] Starting tracker with', this.state.stages.length, 'stages');
    this.state.isActive = true;
    this.state.startTime = Date.now();
    this.state.currentStage = 0;
    this.state.progress = 0;
    this.abortController = new AbortController();

    this.notifyCallbacks(0, 0);
  }

  /**
   * Update progress to specific stage
   */
  updateStage(stage: number, progress?: number): void {
    if (!this.state.isActive) {
      console.warn('[Progress] Tracker not active');
      return;
    }

    if (stage < 0 || stage >= this.state.stages.length) {
      console.warn('[Progress] Invalid stage:', stage);
      return;
    }

    this.state.currentStage = stage;
    
    // Calculate overall progress based on stage weights
    const calculatedProgress = this.calculateOverallProgress(stage, progress);
    this.state.progress = Math.max(calculatedProgress, this.state.progress); // Never go backwards
    
    console.log(`[Progress] Stage ${stage}: ${this.state.stages[stage]?.name} (${this.state.progress}%)`);
    this.notifyCallbacks(stage, this.state.progress);
  }

  /**
   * Complete progress tracking
   */
  complete(): void {
    if (!this.state.isActive) return;

    console.log('[Progress] Completing tracker');
    this.state.currentStage = this.state.stages.length - 1;
    this.state.progress = 100;
    this.state.isActive = false;

    this.notifyCallbacks(this.state.currentStage, 100);
    this.cleanup();
  }

  /**
   * Abort progress tracking
   */
  abort(): void {
    if (!this.state.isActive) return;

    console.log('[Progress] Aborting tracker');
    this.state.isActive = false;
    this.abortController?.abort();
    this.cleanup();
  }

  /**
   * Add progress callback
   */
  addCallback(callback: ProgressCallback): () => void {
    this.callbacks.add(callback);
    
    // Return cleanup function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current state
   */
  getState(): Readonly<ProgressState> {
    return { ...this.state };
  }

  /**
   * Get abort signal for cancellable operations
   */
  getAbortSignal(): AbortSignal | null {
    return this.abortController?.signal || null;
  }

  /**
   * Get elapsed time
   */
  getElapsedTime(): number {
    return this.state.startTime > 0 ? Date.now() - this.state.startTime : 0;
  }

  // PRIVATE METHODS

  private calculateOverallProgress(stage: number, stageProgress?: number): number {
    let totalWeight = 0;
    let completedWeight = 0;

    // Calculate total weight
    for (const s of this.state.stages) {
      totalWeight += s.weight;
    }

    // Calculate completed weight
    for (let i = 0; i < stage; i++) {
      completedWeight += this.state.stages[i]?.weight || 0;
    }

    // Add current stage progress
    if (stageProgress !== undefined && this.state.stages[stage]) {
      const currentStageWeight = this.state.stages[stage].weight;
      completedWeight += (currentStageWeight * stageProgress) / 100;
    }

    return Math.round((completedWeight / totalWeight) * 100);
  }

  private notifyCallbacks(stage: number, progress: number): void {
    // Use setTimeout to prevent blocking and allow cleanup
    setTimeout(() => {
      this.callbacks.forEach(callback => {
        try {
          callback(stage, progress);
        } catch (error) {
          console.warn('[Progress] Callback error:', error);
        }
      });
    }, 0);
  }

  private cleanup(): void {
    this.callbacks.clear();
    this.abortController = null;
    
    // Run any registered cleanup functions
    this.cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.warn('[Progress] Cleanup error:', error);
      }
    });
    this.cleanupFunctions = [];
  }
}

/**
 * Predefined progress stages for recommendation workflow
 */
export const RECOMMENDATION_STAGES: ProgressStage[] = [
  {
    id: 0,
    name: 'Analyzing Request',
    description: 'Understanding your preferences and context',
    weight: 10
  },
  {
    id: 1,
    name: 'Searching Recommendations',
    description: 'Finding books that match your interests',
    weight: 60
  },
  {
    id: 2,
    name: 'Enhancing Results',
    description: 'Adding covers and additional details',
    weight: 25
  },
  {
    id: 3,
    name: 'Finalizing',
    description: 'Preparing your personalized recommendations',
    weight: 5
  }
];

/**
 * Create a progress tracker for recommendations
 */
export function createRecommendationTracker(): ProgressTracker {
  return new ProgressTracker(RECOMMENDATION_STAGES);
}