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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-secondary border-t-[5px] border-black dark:border-white">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full group relative"
            >
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
              <div className="mb-1">
                <Icon
                  className={`w-6 h-6 stroke-[2.5] ${
                    !isActive ? 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white' : ''
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
                className={`text-xs font-bold uppercase ${
                  !isActive ? "text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400" : ""
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
