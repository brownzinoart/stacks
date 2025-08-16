/**
 * Community page - Migrated from App Router to Pages Router
 */

import { MobileLayout } from '../src/components/mobile-layout';
// import { CommunityFeatures } from '../src/features/community/community-features';
import Head from 'next/head';

export default function CommunityPage() {
  return (
    <>
      <Head>
        <title>Community - Stacks</title>
        <meta name="description" content="Connect with other readers in your community" />
      </Head>
      
      <MobileLayout>
        <div className="px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-4xl font-black text-text-primary">
              <span className="text-primary-purple">COMMUNITY</span>
            </h1>
            <div className="rounded-3xl bg-white p-8 text-center">
              <h3 className="mb-4 text-2xl font-black text-text-primary">Coming Soon!</h3>
              <p className="text-text-secondary">Community features will be available here.</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
}