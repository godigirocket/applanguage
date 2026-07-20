# 🔧 GUIA PRÁTICO: Integrar Mercado Pago (3 Dias)

**Para:** Lançar venda de Premium do LUME  
**Tempo:** 3 dias (1 dev em tempo integral)  
**Custo:** R$ 0 (setup), 2.99% taxa por transação

---

## 📋 PRÉ-REQUISITOS

- [ ] Conta Mercado Pago (www.mercadopago.com.br)
- [ ] CNPJ ou CPF validado
- [ ] Conta bancária brasileira
- [ ] Node.js + npm rodando

---

## ⚡ PASSO 1: Setup Mercado Pago (15 min)

### 1.1 Criar Conta de Negócio
1. Acesse [mercadopago.com.br](https://www.mercadopago.com.br)
2. Clique "Abrir conta"
3. Preencha: Email, CNPJ/CPF, Dados bancários
4. Confirme via SMS

### 1.2 Obter Credentials
1. Após login, vá para **Configurações > Credenciais**
2. Copie:
   - **Public Key:** pk_test_XXXXXXXXX (ou production)
   - **Access Token:** APP_USR_XXXXXXXXX
3. Salve em `.env.local`:

```bash
# .env.local
VITE_MERCADO_PAGO_PUBLIC_KEY=pk_test_XXXXXXXXX
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_XXXXXXXXX
```

### 1.3 Ativar Checkout
1. Em Configurações, vá para **Checkout**
2. Ative:
   - ✅ Checkout web
   - ✅ Cartão de crédito
   - ✅ PIX
   - ✅ Boleto

---

## 💻 PASSO 2: Backend (Servidor Node.js)

Vou usar seu já existente em `api/index.js`.

### 2.1 Instalar Dependência

```bash
npm install @mercadopago/sdk-nodejs
```

### 2.2 Criar Endpoint de Pagamento

Edite `api/index.js`:

```javascript
import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from '@mercadopago/sdk-nodejs';

const app = express();
app.use(express.json());

// Inicializar SDK Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// ====== CRIAR PREFERÊNCIA DE PAGAMENTO ======
app.post('/api/payment/create-preference', async (req, res) => {
  try {
    const { planId, userId, email } = req.body;
    
    // Mapear plano para detalhes
    const PLANS = {
      'premium_monthly': {
        price: 29.90,
        title: 'LUME Premium - Mensal',
        description: 'Acesso ilimitado a lições, jogos e IA',
      },
      'premium_annual': {
        price: 249.90,
        title: 'LUME Premium - Anual',
        description: 'Acesso ilimitado (12 meses) com 17% desconto',
      },
    };

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    // Criar preferência (checkout)
    const preference = new Preference(client);
    const preferenceData = {
      items: [
        {
          id: planId,
          title: plan.title,
          description: plan.description,
          quantity: 1,
          unit_price: plan.price,
        },
      ],
      payer: {
        email: email,
        name: 'LUME User',
      },
      auto_return: 'approved',
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success?preference_id={preference_id}`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/payment/pending`,
      },
      notification_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    };

    const response = await preference.create({ body: preferenceData });
    
    // Retornar link de checkout
    res.json({
      checkoutUrl: response.init_point, // URL do checkout
      preferenceId: response.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to create preference' });
  }
});

// ====== WEBHOOK (Receber notificação do pagamento) ======
app.post('/api/payment/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar detalhes do pagamento
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      if (paymentData.status === 'approved') {
        // ✅ PAGAMENTO APROVADO - Ativar subscription no Supabase
        const userId = paymentData.metadata.user_id;
        const planId = paymentData.metadata.plan_id;

        // Chamar função Supabase para ativar subscription
        await activateSubscription(userId, planId, paymentId);

        console.log(`✅ Payment approved for user ${userId}, plan ${planId}`);
      }
    }

    res.json({ status: 'received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook failed' });
  }
});

// ====== VERIFICAR STATUS DO PAGAMENTO ======
app.get('/api/payment/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    res.json({
      status: paymentData.status,
      amount: paymentData.transaction_amount,
      userId: paymentData.metadata.user_id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// ====== HELPER: Ativar Subscription no Supabase ======
async function activateSubscription(userId, planId, paymentId) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const endDate = new Date();
  if (planId === 'premium_monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (planId === 'premium_annual') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  await supabase
    .from('subscriptions')
    .insert([
      {
        user_id: userId,
        plan: planId,
        status: 'active',
        payment_provider: 'mercado_pago',
        external_subscription_id: paymentId,
        current_period_start: new Date().toISOString(),
        current_period_end: endDate.toISOString(),
        created_at: new Date().toISOString(),
      },
    ]);
}

app.listen(3001, () => console.log('Server running on :3001'));
```

---

## 🎨 PASSO 3: Frontend (React)

### 3.1 Instalar SDK do Mercado Pago

```bash
npm install @mercadopago/sdk-react
```

### 3.2 Componente de Checkout

Crie `src/components/MercadoPagoCheckout.tsx`:

```typescript
import { useCallback } from 'react';
import { loadMercadoPago, Wallet } from '@mercadopago/sdk-react';

export function MercadoPagoCheckout({ planId, userId, email }: {
  planId: 'premium_monthly' | 'premium_annual',
  userId: string,
  email: string,
}) {
  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

  // Carregar SDK
  loadMercadoPago();

  const handleCheckout = useCallback(async () => {
    try {
      // 1. Chamar backend para criar preferência
      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId, email }),
      });

      const { checkoutUrl } = await response.json();

      // 2. Redirecionar para checkout Mercado Pago
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao iniciar checkout');
    }
  }, [planId, userId, email]);

  return (
    <button
      onClick={handleCheckout}
      style={{
        padding: '12px 24px',
        background: '#009EE3', // Cor Mercado Pago
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      💳 Pagar com Mercado Pago
    </button>
  );
}
```

### 3.3 Integrar em Pricing Page

Edite `src/routes/pricing.tsx`:

```typescript
import { MercadoPagoCheckout } from '@/components/MercadoPagoCheckout';
import { useAuth } from '@/lib/auth';

export function PricingPage() {
  const { user } = useAuth();

  return (
    <div>
      {/* CARD PREMIUM MENSAL */}
      <div className="plan-card">
        <h2>Premium Mensal</h2>
        <p className="price">R$ 29,90<span>/mês</span></p>
        <ul>
          <li>Lições ilimitadas</li>
          <li>21 modos de jogo</li>
          <li>IA conversação unlimited</li>
          <li>Certificados</li>
        </ul>
        {user ? (
          <MercadoPagoCheckout
            planId="premium_monthly"
            userId={user.id}
            email={user.email}
          />
        ) : (
          <button>Login para comprar</button>
        )}
      </div>

      {/* CARD PREMIUM ANUAL */}
      <div className="plan-card popular">
        <h2>Premium Anual</h2>
        <p className="price">R$ 249,90<span>/ano</span></p>
        <p className="savings">Economize 17%</p>
        <ul>
          <li>Tudo do plano mensal</li>
          <li>Ebooks de cultura</li>
          <li>Suporte prioritário</li>
        </ul>
        {user ? (
          <MercadoPagoCheckout
            planId="premium_annual"
            userId={user.id}
            email={user.email}
          />
        ) : (
          <button>Login para comprar</button>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ PASSO 4: Verificação de Pagamento (Frontend)

Crie `src/routes/payment.success.tsx`:

```typescript
import { useSearchParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function verifyPayment() {
      const paymentId = searchParams.preference_id;
      
      try {
        const response = await fetch(`/api/payment/status/${paymentId}`);
        const data = await response.json();

        if (data.status === 'approved') {
          setStatus('success');
          setTimeout(() => navigate({ to: '/profile' }), 3000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        setStatus('error');
      }
    }

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {status === 'loading' && <p>⏳ Verificando pagamento...</p>}
      {status === 'success' && (
        <div>
          <h1>✅ Pagamento Aprovado!</h1>
          <p>Seu acesso Premium foi ativado.</p>
          <p>Você será redirecionado em 3 segundos...</p>
        </div>
      )}
      {status === 'pending' && (
        <div>
          <h1>⏳ Pagamento em Processamento</h1>
          <p>Voltaremos em breve com a confirmação.</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h1>❌ Erro na Verificação</h1>
          <button onClick={() => navigate({ to: '/' })}>Voltar para home</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🔐 PASSO 5: Proteger Features Premium

No seu hook de autenticação (`src/lib/auth.tsx`):

```typescript
export async function isPremium(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!data) return false;

  // Verificar se ainda está dentro do período
  return new Date(data.current_period_end) > new Date();
}
```

Usar em rotas:

```typescript
export const Route = createFileRoute('/games')({
  beforeLoad: async ({ context }) => {
    const { user } = context;
    if (!user) throw new Error('Not authenticated');
    
    const premium = await isPremium(user.id);
    // Liberar features premium se isPremium = true
  },
  component: GamesPage,
});
```

---

## 🧪 PASSO 6: Testar em Sandbox

### 6.1 Modo de Teste (Sandbox)
Mercado Pago oferece modo de teste automático com public key `pk_test_*`.

### 6.2 Cartões de Teste

Use esses cartões para testar:

| Cartão | Status | CVV | Vencimento |
|--------|--------|-----|-----------|
| 4235 6477 2625 2623 | Aprovado ✅ | 123 | 11/25 |
| 5031 4332 1540 0326 | Recusado ❌ | 123 | 11/25 |
| 6011 5551 3344 0949 | Pendente ⏳ | 123 | 11/25 |

### 6.3 Testar Fluxo Completo

1. Acesse `/pricing`
2. Clique "Comprar" → Vai para Mercado Pago
3. Selecione "Cartão de crédito"
4. Preencha com cartão de teste
5. Clique "Pagar"
6. ✅ Deve retornar para `/payment/success`

---

## 📊 PASSO 7: Analytics & Monitoramento

Adicione logs em `api/index.js`:

```javascript
app.post('/api/payment/webhook', async (req, res) => {
  console.log('🔔 WEBHOOK RECEBIDO:', {
    tipo: req.body.type,
    id: req.body.data.id,
    timestamp: new Date().toISOString(),
  });
  
  // ... resto do código
});
```

Monitore com:
- Dashboard Mercado Pago (Relatórios > Transações)
- Logs do seu servidor
- Supabase `subscriptions` table

---

## 💰 PASSO 8: Go Live (Produção)

### 8.1 Ativar Modo Produção no Mercado Pago

1. Em Configurações > Credenciais, alterne para **Chaves de Produção**
2. Copie: Public Key `pk_prod_*` e Access Token `APP_USR_*`
3. Atualize `.env.local`:

```bash
VITE_MERCADO_PAGO_PUBLIC_KEY=pk_prod_XXXXX
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_prod_XXXXX
```

### 8.2 Atualizar URLs (backend)

```javascript
const backUrls = {
  success: 'https://seu-dominio.com/payment/success',
  failure: 'https://seu-dominio.com/payment/failure',
  pending: 'https://seu-dominio.com/payment/pending',
};
```

### 8.3 Deploy

```bash
npm run build
# Deploy para Vercel/seu servidor
```

---

## ✅ CHECKLIST FINAL

- [ ] Conta Mercado Pago criada
- [ ] Credenciais copiadas para `.env.local`
- [ ] Dependência `@mercadopago/sdk-nodejs` instalada
- [ ] Endpoint `/api/payment/create-preference` criado
- [ ] Webhook `/api/payment/webhook` testado
- [ ] Componente `MercadoPagoCheckout` integrado
- [ ] Rota `/payment/success` criada
- [ ] Verificação de subscription no banco
- [ ] Features premium protegidas
- [ ] Testado com cartões de teste
- [ ] Deploy feito
- [ ] Chaves de produção ativadas
- [ ] Primeiro pagamento feito com sucesso ✅

---

## 🆘 TROUBLESHOOTING

### "Invalid preference_id"
- Verifique se o `planId` está em `PLANS`
- Verifique se `email` está correto

### Webhook não chega
- Verifique URL no Mercado Pago (deve ser HTTPS)
- Veja logs do servidor
- Teste manualmente: `curl -X POST https://seu-dominio.com/api/payment/webhook`

### Cartão recusado
- Use cartão de teste fornecido
- Modo sandbox ativa automaticamente com `pk_test_*`

---

## 📞 SUPORTE

- Docs Mercado Pago: https://www.mercadopago.com.br/developers/docs
- SDK Node: https://github.com/mercadopago/sdk-nodejs
- Email: devops@mercadopago.com

**Tempo Total: 3 dias para dev experiente. Você consegue! 🚀**

