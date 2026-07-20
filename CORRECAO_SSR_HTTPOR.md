# Correção do Erro SSR 500 - HTTPError

## Problema Identificado

A landing page estava quebrando durante SSR com erro 500:
```
Error: h3 swallowed SSR error: {"status":500,"unhandled":true,"message":"HTTPError"}
```

## Causa Raiz

O arquivo `src/i18n/config.ts` estava tentando acessar `localStorage` durante a inicialização do i18n **no momento da configuração**, o que é executado durante SSR:

```typescript
// ❌ ERRADO - Causa erro SSR
lng: typeof window !== "undefined" ? localStorage.getItem("lume_interface_language") || "pt" : "pt",
```

Embora houvesse um check `typeof window !== "undefined"`, o código estava sendo executado durante o **import** do módulo, antes mesmo do componente renderizar.

## Correção Aplicada

### 1. i18n/config.ts
**Antes:**
```typescript
i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== "undefined" ? localStorage.getItem("lume_interface_language") || "pt" : "pt",
  fallbackLng: "pt",
  // ...
});
```

**Depois:**
```typescript
i18n.use(initReactI18next).init({
  resources,
  lng: "pt", // Always start with pt during SSR
  fallbackLng: "pt",
  // ...
});

// Update language from localStorage on client side only
if (typeof window !== "undefined") {
  const savedLang = localStorage.getItem("lume_interface_language");
  if (savedLang && (savedLang === "pt" || savedLang === "en" || savedLang === "es")) {
    i18n.changeLanguage(savedLang);
  }
}
```

### 2. routes/index.tsx
**Removida a correção ruim:**
```typescript
// ❌ REMOVIDO - mascarava o erro
const [isClient, setIsClient] = useState(false);
if (!isClient) {
  return null;
}
```

**Mantido apenas o uso correto de useEffect:**
```typescript
// ✅ CORRETO - window só acessado no cliente
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 1024);
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

## O Que Foi Preservado

### ✅ Imagens de Background
As imagens de background continuam funcionando perfeitamente porque são apenas strings CSS:
```typescript
style={{
  backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  // ...
}}
```

### ✅ Componentes com Animação
- CharacterCelebrating, CharacterRunner, CharacterThinking, etc.
- Motion.div com framer-motion
- Todos funcionam perfeitamente em SSR

### ✅ Traduções
- Todas as chaves de tradução existem em `i18n/config.ts`
- `landing:featureAITitle`, `featureCultureTitle`, `featureCalmTitle` ✅
- `landing:mktAITitle`, `mktCultureTitle`, etc. ✅

### ✅ Ícones
- Sparkles ✅
- Book ✅
- Brain, Compass, Star, Flame, MessageCircle ✅

## Proteções SSR Existentes

### AppHeader.tsx
✅ Já tem proteção correta:
```typescript
const [theme, setTheme] = useState<"light" | "dark">(() => {
  if (typeof window === "undefined") return "light";
  try {
    return (localStorage.getItem("lume_theme") || "light") as "light" | "dark";
  } catch {
    return "light";
  }
});
```

### useStore.ts
✅ Zustand persist já tem proteção completa:
```typescript
storage: {
  getItem: async (name) => {
    if (typeof window === "undefined") return null;
    // ...
  },
  setItem: async (name, value) => {
    if (typeof window === "undefined") return;
    // ...
  },
}
```

## Resultado Final

- ✅ Landing page carrega sem erro 500
- ✅ Não há mais "h3 swallowed SSR error"
- ✅ SSR funciona corretamente
- ✅ Nenhum `return null` mascarando a página inteira
- ✅ Sem ReferenceError de ícones ou variáveis
- ✅ Sem acesso direto a APIs do browser durante SSR
- ✅ Imagens de background aparecem corretamente
- ✅ Sem erros TypeScript
- ✅ Layout responsivo e visualmente melhorado mantido
- ✅ Animações e personagens funcionando

## Lições Aprendidas

1. **Nunca acesse localStorage/sessionStorage na inicialização de módulos**
   - Mesmo com `typeof window !== "undefined"`, se estiver no escopo do módulo, pode executar durante SSR

2. **Sempre inicialize com valores seguros e atualize no cliente**
   - Inicialize com defaults
   - Use `useEffect` ou código após `if (typeof window !== "undefined")` para atualizar

3. **Não mascare erros SSR com `return null`**
   - Isso esconde o problema real
   - Sempre encontre e corrija a causa raiz

4. **Imagens externas em CSS são seguras para SSR**
   - backgroundImage como string não causa problema
   - Não há fetch ou carregamento no servidor
