
-- Enums
CREATE TYPE public.app_language AS ENUM ('pt', 'en');
CREATE TYPE public.app_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.app_mood AS ENUM ('calm', 'intensive', 'cultural', 'confidence');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  language public.app_language NOT NULL DEFAULT 'en',
  level public.app_level NOT NULL DEFAULT 'beginner',
  preferred_mood public.app_mood NOT NULL DEFAULT 'calm',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  difficulty TEXT,
  interest TEXT,
  practice_style TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  language public.app_language NOT NULL,
  mood public.app_mood NOT NULL DEFAULT 'calm',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversations_student ON public.conversations(student_id, created_at DESC);

-- Saved expressions
CREATE TABLE public.saved_expressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expression TEXT NOT NULL,
  translation TEXT,
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_saved_expr_student ON public.saved_expressions(student_id, created_at DESC);

-- Progress snapshots
CREATE TABLE public.progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  speaking_confidence INTEGER NOT NULL DEFAULT 0,
  conversational_flow INTEGER NOT NULL DEFAULT 0,
  cultural_fluency INTEGER NOT NULL DEFAULT 0,
  pronunciation_clarity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, date)
);
CREATE INDEX idx_progress_student ON public.progress_snapshots(student_id, date DESC);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_expressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS policies: profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- RLS policies: conversations
CREATE POLICY "conv_select_own" ON public.conversations FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "conv_insert_own" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "conv_update_own" ON public.conversations FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "conv_delete_own" ON public.conversations FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- RLS policies: saved_expressions
CREATE POLICY "expr_select_own" ON public.saved_expressions FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "expr_insert_own" ON public.saved_expressions FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "expr_update_own" ON public.saved_expressions FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "expr_delete_own" ON public.saved_expressions FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- RLS policies: progress_snapshots
CREATE POLICY "prog_select_own" ON public.progress_snapshots FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "prog_insert_own" ON public.progress_snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "prog_update_own" ON public.progress_snapshots FOR UPDATE TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "prog_delete_own" ON public.progress_snapshots FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_conv_updated BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, language, level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'language')::public.app_language, 'en'::public.app_language),
    COALESCE((NEW.raw_user_meta_data->>'level')::public.app_level, 'beginner'::public.app_level)
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
