/**
 * Pre-Hydration DOM Sanitizer
 * Aggressively removes browser extension attributes before React hydration
 * Prevents hydration mismatches by cleaning the DOM early
 */

// Known extension attributes that cause hydration issues
const EXTENSION_ATTRIBUTES = [
  'katalonextensionid',
  'grammarly-extension',
  'data-grammarly-extension',
  'adblock-extension', 
  'lastpass-extension',
  'chrome-extension',
  'moz-extension',
  'safari-extension',
  'data-adblock',
  'data-lastpass',
  'data-honey',
  'data-bitwarden',
  'data-metamask',
] as const;

// Extension-injected elements that should be removed
const EXTENSION_SELECTORS = [
  '[id*="extension"]',
  '[class*="extension"]',
  '[data-extension]',
  'grammarly-extension',
  'lastpass-extension',
  'adblock-extension',
] as const;

interface SanitizerOptions {
  aggressive?: boolean;
  logCleaning?: boolean;
  retryInterval?: number;
  maxRetries?: number;
}

class PreHydrationSanitizer {
  private options: Required<SanitizerOptions>;
  private observer: MutationObserver | null = null;
  private cleanupCount = 0;
  private retryCount = 0;

  constructor(options: SanitizerOptions = {}) {
    this.options = {
      aggressive: true,
      logCleaning: process.env.NODE_ENV === 'development',
      retryInterval: 100,
      maxRetries: 10,
      ...options,
    };
  }

  /**
   * Initialize the sanitizer - call this as early as possible
   */
  public initialize(): void {
    // Run immediate cleanup
    this.sanitizeDOM();
    
    // Set up continuous monitoring
    this.setupMutationObserver();
    
    // Set up retry mechanism for stubborn extensions
    this.setupRetryMechanism();
    
    // Log initialization in development
    if (this.options.logCleaning) {
      console.log('[Sanitizer] Pre-hydration DOM sanitizer initialized');
    }
  }

  /**
   * Perform aggressive DOM sanitization
   */
  private sanitizeDOM(): void {
    let cleaned = 0;

    // Remove extension attributes from all elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element) => {
      cleaned += this.cleanElementAttributes(element);
    });

    // Remove extension-injected elements
    if (this.options.aggressive) {
      EXTENSION_SELECTORS.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (this.isExtensionElement(element)) {
              element.remove();
              cleaned++;
            }
          });
        } catch (error) {
          // Ignore selector errors
        }
      });
    }

    this.cleanupCount += cleaned;

    if (cleaned > 0 && this.options.logCleaning) {
      console.log(`[Sanitizer] Cleaned ${cleaned} extension artifacts`);
    }
  }

  /**
   * Clean extension attributes from a single element
   */
  private cleanElementAttributes(element: Element): number {
    let cleaned = 0;
    const attributesToRemove: string[] = [];

    // Check all attributes
    Array.from(element.attributes).forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      
      // Check against known extension attributes
      if (EXTENSION_ATTRIBUTES.some(extAttr => attrName.includes(extAttr.toLowerCase()))) {
        attributesToRemove.push(attr.name);
        cleaned++;
      }
      
      // Check for UUID-like patterns (common in extensions)
      if (/^[a-f0-9-]{20,}$/i.test(attr.value) && attrName.includes('id')) {
        attributesToRemove.push(attr.name);
        cleaned++;
      }
    });

    // Remove the problematic attributes
    attributesToRemove.forEach((attrName) => {
      element.removeAttribute(attrName);
    });

    return cleaned;
  }

  /**
   * Check if an element was injected by an extension
   */
  private isExtensionElement(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    const id = element.id.toLowerCase();
    const className = element.className.toString().toLowerCase();

    // Check for extension-specific patterns
    const extensionPatterns = [
      'extension',
      'grammarly',
      'lastpass', 
      'adblock',
      'honey',
      'bitwarden',
      'metamask',
      'katalon',
    ];

    return extensionPatterns.some(pattern => 
      tagName.includes(pattern) ||
      id.includes(pattern) ||
      className.includes(pattern)
    );
  }

  /**
   * Set up MutationObserver to catch real-time DOM changes
   */
  private setupMutationObserver(): void {
    if (typeof window === 'undefined' || !window.MutationObserver) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      let needsCleanup = false;

      mutations.forEach((mutation) => {
        // Check for attribute changes
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (this.cleanElementAttributes(target) > 0) {
            needsCleanup = true;
          }
        }
        
        // Check for added nodes
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (this.isExtensionElement(element) && this.options.aggressive) {
                element.remove();
                needsCleanup = true;
              } else {
                this.cleanElementAttributes(element);
              }
            }
          });
        }
      });

      if (needsCleanup && this.options.logCleaning) {
        console.log('[Sanitizer] Real-time extension cleanup performed');
      }
    });

    // Observe the entire document
    this.observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
    });
  }

  /**
   * Set up retry mechanism for persistent extensions
   */
  private setupRetryMechanism(): void {
    const retryCleanup = () => {
      if (this.retryCount >= this.options.maxRetries) {
        return;
      }

      this.retryCount++;
      this.sanitizeDOM();
      
      setTimeout(retryCleanup, this.options.retryInterval);
    };

    setTimeout(retryCleanup, this.options.retryInterval);
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.options.logCleaning && this.cleanupCount > 0) {
      console.log(`[Sanitizer] Destroyed. Total cleanup count: ${this.cleanupCount}`);
    }
  }

  /**
   * Get cleanup statistics
   */
  public getStats() {
    return {
      cleanupCount: this.cleanupCount,
      retryCount: this.retryCount,
      isActive: !!this.observer,
    };
  }
}

// Global sanitizer instance
let globalSanitizer: PreHydrationSanitizer | null = null;

/**
 * Initialize the global DOM sanitizer
 * Call this as early as possible, ideally in _app.tsx or _document.tsx
 */
export function initializePreHydrationSanitizer(options?: SanitizerOptions): void {
  if (typeof window === 'undefined') {
    return; // Server-side, do nothing
  }

  if (globalSanitizer) {
    console.warn('[Sanitizer] Already initialized');
    return;
  }

  globalSanitizer = new PreHydrationSanitizer(options);
  globalSanitizer.initialize();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (globalSanitizer) {
      globalSanitizer.destroy();
      globalSanitizer = null;
    }
  });
}

/**
 * Get the global sanitizer instance
 */
export function getPreHydrationSanitizer(): PreHydrationSanitizer | null {
  return globalSanitizer;
}

/**
 * Manual cleanup trigger - useful for testing
 */
export function triggerManualCleanup(): void {
  if (globalSanitizer) {
    globalSanitizer['sanitizeDOM']();
  }
}

// Auto-initialize if window is available (for client-side usage)
if (typeof window !== 'undefined' && !globalSanitizer) {
  // Wait for DOM to be available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializePreHydrationSanitizer();
    });
  } else {
    initializePreHydrationSanitizer();
  }
}