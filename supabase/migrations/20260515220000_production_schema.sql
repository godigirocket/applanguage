
-- Ensure profiles matches the spec
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_answers JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_session_date DATE;

-- Ensure conversations matches the spec
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0;

-- Ensure saved_expressions matches the spec
ALTER TABLE public.saved_expressions ADD COLUMN IF NOT EXISTS topic_slug TEXT;

-- Ensure progress_snapshots matches the spec
ALTER TABLE public.progress_snapshots ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;

-- Create Badges table if not exists (from earlier migration but ensuring spec)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Badges from the prompt
INSERT INTO public.badges (slug, name, description, icon, category)
VALUES 
  ('first-spark', 'First Spark', 'Complete first conversation', '🔥', 'milestone'),
  ('chatterbox', 'Chatterbox', '10 conversations', '💬', 'milestone'),
  ('culture-lover', 'Culture Lover', 'Complete Art & Culture', '🎨', 'topic'),
  ('world-traveler', 'World Traveler', 'Complete Travel', '✈️', 'topic'),
  ('professional', 'Professional', 'Complete Professional', '💼', 'topic'),
  ('confidence-builder', 'Confidence Builder', 'Complete Speaking Confidence 3x', '🧠', 'confidence'),
  ('expression-collector', 'Expression Collector', 'Save 20 expressions', '📚', 'milestone'),
  ('dedicated', 'Dedicated', '60 total minutes', '⏱️', 'milestone'),
  ('on-fire', 'On Fire', '7-day streak', '🔥🔥', 'streak')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;
