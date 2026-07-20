# 🚀 GUIA RÁPIDO - MVP LUME

**Para desenvolvedores, designers e stakeholders**

---

## ⚡ START RÁPIDO

```bash
# 1. Instalar dependências
npm install

# 2. Configurar environment variables
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase

# 3. Iniciar desenvolvimento
npm run dev

# 4. Abrir no browser
# http://localhost:5173
```

---

## 📱 ROTAS PRINCIPAIS

### 🏠 **Landing Page** - `/`
**O que é:** Página inicial pública com preview do produto
**Highlights:**
- Hero com conversação simulada
- Stats de 30.000 conteúdos
- 6 personagens animados
- 3 features cards
- CTA para signup

**Ideal para:** Demonstrar aos investidores e novos usuários

---

### 🎯 **Dashboard** - `/home`
**O que é:** Hub principal após login
**Highlights:**
- 8 seções dinâmicas
- Continue Learning (Netflix style)
- Recommended Videos
- Explore Cities
- Quick Quizzes
- Active Friends
- Daily Quest + Leaderboard

**Ideal para:** Mostrar a densidade de conteúdo e gamificação

---

### 📚 **Lessons Catalog** - `/lessons`
**O que é:** Catálogo completo de 12.000 lições
**Highlights:**
- Sistema de busca
- Filtros por nível (Beginner/Intermediate/Advanced)
- Filtros por categoria (Grammar, Vocabulary, etc.)
- 100+ lições visíveis no grid
- Cards com progress tracking

**Ideal para:** Demonstrar estrutura de aprendizado

**Como usar:**
1. Clique em "Filtros" para ver opções
2. Selecione nível desejado
3. Escolha categoria
4. Use busca para encontrar tópicos específicos

---

### 🎮 **Games Arena** - `/games`
**O que é:** 18+ modos de jogo interativos
**Highlights:**
- Quick Quiz
- Speed Round
- Daily Challenge
- Survival Mode
- Grammar Builder
- Accent Mimic
- E mais 12 modos

**Ideal para:** Mostrar gamificação e variedade

---

### 🌍 **Culture Immersion** - `/culture`
**O que é:** Imersão cultural com 50 cidades
**Highlights:**
- 30.000 conteúdos culturais
- 6 categorias (Vídeos, Podcasts, Histórias, etc.)
- 8 cidades em destaque com fotos reais
- Design tipo Airbnb Experiences

**Ideal para:** Mostrar diferencial cultural

---

### 💬 **Community** - `/community`
**O que é:** Feed social estilo Discord + Reddit
**Highlights:**
- 8+ posts simulados
- Tipos: achievements, questions, tips, memes
- Sistema de likes, comments, shares
- Filtros por tipo de conteúdo
- Stats: 2.847 membros online

**Ideal para:** Mostrar aspecto social

---

### 👤 **Profile** - `/profile`
**O que é:** Perfil completo do usuário
**Highlights:**
- League & Division system
- 8 stats cards
- 100+ achievements
- Progress tracking
- Activity overview

**Ideal para:** Mostrar progressão e gamificação

---

### 🆓 **Guest Trial** - `/guest`
**O que é:** Trial de 10 minutos sem cadastro
**Highlights:**
- 4 atividades: Quiz, Conversa, Lição, Pronúncia
- Timer countdown
- Modal de signup no final

**Ideal para:** Conversão de usuários

---

## 🎨 COMPONENTES PRINCIPAIS

### **AppHeader**
```tsx
import { AppHeader } from "@/components/lume/AppHeader";

// Já está em todas as páginas
// Contém: logo, navegação, dark mode, idioma
```

### **CustomIcons**
```tsx
import { Play, Star, Trophy } from "@/components/lume/CustomIcons";

// 80+ ícones SVG disponíveis
// Ver lista completa em: src/components/lume/CustomIcons.tsx
```

### **Leaderboard**
```tsx
import { Leaderboard } from "@/components/lume/Leaderboard";

<Leaderboard />
// Ranking animado com 20 jogadores
// Atualização ao vivo a cada 60s
```

### **DailyQuest**
```tsx
import { DailyQuest } from "@/components/lume/DailyQuest";

<DailyQuest />
// Missões diárias com progress bar
// 3 objetivos: lições, prática, quiz
```

---

## 📦 GERADORES DE CONTEÚDO

### **contentEngine.ts**
```tsx
import { generateLessons, generateVideos, generateQuizzes, CITIES } from "@/data/contentEngine";

// Gerar lições
const lessons = generateLessons(50); // Gera 50 lições

// Gerar vídeos
const videos = generateVideos(20); // Gera 20 vídeos

// Gerar quizzes
const quizzes = generateQuizzes(10); // Gera 10 quizzes

// Usar cidades
const allCities = CITIES; // Array de 50 cidades
```

### **gamification.ts**
```tsx
import { getLeague, ACHIEVEMENTS } from "@/data/gamification";

// Pegar liga do usuário
const league = getLeague(xp);

// Todas as conquistas
const achievements = ACHIEVEMENTS; // 100+ achievements
```

---

## 🎯 FLUXOS PRINCIPAIS

### **Fluxo de Novo Usuário**
```
1. Acessar /
2. Clicar "Começar" ou "Experimentar Grátis"
3. Se Experimentar: vai para /guest (10min trial)
4. Se Começar: vai para /signup
5. Após signup: redireciona para /home
```

### **Fluxo de Aprendizado**
```
1. Login em /home
2. Ver "Continue Learning" com lições recomendadas
3. Clicar em lição → /lesson/:id (não implementado ainda)
4. Completar lição → ganha XP
5. Ver conquistas em /profile
```

### **Fluxo de Cultura**
```
1. Acessar /culture
2. Ver 8 cidades em destaque
3. Clicar em cidade → (futuro: modal com conteúdos)
4. Explorar 6 categorias de conteúdo
```

### **Fluxo de Jogos**
```
1. Acessar /games
2. Ver 18 modos disponíveis
3. Clicar em modo → /quiz/:mode
4. Jogar quiz
5. Ganhar XP
```

---

## 🛠️ CUSTOMIZAÇÃO

### **Mudar Idioma da Interface**
```tsx
// No AppHeader ou em qualquer página
const { setInterfaceLanguage } = useStore();

setInterfaceLanguage("pt"); // Português
setInterfaceLanguage("en"); // Inglês
setInterfaceLanguage("es"); // Espanhol
```

### **Adicionar Nova Cor**
```css
/* Em src/index.css ou arquivo de tema */
:root {
  --minha-cor: #FF5733;
}

/* Usar em componentes */
style={{ color: "var(--minha-cor)" }}
```

### **Criar Novo Ícone**
```tsx
// Em src/components/lume/CustomIcons.tsx
export const MeuIcone: React.FC<IconProps> = ({ size = 20, color = "currentColor", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...props}>
    {/* SVG path */}
  </svg>
);

// Adicionar ao DynamicIcon mapping
const icons: Record<string, React.FC<IconProps>> = {
  // ... outros ícones
  MeuIcone,
};
```

---

## 🐛 DEBUG COMUM

### **Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### **Erro: "Supabase client not initialized"**
```bash
# Verificar .env.local tem:
VITE_SUPABASE_URL=sua-url
VITE_SUPABASE_ANON_KEY=sua-chave
```

### **Página em branco**
```bash
# Verificar console do browser (F12)
# Verificar se usuário está logado (se necessário)
# Verificar imports estão corretos
```

### **TypeScript errors**
```bash
# Rodar type check
npm run type-check

# Verificar imports
# Verificar tipos estão corretos
```

---

## 📊 DADOS MOCKADOS

### **Onde estão os dados?**
```
src/data/
├── contentEngine.ts      # Gera lições, vídeos, quizzes
├── gamification.ts       # Ligas e conquistas
├── vocabularyExpanded.json  # 300-500 palavras
└── masterContent.json    # Conteúdo mestre

src/lib/
├── topics.ts            # 8 tópicos de conversação
├── lessons-data.ts      # 4 lições manuais
└── contentStats.ts      # Estatísticas globais
```

### **Adicionar mais lições**
```tsx
// Opção 1: Usar gerador
const novasLicoes = generateLessons(50);

// Opção 2: Adicionar manualmente em lessons-data.ts
export const ALL_LESSONS = [
  {
    id: "nova-licao-1",
    title: "Título da Lição",
    language: "en",
    level: "Beginner",
    duration: "10 min",
    xp: 50,
    // ... resto dos campos
  },
  // ... outras lições
];
```

---

## 🎯 DEMOS RECOMENDADAS

### **Demo para Investidores (5 min)**
```
1. Landing page (/) - 30 seg
   → Mostrar 30k conteúdos

2. Home (/home) - 2 min
   → Mostrar 8 seções
   → Destacar densidade de conteúdo

3. Culture (/culture) - 1 min
   → Mostrar cidades
   → Destacar imersão cultural

4. Profile (/profile) - 1 min
   → Mostrar gamificação
   → Ligas e conquistas

5. Perguntas - 30 seg
```

### **Demo para Usuários (3 min)**
```
1. Guest trial (/guest) - 2 min
   → Deixar experimentar quiz
   → Mostrar conversa

2. Signup - 30 seg
   → Criar conta rápida

3. Dashboard (/home) - 30 seg
   → Tour rápido das features
```

### **Demo Técnico (10 min)**
```
1. Arquitetura - 3 min
   → React + TypeScript
   → Supabase backend
   → Vite build

2. Design System - 2 min
   → Componentes reutilizáveis
   → Tokens de design

3. Conteúdo - 3 min
   → Geradores automáticos
   → 30k distribuição

4. Próximos passos - 2 min
   → Roadmap
   → Melhorias
```

---

## 🚀 DEPLOY

### **Preparar para deploy**
```bash
# 1. Build production
npm run build

# 2. Testar build local
npm run preview

# 3. Verificar .env production está configurado

# 4. Deploy (exemplo Vercel)
vercel --prod
```

### **Variáveis de ambiente necessárias**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 📞 SUPORTE

### **Problemas?**
1. Verificar VERIFICACAO_FINAL_MVP.md
2. Verificar REFACTOR_COMPLETO_MVP.md
3. Verificar ARQUITETURA_ATUAL.md
4. Ver issues comuns acima

### **Features faltando?**
Ver "Próximos Passos" em REFACTOR_COMPLETO_MVP.md

---

## ✅ QUICK CHECKLIST

```
Antes de demo:
□ npm run dev funcionando
□ Todas 8 páginas carregam
□ Não há erros no console
□ Imagens carregando
□ Responsivo em mobile
□ Browser testado (Chrome/Firefox)

Antes de deploy:
□ npm run build sem erros
□ Environment variables configuradas
□ Database conectado
□ URLs de produção atualizadas
□ SSL configurado
```

---

**✨ MVP está pronto para uso!**
**📧 Dúvidas? Consulte documentos completos na raiz do projeto**
