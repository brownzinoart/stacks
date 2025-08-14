'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnimatedPlaceholderProps {
  examples: string[]
  isActive: boolean // false when user is typing or input has focus
  className?: string
  duration?: number // total cycle duration, default 3000ms
  animationDuration?: number // enter/exit animation duration, default 400ms
}

export default function AnimatedPlaceholder({
  examples,
  isActive,
  className = '',
  duration = 3000,
  animationDuration = 400
}: AnimatedPlaceholderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(true)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldAnimate(!mediaQuery.matches)
    
    const handleChange = () => setShouldAnimate(!mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Handle cycling through examples
  const cycleToNext = useCallback(() => {
    if (!isActive || examples.length <= 1) return

    if (shouldAnimate) {
      // Animate out
      setIsVisible(false)
      
      setTimeout(() => {
        // Change text while invisible
        setCurrentIndex((prev) => (prev + 1) % examples.length)
        // Animate in
        setIsVisible(true)
      }, animationDuration)
    } else {
      // No animation, just change text
      setCurrentIndex((prev) => (prev + 1) % examples.length)
    }
  }, [isActive, examples.length, shouldAnimate, animationDuration])

  // Set up cycling interval
  useEffect(() => {
    if (!isActive || examples.length <= 1) return

    const holdDuration = duration - (shouldAnimate ? animationDuration * 2 : 0)
    const interval = setInterval(cycleToNext, duration)

    return () => clearInterval(interval)
  }, [isActive, examples.length, duration, shouldAnimate, animationDuration, cycleToNext])

  // Reset to first example and show when becoming active
  useEffect(() => {
    if (isActive) {
      setCurrentIndex(0)
      setIsVisible(true)
    }
  }, [isActive])

  if (!isActive || examples.length === 0) {
    return null
  }

  const currentExample = examples[currentIndex] || examples[0]

  const animationClasses = shouldAnimate
    ? `transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2'
      }`
    : ''

  return (
    <div
      className={`absolute inset-0 flex items-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <span
        className={`pl-4 text-base sm:pl-6 sm:text-lg md:pl-8 md:text-xl font-bold text-gray-500 ${animationClasses} truncate max-w-full`}
        style={{
          // Ensure consistent positioning with input text
          lineHeight: '1.5'
        }}
      >
        {currentExample}
      </span>
    </div>
  )
}