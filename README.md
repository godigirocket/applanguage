# 🌍 Lume - Plataforma de Aprendizado de Idiomas

Lume é uma plataforma moderna e gamificada para aprender idiomas através de lições interativas, jogos, quizzes e exploração cultural.

## 🚀 Stack Tecnológica

- **Frontend**: React + TypeScript + TanStack Router
- **Styling**: CSS-in-JS com design system customizado
- **Backend**: Supabase (Auth + Database)
- **Pagamentos**: Cakto (checkout externo)
- **Animações**: Framer Motion
- **Build**: Vite
- **Deploy**: Vercel

## 📦 Instalação

```bash
# Clone o repositório
git clone <seu-repo>

# Instale as dependências
bun install
# ou
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

## ⚙️ Configuração

### 1. Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a ANON KEY do projeto
4. Adicione no `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### 2. Cakto (Pagamentos)

#### Passo 1: Criar conta e produto

1. Acesse [cakto.com.br](https://cakto.com.br) e crie sua conta
2. Crie dois produtos:
   - **Lume Premium - Mensal**: R$ 29,90/mês
   - **Lume Premium - Anual**: R$ 299,90/ano (economia de 16%)

#### Passo 2: Obter URLs de checkout

1. No dashboard do Cakto, vá em "Produtos"
2. Copie o link de checkout de cada produto
3. Os links seguem o formato: `https://pay.cakto.com.br/[product-id]`

#### Passo 3: Configurar variáveis de ambiente

Adicione as URLs no seu `.env.local`:

```env
VITE_CAKTO_CHECKOUT_MONTHLY=https://pay.cakto.com.br/seu-produto-mensal-id
VITE_CAKTO_CHECKOUT_ANNUAL=https://pay.cakto.com.br/seu-produto-anual-id
```

#### Passo 4: Testar checkout

1. Acesse `/pricing` na sua aplicação
2. Clique em "Quero o Premium"
3. Selecione um plano
4. Você será redirecionado para o checkout do Cakto

#### ⚠️ Importante: Liberação de Acesso Premium

**Por padrão, o Lume NÃO libera acesso Premium automaticamente após pagamento.**

Você tem duas opções:

##### Opção A: Processo Manual (Atual)
1. Receba notificação de pagamento do Cakto (email)
2. Identifique o usuário pelo email
3. No Supabase, na tabela `profiles`, atualize:
   - `subscription_status` → `'active'`
   - `subscription_plan` → `'premium_annual'` ou `'premium_monthly'`
   - `subscription_end` → data de expiração

##### Opção B: Webhook Automático (Futuro)
Para liberação automática, você precisará:

1. Criar um endpoint API para receber webhooks do Cakto
2. Configurar o webhook no dashboard do Cakto
3. Validar assinatura do webhook
4. Atualizar banco de dados automaticamente

**Exemplo de endpoint webhook** (não incluído no projeto):

```typescript
// api/webhooks/cakto.ts
export async function POST(request: Request) {
  const signature = request.headers.get('x-cakto-signature');
  const body = await request.json();
  
  // 1. Validar signature
  // 2. Verificar evento (payment.success)
  // 3. Atualizar Supabase profiles
  // 4. Retornar 200 OK
}
```

Documentação de webhooks: [docs.cakto.com.br/webhooks](https://docs.cakto.com.br/webhooks)

## 🏃‍♂️ Desenvolvimento

```bash
# Rodar localmente
bun run dev
# ou
npm run dev

# Build para produção
bun run build
# ou
npm run build

# Preview da build
bun run preview
# ou
npm run preview
```

## 🚢 Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça o deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CAKTO_CHECKOUT_MONTHLY`
   - `VITE_CAKTO_CHECKOUT_ANNUAL`

4. Faça o deploy de produção:
```bash
vercel --prod
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes base (Button, Card, Input, Badge)
│   └── lume/         # Componentes específicos da aplicação
├── routes/           # Páginas (TanStack Router)
├── data/             # Geradores de conteúdo e dados estáticos
├── design/           # Design tokens e sistema
├── hooks/            # Custom hooks (useStore, etc.)
├── lib/              # Utilitários (auth, db, subscription)
├── i18n/             # Internacionalização
└── styles.css        # Estilos globais
```

## 🎨 Design System

O Lume utiliza um design system completo definido em `src/design/tokens.ts`:

- **Cores**: Paleta semântica com suporte a dark mode
- **Espaçamento**: 13 níveis (4px a 128px)
- **Tipografia**: Escalas fluidas com `clamp()`
- **Shadows**: 8 níveis de elevação
- **Breakpoints**: Mobile-first (360px a 4K)

## 🌐 Idiomas Suportados

- Português (pt)
- Inglês (en)
- Espanhol (es)

## 📄 Páginas Legais

Todas as páginas legais obrigatórias estão implementadas:

- `/terms` - Termos de Uso
- `/privacy` - Política de Privacidade
- `/refund` - Política de Reembolso
- `/support` - Suporte e FAQ
- `/success` - Página pós-compra
- `/cancel` - Página de compra cancelada

## 🔒 Segurança e Privacidade

- Arquitetura híbrida local-first
- Dados sensíveis armazenados no Supabase com RLS (Row Level Security)
- Autenticação via Supabase Auth
- HTTPS obrigatório em produção
- Sem cookies de rastreamento de terceiros

## 📈 Funcionalidades

- ✅ Sistema de XP e níveis
- ✅ Ofensiva diária (streak)
- ✅ Lições interativas
- ✅ Quizzes rápidos
- ✅ Jogos gamificados
- ✅ Exploração cultural (cidades)
- ✅ Sistema de ligas e ranking
- ✅ Conquistas e badges
- ✅ Perfil de usuário
- ✅ Plano Premium via Cakto

## 🤝 Contribuindo

Este é um projeto proprietário. Para contribuições, entre em contato com o owner.

## 📞 Suporte

Para questões técnicas ou de negócio, acesse `/support` na aplicação.

## 📝 Licença

Todos os direitos reservados © 2026 Lume

---

**Versão**: 1.0.0  
**Última atualização**: 25 de junho de 2026
