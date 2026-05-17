import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/guest")({
  component: GuestPage,
});

function GuestPage() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [started, setStarted] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowSignupModal(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((600 - timeLeft) / 600) * 100;

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F4EF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '36px', marginBottom: '12px', fontWeight: 700, color: '#1C1C1A' }}>
            Experimente por 10 minutos
          </h1>
          <p style={{ color: '#6B6B63', fontSize: '17px', lineHeight: 1.6, marginBottom: '40px' }}>
            Sem criar conta. Escolha uma atividade e veja como o Lume funciona.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
            {[
              { id: 'conversation', title: 'Conversa livre', desc: 'Fale com a IA sobre qualquer tema', icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              )},
              { id: 'quiz', title: 'Quiz rápido', desc: '5 perguntas de vocabulário', icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              )},
              { id: 'lesson', title: 'Lição express', desc: 'Aprenda 5 expressões novas', icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              )},
              { id: 'pronunciation', title: 'Pronúncia', desc: 'Pratique sons difíceis', icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
              )},
            ].map(activity => (
              <button key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                style={{
                  padding: '24px 20px', borderRadius: '18px',
                  background: selectedActivity === activity.id ? 'rgba(45,74,62,0.06)' : 'white',
                  border: selectedActivity === activity.id ? '2px solid #2D4A3E' : '2px solid #E0DDD6',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: selectedActivity === activity.id ? '0 4px 20px rgba(45,74,62,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                <div style={{ color: '#2D4A3E', marginBottom: '10px' }}>{activity.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px', color: '#1C1C1A' }}>{activity.title}</div>
                <div style={{ fontSize: '13px', color: '#6B6B63' }}>{activity.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => selectedActivity && setStarted(true)}
            disabled={!selectedActivity}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: selectedActivity ? 'linear-gradient(135deg,#2D4A3E,#1B3A4B)' : '#E0DDD6',
              color: selectedActivity ? 'white' : '#A8A8A0',
              border: 'none', cursor: selectedActivity ? 'pointer' : 'not-allowed',
              fontSize: '16px', fontWeight: 700,
              boxShadow: selectedActivity ? '0 4px 20px rgba(45,74,62,0.3)' : 'none',
              transition: 'all 0.2s'
            }}>
            Começar →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF', padding: '24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Timer bar */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '14px 20px',
          marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #E0DDD6'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={timeLeft < 120 ? '#C4714A' : '#2D4A3E'} strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ height: '6px', background: '#F0EEE9', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                background: timeLeft < 120 ? 'linear-gradient(90deg,#C4714A,#D4824A)' : 'linear-gradient(90deg,#2D4A3E,#4A7A6A)',
                width: `${progress}%`, transition: 'width 1s linear'
              }}/>
            </div>
          </div>
          <div style={{
            fontFamily: 'Playfair Display', fontSize: '18px', fontWeight: 700,
            color: timeLeft < 120 ? '#C4714A' : '#1C1C1A', minWidth: '48px', textAlign: 'right'
          }}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <a href="/signup" style={{
            padding: '8px 16px', borderRadius: '99px',
            background: '#2D4A3E', color: 'white',
            textDecoration: 'none', fontSize: '12px', fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            Criar conta grátis
          </a>
        </div>

        {/* Activity content */}
        {selectedActivity === 'quiz' && <GuestQuiz />}
        {selectedActivity === 'conversation' && <GuestConversation />}
        {selectedActivity === 'lesson' && <GuestLesson />}
        {selectedActivity === 'pronunciation' && <GuestPronunciation />}

        {/* Signup modal when time runs out */}
        {showSignupModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
          }}>
            <div style={{
              background: 'white', borderRadius: '28px',
              padding: '48px 40px', textAlign: 'center',
              maxWidth: '420px', width: '100%',
              animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)'
            }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto', display: 'block' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#C9A84C" opacity="0.2"/>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '28px', marginBottom: '10px', color: '#1C1C1A' }}>
                Gostou do Lume?
              </h2>
              <p style={{ color: '#6B6B63', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
                Seu tempo de demonstração terminou. Crie uma conta grátis para continuar praticando e acompanhar seu progresso.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="/signup" style={{
                  padding: '16px', borderRadius: '14px',
                  background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                  color: 'white', textDecoration: 'none',
                  fontSize: '16px', fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(45,74,62,0.3)',
                  textAlign: 'center'
                }}>
                  Criar conta grátis →
                </a>
                <a href="/login" style={{
                  padding: '14px', borderRadius: '14px',
                  background: '#F7F4EF', color: '#1C1C1A',
                  textDecoration: 'none', fontSize: '15px', fontWeight: 600,
                  textAlign: 'center'
                }}>
                  Já tenho uma conta
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 1. Guest Quiz
const QUIZ_QUESTIONS = [
  { q: "O que significa 'circle back' no contexto profissional?", options: ["Voltar a falar sobre um assunto depois", "Mudar de sala", "Desenhar um círculo na lousa", "Cancelar o projeto"], correct: 0 },
  { q: "Qual a melhor resposta curta para 'How was your weekend?'", options: ["I went well", "Pretty good, thanks!", "Yes, had weekend.", "Not have weekend."], correct: 1 },
  { q: "Como você diz 'entrar em contato' de forma casual?", options: ["Connect eye", "Touch base", "Make letters", "Send base"], correct: 1 },
  { q: "Qual o passado de 'go'?", options: ["went", "goed", "gone", "going"], correct: 0 },
  { q: "O que expressa a frase 'hanging in there'?", options: ["Desistir de tudo", "Estar muito feliz", "Seguir em frente apesar das dificuldades", "Segurar algo pesado"], correct: 2 }
];

function GuestQuiz() {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    setSelectedOpt(idx);
    if (idx === QUIZ_QUESTIONS[qIndex].correct) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (qIndex + 1 < QUIZ_QUESTIONS.length) {
        setQIndex(q => q + 1);
        setSelectedOpt(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  if (finished) {
    return (
      <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '28px', marginBottom: '12px', color: '#1C1C1A' }}>Quiz Concluído!</h2>
        <p style={{ color: '#6B6B63', fontSize: '16px', marginBottom: '24px' }}>Você acertou {score} de 5 perguntas.</p>
        <a href="/signup" style={{ display: 'inline-block', padding: '14px 28px', background: '#2D4A3E', color: 'white', borderRadius: '99px', textDecoration: 'none', fontWeight: 700 }}>Cadastre-se para ganhar XP +{score * 10}!</a>
      </div>
    );
  }

  const current = QUIZ_QUESTIONS[qIndex];

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#6B6B63', fontSize: '13px', fontWeight: 700 }}>
        <span>Pergunta {qIndex + 1} de {QUIZ_QUESTIONS.length}</span>
        <span>Pontuação: {score}</span>
      </div>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', marginBottom: '24px', color: '#1C1C1A', lineHeight: 1.3 }}>{current.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {current.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === current.correct;
          const bg = selectedOpt !== null ? (isCorrect ? 'rgba(74,122,90,0.08)' : isSelected ? 'rgba(196,113,74,0.08)' : 'white') : 'white';
          const border = selectedOpt !== null ? (isCorrect ? '2px solid #4CAF50' : isSelected ? '2px solid #C4714A' : '1px solid #E0DDD6') : '1px solid #E0DDD6';
          return (
            <button key={idx} onClick={() => selectedOpt === null && handleAnswer(idx)} style={{
              padding: '16px 20px', borderRadius: '12px', background: bg, border: border, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, color: '#1C1C1A',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              {opt}
              {selectedOpt !== null && isCorrect && <span style={{ color: '#4CAF50' }}>✓</span>}
              {selectedOpt !== null && isSelected && !isCorrect && <span style={{ color: '#C4714A' }}>✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 2. Guest Conversation
function GuestConversation() {
  const [messages, setMessages] = useState<any[]>([
    { sender: 'ai', text: "Olá! Sou o Lume. Como foi o seu dia? Escreva abaixo em inglês ou português para praticar!" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal("");

    setTimeout(() => {
      // Custom automatic correction simulation
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `Incrível! Fico feliz que compartilhou. Um pequeno toque de vocabulário para te ajudar a soar ainda mais nativo: experimente usar frases de preenchimento como "To be honest" ou praticar verbos no passado regular! Vamos continuar praticando?` 
      }]);
    }, 1000);
  };

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '24px', background: 'white', display: 'flex', flexDirection: 'column', height: '420px' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '4px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '85%', padding: '12px 16px', borderRadius: msg.sender === 'ai' ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
            alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
            background: msg.sender === 'ai' ? '#F7F4EF' : 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
            color: msg.sender === 'ai' ? '#1C1C1A' : 'white', fontSize: '14px', lineHeight: 1.5
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Fale ou escreva no chat..." style={{ flex: 1, padding: '12px 20px', borderRadius: '99px', border: '1px solid #E0DDD6', background: '#F7F4EF', outline: 'none', fontSize: '14px' }} />
        <button onClick={handleSend} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#2D4A3E', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// 3. Guest Lesson
const EXPRESSIONS = [
  { phrase: "Touch base", meaning: "Fazer um contato rápido, alinhar com alguém.", example: "Let's touch base tomorrow morning." },
  { phrase: "Circle back", meaning: "Retornar a um assunto mais tarde.", example: "Circle back to this question after the meeting." },
  { phrase: "Hanging in there", meaning: "Aguentar firme, lidando com uma situação difícil.", example: "It's a busy week, but I'm hanging in there." },
  { phrase: "Serendipity", meaning: "A sorte de encontrar algo precioso de forma inesperada.", example: "Meeting him was pure serendipity." },
  { phrase: "Off the cuff", meaning: "Fazer ou falar de improviso, sem preparação.", example: "I gave the presentation off the cuff." }
];

function GuestLesson() {
  const [idx, setIdx] = useState(0);

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'white', textAlign: 'center' }}>
      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C4714A', background: '#C4714A15', padding: '4px 12px', borderRadius: '99px' }}>Expressão {idx + 1} de 5</span>
      <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px', margin: '20px 0 10px', color: '#1C1C1A', fontWeight: 700 }}>{EXPRESSIONS[idx].phrase}</h2>
      <p style={{ fontSize: '16px', color: '#6B6B63', marginBottom: '24px', fontWeight: 500 }}>{EXPRESSIONS[idx].meaning}</p>
      <div style={{ background: '#F7F4EF', padding: '16px 20px', borderRadius: '12px', fontStyle: 'italic', marginBottom: '32px', borderLeft: '4px solid #C4714A', color: '#1C1C1A', textAlign: 'left', fontSize: '15px' }}>
        <strong>Exemplo:</strong> "{EXPRESSIONS[idx].example}"
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button disabled={idx === 0} onClick={() => setIdx(i => i - 1)} style={{ padding: '10px 20px', borderRadius: '99px', border: '1px solid #E0DDD6', background: 'white', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>Voltar</button>
        <button onClick={() => idx + 1 < EXPRESSIONS.length ? setIdx(i => i + 1) : setIdx(0)} style={{ padding: '10px 24px', borderRadius: '99px', border: 'none', background: '#2D4A3E', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
          {idx + 1 === EXPRESSIONS.length ? "Recomeçar ↺" : "Próxima →"}
        </button>
      </div>
    </div>
  );
}

// 4. Guest Pronunciation
function GuestPronunciation() {
  const [activePhrase, setActivePhrase] = useState("World travel and adventure");
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const startListening = () => {
    setListening(true);
    setResult(null);
    setTimeout(() => {
      setListening(false);
      setResult("score_92");
    }, 2000);
  };

  return (
    <div className="glass" style={{ padding: '32px', borderRadius: '24px', background: 'white', textAlign: 'center' }}>
      <h3 style={{ color: '#6B6B63', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Treine sua Pronúncia <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></h3>
      <p style={{ fontSize: '18px', color: '#1C1C1A', fontWeight: 600, padding: '16px 24px', background: '#F7F4EF', borderRadius: '16px', display: 'inline-block', marginBottom: '28px' }}>
        "{activePhrase}"
      </p>
      
      <div style={{ marginBottom: '28px' }}>
        <button onClick={startListening} style={{
          width: '72px', height: '72px', borderRadius: '50%', background: listening ? '#C4714A' : '#2D4A3E', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto',
          boxShadow: '0 8px 24px rgba(45,74,62,0.2)', transition: 'all 0.3s'
        }} className={listening ? "mic-listening" : ""}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
          </svg>
        </button>
        <span style={{ fontSize: '13px', color: '#6B6B63', display: 'block', marginTop: '10px' }}>{listening ? "Escutando..." : "Clique para falar"}</span>
      </div>

      {result === "score_92" && (
        <div style={{ animation: 'bounceIn 0.4s ease forwards', display: 'inline-block', padding: '12px 20px', borderRadius: '12px', background: 'rgba(74,122,90,0.08)', border: '1px solid #4CAF50' }}>
          <span style={{ fontSize: '15px', color: '#2D4A3E', fontWeight: 700 }}>Excelente! Nota 92/100</span>
          <p style={{ fontSize: '12px', color: '#6B6B63', margin: '4px 0 0' }}>Sua entonação e ritmo estão ótimos!</p>
        </div>
      )}
    </div>
  );
}
