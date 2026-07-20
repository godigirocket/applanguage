-- SAFE VERSION: Create lesson_progress table for tracking individual lesson completion
-- This version safely handles existing objects
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist (in case of previous partial migration)
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can delete own lesson progress" ON public.lesson_progress;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS public.idx_lesson_progress_user_id;
DROP INDEX IF EXISTS public.idx_lesson_progress_status;
DROP INDEX IF EXISTS public.idx_lesson_progress_completed_at;

-- Drop existing table if it exists (BE CAREFUL: This will delete all data!)
-- Comment out the next line if you want to preserve existing data
DROP TABLE IF EXISTS public.lesson_progress;

-- Create the table
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_step INTEGER,
  total_steps INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint: one progress record per user per lesson
  UNIQUE(user_id, lesson_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_status ON public.lesson_progress(status);
CREATE INDEX idx_lesson_progress_completed_at ON public.lesson_progress(completed_at);

-- Enable Row Level Security
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own progress
CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own progress
CREATE POLICY "Users can insert own lesson progress"
  ON public.lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own progress
CREATE POLICY "Users can update own lesson progress"
  ON public.lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own progress
CREATE POLICY "Users can delete own lesson progress"
  ON public.lesson_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER set_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

-- Add comments
COMMENT ON TABLE public.lesson_progress IS 'Tracks user progress for individual lessons';
COMMENT ON COLUMN public.lesson_progress.status IS 'Current status: not_started, in_progress, or completed';
COMMENT ON COLUMN public.lesson_progress.progress IS 'Progress percentage from 0-100';
COMMENT ON COLUMN public.lesson_progress.xp_earned IS 'XP awarded upon completion (prevents double awards)';

-- Verify the table was created
SELECT 'lesson_progress table created successfully!' AS status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;
