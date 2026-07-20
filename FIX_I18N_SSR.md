# Fix Crítico: i18n Causando SSR Error

## 🎯 Problema Identificado

O import side-effect do i18n estava sendo executado durante SSR:

```typescript
import "@/i18n/config"; // ← ESTE IMPORT EXECUTA CÓDIGO
```

O arquivo `i18n/config.ts` chama `getSavedLanguage()` que acessa `localStorage` DURANTE A IMPORTAÇÃO, antes mesmo do React renderizar. Isso causa o erro SSR.

## ✅ Solução Aplicada

### 1. **Removido import side-effect** (`src/routes/__root.tsx`)

**Antes:**
```typescript
import "@/i18n/config";
import i18n from "i18next";
```

**Depois:**
```typescript
// REMOVED: import "@/i18n/config"; // This was causing SSR error

// Lazy load i18n only on client
let i18n: any;
if (typeof window !== "undefined") {
  import("@/i18n/config").then((mod) => {
    i18n = mod.default;
  });
}
```

### 2. **Protegido uso do i18n** 

```typescript
useEffect(() => {
  if (!storeHydrated || typeof window === "undefined" || !i18n) return;
  // ... resto do código
}, [interfaceLanguage, storeHydrated]);
```

### 3. **Early return no RootInner**

Durante SSR, retorna shell mínimo:

```typescript
if (!isClient) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
}
```

## 🚀 Testando

```powershell
# 1. Reinicie o servidor
# Ctrl+C no terminal
npm run dev

# 2. Teste estas URLs:
http://localhost:3005/test        # Rota isolada
http://localhost:3005/             # Landing page
http://localhost:3005/login        # Login
```

## 📊 Resultado Esperado

- ✅ `/test` deve funcionar
- ✅ `/` deve funcionar
- ✅ Todas as rotas devem funcionar
- ✅ i18n vai carregar no cliente após hidratação

## ⚠️ Efeitos Colaterais

Durante os primeiros milissegundos no cliente:
- Interface pode aparecer em inglês antes de mudar para o idioma salvo
- Isso é normal - o i18n está carregando assincronamente

Para melhorar isso (opcional):
- Adicione um loading spinner inicial
- Ou defina idioma padrão no HTML

## 🔍 Por Que Isso Aconteceu?

O problema estava em **3 camadas**:

1. **`__root.tsx`** importava i18n com side-effect
2. **`i18n/config.ts`** executava código na importação
3. **`getSavedLanguage()`** acessava localStorage antes do check SSR

A correção remove o import side-effect e carrega i18n apenas no cliente.

## 📝 Arquivos Modificados

1. ✅ `src/routes/__root.tsx` - Lazy load i18n
2. ✅ `src/i18n/config.ts` - Já tinha proteção SSR
3. ✅ `src/hooks/useStore.ts` - Já tinha proteção SSR
4. ✅ `src/store/userStore.ts` - Já tinha proteção SSR
5. ✅ `src/lib/auth.tsx` - Já tinha proteção SSR
6. ✅ `src/integrations/supabase/client.ts` - Já tinha proteção SSR

---

**Data:** 2 de junho de 2026  
**Status:** ✅ Correção aplicada - aguardando teste  
**Root Cause:** Side-effect import do i18n executando durante SSR
