/**
 * AnimatedEntrance - Consistent entrance animations
 * Provides smooth entrance animations for components
 */

'use client'

import { useEffect, useState, ReactNode } from 'react'

interface AnimatedEntranceProps {
  children: ReactNode
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn' | 'slideUp'
  delay?: number
  duration?: number
  className?: string
}

export const AnimatedEntrance = ({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0, 
  duration = 300,
  className = '' 
}: AnimatedEntranceProps) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  const animationClasses = {
    fadeInUp: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-4',
    fadeInLeft: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-4',
    fadeInRight: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-4',
    fadeIn: isVisible 
      ? 'opacity-100' 
      : 'opacity-0',
    scaleIn: isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
    slideUp: isVisible 
      ? 'translate-y-0' 
      : 'translate-y-full'
  }
  
  return (
    <div 
      className={`transition-all ease-out ${animationClasses[animation]} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

// Staggered list animations
interface StaggeredListProps {
  children: ReactNode[]
  stagger?: number
  animation?: AnimatedEntranceProps['animation']
  className?: string
}

export const StaggeredList = ({ 
  children, 
  stagger = 100, 
  animation = 'fadeInUp',
  className = ''
}: StaggeredListProps) => (
  <div className={className}>
    {children.map((child, index) => (
      <AnimatedEntrance 
        key={index}
        animation={animation}
        delay={index * stagger}
      >
        {child}
      </AnimatedEntrance>
    ))}
  </div>
)

// Page transition wrapper
export const PageTransition = ({ children, className = '' }: { 
  children: ReactNode
  className?: string 
}) => (
  <AnimatedEntrance animation="fadeInUp" duration={400} className={className}>
    {children}
  </AnimatedEntrance>
)

// Floating animation for decorative elements
export const FloatingElement = ({ 
  children, 
  duration = 3000,
  className = '' 
}: { 
  children: ReactNode
  duration?: number
  className?: string 
}) => (
  <div 
    className={`animate-bounce ${className}`}
    style={{ 
      animationDuration: `${duration}ms`,
      animationIterationCount: 'infinite',
      animationDirection: 'alternate'
    }}
  >
    {children}
  </div>
)

// Pulse highlight for interactive elements
export const PulseHighlight = ({ 
  children, 
  isActive = false,
  className = '' 
}: { 
  children: ReactNode
  isActive?: boolean
  className?: string 
}) => (
  <div className={`transition-all duration-300 ${isActive ? 'animate-pulse ring-4 ring-primary-blue/30' : ''} ${className}`}>
    {children}
  </div>
)