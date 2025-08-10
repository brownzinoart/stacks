/**
 * Root layout component for Stacks - Modern Library Web App
 * Provides global styling, metadata, and application shell
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { OptimizedAppShell } from '@/components/optimized-app-shell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stacks - Modern Library Discovery',
  description: 'AI-powered book discovery and library experience',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Stacks',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3B82F6',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('[SW] Registration successful:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('[SW] Registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-bg-light antialiased`} suppressHydrationWarning={true}>
        <div id="root" className="flex h-full flex-col">
          <OptimizedAppShell>
            {children}
          </OptimizedAppShell>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
