/**
 * Browser Extension Compatibility Layer
 * Handles interference from browser extensions that modify the DOM
 */

/**
 * Known browser extension attributes that can cause hydration issues
 */
const KNOWN_EXTENSION_ATTRIBUTES = [
  'katalanextensionid',
  'grammarly-extension',
  'lastpass-extension', 
  'adblock-extension',
  'chrome-extension',
  'metamask-extension',
  'honey-extension',
  'bitwarden-extension',
  'onepassword-extension',
  'dashlane-extension',
  'pinterest-extension',
  'evernote-extension',
];

/**
 * Extension-related CSS classes that might interfere
 */
const EXTENSION_CSS_CLASSES = [
  'grammarly-disable-indicator',
  'katalan-extension',
  'lastpass-icon',
  'adblock-overlay',
  'honey-coupon',
  'metamask-detected',
];

/**
 * Detects if browser extensions are modifying the DOM
 */
export function detectExtensionInterference(): {
  hasInterference: boolean;
  detectedExtensions: string[];
  recommendations: string[];
} {
  const detectedExtensions: string[] = [];
  const recommendations: string[] = [];

  if (typeof document === 'undefined') {
    return { hasInterference: false, detectedExtensions, recommendations };
  }

  // Check body and html attributes
  const elements = [document.body, document.documentElement];
  
  elements.forEach((element) => {
    if (!element) return;
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      
      KNOWN_EXTENSION_ATTRIBUTES.forEach((extAttr) => {
        if (attr.name.toLowerCase().includes(extAttr.toLowerCase())) {
          if (!detectedExtensions.includes(extAttr)) {
            detectedExtensions.push(extAttr);
          }
        }
      });
    }

    // Check for extension-related classes
    EXTENSION_CSS_CLASSES.forEach((extClass) => {
      if (element.classList.contains(extClass)) {
        if (!detectedExtensions.includes(extClass)) {
          detectedExtensions.push(extClass);
        }
      }
    });
  });

  // Check for extension-injected scripts
  const scripts = document.querySelectorAll('script[src*="extension"]');
  if (scripts.length > 0) {
    detectedExtensions.push('script-injection');
  }

  // Generate recommendations
  if (detectedExtensions.length > 0) {
    recommendations.push('Try using incognito/private browsing mode');
    recommendations.push('Disable browser extensions temporarily');
    recommendations.push('Use a different browser for development');
    
    if (detectedExtensions.includes('katalanextensionid')) {
      recommendations.push('Disable Katalan browser extension');
    }
    if (detectedExtensions.includes('grammarly-extension')) {
      recommendations.push('Disable Grammarly extension');
    }
  }

  return {
    hasInterference: detectedExtensions.length > 0,
    detectedExtensions,
    recommendations,
  };
}

/**
 * Cleans up extension-added attributes from an element
 */
export function cleanExtensionAttributes(element: Element): void {
  if (!element) return;

  const attributesToRemove: string[] = [];

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    
    KNOWN_EXTENSION_ATTRIBUTES.forEach((extAttr) => {
      if (attr.name.toLowerCase().includes(extAttr.toLowerCase())) {
        attributesToRemove.push(attr.name);
      }
    });
  }

  // Remove detected extension attributes
  attributesToRemove.forEach((attrName) => {
    try {
      element.removeAttribute(attrName);
    } catch (error) {
      console.warn(`Could not remove extension attribute: ${attrName}`, error);
    }
  });
}

/**
 * Creates a mutation observer to detect and handle extension modifications
 */
export function createExtensionObserver(
  callback: (mutations: MutationRecord[]) => void
): MutationObserver | null {
  if (typeof window === 'undefined' || !window.MutationObserver) {
    return null;
  }

  const observer = new MutationObserver((mutations) => {
    const relevantMutations = mutations.filter((mutation) => {
      // Check if any added attributes are extension-related
      if (mutation.type === 'attributes' && mutation.attributeName) {
        return KNOWN_EXTENSION_ATTRIBUTES.some((extAttr) =>
          mutation.attributeName!.toLowerCase().includes(extAttr.toLowerCase())
        );
      }
      
      // Check if any added nodes are extension-related
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        return addedNodes.some((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            return (
              element.getAttribute('class')?.includes('extension') ||
              element.getAttribute('id')?.includes('extension') ||
              KNOWN_EXTENSION_ATTRIBUTES.some((attr) =>
                element.hasAttribute(attr)
              )
            );
          }
          return false;
        });
      }
      
      return false;
    });

    if (relevantMutations.length > 0) {
      callback(relevantMutations);
    }
  });

  // Observe the entire document for changes
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
  });

  return observer;
}

/**
 * Safe DOM manipulation that handles extension interference
 */
export function safeSetAttribute(
  element: Element,
  name: string,
  value: string
): void {
  try {
    element.setAttribute(name, value);
  } catch (error) {
    console.warn(`Could not set attribute ${name}:`, error);
  }
}

/**
 * Safe event listener addition that handles extension interference
 */
export function safeAddEventListener(
  element: Element,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
): void {
  try {
    element.addEventListener(type, listener, options);
  } catch (error) {
    console.warn(`Could not add event listener ${type}:`, error);
  }
}

/**
 * Extension-aware error handler for development
 */
export function handleExtensionError(error: Error): boolean {
  const errorMessage = error.message.toLowerCase();
  
  // Check if error is extension-related
  const isExtensionError = KNOWN_EXTENSION_ATTRIBUTES.some((attr) =>
    errorMessage.includes(attr.toLowerCase())
  ) || errorMessage.includes('extension');

  if (isExtensionError) {
    console.warn('Extension-related error detected:', error.message);
    
    // Log helpful information
    const interference = detectExtensionInterference();
    if (interference.hasInterference) {
      console.warn('Detected extensions:', interference.detectedExtensions);
      console.warn('Recommendations:', interference.recommendations);
    }
    
    return true; // Handled
  }

  return false; // Not handled
}

/**
 * Global hydration protection layer
 */
let hydrationProtectionActive = false;

/**
 * Set up global React error handler for hydration mismatches
 */
function setupGlobalHydrationProtection(): void {
  if (hydrationProtectionActive || typeof window === 'undefined') return;

  // Override React's internal error handling for hydration
  const originalError = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;

  window.onerror = (message, source, lineno, colno, error) => {
    const errorStr = String(message).toLowerCase();
    
    // Check if this is a React hydration error
    if (errorStr.includes('hydration') || 
        errorStr.includes('server rendered html') ||
        errorStr.includes('client properties') ||
        KNOWN_EXTENSION_ATTRIBUTES.some(attr => errorStr.includes(attr))) {
      
      console.warn('[Global Hydration Protection] Intercepted hydration error:', message);
      
      // Try to auto-recover by cleaning extension attributes
      setTimeout(() => {
        cleanAllExtensionAttributes();
      }, 0);
      
      return true; // Prevent error from propagating
    }
    
    return originalError ? originalError(message, source, lineno, colno, error) : false;
  };

  window.onunhandledrejection = (event) => {
    const errorStr = String(event.reason).toLowerCase();
    
    if (errorStr.includes('hydration') || 
        KNOWN_EXTENSION_ATTRIBUTES.some(attr => errorStr.includes(attr))) {
      
      console.warn('[Global Hydration Protection] Intercepted hydration rejection:', event.reason);
      
      // Clean extension attributes and prevent error
      setTimeout(() => {
        cleanAllExtensionAttributes();
      }, 0);
      
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };

  hydrationProtectionActive = true;
}

/**
 * Clean extension attributes from all elements in the document
 */
function cleanAllExtensionAttributes(): void {
  if (typeof document === 'undefined') return;

  let cleanedCount = 0;
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    const beforeCount = element.attributes.length;
    cleanExtensionAttributes(element);
    const afterCount = element.attributes.length;
    cleanedCount += beforeCount - afterCount;
  });

  if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
    console.log(`[Global Protection] Cleaned ${cleanedCount} extension attributes globally`);
  }
}

/**
 * Initialize extension compatibility layer with enhanced global protection
 */
export function initializeExtensionCompatibility(): void {
  if (typeof window === 'undefined') return;

  // Set up global hydration protection first
  setupGlobalHydrationProtection();

  // Set up enhanced mutation observer with aggressive cleanup
  createExtensionObserver((mutations) => {
    let needsCleanup = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        cleanExtensionAttributes(mutation.target);
        needsCleanup = true;
      }
      
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            cleanExtensionAttributes(node as Element);
            needsCleanup = true;
          }
        });
      }
    });

    if (needsCleanup && process.env.NODE_ENV === 'development') {
      console.log('[Extension Observer] Performed real-time cleanup');
    }
  });

  // Aggressive initial cleanup
  setTimeout(() => {
    cleanAllExtensionAttributes();
    
    const interference = detectExtensionInterference();
    if (interference.hasInterference && process.env.NODE_ENV === 'development') {
      console.warn('[Extension Compatibility] Detected extensions:', interference.detectedExtensions);
      console.info('[Extension Compatibility] Active protection enabled');
    }
  }, 500);

  // Periodic cleanup for persistent extensions
  setInterval(() => {
    cleanAllExtensionAttributes();
  }, 5000);

  console.log('[Extension Compatibility] Global hydration protection initialized');
}