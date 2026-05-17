import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeQuery, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { LumeIllustration } from "@/components/lume/LumeIllustration";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Lume — Onboarding" }] }),
  component: OnboardingPage,
});

const STEPS = [
  {
    id: 1,
    question: "Como podemos te chamar?",
    field: "full_name",
    type: "text",
    placeholder: "Digite seu nome...",
  },
  {
    id: 2,
    question: "Qual é a sua idade?",
    field: "age",
    type: "number",
    placeholder: "Ex: 25",
  },
  {
    id: 3,
    question: "Quer aprender gírias e inglês/português real de rua (convencional)?",
    field: "learn_slang",
    type: "options",
    options: [
      { label: "Sim, quero falar como nativo de verdade! 🛹", val: "yes", icon: "🔥" },
      { label: "Prefiro focar em conversação formal / negócios 💼", val: "no", icon: "👔" }
    ]
  },
  {
    id: 4,
    question: "Qual é o seu idioma nativo?",
    field: "native_language",
    type: "options",
    options: [
      { label: "Português", val: "pt", icon: "🇧🇷" },
      { label: "English", val: "en", icon: "🇺🇸" },
      { label: "Español", val: "es", icon: "🇪🇸" }
    ]
  },
  {
    id: 5,
    question: "Qual idioma você quer praticar?",
    field: "target_language",
    type: "options",
    options: [
      { label: "English", val: "en", icon: "🇺🇸" },
      { label: "Español", val: "es", icon: "🇪🇸" },
      { label: "Português", val: "pt", icon: "🇧🇷" }
    ]
  },
  {
    id: 6,
    question: "Qual é o seu nível atual?",
    field: "level",
    type: "options",
    options: [
      { label: "Iniciante (A1 - A2)", val: "beginner", icon: "🌱" },
      { label: "Intermediário (B1 - B2)", val: "intermediate", icon: "⚡" },
      { label: "Avançado / Fluente (C1 - C2)", val: "advanced", icon: "🔥" }
    ]
  },
  {
    id: 7,
    question: "Qual é o seu objetivo principal?",
    field: "goal",
    type: "options",
    options: [
      { label: "Melhorar Conversação Geral", val: "conversação", icon: "🗣️" },
      { label: "Viagens e Intercâmbio", val: "viagem", icon: "✈️" },
      { label: "Trabalho e Negócios", val: "trabalho", icon: "💼" },
      { label: "Preparação para Exames", val: "exame", icon: "🎓" }
    ]
  },
  {
    id: 8,
    question: "Quais temas mais te interessam?",
    field: "interests",
    type: "options",
    options: [
      { label: "Música, Arte & Cultura", val: "musica", icon: "🎵" },
      { label: "Tecnologia, Games & Futuro", val: "tecnologia", icon: "💻" },
      { label: "Gastronomia, Culinária & Viagem", val: "culinaria", icon: "🍳" },
      { label: "Esportes, Saúde & Bem-estar", val: "esportes", icon: "🏀" }
    ]
  }
];

function OnboardingPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textVal, setTextVal] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isPT = interfaceLanguage === "pt";

  useEffect(() => {
    if (!loading && !user) { nav({ to: "/login" }); }
  }, [user, loading, nav]);

  // Load name/email from profile if already available to pre-fill
  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data?.full_name) {
            setTextVal(data.full_name);
          }
        });
    }
  }, [user]);

  const handleNextText = () => {
    if (!textVal.trim()) {
      toast.error(isPT ? "Por favor, preencha o campo antes de continuar!" : "Please fill in the field before continuing!");
      return;
    }
    const currentField = STEPS[step].field;
    const newAnswers = { ...answers, [currentField]: textVal };
    setAnswers(newAnswers);
    setTextVal(""); // Reset text value for the next input step
    
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish(newAnswers);
    }
  };

  const handleSelect = async (val: string) => {
    const currentField = STEPS[step].field;
    const newAnswers = { ...answers, [currentField]: val };
    setAnswers(newAnswers);
    
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await finish(newAnswers);
    }
  };

  const finish = async (finalAnswers: Record<string, string>) => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: finalAnswers.full_name || "Estudante",
        language: finalAnswers.target_language || "en",
        level: (finalAnswers.level as any) || "beginner",
        onboarding_done: true,
        onboarding_answers: finalAnswers
      }).eq("id", user.id);

      if (error) throw error;
      
      toast.success(isPT ? "Perfil configurado com sucesso! Vamos começar." : "Profile tailored successfully! Let's start.");
      nav({ to: "/home" });
    } catch (e) {
      console.error(e);
      toast.error(isPT ? "Erro ao salvar suas respostas. Tente novamente." : "Error saving answers. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentStepData = STEPS[step];

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0B] flex flex-col items-center justify-center p-6 overflow-hidden relative transition-colors duration-300">
      
      {/* Decorative Orbs */}
      <div className="orb w-[500px] h-[500px] bg-accent-green/10 top-[-10%] right-[-10%]" />
      <div className="orb w-[400px] h-[400px] bg-accent-terra/10 bottom-[-10%] left-[-10%]" />

      <main className="w-full max-w-lg relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <LumeIllustration className="w-24 h-24" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="flex items-center justify-center gap-1.5 text-accent-green dark:text-accent-gold font-extrabold text-[11px] tracking-[0.2em] uppercase mb-3">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{isPT ? `Etapa ${step + 1} de ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-[#1C1C1A] dark:text-white font-extrabold leading-tight">
                {currentStepData.question}
              </h1>
            </div>

            {currentStepData.type === "text" || currentStepData.type === "number" ? (
              <div className="space-y-4">
                <input
                  type={currentStepData.type}
                  placeholder={currentStepData.placeholder}
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNextText()}
                  autoFocus
                  className="w-full text-center text-lg py-4 px-6 rounded-2xl border-1.5 border-border bg-white dark:bg-zinc-800/60 dark:border-zinc-700 dark:text-white focus:border-accent-green focus:ring-4 focus:ring-accent-green/10 outline-none transition-all duration-300 shadow-sm"
                />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextText}
                  className="w-full py-4 rounded-2xl bg-accent-green dark:bg-accent-gold text-white dark:text-zinc-900 font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(45,74,62,0.15)] cursor-pointer"
                >
                  <span>{isPT ? "Avançar" : "Continue"}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {currentStepData.options?.map((opt) => (
                  <motion.button
                    key={opt.val}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleSelect(opt.val)}
                    disabled={isSaving}
                    className="w-full py-4.5 px-6 rounded-2xl bg-white dark:bg-zinc-800/60 border border-border dark:border-zinc-700 hover:border-accent-green dark:hover:border-accent-gold text-base font-bold text-[#1C1C1A] dark:text-white flex items-center justify-between cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4.5">
                      <span className="text-2xl">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-accent-green dark:text-accent-gold">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div className="mt-12 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === step ? '28px' : '6px',
                background: i === step ? '#2D4A3E' : '#E0DDD6'
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}