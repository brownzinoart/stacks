/**
 * Custom hook for hydration-safe state management
 * Prevents hydration mismatches by managing client-side state properly
 * Enhanced with browser extension compatibility
 */

import { useEffect, useState } from 'react';
import { detectExtensionInterference } from '@/lib/extension-compatibility';

export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasExtensionInterference, setHasExtensionInterference] = useState(false);

  useEffect(() => {
    // Add delay to let browser extensions inject their modifications
    const timer = setTimeout(() => {
      // Check for extension interference before marking as hydrated
      const interference = detectExtensionInterference();
      
      if (interference.hasInterference) {
        setHasExtensionInterference(true);
        console.warn('[Hydration] Extension interference detected:', interference.detectedExtensions);
      }
      
      // Mark as hydrated after extension check
      setIsHydrated(true);
    }, 100); // Small delay for extensions to modify DOM

    return () => clearTimeout(timer);
  }, []);

  return { isHydrated, hasExtensionInterference };
}

/**
 * Hook for safe client-side environment detection
 * Returns consistent values during SSR and proper values after hydration
 */
export function useClientEnvironment() {
  const [environment, setEnvironment] = useState({
    isCapacitor: false,
    isClient: false,
    userAgent: '',
    hasExtensionInterference: false,
  });
  
  const { isHydrated, hasExtensionInterference } = useHydrationSafe();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isCapacitorEnv = !!(
        window.Capacitor ||
        (window as any).Capacitor ||
        window.location.protocol === 'capacitor:' ||
        window.location.protocol === 'ionic:'
      );

      setEnvironment({
        isCapacitor: isCapacitorEnv,
        isClient: true,
        userAgent: navigator.userAgent,
        hasExtensionInterference,
      });
    }
  }, [hasExtensionInterference]);

  return {
    ...environment,
    isHydrated,
    hasExtensionInterference,
  };
}

/**
 * Hook for safe pathname handling
 * Prevents hydration mismatches with Next.js pathname
 */
export function useSafePathname(fallback: string = '/home') {
  const [currentPath, setCurrentPath] = useState(fallback);
  const { isHydrated, hasExtensionInterference } = useHydrationSafe();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname || fallback);
    }
  }, [fallback]);

  return {
    currentPath,
    isHydrated,
    hasExtensionInterference,
  };
}