-- Stacks Database Schema
-- Initial migration for book catalog, embeddings, and user management

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  description TEXT,
  cover_url TEXT,
  genre TEXT,
  publication_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create book embeddings table for AI-powered search
CREATE TABLE book_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id)
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  library_card_number TEXT UNIQUE,
  preferred_branch_id UUID,
  reading_goal_pages INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create library branches table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates POINT,
  phone TEXT,
  hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user queue table for holds and checkouts
CREATE TABLE user_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  status TEXT NOT NULL CHECK (status IN ('hold', 'ready', 'checked_out', 'returned')),
  hold_date TIMESTAMPTZ DEFAULT NOW(),
  ready_date TIMESTAMPTZ,
  checkout_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, status) -- Prevent duplicate holds
);

-- Create reading streaks table
CREATE TABLE reading_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pages_read INTEGER NOT NULL DEFAULT 0,
  goal_pages INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date) -- One entry per user per day
);

-- Create learning paths table
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  estimated_weeks INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_by UUID REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning path books junction table
CREATE TABLE learning_path_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(learning_path_id, book_id),
  UNIQUE(learning_path_id, sequence_order)
);

-- Create user progress on learning paths
CREATE TABLE user_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, learning_path_id, book_id)
);

-- Create indexes for performance
CREATE INDEX idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX idx_books_author ON books USING gin(to_tsvector('english', author));
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_book_embeddings_vector ON book_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_user_queue_user_status ON user_queue(user_id, status);
CREATE INDEX idx_reading_streaks_user_date ON reading_streaks(user_id, date DESC);
CREATE INDEX idx_learning_paths_topic ON learning_paths(topic);

-- Create RPC function for vector similarity search
CREATE OR REPLACE FUNCTION match_books(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  author text,
  description text,
  cover_url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.title,
    b.author,
    b.description,
    b.cover_url,
    (1 - (be.embedding <=> query_embedding)) as similarity
  FROM books b
  JOIN book_embeddings be ON b.id = be.book_id
  WHERE 1 - (be.embedding <=> query_embedding) > match_threshold
  ORDER BY be.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own queue" ON user_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own queue" ON user_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reading streaks" ON reading_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reading streaks" ON reading_streaks
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample data for development
INSERT INTO branches (name, address, coordinates) VALUES
  ('Central Library', '123 Main St, Downtown', POINT(-122.4194, 37.7749)),
  ('Westside Branch', '456 Oak Ave, Westside', POINT(-122.4394, 37.7849)),
  ('Northside Branch', '789 Pine St, Northside', POINT(-122.4094, 37.7949));

-- Sample books for testing
INSERT INTO books (title, author, isbn, description, genre, publication_year) VALUES
  ('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '9781501161933', 'A reclusive Hollywood icon tells her life story', 'Fiction', 2017),
  ('Atomic Habits', 'James Clear', '9780735211292', 'Tiny changes, remarkable results', 'Self-Help', 2018),
  ('The Silent Patient', 'Alex Michaelides', '9781250301697', 'A psychological thriller about a woman who refuses to speak', 'Mystery', 2019); 