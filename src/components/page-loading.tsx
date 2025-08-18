/**
 * PageLoading - Consistent page loading states
 * Used for page transitions and full-page loading states
 */

'use client'

interface PageLoadingProps {
  message?: string
  showSpinner?: boolean
  showProgress?: boolean
  progress?: number
}

export const PageLoading = ({ 
  message = 'Loading...', 
  showSpinner = true,
  showProgress = false,
  progress = 0
}: PageLoadingProps) => (
  <div className="min-h-screen bg-gradient-to-br from-primary-blue via-primary-purple to-primary-pink flex items-center justify-center p-4">
    <div className="text-center">
      {/* App Logo/Brand */}
      <div className="mb-8">
        <div className="text-6xl mb-4 animate-bounce">📚</div>
        <h1 className="text-4xl font-black text-white mb-2">STACKS</h1>
        <p className="text-white/80 font-bold">Your Book Discovery App</p>
      </div>
      
      {/* Loading Spinner */}
      {showSpinner && (
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-6 w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="text-white/80 text-sm">{Math.round(progress)}% complete</p>
        </div>
      )}
      
      {/* Loading Message */}
      <p className="text-white/90 font-bold text-lg animate-pulse">{message}</p>
    </div>
  </div>
)

// Compact loading for components
export const InlineLoading = ({ message = 'Loading...', size = 'md' }: { 
  message?: string
  size?: 'sm' | 'md' | 'lg' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`border-2 border-gray-300 border-t-primary-blue rounded-full animate-spin ${sizeClasses[size]} mr-3`}></div>
      <span className="text-text-secondary font-medium">{message}</span>
    </div>
  )
}

// Loading overlay for modal/sheet content
export const OverlayLoading = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-text-primary font-bold">{message}</p>
    </div>
  </div>
)