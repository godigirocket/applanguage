-- ═══════════════════════════════════════════════════════════════
-- VERSÃO MINIMALISTA (SE TUDO MAIS FALHOU)
-- Execute LINHA POR LINHA manualmente no SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- LINHA 1: Remover tabela se existir
DROP TABLE IF EXISTS public.lesson_progress CASCADE;

-- LINHA 2: Criar tabela básica SEM constraints complexos
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  current_step INTEGER,
  total_steps INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LINHA 3: Adicionar foreign key
ALTER TABLE public.lesson_progress 
ADD CONSTRAINT fk_user 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- LINHA 4: Adicionar unique constraint
ALTER TABLE public.lesson_progress 
ADD CONSTRAINT unique_user_lesson 
UNIQUE(user_id, lesson_id);

-- LINHA 5: Criar index básico
CREATE INDEX idx_user ON public.lesson_progress(user_id);

-- LINHA 6: Dar permissões
GRANT ALL ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

-- LINHA 7: Ativar RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- LINHA 8: Política SELECT
CREATE POLICY "select_own" ON public.lesson_progress 
FOR SELECT USING (auth.uid() = user_id);

-- LINHA 9: Política INSERT
CREATE POLICY "insert_own" ON public.lesson_progress 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- LINHA 10: Política UPDATE
CREATE POLICY "update_own" ON public.lesson_progress 
FOR UPDATE USING (auth.uid() = user_id);

-- LINHA 11: Política DELETE
CREATE POLICY "delete_own" ON public.lesson_progress 
FOR DELETE USING (auth.uid() = user_id);

-- LINHA 12: Verificar
SELECT * FROM public.lesson_progress LIMIT 1;
