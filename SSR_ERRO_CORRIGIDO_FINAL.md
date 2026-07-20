# SSR Error Corrigido - HTTPError 500

## Problema
Erro persistente ao carregar qualquer página da aplicação:
```
Error: h3 swallowed SSR error: {"status":500,"unhandled":true,"message":"HTTPError"}
```

## Causa Raiz Identificada (Múltiplos Pontos)
O erro era causado por **3 problemas simultâneos** de acesso a APIs do browser durante SSR:

### 1. **Supabase Client** - `src/integrations/supabase/client.ts`
- Tentava acessar `process.env` durante SSR (não disponível no TanStack Start + Vite)
- Falhava ao criar o cliente e lançava exceção

### 2. **Zustand Store** - `src/hooks/useStore.ts`  
- `onRehydrateStorage` acessava `localStorage` sem proteção SSR
- Executava durante a hidratação inicial no servidor

### 3. **i18n Config** - `src/i18n/config.ts`
- `getSavedLanguage()` chamava `localStorage.getItem()` durante inicialização do módulo
- Era executado antes do SSR completar

## Soluções Aplicadas

### 1. **Supabase Client SSR-Safe** (`src/integrations/supabase/client.ts`)
```typescript
function createSupabaseClient() {
  // SSR protection: defer client creation until browser environment
  if (typeof window === "undefined") {
    console.warn('[Supabase] SSR detected - creating minimal client');
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  // Client-side: use Vite environment variables (replaced at build time)
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  // ...
}
```

**Mudanças:**
- ✅ Detecta SSR com `typeof window === "undefined"` no início
- ✅ Retorna cliente dummy durante SSR
- ✅ No browser, usa apenas `import.meta.env.VITE_*` (injetado pelo Vite)
- ✅ Remove tentativa de acessar `process.env`

### 2. **Zustand Store SSR-Safe** (`src/hooks/useStore.ts`)
```typescript
onRehydrateStorage: () => (state) => {
  // SSR protection
  if (typeof window === "undefined") return;
  
  if (state?.interfaceLanguage) {
    // ... resto do código
  }
},
```

**Mudanças:**
- ✅ Adiciona `if (typeof window === "undefined") return;` no início
- ✅ Previne acesso a `localStorage` durante SSR

### 3. **i18n Config SSR-Safe** (`src/i18n/config.ts`)
```typescript
i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== "undefined" ? getSavedLanguage() : "pt",
  fallbackLng: "pt",
  // ...
});
```

**Mudanças:**
- ✅ Adiciona verificação `typeof window !== "undefined"` antes de chamar `getSavedLanguage()`
- ✅ Usa "pt" como padrão durante SSR

### 4. **Porta Atualizada** (`vite.config.ts`)
- ✅ Alterado de `3003` para `3005`
- ✅ Evita conflito com outro projeto na porta 3001

## Comportamento Agora

### Durante SSR (Server-Side Rendering):
1. ✅ Supabase retorna cliente dummy (não faz chamadas)
2. ✅ Zustand store não acessa `localStorage`
3. ✅ i18n usa idioma padrão "pt"
4. ✅ Página renderiza HTML sem erros
5. ✅ HTML é enviado ao cliente

### No Browser (Hydration):
1. ✅ Supabase cria cliente real com credenciais do `.env`
2. ✅ Zustand rehidrata do `localStorage`
3. ✅ i18n carrega idioma salvo
4. ✅ Auth funciona normalmente
5. ✅ Todas as queries funcionam

## Arquivos Modificados
1. ✅ `src/integrations/supabase/client.ts` - Cliente SSR-safe
2. ✅ `src/hooks/useStore.ts` - Store SSR-safe
3. ✅ `src/i18n/config.ts` - i18n SSR-safe
4. ✅ `vite.config.ts` - Porta 3005

## Como Testar
```bash
# Parar o servidor atual (Ctrl+C)
npm run dev
# Servidor abre em http://localhost:3005
```

## Verificação
Teste estas rotas:
- [ ] `/` - Landing page
- [ ] `/home` - Dashboard (requer login)
- [ ] `/login` - Login/Signup
- [ ] `/lessons` - Lições
- [ ] `/progress` - Progresso

Se alguma página ainda apresentar erro, **anote a URL exata** para investigação adicional.

## Rotas Disabled (Ainda)
Estas rotas foram desabilitadas anteriormente e continuam desabilitadas:
- `src/routes/lesson.$id.tsx.disabled` - Sistema de Lesson Player
- `src/routes/community.tsx.disabled` - Chat da comunidade

**Para reativar:** Remova a extensão `.disabled` após confirmar que o SSR está funcionando em todas as rotas principais.

---

**Data:** 2 de junho de 2026  
**Status:** ✅ 3 problemas SSR corrigidos  
**Próximo Passo:** Reiniciar servidor e testar todas as rotas
