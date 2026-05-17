
-- 1. Fix Profiles table and ensure all columns exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  language text DEFAULT 'en',
  level text DEFAULT 'beginner',
  preferred_mood text DEFAULT 'calm',
  onboarding_done boolean DEFAULT false,
  onboarding_answers jsonb DEFAULT '{}'::jsonb,
  xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  last_session_date date,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Auto-create profile function and trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_slug text,
  topic_title text,
  language text,
  mood text,
  messages jsonb DEFAULT '[]',
  duration_seconds integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Saved expressions table
CREATE TABLE IF NOT EXISTS public.saved_expressions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  expression text,
  context text,
  topic_slug text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.saved_expressions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can manage own expressions" ON public.saved_expressions FOR ALL USING (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Progress snapshots
CREATE TABLE IF NOT EXISTS public.progress_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date DEFAULT current_date,
  speaking_confidence integer DEFAULT 0,
  xp_total integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can manage own progress" ON public.progress_snapshots FOR ALL USING (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. Add skill_progress table
CREATE TABLE IF NOT EXISTS public.skill_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_slug text,
  lessons_completed integer DEFAULT 0,
  lessons_total integer,
  xp_earned integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users manage own skill progress" ON public.skill_progress FOR ALL USING (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. quiz_attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode text, -- quick | speed | daily | streak
  language text,
  score integer,
  total integer,
  xp_earned integer,
  streak_best integer,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = student_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
