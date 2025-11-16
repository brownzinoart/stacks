/**
 * AnimatedButton - Consistent interactive buttons with animations
 * Provides unified button styling and interactions across the app
 */

'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
  icon?: ReactNode
  fullWidth?: boolean
  animation?: 'scale' | 'bounce' | 'pulse' | 'none'
  className?: string
}

export const AnimatedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  icon,
  fullWidth = false,
  animation = 'scale',
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) => {
  const baseClasses = 'font-bold rounded-pill transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
  
  const variantClasses = {
    primary: 'bg-primary-blue text-white hover:bg-primary-blue/90 focus:ring-primary-blue/30 shadow-card hover:shadow-card-hover',
    secondary: 'bg-primary-purple text-white hover:bg-primary-purple/90 focus:ring-primary-purple/30 shadow-card hover:shadow-card-hover',
    outline: 'bg-white border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white focus:ring-primary-blue/30',
    ghost: 'bg-transparent text-primary-blue hover:bg-primary-blue/10 focus:ring-primary-blue/30',
    gradient: 'bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink bg-size-200 text-white hover:bg-position-right focus:ring-primary-blue/30 shadow-card hover:shadow-card-hover'
  }
  
  const sizeClasses = {
    sm: 'min-h-touch-sm px-4 py-2 text-sm',  // 36px minimum
    md: 'min-h-touch-md px-6 py-3 text-base', // 44px minimum  
    lg: 'min-h-touch-lg px-8 py-4 text-lg',  // 52px minimum
    xl: 'min-h-[60px] px-10 py-5 text-xl'    // Extra large for hero CTAs
  }
  
  const animationClasses = {
    scale: 'hover:scale-105 active:scale-95',
    bounce: 'hover:animate-bounce',
    pulse: 'hover:animate-pulse',
    none: ''
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${animationClasses[animation]}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

// Specialized button variants
export const PrimaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton variant="primary" {...props} />
)

export const SecondaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton variant="secondary" {...props} />
)

export const GradientButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton variant="gradient" {...props} />
)

export const OutlineButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton variant="outline" {...props} />
)

export const GhostButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton variant="ghost" {...props} />
)

// Icon button for compact spaces
export const IconButton = ({ 
  icon, 
  size = 'md',
  className = '',
  ...props 
}: Omit<AnimatedButtonProps, 'children'> & { icon: ReactNode }) => {
  const sizeClasses = {
    sm: 'min-w-touch-sm min-h-touch-sm w-9 h-9',   // 36px touch target
    md: 'min-w-touch-md min-h-touch-md w-11 h-11', // 44px touch target
    lg: 'min-w-touch-lg min-h-touch-lg w-13 h-13', // 52px touch target
    xl: 'min-w-[60px] min-h-[60px] w-16 h-16'      // Extra large
  }
  
  return (
    <AnimatedButton
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      size={size}
      {...props}
    >
      {icon}
    </AnimatedButton>
  )
}