/**
 * Dynamic Book Flipbook Loader - Phase 2 Optimization
 * Lazy loads the heavy page-flip library only when needed
 */

let PageFlip: any = null;

/**
 * Dynamically import page-flip library to reduce initial bundle size
 */
export const loadPageFlip = async () => {
  if (PageFlip) {
    return PageFlip;
  }

  // Dynamic import reduces initial bundle size
  const pageFlipModule = await import('page-flip');
  PageFlip = pageFlipModule.PageFlip;
  
  return PageFlip;
};

/**
 * Preload flipbook library on component hover
 */
export const preloadFlipbook = () => {
  if (typeof window !== 'undefined' && !PageFlip) {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loadPageFlip().catch(console.error);
      });
    } else {
      setTimeout(() => {
        loadPageFlip().catch(console.error);
      }, 500);
    }
  }
};