
-- Tabela de Tópicos
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- Lucide icon name (e.g. 'coffee')
  image_url TEXT, -- Unsplash or Storage URL
  color_accent TEXT, -- Hex color
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics_select_public" ON public.topics FOR SELECT TO public USING (is_active = true);

-- Inserir dados iniciais baseados no topics.ts
INSERT INTO public.topics (slug, title, description, icon_name, color_accent)
VALUES 
  ('daily-life', 'Daily Life', 'Real conversations for everyday situations', 'coffee', '#C4714A'),
  ('art-culture', 'Art & Culture', 'Discuss art, cinema and music', 'palette', '#1B3A4B'),
  ('professional', 'Professional', 'Work, interviews, business', 'briefcase', '#2D4A3E'),
  ('free-talk', 'Free Talk', 'Open conversation, any topic', 'message-circle', '#D4C5A9'),
  ('speaking-confidence', 'Speaking Confidence', 'Practice without fear', 'brain', '#C4714A'),
  ('music-expression', 'Music & Expression', 'Songs, lyrics, emotion', 'music', '#1B3A4B'),
  ('travel', 'Travel', 'Airports, hotels, directions', 'plane', '#2D4A3E'),
  ('relationships', 'Relationships', 'Social life, friendships', 'heart', '#D4C5A9');

-- Storage buckets (Note: Usually done via dashboard or SQL if allowed)
-- We'll assume the buckets 'avatars', 'topics', and 'ui-assets' are created.
-- Policies for storage:
-- CREATE POLICY "Public topic images access" ON storage.objects FOR SELECT USING (bucket_id = 'topics');
-- CREATE POLICY "Upload individual avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
