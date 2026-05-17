import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { useStore } from "@/hooks/useStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lume — Aprenda através de conversa, cultura e confiança" },
      { name: "description", content: "Prática de conversação com IA projetada como um complemento calmo e paciente para suas aulas particulares." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { language } = useStore();
  const { user } = useAuth();
  const nav = useNavigate();

  // Disable auto-redirect so users can view the landing page even if logged in
  // useEffect(() => {
  //   if (user) {
  //     nav({ to: '/home', replace: true });
  //   }
  // }, [user, nav]);

  const content = {
    en: {
      footer1: "Lume",
      footer2: "A complement to your private lessons."
    },
    pt: {
      footer1: "Lume",
      footer2: "Um complemento para suas aulas particulares."
    }
  };

  const t = content[language as 'en' | 'pt'] || content.pt;

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 20% 20%, rgba(45,74,62,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(196,113,74,0.05) 0%, transparent 60%), #F7F4EF', overflow: 'hidden' }}>
      <AppHeader />
      <main style={{ animation: 'pageEnter 0.6s ease forwards' }}>
        
        {/* Editorial Hero Layout (2 Columns) */}
        <section style={{
          maxWidth: '1120px', margin: '0 auto',
          padding: '100px 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 460px',
          gap: '80px', alignItems: 'center'
        }}>
          {/* LEFT — text */}
          <div>
            <div style={{
              display: 'inline-block', padding: '5px 14px',
              borderRadius: '99px', background: 'rgba(45,74,62,0.08)',
              fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'var(--accent-green)', marginBottom: '24px'
            }}>
              Um parceiro de conversação
            </div>

            <h1 style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 'clamp(42px, 5.5vw, 72px)',
              fontWeight: 800, lineHeight: 1.08,
              color: 'var(--text-primary)', letterSpacing: '-0.025em',
              marginBottom: '0'
            }}>
              Aprenda com{' '}
              <span style={{ color: 'var(--accent-terra)', fontStyle: 'italic', position: 'relative' }}>
                conversas
                <svg viewBox="0 0 300 14" style={{
                  position: 'absolute', bottom: '-8px', left: 0,
                  width: '100%', height: '14px', overflow: 'visible'
                }} fill="none">
                  <path d="M4 10 C80 2, 180 14, 296 6"
                    stroke="var(--accent-terra)" strokeWidth="3"
                    strokeLinecap="round" opacity="0.5"/>
                </svg>
              </span>
              {','}
              <br/>cultura e confiança.
            </h1>

            <p style={{
              fontSize: '18px', color: 'var(--text-secondary)',
              lineHeight: 1.7, margin: '32px 0 40px',
              maxWidth: '520px'
            }}>
              Lume é uma sala de prática guiada por IA — projetada para ser um complemento calmo e paciente para suas aulas particulares.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link to="/signup" style={{
                padding: '16px 36px', borderRadius: '99px',
                background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                color: 'white', textDecoration: 'none',
                fontSize: '16px', fontWeight: 700,
                boxShadow: '0 6px 24px rgba(45,74,62,0.3)',
                transition: 'all 0.25s'
              }}>
                Começar a praticar →
              </Link>
              <Link to="/guest" style={{
                padding: '16px 32px', borderRadius: '99px',
                background: 'var(--surface-raised)', color: 'var(--text-primary)',
                textDecoration: 'none', fontSize: '16px', fontWeight: 600,
                border: '2px solid #E0DDD6',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                Experimentar grátis
              </Link>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              ★★★★★ "Finalmente um jeito de praticar sem travar."
            </p>
          </div>

          {/* RIGHT — live conversation preview card */}
          <div style={{ position: 'relative' }}>
            {/* Main card */}
            <div className="glass" style={{
              background: 'var(--surface-raised)', borderRadius: '24px',
              padding: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
              border: '1px solid rgba(224,221,214,0.5)', position: 'relative', zIndex: 2
            }}>
              {/* AI header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F0EEE9' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>Lume</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 6px #4CAF5060' }}/>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Online agora</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                  background: 'var(--bg)', fontSize: '14px', lineHeight: 1.6,
                  color: 'var(--text-primary)', maxWidth: '88%'
                }}>
                  What did you do last weekend? Tell me — no pressure 😊
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 4px 16px',
                  background: 'linear-gradient(135deg,#2D4A3E,#1B3A4B)',
                  fontSize: '14px', lineHeight: 1.6, color: 'white',
                  maxWidth: '88%', alignSelf: 'flex-end'
                }}>
                  I go to... a concert? My friend, she invite me last Saturday.
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                  background: 'var(--bg)', fontSize: '14px', lineHeight: 1.6,
                  color: 'var(--text-primary)', maxWidth: '88%'
                }}>
                  Love it! 🎵 Small tip: "she <em>invited</em> me" — past tense. But your meaning was totally clear. What kind of music?
                </div>
              </div>

              {/* Input */}
              <div style={{
                padding: '10px 14px', background: 'var(--bg)',
                borderRadius: '99px', display: 'flex',
                alignItems: 'center', gap: '10px',
                border: '1px solid #E0DDD6'
              }}>
                <span style={{ fontSize: '13px', color: '#A8A8A0', flex: 1 }}>Fale ou escreva...</span>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'var(--accent-terra)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating XP badge */}
            <div style={{
              position: 'absolute', top: '-14px', right: '-14px', zIndex: 3,
              background: 'var(--surface-raised)', borderRadius: '14px',
              padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #E0DDD6',
              display: 'flex', alignItems: 'center', gap: '8px',
              transform: 'rotate(2deg)'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#C9A84C,#E0B84C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-green)' }}>+15 XP</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Boa sessão!</div>
              </div>
            </div>

            {/* Floating streak */}
            <div style={{
              position: 'absolute', bottom: '70px', left: '-18px', zIndex: 3,
              background: 'linear-gradient(135deg,#FF6B35,#FF8C42)',
              borderRadius: '14px', padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
              display: 'flex', alignItems: 'center', gap: '8px',
              transform: 'rotate(-1.5deg)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.17 6.08-1.64 1.64-1.37 2.3-3.5 1.9-5.58l-.08-.32c-.14-.4-.34-.8-.2-1.18z"/>
              </svg>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'white' }}>5 dias seguidos!</div>
            </div>

            {/* Word card */}
            <div style={{
              background: 'linear-gradient(135deg,#1B3A4B,#2D4A3E)',
              borderRadius: '18px', padding: '18px 20px', color: 'white',
              marginTop: '16px', position: 'relative', zIndex: 2,
              boxShadow: '0 8px 32px rgba(27,58,75,0.2)'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', opacity: 0.6, marginBottom: '4px', textTransform: 'uppercase' }}>
                Palavra do dia
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Serendipity</div>
              <div style={{ fontSize: '13px', opacity: 0.7 }}>Encontrar algo bom sem procurar</div>
            </div>
          </div>
        </section>

        {/* Features list */}
        <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 120px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="lume-card" style={{ background: 'var(--surface-raised)', borderRadius: '24px', padding: '40px 32px', border: '1px solid #E0DDD650', borderTop: '4px solid #2D4A3E' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#2D4A3E15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', color: 'var(--accent-green)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                IA Conversacional
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Fale livremente com um companheiro paciente que se adapta ao seu nível e humor sem julgar.
              </p>
            </div>

            <div className="lume-card" style={{ background: 'var(--surface-raised)', borderRadius: '24px', padding: '40px 32px', border: '1px solid #E0DDD650', borderTop: '4px solid #C4714A' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#C4714A15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', color: 'var(--accent-terra)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Sessões Culturais
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Pratique com contexto cultural real e conversas autênticas do dia a dia, e não decorebas.
              </p>
            </div>

            <div className="lume-card" style={{ background: 'var(--surface-raised)', borderRadius: '24px', padding: '40px 32px', border: '1px solid #E0DDD650', borderTop: '4px solid #C9A84C' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#C9A84C15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', color: '#C9A84C' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Progresso Emocional
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Acompanhe sua confiança, ritmo e fluência — as métricas que realmente trazem segurança ao falar.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #E0DDD6', background: 'rgba(255,255,255,0.5)' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontWeight: 700, color: 'var(--accent-green)' }}>
              {t.footer1}
            </span>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <Link to="/guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Como usar</Link>
              <Link to="/lessons" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Lições</Link>
              <Link to="/guest" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>Experimentar</Link>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {t.footer2}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
