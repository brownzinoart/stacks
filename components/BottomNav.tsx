"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Compass, TrendingUp } from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/stacks", label: "Stacks", icon: BookOpen },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/reading", label: "Reading", icon: TrendingUp },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-light-secondary/95 dark:bg-dark-secondary/95 backdrop-blur-md border-t-[5px] border-light-border dark:border-dark-border">
      {/* Decorative gradient accent bar on top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-riso-purple-pink opacity-20"></div>

      <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href) || false;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full group relative transition-transform active:scale-95"
            >
              {/* Active indicator blob */}
              {isActive && (
                <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-8 h-1 bg-riso-purple-pink rounded-full shadow-brutal-badge pop-in"></div>
              )}

              {/* SVG gradient definition */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id={`gradient-${item.href}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fa709a' }} />
                    <stop offset="50%" style={{ stopColor: '#f093fb' }} />
                    <stop offset="100%" style={{ stopColor: '#f5576c' }} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Icon with gradient stroke */}
              <div className={`mb-1 transition-all ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                <Icon
                  className={`w-6 h-6 stroke-[3] transition-all ${
                    !isActive ? 'text-light-textSecondary dark:text-dark-textSecondary group-hover:text-light-text dark:group-hover:text-dark-text' : ''
                  }`}
                  style={
                    isActive
                      ? { stroke: `url(#gradient-${item.href})`, color: 'transparent' }
                      : undefined
                  }
                />
              </div>

              {/* Label with gradient text */}
              <span
                className={`font-display text-xs font-black uppercase tracking-tight transition-all ${
                  !isActive ? "text-light-textTertiary dark:text-dark-textTertiary group-hover:text-light-textSecondary dark:group-hover:text-dark-textSecondary" : ""
                }`}
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, #fa709a 0%, #f093fb 50%, #f5576c 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }
                    : undefined
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
