/**
 * Bottom navigation bar for mobile app experience
 * Supports up to 6 tabs with icons
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  Home, 
  Search, 
  Calendar, 
  QrCode, 
  User,
  Sparkles,
  BookOpen,
  MapPin
} from 'lucide-react';

// Navigation items configuration - can support up to 6 items
const navigationItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Scan', href: '/discovery', icon: QrCode },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Profile', href: '/profile', icon: User },
  // Future tab example (uncomment when needed):
  // { name: 'Library', href: '/library', icon: MapPin },
];

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
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
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className="mb-1"
              />
              <span className={clsx(
                'text-xs font-semibold',
                isActive ? 'font-black' : 'font-medium'
              )}>
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
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-gray-200 bg-white pt-safe">
      <div className="flex h-14 items-center justify-center px-4">
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          STACKS
        </h1>
      </div>
    </header>
  );
};