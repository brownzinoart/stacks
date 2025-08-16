/**
 * Bottom navigation bar for mobile app experience
 * Home-first navigation strategy with 4 core tabs
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useState, useCallback } from 'react';
import { Compass, Library, Users, TrendingUp, GraduationCap, Star } from 'lucide-react';
import { useIOSPreloader } from '@/lib/ios-preloader';
import { 
  isCapacitor, 
  getCurrentPathInIOS, 
  isCurrentPath, 
  handleIOSNavigation 
} from '@/lib/ios-navigation';

// Navigation items configuration - Home-centered strategy
const navigationItems = [
  { name: 'Learning', href: '/learning', icon: GraduationCap },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Home', href: '/home', icon: Library, isHome: true },
  { name: 'Community', href: '/events', icon: Users },
  { name: 'Kids', href: '/kids', icon: Star },
];

// Capacitor detection moved to ios-navigation.ts

export const BottomNavigation = () => {
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

  return (
    <nav className="bottom-navigation pb-safe fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          // Use centralized path checking for consistency
          const isActive = isCapacitorEnv 
            ? isCurrentPath(item.href, currentPath)
            : currentPath === item.href || (item.href === '/home' && (currentPath === '/' || currentPath === ''));
          const isHome = item.isHome || false;
          const isPressed = pressedTab === item.href;

          // Enhanced link props with smooth transitions
          const linkProps = {
            className: clsx(
              'flex flex-col items-center justify-center rounded-lg px-1 py-2',
              'tab-instant-feedback transition-all duration-200',
              isPressed && 'tab-pressed',
              isActive
                ? 'bg-primary-yellow text-text-primary'
                : 'text-gray-500 hover:bg-gray-50 hover:text-text-primary',
              isHome ? '-translate-y-1 transform' : '',
              isTransitioning && isActive && 'transition-loading'
            ),
            onTouchStart: () => handleTabPress(item.href),
            onMouseEnter: () => handleTabHover(item.href)
          };

          const linkContent = (
            <>
              <Icon 
                size={isHome ? 28 : 24} 
                strokeWidth={isActive ? 2.5 : isHome ? 2.2 : 2} 
                className="mb-1" 
              />
              <span className={clsx(
                'text-xs font-semibold', 
                isActive ? 'font-black' : isHome ? 'font-bold' : 'font-medium'
              )}>
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
              href={item.href as any}
            >
              {linkContent}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Header component to complement the bottom navigation
export const MobileHeader = () => {
  return (
    <header className="pt-safe fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-center px-4">
        <h1 className="text-2xl font-black tracking-tight text-text-primary">STACKS</h1>
      </div>
    </header>
  );
};
