/**
 * Ultra Bold Gen Z Tab Bar - Vibrant, Modern, No Emojis
 * Bold colors and dramatic styling to match Gen Z aesthetic
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

// Modern icon representations without emojis
const navigationItems = [
  { name: 'Learning', href: '/discovery', icon: '◈', color: 'primary-green' },
  { name: 'Explore', href: '/explore', icon: '◐', color: 'primary-blue' },
  { name: 'Stacks', href: '/home', icon: '▣', color: 'primary-purple' },
  { name: 'Events', href: '/events', icon: '◆', color: 'primary-orange' },
  { name: 'Profile', href: '/profile', icon: '●', color: 'primary-pink' },
];

export const NativeIOSTabBar = () => {
  const pathname = usePathname();

  // Debug logging for tab highlighting
  console.log('Current pathname:', pathname);

  // Vibrant Gen Z color styling
  const getTabStyles = (color: string, isActive: boolean) => {
    if (isActive) {
      const activeStyles = {
        'primary-green': { backgroundColor: '#4ADE80', color: '#FFFFFF' },
        'primary-blue': { backgroundColor: '#3B82F6', color: '#FFFFFF' },
        'primary-purple': { backgroundColor: '#A78BFA', color: '#FFFFFF' },
        'primary-orange': { backgroundColor: '#FB7185', color: '#FFFFFF' },
        'primary-pink': { backgroundColor: '#EC4899', color: '#FFFFFF' },
      };
      return activeStyles[color as keyof typeof activeStyles] || {};
    }
    return { color: '#8B5CF6' };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Ultra Bold Gen Z Tab Bar */}
      <div
        className="border-t border-gray-200/30 bg-bg-light/95 shadow-mega backdrop-blur-xl"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-center gap-1 px-2 py-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            // Debug which tab is active
            if (isActive) {
              console.log('Active tab:', item.name, 'href:', item.href, 'pathname:', pathname);
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex flex-1 flex-col items-center justify-center transition-all duration-300',
                  'rounded-3xl px-2 py-3',
                  'transform hover:scale-105 active:scale-95',
                  isActive ? 'shadow-card' : 'opacity-70'
                )}
                style={getTabStyles(item.color, isActive)}
              >
                {/* Icon */}
                <div
                  className={clsx(
                    'mb-1 text-2xl font-black transition-all duration-300',
                    isActive ? 'scale-110 transform' : ''
                  )}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={clsx('text-xs transition-all duration-300', isActive ? 'font-extra-bold' : 'font-medium')}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
