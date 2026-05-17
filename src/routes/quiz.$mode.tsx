import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useStore } from "@/hooks/useStore";
import { QUESTIONS, Question } from "@/lib/questions";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/quiz/$mode")({
  component: QuizPage,
});

function QuizPage() {
  const { mode } = Route.useParams();
  const { language, addXP } = useStore();
  const nav = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [qStreak, setQStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lives, setLives] = useState(3);
  const [missedQuestions, setMissedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    let q = QUESTIONS.filter(q => q.language === language);
    if (mode === 'quick') q = q.sort(() => 0.5 - Math.random()).slice(0, 10);
    else if (mode === 'daily') {
      const day = new Date().getDate();
      q = q.sort((a, b) => a.id.charCodeAt(day % a.id.length) - b.id.charCodeAt(day % b.id.length)).slice(0, 15);
    }
    else q = q.sort(() => 0.5 - Math.random());
    setQuestions(q);
  }, [mode, language]);

  const totalQ = mode === 'streak' ? currentIdx : Math.min(questions.length, mode === 'daily' ? 15 : 10);

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    setIsAnswered(true);

    const q = questions[currentIdx];
    const isCorrect = option === q.correct;

    if (isCorrect) {
      setScore(s => s + 1);
      setQStreak(s => s + 1);
    } else {
      setQStreak(0);
      setLives(l => Math.max(0, l - 1));
      setMissedQuestions(prev => [...prev, q]);
    }
  };

  const nextQuestion = () => {
    const limit = mode === 'daily' ? 14 : 9;
    
    if (mode === 'streak') {
      if (selected !== questions[currentIdx].correct || lives === 0) {
        setIsComplete(true);
      } else {
        setCurrentIdx(i => i + 1);
        setSelected(null);
        setIsAnswered(false);
      }
    } else {
      if (currentIdx < limit && currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
        setIsAnswered(false);
      } else {
        setIsComplete(true);
      }
    }
  };

  const exitQuiz = () => {
    nav({ to: "/play" });
  };

  if (isComplete) {
    return <QuizResults mode={mode} score={score} total={totalQ} missed={missedQuestions} addXP={addXP} onDone={() => nav({ to: "/play" })} />;
  }

  if (!questions.length) return null;

  const q = questions[currentIdx];
  if (!q) { setIsComplete(true); return null; }

  return (
    <div style={{
      minHeight:'100vh',
      background:'#F7F4EF',
      display:'flex',flexDirection:'column'
    }}>
      {/* Top bar */}
      <div style={{
        padding:'16px 24px',
        display:'flex',alignItems:'center',gap:'16px',
        background:'white',
        borderBottom:'2px solid #E0DDD6'
      }}>
        <button onClick={exitQuiz} style={{
          width:'36px',height:'36px',borderRadius:'50%',
          background:'#F0EEE9',border:'none',cursor:'pointer',
          fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'
        }}>✕</button>
        
        {/* Progress bar — thick, colorful */}
        <div style={{
          flex:1,height:'16px',background:'#E0DDD6',
          borderRadius:'99px',overflow:'hidden'
        }}>
          <div style={{
            height:'100%',
            background:'linear-gradient(90deg,#2D4A3E,#4A7A6A)',
            borderRadius:'99px',
            width: mode === 'streak' ? '100%' : `${(currentIdx / totalQ) * 100}%`,
            transition:'width 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow:'0 0 8px rgba(45,74,62,0.4)'
          }}/>
        </div>
        
        {/* Streak counter */}
        <div style={{
          display:'flex',alignItems:'center',gap:'4px',
          padding:'6px 12px',borderRadius:'99px',
          background: qStreak >= 3 ? 'rgba(255,107,53,0.1)' : '#F0EEE9',
          border: qStreak >= 3 ? '1px solid rgba(255,107,53,0.3)' : '1px solid #E0DDD6'
        }}>
          <span style={{fontSize:'16px'}}>🔥</span>
          <span style={{
            fontWeight:800,fontSize:'15px',
            color: qStreak >= 3 ? '#FF6B35' : '#6B6B63'
          }}>{qStreak}</span>
        </div>
        
        {/* Hearts (lives) */}
        <div style={{display:'flex',gap:'2px'}}>
          {[1,2,3].map(i => (
            <span key={i} style={{fontSize:'20px',filter:i>lives?'grayscale(100%)opacity(0.3)':'none'}}>❤️</span>
          ))}
        </div>
      </div>
      
      {/* Question area */}
      <div style={{flex:1,padding:'32px 24px',maxWidth:'640px',margin:'0 auto',width:'100%'}}>
        {/* Category + level badges */}
        <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
          <span style={{
            padding:'5px 12px',borderRadius:'99px',
            background:'rgba(45,74,62,0.1)',color:'#2D4A3E',
            fontSize:'12px',fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase'
          }}>{q.category}</span>
          <span style={{
            padding:'5px 12px',borderRadius:'99px',
            background: q.level==='advanced'?'rgba(196,113,74,0.1)':q.level==='intermediate'?'rgba(27,58,75,0.1)':'rgba(74,122,90,0.1)',
            color: q.level==='advanced'?'#C4714A':q.level==='intermediate'?'#1B3A4B':'#4A7A5A',
            fontSize:'12px',fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase'
          }}>{q.level}</span>
          <span style={{
            padding:'5px 12px',borderRadius:'99px',
            background:'rgba(201,168,76,0.1)',color:'#C9A84C',
            fontSize:'12px',fontWeight:700
          }}>+{q.xp} XP</span>
        </div>
        
        {/* Question text — large, beautiful */}
        <h1 style={{
          fontFamily:'Nunito, sans-serif',
          fontSize:'clamp(22px,3.5vw,32px)',
          color:'#1C1C1A',lineHeight:1.4,
          marginBottom:'36px',fontWeight:600
        }}>
          {q.question}
        </h1>
        
        {/* Answer options */}
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          {q.options.map((option, i) => {
            const state = isAnswered
              ? option === q.correct ? 'correct'
              : option === selected ? 'wrong'
              : 'neutral'
              : 'default'
            
            return (
              <button key={i} onClick={() => !isAnswered && handleAnswer(option)} style={{
                padding:'18px 24px',borderRadius:'16px',
                textAlign:'left',fontSize:'16px',cursor: isAnswered?'default':'pointer',
                fontFamily:'"DM Sans", sans-serif',fontWeight:500,
                border: state==='correct' ? '2px solid #4A7A5A'
                  : state==='wrong' ? '2px solid #C4714A'
                  : '2px solid #E0DDD6',
                background: state==='correct' ? 'rgba(74,122,90,0.1)'
                  : state==='wrong' ? 'rgba(196,113,74,0.1)'
                  : 'white',
                color: state==='correct' ? '#2D4A3E'
                  : state==='wrong' ? '#C4714A'
                  : '#1C1C1A',
                boxShadow: state==='correct' ? '0 4px 16px rgba(74,122,90,0.2)'
                  : state==='wrong' ? '0 4px 16px rgba(196,113,74,0.2)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                animation: state==='correct' ? 'correctPulse 0.4s ease'
                  : state==='wrong' ? 'wrongShake 0.4s ease'
                  : 'none',
                transition:'all 0.2s',
                display:'flex',alignItems:'center',justifyContent:'space-between'
              }}>
                <span>{option}</span>
                {state==='correct' && <span style={{fontSize:'20px'}}>✅</span>}
                {state==='wrong' && <span style={{fontSize:'20px'}}>❌</span>}
              </button>
            )
          })}
        </div>
        
        {/* Explanation card — appears after answer */}
        {isAnswered && (
          <div style={{
            marginTop:'20px',padding:'20px',borderRadius:'16px',
            background: selected===q.correct
              ? 'rgba(45,74,62,0.08)'
              : 'rgba(196,113,74,0.08)',
            border: `1px solid ${selected===q.correct?'rgba(45,74,62,0.2)':'rgba(196,113,74,0.2)'}`,
            animation:'bounceIn 0.4s ease'
          }}>
            <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
              <span style={{fontSize:'20px',flexShrink:0}}>
                {selected===q.correct ? '🎉' : '💡'}
              </span>
              <div>
                <div style={{
                  fontWeight:700,marginBottom:'4px',
                  color: selected===q.correct?'#2D4A3E':'#C4714A'
                }}>
                  {selected===q.correct ? 'Correct!' : 'Not quite — here\'s why:'}
                </div>
                <div style={{fontSize:'14px',color:'#1C1C1A',lineHeight:1.6}}>
                  {q.explanation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom continue button */}
      {isAnswered && (
        <div style={{
          padding:'20px 24px',
          background:'white',
          borderTop:'1px solid #E0DDD6'
        }}>
          <button onClick={nextQuestion} style={{
            width:'100%',padding:'16px',borderRadius:'16px',
            background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
            color:'white',border:'none',cursor:'pointer',
            fontSize:'16px',fontWeight:700,letterSpacing:'0.02em',
            boxShadow:'0 4px 16px rgba(45,74,62,0.35)',
            transition:'transform 0.15s, box-shadow 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
          >
            {mode === 'streak' && selected !== q.correct ? '🏆 See Results' : currentIdx >= totalQ - 1 && mode !== 'streak' ? '🏆 See Results' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
}

function QuizResults({ mode, score, total, missed, addXP, onDone }: { mode: string; score: number; total: number; missed: Question[]; addXP: (n: number) => void; onDone: () => void }) {
  const earnedXP = mode === 'streak' ? score * 10 : Math.round((score / Math.max(total, 1)) * (mode === 'daily' ? 200 : 100));
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const nav = useNavigate();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (score > 0) {
      addXP(earnedXP);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, []);

  const confettiParticles = Array.from({length: 40}).map(() => ({
    x: Math.random() * 100,
    color: ['#FF6B35', '#C9A84C', '#2D4A3E', '#1B3A4B'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    rotation: Math.random() * 360
  }));

  return (
    <div style={{
      minHeight:'100vh',
      background: accuracy >= 80
        ? 'linear-gradient(135deg,#F0EBE3,#E8F0E8)'
        : 'linear-gradient(135deg,#F7F4EF,#F0EBE3)',
      display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',
      padding:'32px 24px',
      position:'relative',overflow:'hidden'
    }}>
      {/* Confetti particles — CSS only */}
      {confettiParticles.map((p,i) => (
        <div key={i} style={{
          position:'fixed',
          left:`${p.x}%`,top:'-20px',
          width:'8px',height:'12px',
          background:p.color,
          borderRadius:'2px',
          animation:`confettiFall ${p.duration}s ease ${p.delay}s forwards`,
          transform:`rotate(${p.rotation}deg)`
        }}/>
      ))}
      
      {/* Trophy */}
      <div style={{
        fontSize:'80px',marginBottom:'16px',
        animation:'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🥇' : accuracy >= 50 ? '🥈' : '🥉'}
      </div>
      
      <h1 style={{
        fontFamily:'Nunito, sans-serif',fontSize:'36px',
        marginBottom:'8px',textAlign:'center',
        animation:'bounceIn 0.6s ease 0.1s both'
      }}>
        {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great job!' : accuracy >= 50 ? 'Good effort!' : 'Keep practicing!'}
      </h1>
      
      <p style={{
        color:'#6B6B63',fontSize:'16px',marginBottom:'40px',
        fontStyle:'italic',textAlign:'center',
        animation:'bounceIn 0.6s ease 0.2s both'
      }}>
        {accuracy >= 70 ? "You're making real progress." : "Every attempt makes you better."}
      </p>
      
      {/* Stats card */}
      <div style={{
        background:'white',borderRadius:'24px',
        padding:'32px',width:'100%',maxWidth:'400px',
        boxShadow:'0 8px 40px rgba(0,0,0,0.12)',
        marginBottom:'24px',
        animation:'bounceIn 0.6s ease 0.3s both'
      }}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1px 1fr',gap:'0',marginBottom:'24px'}}>
          <div style={{textAlign:'center',padding:'0 20px'}}>
            <div style={{fontSize:'11px',color:'#6B6B63',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Accuracy</div>
            <div style={{
              fontFamily:'Nunito, sans-serif',fontSize:'40px',fontWeight:700,
              color: accuracy>=80?'#2D4A3E':accuracy>=60?'#C9A84C':'#C4714A'
            }}>{accuracy}%</div>
          </div>
          <div style={{background:'#E0DDD6'}}/>
          <div style={{textAlign:'center',padding:'0 20px'}}>
            <div style={{fontSize:'11px',color:'#6B6B63',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>XP Gained</div>
            <div style={{fontFamily:'Nunito, sans-serif',fontSize:'40px',fontWeight:700,color:'#C9A84C'}}>+{earnedXP}</div>
          </div>
        </div>
        
        <div style={{height:'1px',background:'#E0DDD6',marginBottom:'20px'}}/>
        
        {/* Accuracy bar */}
        <div style={{marginBottom:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
            <span style={{fontSize:'13px',fontWeight:600}}>Score</span>
            <span style={{fontSize:'13px',color:'#6B6B63'}}>{score}/{total} correct</span>
          </div>
          <div style={{height:'10px',background:'#E0DDD6',borderRadius:'99px',overflow:'hidden'}}>
            <div style={{
              height:'100%',borderRadius:'99px',
              background: accuracy>=80?'linear-gradient(90deg,#2D4A3E,#4A7A6A)':accuracy>=60?'linear-gradient(90deg,#C9A84C,#D4A84C)':'linear-gradient(90deg,#C4714A,#D4824A)',
              width:`${accuracy}%`,
              transition:'width 1s ease',
              boxShadow:'0 0 8px rgba(45,74,62,0.3)'
            }}/>
          </div>
        </div>
        
        {/* Missed questions */}
        {missed.length > 0 && (
          <div style={{
            padding:'14px',borderRadius:'12px',
            background:'rgba(196,113,74,0.06)',
            border:'1px solid rgba(196,113,74,0.15)'
          }}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#C4714A',marginBottom:'8px'}}>
              📝 Review ({missed.length} missed)
            </div>
            {missed.slice(0,2).map((q,i) => (
              <div key={i} style={{fontSize:'12px',color:'#6B6B63',marginBottom:'4px',paddingLeft:'8px',borderLeft:'2px solid #C4714A'}}>
                {q.question.slice(0,60)}...
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px',width:'100%',maxWidth:'400px',animation:'bounceIn 0.6s ease 0.4s both'}}>
        <button onClick={() => window.location.reload()} style={{
          padding:'16px',borderRadius:'16px',
          background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
          color:'white',border:'none',cursor:'pointer',
          fontSize:'16px',fontWeight:700,
          boxShadow:'0 4px 20px rgba(45,74,62,0.35)'
        }}>
          🔄 Play Again
        </button>
        <button onClick={() => nav({to:'/play'})} style={{
          padding:'16px',borderRadius:'16px',
          background:'white',
          color:'#1C1C1A',border:'2px solid #E0DDD6',cursor:'pointer',
          fontSize:'16px',fontWeight:700
        }}>
          ← Back to Games
        </button>
      </div>

      {showLevelUp && (
        <div style={{
          position:'fixed',inset:0,zIndex:9999,
          background:'rgba(28,28,26,0.85)',
          backdropFilter:'blur(12px)',
          display:'flex',alignItems:'center',justifyContent:'center',
          padding:'24px'
        }}>
          {/* Confetti */}
          {confettiParticles.map((p,i) => (
            <div key={i} style={{
              position:'fixed',left:`${p.x}%`,top:'-20px',
              width:'10px',height:'14px',background:p.color,
              borderRadius:'3px',
              animation:`confettiFall ${p.duration}s ease ${p.delay}s forwards`
            }}/>
          ))}
          
          <div style={{
            background:'white',borderRadius:'28px',
            padding:'48px 40px',textAlign:'center',
            maxWidth:'380px',width:'100%',
            animation:'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)'
          }}>
            <div style={{fontSize:'72px',marginBottom:'16px',lineHeight:1}}>🏆</div>
            <div style={{
              fontSize:'12px',fontWeight:800,letterSpacing:'0.12em',
              textTransform:'uppercase',color:'#C9A84C',marginBottom:'8px'
            }}>Level Up!</div>
            <h2 style={{
              fontFamily:'Nunito, sans-serif',fontSize:'32px',
              marginBottom:'12px',color:'#1C1C1A'
            }}>
              Welcome, Native Soul!
            </h2>
            <p style={{color:'#6B6B63',fontSize:'16px',lineHeight:1.6,marginBottom:'32px'}}>
              You've been practicing consistently. Keep going — fluency is closer than you think. 🌟
            </p>
            
            {/* New level badge */}
            <div style={{
              display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'12px 24px',borderRadius:'99px',
              background:'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
              color:'white',fontSize:'15px',fontWeight:700,
              boxShadow:'0 4px 20px rgba(45,74,62,0.35)',
              marginBottom:'24px'
            }}>
              🏆 Native Soul
            </div>
            
            <button onClick={() => setShowLevelUp(false)} style={{
              width:'100%',padding:'16px',borderRadius:'16px',
              background:'#F0EEE9',color:'#1C1C1A',
              border:'none',cursor:'pointer',fontSize:'16px',fontWeight:700
            }}>
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
