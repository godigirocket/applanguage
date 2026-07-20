-- ═══════════════════════════════════════════════════════════════
-- FIX DEFINITIVO: Remove tudo relacionado a lesson_progress
-- Execute este script COMPLETO de uma vez
-- ═══════════════════════════════════════════════════════════════

-- PASSO 1: Desabilitar RLS temporariamente (se a tabela existir)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'lesson_progress'
    ) THEN
        ALTER TABLE public.lesson_progress DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- PASSO 2: Remover TODAS as políticas (forçado)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'lesson_progress'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.lesson_progress';
    END LOOP;
END $$;

-- PASSO 3: Remover trigger
DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;

-- PASSO 4: Remover função
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- PASSO 5: Remover todos os indexes
DROP INDEX IF EXISTS public.idx_lesson_progress_user_id CASCADE;
DROP INDEX IF EXISTS public.idx_lesson_progress_status CASCADE;
DROP INDEX IF EXISTS public.idx_lesson_progress_completed_at CASCADE;

-- PASSO 6: Remover tabela completamente (com CASCADE para dependências)
DROP TABLE IF EXISTS public.lesson_progress CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- AGORA CRIAR TUDO DO ZERO
-- ═══════════════════════════════════════════════════════════════

-- PASSO 7: Criar tabela
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
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
  CONSTRAINT lesson_progress_user_lesson_unique UNIQUE(user_id, lesson_id),
  CONSTRAINT lesson_progress_status_check CHECK (status IN ('not_started', 'in_progress', 'completed')),
  CONSTRAINT lesson_progress_progress_check CHECK (progress >= 0 AND progress <= 100)
);

-- PASSO 8: Adicionar foreign key DEPOIS (mais seguro)
ALTER TABLE public.lesson_progress 
  ADD CONSTRAINT lesson_progress_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- PASSO 9: Criar indexes
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_status ON public.lesson_progress(status);
CREATE INDEX idx_lesson_progress_completed_at ON public.lesson_progress(completed_at);

-- PASSO 10: Criar função de trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASSO 11: Criar trigger
CREATE TRIGGER set_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- PASSO 12: Dar permissões ANTES de ativar RLS
GRANT ALL ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

-- PASSO 13: Ativar RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- PASSO 14: Criar políticas RLS (AGORA que a tabela existe)
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

-- PASSO 15: Adicionar comentários
COMMENT ON TABLE public.lesson_progress IS 'Tracks user progress for individual lessons';
COMMENT ON COLUMN public.lesson_progress.status IS 'Current status: not_started, in_progress, or completed';
COMMENT ON COLUMN public.lesson_progress.progress IS 'Progress percentage from 0-100';
COMMENT ON COLUMN public.lesson_progress.xp_earned IS 'XP awarded upon completion (prevents double awards)';

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ═══════════════════════════════════════════════════════════════

-- Verificar tabela
SELECT 'lesson_progress table' as object, 
       CASE WHEN EXISTS (
         SELECT FROM pg_tables 
         WHERE schemaname = 'public' AND tablename = 'lesson_progress'
       ) THEN '✅ CREATED' ELSE '❌ NOT FOUND' END as status;

-- Verificar colunas
SELECT 'Columns' as object, COUNT(*) || ' columns' as status
FROM information_schema.columns 
WHERE table_name = 'lesson_progress';

-- Verificar indexes
SELECT 'Indexes' as object, COUNT(*) || ' indexes' as status
FROM pg_indexes 
WHERE tablename = 'lesson_progress';

-- Verificar RLS
SELECT 'RLS' as object,
       CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'lesson_progress';

-- Verificar políticas
SELECT 'Policies' as object, COUNT(*) || ' policies' as status
FROM pg_policies 
WHERE tablename = 'lesson_progress';

-- Verificar trigger
SELECT 'Trigger' as object,
       CASE WHEN EXISTS (
         SELECT FROM pg_trigger 
         WHERE tgname = 'set_lesson_progress_updated_at'
       ) THEN '✅ CREATED' ELSE '❌ NOT FOUND' END as status;

-- Mensagem final
SELECT '🎉 SUCCESS! lesson_progress table is ready to use!' as message;
