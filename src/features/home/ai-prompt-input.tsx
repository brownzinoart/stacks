'use client'

import { useState, useCallback, useEffect } from 'react'
import { adaptiveAIService } from '@/lib/ai-service-adaptive'
import FullTakeoverLoader, { ENHANCED_LOADING_STAGES } from '@/components/full-takeover-loader'
import { hapticFeedback, isMobile } from '@/lib/mobile-utils'
import AnimatedPlaceholder from '@/components/animated-placeholder'
import { isCapacitor, navigateInIOS } from '@/lib/ios-navigation'

const MOOD_OPTIONS = [
  { mood: 'adventurous', label: '🗺️ Adventurous', color: 'bg-primary-orange' },
  { mood: 'romantic', label: '💝 Romantic', color: 'bg-primary-pink' },
  { mood: 'mysterious', label: '🔍 Mysterious', color: 'bg-primary-purple' },
  { mood: 'funny', label: '😂 Funny', color: 'bg-primary-yellow' },
  { mood: 'inspiring', label: '✨ Inspiring', color: 'bg-primary-teal' },
  { mood: 'surprise', label: '🎲 Surprise Me', color: 'bg-gradient-to-r from-primary-blue to-primary-purple' },
]

const PLACEHOLDER_EXAMPLES = [
  "What's your vibe? ✨",
  "Fantasy with strong leads",
  "Sci-fi like Dune but shorter",
  "Funny books for commute",
  "Books that make me cry",
  "Productivity guides",
  "Small town mysteries",
  "Romance without drama",
  "WWII historical fiction",
  "Entrepreneur self-help"
]

export default function AIPromptInput() {
  // Simple state management - no complex refs or race conditions
  const [inputValue, setInputValue] = useState('')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)


  // Determine if animated placeholder should be active
  const isPlaceholderActive = !isFocused && !inputValue.trim() && !isLoading

  // Clear error when user interacts
  const clearError = useCallback(() => {
    if (error) setError(null)
  }, [error])

  // Handle mood selection
  const handleMoodClick = useCallback(async (mood: string) => {
    console.log('🎭 [MOOD CLICK] Mood clicked:', mood)
    clearError()
    setSelectedMood(mood)
    if (isMobile()) await hapticFeedback('medium')
    
    // Handle surprise me differently
    if (mood === 'surprise') {
      console.log('🎲 [MOOD CLICK] Surprise mood, calling startSearch')
      startSearch('Surprise me with a great book recommendation')
    } else {
      console.log('😊 [MOOD CLICK] Regular mood, calling startSearch with:', `I'm feeling ${mood} today, recommend me some books`)
      // Automatically start search when mood is selected
      startSearch(`I'm feeling ${mood} today, recommend me some books`)
    }
  }, [clearError])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔥 [FORM SUBMIT] Form submitted with input:', inputValue)
    clearError()
    
    const searchQuery = inputValue.trim()
    if (!searchQuery) {
      console.log('❌ [FORM SUBMIT] Empty search query, returning')
      return
    }
    
    console.log('✅ [FORM SUBMIT] Valid query, calling startSearch:', searchQuery)
    startSearch(searchQuery)
  }, [inputValue, clearError])

  // Single, clean search function
  // Hide loading when navigating away (for successful searches)
  useEffect(() => {
    const handleRouteChange = () => {
      if (isLoading) {
        console.log('🔄 [NAVIGATION] Route changed, hiding loading overlay')
        setIsLoading(false)
        setCurrentStage(0)
        setProgress(0)
      }
    }

    // This effect will trigger when the component unmounts (navigation)
    return () => {
      handleRouteChange()
    }
  }, [isLoading])

  const startSearch = useCallback(async (query: string) => {
    console.log('🚀 [START SEARCH] Function called with query:', query)
    console.log('🚀 [START SEARCH] Current isLoading state:', isLoading)
    
    if (isLoading) {
      console.log('⚠️ [START SEARCH] Already loading, preventing double submission')
      return // Prevent double submissions
    }
    
    console.log('🔍 [NEW AI SEARCH] Starting search for:', query)
    
    setIsLoading(true)
    setCurrentStage(0)
    setProgress(0)
    setError(null)

    const startTime = Date.now()
    const MINIMUM_LOADING_TIME = 2000 // 2 seconds minimum display
    
    console.log('🔧 [SEARCH SETUP] Loading state set, starting try block')

    try {
      // Single timeout - let AI complete its work (21-22 seconds + network)
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Search timed out after 90 seconds')), 90000)
      )

      // Stage 1: Analyzing request
      setCurrentStage(0)
      setProgress(10)
      await new Promise(resolve => setTimeout(resolve, 500)) // Show stage briefly
      
      // Progress callback for loading stages
      const onProgress = (stage: number, progressValue: number) => {
        console.log(`📊 [SEARCH PROGRESS] Stage ${stage}, Progress: ${progressValue}%`)
        setCurrentStage(Math.min(stage + 1, ENHANCED_LOADING_STAGES.length - 1)) // Offset by 1
        setProgress(Math.max(progressValue, 25)) // Ensure progress never goes backwards
      }

      // Stage 2: AI search
      setCurrentStage(1)
      setProgress(25)

      // Call AI service with proper progress tracking
      const aiPromise = adaptiveAIService.getSmartRecommendations({
        userInput: query,
        onProgress: (stage: number, progress?: number) => onProgress(stage, progress || 25)
      })

      console.log('⏱️ [SEARCH] Waiting for AI response (up to 90 seconds)...')
      
      // Race between AI completion and timeout
      const result = await Promise.race([aiPromise, timeoutPromise])
      
      console.log('✅ [SEARCH SUCCESS] AI returned result:', {
        hasCategories: !!result?.categories,
        categoryCount: result?.categories?.length,
        categoryNames: result?.categories?.map(c => c.name)
      })

      // Validate result structure
      if (!result?.categories || !Array.isArray(result.categories) || result.categories.length === 0) {
        throw new Error('AI returned invalid result structure')
      }

      // Stage 3: Final processing & navigation
      setCurrentStage(ENHANCED_LOADING_STAGES.length - 1)
      setProgress(90)
      
      // Store result and navigate - ensure format matches expectations
      const storageData = {
        ...result,
        userInput: query,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('stacks_recommendations', JSON.stringify(storageData))
      console.log('💾 [SEARCH] Results stored, navigating to recommendations page')
      console.log('💾 [SEARCH] Stored data structure:', {
        hasCategories: !!storageData.categories,
        categoryCount: storageData.categories?.length,
        userInput: storageData.userInput
      })
      
      setProgress(100)
      
      // Ensure minimum loading time has passed
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime)
      
      if (remainingTime > 0) {
        console.log(`⏱️ [LOADER] Waiting ${remainingTime}ms to meet minimum display time`)
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      // Use static navigation for both iOS and web to avoid RSC issues
      if (isCapacitor()) {
        navigateInIOS('/stacks-recommendations')
      } else {
        // Use direct navigation for web too - avoids RSC payload issues
        window.location.href = '/stacks-recommendations'
      }

    } catch (error: any) {
      console.error('❌ [SEARCH ERROR]', error)
      
      // Simple error handling - no complex fallback chains
      let errorMessage = 'Search failed. Please try again.'
      
      if (error.message?.includes('timeout')) {
        errorMessage = 'Search timed out. Please try again or check your connection.'
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.'
      }
      
      setError(errorMessage)
      
      // Hide loading on error
      setIsLoading(false)
      setCurrentStage(0)
      setProgress(0)
      
    } finally {
      // Cleanup handled in catch block for errors, or after navigation for success
    }
  }, [isLoading])

  // Check for pending search from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingSearch = sessionStorage.getItem('pendingSearch')
      if (pendingSearch) {
        console.log('🔄 [PENDING SEARCH] Found pending search:', pendingSearch)
        sessionStorage.removeItem('pendingSearch') // Clear it immediately
        setInputValue(pendingSearch)
        // Auto-trigger the search
        startSearch(pendingSearch)
      }
    }
  }, [startSearch])

  return (
    <>
      {/* Loading Overlay */}
      <FullTakeoverLoader
        isVisible={isLoading}
        currentStage={currentStage}
        stages={ENHANCED_LOADING_STAGES}
        progress={progress}
        onCancel={() => {
          setIsLoading(false)
          setCurrentStage(0)
          setProgress(0)
        }}
        userQuery={inputValue || selectedMood || ''}
      />

      {/* Main Input Interface */}
      <div className="w-full space-y-6">
        {/* Error Display */}
        {error && (
          <div className="rounded-3xl bg-primary-orange/10 border border-primary-orange/20 p-6 text-center shadow-[0_8px_25px_rgb(0,0,0,0.1)]">
            <p className="text-primary-orange font-bold text-lg">{error}</p>
            <button
              onClick={clearError}
              className="mt-3 text-primary-orange hover:text-primary-orange/80 font-bold underline transition-all"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                clearError()
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="" // Handled by AnimatedPlaceholder
              className="w-full rounded-3xl border-2 border-white/30 bg-white/95 backdrop-blur-xl px-4 py-4 text-base sm:px-6 sm:py-5 sm:text-lg md:px-8 md:py-6 md:text-xl font-bold placeholder-gray-500 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] focus:shadow-[0_20px_40px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_4px_rgba(59,130,246,0.2)] focus:bg-white/98 focus:scale-[1.02] text-text-primary"
              disabled={isLoading}
            />
            <AnimatedPlaceholder
              examples={PLACEHOLDER_EXAMPLES}
              isActive={isPlaceholderActive}
              className="absolute inset-0"
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-full rounded-3xl bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink bg-size-200 px-8 py-6 text-xl font-black text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(102,126,234,0.4),0_0_40px_rgba(102,126,234,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-pulse-slow"
          >
            {isLoading ? 'Searching...' : 'Find My Next Read'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t-2 border-white/30" />
          <span className="mx-6 text-base font-black text-white px-4">OR CHOOSE A MOOD</span>
          <div className="flex-grow border-t-2 border-white/30" />
        </div>

        {/* Mood Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {MOOD_OPTIONS.map(({ mood, label, color }) => (
            <button
              key={mood}
              onClick={() => handleMoodClick(mood)}
              disabled={isLoading}
              className={`${color} rounded-2xl px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.2)] backdrop-blur-sm border-2 border-white/20 hover:border-white/40`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Selected Mood Display */}
        {selectedMood && (
          <div className="rounded-3xl bg-primary-blue/10 border border-primary-blue/20 p-6 text-center shadow-[0_4px_15px_rgb(0,0,0,0.05)]">
            <p className="text-primary-blue font-bold text-lg">
              Searching for: <span className="font-black">&ldquo;{selectedMood}&rdquo;</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}