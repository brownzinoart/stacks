/**
 * AI Prompt Input component - Ultra Bold Gen Z Design
 * Enhanced book discovery with rotating placeholder examples
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  // Refs to track timeouts and intervals for cleanup
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef<boolean>(false); // Track loading state to avoid stale closures
  

  // Enhanced cleanup function to cancel requests and clear timeouts
  const cleanup = useCallback(() => {
    console.log('🧹 [CLEANUP] Performing comprehensive cleanup');
    aiRecommendationService.cancel();
    
    // Clear all pending timeouts
    timeoutsRef.current.forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutsRef.current = [];
    
    // Clear example rotation interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset all loading states to initial values
  const resetLoadingStates = useCallback(() => {
    console.log('🔄 [RESET] Resetting all loading states to initial values');
    console.trace('🔍 [RESET] Stack trace for reset call');
    isLoadingRef.current = false; // Reset ref too
    setIsLoading((prev) => {
      console.log('📊 [STATE] setIsLoading(false) called - prev:', prev, '-> new: false');
      return false;
    });
    setCurrentStage(0);
    setProgress(0);
    setShowError(false);
    setErrorMessage('');
    setUserQuery('');
    setCostSavings('~65%');
  }, []);

  // Enhanced mount/unmount lifecycle management with proper state reset
  useEffect(() => {
    setIsMounted(true);
    
    // Always reset loading states on mount to handle navigation back scenarios
    resetLoadingStates();
    
    // Check for pending search from results page and set input value
    if (typeof window !== 'undefined') {
      const pendingSearch = sessionStorage.getItem('pendingSearch');
      if (pendingSearch) {
        console.log('🔍 [MOUNT] Found pending search:', pendingSearch);
        sessionStorage.removeItem('pendingSearch');
        setInputValue(pendingSearch);
        
        // Set a flag to trigger search after handleSubmit is available
        sessionStorage.setItem('triggerSearch', 'true');
      }
      
      
      const hasRecommendations = localStorage.getItem('stacks_recommendations');
      if (hasRecommendations) {
        console.log('🗑️ [MOUNT] Clearing stale recommendations state');
        // Don't remove the data, just reset the component state
      }
    }
    
    return () => {
      console.log('🔄 [LIFECYCLE] Component unmounting');
      setIsMounted(false);
      cleanup();
    };
  }, [cleanup, resetLoadingStates]);

  // Reset states when coming back from navigation (popstate/focus events)
  useEffect(() => {
    const handlePageFocus = () => {
      console.log('👁️ [FOCUS] Page gained focus - resetting states for fresh search');
      resetLoadingStates();
    };

    const handlePopState = () => {
      console.log('🔙 [POPSTATE] User navigated back - resetting states');
      resetLoadingStates();
    };

    window.addEventListener('focus', handlePageFocus);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('focus', handlePageFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resetLoadingStates]);

  // Rotate through examples every 3 seconds with proper cleanup
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      if (!isMounted) return; // Guard against state updates after unmount
      
      setIsExampleVisible(false);
      const fadeTimeout = setTimeout(() => {
        if (!isMounted) return;
        setCurrentExampleIndex((prev) => (prev + 1) % discoveryExamples.length);
        setIsExampleVisible(true);
      }, 300); // Fade out duration
      
      // Track the timeout for cleanup
      timeoutsRef.current.push(fadeTimeout);
    }, 3000);
    
    intervalRef.current = interval;

    return () => {
      clearInterval(interval);
      intervalRef.current = null;
    };
  }, [isMounted]);

  // Enhanced progress callback with better timeout management
  const handleProgress = useCallback((stage: number, progressPercent: number = 0) => {
    if (!isMounted) return; // Prevent updates after unmount
    
    console.log(`🎯 PROGRESS UPDATE: Stage ${stage} - ${progressPercent}% - ${ENHANCED_LOADING_STAGES[stage]?.title || 'Unknown'}`);
    setCurrentStage(stage);
    setProgress(progressPercent);
    
    // Auto-timeout protection - if we're stuck at a stage too long, show error
    const stageTimeout = setTimeout(() => {
      if (!isMounted) return; // Guard against state updates after unmount
      
      // Only timeout if we're still on the same stage and still loading
      setIsLoading(prevLoading => {
        if (prevLoading) {
          setCurrentStage(prevStage => {
            if (prevStage === stage) {
              // We're stuck on this stage, timeout
              setErrorMessage('Request is taking longer than expected. This might be due to slow internet. Please try again.');
              setShowError(true);
              setCurrentStage(0);
              setProgress(0);
              cleanup();
              return 0;
            }
            return prevStage;
          });
          return false;
        }
        return prevLoading;
      });
    }, 90000); // 90 second timeout per stage for mobile
    
    // Track timeout for cleanup
    timeoutsRef.current.push(stageTimeout);
  }, [isMounted, cleanup]);

  // Enhanced cancel handler with comprehensive state reset
  const handleCancel = useCallback(() => {
    console.log('❌ [CANCEL] User cancelled search');
    cleanup();
    resetLoadingStates();
  }, [cleanup, resetLoadingStates]);

  // Enhanced submit handler with better state management and race condition prevention
  const handleSubmit = useCallback(async (e: React.FormEvent, forceRefresh: boolean = false) => {
    e.preventDefault();
    // Debug: console.log('🎯 [SUBMIT] handleSubmit called with inputValue:', inputValue, 'selectedMood:', selectedMood);
    // Debug: console.log('📊 [SUBMIT] Current loading state:', isLoading, 'isLoadingRef:', isLoadingRef.current);
    
    // Prevent multiple concurrent requests using ref to avoid stale closure
    if (isLoadingRef.current) {
      console.log('⚠️ [SUBMIT] Request already in progress, ignoring');
      return;
    }

    // Show error feedback if no input
    if (!inputValue && !selectedMood) {
      console.log('❌ [SUBMIT] No input or mood selected, showing error');
      setShowError(true);
      setErrorMessage('Please select a mood or enter what you\'re looking for!');
      // Shake animation for the input
      const inputEl = document.querySelector('.search-input-container');
      if (inputEl) {
        inputEl.classList.add('animate-shake');
        const shakeTimeout = setTimeout(() => {
          inputEl.classList.remove('animate-shake');
        }, 500);
        timeoutsRef.current.push(shakeTimeout);
      }
      // Clear error after 3 seconds
      const errorTimeout = setTimeout(() => {
        if (isMounted) setShowError(false);
      }, 3000);
      timeoutsRef.current.push(errorTimeout);
      return;
    }

    // Ensure clean state before starting new request
    cleanup();
    // DON'T reset loading states here - we're about to set them!
    // resetLoadingStates();  // REMOVED - this was resetting isLoading to false
    
    // Initialize loading state
    // Debug: console.log('🚀 [SUBMIT] Setting isLoading to TRUE - starting search');
    // Debug: console.log('🔍 [SUBMIT] User input will be:', inputValue || selectedMood || '(empty)');
    isLoadingRef.current = true; // Set ref immediately
    setIsLoading((prev) => {
      console.log('📊 [STATE] setIsLoading called - prev:', prev, '-> new: true');
      return true;
    });
    setCurrentStage(0);
    setProgress(0);
    setCostSavings('~65%');

    const userInput = inputValue || selectedMood || '';
    // Debug: console.log('🎬 [SUBMIT] userInput set to:', userInput);
    setUserQuery(userInput); // Store for display in full takeover loader
    
    // Force a re-render to ensure the loader shows
    // Debug: console.log('🔄 [SUBMIT] Loading state should now be true, triggering overlay');
    const inputType = detectInputType(userInput);
    

    // Set up overall timeout protection (120 seconds total for mobile) with proper state checks
    const overallTimeout = setTimeout(() => {
      if (!isMounted) return; // Prevent state updates after unmount
      
      setIsLoading(prevLoading => {
        if (prevLoading) {
          console.log('⏱️ [TIMEOUT] Overall request timeout reached');
          cleanup();
          setCurrentStage(0);
          setProgress(0);
          setUserQuery('');
          setErrorMessage('Request timed out. This might be due to slow internet. Please try again.');
          setShowError(true);
          return false;
        }
        return prevLoading;
      });
    }, 120000);
    
    // Track timeout for cleanup
    timeoutsRef.current.push(overallTimeout);

    try {
      // Track when we started loading
      const startTime = Date.now();
      
      // Ensure loading state is visible before starting the request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await aiRecommendationService.getSmartRecommendations({
        userInput,
        forceRefresh,
        onProgress: handleProgress,
      });

      clearTimeout(overallTimeout);
      
      if (!isMounted) return; // Prevent state updates after unmount
      
      // Show cost savings info
      const savings = ((0.03 - (result.cost / 1000)) * 1000 * 100).toFixed(0); // Estimate vs GPT-4 only
      setCostSavings(`Optimized routing saved ~${savings}% vs single model`);

      // Final progress update
      setCurrentStage(3);
      setProgress(100);
      
      // Ensure minimum display time for overlay (2 seconds total)
      const elapsedTime = Date.now() - startTime;
      const minDisplayTime = 2000;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      console.log(`⏱️ [TIMING] Search completed in ${elapsedTime}ms, waiting ${remainingTime}ms more`);
      
      // Wait for minimum display time before navigating
      const completionTimeout = setTimeout(async () => {
        if (!isMounted) return;
        
        isLoadingRef.current = false; // Reset ref
        setIsLoading(false);

        // Store recommendations and navigate
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('stacks_recommendations', JSON.stringify(result));
            console.log('✅ [SUCCESS] Recommendations saved, navigating to results');
            router.push('/stacks-recommendations');
          } catch (storageError) {
            console.error('💾 [STORAGE ERROR] Failed to save recommendations:', storageError);
            if (isMounted) {
              setErrorMessage('Failed to save recommendations. Please try again.');
              setShowError(true);
              setIsLoading(false);
            }
          }
        }
      }, remainingTime + 500); // Add extra 500ms to show completion state
      
      timeoutsRef.current.push(completionTimeout);
    } catch (error: any) {
      clearTimeout(overallTimeout);
      
      if (!isMounted) return; // Prevent state updates after unmount
      
      console.error('❌ [ERROR] Search failed:', error);
      
      isLoadingRef.current = false; // Reset ref
      resetLoadingStates();
      
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
        console.log('🚨 [FALLBACK] Using emergency fallback for:', userInput);
        const fallbackData = formatFallbackRecommendations(userInput);
        
        // Store fallback data and navigate
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('stacks_recommendations', JSON.stringify(fallbackData));
            console.log('🚨 [FALLBACK] Emergency fallback data stored');
            router.push('/stacks-recommendations');
            return; // Exit early after successful fallback
          } catch (storageError) {
            console.error('🚨 [FALLBACK ERROR] Failed to store fallback data:', storageError);
          }
        }
      }
      
      if (isMounted) {
        setErrorMessage(errorMsg);
        setShowError(true);
        
        // Clear error after 10 seconds (longer for mobile users to read)
        const errorTimeout = setTimeout(() => {
          if (isMounted) setShowError(false);
        }, 10000);
        timeoutsRef.current.push(errorTimeout);
      }
    }
  }, [
    inputValue, 
    selectedMood, 
    isMounted, 
    cleanup, 
    resetLoadingStates, 
    handleProgress, 
    router
  ]); // Removed isLoading and timeoutsRef from deps to avoid stale closure

  // Handle pending search trigger after handleSubmit is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldTrigger = sessionStorage.getItem('triggerSearch');
      if (shouldTrigger === 'true' && inputValue && isMounted) {
        console.log('🚀 [AUTO-SEARCH] Triggering pending search for:', inputValue);
        sessionStorage.removeItem('triggerSearch');
        
        // Delay to ensure component is fully rendered
        setTimeout(() => {
          if (isMounted && inputValue) {
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            handleSubmit(fakeEvent);
          }
        }, 1000);
      }
    }
  }, [inputValue, isMounted, handleSubmit]);

  const handleMoodSelect = (mood: string) => {
    console.log('🎭 [MOOD] Mood selected:', mood);
    const isSelecting = selectedMood !== mood;
    setSelectedMood(selectedMood === mood ? null : mood);
    setInputValue(''); // Clear text input when mood is selected
    
    // AUTO-TRIGGER SEARCH FOR TESTING - REMOVED DUE TO RACE CONDITION
    // Users should click the submit button after selecting a mood
    // If you want auto-submit, uncomment the code below and increase timeout
    /*
    if (isSelecting) { // Only trigger if mood is being selected, not deselected
      setTimeout(() => {
        console.log('🚀 [AUTO] Auto-triggering search after mood selection');
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(fakeEvent);
      }, 500); // Increased timeout to allow state to settle
    }
    */
  };

  const handleLibraryCheck = (bookId: number) => {
    // TODO: Implement library availability check
    console.log('Checking library availability for book:', bookId);
  };

  return (
    <div className="relative space-y-6 sm:space-y-8">
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
