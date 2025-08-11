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

const ENHANCED_LOADING_STAGES: LoadingStage[] = [
  {
    id: 'analyzing',
    title: 'ANALYZING REQUEST',
    description: 'Understanding your mood and preferences...',
    duration: 4,
    color: 'from-blue-500 to-teal-500',
    icon: '🧠'
  },
  {
    id: 'enriching',
    title: 'ENRICHING CONTEXT', 
    description: 'Gathering additional context and references...',
    duration: 3,
    color: 'from-purple-500 to-pink-500',
    icon: '🔍'
  },
  {
    id: 'matching',
    title: 'FINDING PERFECT MATCHES',
    description: 'AI is curating personalized recommendations...',
    duration: 8,
    color: 'from-green-500 to-yellow-500',
    icon: '📚'
  },
  {
    id: 'fetching_covers',
    title: 'FETCHING BOOK COVERS',
    description: 'Loading beautiful cover images for all recommendations...',
    duration: 3,
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

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

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

  if (!mounted || !isVisible) return null

  const LoaderContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      {/* Main Loading Container */}
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        
        {/* Current Stage Icon & Title */}
        <div className="space-y-4">
          <div className={`text-6xl ${showPulse ? 'animate-pulse' : ''} transition-all duration-500`}>
            {currentStageData?.icon}
          </div>
          
          <h2 
            id="loading-title"
            className="text-2xl md:text-3xl font-bold text-white tracking-tight"
          >
            {currentStageData?.title}
          </h2>
          
          <p 
            id="loading-description"
            className="text-lg text-white/80 leading-relaxed"
          >
            {currentStageData?.description}
          </p>

          {userQuery && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6">
              <p className="text-sm text-white/70 mb-1">Searching for:</p>
              <p className="text-white font-medium">&quot;{userQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div 
            className="h-3 bg-white/20 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading progress: ${progress}% complete`}
          >
            <div 
              className={`h-full bg-gradient-to-r ${currentStageData?.color || 'from-blue-400 to-blue-600'} rounded-full transition-all duration-300 ease-out relative`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">{progress}% Complete</span>
            <span className="text-white/60">~{Math.max(15 - Math.floor(progress * 0.15), 0)}s remaining</span>
          </div>
        </div>

        {/* Stage Progress Indicators */}
        <div className="flex items-center justify-center space-x-4">
          {ENHANCED_LOADING_STAGES.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div 
                className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${index < currentStage 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index === currentStage 
                      ? `bg-gradient-to-r ${stage.color} border-white text-white animate-pulse`
                      : 'bg-white/10 border-white/30 text-white/50'
                  }
                `}
                aria-label={`Stage ${index + 1}: ${stage.title} ${index < currentStage ? 'completed' : index === currentStage ? 'in progress' : 'pending'}`}
              >
                {index < currentStage ? '✓' : index + 1}
              </div>
              
              {index < ENHANCED_LOADING_STAGES.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                  index < currentStage ? 'bg-green-500' : 'bg-white/20'
                }`} />
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

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="text-white/60 hover:text-white/80 text-sm font-medium transition-colors duration-200 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded px-2 py-1"
          aria-label="Cancel book recommendation request"
        >
          Cancel Request
        </button>
      </div>
    </div>
  )

  // Use portal to render at document body level for true full-screen overlay
  return createPortal(LoaderContent, document.body)
}

export { ENHANCED_LOADING_STAGES }
export type { LoadingStage }