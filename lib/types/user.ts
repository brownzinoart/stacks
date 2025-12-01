/**
 * User-related type definitions
 */

import type { Book } from './book';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
}

export interface UserReadingProfile {
  userId: string;
  favoriteGenres: string[];
  favoriteAuthors: string[];
  favoriteTropes: string[];
  dislikedTropes: string[];
  preferredMood: string[];
  readingHistory: {
    bookId: string;
    rating?: number;          // 1-5 stars
    finishedDate?: string;
    didNotFinish?: boolean;
  }[];
  engagementHistory: {
    likedStackIds: string[];
    savedStackIds: string[];
    commentedStackIds: string[];
  };
}

export interface UserLibrary {
  name: string;
  catalogUrl: string;
  type: 'bibliocommons' | 'overdrive' | 'other';
}

