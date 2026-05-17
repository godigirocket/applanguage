import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { AppHeader } from "@/components/lume/AppHeader";
import { getLessonCatalogue, Lesson } from "@/data/lessonEngine";
import { useStore } from "@/hooks/useStore";

export const Route = createFileRoute("/lessons")({
  component: LessonsPage,
});

function LessonsPage() {
  const { targetLanguage } = useStore();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  
  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  const { addXP, addLumes } = useStore();
  const recognitionRef = useRef<any>(null);

  const lessons = useMemo(() => getLessonCatalogue(targetLanguage, 50), [targetLanguage]);

  const handlePlayAudio = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta síntese de voz.");
    }
  };

  const toggleRecording = (targetPhrase: string, lang: string) => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setSpokenText("");
      setSpeechScore(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      
      // Simple similarity check (mock score)
      const targetClean = targetPhrase.toLowerCase().replace(/[^\w\s]|_/g, "");
      const spokenClean = transcript.toLowerCase().replace(/[^\w\s]|_/g, "");
      
      if (targetClean === spokenClean) {
        setSpeechScore(100);
      } else if (targetClean.includes(spokenClean) || spokenClean.includes(targetClean)) {
        setSpeechScore(80);
      } else {
        // Very basic length/match score
        const targetWords = targetClean.split(" ");
        const spokenWords = spokenClean.split(" ");
        let matches = 0;
        spokenWords.forEach((w: string) => { if(targetWords.includes(w)) matches++; });
        const score = Math.max(10, Math.min(100, Math.round((matches / targetWords.length) * 100)));
        setSpeechScore(score);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert("Erro ao gravar. Tente novamente.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (activeLesson) {
    const lesson = lessons.find(l => l.id === activeLesson)!;
    const currentStep = lesson.steps[step];
    const isLast = step === lesson.steps.length - 1;

    let canContinue = true;
    if (currentStep.type === 'quiz' || currentStep.type === 'listening') {
      canContinue = answered;
    } else if (currentStep.type === 'speaking') {
      canContinue = speechScore !== null;
    }

    return (
      <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
        <AppHeader />
        
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 120px' }}>
          {/* Progress header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <button onClick={() => { setActiveLesson(null); setStep(0); setAnswered(false); setSelectedAnswer(null); setSpeechScore(null); }} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#F0EEE9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1C1C1A'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ height: '8px', background: '#E0DDD6', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '99px',
                  background: `linear-gradient(90deg, ${lesson.color}, ${lesson.color}99)`,
                  width: `${((step + 1) / lesson.steps.length) * 100}%`,
                  transition: 'width 0.4s ease'
                }}/>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="glass" style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.02)', animation: 'pageEnter 0.3s ease both' }}>
            
            {currentStep.type === 'intro' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '28px', marginBottom: '16px', color: '#1C1C1A', fontWeight: 800 }}>{currentStep.title}</h2>
                <p style={{ fontSize: '17px', color: '#6B6B63', lineHeight: 1.7 }}>{currentStep.content}</p>
              </div>
            )}

            {currentStep.type === 'vocabulary' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '20px', color: '#1C1C1A', fontWeight: 800 }}>Vocabulário</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentStep.words?.map((w, i) => (
                    <div key={i} style={{ padding: '18px 20px', borderRadius: '16px', border: '1px solid #E0DDD6' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: lesson.color, marginBottom: '4px' }}>{w.word}</div>
                      <div style={{ fontSize: '14px', color: '#6B6B63', marginBottom: '8px' }}>{w.meaning}</div>
                      <div style={{ fontSize: '13px', fontStyle: 'italic', padding: '8px 12px', background: '#F7F4EF', borderRadius: '8px', borderLeft: `3px solid ${lesson.color}` }}>{w.example}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(currentStep.type === 'quiz' || currentStep.type === 'listening') && (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '99px', background: `${lesson.color}12`, color: lesson.color, fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentStep.type === 'listening' ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z"/></svg> Compreensão Auditiva</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Quiz</>}
                  </span>
                </div>
                
                {currentStep.type === 'listening' && currentStep.audioText && (
                  <button onClick={() => handlePlayAudio(currentStep.audioText!, lesson.language)} style={{
                    marginBottom: '24px', padding: '16px 24px', borderRadius: '16px', border: 'none',
                    background: lesson.color, color: 'white', fontWeight: 700, fontSize: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: `0 4px 16px ${lesson.color}40`
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Ouvir Áudio
                  </button>
                )}

                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '24px', color: '#1C1C1A', fontWeight: 750 }}>
                  {currentStep.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentStep.options?.map((opt, i) => {
                    const isCorrect = i === currentStep.correct;
                    const isSelected = selectedAnswer === i;
                    const state = answered ? (isCorrect ? 'correct' : isSelected ? 'wrong' : 'neutral') : 'default';
                    return (
                      <button key={i}
                        onClick={() => { if (!answered) { setSelectedAnswer(i); setAnswered(true); } }}
                        style={{
                          padding: '16px 20px', borderRadius: '14px', textAlign: 'left', cursor: answered ? 'default' : 'pointer', fontSize: '15px', fontWeight: 600,
                          border: state === 'correct' ? '2px solid #4A7A5A' : state === 'wrong' ? '2px solid #C4714A' : '1px solid #E0DDD6',
                          background: state === 'correct' ? 'rgba(74,122,90,0.08)' : state === 'wrong' ? 'rgba(196,113,74,0.08)' : 'white',
                          color: state === 'correct' ? '#2D4A3E' : state === 'wrong' ? '#C4714A' : '#1C1C1A',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s',
                        }}>
                        {opt}
                        {state === 'correct' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A7A5A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {state === 'wrong' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4714A" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep.type === 'speaking' && currentStep.targetPhrase && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', background: `${lesson.color}12`, color: lesson.color, fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> Treino de Pronúncia
                </div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '28px', marginBottom: '16px', color: '#1C1C1A', fontWeight: 800 }}>
                  Leia em voz alta:
                </h2>
                <div style={{ fontSize: '22px', color: lesson.color, fontWeight: 700, padding: '24px', background: '#F7F4EF', borderRadius: '16px', marginBottom: '32px' }}>
                  "{currentStep.targetPhrase}"
                </div>
                
                <button 
                  onClick={() => toggleRecording(currentStep.targetPhrase!, lesson.language)}
                  style={{
                    width: '80px', height: '80px', borderRadius: '50%', border: 'none',
                    background: isRecording ? '#C4714A' : lesson.color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                    cursor: 'pointer', boxShadow: `0 8px 24px ${isRecording ? '#C4714A60' : lesson.color + '60'}`,
                    transition: 'all 0.3s', transform: isRecording ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </button>
                <p style={{ marginTop: '16px', fontSize: '14px', color: '#6B6B63', fontWeight: 600 }}>
                  {isRecording ? 'Ouvindo...' : 'Clique no microfone para falar'}
                </p>

                {spokenText && (
                  <div style={{ marginTop: '32px', padding: '16px', borderRadius: '16px', border: '1px solid #E0DDD6', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B6B63', textTransform: 'uppercase', marginBottom: '8px' }}>O que ouvimos:</div>
                    <div style={{ fontSize: '16px', color: '#1C1C1A', fontStyle: 'italic', marginBottom: '16px' }}>"{spokenText}"</div>
                    
                    {speechScore !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: speechScore > 70 ? 'rgba(74,122,90,0.1)' : 'rgba(196,113,74,0.1)', borderRadius: '12px' }}>
                        <span style={{ fontWeight: 700, color: speechScore > 70 ? '#4A7A5A' : '#C4714A' }}>Pontuação</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: speechScore > 70 ? '#4A7A5A' : '#C4714A' }}>{speechScore}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentStep.type === 'practice' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', color: '#1C1C1A' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '24px', marginBottom: '8px', color: '#1C1C1A', fontWeight: 800 }}>Hora de praticar</h2>
                <p style={{ color: '#6B6B63', marginBottom: '24px', fontSize: '15px' }}>Continue no chat com a IA usando o que você aprendeu.</p>
                <Link to={`/conversation/free-talk?prompt=${encodeURIComponent(currentStep.prompt || '')}`} style={{ display: 'block', padding: '20px', borderRadius: '16px', background: `linear-gradient(135deg, ${lesson.color}, ${lesson.color}CC)`, color: 'white', textDecoration: 'none', fontWeight: 700 }}>
                  Abrir conversa com a IA →
                </Link>
              </div>
            )}
          </div>

          {/* Continue button */}
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => {
                if (isLast) {
                  setCompleted(prev => [...prev, lesson.id]);
                  setActiveLesson(null);
                  setStep(0);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSpeechScore(null);
                  addXP(lesson.xp);
                  addLumes(10);
                  alert(`Parabéns! Você concluiu a lição e ganhou ${lesson.xp} XP e 10 Lumes!`);
                } else {
                  setStep(s => s + 1);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSpeechScore(null);
                  setSpokenText("");
                }
              }}
              disabled={!canContinue}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px',
                background: !canContinue ? '#E0DDD6' : `linear-gradient(135deg, ${lesson.color}, ${lesson.color}CC)`,
                color: !canContinue ? '#A8A8A0' : 'white',
                border: 'none', cursor: !canContinue ? 'not-allowed' : 'pointer',
                fontSize: '16px', fontWeight: 700,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {isLast ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> Concluir lição</> : 'Continuar →'}
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <AppHeader />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px 120px', animation: 'pageEnter 0.6s ease-out both' }}>
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 'clamp(28px,4vw,40px)', marginBottom: '6px', fontWeight: 800, color: '#1C1C1A' }}>
            Catálogo de Lições ({targetLanguage.toUpperCase()})
          </h1>
          <p style={{ color: '#6B6B63', fontSize: '16px' }}>
            Milhares de lições geradas dinamicamente para o seu nível.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
          {lessons.map(lesson => (
            <button key={lesson.id}
              onClick={() => { setActiveLesson(lesson.id); setStep(0); }}
              style={{ padding: '0', borderRadius: '20px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div className="lume-card" style={{
                background: 'white', borderRadius: '20px', borderTop: `3px solid ${lesson.color}`,
                padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${lesson.color}20`,
                height: '100%', position: 'relative', overflow: 'hidden'
              }}>
                {completed.includes(lesson.id) && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', background: '#2D4A3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', background: `${lesson.color}12`, color: lesson.color, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>{lesson.category}</span>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', background: '#F0EEE9', color: '#6B6B63', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {lesson.duration}</span>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', background: 'rgba(201,168,76,0.1)', color: '#B8962A', fontSize: '11px', fontWeight: 800 }}>+{lesson.xp} XP</span>
                </div>
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '19px', fontWeight: 700, marginBottom: '8px', color: '#1C1C1A' }}>{lesson.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B6B63', lineHeight: 1.55, marginBottom: '16px' }}>{lesson.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
