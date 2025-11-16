'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface LoadingStage {
  id: string
  title: string
  description: string
  duration: number
  color: string
  icon: string
}

interface FullTakeoverLoaderProps {
  isVisible: boolean
  currentStage: number
  stages: LoadingStage[]
  progress: number // 0-100
  costSavings?: string
  onCancel: () => void
  userQuery?: string
}

export const ENHANCED_LOADING_STAGES: LoadingStage[] = [
  {
    id: 'analyzing',
    title: 'ANALYZING REQUEST',
    description: 'Understanding your mood and preferences with progressive fallback...',
    duration: 1, // Fast stage with intelligent fallback
    color: 'from-blue-500 to-teal-500',
    icon: '🧠'
  },
  {
    id: 'enriching',
    title: 'ENRICHING CONTEXT', 
    description: 'Gathering additional context and references...',
    duration: 1, // Context gathering remains fast
    color: 'from-purple-500 to-pink-500',
    icon: '🔍'
  },
  {
    id: 'matching',
    title: 'FINDING PERFECT MATCHES',
    description: 'AI is using smart routing to find your ideal books...',
    duration: 2, // May take longer but has fallback lanes
    color: 'from-green-500 to-yellow-500',
    icon: '📚'
  },
  {
    id: 'finalizing',
    title: 'FETCHING BOOK COVERS',
    description: 'Loading real book covers for your recommendations...',
    duration: 1.5, // Slightly longer to fetch covers
    color: 'from-orange-500 to-red-500',
    icon: '🎨'
  }
]

export default function FullTakeoverLoader({
  isVisible,
  currentStage,
  progress,
  costSavings = "~65%",
  onCancel,
  userQuery
}: FullTakeoverLoaderProps) {
  const [mounted, setMounted] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  
  console.log('🎬 [LOADER] FullTakeoverLoader rendered - isVisible:', isVisible, 'mounted:', mounted, 'currentStage:', currentStage)

  useEffect(() => {
    console.log('🎬 [LOADER] Mount effect running - setting mounted to true');
    setMounted(true)
    return () => {
      console.log('🎬 [LOADER] Unmount effect running - setting mounted to false');
      setMounted(false)
    }
  }, [])
  
  // Additional debugging for mount state
  useEffect(() => {
    console.log('🎬 [LOADER] Mount state changed - mounted:', mounted);
  }, [mounted])

  useEffect(() => {
    if (!isVisible) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isVisible, onCancel])

  const currentStageData = ENHANCED_LOADING_STAGES[currentStage] ?? ENHANCED_LOADING_STAGES[0]

  console.log('🎬 [LOADER] Render check - mounted:', mounted, 'isVisible:', isVisible, 'will render:', mounted && isVisible)
  
  // Fix SSR issue - only render on client side
  if (!isVisible || typeof window === 'undefined') return null

  const LoaderContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
      style={{ animation: 'backdropPulse 3s ease-in-out infinite' }}
    >
      {/* Main Loading Container */}
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        
        {/* Enhanced Stage Icon & Title */}
        <div className="space-y-4">
          <div className="relative">
            <div className={`text-7xl ${showPulse ? 'animate-pulse' : ''} transition-all duration-500 relative z-10`}>
              {currentStageData?.icon}
            </div>
            {/* Glow effect behind icon */}
            <div className={`absolute inset-0 text-7xl blur-xl opacity-30 ${currentStageData?.color ? `text-gradient bg-gradient-to-r ${currentStageData.color}` : ''} transition-all duration-500`}>
              {currentStageData?.icon}
            </div>
          </div>
          
          <h2 
            id="loading-title"
            className="text-2xl md:text-3xl font-black text-white tracking-tight animate-fade-in-up"
          >
            {currentStageData?.title}
          </h2>
          
          <p 
            id="loading-description"
            className="text-lg text-white/90 leading-relaxed font-medium animate-fade-in-up animation-delay-200"
          >
            {currentStageData?.description}
          </p>

          {userQuery && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6 border border-white/20 animate-fade-in-up animation-delay-400">
              <p className="text-sm text-white/70 mb-2 font-medium">Searching for:</p>
              <p className="text-white font-bold text-base">&quot;{userQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="space-y-3">
          <div 
            className="h-4 bg-white/20 rounded-full overflow-hidden relative border border-white/30"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading progress: ${progress}% complete`}
          >
            <div 
              className={`h-full bg-gradient-to-r ${currentStageData?.color || 'from-blue-400 to-blue-600'} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full"></div>
              {/* Moving highlight */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"
                style={{
                  animation: 'progressShine 2s ease-in-out infinite',
                  backgroundSize: '200% 100%'
                }}
              ></div>
            </div>
            {/* Glow effect */}
            <div 
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentStageData?.color || 'from-blue-400 to-blue-600'} rounded-full opacity-50 blur-sm transition-all duration-500`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/80 font-medium">{progress}% Complete</span>
            <span className="text-white/60">~{Math.max(15 - Math.floor(progress * 0.15), 0)}s remaining</span>
          </div>
        </div>

        {/* Enhanced Stage Progress Indicators */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4">
          {ENHANCED_LOADING_STAGES.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div 
                className={`
                  relative w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-500 ease-out
                  ${index < currentStage 
                    ? 'bg-green-500 border-green-400 text-white scale-110' 
                    : index === currentStage 
                      ? `bg-gradient-to-r ${stage.color} border-white text-white scale-125 shadow-lg`
                      : 'bg-white/10 border-white/30 text-white/50 scale-100'
                  }
                `}
                aria-label={`Stage ${index + 1}: ${stage.title} ${index < currentStage ? 'completed' : index === currentStage ? 'in progress' : 'pending'}`}
              >
                {/* Completion checkmark */}
                {index < currentStage && (
                  <span className="text-lg animate-bounce">✓</span>
                )}
                
                {/* Current stage with pulsing ring */}
                {index === currentStage && (
                  <>
                    <span className="text-base font-black">{index + 1}</span>
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                  </>
                )}
                
                {/* Future stages */}
                {index > currentStage && (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              
              {/* Enhanced connectors */}
              {index < ENHANCED_LOADING_STAGES.length - 1 && (
                <div className="flex items-center mx-2">
                  <div 
                    className={`w-6 h-1 rounded-full transition-all duration-500 ${
                      index < currentStage 
                        ? 'bg-green-500 shadow-md' 
                        : index === currentStage - 1
                          ? `bg-gradient-to-r ${ENHANCED_LOADING_STAGES[index + 1]?.color || 'from-blue-400 to-blue-600'}`
                          : 'bg-white/20'
                    }`} 
                  />
                  {/* Flow animation for active connector */}
                  {index === currentStage - 1 && (
                    <div 
                      className="absolute w-2 h-1 bg-white rounded-full opacity-80"
                      style={{
                        animation: 'flowRight 1.5s ease-in-out infinite',
                        marginLeft: '-12px'
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cost Optimization Message */}
        {costSavings && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">💰</span>
              <p className="text-green-400 font-medium">
                Optimized routing saved {costSavings} vs single model
              </p>
            </div>
          </div>
        )}

        {/* Cancel Button - Enhanced visibility and accessibility */}
        <button
          onClick={onCancel}
          className="mt-4 flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-all duration-200 underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-white/30 focus:rounded-lg px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
          aria-label="Cancel book recommendation request"
        >
          <span className="text-lg">✕</span>
          Cancel Request
        </button>
      </div>
    </div>
  )

  // Use portal to render at document body level for true full-screen overlay
  return createPortal(LoaderContent, document.body)
}

export type { LoadingStage }