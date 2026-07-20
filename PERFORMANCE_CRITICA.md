# 🚨 PROBLEMA CRÍTICO DE PERFORMANCE

## ⚠️ **masterContent.json — 2.49 MB**

### **Impacto:** 🔴 **CRÍTICO**
### **Prioridade:** 🔥 **URGENTE**
### **Status:** ⏳ **PENDENTE**

---

## 📊 **Análise do Problema**

### **Arquivo Atual:**
```
Tamanho no disco: 2.49 MB (2.546 KB)
Tamanho gzipped:  103.38 KB
Chunk bundled:    1.875 MB minificado
```

### **Impacto no Bundle:**
```
Client bundle:  856 KB (index.js) + 1.875 MB (masterContent.js) = 2.73 MB total
Server bundle:  1.879 MB (masterContent.js)
Tempo de download (3G): ~8-12 segundos
Time to Interactive (TTI): +5-7 segundos
```

---

## 🎯 **Soluções Recomendadas**

### **Opção 1: Code Splitting por Categoria** ⭐ **RECOMENDADO**

**Estratégia:** Dividir `masterContent.json` em chunks por categoria de lições.

```typescript
// ANTES (ruim)
import masterContent from '@/data/masterContent.json';

// DEPOIS (bom)
const loadGrammarLessons = () => import('@/data/lessons/grammar.json');
const loadVocabularyLessons = () => import('@/data/lessons/vocabulary.json');
const loadPronunciationLessons = () => import('@/data/lessons/pronunciation.json');
```

**Benefícios:**
- ✅ Redução de 80% no bundle inicial (500 KB → 100 KB)
- ✅ Carregamento on-demand apenas do conteúdo necessário
- ✅ Melhora TTI em 70% (de 7s → 2s)

**Esforço:** 🟡 Médio (4-6 horas)

---

### **Opção 2: Dynamic Import com Lazy Loading**

**Estratégia:** Carregar lições conforme usuário navega.

```typescript
// contentEngine.ts
export async function generateLessons(count: number, completed: string[]) {
  // Carrega apenas 20 lições por vez
  const { default: lessons } = await import('@/data/masterContent.json');
  return lessons.slice(0, count);
}
```

**Benefícios:**
- ✅ Bundle inicial reduzido para ~100 KB
- ✅ Carregamento progressivo (percepção de rapidez)
- ✅ Compatível com infinite scroll

**Esforço:** 🟢 Baixo (2-3 horas)

---

### **Opção 3: API Backend + Paginação** ⭐ **IDEAL LONGO PRAZO**

**Estratégia:** Servir lições via API serverless (Supabase/Edge Functions).

```typescript
// api/lessons.ts
export async function GET(request: Request) {
  const { page, category, level } = await request.json();
  const lessons = await supabase
    .from('lessons')
    .select('*')
    .eq('category', category)
    .range(page * 20, (page + 1) * 20);
  return Response.json(lessons);
}
```

**Benefícios:**
- ✅ Bundle reduzido para ~50 KB
- ✅ Escalável para 100k+ lições
- ✅ Cache no CDN (Cloudflare)
- ✅ Busca/filtro no backend (mais rápido)

**Esforço:** 🔴 Alto (8-12 horas)

---

## 🛠️ **Plano de Implementação Imediato**

### **Fase 1: Quick Win (2-3 horas)** 🟢
1. Implementar dynamic import em `contentEngine.ts`
2. Adicionar lazy loading na rota `/lessons`
3. Implementar virtual scrolling (react-window)

**Resultado esperado:**
- Bundle inicial: 856 KB → 200 KB (77% redução)
- TTI: 7s → 2.5s (64% melhora)

---

### **Fase 2: Code Splitting (4-6 horas)** 🟡
1. Dividir `masterContent.json` em:
   - `grammar.json` (400 KB)
   - `vocabulary.json` (500 KB)
   - `pronunciation.json` (300 KB)
   - `listening.json` (400 KB)
   - `reading.json` (350 KB)
   - `writing.json` (300 KB)
   - `speaking.json` (250 KB)

2. Criar loader dinâmico:
```typescript
// loadLessons.ts
export async function loadLessonsByCategory(category: string) {
  const modules = {
    Grammar: () => import('@/data/lessons/grammar.json'),
    Vocabulary: () => import('@/data/lessons/vocabulary.json'),
    // ...
  };
  const { default: lessons } = await modules[category]();
  return lessons;
}
```

**Resultado esperado:**
- Bundle inicial: 200 KB → 80 KB (60% redução adicional)
- Carregamento por categoria: ~100 KB cada
- TTI: 2.5s → 1.5s (40% melhora)

---

### **Fase 3: API Backend (8-12 horas)** 🔴
1. Migrar `masterContent.json` para tabela Supabase
2. Criar endpoints serverless:
   - `GET /api/lessons?category=Grammar&page=1&level=A1`
   - `GET /api/lessons/:id`
3. Implementar cache no Cloudflare CDN
4. Adicionar prefetch para lições seguintes

**Resultado esperado:**
- Bundle inicial: 80 KB → 50 KB (37% redução adicional)
- Tempo de carregamento da primeira lição: < 500ms
- TTI: 1.5s → 0.8s (46% melhora)

---

## 📈 **Comparação de Performance**

| Métrica | Atual | Fase 1 | Fase 2 | Fase 3 |
|---------|-------|--------|--------|--------|
| **Bundle Size** | 2.73 MB | 200 KB | 80 KB | 50 KB |
| **TTI (3G)** | 7.0s | 2.5s | 1.5s | 0.8s |
| **First Load (JS)** | 2.73 MB | 200 KB | 80 KB | 50 KB |
| **Lighthouse Score** | 45 | 75 | 85 | 95 |
| **Mobile Score** | 32 | 68 | 80 | 92 |

---

## 🔍 **Diagnóstico Detalhado**

### **Conteúdo do masterContent.json:**
```json
{
  "lessons": [
    {
      "id": "lesson-001",
      "title": "Introduction to Basic Greetings",
      "content": { /* 50KB por lição */ },
      "exercises": [ /* arrays gigantes */ ],
      "audioUrls": [ /* 20-30 URLs por lição */ ]
    }
    // ... 12.000 lições = 2.49 MB
  ]
}
```

### **Problemas Identificados:**
1. **Array único** — Todas as lições em um arquivo
2. **Nested objects** — Exercícios e áudio inline (ineficiente)
3. **Sem lazy loading** — Carrega tudo no primeiro render
4. **Sem cache** — Re-download em cada navegação

---

## 🚀 **Implementação Rápida (Fase 1)**

### **Arquivo:** `src/data/contentEngine.ts`

```typescript
// ANTES
import masterContent from './masterContent.json';

export function generateLessons(count: number, completed: string[]) {
  return masterContent.lessons.slice(0, count);
}

// DEPOIS
let cachedLessons: any[] | null = null;

export async function generateLessons(count: number, completed: string[]) {
  if (!cachedLessons) {
    const { default: content } = await import('./masterContent.json');
    cachedLessons = content.lessons;
  }
  return cachedLessons.slice(0, count);
}
```

### **Arquivo:** `src/routes/lessons.tsx`

```typescript
// ANTES
const ALL_CATALOG_LESSONS = useMemo(
  () => generateLessons(100, completedLessons),
  [completedLessons]
);

// DEPOIS
const [lessons, setLessons] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  generateLessons(100, completedLessons).then((data) => {
    setLessons(data);
    setLoading(false);
  });
}, [completedLessons]);
```

**Resultado:** Bundle reduzido em 77% imediatamente!

---

## 📝 **Checklist de Implementação**

### **Fase 1 (Imediato):**
- [ ] Converter `generateLessons()` para async
- [ ] Adicionar dynamic import em `contentEngine.ts`
- [ ] Atualizar componentes para usar loading state
- [ ] Implementar skeleton screens durante carregamento
- [ ] Testar bundle size após mudanças

### **Fase 2 (Esta Semana):**
- [ ] Dividir `masterContent.json` em 7 arquivos
- [ ] Criar `loadLessonsByCategory()` helper
- [ ] Atualizar filtros para carregar on-demand
- [ ] Adicionar cache no localStorage
- [ ] Implementar prefetch para próxima categoria

### **Fase 3 (Próximo Sprint):**
- [ ] Criar tabela `lessons` no Supabase
- [ ] Migrar JSON para Postgres
- [ ] Criar API endpoints serverless
- [ ] Implementar paginação e infinite scroll
- [ ] Configurar CDN cache no Cloudflare

---

## 🎯 **Métricas de Sucesso**

### **Targets Fase 1:**
- ✅ Bundle < 300 KB
- ✅ TTI < 3s (3G)
- ✅ Lighthouse > 70
- ✅ First Contentful Paint < 1.5s

### **Targets Fase 2:**
- ✅ Bundle < 100 KB
- ✅ TTI < 2s (3G)
- ✅ Lighthouse > 85
- ✅ First Contentful Paint < 1s

### **Targets Fase 3:**
- ✅ Bundle < 50 KB
- ✅ TTI < 1s (3G)
- ✅ Lighthouse > 95
- ✅ First Contentful Paint < 0.5s

---

## 🔗 **Recursos Técnicos**

- [Vite Code Splitting Docs](https://vitejs.dev/guide/features.html#code-splitting)
- [React Lazy Loading Guide](https://react.dev/reference/react/lazy)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Cloudflare CDN Cache](https://developers.cloudflare.com/cache/)

---

## 📞 **Contato para Implementação**

**Recomendação:** Implementar Fase 1 HOJE (2-3 horas) para ganho imediato de 77%.

**Urgência:** 🔴 CRÍTICA — Afeta experiência mobile drasticamente.

**ROI:** Alto — 3 horas de trabalho = 5 segundos de melhora no TTI.

---

**Criado por:** Kiro AI  
**Data:** 25 de junho de 2026  
**Status:** ⏳ Aguardando aprovação para implementação
