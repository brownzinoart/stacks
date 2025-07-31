/**
 * Main navigation component for Stacks
 * Ultra Bold Gen Z navigation with dramatic styling
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navigationItems = [
  { name: 'Home', href: '/home' },
  { name: 'Discover', href: '/explore' },
  { name: 'Events', href: '/events' },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden">
      <div className="hidden mx-auto max-w-7xl px-8 md:block">
        <div className="flex h-24 items-center justify-between">
          <Link
            href="/home"
            className="text-3xl font-black tracking-super-tight text-text-primary transition-transform duration-300 hover:scale-105"
          >
            STACKS
          </Link>

          <div className="hidden items-center space-x-3 md:flex">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={clsx(
                    'rounded-pill px-8 py-4 text-lg font-black transition-all duration-300 hover:scale-105',
                    isActive
                      ? 'bg-text-primary text-white shadow-card'
                      : 'text-text-secondary hover:bg-primary-yellow hover:text-text-primary hover:shadow-card'
                  )}
                >
                  {item.name.toUpperCase()}
                </Link>
              );
            })}
          </div>

          {/* Profile Picture */}
          <button
            className="h-16 w-16 overflow-hidden rounded-full border-4 border-primary-orange shadow-card transition-transform duration-300 hover:scale-105 hover:shadow-card-hover"
            onClick={() => {
              // TODO: Navigate to user settings/profile page
              window.location.href = '/settings';
            }}
          >
            <img src="/avatar.png" alt="Profile" className="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      {/* Mobile navigation - hidden for native iOS tabs */}
      <div className="hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-3 gap-2 px-6 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={clsx(
                  'flex flex-col items-center rounded-xl px-3 py-4 text-xs font-black transition-all duration-300',
                  isActive ? 'bg-primary-yellow text-text-primary shadow-card' : 'text-text-secondary hover:bg-gray-100'
                )}
              >
                <div
                  className={clsx(
                    'mb-2 h-8 w-8 rounded-full transition-all duration-300',
                    isActive ? 'scale-110 bg-text-primary' : 'bg-gray-300'
                  )}
                />
                <span className="uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
