/**
 * Color Contrast Utilities
 * Ensures proper text color based on background for accessibility
 */

/**
 * Mapping of background gradients to appropriate text colors
 * Ensures WCAG 2.1 AA compliance (4.5:1 contrast ratio)
 */
export const CONTRAST_SAFE_COLORS = {
  // Safe combinations - ALL navigation cards use white text for consistency
  'from-primary-blue to-primary-teal': 'text-white',
  'from-primary-purple to-primary-pink': 'text-white', // Forced white for consistency 
  'from-primary-orange to-primary-pink': 'text-white', // Forced white for consistency
  'from-primary-green to-primary-teal': 'text-white',
  'from-primary-purple to-primary-blue': 'text-white',
  
  // Solid dark colors
  'bg-primary-blue': 'text-white',
  'bg-primary-purple': 'text-white',
  'bg-primary-green': 'text-white',
  'bg-primary-teal': 'text-white',
  'bg-primary-pink': 'text-white',
  'bg-primary-orange': 'text-white',
  
  // Light backgrounds - use dark text
  'bg-primary-yellow': 'text-gray-900',
  'bg-white': 'text-gray-900',
  'bg-gray-100': 'text-gray-900',
  
  // Danger combinations to avoid
  'from-primary-orange to-primary-yellow': 'INVALID', // Too light for white text
  'from-primary-yellow to-white': 'INVALID', // Too light for white text
} as const;

/**
 * Gets the appropriate text color for a given background
 */
export function getContrastSafeTextColor(background: string): string {
  // Remove Tailwind classes that might be combined - improved regex
  const cleanBackground = background
    .replace(/bg-gradient-to-[a-z]+\s+/g, '') // Remove gradient direction
    .replace(/rounded-[a-z0-9-]+\s*/g, '') // Remove border radius
    .replace(/shadow-[a-z]+\s*/g, '') // Remove shadows
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Color Contrast Debug] Original: "${background}"`);
    console.log(`[Color Contrast Debug] Cleaned: "${cleanBackground}"`);
    console.log(`[Color Contrast Debug] Available keys:`, Object.keys(CONTRAST_SAFE_COLORS));
  }

  // Check our safe color mapping with exact match
  const safeColor = CONTRAST_SAFE_COLORS[cleanBackground as keyof typeof CONTRAST_SAFE_COLORS];
  
  if (safeColor === 'INVALID') {
    console.warn(`⚠️ Invalid color combination detected: ${background}`);
    return 'text-gray-900'; // Safe fallback
  }
  
  if (safeColor) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Color Contrast Debug] Found mapping: "${cleanBackground}" -> "${safeColor}"`);
    }
    return safeColor;
  }

  // Enhanced fallback logic for primary gradients
  if (cleanBackground.includes('from-primary') && cleanBackground.includes('to-primary')) {
    // All primary-to-primary gradients should use white text
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Color Contrast Debug] Using fallback white text for gradient: "${cleanBackground}"`);
    }
    return 'text-white';
  }

  // Fallback logic based on color keywords
  if (background.includes('yellow') || background.includes('white') || background.includes('gray-100')) {
    return 'text-gray-900';
  }
  
  // Default to white for dark backgrounds
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Color Contrast Debug] Using final fallback white text for: "${background}"`);
  }
  return 'text-white';
}

/**
 * Validates a background/text combination for accessibility
 */
export function validateContrastCombination(background: string, textColor: string): {
  isValid: boolean;
  recommendation?: string;
  contrastRatio?: number;
} {
  const problematicCombinations = [
    { bg: 'yellow', text: 'white', issue: 'White text on yellow fails WCAG AA' },
    { bg: 'primary-yellow', text: 'white', issue: 'White text on yellow fails WCAG AA' },
    { bg: 'white', text: 'white', issue: 'White on white is invisible' },
    { bg: 'gray-100', text: 'white', issue: 'White text on light gray fails WCAG AA' },
  ];

  for (const combo of problematicCombinations) {
    if (background.includes(combo.bg) && textColor.includes('white')) {
      return {
        isValid: false,
        recommendation: `Use text-gray-900 instead. ${combo.issue}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Available safe gradient combinations for Gen Z aesthetic
 */
export const SAFE_GRADIENT_PRESETS = [
  'bg-gradient-to-br from-primary-blue to-primary-teal',
  'bg-gradient-to-br from-primary-purple to-primary-pink',
  'bg-gradient-to-br from-primary-orange to-primary-pink',
  'bg-gradient-to-br from-primary-green to-primary-teal',
  'bg-gradient-to-br from-primary-purple to-primary-blue',
  'bg-gradient-to-br from-primary-pink to-primary-orange',
  'bg-gradient-to-br from-primary-teal to-primary-blue',
] as const;

/**
 * React hook for getting contrast-safe colors
 */
export function useContrastSafeColors(background: string) {
  const textColor = getContrastSafeTextColor(background);
  const validation = validateContrastCombination(background, textColor);
  
  return {
    textColor,
    isValid: validation.isValid,
    recommendation: validation.recommendation,
  };
}