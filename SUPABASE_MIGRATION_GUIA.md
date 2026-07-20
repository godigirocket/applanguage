# 🔧 GUIA: Como Rodar a Migration no Supabase

**Problema encontrado:** Erro "column status does not exist" ao rodar SQL  
**Causa:** Políticas RLS tentando referenciar tabela que ainda não foi criada  
**Solução:** Use uma das 3 opções abaixo  

---

## 🚀 OPÇÃO 1: Script Seguro (RECOMENDADO)

Use este se você quer **limpar tudo e começar do zero**.

### **Passo a passo:**

1. Acesse **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto **applanguage**
3. Vá em **SQL Editor** (ícone de banco de dados na barra lateral)
4. Clique em **"New query"**
5. Copie TODO o conteúdo de: `supabase/migrations/create_lesson_progress_safe.sql`
6. Cole no editor
7. Clique em **"Run"** (ou pressione Ctrl+Enter)
8. ✅ Aguarde mensagem de sucesso

**Arquivo:** `create_lesson_progress_safe.sql`

**O que faz:**
- ✅ Remove políticas antigas (se existirem)
- ✅ Remove triggers antigos
- ✅ Remove tabela antiga (⚠️ **deleta dados se houver**)
- ✅ Cria tudo do zero
- ✅ Mostra confirmação no final

---

## 🎯 OPÇÃO 2: Passo a Passo (MAIS SEGURO)

Use este se você quer **ver cada passo** e identificar onde está o problema.

### **Passo a passo:**

1. Acesse **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo: `supabase/migrations/create_lesson_progress_step_by_step.sql`
4. **Copie e execute SEÇÃO POR SEÇÃO** (não tudo de uma vez)

**Ordem de execução:**

```sql
-- ✅ STEP 1: Limpar (rode primeiro)
DROP POLICY IF EXISTS ...
DROP TABLE IF EXISTS ...

-- ✅ STEP 2: Criar tabela (rode segundo)
CREATE TABLE public.lesson_progress ...

-- ✅ STEP 3: Criar indexes (rode terceiro)
CREATE INDEX ...

-- ✅ STEP 4: Ativar RLS (rode quarto)
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- ✅ STEP 5: Criar políticas (rode quinto)
CREATE POLICY ...

-- ✅ STEP 6: Criar função (rode sexto)
CREATE FUNCTION ...

-- ✅ STEP 7: Criar trigger (rode sétimo)
CREATE TRIGGER ...

-- ✅ STEP 8: Dar permissões (rode oitavo)
GRANT ALL ...

-- ✅ STEP 9: Verificar (rode por último)
SELECT * FROM information_schema.tables WHERE table_name = 'lesson_progress';
```

**Vantagem:** Você vê exatamente onde está o problema (se houver).

---

## 🔍 OPÇÃO 3: Verificar se Já Existe

Use este se você **não tem certeza** se a tabela já existe.

### **Passo 1: Verificar se tabela existe**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'lesson_progress';
```

**Se retornar vazio:** Tabela não existe → Use Opção 1 ou 2  
**Se retornar "lesson_progress":** Tabela existe → Vá para Passo 2

### **Passo 2: Verificar estrutura da tabela**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'lesson_progress' 
ORDER BY ordinal_position;
```

**Deve mostrar:**
- id (uuid)
- user_id (uuid)
- lesson_id (text)
- status (text)
- score (integer)
- xp_earned (integer)
- progress (integer)
- current_step (integer)
- total_steps (integer)
- started_at (timestamp with time zone)
- completed_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- created_at (timestamp with time zone)

**Se faltar colunas:** Delete a tabela e recrie usando Opção 1.

### **Passo 3: Verificar políticas RLS**

```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'lesson_progress';
```

**Deve mostrar 4 políticas:**
- Users can view own lesson progress
- Users can insert own lesson progress
- Users can update own lesson progress
- Users can delete own lesson progress

**Se faltar:** Adicione manualmente ou use Opção 1.

---

## ❌ ERROS COMUNS

### **Erro 1: "relation does not exist"**
**Causa:** Tabela não foi criada  
**Solução:** Use Opção 1 (script seguro)

### **Erro 2: "column status does not exist"**
**Causa:** Políticas tentando referenciar coluna antes da tabela ser criada  
**Solução:** Use Opção 2 (passo a passo) ou Opção 1

### **Erro 3: "policy already exists"**
**Causa:** Você tentou rodar o script duas vezes  
**Solução:** 
```sql
DROP POLICY "nome_da_política" ON public.lesson_progress;
```
Depois rode novamente.

### **Erro 4: "permission denied"**
**Causa:** Você não tem permissão para criar tabelas  
**Solução:** Certifique-se de estar usando uma conta com permissões de admin no projeto.

---

## ✅ COMO CONFIRMAR QUE FUNCIONOU

### **Teste 1: Tabela criada**
```sql
SELECT * FROM public.lesson_progress LIMIT 1;
```
**Esperado:** Retorna vazio (sem erros)

### **Teste 2: RLS ativo**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'lesson_progress';
```
**Esperado:** `rowsecurity = true`

### **Teste 3: Políticas ativas**
```sql
SELECT COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'lesson_progress';
```
**Esperado:** `total_policies = 4`

### **Teste 4: Inserir dados (como usuário autenticado)**

Faça login no app e complete uma lição. Depois:

```sql
SELECT COUNT(*) as total_progress
FROM public.lesson_progress;
```
**Esperado:** Número > 0

---

## 🎯 RESUMO RÁPIDO

**Primeira vez rodando?** → Use **Opção 1** (script seguro)  
**Erro "column does not exist"?** → Use **Opção 1** ou **Opção 2**  
**Quer entender cada passo?** → Use **Opção 2** (passo a passo)  
**Não sabe se já existe?** → Use **Opção 3** (verificar)  

---

## 📞 SUPORTE

**Problema persiste?**

1. Verifique se você está no projeto correto no Supabase
2. Copie a mensagem de erro completa
3. Execute:
   ```sql
   SELECT version();
   ```
   Para confirmar a versão do PostgreSQL

4. Tente usar o **Opção 2** (passo a passo) para identificar exatamente onde falha

---

## ✅ APÓS SUCESSO

Quando a migration rodar com sucesso:

1. ✅ Feche o SQL Editor
2. ✅ Vá em **Table Editor** na barra lateral
3. ✅ Confirme que a tabela `lesson_progress` aparece
4. ✅ Teste completar uma lição no app
5. ✅ Volte ao Table Editor e veja o registro criado

**Parabéns!** 🎉 O sistema de progresso está 100% funcional.

---

**Arquivos disponíveis:**
- `create_lesson_progress.sql` - Original (pode dar erro)
- `create_lesson_progress_safe.sql` - **Recomendado** (limpa e recria)
- `create_lesson_progress_step_by_step.sql` - Debug (passo a passo)
- `SUPABASE_MIGRATION_GUIA.md` - Este guia
