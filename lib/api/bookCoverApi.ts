/**
 * DEPRECATED: This file is maintained for backward compatibility.
 * Please import from lib/services/bookCover.ts instead.
 */

// Re-export from new service location
export {
  getOpenLibraryCover,
  checkCoverExists,
  getCoverWithFallback,
  getGradientFallback,
} from '../services/bookCover';

export type { CoverSize } from '../services/bookCover';
