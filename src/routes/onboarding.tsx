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
    <div className="min-h-screen bg-background dark:bg-[#111113] flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden relative transition-colors duration-300">
      
      {/* Decorative Orbs */}
      <div className="orb w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-green/10 top-[-5%] right-[-5%] pointer-events-none absolute rounded-full blur-[80px]" />
      <div className="orb w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-accent-terra/10 bottom-[-5%] left-[-5%] pointer-events-none absolute rounded-full blur-[80px]" />

      <main className="w-full max-w-md relative z-10">
        
        {/* Onboarding Card */}
        <div className="glass p-6 md:p-8 rounded-[28px] border border-border bg-white dark:bg-[#1B1B1E] shadow-lg relative overflow-hidden transition-all duration-300">
          
          {/* Header navigation (Back button + progress bar) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700, padding: '4px 8px', borderRadius: '8px'
                }}
                className="hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                <span>{isPT ? "Voltar" : "Back"}</span>
              </button>
            ) : (
              <div style={{ width: '60px' }} />
            )}

            <div className="flex-1 flex justify-center">
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-green)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {isPT ? `Passo ${step + 1} de ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}
              </span>
            </div>

            <div style={{ width: '60px' }} />
          </div>

          {/* Real progress bar */}
          <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '99px', overflow: 'hidden', marginBottom: '28px' }}>
            <div 
              style={{ 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--accent-green), #40A878)',
                width: `${((step + 1) / STEPS.length) * 100}%`,
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
              }} 
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <h2 className="font-display text-2xl md:text-3xl text-var(--text-primary) font-extrabold leading-tight mb-6">
                {currentStepData.question}
              </h2>

              {currentStepData.type === "text" || currentStepData.type === "number" ? (
                <div className="space-y-4">
                  <input
                    type={currentStepData.type}
                    placeholder={currentStepData.placeholder}
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextText()}
                    autoFocus
                    style={{
                      width: '100%', textAlign: 'center', fontSize: '18px', padding: '14px 18px',
                      borderRadius: '16px', border: '1.5px solid var(--border)', background: 'var(--bg)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                    className="focus:border-accent-green"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextText}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '16px',
                      background: 'var(--accent-green)', color: 'white', border: 'none',
                      fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(45,106,79,0.15)'
                    }}
                  >
                    <span>{isPT ? "Avançar" : "Continue"}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </motion.button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {currentStepData.options?.map((opt) => (
                    <motion.button
                      key={opt.val}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelect(opt.val)}
                      disabled={isSaving}
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: '16px',
                        background: 'var(--surface-raised)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                      className="hover:border-accent-green active:brightness-95 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: 'var(--accent-green)' }}>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Small brand note */}
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '24px', fontWeight: 600 }}>
          Lume — Language & Mind Experience
        </p>
      </main>
    </div>
  );
}