/**
 * Component Lazy Loading Utilities - Phase 2 Optimization
 * Dynamically loads heavy components only when needed
 */

import React, { lazy, ComponentType } from 'react';

// Lazy load heavy components
export const LazyARShelfScan = lazy(() => 
  import('@/features/ar/ar-shelf-scan').then(module => ({ default: module.ARShelfScan }))
);

export const LazyBookFlipbook3D = lazy(() =>
  import('@/components/book-flipbook-3d').then(module => ({ default: module.BookFlipbook3D }))
);

export const LazyBookFlipbookCustom3D = lazy(() =>
  import('@/components/book-flipbook-custom-3d').then(module => ({ default: module.BookFlipbookCustom3D }))
);

/**
 * Higher-order component for lazy loading with loading state
 */
export const withLazyLoading = <P extends object>(
  LazyComponent: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const defaultFallback = React.createElement('div', {
    className: 'animate-pulse bg-gray-200 rounded h-32 w-32'
  });
  
  return (props: P) => 
    React.createElement(React.Suspense, {
      fallback: fallback || defaultFallback
    }, React.createElement(LazyComponent, props));
};

