-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  text_size_preference TEXT NOT NULL DEFAULT 'medium' CHECK (text_size_preference IN ('small', 'medium', 'large', 'xlarge')),
  theme_preference TEXT NOT NULL DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'high-contrast')),
  default_lens TEXT CHECK (default_lens IN ('historical', 'protestant', 'catholic', 'orthodox', 'jewish', 'islamic', 'secular')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reading progress
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER,
  translation TEXT NOT NULL DEFAULT 'kjv',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('verse', 'timeline', 'library')),
  reference JSONB NOT NULL,
  label TEXT,
  auto_saved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content cache (shared across all users)
CREATE TABLE content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('era', 'event', 'figure', 'topic', 'lens_view')),
  content_key TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  access_count INTEGER NOT NULL DEFAULT 1,
  flagged_for_review BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(content_type, content_key)
);

-- Embeddings for RAG
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_key TEXT NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  text_content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_type, content_key, chunk_index)
);

-- Create index for vector similarity search
CREATE INDEX embeddings_embedding_idx ON embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_payment_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reading progress: users can manage their own
CREATE POLICY "Users can manage own reading progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

-- Bookmarks: users can manage their own
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Content cache: anyone can read, only service role can write
CREATE POLICY "Anyone can read content cache" ON content_cache FOR SELECT USING (true);

-- Embeddings: anyone can read, only service role can write
CREATE POLICY "Anyone can read embeddings" ON embeddings FOR SELECT USING (true);

-- Donations: users can see their own
CREATE POLICY "Users can see own donations" ON donations FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
