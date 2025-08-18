/**
 * NavigationCard component - Ultra Bold Gen Z Dashboard Cards
 * Reusable cards for the home dashboard navigation
 */

'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { getContrastSafeTextColor } from '@/lib/color-contrast';

interface NavigationCardProps {
  title: string;
  subtitle: string;
  href?: string;
  gradient?: string;
  icon?: string;
  badge?: string;
  stat?: string;
  action?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const NavigationCard = ({
  title,
  subtitle,
  href,
  gradient = 'bg-primary-blue',
  icon,
  badge,
  stat,
  action,
  children,
  className = '',
  onClick,
  isLoading = false
}: NavigationCardProps) => {
  // Get contrast-safe text color based on background
  const textColor = getContrastSafeTextColor(gradient);
  
  // Debug logging removed - gradient issue resolved
  
  // Use the proper contrast-safe text color (fixed the mapping for light gradients)
  const finalTextColor = textColor;
  
  const cardContent = (
    <div 
      className={`
        group relative aspect-[4/3] max-h-40 overflow-hidden rounded-3xl p-4 shadow-mega 
        transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_32px_64px_rgba(0,0,0,0.4)]
        active:scale-95 cursor-pointer touch-feedback
        focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2
        min-h-touch-md
        ${gradient}
        ${finalTextColor}
        ${className}
        ${isLoading ? 'animate-pulse' : ''}
      `}
      style={{ transformOrigin: 'center' }}
      onClick={onClick}
    >
        {/* Background Decorative Elements */}
        <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl transition-all duration-1000 ${
          isLoading ? 'animate-pulse' : ''
        }`} />
        <div className={`absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/20 blur-lg transition-all duration-1000 ${
          isLoading ? 'animate-pulse' : ''
        }`} />
        
        {/* Badge */}
        {badge && (
          <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
            {badge}
          </div>
        )}
        
        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}
          {icon && (
            <div className="mb-4 text-4xl">
              {icon}
            </div>
          )}
          
          {/* Title */}
          <h2 className="mb-2 text-xl md:text-2xl font-black leading-tight tracking-tighter text-white">
            {title}
          </h2>
          
          {/* Subtitle */}
          <p className="mb-auto text-sm md:text-base font-bold leading-snug text-white/90">
            {subtitle}
          </p>
          
          {/* Bottom Section */}
          <div className="mt-4">
            {/* Stat */}
            {stat && (
              <div className="mb-2 text-lg md:text-xl font-black text-white">
                {stat}
              </div>
            )}
            
            {/* Action */}
            {action && (
              <div className="text-sm font-bold text-white/80">
                {action}
              </div>
            )}
            
            {/* Custom Children */}
            {children && (
              <div className="mt-2">
                {children}
              </div>
            )}
          </div>
        </div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
  );
  
  // Return wrapped in Link if href provided, otherwise return bare card
  if (href && !onClick) {
    return <Link href={href}>{cardContent}</Link>;
  }
  
  return cardContent;
};