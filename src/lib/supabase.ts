/**
 * Supabase client configuration for Stacks
 * Includes pgvector support for book embeddings and vector similarity search
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Type definitions for database tables
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  cover_url?: string;
  genre?: string;
  publication_year?: number;
  created_at: string;
  updated_at: string;
}

export interface BookEmbedding {
  id: string;
  book_id: string;
  embedding: number[]; // pgvector embedding
  created_at: string;
}

export interface UserQueue {
  id: string;
  user_id: string;
  book_id: string;
  status: 'hold' | 'ready' | 'checked_out' | 'returned';
  branch_id?: string;
  hold_date: string;
  ready_date?: string;
  created_at: string;
}

export interface ReadingStreak {
  id: string;
  user_id: string;
  date: string;
  pages_read: number;
  goal_pages: number;
  created_at: string;
}

// Utility functions for vector similarity search
export const searchBooksByEmbedding = async (queryEmbedding: number[], limit = 10) => {
  const { data, error } = await supabase.rpc('match_books', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) {
    console.error('Error searching books by embedding:', error);
    return [];
  }

  return data;
};

// Book queue management
export const addToQueue = async (userId: string, bookId: string, branchId?: string) => {
  const { data, error } = await supabase
    .from('user_queue')
    .insert({
      user_id: userId,
      book_id: bookId,
      branch_id: branchId,
      status: 'hold',
      hold_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding to queue:', error);
    return null;
  }

  return data;
};

// Reading streak tracking
export const logReadingProgress = async (userId: string, pagesRead: number, goalPages = 10) => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('reading_streaks')
    .upsert({
      user_id: userId,
      date: today,
      pages_read: pagesRead,
      goal_pages: goalPages,
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging reading progress:', error);
    return null;
  }

  return data;
};
