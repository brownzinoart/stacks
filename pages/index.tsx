/**
 * Root/Index page - Redirects to home page for consistency with App Router behavior
 * Migrated from App Router to Pages Router for iOS Capacitor compatibility
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page to maintain same routing behavior as App Router
    router.replace('/home');
  }, [router]);

  return (
    <>
      <Head>
        <title>Stacks - Modern Library Discovery</title>
        <meta name="description" content="AI-powered book discovery and library experience" />
      </Head>
      
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <div className="text-center">
          <h1 className="text-2xl font-black text-text-primary">STACKS</h1>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    </>
  );
}