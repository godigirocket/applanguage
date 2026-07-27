import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeQuery, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/hooks/useStore";
import { useUserStore, UserLevel } from "@/store/userStore";
import { toast } from "sonner";
import { LumeIllustration } from "@/components/lume/LumeIllustration";
import {
  Flame,
  Briefcase,
  MessageCircle,
  Sprout,
  Star,
  Map,
  BookOpen,
  Music,
  Sparkles,
  Heart,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Lume — Onboarding" }] }),
  component: OnboardingPage,
});

const BASE_STEPS = [
  {
    id: 1,
    question: "Qual idioma você quer aprender?",
    field: "target_language",
    type: "options",
    options: [
      { label: "English", val: "en", icon: <MessageCircle size={20} /> },
      { label: "Español", val: "es", icon: <MessageCircle size={20} /> },
      { label: "Português", val: "pt", icon: <MessageCircle size={20} /> },
    ],
  },
  {
    id: 2,
    question: "Qual é o seu nível?",
    field: "level",
    type: "options",
    options: [
      { label: "Iniciante", val: "beginner", icon: <Sprout size={20} /> },
      { label: "Intermediário", val: "intermediate", icon: <Star size={20} /> },
      { label: "Avançado", val: "advanced", icon: <Flame size={20} /> },
    ],
  },
  {
    id: 3,
    question: "Para quem é essa conta?",
    field: "account_type",
    type: "options",
    options: [
      { label: "Para mim", val: "adult", icon: <Star size={20} /> },
      { label: "Para uma criança (4-10 anos)", val: "kid", icon: <Heart size={20} /> },
    ],
  },
];

const KID_AGE_STEP = {
  id: 4,
  question: "Qual a idade da criança?",
  field: "kid_age",
  type: "options",
  options: [
    { label: "4-6 anos", val: "5", icon: <Sprout size={20} /> },
    { label: "7-8 anos", val: "7", icon: <Star size={20} /> },
    { label: "9-10 anos", val: "9", icon: <Flame size={20} /> },
  ],
};

function getSteps(answers: Record<string, string>) {
  return answers.account_type === "kid" ? [...BASE_STEPS, KID_AGE_STEP] : BASE_STEPS;
}

function OnboardingPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, setTargetLanguage, setLearningLevel, setKidAccount } = useStore();
  const { setUserLevel } = useUserStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const isPT = interfaceLanguage === "pt";
  const steps = getSteps(answers);

  useEffect(() => {
    if (!loading && !user) {
      nav({ to: "/login" });
    }
  }, [user, loading, nav]);

  const handleSelect = async (val: string) => {
    const currentField = steps[step].field;
    const newAnswers = { ...answers, [currentField]: val };
    setAnswers(newAnswers);

    // Recompute against the *new* answers — selecting "kid" for account_type
    // inserts an extra age step that doesn't exist in the step list yet.
    const nextSteps = getSteps(newAnswers);
    if (step < nextSteps.length - 1) {
      setStep(step + 1);
    } else {
      await finish(newAnswers);
    }
  };

  const finish = async (finalAnswers: Record<string, string>) => {
    if (!user) return;
    setIsSaving(true);

    // The onboarding question is "which language do you want to learn" —
    // that's the *target* language, not the interface language. It used to be
    // saved into the `language` column (which LanguageSwitcher.tsx treats as
    // the interface language everywhere else) and was never applied to the
    // local store, so the app kept using whatever targetLanguage it already
    // had (default "en") regardless of what was picked here.
    const chosenTargetLanguage =
      (finalAnswers.target_language as "pt" | "en" | "es" | undefined) || "en";

    // Apply locally first — this is what actually drives which lessons/quizzes/
    // content the app shows, and it must not depend on the Supabase write
    // succeeding (the same way LanguageSwitcher.tsx and settings.tsx already
    // update local state before attempting to persist it remotely).
    setTargetLanguage(chosenTargetLanguage);

    // The "level" step is a 3-tier self-assessment (Iniciante/Intermediário/
    // Avançado) — map it to a CEFR anchor and apply it to both level stores
    // right away, so the curriculum starts at an appropriate point and the
    // separate A1-C2 level modal (shown when no level is set yet) doesn't
    // immediately ask the same question again.
    const chosenLevel = (finalAnswers.level as string) || "beginner";
    const cefrAnchor: UserLevel =
      chosenLevel === "advanced" ? "C1" : chosenLevel === "intermediate" ? "B1" : "A1";
    setLearningLevel(cefrAnchor);
    setUserLevel(cefrAnchor);
    localStorage.setItem("lume_user_level", cefrAnchor);
    localStorage.setItem("lume_level", cefrAnchor);

    // Kid Mode: gates Community access and simplifies the lesson catalog
    // (see community.tsx / lessons.tsx) — applied locally first, same as
    // every other onboarding choice, so it works even if the profile write
    // below fails.
    const isKid = finalAnswers.account_type === "kid";
    const kidAge = isKid ? parseInt(finalAnswers.kid_age || "5", 10) : null;
    setKidAccount(isKid, kidAge);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: finalAnswers.full_name || "Estudante",
          target_language: chosenTargetLanguage,
          level: chosenLevel,
          onboarding_done: true,
          onboarding_answers: finalAnswers,
          is_kid_account: isKid,
          kid_age: kidAge,
        } as any)
        .eq("id", user.id);

      if (error) {
        // Don't block onboarding on a remote persistence failure — the local
        // choice above already took effect, so the session still works.
        console.warn("[Onboarding] Could not save profile to Supabase:", error.message);
      }

      toast.success(
        isPT
          ? "Perfil configurado com sucesso! Vamos começar."
          : "Profile tailored successfully! Let's start.",
      );
      nav({ to: "/home" });
    } catch (e) {
      console.error(e);
      toast.error(
        isPT
          ? "Erro ao salvar suas respostas. Tente novamente."
          : "Error saving answers. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const currentStepData = steps[step];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <main style={{ width: "100%", maxWidth: "440px" }}>
        {/* Onboarding Card */}
        <div
          style={{
            background: "var(--card-bg)",
            padding: "32px 28px",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          {/* Header navigation (Back button + progress bar) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: "8px",
                }}
                className="hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>{isPT ? "Voltar" : "Back"}</span>
              </button>
            ) : (
              <div style={{ width: "60px" }} />
            )}

            <div className="flex-1 flex justify-center">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "var(--accent-green)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {isPT
                  ? `Passo ${step + 1} de ${steps.length}`
                  : `Step ${step + 1} of ${steps.length}`}
              </span>
            </div>

            <div style={{ width: "60px" }} />
          </div>

          {/* Real progress bar */}
          <div
            style={{
              height: "6px",
              background: "var(--surface)",
              borderRadius: "99px",
              overflow: "hidden",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, var(--accent-green), #40A878)",
                width: `${((step + 1) / steps.length) * 100}%`,
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
              <h2
                style={{ color: "var(--text-primary)" }}
                className="font-display text-2xl md:text-3xl font-extrabold leading-tight mb-6"
              >
                {currentStepData.question}
              </h2>

              <div className="flex flex-col gap-2.5">
                  {currentStepData.options?.map((opt) => (
                    <motion.button
                      key={opt.val}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelect(opt.val)}
                      disabled={isSaving}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        borderRadius: "16px",
                        background: "var(--surface-raised)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      }}
                      className="hover:border-accent-green active:brightness-95 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--brand)" }}>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{ color: "var(--accent-green)" }}
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "var(--text-soft)",
            marginTop: "20px",
            fontWeight: 600,
          }}
        >
          LangLume — Aprenda praticando
        </p>
      </main>
    </div>
  );
}
