-- STEP-BY-STEP VERSION: Run each section separately to identify issues
-- Copy and paste one section at a time in Supabase SQL Editor

-- ═══════════════════════════════════════════════════════════════
-- STEP 1: Clean up any existing objects (run this first)
-- ═══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can delete own lesson progress" ON public.lesson_progress;
DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP TABLE IF EXISTS public.lesson_progress CASCADE;

-- Should see: "DROP TABLE" or "skipped (object does not exist)"

-- ═══════════════════════════════════════════════════════════════
-- STEP 2: Create the table (run this second)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  current_step INTEGER,
  total_steps INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Add constraints separately (safer)
ALTER TABLE public.lesson_progress 
  ADD CONSTRAINT status_check CHECK (status IN ('not_started', 'in_progress', 'completed'));

ALTER TABLE public.lesson_progress 
  ADD CONSTRAINT progress_check CHECK (progress >= 0 AND progress <= 100);

-- Should see: "CREATE TABLE"

-- ═══════════════════════════════════════════════════════════════
-- STEP 3: Create indexes (run this third)
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_status ON public.lesson_progress(status);
CREATE INDEX idx_lesson_progress_completed_at ON public.lesson_progress(completed_at);

-- Should see: "CREATE INDEX" (3 times)

-- ═══════════════════════════════════════════════════════════════
-- STEP 4: Enable RLS (run this fourth)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Should see: "ALTER TABLE"

-- ═══════════════════════════════════════════════════════════════
-- STEP 5: Create RLS Policies (run this fifth)
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON public.lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON public.lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson progress"
  ON public.lesson_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Should see: "CREATE POLICY" (4 times)

-- ═══════════════════════════════════════════════════════════════
-- STEP 6: Create trigger function (run this sixth)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Should see: "CREATE FUNCTION"

-- ═══════════════════════════════════════════════════════════════
-- STEP 7: Create trigger (run this seventh)
-- ═══════════════════════════════════════════════════════════════

CREATE TRIGGER set_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Should see: "CREATE TRIGGER"

-- ═══════════════════════════════════════════════════════════════
-- STEP 8: Grant permissions (run this eighth)
-- ═══════════════════════════════════════════════════════════════

GRANT ALL ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

-- Should see: "GRANT"

-- ═══════════════════════════════════════════════════════════════
-- STEP 9: Verify everything (run this last to confirm)
-- ═══════════════════════════════════════════════════════════════

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'lesson_progress';

-- Check columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'lesson_progress';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'lesson_progress';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'lesson_progress';

-- Success message
SELECT '✅ lesson_progress table created successfully!' AS status;
