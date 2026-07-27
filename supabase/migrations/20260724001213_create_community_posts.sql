-- ═══════════════════════════════════════════════════════════════
-- Community feed posts — previously "Publicar" only wrote to local
-- component state (setLocalPosts), so a user's post vanished on refresh
-- and was never visible to any other user despite looking like a real
-- social feed. This table makes it a real, shared, persisted feed.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  post_type text NOT NULL DEFAULT 'tip',
  tags text[] NOT NULL DEFAULT '{}',
  likes integer NOT NULL DEFAULT 0,
  comments integer NOT NULL DEFAULT 0,
  shares integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Anyone signed in can read the whole feed — it's a public community wall.
DO $$ BEGIN
  CREATE POLICY "Anyone can view community posts" ON public.community_posts
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users can only post as themselves.
DO $$ BEGIN
  CREATE POLICY "Users can create own posts" ON public.community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users can delete their own posts (no edit — keep it simple).
DO $$ BEGIN
  CREATE POLICY "Users can delete own posts" ON public.community_posts
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS community_posts_created_at_idx
  ON public.community_posts (created_at DESC);
