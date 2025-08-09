/**
 * Bottom navigation bar for mobile app experience
 * Discovery-first navigation strategy with 4 core tabs
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Compass, Library, Users, TrendingUp } from 'lucide-react';

// Navigation items configuration - Discovery-first strategy
const navigationItems = [
  { name: 'Discover', href: '/home', icon: Compass },
  { name: 'Library', href: '/ar-discovery', icon: Library },
  { name: 'Community', href: '/events', icon: Users },
  { name: 'Progress', href: '/profile', icon: TrendingUp },
];

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={clsx(
                'flex flex-col items-center justify-center rounded-lg px-1 py-2 transition-all duration-200',
                isActive
                  ? 'bg-primary-yellow text-text-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-text-primary'
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
              <span className={clsx('text-xs font-semibold', isActive ? 'font-black' : 'font-medium')}>
                {item.name}
              </span>
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
