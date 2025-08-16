/**
 * Kids page - Migrated from App Router to Pages Router
 */

import { MobileLayout } from '../src/components/mobile-layout';
import Head from 'next/head';

export default function KidsPage() {
  return (
    <>
      <Head>
        <title>Kids - Stacks</title>
        <meta name="description" content="Books and activities for children" />
      </Head>
      
      <MobileLayout>
        <div className="px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-4xl font-black text-text-primary">
              <span className="text-primary-pink">KIDS</span>
            </h1>
            <div className="rounded-3xl bg-white p-8 text-center">
              <h3 className="mb-4 text-2xl font-black text-text-primary">Coming Soon!</h3>
              <p className="text-text-secondary">Books and activities for children will be available here.</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
}