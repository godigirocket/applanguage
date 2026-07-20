# Debug SSR - Logs Detalhados Habilitados

## 🔧 O Que Foi Feito

Adicionei **logs detalhados** em 3 pontos críticos para identificar o erro exato:

### 1. **Server Entry** (`src/server.ts`)
- Log da URL sendo acessada
- Log quando handler é carregado
- Log do status da resposta
- Log detalhado de QUALQUER erro (stack, name, message)

### 2. **Error Capture** (`src/lib/error-capture.ts`)
- Log de todos os erros capturados globalmente
- Log de rejeições de promessas não tratadas
- Stack trace completa

### 3. **Vite Config** (`vite.config.ts`)
- Configurado `ssr.noExternal` para Supabase
- Configurado prerender apenas para landing page

## 🚀 INSTRUÇÕES CRÍTICAS

### 1. REINICIE O SERVIDOR

```powershell
# No terminal onde está npm run dev, pressione Ctrl+C

# Aguarde parar completamente

# Reinicie
npm run dev
```

### 2. MONITORE OS LOGS

**IMPORTANTE:** Mantenha o terminal visível onde está rodando `npm run dev`

Quando acessar `http://localhost:3005`, você verá logs detalhados como:

```
[Server] Request URL: http://localhost:3005/
[Server] Handler loaded
[Server] Response status: 200
```

OU se houver erro:

```
[Error Capture] Error recorded: ...
[Error Capture] Stack: ...
[Error Capture] Name: ...
[Server] Fatal error: ...
[Server] Error stack: ...
```

### 3. COPIE OS LOGS

**Quando o erro aparecer no browser:**

1. Vá no terminal onde `npm run dev` está rodando
2. Role para cima até encontrar os logs mais recentes
3. Copie TUDO que aparecer com `[Server]` ou `[Error Capture]`
4. Me envie essas mensagens

## 🔍 O Que Procurar nos Logs

Os logs vão revelar:

1. **Qual URL está falhando** - `[Server] Request URL: ...`
2. **Onde exatamente o erro ocorre** - Antes ou depois de carregar handler
3. **Stack trace completa** - Mostra o arquivo e linha exata do erro
4. **Tipo de erro** - Error name e message

## ⚠️ Se Não Aparecer Logs

Se você NÃO ver NENHUM log no terminal (nem `[Server]` nem `[Error Capture]`):

Isso significa que o erro está acontecendo **ANTES** do nosso código ser executado, provavelmente:

1. Erro na importação de algum módulo
2. Erro no Vite ao processar arquivos
3. Erro no TanStack Start ao inicializar

Nesse caso, procure por:
- Mensagens de erro em **vermelho** no terminal
- Erros sobre módulos não encontrados
- Avisos sobre syntax errors

## 📋 Checklist

Antes de testar:
- [ ] Servidor foi reiniciado (Ctrl+C e `npm run dev`)
- [ ] Terminal está visível
- [ ] Browser está em modo anônimo (Ctrl+Shift+N)
- [ ] URL é `http://localhost:3005`

Após erro aparecer:
- [ ] Copiei logs do terminal com `[Server]` ou `[Error Capture]`
- [ ] Copiei mensagens de erro em vermelho (se houver)
- [ ] Anotei a URL exata onde o erro ocorreu

---

**Próximo Passo:** Após reiniciar e testar, me envie os logs completos do terminal
