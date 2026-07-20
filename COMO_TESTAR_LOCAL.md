# 🚀 COMO TESTAR O APP LOCALMENTE

**Data:** Junho 22, 2026  
**Status:** Build compilando com sucesso

---

## ✅ SERVIDOR ESTÁ RODANDO

**URL correta:** http://localhost:8081/  
**Porta:** 8081 (não 8080 - porta estava ocupada)

---

## 🔍 SE NÃO CARREGAR

### 1. Verificar Console do Navegador

Abra o DevTools do navegador (F12) e veja se há erros JavaScript.

**Erros comuns:**
- Erro de CORS
- Erro de módulo não encontrado
- Erro de autenticação Supabase

### 2. Verificar Terminal do Servidor

O servidor deve mostrar:
```
✅ VITE v7.3.3  ready in 5066 ms
  ➜  Local:   http://localhost:8081/
  ➜  Network: http://192.168.2.131:8081/
```

### 3. Testar Rotas Específicas

Tente acessar diretamente:

**Landing Page:**
http://localhost:8081/

**Home (requer login):**
http://localhost:8081/home

**Pricing:**
http://localhost:8081/pricing

**Checkout:**
http://localhost:8081/checkout?plan=premium_annual

**Setup (sem auth):**
http://localhost:8081/setup

---

## 🐛 TROUBLESHOOTING

### Problema: "Página em branco"

**Causa:** Erro JavaScript no cliente

**Solução:**
1. Abrir DevTools (F12)
2. Ir na aba "Console"
3. Verificar erros vermelhos
4. Copiar erro e me enviar

---

### Problema: "Cannot GET /"

**Causa:** Servidor não está rodando

**Solução:**
```bash
cd "c:\Users\Ruboy\Desktop\Dev Projects\applanguage"
npm run dev
```

Aguardar mensagem: "ready in XXXXms"

---

### Problema: "Network error"

**Causa:** Supabase não configurado ou API key inválida

**Solução temporária:**
1. Acessar rotas que não precisam de auth:
   - http://localhost:8081/ (landing)
   - http://localhost:8081/setup (setup)
   - http://localhost:8081/pricing (pricing)

---

### Problema: "Port 8081 already in use"

**Solução:**
```bash
# Matar processo na porta 8081
netstat -ano | findstr :8081
taskkill /PID [PID_NUMBER] /F

# Ou usar porta diferente
npm run dev -- --port 3000
```

---

## 📊 VERIFICAR STATUS DO BUILD

### Build de Produção

```bash
npm run build
```

**Resultado esperado:**
```
✅ Exit Code: 0
✅ dist/client/ criado
✅ dist/server/ criado
```

### Build atual:
✅ **COMPILANDO SEM ERROS**
✅ **413 linhas** no checkout.tsx
✅ **10 arquivos** com ícones atualizados
✅ **0 emojis** no código

---

## 🔐 LOGIN LOCAL

Se você quer testar com login:

### Opção 1: Usar Supabase Local
```bash
# Se tiver Supabase CLI
supabase start
```

### Opção 2: Mockar Auth
Adicionar no `.env.local`:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Opção 3: Testar sem Login
Páginas que funcionam sem login:
- `/` - Landing page
- `/pricing` - Pricing page
- `/setup` - Setup instructions
- `/checkout` - Checkout (redireciona para login se não autenticado)

---

## 🎯 ROTAS PARA TESTAR VISUAL

### 1. Landing Page (index.tsx)
**URL:** http://localhost:8081/

**O que ver:**
- ✅ Stats com ícones (BookOpen, Zap, Gamepad2, Globe)
- ✅ "Conversa ao Vivo" com MessageCircle icon
- ✅ Sem emojis

---

### 2. Pricing (pricing.tsx)
**URL:** http://localhost:8081/pricing

**O que ver:**
- ✅ Trust badges com ícones (Check, Lock, RefreshCw)
- ✅ Plano free com Target icon
- ✅ Sem emojis

---

### 3. Checkout Premium (checkout.tsx)
**URL:** http://localhost:8081/checkout?plan=premium_annual

**O que ver:**
- ✅ Hero com CharacterCelebrating + background pattern
- ✅ Trust badges (Users, Globe, Star icons)
- ✅ Order summary com GraduationCap icon
- ✅ Security badge com Lock icon + gradient
- ✅ Rating com 5 Star icons dourados
- ✅ Sem emojis

---

### 4. Setup (setup.tsx)
**URL:** http://localhost:8081/setup

**O que ver:**
- ✅ Copy button com Check/Save icons
- ✅ Sem emojis

---

## 💡 DICAS

### Ver Output do Dev Server

```bash
# Terminal atual mostra logs
# Procurar por:
✅ "ready in XXXms" - servidor iniciou
❌ "Error: ..." - erro de compilação
⚠️  "Warning: ..." - avisos (geralmente OK)
```

### Limpar Cache

Se página não atualiza:

```bash
# Parar servidor (Ctrl+C)
# Limpar cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstalar (opcional)
npm install

# Rodar novamente
npm run dev
```

### Hard Refresh no Navegador

```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

---

## 🆘 SE NADA FUNCIONAR

### Me envie:

1. **Screenshot** da página (ou tela em branco)
2. **Console do navegador** (F12 → Console)
3. **Output do terminal** (onde rodou `npm run dev`)
4. **URL que está tentando acessar**

### Informações do sistema:
- ✅ Windows
- ✅ Node.js instalado
- ✅ npm instalado
- ✅ Build compila (Exit Code: 0)
- ✅ Servidor roda na porta 8081

---

## ✅ CHECKLIST RÁPIDO

```
[ ] npm run dev executado?
[ ] Mensagem "ready in XXXms" apareceu?
[ ] Acessando http://localhost:8081/ (não 8080)?
[ ] Console do navegador sem erros?
[ ] Hard refresh tentado (Ctrl+Shift+R)?
```

---

**Se todos checklist OK e ainda não carregar, me envie os 4 itens do "SE NADA FUNCIONAR"**

