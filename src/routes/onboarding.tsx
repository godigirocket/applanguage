import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeQuery, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { LumeIllustration } from "@/components/lume/LumeIllustration";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Bem-vindo ao Lume — Onboarding" }] }),
  component: OnboardingPage,
});

const STEPS = [
  {
    id: 1,
    question: "Qual é o seu idioma nativo?",
    field: "native_language",
    options: [
      { label: "Português", val: "pt", icon: "🇧🇷" },
      { label: "English", val: "en", icon: "🇺🇸" },
      { label: "Español", val: "es", icon: "🇪🇸" }
    ]
  },
  {
    id: 2,
    question: "Qual idioma você quer praticar?",
    field: "target_language",
    options: [
      { label: "English", val: "en", icon: "🇺🇸" },
      { label: "Español", val: "es", icon: "🇪🇸" },
      { label: "Português", val: "pt", icon: "🇧🇷" }
    ]
  },
  {
    id: 3,
    question: "Qual é o seu nível atual?",
    field: "level",
    options: [
      { label: "Iniciante (A1 - A2)", val: "beginner", icon: "🌱" },
      { label: "Intermediário (B1 - B2)", val: "intermediate", icon: "⚡" },
      { label: "Avançado / Fluente (C1 - C2)", val: "advanced", icon: "🔥" }
    ]
  },
  {
    id: 4,
    question: "Qual é o seu objetivo principal?",
    field: "goal",
    options: [
      { label: "Melhorar Conversação Geral", val: "conversação", icon: "🗣️" },
      { label: "Viagens e Intercâmbio", val: "viagem", icon: "✈️" },
      { label: "Trabalho e Negócios", val: "trabalho", icon: "💼" },
      { label: "Preparação para Exames", val: "exame", icon: "🎓" }
    ]
  },
  {
    id: 5,
    question: "Quais temas mais te interessam?",
    field: "interests",
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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) { nav({ to: "/login" }); }
  }, [user, loading, nav]);

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
        language: finalAnswers.target_language,
        level: finalAnswers.level as any,
        onboarding_done: true,
        onboarding_answers: finalAnswers
      }).eq("id", user.id);

      if (error) throw error;
      
      toast.success("Perfil configurado com sucesso! Vamos começar.");
      nav({ to: "/home" });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao salvar suas respostas. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: '24px', overflow: 'hidden', position: 'relative' }}>
      
      {/* Decorative Orbs */}
      <div className="orb w-[500px] h-[500px] bg-accent-green/10 top-[-10%] right-[-10%]" />
      <div className="orb w-[400px] h-[400px] bg-accent-terra/10 bottom-[-10%] left-[-10%]" />

      <main style={{ width: '100%', maxWidth: '640px', position: 'relative', zIndex: 10, padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}
        >
          <LumeIllustration className="w-32 h-32" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2D4A3E', fontWeight: 800, fontSize: '10px', uppercase: 'true', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Etapa {step + 1} de {STEPS.length}</span>
              </div>
              <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(28px, 4vw, 36px)', color: '#1C1C1A', fontWeight: 800, lineHeight: 1.2 }}>
                {STEPS[step].question}
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STEPS[step].options.map((opt) => (
                <motion.button
                  key={opt.val}
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleSelect(opt.val)}
                  disabled={isSaving}
                  style={{
                    width: '100%', py: '18px', px: '24px', padding: '18px 24px', borderRadius: '16px',
                    background: 'white', border: '1px solid #E0DDD6',
                    fontSize: '16px', fontWeight: 700, color: '#1C1C1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', textAlign: 'left',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Dots */}
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: '6px', borderRadius: '3px', transition: 'all 0.5s',
                width: i === step ? '32px' : '6px',
                background: i === step ? '#2D4A3E' : '#E0DDD6'
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}