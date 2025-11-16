/**
 * Optimized React Hooks - Phase 2 Optimization  
 * Better memory management and dependency handling
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { createManagedAbortController, optimizedDebounce } from '@/lib/memory-manager';

/**
 * useEffect with automatic cleanup management
 */
export const useOptimizedEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList
) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Run the effect
    const cleanup = effect();
    
    // Store cleanup function
    if (typeof cleanup === 'function') {
      cleanupRef.current = cleanup;
    }

    // Return cleanup that handles both our cleanup and the effect's cleanup
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, deps);
};

/**
 * useCallback with automatic dependency management
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef<T>(callback);
  
  // Update the callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);
  
  // Return a stable callback that always calls the latest version
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};

/**
 * Debounced callback hook with cleanup
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
) => {
  const debouncedCallback = useMemo(
    () => optimizedDebounce(callback, delay),
    deps
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      (debouncedCallback as any).cancel?.();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};

/**
 * Async effect hook with AbortController
 */
export const useAsyncEffect = (
  effect: (abortController: AbortController) => Promise<void>,
  deps: React.DependencyList
) => {
  useEffect(() => {
    const controller = createManagedAbortController();
    
    effect(controller).catch((error) => {
      if (!controller.signal.aborted) {
        console.error('Async effect error:', error);
      }
    });

    return () => {
      controller.abort();
    };
  }, deps);
};

/**
 * Ref callback hook that handles cleanup properly
 */
export const useRefCallback = <T extends HTMLElement>() => {
  const elementRef = useRef<T | null>(null);

  const setRef = useCallback((element: T | null) => {
    // Clean up previous element if needed
    if (elementRef.current && elementRef.current !== element) {
      // Perform any cleanup for the previous element
    }
    
    elementRef.current = element;
  }, []);

  return [elementRef, setRef] as const;
};