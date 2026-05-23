-- Tabela de conversas (conversations)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_slug TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  duration_seconds INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- Tabela de expressões salvas (saved_expressions)
CREATE TABLE IF NOT EXISTS saved_expressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  expression TEXT NOT NULL,
  translation TEXT,
  category TEXT,
  difficulty TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_expressions_student_id ON saved_expressions(student_id);

-- Row Level Security (RLS) – permitir que usuários vejam apenas seus próprios dados
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_expressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Users can view own saved_expressions" ON saved_expressions
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own saved_expressions" ON saved_expressions
  FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can delete own saved_expressions" ON saved_expressions
  FOR DELETE USING (auth.uid() = student_id);
