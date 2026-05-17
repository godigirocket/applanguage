import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion } from "framer-motion";
import { ChevronRight, Brain, Zap, Target, Flame, Trophy, Star, Sparkles } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useState } from "react";
import { DynamicIcon } from "@/components/lume/DynamicIcon";

export const Route = createFileRoute("/play")({
  component: PlayPage,
});

const GAME_MODES = [
  {
    slug: 'quick',
    icon: 'Brain',
    title: 'Quick Quiz',
    desc: '10 questions. Any topic.',
    xp: 'Up to 100 XP',
    color: '#2D4A3E',
    tag: null,
  },
  {
    slug: 'speed',
    icon: 'Zap',
    title: 'Speed Round',
    desc: 'Answer fast. Points decay with time.',
    xp: 'Up to 150 XP',
    color: '#C9A84C',
    tag: null,
  },
  {
    slug: 'daily',
    icon: 'Target',
    title: 'Daily Challenge',
    desc: 'One special challenge today.',
    xp: '200 XP Bonus',
    color: '#1B3A4B',
    tag: 'TODAY ONLY',
  },
  {
    slug: 'streak',
    icon: 'Flame',
    title: 'Streak Quiz',
    desc: 'Answer until you miss one.',
    xp: '10 XP per correct',
    color: '#C4714A',
    tag: null,
  },
];

function PlayPage() {
  const { language } = useStore();
  
  const stats = {
    quizzesCompleted: 12,
    accuracy: 84,
    bestStreak: 7,
    xpFromQuizzes: 450
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <AppHeader />
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 24px 120px', animation: 'pageEnter 0.4s ease forwards' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2D4A3E', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>{language === 'pt' ? 'Arena de Treinamento' : 'Training Arena'}</span>
          </div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1C1C1A', marginBottom: '12px', fontWeight: 700 }}>
            {language === 'pt' ? 'Treine suas habilidades' : 'Train your skills'}
          </h1>
          <p style={{ color: '#6B6B63', fontSize: '18px', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto', opacity: 0.8 }}>
            {language === 'pt' ? 'Jogos curtos, progresso real.' : 'Short games, real progress.'}
          </p>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '64px' }}>
          {[
            { label: language === 'pt' ? 'Quizzes' : 'Quizzes', value: stats.quizzesCompleted, color: '#2D4A3E', icon: <Trophy size={18} /> },
            { label: language === 'pt' ? 'Precisão' : 'Accuracy', value: `${stats.accuracy}%`, color: '#C9A84C', icon: <Star size={18} /> },
            { label: 'Streak', value: stats.bestStreak, color: '#C4714A', icon: <Flame size={18} /> },
            { label: 'XP', value: stats.xpFromQuizzes, color: '#1B3A4B', icon: <Zap size={18} /> }
          ].map((stat, i) => (
            <div key={i} className="glass premium-shadow" style={{ padding: '24px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.4)' }}>
               <div style={{ display: 'flex', justifyContent: 'center', color: stat.color, marginBottom: '8px', opacity: 0.6 }}>{stat.icon}</div>
               <div style={{ fontSize: '28px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: '#1C1C1A' }}>{stat.value}</div>
               <div style={{ fontSize: '10px', color: '#6B6B63', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Category Pick */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', textAlign: 'center' }}>
            {language === 'pt' ? 'Focar em categoria' : 'Focus by category'}
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              {cat:'Grammar',icon:'Book',prog:0.8},
              {cat:'Vocabulary',icon:'Library',prog:0.6},
              {cat:'Idioms',icon:'Smile',prog:0.3},
              {cat:'Culture',icon:'Palette',prog:0.1},
              {cat:'Professional',icon:'Briefcase',prog:0.9},
            ].map((c, i) => (
              <motion.div key={c.cat} whileHover={{ scale: 1.05 }} className="glass premium-shadow" style={{ padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.4)' }}>
                <div style={{ color: '#2D4A3E' }}><DynamicIcon name={c.icon} size={18} /></div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1A' }}>{c.cat}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {GAME_MODES.map((mode, i) => (
            <GameModeCard key={mode.slug} mode={mode} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}

function GameModeCard({ mode, index }: { mode: typeof GAME_MODES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/quiz/${mode.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="glass premium-shadow"
        style={{
          borderRadius: '32px', padding: '32px', cursor: 'pointer',
          border: `1px solid ${hovered ? mode.color : 'rgba(255,255,255,0.4)'}`,
          position: 'relative', overflow: 'hidden', minHeight: '260px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {mode.tag && (
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            padding: '4px 12px', borderRadius: '99px',
            background: mode.color, color: 'white',
            fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {mode.tag}
          </div>
        )}

        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${mode.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mode.color, marginBottom: '24px', transition: 'all 0.4s' }}>
          <DynamicIcon name={mode.icon} size={32} />
        </div>

        <div>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '24px', color: '#1C1C1A', marginBottom: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {mode.title}
            <ChevronRight size={20} style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-10px)', transition: 'all 0.3s', color: mode.color }} />
          </h3>
          <p style={{ fontSize: '14px', color: '#6B6B63', lineHeight: 1.5, marginBottom: '20px', opacity: 0.8 }}>{mode.desc}</p>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '99px', background: 'white', color: mode.color, fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', border: `1px solid ${mode.color}20` }}>
            {mode.xp}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
