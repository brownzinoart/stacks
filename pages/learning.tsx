/**
 * Learning page - Migrated from App Router to Pages Router
 */

import { MobileLayout } from '../src/components/mobile-layout';
import Head from 'next/head';

export default function LearningPage() {
  return (
    <>
      <Head>
        <title>Learning - Stacks</title>
        <meta name="description" content="Educational resources and learning paths" />
      </Head>
      
      <MobileLayout>
        <div className="px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-6 text-4xl font-black text-text-primary">
              <span className="text-primary-blue">LEARNING</span>
            </h1>
            <div className="rounded-3xl bg-white p-8 text-center">
              <h3 className="mb-4 text-2xl font-black text-text-primary">Coming Soon!</h3>
              <p className="text-text-secondary">Educational resources and learning paths will be available here.</p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
}