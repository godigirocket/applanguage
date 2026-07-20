import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lesson, LessonStep } from '@/lib/lessons-data';
import { ChevronRight, Play, Check } from '@/components/lume/CustomIcons';
import { useStore } from '@/hooks/useStore';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  onExit: () => void;
}

export function LessonPlayer({ lesson, onComplete, onExit }: LessonPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    lesson.steps.map(() => false)
  );
  const { addXP, completeLesson, interfaceLanguage } = useStore();

  const isPT = interfaceLanguage === 'pt';
  const currentStep = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const progress = Math.round(((currentStepIndex + 1) / lesson.steps.length) * 100);

  const handleNext = () => {
    const newCompleted = [...completedSteps];
    newCompleted[currentStepIndex] = true;
    setCompletedSteps(newCompleted);

    if (isLastStep) {
      // Lesson complete!
      addXP(lesson.xp);
      completeLesson(lesson.id);
      setTimeout(() => onComplete(), 500);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      onExit();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--card-bg)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {lesson.title}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {isPT ? 'Lição ' : 'Lesson '} {currentStepIndex + 1}/{lesson.steps.length}
          </p>
        </div>
        <button
          onClick={onExit}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'var(--border)', height: '4px' }}>
        <div
          style={{
            height: '100%',
            background: 'var(--brand)',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep.type === 'intro' && (
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>
                  {lesson.icon || '📚'}
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  {currentStep.title}
                </h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {currentStep.text}
                </p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 800, color: 'var(--brand)' }}>+{lesson.xp} XP</span> {isPT ? 'ao completar' : 'to complete'}
                  </p>
                </div>
              </div>
            )}

            {currentStep.type === 'vocab' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {isPT ? 'Palavra-chave' : 'Key word'}
                  </p>
                  <h2 style={{ fontSize: '48px', fontWeight: 900, margin: '16px 0', color: 'var(--text-primary)' }}>
                    {(currentStep as any).word}
                  </h2>
                  <p style={{ fontSize: '18px', color: 'var(--brand)', marginBottom: '20px', fontWeight: 700 }}>
                    {(currentStep as any).translation}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {isPT ? 'Exemplo' : 'Example'}
                    </p>
                    <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                      "{(currentStep as any).example}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.type === 'quiz' && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>
                  {currentStep.question}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {((currentStep as any).options || []).map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (option === (currentStep as any).correct) {
                          handleNext();
                        } else {
                          alert(isPT ? 'Errado, tente novamente!' : 'Incorrect, try again!');
                        }
                      }}
                      style={{
                        padding: '16px 20px',
                        background: 'var(--card-bg)',
                        border: '2px solid var(--border)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor = 'var(--brand)';
                        (e.target as HTMLButtonElement).style.background = 'rgba(45,74,62,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor = 'var(--border)';
                        (e.target as HTMLButtonElement).style.background = 'var(--card-bg)';
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === 'speaking' && (
              <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎤</div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                  {isPT ? 'Prática de Fala' : 'Speaking Practice'}
                </h3>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 700 }}>
                  {(currentStep as any).targetPhrase}
                </p>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '16px 32px',
                    background: 'var(--brand)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Play size={20} style={{ marginRight: '8px', display: 'inline' }} />
                  {isPT ? 'Começar' : 'Start'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--card-bg)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={handleSkip}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'var(--border)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isLastStep ? (isPT ? 'Sair' : 'Exit') : (isPT ? 'Pular' : 'Skip')}
        </button>

        <button
          onClick={handleNext}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: 'var(--brand)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isLastStep ? (
            <>
              <Check size={18} />
              {isPT ? 'Concluído!' : 'Complete!'}
            </>
          ) : (
            <>
              {isPT ? 'Próximo' : 'Next'}
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
