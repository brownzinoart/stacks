/**
 * Enhanced Hydration Error Boundary
 * Handles hydration mismatches caused by browser extensions and external DOM modifications
 * Includes React 18+ error recovery and console error suppression
 */

'use client';

import React from 'react';

interface HydrationErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string;
  retryCount: number;
  suppressedErrors: string[];
  lastErrorTime: number;
}

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  maxRetries?: number;
  suppressConsoleErrors?: boolean;
  onHydrationError?: (error: Error) => void;
}

export class HydrationErrorBoundary extends React.Component<
  HydrationErrorBoundaryProps,
  HydrationErrorBoundaryState
> {
  private retryTimer?: NodeJS.Timeout;
  private originalConsoleError?: typeof console.error;
  private errorSuppressionActive = false;

  constructor(props: HydrationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      suppressedErrors: [],
      lastErrorTime: 0,
    };
    
    // Set up console error interception
    this.setupConsoleErrorSuppression();
  }

  /**
   * Set up aggressive console error suppression for hydration issues
   */
  private setupConsoleErrorSuppression(): void {
    if (typeof window === 'undefined' || !this.props.suppressConsoleErrors) {
      return;
    }

    this.originalConsoleError = console.error;
    
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ').toLowerCase();
      
      // Extension-specific error patterns to suppress
      const suppressPatterns = [
        'katalonextensionid',
        'hydrated but some attributes',
        'server rendered html didn\'t match',
        'client properties',
        'hydration failed',
        'grammarly-extension',
        'lastpass-extension',
        'adblock-extension',
      ];
      
      // Check if this error should be suppressed
      const shouldSuppress = suppressPatterns.some(pattern => 
        errorMessage.includes(pattern)
      );
      
      if (shouldSuppress) {
        this.setState(prevState => ({
          suppressedErrors: [...prevState.suppressedErrors, errorMessage],
        }));
        
        // Log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Hydration Error Boundary] Suppressed extension error:', args[0]);
        }
        return;
      }
      
      // Allow non-extension errors through
      if (this.originalConsoleError) {
        this.originalConsoleError.apply(console, args);
      }
    };
    
    this.errorSuppressionActive = true;
  }

  static getDerivedStateFromError(error: Error): Partial<HydrationErrorBoundaryState> {
    // Check if this is a hydration error
    const isHydrationError = 
      error.message.includes('hydrated') ||
      error.message.includes('server rendered HTML') ||
      error.message.includes('client properties') ||
      error.message.includes('katalonextensionid') ||
      error.message.includes('Hydration failed');

    if (isHydrationError) {
      return {
        hasError: true,
        errorInfo: error.message,
        lastErrorTime: Date.now(),
      };
    }

    // Let other errors bubble up normally
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only handle hydration-related errors
    const isHydrationError = 
      error.message.includes('hydrated') ||
      error.message.includes('server rendered HTML') ||
      error.message.includes('client properties') ||
      error.message.includes('katalonextensionid') ||
      error.message.includes('Hydration failed');

    if (isHydrationError) {
      // Call user-provided error handler
      if (this.props.onHydrationError) {
        this.props.onHydrationError(error);
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn('[Enhanced Hydration Error Boundary] Hydration error caught:', {
          error: error.message,
          componentStack: errorInfo.componentStack,
          retryCount: this.state.retryCount,
          suppressedCount: this.state.suppressedErrors.length,
        });
      }

      // Implement exponential backoff for retries
      if (this.state.retryCount < (this.props.maxRetries || 3)) {
        const retryDelay = Math.min(100 * Math.pow(2, this.state.retryCount), 1000);
        
        this.retryTimer = setTimeout(() => {
          this.setState((prevState) => ({
            hasError: false,
            retryCount: prevState.retryCount + 1,
          }));
        }, retryDelay);
      } else {
        // After max retries, force client-side rendering
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Enhanced Hydration Error Boundary] Max retries reached, forcing client-only mode');
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    
    // Restore original console.error
    if (this.originalConsoleError && this.errorSuppressionActive) {
      console.error = this.originalConsoleError;
      this.errorSuppressionActive = false;
    }
  }

  render() {
    if (this.state.hasError) {
      // Show fallback UI or retry mechanism
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced fallback for hydration errors with better recovery
      return (
        <div className="hydration-error-fallback" suppressHydrationWarning>
          {this.state.retryCount < (this.props.maxRetries || 3) ? (
            // Still retrying - render with hydration suppression
            <div key={`hydration-retry-${this.state.retryCount}`}>
              {this.props.children}
            </div>
          ) : (
            // Max retries reached - force client-side rendering
            <ClientOnlyWrapper key="client-only-fallback">
              {this.props.children}
            </ClientOnlyWrapper>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Client-only wrapper for forcing client-side rendering
 */
function ClientOnlyWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Avoid hydration by not rendering on server
  }

  return <>{children}</>;
}

/**
 * Hook for safer hydration with extension detection
 */
export function useHydrationSafeRender() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [hasExtensionInterference, setHasExtensionInterference] = React.useState(false);

  React.useEffect(() => {
    // Detect browser extension interference
    const detectExtensionInterference = () => {
      const bodyAttrs = document.body.attributes;
      const htmlAttrs = document.documentElement.attributes;
      
      // Common extension attributes
      const extensionAttributes = [
        'katalanextensionid',
        'grammarly-extension',
        'adblock-extension',
        'lastpass-extension',
        'chrome-extension',
      ];

      for (let i = 0; i < bodyAttrs.length; i++) {
        const attr = bodyAttrs[i];
        if (attr && extensionAttributes.some(ext => attr.name?.includes(ext))) {
          setHasExtensionInterference(true);
          console.warn('[Hydration] Browser extension detected:', attr.name);
          break;
        }
      }

      for (let i = 0; i < htmlAttrs.length; i++) {
        const attr = htmlAttrs[i];
        if (attr && extensionAttributes.some(ext => attr.name?.includes(ext))) {
          setHasExtensionInterference(true);
          console.warn('[Hydration] Browser extension detected:', attr.name);
          break;
        }
      }
    };

    // Small delay to let extensions inject their attributes
    const timer = setTimeout(() => {
      detectExtensionInterference();
      setIsHydrated(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return {
    isHydrated,
    hasExtensionInterference,
  };
}

/**
 * Higher-order component for hydration-safe rendering
 */
export function withHydrationSafety<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<P>
) {
  const HydrationSafeComponent = (props: P) => {
    return (
      <HydrationErrorBoundary
        fallback={fallbackComponent ? <fallbackComponent {...props} /> : undefined}
      >
        <Component {...props} />
      </HydrationErrorBoundary>
    );
  };

  HydrationSafeComponent.displayName = `withHydrationSafety(${Component.displayName || Component.name})`;
  
  return HydrationSafeComponent;
}