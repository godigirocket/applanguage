# 📱 GUIA RÁPIDO DE TESTES MOBILE

## 🎯 **Como Testar a Responsividade em 5 Minutos**

### **Última Atualização:** 25 de junho de 2026

---

## 🖥️ **Opção 1: Chrome DevTools (Mais Rápido)**

### **Passo 1: Abrir DevTools**
1. Abra o aplicativo no navegador: `http://localhost:3000`
2. Pressione `F12` ou `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Clique no ícone de **dispositivos móveis** (📱) ou pressione `Ctrl+Shift+M`

### **Passo 2: Testar Breakpoints Críticos**
Teste estes tamanhos na ordem:

#### **360x640 — Mobile Pequeno (Samsung Galaxy S8)**
```
- [ ] Header móvel visível
- [ ] Bottom navigation funcionando
- [ ] Filtros de lições sem overflow
- [ ] Cards de lições em 1 coluna
- [ ] Hero stats em 2x2 grid
- [ ] Texto legível (min 14px)
```

#### **375x667 — iPhone SE**
```
- [ ] Padding adequado (14px laterais)
- [ ] Botões > 44px de altura
- [ ] Search bar 100% largura
- [ ] Grids não quebram viewport
```

#### **414x896 — iPhone 14 Pro Max**
```
- [ ] Layout confortável
- [ ] Safe area respeitada (notch)
- [ ] Bottom nav com padding-bottom correto
```

#### **768x1024 — iPad Portrait**
```
- [ ] Desktop nav visível
- [ ] Bottom tabs ocultas
- [ ] 2-3 colunas nos grids
- [ ] Padding aumentado (20px laterais)
```

#### **1024x768 — iPad Landscape**
```
- [ ] Layout desktop completo
- [ ] 3-4 colunas nos grids
- [ ] Nav labels não truncadas
```

#### **1440x900 — Desktop Padrão**
```
- [ ] Máximo 4 colunas nos grids
- [ ] Conteúdo centralizado (max-width: 1400px)
- [ ] Espaçamento generoso
```

---

## 📱 **Opção 2: Dispositivos Reais (Mais Preciso)**

### **Passo 1: Conectar ao Localhost**
```bash
# 1. Descobrir IP da máquina
ipconfig          # Windows
ifconfig          # Mac/Linux

# 2. Exemplo de IP: 192.168.1.100
# 3. No celular, acessar: http://192.168.1.100:3000
```

### **Passo 2: Testar Funcionalidades**
```
- [ ] Touch gestures funcionam
- [ ] Teclado mobile não quebra layout
- [ ] Scroll suave (sem travamentos)
- [ ] Bottom nav fixo mesmo no scroll
- [ ] Modals centralizados
- [ ] Inputs com autocomplete funcionando
```

---

## 🔧 **Opção 3: Playwright (Automatizado)**

### **Setup:**
```bash
npm install -D @playwright/test
npx playwright install
```

### **Criar Teste:** `tests/mobile.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('360px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('http://localhost:3000/lessons');
    
    // Header mobile visível
    const bottomNav = page.locator('.lume-mobile-tabs');
    await expect(bottomNav).toBeVisible();
    
    // Desktop nav oculta
    const desktopNav = page.locator('.lume-desktop-nav');
    await expect(desktopNav).not.toBeVisible();
    
    // Filtros sem overflow
    const filters = page.locator('[style*="minmax"]');
    const box = await filters.boundingBox();
    expect(box.width).toBeLessThanOrEqual(360);
  });
  
  test('768px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/lessons');
    
    // Desktop nav visível
    const desktopNav = page.locator('.lume-desktop-nav');
    await expect(desktopNav).toBeVisible();
    
    // Bottom tabs ocultas
    const bottomNav = page.locator('.lume-mobile-tabs');
    await expect(bottomNav).not.toBeVisible();
  });
});
```

### **Executar:**
```bash
npx playwright test tests/mobile.spec.ts
```

---

## 🚨 **BUGS COMUNS A VERIFICAR**

### **1. Overflow Horizontal**
```
Sintoma: Scroll horizontal aparece
Causa: Elemento > 100vw
Como Testar: Inspecionar elementos com > 100% width
```

### **2. Texto Ilegível**
```
Sintoma: Font-size < 14px
Causa: Valor fixo em vez de clamp()
Como Testar: Zoom out e verificar legibilidade
```

### **3. Botões Pequenos**
```
Sintoma: Touch target < 44px
Causa: Padding/height insuficiente
Como Testar: Tentar clicar com o dedo
```

### **4. Bottom Nav Sobrepondo Conteúdo**
```
Sintoma: Últimos cards cortados
Causa: Falta de padding-bottom
Como Testar: Scrollar até o final da página
```

### **5. Modais Fora da Viewport**
```
Sintoma: Modal não centralizado
Causa: position: fixed sem transforms
Como Testar: Abrir modal em 360px
```

---

## ✅ **CHECKLIST RÁPIDO (2 MINUTOS)**

### **Mobile (< 768px):**
```
✅ Bottom navigation visível e fixo
✅ Desktop nav oculta
✅ Grids em 1-2 colunas
✅ Padding lateral 14-16px
✅ Font-size mínimo 14px
✅ Touch targets > 44px
✅ Safe area respeitada
✅ Sem overflow horizontal
```

### **Tablet (768px - 1023px):**
```
✅ Desktop nav visível
✅ Bottom tabs ocultas
✅ Grids em 2-3 colunas
✅ Padding lateral 20px
✅ Nav labels não truncadas
```

### **Desktop (> 1024px):**
```
✅ Layout completo
✅ Grids em 3-4 colunas
✅ Max-width 1400px
✅ Conteúdo centralizado
```

---

## 🎯 **TESTES PRIORITÁRIOS (TOP 5)**

### **1. Landing Page (`/`)**
```bash
# Abrir DevTools (F12)
# Device: iPhone SE (375x667)
# Verificar:
- Hero section legível
- CTAs tocáveis (> 44px)
- Stats em 2x2 grid
- Conversation card visível
```

### **2. Lessons Page (`/lessons`)**
```bash
# Device: Samsung Galaxy S8 (360x640)
# Verificar:
- Filtros sem overflow
- Search bar 100% width
- Cards em 1 coluna
- Hero stats em 2x2
```

### **3. Home Page (`/home`)**
```bash
# Device: iPhone 14 Pro Max (414x896)
# Verificar:
- Bottom nav fixo
- Safe area respeitada
- Cards tocáveis
- Sem scroll horizontal
```

### **4. Profile Page (`/profile`)**
```bash
# Device: iPad (768x1024)
# Verificar:
- Desktop nav visível
- Bottom tabs ocultas
- Stats em 2 colunas
```

### **5. Quiz Page (`/quiz/flashcards`)**
```bash
# Device: iPhone SE (375x667)
# Verificar:
- Modal centralizado
- Botões acessíveis
- Sem keyboard overlap
```

---

## 📊 **LIGHTHOUSE AUDIT (CLI)**

### **Instalar:**
```bash
npm install -g lighthouse
```

### **Executar:**
```bash
# Mobile
lighthouse http://localhost:3000 --preset=mobile --view

# Desktop
lighthouse http://localhost:3000 --preset=desktop --view
```

### **Métricas Alvo:**
```
Performance: > 90
Accessibility: > 90
Best Practices: > 90
SEO: > 90
```

---

## 🔍 **FERRAMENTAS RECOMENDADAS**

### **1. Responsively App** (GRÁTIS)
```
Download: https://responsively.app
Visualiza múltiplos breakpoints simultaneamente
Sincroniza scroll e navegação
```

### **2. BrowserStack** (PAGO)
```
URL: https://www.browserstack.com
Testa em dispositivos reais na nuvem
> 2000 dispositivos disponíveis
```

### **3. Chrome DevTools Device Mode** (GRÁTIS)
```
Emula 30+ dispositivos
Throttling de rede (3G, 4G)
Screenshots de viewport
```

### **4. Firefox Responsive Design Mode** (GRÁTIS)
```
Pressionar Ctrl+Shift+M
Testes de rotação
Simulação de touch events
```

---

## 🚀 **SCRIPT DE TESTE AUTOMATIZADO**

### **Criar:** `scripts/test-mobile.js`
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const devices = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];
  
  for (const device of devices) {
    await page.setViewport({ width: device.width, height: device.height });
    await page.goto('http://localhost:3000/lessons');
    
    // Screenshot
    await page.screenshot({
      path: `screenshots/${device.name}.png`,
      fullPage: true
    });
    
    console.log(`✅ ${device.name} (${device.width}x${device.height})`);
  }
  
  await browser.close();
})();
```

### **Executar:**
```bash
node scripts/test-mobile.js
```

---

## 📸 **CAPTURA DE SCREENSHOTS**

### **Manual (Chrome DevTools):**
```
1. F12 → Device Mode (Ctrl+Shift+M)
2. Selecionar dispositivo
3. Ctrl+Shift+P → "Capture screenshot"
4. Salvar como: screenshots/device-page.png
```

### **Automatizado (Playwright):**
```typescript
import { test } from '@playwright/test';

test('screenshot mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/lessons');
  await page.screenshot({ path: 'screenshots/lessons-mobile.png' });
});
```

---

## ⚡ **TESTE RÁPIDO (30 SEGUNDOS)**

```bash
# 1. Abrir app
npm run dev

# 2. Abrir DevTools (F12)

# 3. Device Mode (Ctrl+Shift+M)

# 4. Selecionar "iPhone SE"

# 5. Navegar:
/           → Hero legível?
/lessons    → Filtros OK?
/home       → Bottom nav fixo?

# 6. Selecionar "iPad"

# 7. Verificar:
Desktop nav visível?
Bottom tabs ocultas?

# ✅ PASS — responsivo funcionando!
```

---

## 🎓 **RECURSOS DE APRENDIZADO**

- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/design-and-ux/responsive)
- [CSS Tricks: Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
- [Can I Use: CSS Features](https://caniuse.com/?search=clamp)

---

## 📞 **REPORTAR BUGS**

Se encontrar problemas de responsividade:

```
1. Capturar screenshot
2. Anotar:
   - Dispositivo/viewport
   - URL da página
   - Descrição do bug
   - Comportamento esperado
3. Criar issue: "Mobile: [descrição]"
```

---

**Criado por:** Kiro AI  
**Versão:** 1.0  
**Status:** ✅ Pronto para uso  
**Tempo de Execução:** 2-5 minutos
