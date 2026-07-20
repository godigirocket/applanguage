# 📚 GUIA DE USO - LUME PLATFORM

## 🎯 Como Usar as Novas Funcionalidades

---

## 1. 🎨 NOTIFICAÇÕES ESTILO iOS

### Uso Básico

```typescript
import { toast } from "sonner";

// Success
toast.success("Parabéns!", {
  description: "Você completou a lição!",
  duration: 3000,
});

// Error
toast.error("Ops!", {
  description: "Algo deu errado. Tente novamente.",
});

// Warning
toast.warning("Atenção!", {
  description: "Você está prestes a perder seu streak.",
});

// Info
toast.info("Dica", {
  description: "Pratique todos os dias para melhores resultados!",
});
```

### Com Ações

```typescript
toast.success("Lição Completa!", {
  description: "Você ganhou 50 XP",
  action: {
    label: "Ver Progresso",
    onClick: () => navigate("/progress"),
  },
});
```

---

## 2. 📊 SISTEMA DE MÉTRICAS

### Integração em Lições

```typescript
import {
  awardLessonXP,
  updateDailyStreak,
  updateQuestProgress,
  showCorrectAnswerFeedback,
  showIncorrectAnswerFeedback,
} from "@/lib/metrics-helper";

// Ao completar uma lição
function onLessonComplete() {
  const completionData = {
    lessonId: lesson.id,
    xpEarned: 50,
    correctAnswers: 8,
    totalQuestions: 10,
    timeSpent: 180, // segundos
    perfectScore: false,
  };

  // Concede XP com bônus automáticos
  const totalXP = awardLessonXP(completionData);
  
  // Atualiza streak diário
  updateDailyStreak();
  
  // Atualiza quests
  updateQuestProgress("dq-1", 1); // +1 lição completa
  updateQuestProgress("dq-2", totalXP); // +XP ganho
}

// Ao responder uma questão
function onAnswerQuestion(isCorrect: boolean) {
  const { consecutiveCorrect, addConsecutiveCorrect, addConsecutiveIncorrect } =
    useUserStore.getState();

  if (isCorrect) {
    addConsecutiveCorrect();
    showCorrectAnswerFeedback(consecutiveCorrect + 1);
    updateQuestProgress("dq-3", 1); // +1 acerto
  } else {
    addConsecutiveIncorrect();
    showIncorrectAnswerFeedback("A resposta correta é X porque...");
  }
}
```

### Salvamento de Progresso

```typescript
import {
  saveLessonProgress,
  loadLessonProgress,
  clearLessonProgress,
} from "@/lib/metrics-helper";

// Salvar progresso
saveLessonProgress(lessonId, currentStep, totalSteps, answers);

// Carregar progresso
const saved = loadLessonProgress(lessonId);
if (saved) {
  setCurrentStep(saved.currentStep);
  setAnswers(saved.answers);
}

// Limpar progresso (ao completar)
clearLessonProgress(lessonId);
```

### Estatísticas de Performance

```typescript
import {
  calculatePerformanceStats,
  getMotivationalMessage,
} from "@/lib/metrics-helper";

const stats = calculatePerformanceStats(
  correctAnswers,
  totalQuestions,
  timeSpent
);

console.log(stats);
// {
//   accuracy: 80,
//   avgTimePerQuestion: 18,
//   performance: "good",
//   stars: 2
// }

const message = getMotivationalMessage(stats.performance);
toast.success(message, {
  description: `${stats.accuracy}% de acerto | ⭐ ${stats.stars}/3`,
});
```

---

## 3. 🌍 GLOBO 3D REALISTA

### Uso do Componente

```typescript
import { WorldGlobe3D } from "@/components/WorldGlobe3D";

function CulturePage() {
  const [selectedCountry, setSelectedCountry] = useState("usa");
  const [selectedCity, setSelectedCity] = useState("ny");

  return (
    <div className="globe-container">
      <WorldGlobe3D
        selectedCountryId={selectedCountry}
        selectedCityId={selectedCity}
        onSelectCountryCity={(countryId, cityId) => {
          setSelectedCountry(countryId);
          setSelectedCity(cityId);
        }}
      />
    </div>
  );
}
```

### Customização de Pins

```typescript
// Adicionar novos pins em WorldGlobe3D.tsx
const CITY_PINS: CityPin[] = [
  {
    cityId: "tokyo",
    countryId: "japan",
    name: "Tokyo",
    namePT: "Tóquio",
    nameES: "Tokio",
    lat: 35.6895,
    lng: 139.6917,
  },
  // ... mais cidades
];
```

---

## 4. 📱 RESPONSIVIDADE

### Classes Disponíveis

```tsx
// Container centralizado
<div className="onboarding-container">
  {/* Conteúdo sempre centralizado */}
</div>

// Grid de lições (responsivo automático)
<div className="lesson-grid">
  {lessons.map((lesson) => (
    <LessonCard key={lesson.id} lesson={lesson} />
  ))}
</div>

// Grid de cultura (responsivo automático)
<div className="culture-grid">
  {countries.map((country) => (
    <CountryCard key={country.id} country={country} />
  ))}
</div>
```

### Breakpoints

```css
/* Mobile: < 640px */
- 1 coluna
- Botões maiores (48px)
- Inputs com font-size 16px

/* Tablet: 641px - 1024px */
- 2 colunas
- Padding médio (24px)

/* Desktop: > 1025px */
- 3-4 colunas
- Padding generoso (32px)
- Max-width 1280px
```

---

## 5. ⚡ ANIMAÇÕES PREMIUM

### XP Gain Animation

```typescript
// Automático ao usar awardLessonXP()
// Ou manual:
const element = document.createElement("div");
element.className = "xp-gain-animation";
element.textContent = "+50 XP";
element.style.left = "50%";
element.style.top = "50%";
document.body.appendChild(element);

setTimeout(() => element.remove(), 1500);
```

### Streak Fire

```tsx
<div className={streak > 0 ? "streak-active" : ""}>
  🔥 {streak} dias
</div>
```

### Progress Bar

```tsx
<div className="h-2 bg-surface-raised rounded-full overflow-hidden">
  <div
    className="h-full bg-accent-green progress-bar-fill"
    style={{ "--progress-width": `${progress}%` } as any}
  />
</div>
```

### Combo Multiplier

```tsx
{consecutiveCorrect >= 3 && (
  <div className="combo-multiplier">
    🔥 Combo x{multiplier}
  </div>
)}
```

---

## 6. 🎮 COMPONENTE DE LIÇÃO COMPLETO

### Uso do LessonPlayer

```typescript
import { LessonPlayer } from "@/components/LessonPlayer";
import { ALL_LESSONS } from "@/lib/lessons-data";

function LessonPage() {
  const [playing, setPlaying] = useState(false);
  const lesson = ALL_LESSONS[0];

  if (playing) {
    return (
      <LessonPlayer
        lesson={lesson}
        onComplete={() => {
          setPlaying(false);
          navigate("/lessons");
        }}
        onExit={() => {
          setPlaying(false);
        }}
      />
    );
  }

  return (
    <div>
      <h1>{lesson.title}</h1>
      <button onClick={() => setPlaying(true)}>
        Começar Lição
      </button>
    </div>
  );
}
```

---

## 7. 🎨 LOADING STATES

### Skeleton Loader

```tsx
<div className="skeleton-loader h-20 w-full" />
```

### Spinner Premium

```tsx
<div className="spinner-premium" />
```

### Pulse Loading

```tsx
<div className="pulse-loading">
  Carregando...
</div>
```

---

## 8. 🔔 RECUPERAÇÃO DE SENHA

### Link no Login

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/forgot-password">
  Esqueceu a senha?
</Link>
```

### Fluxo Completo

1. Usuário clica em "Esqueceu a senha?"
2. Digita e-mail
3. Recebe link de recuperação
4. Clica no link (redireciona para `/reset-password`)
5. Define nova senha

---

## 9. 📊 DASHBOARD DE MÉTRICAS

### Exemplo de Dashboard

```typescript
import { useUserStore } from "@/store/userStore";

function Dashboard() {
  const { xp, streak, lumes, quests } = useUserStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* XP Card */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-sm text-muted-foreground">Total XP</h3>
        <p className="text-4xl font-bold text-accent-green">{xp}</p>
      </div>

      {/* Streak Card */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-sm text-muted-foreground">Ofensiva</h3>
        <p className="text-4xl font-bold text-accent-terra">
          🔥 {streak} dias
        </p>
      </div>

      {/* Lumes Card */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-sm text-muted-foreground">Lumes</h3>
        <p className="text-4xl font-bold text-accent-gold">✨ {lumes}</p>
      </div>

      {/* Quests */}
      <div className="col-span-full space-y-3">
        <h3 className="text-lg font-bold">Missões Diárias</h3>
        {quests.map((quest) => (
          <div key={quest.id} className="glass p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{quest.title}</span>
              <span className="text-sm text-muted-foreground">
                {quest.current}/{quest.target}
              </span>
            </div>
            <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green transition-all"
                style={{
                  width: `${(quest.current / quest.target) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 10. 🎯 BOAS PRÁTICAS

### Performance

```typescript
// ✅ BOM: Usar will-change em elementos animados
<div className="lume-card" style={{ willChange: "transform" }}>

// ✅ BOM: Lazy loading de imagens
<img src="..." loading="lazy" />

// ✅ BOM: Debounce em inputs
const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

### Acessibilidade

```tsx
// ✅ BOM: Focus visible
<button className="focus-visible:outline-accent-green">

// ✅ BOM: ARIA labels
<button aria-label="Fechar modal">

// ✅ BOM: Keyboard navigation
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
```

### Responsividade

```tsx
// ✅ BOM: Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ✅ BOM: Touch-friendly
<button className="min-h-[48px] min-w-[48px]">

// ✅ BOM: Safe area
<div className="pb-safe">
```

---

## 🚀 CHECKLIST DE IMPLEMENTAÇÃO

### Para Cada Nova Lição:

- [ ] Adicionar chamada para `awardLessonXP()` ao completar
- [ ] Implementar `showCorrectAnswerFeedback()` em quizzes
- [ ] Adicionar `showIncorrectAnswerFeedback()` com explicações
- [ ] Atualizar `updateQuestProgress()` para quests relevantes
- [ ] Implementar salvamento de progresso
- [ ] Adicionar barra de progresso visual
- [ ] Mostrar combo multiplier quando aplicável
- [ ] Celebrar com confetti em performances excelentes

### Para Cada Nova Página:

- [ ] Adicionar classe `onboarding-container` se precisar centralizar
- [ ] Usar grid responsivo (`.lesson-grid`, `.culture-grid`)
- [ ] Adicionar skeleton loaders para loading states
- [ ] Implementar error boundaries
- [ ] Testar em mobile, tablet e desktop
- [ ] Verificar acessibilidade (focus, ARIA, keyboard)

---

## 📞 SUPORTE

Se tiver dúvidas ou problemas:

1. Consulte `MELHORIAS_IMPLEMENTADAS.md` para lista completa de features
2. Veja exemplos em `LessonPlayer.tsx`
3. Teste as animações em `styles.css`
4. Verifique as funções helper em `metrics-helper.ts`

---

**Desenvolvido com ❤️ para Lume Platform**
