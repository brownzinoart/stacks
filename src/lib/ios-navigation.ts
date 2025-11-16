/**
 * iOS Navigation Service - Capacitor-specific navigation to prevent RSC errors
 * Forces direct HTML navigation and prevents Next.js client-side routing in iOS app
 */

// Detect if running in Capacitor (mobile app)
export const isCapacitor = () => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.Capacitor ||
    (window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'
  );
};

/**
 * Navigate to a page in iOS app using direct window.location
 * FORCES static HTML navigation to prevent RSC .txt fetches
 * 
 * @param href - The route to navigate to (e.g., '/home', '/discover')
 */
export const navigateInIOS = (href: string) => {
  if (!isCapacitor()) {
    console.warn('navigateInIOS called outside Capacitor environment');
    return;
  }

  // Clean the href
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  
  // ALWAYS use static HTML navigation - no live reload, no RSC files
  const targetUrl = `${cleanHref}/index.html`;
  console.log(`🍎 [iOS Navigation] STATIC HTML navigation to: ${targetUrl}`);
  
  // Force direct navigation - completely bypass Next.js router
  window.location.href = targetUrl;
};

/**
 * Get current path in iOS app, handling Capacitor's index.html suffixes
 * 
 * @returns Clean path (e.g., '/home' instead of '/home/index.html')
 */
export const getCurrentPathInIOS = (): string => {
  if (!isCapacitor()) return '';
  
  const path = window.location.pathname;
  
  // ALWAYS assume static mode - remove /index.html suffix and handle root case
  return path.replace('/index.html', '') || '/';
};

/**
 * Check if current path matches the target route
 * Handles both direct paths and home page special cases
 * 
 * @param targetHref - The target route to check (e.g., '/home')
 * @param currentPath - Current path (optional, will get from window if not provided)
 * @returns true if current path matches target
 */
export const isCurrentPath = (targetHref: string, currentPath?: string): boolean => {
  const actualCurrentPath = currentPath || getCurrentPathInIOS();
  
  // Direct match
  if (actualCurrentPath === targetHref) return true;
  
  // Home page special case - both / and /home should be considered "home"
  if (targetHref === '/home' && (actualCurrentPath === '/' || actualCurrentPath === '')) {
    return true;
  }
  
  return false;
};

/**
 * Enhanced navigation handler with preloading for better UX
 * 
 * @param href - Target route
 * @param preloadCallback - Optional callback for preloading (if available)
 */
export const handleIOSNavigation = (
  href: string, 
  preloadCallback?: (href: string) => void
) => {
  if (!isCapacitor()) {
    console.warn('handleIOSNavigation called outside Capacitor environment');
    return;
  }

  // Preload if callback provided
  if (preloadCallback) {
    preloadCallback(href);
  }

  // Add small delay for visual feedback, then navigate
  setTimeout(() => {
    navigateInIOS(href);
  }, 50);
};

/**
 * Generate iOS-compatible URL for standard HTML links
 * 
 * @param href - The route (e.g., '/home')
 * @returns iOS-compatible URL (e.g., '/home/index.html')
 */
export const getIOSCompatibleUrl = (href: string): string => {
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  
  // ALWAYS use static mode - add index.html suffix
  return `${cleanHref}/index.html`;
};