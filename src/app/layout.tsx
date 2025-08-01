/**
 * Root layout component for Stacks - Modern Library Web App
 * Provides global styling, metadata, and application shell
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stacks - Modern Library Discovery',
  description: 'AI-powered book discovery and library experience',
  manifest: '/manifest.json',
  themeColor: '#FBF7F4',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <body className={`${inter.className} h-full bg-bg-light antialiased`} suppressHydrationWarning={true}>
        <div id="root" className="flex h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
