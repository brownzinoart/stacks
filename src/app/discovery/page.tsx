/**
 * Discovery page - AR shelf scanning and branch exploration
 * Features: Standard search, AR shelf scan, branch explorer
 */

import { Navigation } from '@/components/navigation';
import { StandardSearch } from '@/features/ar/standard-search';
import { ARShelfScan } from '@/features/ar/ar-shelf-scan';
import { BranchExplorer } from '@/features/ar/branch-explorer';

const DiscoveryPage = () => {
  return (
    <div className="flex h-full flex-col">
      <Navigation />
      
      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Discovery
            </h1>
            <p className="mt-2 text-text-secondary">
              Scan shelves and explore your library in AR
            </p>
          </header>

          <StandardSearch />
          <ARShelfScan />
          <BranchExplorer />
        </div>
      </main>
    </div>
  );
};

export default DiscoveryPage; 