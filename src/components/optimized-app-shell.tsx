/**
 * Optimized App Shell - Phase 3 Optimization
 * Integrates all performance optimizations into the app shell
 */

'use client';

import { useEffect } from 'react';
import { swManager } from '@/lib/sw-manager';
import { apiOptimizer } from '@/lib/api-optimizer';
import { criticalResourceManager } from '@/lib/critical-css';
import { performanceAnalytics } from '@/lib/performance-analytics';

export function OptimizedAppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize all performance optimizations
    initializeOptimizations();
  }, []);

  const initializeOptimizations = async () => {
    try {
      // Initialize service worker manager
      await swManager.register();
      
      // Initialize critical resource manager
      criticalResourceManager.init();
      
      // Initialize performance analytics
      performanceAnalytics.init();
      
      // Set up intelligent preloading
      setupIntelligentPreloading();
      
      console.log('[App Shell] All optimizations initialized');
    } catch (error) {
      console.error('[App Shell] Optimization initialization failed:', error);
    }
  };

  const setupIntelligentPreloading = () => {
    // Preload critical API endpoints based on current route
    const currentPath = window.location.pathname;
    const preloadEndpoints = getPreloadEndpoints(currentPath);
    
    // Use idle time for preloading
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        apiOptimizer.preloadResponses(preloadEndpoints);
      });
    } else {
      setTimeout(() => {
        apiOptimizer.preloadResponses(preloadEndpoints);
      }, 1000);
    }
  };

  const getPreloadEndpoints = (path: string): string[] => {
    const endpointMap: Record<string, string[]> = {
      '/home': ['/api/books/recommendations', '/api/user/preferences'],
      '/explore': ['/api/books/trending', '/api/books/categories'],
      '/community': ['/api/community/posts', '/api/community/recommendations'],
      '/ar-discovery': ['/api/library/nearby', '/api/books/availability']
    };
    
    return endpointMap[path] || [];
  };

  return <>{children}</>;
}