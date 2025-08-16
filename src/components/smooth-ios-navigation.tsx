'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export interface SmoothNavigationProps {
  children: React.ReactNode
  className?: string
}

interface TransitionState {
  isTransitioning: boolean
  direction: 'left' | 'right' | 'fade' | null
  currentPath: string
  nextPath?: string
}

/**
 * Smooth iOS Navigation Wrapper
 * Provides smooth transitions between pages in Capacitor environment
 */
export const SmoothIOSNavigation: React.FC<SmoothNavigationProps> = ({ 
  children, 
  className = '' 
}) => {
  const pathname = usePathname()
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    direction: null,
    currentPath: pathname || '/home'
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const previousPathRef = useRef<string>(pathname || '/home')

  // Detect if running in Capacitor
  const isCapacitor = useCallback(() => {
    if (typeof window === 'undefined') return false
    return !!(
      window.Capacitor ||
      (window as any).Capacitor ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:'
    )
  }, [])

  // Determine transition direction based on tab order
  const getTransitionDirection = useCallback((from: string, to: string): 'left' | 'right' | 'fade' => {
    const tabOrder = ['/', '/home', '/discover', '/explore', '/profile']
    const fromIndex = tabOrder.findIndex(path => from.includes(path.slice(1) || 'home'))
    const toIndex = tabOrder.findIndex(path => to.includes(path.slice(1) || 'home'))
    
    if (fromIndex === -1 || toIndex === -1) return 'fade'
    
    return fromIndex < toIndex ? 'left' : 'right'
  }, [])

  // Apply View Transitions API if supported
  const applyViewTransition = useCallback((callback: () => void) => {
    if ('startViewTransition' in document) {
      // @ts-ignore - View Transitions API is experimental
      document.startViewTransition(callback)
    } else {
      callback()
    }
  }, [])

  // Handle path changes
  useEffect(() => {
    const currentPath = pathname || '/home'
    const previousPath = previousPathRef.current

    if (currentPath !== previousPath && isCapacitor()) {
      const direction = getTransitionDirection(previousPath, currentPath)
      
      setTransitionState({
        isTransitioning: true,
        direction,
        currentPath: previousPath,
        nextPath: currentPath
      })

      // Apply smooth transition
      applyViewTransition(() => {
        setTransitionState(prev => ({
          ...prev,
          currentPath: currentPath
        }))
      })

      // Complete transition after animation
      const timer = setTimeout(() => {
        setTransitionState({
          isTransitioning: false,
          direction: null,
          currentPath: currentPath
        })
      }, 400) // Match CSS transition duration

      previousPathRef.current = currentPath
      
      return () => clearTimeout(timer)
    }
  }, [pathname, isCapacitor, getTransitionDirection, applyViewTransition])

  // Add CSS classes for hardware acceleration
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      container.style.transform = 'translateZ(0)'
      container.style.backfaceVisibility = 'hidden'
      container.style.perspective = '1000px'
    }
  }, [])

  // Get transition classes
  const getTransitionClasses = () => {
    const baseClasses = 'transition-wrapper main-content'
    
    if (!transitionState.isTransitioning) {
      return baseClasses
    }

    const { direction } = transitionState
    switch (direction) {
      case 'left':
        return `${baseClasses} slide-left-enter-active`
      case 'right':
        return `${baseClasses} slide-right-enter-active`
      case 'fade':
        return `${baseClasses} fade-enter-active`
      default:
        return `${baseClasses} page-transition-enter-active`
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`${getTransitionClasses()} ${className}`}
      style={{
        willChange: transitionState.isTransitioning ? 'transform, opacity' : 'auto'
      }}
    >
      {/* Loading indicator during transition */}
      {transitionState.isTransitioning && (
        <div className="transition-loading" />
      )}
      
      {children}
    </div>
  )
}

/**
 * Hook for managing smooth navigation transitions
 */
export const useSmoothNavigation = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'fade' | null>(null)

  const startTransition = useCallback((direction: 'left' | 'right' | 'fade' = 'fade') => {
    setIsTransitioning(true)
    setTransitionDirection(direction)
    
    // Auto-complete transition
    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionDirection(null)
    }, 400)
  }, [])

  return {
    isTransitioning,
    transitionDirection,
    startTransition
  }
}

/**
 * Higher-order component for smooth navigation
 */
export const withSmoothNavigation = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <SmoothIOSNavigation>
      <Component {...(props as P)} ref={ref} />
    </SmoothIOSNavigation>
  ))
  
  WrappedComponent.displayName = `withSmoothNavigation(${Component.displayName || Component.name})`
  
  return WrappedComponent
}