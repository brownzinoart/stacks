/**
 * Mobile platform utilities for Capacitor
 * Handles platform-specific features and native capabilities
 */

// Type declarations
interface CapacitorWindow extends Window {
  Capacitor?: {
    getPlatform: () => string;
    isNativePlatform: () => boolean;
  };
}

declare const window: CapacitorWindow;

// Platform detection
export const getPlatform = () => {
  if (typeof window === 'undefined') return 'ssr';
  if (!window.Capacitor) return 'web';
  return window.Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
};

export const isIOS = () => getPlatform() === 'ios';
export const isAndroid = () => getPlatform() === 'android';
export const isMobile = () => isIOS() || isAndroid();

// Status bar configuration
export const configureStatusBar = async () => {
  if (!isMobile()) return;

  try {
    // In a real app, you'd use the StatusBar plugin
    console.log('Status bar would be configured here');
  } catch (error) {
    console.error('Failed to configure status bar:', error);
  }
};

// Keyboard utilities
export const hideKeyboard = async () => {
  if (!isMobile()) return;

  try {
    // In a real app, you'd use the Keyboard plugin
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  } catch (error) {
    console.error('Failed to hide keyboard:', error);
  }
};

// Haptic feedback
export const hapticFeedback = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (!isMobile()) return;

  try {
    // In a real app, you'd use the Haptics plugin
    console.log(`Haptic feedback: ${style}`);
  } catch (error) {
    console.error('Failed to trigger haptic feedback:', error);
  }
};

// App lifecycle
export const setupAppListeners = () => {
  if (!isMobile()) return;

  // In a real app, you'd use the App plugin
  console.log('App listeners would be set up here');
};

// Safe area insets for notched devices
export const getSafeAreaInsets = () => {
  if (!isMobile()) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // These would be provided by Capacitor plugins or CSS env() variables
  const top = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top').replace('px', '') || '0'
  );
  const bottom = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom').replace('px', '') || '0'
  );

  return { top, bottom, left: 0, right: 0 };
};
