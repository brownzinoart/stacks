/**
 * Custom App component for Next.js Pages Router
 * Migrated from App Router layout.tsx - provides global styling and app shell
 */

import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../src/app/globals.css';
import '../src/styles/smooth-transitions.css';
import { OptimizedAppShell } from '../src/components/optimized-app-shell';
import { HydrationErrorBoundary } from '../src/components/hydration-error-boundary';
import { useEffect } from 'react';
import { initializeExtensionCompatibility } from '../src/lib/extension-compatibility';
import { initializePreHydrationSanitizer } from '../src/lib/pre-hydration-sanitizer';

// Import test utilities in development
if (process.env.NODE_ENV === 'development') {
  require('../src/lib/hydration-test');
}

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  // Initialize extension compatibility layers
  useEffect(() => {
    // Initialize pre-hydration sanitizer first (most aggressive)
    initializePreHydrationSanitizer({
      aggressive: true,
      logCleaning: process.env.NODE_ENV === 'development',
    });
    
    // Then initialize general extension compatibility
    initializeExtensionCompatibility();
  }, []);

  return (
    <HydrationErrorBoundary
      suppressConsoleErrors={true}
      maxRetries={3}
      onHydrationError={(error) => {
        // Optional: track hydration errors in analytics
        if (process.env.NODE_ENV === 'development') {
          console.warn('Hydration error tracked:', error.message);
        }
      }}
    >
      <div className={`${inter.className} h-full bg-bg-light antialiased`}>
        <div id="root" className="flex h-full flex-col">
          <OptimizedAppShell>
            <Component {...pageProps} />
          </OptimizedAppShell>
        </div>
      </div>
    </HydrationErrorBoundary>
  );
}