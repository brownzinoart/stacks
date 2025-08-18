/**
 * SkeletonLoader - Consistent loading states across the app
 * Provides various skeleton shapes for different content types
 */

'use client'

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export const SkeletonBox = ({ className = '', animate = true }: SkeletonProps) => (
  <div 
    className={`bg-gray-200 rounded-xl ${animate ? 'animate-pulse' : ''} ${className}`}
  />
)

export const SkeletonText = ({ className = '', animate = true }: SkeletonProps) => (
  <div 
    className={`bg-gray-200 rounded-pill h-4 ${animate ? 'animate-pulse' : ''} ${className}`}
  />
)

export const SkeletonCircle = ({ className = '', animate = true }: SkeletonProps) => (
  <div 
    className={`bg-gray-200 rounded-full ${animate ? 'animate-pulse' : ''} ${className}`}
  />
)

// Book card skeleton
export const BookCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-card">
    <div className="flex space-x-3">
      <SkeletonBox className="w-12 h-16" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2 h-3" />
        <SkeletonText className="w-1/4 h-3" />
      </div>
    </div>
  </div>
)

// Community post skeleton
export const PostSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-card">
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonCircle className="w-10 h-10" />
      <div className="space-y-1">
        <SkeletonText className="w-20 h-3" />
        <SkeletonText className="w-16 h-2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonText className="w-full" />
      <SkeletonText className="w-4/5" />
    </div>
    <SkeletonBox className="w-full h-32 mb-4" />
    <div className="flex space-x-6">
      <SkeletonText className="w-8" />
      <SkeletonText className="w-8" />
      <SkeletonText className="w-8" />
    </div>
  </div>
)

// Stack/Learning path skeleton
export const StackSkeleton = () => (
  <div className="bg-white rounded-xl p-5 shadow-card">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <SkeletonBox className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonText className="w-32" />
          <SkeletonText className="w-20 h-3" />
        </div>
      </div>
      <SkeletonText className="w-16 h-6" />
    </div>
    <SkeletonText className="w-full h-3 mb-2" />
    <SkeletonText className="w-3/4 h-3 mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonText className="w-20 h-3" />
      <div className="flex space-x-2">
        <SkeletonBox className="w-20 h-8 rounded-pill" />
        <SkeletonBox className="w-16 h-8 rounded-pill" />
      </div>
    </div>
  </div>
)

// Grid of skeleton cards
interface SkeletonGridProps {
  count?: number
  type?: 'book' | 'post' | 'stack'
  className?: string
}

export const SkeletonGrid = ({ count = 3, type = 'book', className = '' }: SkeletonGridProps) => {
  const SkeletonComponent = {
    book: BookCardSkeleton,
    post: PostSkeleton,
    stack: StackSkeleton
  }[type]
  
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}