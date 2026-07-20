# 🚨 ERRO PERSISTENTE: "column status does not exist"

**Status:** O erro continua mesmo após múltiplas tentativas  
**Causa Provável:** Políticas RLS órfãs no banco de dados  
**Solução:** Scripts mais agressivos criados  

---

## 🎯 SOLUÇÃO IMEDIATA

Você tem **2 opções** para resolver isso de vez:

---

## ✅ OPÇÃO 1: Script Definitivo (RECOMENDADO)

### **Use:** `FIX_lesson_progress_FINAL.sql`

**O que faz:**
- Remove políticas RLS usando loop dinâmico
- Desabilita RLS antes de remover
- Remove tudo com CASCADE (força)
- Cria tudo em ordem 100% segura
- Mostra verificação completa no final

### **Como usar:**

1. **Abra o arquivo:**
   ```
   supabase/migrations/FIX_lesson_progress_FINAL.sql
   ```

2. **Copie TUDO** (do início ao fim)

3. **Cole no Supabase SQL Editor**

4. **Execute TUDO de uma vez** (Ctrl+Enter ou botão Run)

5. **Aguarde a mensagem:**
   ```
   🎉 SUCCESS! lesson_progress table is ready to use!
   ```

**Por que este deve funcionar:**
- Remove políticas órfãs dinamicamente
- Desabilita RLS antes de limpar
- Usa CASCADE para forçar remoção
- Cria tabela ANTES de ativar RLS
- Cria políticas DEPOIS que a tabela existe

---

## ✅ OPÇÃO 2: Minimalista (PLANO B)

### **Use:** `MINIMAL_lesson_progress.sql`

**O que faz:**
- Versão ultra-simplificada
- Sem complexidades
- Linha por linha manual

### **Como usar:**

1. **Abra o arquivo:**
   ```
   supabase/migrations/MINIMAL_lesson_progress.sql
   ```

2. **Execute LINHA POR LINHA** (não tudo de uma vez)

3. **Copie a LINHA 1:**
   ```sql
   DROP TABLE IF EXISTS public.lesson_progress CASCADE;
   ```
   Cole e execute. Aguarde sucesso.

4. **Copie a LINHA 2:**
   ```sql
   CREATE TABLE public.lesson_progress (...);
   ```
   Cole e execute. Aguarde sucesso.

5. **Continue até LINHA 12** uma por vez.

**Por que este deve funcionar:**
- Linha por linha garante ordem
- Você vê onde está o problema
- Mais controle sobre o processo

---

## 🔍 SE AINDA ASSIM DER ERRO

### **Verificação 1: Tem políticas órfãs?**

Execute isto no SQL Editor:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'lesson_progress';
```

**Se retornar algo:** Há políticas sem tabela!

**Solução:** Remova manualmente:

```sql
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'lesson_progress'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.lesson_progress';
    END LOOP;
END $$;
```

Depois rode o **FIX_lesson_progress_FINAL.sql** novamente.

---

### **Verificação 2: Tem tabela antiga?**

Execute isto:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'lesson_progress';
```

**Se retornar algo:** A tabela existe mas está quebrada.

**Solução:** Force a remoção:

```sql
DROP TABLE IF EXISTS public.lesson_progress CASCADE;
```

Depois rode o **FIX_lesson_progress_FINAL.sql** novamente.

---

### **Verificação 3: Tem trigger órfão?**

Execute isto:

```sql
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname = 'set_lesson_progress_updated_at';
```

**Se retornar algo:** Há trigger sem tabela.

**Solução:**

```sql
DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;
```

Depois rode o **FIX_lesson_progress_FINAL.sql** novamente.

---

## 🆘 ÚLTIMA OPÇÃO: Limpeza Total Manual

Se TUDO falhou, faça esta limpeza manual completa:

### **Passo 1: Limpar Políticas**

```sql
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'lesson_progress'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.lesson_progress';
    END LOOP;
END $$;
```

### **Passo 2: Limpar Trigger**

```sql
DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress CASCADE;
```

### **Passo 3: Limpar Função**

```sql
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
```

### **Passo 4: Limpar Tabela**

```sql
DROP TABLE IF EXISTS public.lesson_progress CASCADE;
```

### **Passo 5: Verificar Limpeza**

```sql
-- Nenhum deve retornar resultados
SELECT * FROM pg_policies WHERE tablename = 'lesson_progress';
SELECT * FROM pg_tables WHERE tablename = 'lesson_progress';
SELECT * FROM pg_trigger WHERE tgname LIKE '%lesson_progress%';
```

### **Passo 6: Agora Rode**

Execute o **FIX_lesson_progress_FINAL.sql** completo.

---

## 🎯 RESUMO DAS OPÇÕES

| Opção | Arquivo | Quando Usar |
|-------|---------|-------------|
| **1** | `FIX_lesson_progress_FINAL.sql` | ⭐ Primeira tentativa |
| **2** | `MINIMAL_lesson_progress.sql` | Se a opção 1 falhar |
| **3** | Limpeza Manual + Opção 1 | Se ambas falharem |

---

## ✅ DEPOIS QUE FUNCIONAR

### **Verificação Rápida:**

```sql
-- Deve retornar 0 (sem erros)
SELECT COUNT(*) FROM public.lesson_progress;

-- Deve retornar 4
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'lesson_progress';

-- Deve retornar true
SELECT rowsecurity FROM pg_tables WHERE tablename = 'lesson_progress';
```

### **Teste no App:**

1. Vá em: https://applanguage.vercel.app/lessons
2. Complete uma lição
3. Volte ao Supabase → Table Editor → lesson_progress
4. ✅ Veja o registro criado

---

## 💡 POR QUE ESTE ERRO ACONTECEU?

**Causa raiz:** Você provavelmente tentou rodar a migration original 2-3 vezes:

1. **Primeira vez:** Criou a tabela mas falhou nas políticas
2. **Segunda vez:** Tentou criar políticas mas a tabela não existe
3. **Resultado:** Políticas órfãs tentando referenciar tabela inexistente

**Solução:** Os novos scripts:
- Removem políticas ANTES de remover tabela
- Criam tabela ANTES de criar políticas
- Usam CASCADE para forçar limpeza

---

## 🚀 IMPACTO NO PROJETO

### **Sem a migration:**
- ⚠️ App funciona (localStorage)
- ⚠️ Progresso não sincroniza

### **Com a migration:**
- ✅ Progresso sincronizado
- ✅ Multi-dispositivo
- ✅ Anti-farm XP total

### **Status:**
🟢 **Projeto continua vendável**

O app já funciona. A migration só melhora a experiência.

---

## 📞 PRECISA DE AJUDA?

Se mesmo com estes 3 scripts você ainda tiver erro:

1. Copie a mensagem de erro COMPLETA
2. Execute:
   ```sql
   SELECT version();
   ```
   Para ver a versão do PostgreSQL

3. Execute as 3 verificações acima (políticas, tabela, trigger)

4. Me mostre os resultados

---

**Arquivos criados:**
- ✅ `FIX_lesson_progress_FINAL.sql` - Script definitivo
- ✅ `MINIMAL_lesson_progress.sql` - Versão minimalista
- ✅ `ERRO_PERSISTENTE_SOLUCAO.md` - Este guia

**Escolha a Opção 1 e execute agora!** 🚀
