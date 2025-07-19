/**
 * Explore & Learn page - Topic bundles and learning paths
 * Features: Topic search, learning paths, branch aggregation
 */

import { Navigation } from '@/components/navigation';
import { TopicSearch } from '@/features/explore/topic-search';
import { LearningPaths } from '@/features/explore/learning-paths';
import { BranchAvailability } from '@/features/explore/branch-availability';

const ExplorePage = () => {
  return (
    <div className="flex h-full flex-col">
      <Navigation />
      
      <main className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-text-primary">
              Explore & Learn
            </h1>
            <p className="mt-2 text-text-secondary">
              Curated book collections to master any topic
            </p>
          </header>

          <TopicSearch />
          <LearningPaths />
          <BranchAvailability />
        </div>
      </main>
    </div>
  );
};

export default ExplorePage; 