/**
 * Ultra Bold Gen Z Tab Bar - Vibrant, Modern, No Emojis
 * Bold colors and dramatic styling to match Gen Z aesthetic
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

// Modern icon representations - Discovery-first strategy
const navigationItems = [
  { name: 'Learning', href: '/learning', icon: '▲', color: 'primary-blue' },
  { name: 'Library', href: '/ar-discovery', icon: '▣', color: 'primary-teal' },
  { name: 'Discover', href: '/home', icon: '◈', color: 'primary-purple', isHome: true },
  { name: 'Community', href: '/events', icon: '◆', color: 'primary-orange' },
  { name: 'Kids', href: '/kids', icon: '★', color: 'primary-pink' },
];

export const NativeIOSTabBar = () => {
  const pathname = usePathname();

  // Debug logging for tab highlighting
  console.log('Current pathname:', pathname);

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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Ultra Bold Gen Z Tab Bar */}
      <div
        className="border-t border-gray-200/30 bg-bg-light/95 shadow-mega backdrop-blur-xl"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-center gap-1 px-1 py-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const isHome = item.isHome || false;

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
                  'rounded-3xl px-1 py-3',
                  'transform hover:scale-105 active:scale-95',
                  isActive ? 'shadow-card' : isHome ? 'opacity-85' : 'opacity-70',
                  isHome ? '-translate-y-2' : ''
                )}
                style={getTabStyles(item.color, isActive, isHome)}
              >
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
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
