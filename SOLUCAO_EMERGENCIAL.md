# Solução Emergencial - SSR Error Persistente

## 🚨 Situação

O erro SSR HTTPError 500 persiste mesmo após múltiplas correções. Precisamos de logs do servidor para diagnóstico preciso.

## 📋 OPÇÃO 1: Fornecer Logs (RECOMENDADO)

**Por favor, faça isso:**

1. No terminal onde está `npm run dev`, copie TUDO que aparece
2. Procure especialmente por:
   - Mensagens em **vermelho**
   - Linhas com `[Server]` ou `[Error Capture]`
   - Stack traces
   - Avisos sobre módulos

3. Me envie essas mensagens

**Isso vai permitir identificar o erro exato!**

## 🔧 OPÇÃO 2: Landing Page Minimal (WORKAROUND TEMPORÁRIO)

Se você precisar que o app funcione AGORA enquanto debugamos, use a landing page minimal:

```powershell
# Execute este script
.\use-minimal-landing.ps1

# Reinicie o servidor
# (Ctrl+C no terminal e depois npm run dev)

# Acesse
http://localhost:3005
```

A landing page minimal:
- ✅ Não usa stores (sem Zustand)
- ✅ Não usa auth
- ✅ Não usa i18n complexo
- ✅ HTML puro com links para /login e /signup
- ✅ Deve funcionar mesmo com problemas SSR

**Para reverter:**
```powershell
.\restore-full-landing.ps1
```

## 🔍 OPÇÃO 3: Testar Outras Rotas

Se a landing minimal funcionar, teste estas rotas diretamente:

1. `http://localhost:3005/login` - Login page
2. `http://localhost:3005/signup` - Signup page
3. `http://localhost:3005/home` - Home (requer login)

**Me diga qual funciona e qual falha.** Isso vai ajudar a isolar o problema.

## 📊 OPÇÃO 4: Verificar Conflitos de Porta

Possibilidade remota - verificar se a porta 3005 tem algum problema:

```powershell
# Ver o que está rodando na porta 3005
netstat -ano | findstr :3005

# Se algo aparecer além do seu servidor, mude a porta no vite.config.ts
# para 3006 ou 3007
```

## 🎯 O Que Precisamos Descobrir

O erro está sendo "engolido" pelo framework antes dos nossos logs rodarem. Isso significa:

1. **Erro de Import** - Algum módulo falhando ao carregar
2. **Erro de Sintaxe** - Código mal formatado em algum arquivo
3. **Dependência Faltando** - Algum package não instalado corretamente
4. **Problema do Vite** - Cache corrompido ou configuração inválida

## 🔨 Opções Drásticas (Último Recurso)

Se nada funcionar:

### A. Limpar Cache Completamente
```powershell
# Parar servidor (Ctrl+C)
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .tanstack
Remove-Item -Force bun.lock
npm install
npm run dev
```

### B. Verificar Dependências
```powershell
npm list @supabase/supabase-js
npm list zustand
npm list i18next
```

Se alguma der erro "UNMET DEPENDENCY", reinstalar:
```powershell
npm install @supabase/supabase-js zustand i18next --force
```

### C. Reverter para Commit Funcionando
Se você sabe que o app funcionava antes:
```powershell
git log --oneline -20
# Encontre o commit que funcionava
git checkout <commit-hash>
# Teste se funciona
```

---

## ✅ Próximos Passos

**Por favor, escolha uma opção:**

1. 📋 **Me envie os logs do terminal** (melhor opção)
2. 🔧 **Use a landing minimal** e me diga se funciona
3. 🔍 **Teste outras rotas** e me diga quais funcionam
4. 🔨 **Limpe o cache** e reinstale dependências

Com qualquer uma dessas informações, vou conseguir identificar e resolver o problema!

---

**Criado:** 2 de junho de 2026  
**Status:** Aguardando diagnóstico
