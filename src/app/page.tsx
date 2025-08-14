/**
 * Root page component - client-side redirect to /home
 * Compatible with static export for iOS app
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RootPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light">
      <div className="text-center">
        <h1 className="text-2xl font-black text-text-primary">STACKS</h1>
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
};

export default RootPage;
