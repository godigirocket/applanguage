# ✅ CHECKLIST DE VALIDAÇÃO VISUAL - LumeLearn

**URL:** https://applanguage.vercel.app  
**Data:** 25 de Junho de 2026  
**Deploy:** COMPLETO ✅  
**Validação:** PENDENTE ⏳

---

## 📋 INSTRUÇÕES

1. Abra https://applanguage.vercel.app em **navegador anônimo** (Ctrl+Shift+N)
2. Marque cada item conforme valida
3. Se algo estiver errado, anote na seção "Problemas Encontrados"
4. Teste em pelo menos 2 dispositivos (desktop + mobile)

---

## 🖥️ VALIDAÇÃO DESKTOP

### Hero Section (Topo da página)

```
[ ] Badge "Lume Platform" visível
[ ] Headline presente e legível
[ ] Botão "Começar grátis" presente
[ ] Botão "Experimentar agora" presente
[ ] Card de "Conversa ao Vivo" visível
```

### Stats Strip (Logo abaixo do Hero)

**CRÍTICO - Verificar números:**

```
[ ] Primeiro stat: "630+" (NÃO "300+" ou "12.000")
[ ] Label: "Lições estruturadas"

[ ] Segundo stat: "6" (NÃO "900+" ou "5.000")
[ ] Label: "Níveis CEFR" ou similar (NÃO "Questões interativas")

[ ] Terceiro stat: "5"
[ ] Label: "Modos de jogo"

[ ] Quarto stat: "3"
[ ] Label: "Idiomas disponíveis"
```

**❌ NÃO DEVE APARECER:**
```
[ ] Confirmar: NÃO tem "12.000 lições"
[ ] Confirmar: NÃO tem "5.000 quizzes"
[ ] Confirmar: NÃO tem "21 modos de jogo"
[ ] Confirmar: NÃO tem "10k+ estudantes"
[ ] Confirmar: NÃO tem "98% satisfação"
```

### Seção "Como o Lume Funciona"

```
[ ] 3 cards de etapas visíveis
[ ] Card 01: "Escolha seu idioma e nível"
[ ] Card 02: "Complete lições estruturadas"
[ ] Card 03: "Pratique com IA e jogos"
[ ] Texto legível e correto
```

### Stats Banner (Mid-page, fundo escuro)

**CRÍTICO - Verificar números novamente:**

```
[ ] Headline: "Tudo que você precisa para aprender"

[ ] Stat 1: "630+" Lições (NÃO "300+")
[ ] Stat 2: "6" Níveis (NÃO "900+")
[ ] Stat 3: "5" Jogos
[ ] Stat 4: "3" Idiomas
```

### Seção "Para Quem É o LumeLearn"

**Deve ter 4 cards com ícones emoji:**

```
[ ] Card 1: 🎯 "Quer praticar todos os dias"
[ ] Card 2: 💬 "Trava na hora de falar"
[ ] Card 3: 📚 "Quer estudar do básico ao avançado"
[ ] Card 4: 🎮 "Aprende melhor jogando"

[ ] Card 3 menciona "630+ lições" (NÃO "300+")
```

**❌ NÃO DEVE TER:**
```
[ ] Confirmar: NÃO tem seção "O que nossos alunos dizem"
[ ] Confirmar: NÃO tem depoimentos com nomes de pessoas
[ ] Confirmar: NÃO tem fotos de perfil de usuários
[ ] Confirmar: NÃO tem porcentagens de satisfação
```

### Features List (3 cards grandes com imagens)

```
[ ] Card 1: IA / Brain icon - Funcional
[ ] Card 2: Cultura / Compass icon - Funcional
[ ] Card 3: Calma / MessageCircle icon - Funcional
[ ] Imagens carregam corretamente
[ ] Overlay legível sobre imagens
```

### Footer

```
[ ] Logo "Lume" visível
[ ] Link "Guia" funciona
[ ] Link "Lições" funciona
[ ] Link "Prática" funciona
[ ] Frase "A calm and artistic speaking companion."
```

---

## 📱 VALIDAÇÃO MOBILE

**Dispositivo:** _______________ (iPhone/Android)  
**Navegador:** _______________ (Safari/Chrome)

### Mobile - Hero Section

```
[ ] Página carrega completamente
[ ] Header mobile funcional
[ ] Menu hamburger abre (se aplicável)
[ ] Headline legível em mobile
[ ] Botões "Começar grátis" tocáveis
[ ] Card de conversa responsivo
```

### Mobile - Stats Strip

```
[ ] Stats em grid responsivo
[ ] "630+" visível e legível
[ ] "6" Níveis visível
[ ] Nenhum overflow horizontal
[ ] Padding adequado nas laterais
```

### Mobile - Scroll Behavior

```
[ ] Scroll suave
[ ] Sem scroll horizontal
[ ] Todos os elementos visíveis
[ ] Nenhum conteúdo cortado
[ ] Footer acessível
```

### Mobile - CTAs

```
[ ] Botão "Começar grátis" clicável
[ ] Botão "Experimentar agora" clicável
[ ] Links do footer clicáveis
[ ] Área de toque confortável (não muito pequena)
```

---

## 🔗 VALIDAÇÃO DE LINKS

**Clique em cada link e confirme que abre a página correta:**

### CTAs Principais

```
[ ] "Começar grátis" → /signup ✅
[ ] "Experimentar agora" → /guest ✅
```

### Footer

```
[ ] "Guia" → /guide ✅
[ ] "Lições" → /lessons ✅
[ ] "Prática" → /guest ✅
```

### Menu (se logado)

```
[ ] "Home" → /home ✅
[ ] "Lições" → /lessons ✅
[ ] "Cultura" → /culture ✅
[ ] "Jogos" → /games ✅
[ ] "Perfil" → /profile ✅
```

---

## 💳 VALIDAÇÃO /PRICING

**Abrir:** https://applanguage.vercel.app/pricing

### Página de Planos

```
[ ] Página carrega corretamente
[ ] Toggle Mensal/Anual funciona
[ ] Plano Gratuito visível
[ ] Plano Premium Mensal visível
[ ] Plano Premium Anual visível
```

### Preços e Features

```
[ ] Gratuito: R$ 0
[ ] Premium Mensal: R$ 29,90/mês
[ ] Premium Anual: R$ 299,90/ano (verificar com Cakto)
[ ] Features listadas são honestas
[ ] Badge "Mais Popular" visível
```

### CTAs de Pricing

```
[ ] Botão "Começar Agora" (Free) → /home ou /signup
[ ] Botão "Fazer Upgrade" (Premium) → /checkout
[ ] Nenhum botão quebrado
```

### Trust Badges

```
[ ] "Garantia 7 dias" visível
[ ] "Pagamento seguro via Cakto" visível
[ ] "Cancele a qualquer momento" visível
```

---

## 🔍 VALIDAÇÃO DE CACHE

### Teste de Cache Limpo

```
[ ] Aberto em navegador anônimo (Ctrl+Shift+N)
[ ] Hard refresh executado (Ctrl+Shift+R)
[ ] DevTools → Network → "Disable cache" marcado
[ ] Números corretos aparecem (630+, 6 níveis)
```

---

## ❌ PROBLEMAS ENCONTRADOS

**Se algo estiver errado, anote aqui:**

### Desktop
```
Problema 1: _______________________________________________________
Onde: ______________________________________________________________
Esperado: __________________________________________________________
Real: ______________________________________________________________

Problema 2: _______________________________________________________
Onde: ______________________________________________________________
Esperado: __________________________________________________________
Real: ______________________________________________________________
```

### Mobile
```
Problema 1: _______________________________________________________
Dispositivo: _______________________________________________________
Navegador: _________________________________________________________
Descrição: _________________________________________________________

Problema 2: _______________________________________________________
Dispositivo: _______________________________________________________
Navegador: _________________________________________________________
Descrição: _________________________________________________________
```

---

## ✅ RESULTADO FINAL

### Status Geral

```
[ ] ✅ TUDO OK - Pronto para tráfego
[ ] ⚠️ PROBLEMAS MENORES - Pode lançar, corrigir depois
[ ] ❌ PROBLEMAS CRÍTICOS - NÃO lançar, corrigir agora
```

### Aprovação

```
Validado por: _____________________
Data: ____________________________
Hora: ____________________________
Dispositivos testados: ____________
Navegadores testados: _____________

✅ APROVADO PARA PRODUÇÃO
```

---

## 📊 RESUMO EXECUTIVO

**Após validação, preencha:**

| Item | Status | Observações |
|------|--------|-------------|
| Números corrigidos (630+) | [ ] ✅ [ ] ❌ | __________________ |
| Claims falsos removidos | [ ] ✅ [ ] ❌ | __________________ |
| Links funcionais | [ ] ✅ [ ] ❌ | __________________ |
| Mobile responsivo | [ ] ✅ [ ] ❌ | __________________ |
| Página /pricing OK | [ ] ✅ [ ] ❌ | __________________ |
| Cache limpo | [ ] ✅ [ ] ❌ | __________________ |

**TUDO OK?** Se sim, o hotfix está completo! ✅  
**Problemas?** Consultar `HOTFIX_LANDING_PRODUCTION.md` para troubleshooting.

---

**Documentação:**
- `HOTFIX_LANDING_PRODUCTION.md` - Relatório técnico completo
- `HOTFIX_RESUMO_EXECUTIVO.md` - Resumo executivo
- `STATUS_ATUAL_COMPLETO.md` - Estado geral do projeto

**Deploy:** https://applanguage.vercel.app  
**Status:** ✅ DEPLOYED - AWAITING VALIDATION
