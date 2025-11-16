/**
 * Capacitor type declarations
 */

interface Window {
  Capacitor?: {
    isNativePlatform(): boolean;
    getPlatform(): 'ios' | 'android' | 'web';
    isPluginAvailable(name: string): boolean;
    [key: string]: any;
  };
}
