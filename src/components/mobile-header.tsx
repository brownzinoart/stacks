/**
 * Mobile header with STACKS logo and profile avatar
 * Follows Apple Human Interface Guidelines for safe areas
 * Adapts to all iPhone models including Dynamic Island
 */

'use client';

import Image from 'next/image';

interface MobileHeaderProps {
  className?: string;
}

export const MobileHeader = ({ className = '' }: MobileHeaderProps) => {
  return (
    <header 
      className={`
        sticky top-0 z-50 
        bg-bg-light/95 backdrop-blur-md 
        border-b border-gray-200/50
        pt-12 sm:pt-16
        ${className}
      `}
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 48px)',
      }}
    >
      {/* Header content with Apple HIG spacing */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* STACKS Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-black tracking-super-tight text-text-primary">
            STACKS
          </h1>
        </div>

        {/* Profile Avatar */}
        <button 
          className="relative h-12 w-12 overflow-hidden rounded-full border-4 border-primary-purple shadow-card transition-all duration-300 hover:border-primary-pink hover:shadow-mega hover:scale-105 active:scale-95"
          aria-label="Open profile"
        >
          <Image
            src="/avatar.png"
            alt="Profile"
            width={48}
            height={48}
            className="h-full w-full object-cover"
            priority
          />
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-light bg-primary-green" />
        </button>
      </div>
    </header>
  );
};