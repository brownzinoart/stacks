/**
 * Custom App component for Next.js Pages Router
 * Migrated from App Router layout.tsx - provides global styling and app shell
 */

import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../src/app/globals.css';
import '../src/styles/smooth-transitions.css';
import { OptimizedAppShell } from '../src/components/optimized-app-shell';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.className} h-full bg-bg-light antialiased`}>
      <div id="root" className="flex h-full flex-col">
        <OptimizedAppShell>
          <Component {...pageProps} />
        </OptimizedAppShell>
      </div>
    </div>
  );
}