/**
 * Learning page - Educational content and learning paths
 * Features: Topic search, learning paths, skill building, and educational resources
 */

'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { TopicSearch } from '@/features/explore/topic-search';
import { LearningPaths } from '@/features/explore/learning-paths';

const LearningPage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Topic Search */}
          <div className="animate-fade-in-up">
            <TopicSearch />
          </div>

          {/* Learning Paths */}
          <div className="animate-fade-in-up animation-delay-200">
            <LearningPaths />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default LearningPage;