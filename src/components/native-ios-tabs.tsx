/**
 * Ultra Bold Gen Z Tab Bar - Vibrant, Modern, No Emojis
 * Bold colors and dramatic styling to match Gen Z aesthetic
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useState, useCallback } from 'react';
import { useIOSPreloader } from '@/lib/ios-preloader';
import { 
  isCapacitor, 
  getCurrentPathInIOS, 
  isCurrentPath, 
  handleIOSNavigation 
} from '@/lib/ios-navigation';

// Modern icon representations - Home-centered strategy
const navigationItems = [
  { name: 'Learning', href: '/learning', icon: '▲', color: 'primary-blue' },
  { name: 'Discover', href: '/discover', icon: '◈', color: 'primary-purple' },
  { name: 'Home', href: '/home', icon: '▣', color: 'primary-teal', isHome: true },
  { name: 'Community', href: '/events', icon: '◆', color: 'primary-orange' },
  { name: 'Kids', href: '/kids', icon: '★', color: 'primary-pink' },
];

// Capacitor detection moved to ios-navigation.ts

export const NativeIOSTabBar = () => {
  const pathname = usePathname();
  const [isCapacitorEnv, setIsCapacitorEnv] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { preloadPage } = useIOSPreloader();

  useEffect(() => {
    const capacitorMode = isCapacitor();
    setIsCapacitorEnv(capacitorMode);
    
    if (capacitorMode) {
      // Use the centralized iOS navigation service
      setCurrentPath(getCurrentPathInIOS());
    } else {
      // In web mode, use Next.js pathname
      setCurrentPath(pathname || '/home');
    }
  }, [pathname]);

  // Navigation handler - uses iOS service for Capacitor
  const handleTabPress = useCallback((href: string) => {
    if (isTransitioning) return;
    
    setPressedTab(href);
    setIsTransitioning(true);
    
    // Clear pressed state after visual feedback
    setTimeout(() => {
      setPressedTab(null);
    }, 100);
    
    // Handle navigation based on environment
    if (isCapacitorEnv) {
      // Use iOS navigation service - prevents RSC navigation
      handleIOSNavigation(href, preloadPage);
    }
    
    // Clear transitioning state after navigation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, isCapacitorEnv, preloadPage]);

  const handleTabHover = useCallback((href: string) => {
    // Preload on hover for better UX
    if (isCapacitorEnv) {
      preloadPage(href);
    }
  }, [isCapacitorEnv, preloadPage]);

  // Debug logging for tab highlighting
  console.log('Current pathname:', currentPath, 'Capacitor:', isCapacitorEnv, 'Raw pathname:', pathname);

  // Vibrant Gen Z color styling
  const getTabStyles = (color: string, isActive: boolean, isHome: boolean = false) => {
    if (isActive) {
      const activeStyles = {
        'primary-green': { backgroundColor: '#4ADE80', color: '#FFFFFF' },
        'primary-blue': { backgroundColor: '#3B82F6', color: '#FFFFFF' },
        'primary-purple': { backgroundColor: '#A78BFA', color: '#FFFFFF' },
        'primary-orange': { backgroundColor: '#FB7185', color: '#FFFFFF' },
        'primary-pink': { backgroundColor: '#EC4899', color: '#FFFFFF' },
        'primary-teal': { backgroundColor: '#14B8A6', color: '#FFFFFF' },
      };
      const baseStyle = activeStyles[color as keyof typeof activeStyles] || {};
      return isHome ? { ...baseStyle, transform: 'scale(1.05)', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' } : baseStyle;
    }
    
    if (isHome) {
      return { color: '#A78BFA', fontWeight: '700' };
    }
    
    return { color: '#8B5CF6' };
  };

  return (
    <div className="native-ios-tabs fixed bottom-0 left-0 right-0 z-50">
      {/* Ultra Bold Gen Z Tab Bar */}
      <div
        className="border-t border-gray-200/30 bg-bg-light/95 shadow-mega backdrop-blur-xl"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-center gap-1 px-1 py-3">
          {navigationItems.map((item) => {
            // Use centralized path checking for consistency
            const isActive = isCapacitorEnv 
              ? isCurrentPath(item.href, currentPath)
              : currentPath === item.href || (item.href === '/home' && (currentPath === '/' || currentPath === ''));
            const isHome = item.isHome || false;
            const isPressed = pressedTab === item.href;

            // Debug which tab is active
            if (isActive) {
              console.log('Active tab:', item.name, 'href:', item.href, 'pathname:', pathname);
            }

            // Enhanced link props with smooth transitions
            const linkProps = {
              className: clsx(
                'flex flex-1 flex-col items-center justify-center',
                'rounded-3xl px-1 py-3',
                'tab-instant-feedback',
                'transform transition-all duration-300',
                isPressed && 'tab-pressed',
                isActive ? 'shadow-card' : isHome ? 'opacity-85' : 'opacity-70',
                isHome ? '-translate-y-2' : '',
                isTransitioning && isActive && 'transition-loading'
              ),
              style: getTabStyles(item.color, isActive, isHome),
              onTouchStart: () => handleTabPress(item.href),
              onMouseEnter: () => handleTabHover(item.href)
            };

            const linkContent = (
              <>
                {/* Icon */}
                <div
                  className={clsx(
                    'mb-1 transition-all duration-300',
                    isHome ? 'text-2xl font-black' : 'text-xl font-black',
                    isActive ? 'scale-110 transform' : isHome ? 'scale-105 transform' : ''
                  )}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={clsx(
                    'text-xs transition-all duration-300', 
                    isActive ? 'font-extra-bold' : isHome ? 'font-bold' : 'font-medium'
                  )}
                >
                  {item.name}
                </span>
              </>
            );

            if (isCapacitorEnv) {
              // Use button for iOS - navigation handled by handleTabPress
              return (
                <button
                  key={item.name}
                  {...linkProps}
                  type="button"
                  onClick={() => handleTabPress(item.href)}
                >
                  {linkContent}
                </button>
              );
            }

            // Use Next.js Link for web
            return (
              <Link
                key={item.name}
                {...linkProps}
                href={item.href}
              >
                {linkContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
