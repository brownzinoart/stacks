/**
 * Similarity Badge Component
 * Displays how closely a book matches the user's reading history
 */

'use client';

import { useState } from 'react';
import type { SimilarityScore } from '@/lib/reading-history';

interface SimilarityBadgeProps {
  score: SimilarityScore;
  className?: string;
}

export const SimilarityBadge = ({ score, className = '' }: SimilarityBadgeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!score || score.score === 0) {
    return null;
  }

  const getColorClass = (value: number) => {
    if (value >= 80) return 'bg-primary-green text-white';
    if (value >= 60) return 'bg-primary-blue text-white';
    if (value >= 40) return 'bg-primary-orange text-text-primary';
    return 'bg-primary-purple text-white';
  };

  const getLabel = (value: number) => {
    if (value >= 80) return 'Perfect Match';
    if (value >= 60) return 'Great Match';
    if (value >= 40) return 'Good Match';
    if (value >= 20) return 'Worth Exploring';
    return 'New Discovery';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`${getColorClass(score.score)} shadow-backdrop rounded-full px-4 py-2 text-sm font-black transition-transform hover:scale-105`}
      >
        {score.score}% Match
      </button>
      
      {showTooltip && score.reasons.length > 0 && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform">
          <div className="rounded-lg bg-text-primary p-3 text-sm text-white shadow-lg">
            <div className="mb-1 font-bold">{getLabel(score.score)}</div>
            <ul className="space-y-1">
              {score.reasons.map((reason, idx) => (
                <li key={idx} className="text-xs opacity-90">• {reason}</li>
              ))}
            </ul>
            <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-text-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
};