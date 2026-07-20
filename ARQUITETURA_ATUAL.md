# 🏗️ ARQUITETURA ATUAL DO LUME

## 📚 ESTRUTURA DE LIÇÕES

### ✅ O QUE JÁ EXISTE

#### **Lições Manuais** (`src/lib/lessons-data.ts`)
- **Total:** 4 lições apenas (muito pouco!)
- **Idiomas disponíveis:**
  - `en` - Inglês ✅
  - `pt` - Português ✅
  - `es` - Espanhol ✅
  - `fr` - Francês ✅
- **Estrutura:**
  ```typescript
  interface Lesson {
    id: string;              // Ex: "lesson-en-vocab-1"
    title: string;           // Ex: "The Art of Coffee & Small Talk"
    language: "en" | "pt" | "es" | "fr";
    level: string;           // Ex: "Beginner", "Intermediate", "Advanced"
    duration: string;        // Ex: "5 min"
    xp: number;             // Ex: 50
    color: string;          // Ex: "#8B5A2B"
    description: string;
    category: string;       // Ex: "Vocabulary", "Idioms", "Culture"
    steps: LessonStep[];    // Passos da lição
    icon?: string;          // Ex: "☕"
    subtitle?: string;
  }
  ```

#### **Sistema de Geração Dinâmica** (`src/data/lessonEngine.ts`)
- **Engine avançado** que pode gerar lições proceduralmente
- Usa **vocabulário expandido** como base
- **Seed-based generation** (determinístico)
- Suporta 5 categorias:
  - `vocabulary` (vocabulário)
  - `grammar` (gramática)
  - `listening` (compreensão auditiva)
  - `reading` (leitura)
  - `speaking` (conversação)
- **Níveis CEFR implementados:**
  - A1, A2 (Beginner)
  - B1, B2 (Intermediate)
  - C1, C2 (Advanced)

---

## 📖 VOCABULÁRIO & CONTEÚDO

### **Vocabulário Expandido** (`src/data/vocabularyExpanded.json`)
- **Estrutura por idioma:**
  ```json
  {
    "pt": [...],
    "en": [...],
    "es": [...]
  }
  ```
- Cada palavra tem:
  - `id`: identificador único
  - `word`: palavra no idioma alvo
  - `translation`: tradução
  - `level`: CEFR (A1, A2, B1, B2, C1, C2)
  - `category`: tema (emotions, food, business, nature)
  - `partOfSpeech`: substantivo, verbo, adjetivo, etc.
  - `example`: frase de exemplo
  - `pronunciationHint`: guia de pronúncia

### **Outros Recursos de Conteúdo:**
- `dialogues.json` - Diálogos prontos
- `dialoguesExpanded.json` - Diálogos expandidos
- `grammar.json` - Regras gramaticais
- `grammarExpanded.json` - Gramática detalhada
- `idiomsExpanded.json` - Expressões idiomáticas
- `phrasalVerbsExpanded.json` - Phrasal verbs
- `readingTextsExpanded.json` - Textos para leitura
- `masterContent.json` - Conteúdo mestre consolidado

---

## 💬 SISTEMA DE CONVERSAÇÃO (AI)

### **Tópicos Disponíveis** (`src/lib/topics.ts`)
- **Total:** 8 tópicos de conversação com IA
- **Estrutura:**
  ```typescript
  {
    slug: "daily-life",
    icon: "Coffee",
    title: "Daily Life",
    description: "Real conversations for everyday situations",
    category: "everyday",
    color: "#C4714A",
    vocab: { pt: [...], en: [...] },
    culturalTip: { pt: "...", en: "..." }
  }
  ```
- **Tópicos existentes:**
  1. Daily Life (vida diária)
  2. Art & Culture (arte e cultura)
  3. Professional (trabalho)
  4. Free Talk (conversa livre)
  5. Speaking Confidence (confiança)
  6. Music & Expression (música)
  7. Travel (viagens)
  8. Relationships (relacionamentos)

---

## 🗄️ BANCO DE DADOS (SUPABASE)

### **Tabelas Existentes:**

#### `profiles`
```sql
- id (uuid, PK)
- email
- full_name
- xp (integer)
- streak (integer)
- level (text)
- last_session_date
```

#### `conversations`
```sql
- id (uuid, PK)
- student_id (FK -> profiles)
- topic_slug
- topic_title
- messages (jsonb)
- duration_seconds
- xp_earned
- created_at
```

#### `saved_expressions`
```sql
- id (uuid, PK)
- student_id (FK -> profiles)
- expression
- translation
- context
- created_at
```

#### `chat_messages` (Community)
```sql
- id (uuid, PK)
- user_id (FK -> profiles)
- message (text)
- created_at
```

### **Estado do Banco:**
- ✅ Tabelas criadas via `supabase/setup.sql`
- ⚠️ **Lições NÃO são salvas no banco** (apenas em JSON/código)
- ✅ Progresso do usuário (XP, streak) é salvo
- ✅ Conversas com IA são salvas
- ⚠️ **Progresso de lições individuais NÃO é rastreado**

---

## 🎯 PROBLEMAS IDENTIFICADOS

### 🔴 **CRÍTICO:**
1. **Apenas 4 lições manuais** - Promessa de 30.000 conteúdos não cumprida
2. **Nenhuma lição salva no banco** - Tudo hardcoded ou gerado dinamicamente
3. **Sem sistema de tracking de progresso** - Não sabe quais lições foram completadas
4. **Engine de geração não está sendo usado** - Existe mas não está integrado na UI

### 🟡 **IMPORTANTE:**
1. Falta página de **Lessons** completa (catálogo tipo Netflix)
2. Vocabulário JSON existe mas quantidade indefinida
3. Sem filtros por nível CEFR na UI
4. Sem recomendações personalizadas

### 🟢 **BOAS PRÁTICAS:**
1. ✅ Estrutura modular bem organizada
2. ✅ TypeScript com interfaces claras
3. ✅ Engine de geração procedural inteligente
4. ✅ Integração Supabase funcional

---

## 🚀 PLANO DE AÇÃO RECOMENDADO

### **FASE 1: GERAÇÃO DE CONTEÚDO (PRIORITÁRIO)**
1. **Usar o engine existente** para gerar 1.000 lições iniciais
2. Distribuir por:
   - 3 idiomas (EN, PT, ES)
   - 5 categorias
   - 6 níveis CEFR
3. Salvar no formato correto (adicionar ao ALL_LESSONS)

### **FASE 2: PÁGINA DE CATÁLOGO**
1. Criar `/lessons` estilo Netflix/Steam
2. Filtros por:
   - Idioma
   - Categoria
   - Nível
   - Duração
3. Cards visuais premium
4. Sistema de busca

### **FASE 3: TRACKING DE PROGRESSO**
1. Criar tabela `lesson_progress` no Supabase
2. Salvar:
   - lesson_id
   - user_id
   - completed (boolean)
   - score (percentage)
   - completed_at
3. Mostrar progresso no perfil

### **FASE 4: RECOMENDAÇÕES**
1. Algoritmo baseado em:
   - Nível atual do usuário
   - Lições completadas
   - Idioma alvo
   - Categoria preferida

---

## 📊 CONTAGEM ATUAL (ESTIMATIVA)

| Item | Quantidade Real | Meta | Status |
|------|----------------|------|--------|
| Lições Manuais | 4 | 12.000 | 🔴 0.03% |
| Vocabulário | ~300-500 | 3.200 | 🟡 ~15% |
| Tópicos IA | 8 | 4.500 | 🔴 0.2% |
| Quizzes | 0 estruturados | 5.000 | 🔴 0% |
| Vídeos | 0 | 3.500 | 🔴 0% |
| Cidades | 50 | 50 | ✅ 100% |
| **TOTAL** | **~360** | **30.000** | 🔴 **1.2%** |

---

## 💡 SOLUÇÃO INTELIGENTE

### **Usar o Engine + Templates**
Em vez de criar 30.000 lições manualmente:

1. **Gerar via código** usando `generateLesson()` existente
2. **Templates por categoria:**
   - Vocabulary: 5 steps (intro, vocab, quiz, speaking, practice)
   - Grammar: 6 steps (intro, rule, examples, quiz, practice, review)
   - Listening: 4 steps (intro, audio, comprehension, practice)
   - Speaking: 5 steps (intro, phrases, roleplay, feedback, practice)
   - Reading: 5 steps (intro, text, comprehension, vocab, summary)

3. **Combinar com dados reais:**
   - vocabularyExpanded.json (500+ palavras)
   - dialogues.json
   - grammar.json
   - Cidades (50)
   - Tópicos (8)

4. **Resultado:** Lições únicas e variadas sem repetição

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **Criar gerador massivo** usando engine existente
2. ✅ **Página de catálogo** estilo Netflix
3. ✅ **Sistema de filtros** avançado
4. ⏳ **Tracking no banco** (próxima iteração)

---

Quer que eu comece a **gerar as lições automaticamente** usando o engine existente?
Ou prefere primeiro criar a **página de catálogo** para visualizar tudo?
