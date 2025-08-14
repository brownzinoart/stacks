/**
 * Bottom navigation bar for mobile app experience
 * Home-first navigation strategy with 4 core tabs
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Compass, Library, Users, TrendingUp, GraduationCap, Star } from 'lucide-react';

// Navigation items configuration - Home-centered strategy
const navigationItems = [
  { name: 'Learning', href: '/learning', icon: GraduationCap },
  { name: 'Discover', href: '/discover', icon: Compass },
  { name: 'Home', href: '/home', icon: Library, isHome: true },
  { name: 'Community', href: '/events', icon: Users },
  { name: 'Kids', href: '/kids', icon: Star },
];

// Detect if running in Capacitor (mobile app)
const isCapacitor = () => {
  if (typeof window === 'undefined') return false;
  return !!(
    window.Capacitor ||
    (window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'
  );
};

export const BottomNavigation = () => {
  const pathname = usePathname();
  const [isCapacitorEnv, setIsCapacitorEnv] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const capacitorMode = isCapacitor();
    setIsCapacitorEnv(capacitorMode);
    
    if (capacitorMode) {
      // In Capacitor, use window.location.pathname and parse it
      const path = window.location.pathname;
      // Remove /index.html suffix and handle root case
      const cleanPath = path.replace('/index.html', '') || '/';
      setCurrentPath(cleanPath);
    } else {
      // In web mode, use Next.js pathname
      setCurrentPath(pathname);
    }
  }, [pathname]);

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          const isHome = item.isHome || false;

          // Common link props and content
          const linkProps = {
            className: clsx(
              'flex flex-col items-center justify-center rounded-lg px-1 py-2 transition-all duration-200',
              isActive
                ? 'bg-primary-yellow text-text-primary'
                : 'text-gray-500 hover:bg-gray-50 hover:text-text-primary',
              isHome ? '-translate-y-1 transform' : ''
            )
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
            // Use standard HTML link for Capacitor
            const htmlHref = `${item.href}/index.html`;
            return (
              <a
                key={item.name}
                {...linkProps}
                href={htmlHref}
              >
                {linkContent}
              </a>
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
