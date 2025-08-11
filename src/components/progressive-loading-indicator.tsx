'use client';

import { useEffect, useState } from 'react';

export interface LoadingStage {
  id: string;
  title: string;
  description: string;
  duration: number; // estimated duration in seconds
}

interface ProgressiveLoadingIndicatorProps {
  stages: LoadingStage[];
  currentStage: number;
  isComplete?: boolean;
  className?: string;
}

export const ProgressiveLoadingIndicator = ({
  stages,
  currentStage,
  isComplete = false,
  className = '',
}: ProgressiveLoadingIndicatorProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [stageStartTime, setStageStartTime] = useState(Date.now());

  // Animate progress within current stage - optimized for mobile
  useEffect(() => {
    if (isComplete) {
      setDisplayProgress(100);
      return;
    }

    setStageStartTime(Date.now());
    const stage = stages[currentStage];
    if (!stage) return;

    // Reduced update frequency for better mobile performance
    const interval = setInterval(() => {
      const elapsed = (Date.now() - stageStartTime) / 1000;
      const stageProgress = Math.min((elapsed / stage.duration) * 100, 95); // Never show 100% until complete
      
      // Calculate overall progress
      const completedStages = currentStage;
      const totalStages = stages.length;
      const completedProgress = (completedStages / totalStages) * 100;
      const currentStageWeight = 100 / totalStages;
      const currentStageProgress = (stageProgress / 100) * currentStageWeight;
      
      setDisplayProgress(completedProgress + currentStageProgress);
    }, 300); // Reduced from 100ms to 300ms for mobile performance

    return () => clearInterval(interval);
  }, [currentStage, stages, stageStartTime, isComplete]);

  const currentStageInfo = stages[currentStage] || stages[stages.length - 1];

  return (
    <div className={`relative w-full space-y-6 ${className}`}>
      {/* Background overlay for better visibility */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl -m-4 sm:-m-6"></div>
      
      <div className="relative z-10 space-y-6 p-4 sm:p-6">
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-blue to-primary-teal transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-bold text-white/80">
              {Math.round(displayProgress)}% Complete
            </span>
          </div>
        </div>

        {/* Current Stage Info */}
        <div className="text-center">
          <h3 className="mb-2 text-xl font-black text-white">
            {isComplete ? '✅ Recommendations Ready!' : currentStageInfo?.title || 'Processing...'}
          </h3>
          <p className="text-sm text-white/80">
            {isComplete ? 'Found perfect book matches for you!' : currentStageInfo?.description || 'Please wait...'}
          </p>
        </div>

        {/* Stage Timeline */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    index < currentStage || isComplete
                      ? 'bg-primary-green text-white'
                      : index === currentStage
                        ? 'bg-primary-blue text-white animate-pulse'
                        : 'bg-white/20 text-white/50'
                  }`}
                >
                  {index < currentStage || isComplete ? '✓' : index + 1}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`h-1 w-8 transition-all ${
                      index < currentStage || isComplete ? 'bg-primary-green' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stage Details (Mobile-friendly) */}
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`rounded-lg p-2 text-center transition-all ${
                index === currentStage && !isComplete
                  ? 'bg-primary-blue/20 border border-primary-blue/50'
                  : index < currentStage || isComplete
                    ? 'bg-primary-green/20 border border-primary-green/50'
                    : 'bg-white/10 border border-white/20'
              }`}
            >
              <div
                className={`font-bold ${
                  index === currentStage && !isComplete
                    ? 'text-primary-blue'
                    : index < currentStage || isComplete
                      ? 'text-primary-green'
                      : 'text-white/70'
                }`}
              >
                {stage.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Predefined stages for book recommendations - mobile optimized
export const BOOK_RECOMMENDATION_STAGES: LoadingStage[] = [
  {
    id: 'analysis',
    title: '🧠 Analyzing Request',
    description: 'Understanding your mood and preferences...',
    duration: 10, // Longer durations for mobile network reality
  },
  {
    id: 'enrichment',
    title: '🔍 Enriching Context',
    description: 'Gathering additional context and references...',
    duration: 8,
  },
  {
    id: 'recommendations',
    title: '📚 Finding Perfect Matches',
    description: 'AI is curating personalized book recommendations...',
    duration: 15,
  },
];