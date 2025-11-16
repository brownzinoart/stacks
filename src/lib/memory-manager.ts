/**
 * Memory Management Utilities - Phase 2 Optimization
 * Helps prevent memory leaks and optimize memory usage
 */

// WeakMap to track component cleanup functions
const componentCleanupMap = new WeakMap<object, () => void>();

/**
 * Register cleanup function for a component
 */
export const registerCleanup = (component: object, cleanup: () => void) => {
  componentCleanupMap.set(component, cleanup);
};

/**
 * Execute and remove cleanup function for a component
 */
export const executeCleanup = (component: object) => {
  const cleanup = componentCleanupMap.get(component);
  if (cleanup) {
    cleanup();
    componentCleanupMap.delete(component);
  }
};

/**
 * Optimized debounce function for better memory usage
 */
export const optimizedDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debouncedFunction = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func(...args);
    }, delay);
  };

  // Add cleanup method
  (debouncedFunction as any).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
};

/**
 * Create an AbortController that cleans up automatically
 */
export const createManagedAbortController = () => {
  const controller = new AbortController();
  
  // Auto-cleanup after 30 seconds to prevent memory leaks
  const timeoutId = setTimeout(() => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  }, 30000);
  
  // Override abort to clear timeout
  const originalAbort = controller.abort.bind(controller);
  controller.abort = () => {
    clearTimeout(timeoutId);
    originalAbort();
  };
  
  return controller;
};

/**
 * Memory-efficient object cache with size limits
 */
export class LimitedCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  set(key: K, value: V): void {
    // Remove oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Monitor memory usage in development
 */
export const getMemoryUsage = () => {
  if (typeof window === 'undefined') return null;
  
  // @ts-ignore - performance.memory is non-standard but widely supported
  const memory = (window.performance as any)?.memory;
  
  if (!memory) return null;
  
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
  };
};

/**
 * Log memory usage in development mode
 */
export const logMemoryUsage = (componentName?: string) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const usage = getMemoryUsage();
  if (usage) {
    const prefix = componentName ? `[${componentName}] ` : '';
    console.log(`${prefix}Memory: ${usage.used}MB used, ${usage.total}MB total, ${usage.limit}MB limit`);
    
    // Warn if memory usage is high
    if (usage.used / usage.limit > 0.8) {
      console.warn(`${prefix}High memory usage: ${Math.round((usage.used / usage.limit) * 100)}%`);
    }
  }
};