
-- Add gamification columns to profiles
ALTER TABLE public.profiles ADD COLUMN xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN last_activity_date DATE;

-- Badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'milestone', 'topic', 'streak'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unlocked badges join table
CREATE TABLE public.unlocked_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL REFERENCES public.badges(slug) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, badge_slug)
);

-- RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badges_select_public" ON public.badges FOR SELECT TO public USING (true);
CREATE POLICY "unlocked_badges_select_own" ON public.unlocked_badges FOR SELECT TO authenticated USING (auth.uid() = student_id);

-- Seed badges
INSERT INTO public.badges (slug, name, description, icon, category)
VALUES 
  ('first-spark', 'First Spark', 'Complete your first conversation', '🔥', 'milestone'),
  ('chatterbox', 'Chatterbox', 'Complete 10 conversations', '💬', 'milestone'),
  ('culture-lover', 'Culture Lover', 'Complete Art & Culture topic', '🎨', 'topic'),
  ('world-traveler', 'World Traveler', 'Complete Travel topic', '✈️', 'topic'),
  ('professional-badge', 'Professional', 'Complete Professional topic', '💼', 'topic'),
  ('confidence-builder', 'Confidence Builder', 'Complete Speaking Confidence 3 times', '🧠', 'milestone'),
  ('expression-collector', 'Expression Collector', 'Save 20 expressions', '📚', 'milestone'),
  ('dedicated', 'Dedicated', '60 total minutes of practice', '⏱️', 'milestone'),
  ('on-fire', 'On Fire', '7-day streak', '🔥🔥🔥', 'streak');
