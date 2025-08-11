/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { aiRecommendationService } from '@/lib/ai-recommendation-service';
import FullTakeoverLoader, { ENHANCED_LOADING_STAGES } from '@/components/full-takeover-loader';
import { formatFallbackRecommendations } from '@/lib/emergency-fallback';

// Simplified mood options for better UX
const moodOptions = [
  { label: 'FUNNY', color: 'bg-primary-orange hover:bg-primary-pink', emoji: '😂' },
  { label: 'MIND-BLOWING', color: 'bg-primary-yellow hover:bg-primary-teal', emoji: '🤯' },
  { label: 'LOVE STORY', color: 'bg-primary-pink hover:bg-primary-purple', emoji: '💕' },
  { label: 'MAGICAL', color: 'bg-primary-purple hover:bg-primary-blue', emoji: '✨' },
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

// Smart input detection - unified approach
const detectInputType = (input: string): 'mood' | 'comparison' | 'topic' | 'general' => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('like') && (lowerInput.includes('movie') || lowerInput.includes('show') || lowerInput.includes('tv'))) {
    return 'comparison';
  }
  if (lowerInput.includes('funny') || lowerInput.includes('sad') || lowerInput.includes('scary') || lowerInput.includes('romantic')) {
    return 'mood';
  }
  if (lowerInput.includes('learn') || lowerInput.includes('about') || lowerInput.includes('understand')) {
    return 'topic';
  }
  return 'general';
};

// Legacy function removed - now using optimized AI recommendation service

// Legacy helper functions removed - now handled by AI recommendation service

export const AIPromptInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isExampleVisible, setIsExampleVisible] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [costSavings, setCostSavings] = useState<string>('~65%');
  const [userQuery, setUserQuery] = useState('');
  const router = useRouter();
  
  // DEBUG: Version indicator
  console.log('🚀🚀🚀 AI PROMPT INPUT v2.0 - ENHANCED LOADING STAGES ACTIVE 🚀🚀🚀');
  console.log('📊 Loading stages available:', ENHANCED_LOADING_STAGES.length, 'stages');
  console.log('📊 Stages:', ENHANCED_LOADING_STAGES.map(s => s.title).join(' → '));

  // Cleanup function to cancel requests
  const cleanup = useCallback(() => {
    aiRecommendationService.cancel();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

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

  // Progress callback for loading stages with progress percentage
  const handleProgress = useCallback((stage: number, progressPercent: number = 0) => {
    console.log(`🎯 PROGRESS UPDATE: Stage ${stage} - ${progressPercent}% - ${ENHANCED_LOADING_STAGES[stage]?.title || 'Unknown'}`);
    setCurrentStage(stage);
    setProgress(progressPercent);
    
    // Auto-timeout protection - if we're stuck at a stage too long, show error
    const stageTimeout = setTimeout(() => {
      if (stage === currentStage && isLoading) {
        setErrorMessage('Request is taking longer than expected. This might be due to slow internet. Please try again.');
        setShowError(true);
        setIsLoading(false);
        setCurrentStage(0);
        setProgress(0);
        cleanup();
      }
    }, 90000); // 90 second timeout per stage for mobile
    
    // Clear timeout on next progress update
    return () => clearTimeout(stageTimeout);
  }, [currentStage, isLoading, cleanup]);

  // Cancel handler for full takeover loader
  const handleCancel = useCallback(() => {
    cleanup();
    setIsLoading(false);
    setCurrentStage(0);
    setProgress(0);
    setUserQuery('');
  }, [cleanup]);

  // Optimized submit handler with new AI service
  const handleSubmit = async (e: React.FormEvent, forceRefresh: boolean = false) => {
    e.preventDefault();

    // Show error feedback if no input
    if (!inputValue && !selectedMood) {
      setShowError(true);
      setErrorMessage('Please select a mood or enter what you\'re looking for!');
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
    setCurrentStage(0);
    setProgress(0);
    setCostSavings('~65%');

    const userInput = inputValue || selectedMood || '';
    setUserQuery(userInput); // Store for display in full takeover loader
    const inputType = detectInputType(userInput);
    
    console.log('🔥🔥🔥 SEARCH STARTED 🔥🔥🔥');
    console.log('📝 User input:', userInput);
    console.log('🎬 Loading overlay should be visible now!');
    console.log('🎬 IsLoading:', true);
    console.log('🎬 Stages passed to loader:', ENHANCED_LOADING_STAGES);

    // Set up overall timeout protection (120 seconds total for mobile)
    const overallTimeout = setTimeout(() => {
      if (isLoading) {
        cleanup();
        setIsLoading(false);
        setCurrentStage(0);
        setProgress(0);
        setUserQuery('');
        setErrorMessage('Request timed out. This might be due to slow internet. Please try again.');
        setShowError(true);
      }
    }, 120000);

    try {
      const result = await aiRecommendationService.getSmartRecommendations({
        userInput,
        forceRefresh,
        onProgress: handleProgress,
      });

      clearTimeout(overallTimeout);
      
      // Show cost savings info
      const savings = ((0.03 - (result.cost / 1000)) * 1000 * 100).toFixed(0); // Estimate vs GPT-4 only
      setCostSavings(`Optimized routing saved ~${savings}% vs single model`);

      // Final progress update
      setCurrentStage(3);
      setProgress(100);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);

      // Store recommendations and navigate
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('stacks_recommendations', JSON.stringify(result));
          router.push('/stacks-recommendations');
        } catch (storageError) {
          setErrorMessage('Failed to save recommendations. Please try again.');
          setShowError(true);
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      clearTimeout(overallTimeout);
      setIsLoading(false);
      setCurrentStage(0);
      setProgress(0);
      setUserQuery('');
      
      // Enhanced error handling with specific mobile considerations
      let errorMsg = 'Something went wrong. Please try again.';
      if (error.message.includes('cancelled')) {
        errorMsg = 'Request was cancelled.';
      } else if (error.message.includes('timeout')) {
        errorMsg = error.message; // Use the mobile-specific timeout message from AI service
      } else if (error.message.includes('Network')) {
        errorMsg = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('Unable to generate')) {
        errorMsg = 'Unable to generate recommendations for this search. Try different keywords.';
      }
      
      // If network error or timeout, use emergency fallback
      if (error.message.includes('timeout') || error.message.includes('Network') || error.message.includes('fetch')) {
        console.log('[Mobile Debug] Using emergency fallback for:', userInput);
        const fallbackData = formatFallbackRecommendations(userInput);
        
        // Store fallback data and navigate
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('stacks_recommendations', JSON.stringify(fallbackData));
            console.log('[Mobile Debug] Emergency fallback data stored');
            router.push('/stacks-recommendations');
            return; // Exit early after successful fallback
          } catch (storageError) {
            console.error('[Mobile Debug] Failed to store fallback data:', storageError);
          }
        }
      }
      
      setErrorMessage(errorMsg);
      setShowError(true);
      
      // Clear error after 10 seconds (longer for mobile users to read)
      setTimeout(() => setShowError(false), 10000);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
    setInputValue(''); // Clear text input when mood is selected
  };

  const handleLibraryCheck = (bookId: number) => {
    // TODO: Implement library availability check
    console.log('Checking library availability for book:', bookId);
  };

  return (
    <div className="relative space-y-6 sm:space-y-8">
      {/* DEBUG VERSION INDICATOR */}
      <div className="fixed top-0 left-0 z-[10000] bg-red-600 text-white px-3 py-1 text-xs font-bold">
        v2.0 DEBUG | Stages: {ENHANCED_LOADING_STAGES.length} | Loading: {isLoading ? 'YES' : 'NO'} | Stage: {currentStage}
      </div>
      
      {/* Full Takeover Loading State with Icons */}
      <FullTakeoverLoader
        isVisible={isLoading}
        currentStage={currentStage}
        stages={ENHANCED_LOADING_STAGES}
        progress={progress}
        costSavings={costSavings}
        onCancel={handleCancel}
        userQuery={userQuery}
      />

      {!isLoading && (
        <>
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
              <span className="mr-2">{mood.emoji}</span>
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
              className="pop-element touch-feedback mobile-touch flex items-center justify-center rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-110 hover:bg-text-primary/90 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-6 sm:text-lg"
            >
              <span className="sm:hidden">Find Next Read</span>
              <span className="hidden sm:inline">→</span>
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
              <span className="sm:hidden">🔄</span>
              <span className="hidden sm:inline">🔄</span>
            </button>
          </div>

          {/* Error State (when not loading) */}
          {!isLoading && showError && (
            <div className="flex min-h-[60px] items-center justify-center">
              <div className="animate-fade-in-up text-center">
                <div className="text-sm font-bold text-red-600 mb-2">
                  {errorMessage || "Please select a mood or enter what you're looking for!"}
                </div>
                <button
                  onClick={() => setShowError(false)}
                  className="text-xs text-text-secondary hover:text-primary-blue transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

        </form>
          </div>
        </>
      )}
    </div>
  );
};
