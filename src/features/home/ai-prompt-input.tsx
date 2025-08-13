'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { aiRecommendationService } from '@/lib/ai-recommendation-service'
import FullTakeoverLoader, { ENHANCED_LOADING_STAGES } from '@/components/full-takeover-loader'
import { hapticFeedback, isMobile } from '@/lib/mobile-utils'

const MOOD_OPTIONS = [
  { mood: 'adventurous', label: '🗺️ Adventurous', color: 'bg-primary-orange' },
  { mood: 'romantic', label: '💝 Romantic', color: 'bg-primary-pink' },
  { mood: 'mysterious', label: '🔍 Mysterious', color: 'bg-primary-purple' },
  { mood: 'funny', label: '😂 Funny', color: 'bg-primary-yellow' },
  { mood: 'inspiring', label: '✨ Inspiring', color: 'bg-primary-teal' },
  { mood: 'thrilling', label: '⚡ Thrilling', color: 'bg-primary-blue' },
]

export default function AIPromptInput() {
  // Simple state management - no complex refs or race conditions
  const [inputValue, setInputValue] = useState('')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  // Clear error when user interacts
  const clearError = useCallback(() => {
    if (error) setError(null)
  }, [error])

  // Handle mood selection
  const handleMoodClick = useCallback(async (mood: string) => {
    clearError()
    setSelectedMood(mood)
    if (isMobile()) await hapticFeedback('medium')
    
    // Automatically start search when mood is selected
    startSearch(mood)
  }, [clearError])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    const searchQuery = inputValue.trim()
    if (!searchQuery) return
    
    startSearch(searchQuery)
  }, [inputValue, clearError])

  // Single, clean search function
  const startSearch = useCallback(async (query: string) => {
    if (isLoading) return // Prevent double submissions
    
    console.log('🔍 [NEW AI SEARCH] Starting search for:', query)
    
    setIsLoading(true)
    setCurrentStage(0)
    setProgress(0)
    setError(null)

    try {
      // Single timeout - let AI complete its work (21-22 seconds + network)
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Search timed out after 90 seconds')), 90000)
      )

      // Progress callback for loading stages
      const onProgress = (stage: number, progressValue: number) => {
        console.log(`📊 [SEARCH PROGRESS] Stage ${stage}, Progress: ${progressValue}%`)
        setCurrentStage(stage)
        setProgress(progressValue)
      }

      // Call AI service with proper progress tracking
      const aiPromise = aiRecommendationService.getSmartRecommendations({
        userInput: query,
        onProgress: (stage: number, progress?: number) => onProgress(stage, progress || 0)
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

      // Store result and navigate
      localStorage.setItem('stacks_recommendations', JSON.stringify(result))
      console.log('💾 [SEARCH] Results stored, navigating to recommendations page')
      
      router.push('/stacks-recommendations')

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
      
    } finally {
      setIsLoading(false)
      setCurrentStage(0)
      setProgress(0)
    }
  }, [isLoading, router])

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
      <div className="w-full max-w-2xl space-y-6">
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
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                clearError()
              }}
              placeholder="What books are you in the mood for? (e.g., 'books like Harry Potter' or 'mystery novels set in Japan')"
              className="w-full rounded-3xl border-2 border-gray-200 px-8 py-6 text-xl font-bold placeholder-gray-400 focus:border-primary-blue focus:outline-none focus:ring-4 focus:ring-primary-blue/20 transition-all shadow-[0_4px_15px_rgb(0,0,0,0.05)] focus:shadow-[0_8px_25px_rgb(0,0,0,0.1)]"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-full rounded-3xl bg-primary-blue px-8 py-6 text-xl font-black text-white transition-all hover:bg-blue-600 hover:scale-[1.02] disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary-blue/20 shadow-[0_10px_40px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] disabled:shadow-none"
          >
            {isLoading ? 'Searching...' : 'Find My Next Read'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t-2 border-text-primary/20" />
          <span className="mx-6 text-base font-black text-text-primary bg-bg-light px-4">OR CHOOSE A MOOD</span>
          <div className="flex-grow border-t-2 border-text-primary/20" />
        </div>

        {/* Mood Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {MOOD_OPTIONS.map(({ mood, label, color }) => (
            <button
              key={mood}
              onClick={() => handleMoodClick(`I'm feeling ${mood} today, recommend me some books`)}
              disabled={isLoading}
              className={`${color} rounded-2xl px-6 py-4 text-base font-black text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-current/20 shadow-[0_8px_25px_rgb(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.2)]`}
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