/**
 * Performance Monitoring Hook - Phase 2 Optimization
 * Tracks component performance and memory usage
 */

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    // Track component mount time
    mountTimeRef.current = performance.now();

    return () => {
      // Cleanup and report metrics
      const totalLifetime = performance.now() - mountTimeRef.current;
      
      // Only log in development and for long-lived components
      if (process.env.NODE_ENV === 'development' && totalLifetime > 1000) {
        console.log(`[Performance] ${componentName} lifetime: ${totalLifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  const startRender = () => {
    renderStartRef.current = performance.now();
  };

  const endRender = () => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      renderStartRef.current = 0;
      return renderTime;
    }
    return 0;
  };

  const getMemoryUsage = () => {
    // @ts-ignore - performance.memory is non-standard but widely supported
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      // @ts-ignore
      return window.performance.memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  };

  return {
    startRender,
    endRender,
    getMemoryUsage,
  };
};