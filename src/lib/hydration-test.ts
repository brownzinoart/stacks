/**
 * Hydration Fix Test Utilities
 * Test and validate the comprehensive hydration error protection
 */

import { getPreHydrationSanitizer } from './pre-hydration-sanitizer';
import { detectExtensionInterference } from './extension-compatibility';

/**
 * Test if hydration protection is working
 */
export function testHydrationProtection(): {
  sanitizerActive: boolean;
  extensionsDetected: string[];
  protectionLayers: string[];
  recommendations: string[];
} {
  const results = {
    sanitizerActive: false,
    extensionsDetected: [] as string[],
    protectionLayers: [] as string[],
    recommendations: [] as string[],
  };

  // Check pre-hydration sanitizer
  const sanitizer = getPreHydrationSanitizer();
  if (sanitizer) {
    results.sanitizerActive = true;
    results.protectionLayers.push('Pre-hydration DOM sanitizer');
  }

  // Check extension detection
  const interference = detectExtensionInterference();
  results.extensionsDetected = interference.detectedExtensions;
  results.recommendations = interference.recommendations;

  // Check if error boundary is present
  const errorBoundaries = document.querySelectorAll('[class*="hydration-error"]');
  if (errorBoundaries.length > 0) {
    results.protectionLayers.push('Hydration error boundary');
  }

  // Check if global protection is active
  if (typeof window !== 'undefined' && window.onerror) {
    results.protectionLayers.push('Global error interception');
  }

  return results;
}

/**
 * Manually trigger extension attribute cleanup (for testing)
 */
export function manualCleanupTest(): {
  beforeCount: number;
  afterCount: number;
  cleaned: number;
} {
  if (typeof document === 'undefined') {
    return { beforeCount: 0, afterCount: 0, cleaned: 0 };
  }

  const allElements = document.querySelectorAll('*');
  let beforeCount = 0;
  let afterCount = 0;

  // Count attributes before
  allElements.forEach(el => {
    beforeCount += el.attributes.length;
  });

  // Trigger manual cleanup
  const { triggerManualCleanup } = require('./pre-hydration-sanitizer');
  triggerManualCleanup();

  // Count attributes after
  setTimeout(() => {
    allElements.forEach(el => {
      afterCount += el.attributes.length;
    });
  }, 100);

  return {
    beforeCount,
    afterCount,
    cleaned: beforeCount - afterCount,
  };
}

/**
 * Inject test extension attributes (for testing)
 */
export function injectTestExtensionAttributes(): void {
  if (typeof document === 'undefined') return;

  const testAttributes = [
    'katalonextensionid',
    'grammarly-extension',
    'test-extension-attr',
  ];

  testAttributes.forEach((attr, index) => {
    const testElement = document.createElement('div');
    testElement.setAttribute(attr, `test-value-${index}`);
    testElement.style.display = 'none';
    document.body.appendChild(testElement);
  });

  console.log('[Test] Injected test extension attributes for cleanup testing');
}

/**
 * Log hydration protection status
 */
export function logProtectionStatus(): void {
  if (typeof window === 'undefined') return;

  const status = testHydrationProtection();
  
  console.group('🛡️ Hydration Protection Status');
  console.log('Active Protection Layers:', status.protectionLayers);
  console.log('Sanitizer Active:', status.sanitizerActive);
  console.log('Extensions Detected:', status.extensionsDetected);
  
  if (status.extensionsDetected.length > 0) {
    console.warn('Extension Interference Detected!');
    console.log('Recommendations:', status.recommendations);
  } else {
    console.log('✅ No extension interference detected');
  }
  
  console.groupEnd();
}

// Auto-run status check in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    logProtectionStatus();
  }, 2000);
}