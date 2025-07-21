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
    <nav className="bg-white shadow-card">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/home" className="text-3xl font-black text-text-primary tracking-super-tight hover:scale-105 transition-transform duration-300">
            STACKS
          </Link>
          
          <div className="hidden md:flex items-center space-x-3">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  className={clsx(
                    'px-8 py-4 rounded-pill font-black text-lg transition-all duration-300 hover:scale-105',
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
            className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary-orange shadow-card hover:scale-105 transition-transform duration-300 hover:shadow-card-hover"
            onClick={() => {
              // TODO: Navigate to user settings/profile page
              window.location.href = '/settings';
            }}
          >
            <img 
              src="/avatar.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
          

        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-3 bg-white px-6 py-4 gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={clsx(
                  'flex flex-col items-center py-4 px-3 text-xs font-black transition-all duration-300 rounded-xl',
                  isActive
                    ? 'text-text-primary bg-primary-yellow shadow-card'
                    : 'text-text-secondary hover:bg-gray-100'
                )}
              >
                <div className={clsx(
                  'w-8 h-8 rounded-full mb-2 transition-all duration-300',
                  isActive ? 'bg-text-primary scale-110' : 'bg-gray-300'
                )} />
                <span className="uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 
