/**
 * Mobile layout with header and native iOS-style tab bar
 * Uses CSS to perfectly mimic native iOS tabs
 */

'use client';

import { MobileHeader } from './mobile-header';
import { NativeIOSTabBar } from './native-ios-tabs';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <>
      <MobileHeader />
      <main className="flex-1 overflow-auto bg-bg-light pb-20 pt-1" suppressHydrationWarning>
        {children}
      </main>
      <NativeIOSTabBar />
    </>
  );
};
