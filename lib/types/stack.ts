/**
 * Stack-related type definitions
 */

import type { BookMatch } from './book';

export interface Stack {
  id: string;
  userId: string;
  photo: string;
  caption: string;
  books: BookMatch[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  matchScore?: number; // For current user
  hashtags?: string[]; // Optional hashtags for categorization
}

export interface Comment {
  id: string;
  userId: string;
  stackId: string;
  text: string;
  createdAt: string;
}

