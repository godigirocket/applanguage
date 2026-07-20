# ✅ CHECKLIST: Lançar LUME em 30 Dias

**Data Início:** Hoje  
**Data Lançamento:** +30 dias (Beta com seus alunos)  
**Data Público:** +60 dias  

---

## 📋 TAREFAS CRÍTICAS (Sem essas, não vende)

### SEMANA 1: Integração de Pagamento

- [ ] **DIA 1:** Criar conta Mercado Pago
  - Acesse: mercadopago.com.br
  - Preencha dados CNPJ/CPF
  - Salve credenciais em `.env.local`
  - ⏱️ Tempo: 15 min

- [ ] **DIA 2-3:** Implementar backend de pagamento
  - Copie código do `GUIA_INTEGRACAO_MERCADO_PAGO.md`
  - Crie endpoint: `/api/payment/create-preference`
  - Crie webhook: `/api/payment/webhook`
  - Teste com Postman
  - ⏱️ Tempo: 4 horas

- [ ] **DIA 4:** Integrar frontend
  - Crie componente `MercadoPagoCheckout.tsx`
  - Adicione em `src/routes/pricing.tsx`
  - Integre em `src/routes/checkout.tsx`
  - ⏱️ Tempo: 2 horas

- [ ] **DIA 5:** Criar rota de sucesso/erro
  - Crie: `src/routes/payment/success.tsx`
  - Crie: `src/routes/payment/failure.tsx`
  - Teste fluxo completo
  - ⏱️ Tempo: 2 horas

- [ ] **DIA 6-7:** Testes
  - [ ] Teste com cartão de teste
  - [ ] Confirme ativação de subscription no Supabase
  - [ ] Confirme webhook é recebido
  - [ ] Confirme features premium desbloqueiam
  - ⏱️ Tempo: 6 horas

**RESULTADO:** Checkout funcional com Mercado Pago ✅

---

### SEMANA 2: Conteúdo & Tracking

- [ ] **DIA 8:** Gerar mais lições
  - Abra `src/data/contentEngine.ts`
  - Aumente `generateLessons()` de 100 para 5.000
  - Regenere `src/data/content.ts`
  - ⏱️ Tempo: 1 hora

- [ ] **DIA 9:** Criar tabela de progresso
  - Acesse Supabase
  - Crie tabela: `lesson_progress`
    ```sql
    CREATE TABLE lesson_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id),
      lesson_id TEXT,
      completed BOOLEAN DEFAULT false,
      score INT DEFAULT 0,
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT now()
    );
    ```
  - ⏱️ Tempo: 1 hora

- [ ] **DIA 10:** Implementar tracking no app
  - Crie função: `saveProgressLesson()`
  - Integre no final de cada lição
  - Teste salvamento no banco
  - ⏱️ Tempo: 2 horas

- [ ] **DIA 11:** Criar dashboard do tutor
  - Crie rota: `/tutor/dashboard`
  - Mostra lista de alunos + progresso
  - Mostra gráfico de XP/semana
  - ⏱️ Tempo: 4 horas

- [ ] **DIA 12-14:** Integração & Testes
  - [ ] Teste salvamento de progresso
  - [ ] Confirme dados aparecem no dashboard
  - [ ] Testes com 5 usuários reais
  - ⏱️ Tempo: 8 horas

**RESULTADO:** 5.000+ lições + tracking de progresso ✅

---

### SEMANA 3: QA & Marketing Prep

- [ ] **DIA 15:** Setup Google Analytics
  - Crie conta Google Analytics 4
  - Instale tag na app
  - Configure eventos: "Purchase", "Start Lesson", "Play Game"
  - ⏱️ Tempo: 2 horas

- [ ] **DIA 16:** Email transacional
  - Integre SendGrid (ou Resend)
  - Email de boas-vindas
  - Email de compra bem-sucedida
  - ⏱️ Tempo: 3 horas

- [ ] **DIA 17:** Testes em múltiplos devices
  - [ ] Desktop (Chrome, Safari, Firefox)
  - [ ] Mobile iOS (Safari)
  - [ ] Mobile Android (Chrome)
  - [ ] Teste checkout end-to-end em cada um
  - ⏱️ Tempo: 4 horas

- [ ] **DIA 18:** Preparar materiais de venda
  - [ ] Vídeo 1 min (seu intro + features)
  - [ ] 5 imagens de screenshot
  - [ ] Texto de venda (cópia para TikTok/Insta)
  - [ ] Criar landing page simples
  - ⏱️ Tempo: 6 horas

- [ ] **DIA 19-21:** Preparar alunos para beta
  - [ ] Selecione 5-10 alunos atuais
  - [ ] Prepare email de convite
  - [ ] Crie código de desconto para eles
  - [ ] Prepare perguntas de feedback
  - ⏱️ Tempo: 3 horas

**RESULTADO:** App pronto + materiais de venda ✅

---

### SEMANA 4: Beta Launch

- [ ] **DIA 22:** Enviar convites beta
  - Email + WhatsApp para 5-10 alunos
  - Ofereça 30 dias grátis + desconto depois
  - Peça feedback após 1 semana
  - ⏱️ Tempo: 1 hora

- [ ] **DIA 23-28:** Monitorar & Iterar
  - [ ] Receba feedback dos alunos
  - [ ] Corrija bugs encontrados
  - [ ] Melhore UI baseado em feedback
  - [ ] Documente mudanças
  - ⏱️ Tempo: 2 horas/dia

- [ ] **DIA 29:** Revisar KPIs
  - [ ] Quantos alunos testaram?
  - [ ] Quanto tempo gastaram/dia?
  - [ ] Qual jogo/lição mais usaram?
  - [ ] NPS (score de satisfação 0-10)?
  - ⏱️ Tempo: 1 hora

- [ ] **DIA 30:** Go/No-Go Decision
  - [ ] Feedback positivo? → Avança para público
  - [ ] Bugs críticos? → Corrige + mais 1 semana beta
  - [ ] Pronto? → Prepara lançamento público
  - ⏱️ Tempo: 1 hora

**RESULTADO:** Beta com 5-10 alunos reais testando ✅

---

## 🚀 TAREFAS IMPORTANTES (Antes do Público)

### Semana 5-6: Pré-Lançamento Público

- [ ] Ativar modo produção Mercado Pago
  - [ ] Trocar credenciais de test → production
  - [ ] Atualizar URLs de callback
  - [ ] Testar 1ª transação real de verdade
  - ⏱️ Tempo: 2 horas

- [ ] Deploy em produção
  - [ ] Build final: `npm run build`
  - [ ] Deploy em Vercel/seu servidor
  - [ ] Teste TODAS as rotas em produção
  - [ ] Confirme SSL/HTTPS funcionando
  - ⏱️ Tempo: 2 horas

- [ ] Criar referral links
  - [ ] Gere link próprio: `lume.app/ref/seu_nome`
  - [ ] Coloque em bio Instagram/TikTok
  - [ ] Compartilhe no grupo de alunos
  - ⏱️ Tempo: 30 min

- [ ] Preparar 5-10 posts para redes sociais
  - [ ] 3 clips TikTok (15-30 seg cada)
  - [ ] 3 posts Instagram com descrição
  - [ ] 1 post LinkedIn profissional
  - [ ] Agende para próximas 4 semanas
  - ⏱️ Tempo: 4 horas

- [ ] Newsletter para emails de contatos
  - [ ] Coleta emails de curiosos (landing page)
  - [ ] Escreva email de lançamento
  - [ ] Integre com SendGrid/Mailchimp
  - ⏱️ Tempo: 2 horas

---

## 📊 TAREFAS BEM-VINDO (Não Bloqueiam, Mas Ajudam)

- [ ] Criar FAQ página
  - Respostas para: "Como funciona?", "É seguro?", "Posso cancelar?"
  - ⏱️ Tempo: 2 horas

- [ ] Criar Termo de Serviço + Política de Privacidade
  - Use templates (TermsFeed, iubenda)
  - Adapte para LGPD
  - ⏱️ Tempo: 1 hora

- [ ] Criar página de suporte
  - Email: support@lume.app (forwarding)
  - Formulário de contato simples
  - ⏱️ Tempo: 1 hora

- [ ] Integrar com Slack/Discord
  - Receba notificações de novos usuarios
  - Receba alertas de pagamentos
  - ⏱️ Tempo: 1 hora

- [ ] Criar grupo WhatsApp "LUME Users"
  - Convide primeiros 10 users
  - Compartilhe tips + desafios
  - Crie comunidade
  - ⏱️ Tempo: 30 min

---

## 💰 TAREFAS DE MONETIZAÇÃO (Pós-Lançamento)

- [ ] Criar programa de afiliado
  - Define comissão: 30% por referral? 50%?
  - Crie página de afiliado: `/affiliate`
  - Integre rastreamento (UTM params)
  - ⏱️ Tempo: 3 horas

- [ ] Setup de ads pagos
  - [ ] Facebook Ads: Create campaign
  - [ ] TikTok Ads: Pixel + conversion tracking
  - [ ] Google Ads: Search ads
  - Budget inicial: R$ 500/semana
  - ⏱️ Tempo: 4 horas

- [ ] Criar pacotes especiais
  - "Mega Bundle": Aula + App + Dashboard
  - "Referral Rewards": Desconto por indicar amigos
  - ⏱️ Tempo: 2 horas

---

## 📱 TAREFAS MOBILE (Opcional, Pós-Lançamento)

- [ ] Criar app nativo (React Native)
  - [ ] iOS app (Apple App Store)
  - [ ] Android app (Google Play Store)
  - ⏱️ Tempo: 2-3 semanas (fora do escopo deste mês)

---

## 🎯 DAILY CHECKLIST (Para Próximos 30 Dias)

### Cada Dia:
- [ ] Trabalho de desenvolvimento (4-6 horas)
- [ ] Responder emails/mensagens de alunos (30 min)
- [ ] Monitor de erros/feedback (30 min)
- [ ] Atualizar progresso em doc compartilhado (5 min)

### Cada Semana:
- [ ] Review de KPIs (usuarios ativos, conversão, etc)
- [ ] Meeting com stakeholders (se houver)
- [ ] Preparar conteúdo social (1 post)

### Cada 2 Semanas:
- [ ] Backup do banco de dados
- [ ] Review de logs de erro
- [ ] Atualizar documentação

---

## ⚠️ RISCOS & CONTINGÊNCIAS

| Risco | Probabilidade | Solução |
|-------|---------------|---------|
| Mercado Pago rejusta sua conta | Baixa | Ter Stripe como backup |
| Bug crítico em checkout | Média | Testes rigorosos Dia 6 |
| Poucos testadores em beta | Média | Recrute mais alunos |
| Servidor cai em produção | Baixa | Backup automático + CDN |
| Falta conteúdo/lições | Baixa | Gerar 5.000 no Dia 8 |

---

## 💪 MOTIVAÇÃO & MINDSET

**Lembre-se:**
- ✅ 85% do trabalho já está feito
- ✅ Falta só "virar a chave" de pagamento
- ✅ 30 dias é TEMPO SUFICIENTE
- ✅ Seus alunos QUEREM usar
- ✅ Você vai ganhar dinheiro

**Não perfeccionista:**
- ❌ Não espere "tudo perfeito"
- ❌ Lance com 80%, itera com feedback
- ❌ Bugs menores podem esperar
- ✅ Focus: Pagamento funcional + 5 alunos testando

**Foco diário:**
- Acordar com propósito claro
- 2-3 tarefas por dia (não faça tudo)
- Pause para testar cada feature
- Durma bem (importante!)

---

## 📞 CHECKLIST FINAL (Dia 30 às 17h)

Antes de "oficialmente lançar", confirme TUDO:

- [ ] Mercado Pago funciona com transação real
- [ ] Webhook recebe aprovação de pagamento
- [ ] Subscription ativa automaticamente no Supabase
- [ ] Features premium desbloqueiam
- [ ] Email de confirmação é enviado
- [ ] Analytics rastreia eventos
- [ ] 5+ alunos testaram e aprovaram
- [ ] Sem erros SSR 500 nas rotas principais
- [ ] Carregamento < 2 seg em mobile
- [ ] Dark/Light mode funciona em todos os modos de jogo
- [ ] Dashboard tutor mostra dados corretos
- [ ] Posts sociais agendados
- [ ] Landing page pronta
- [ ] FAQ atualizado
- [ ] Suporte email respondendo

**Se TUDO acima tem ✅:** Parabéns! Você pode lançar! 🚀

---

## 🎉 PRÓXIMO PASSO (Após 30 Dias)

**Você chegou aqui:**
```
Landing page + App funcional + Pagamento integrado 
+ 5-10 alunos testando + Posts agendados = ✅ PRONTO
```

**Semana 31-40:** Escalar
- Aumentar convites para 30-50 alunos
- Monitorar conversão (meta: 5% free → premium)
- Investir R$ 1.000/mês em ads
- Refinar messaging baseado em feedback

**Mês 3:** Crescimento
- 1.000+ downloads esperados
- 50-100 premium users (R$ 1.500-3.000/mês MRR)
- Quita o investimento de tempo/dev
- App se torna "passive income"

**Mês 6:** Escala
- 5.000-10.000 usuários
- 250-500 premium (R$ 7.500-15.000/mês)
- Agora você pode contratar 1 dev para manutenção
- Você foca em marketing + aulas particulares

**Ano 1:** Consolidação
- 50.000+ usuários
- 2.500+ premium (R$ 75.000+/mês)
- Pode vender as aulas particulares por mais (seleção)
- App gera renda passiva paralela

---

## 📲 CONTATO RÁPIDO

**Se travar:**
- Docs Mercado Pago: developers.mercadopago.com.br
- Supabase Docs: supabase.com/docs
- Vite Docs: vitejs.dev
- React Router: tanstack.com/router

**Erro comum:** Não testar webhook antes de ir pra produção
**Solução:** Use ngrok para testar localmente

**Erro comum:** Esquecer de atualizar credenciais prod
**Solução:** Ter arquivo `.env.prod` separado

---

## ✨ VOCÊ CONSEGUE!

**30 dias, 1 pessoa, tudo que você precisa já existe.**

Comece pelo checklist da Semana 1. Uma coisa por dia.

Em um mês, você terá:
- ✅ Checkout funcionando
- ✅ 5-10 alunos usando o app
- ✅ Receita acontecendo
- ✅ Pronto para escalar

**LET'S GO! 🚀**

---

**Última atualização:** Junho 2026  
**Status:** Pronto para ação  
**Confiança:** 95%

