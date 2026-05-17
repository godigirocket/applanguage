import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/lume/AppHeader";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { DynamicIcon } from "@/components/lume/DynamicIcon";
import { Lock, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/skills")({
  component: SkillsPage,
});

const SKILLS = [
  { id: 'foundations',      title: 'Foundations',       icon: 'Seedling', desc: 'The basics of interaction',      locked: false, completed: true,  parent: null },
  { id: 'daily-life',      title: 'Daily Life',         icon: 'Coffee',   desc: 'Everyday scenarios',             locked: false, completed: false, parent: 'foundations' },
  { id: 'basic-grammar',   title: 'Basic Grammar',     icon: 'Book',     desc: 'Structure your thoughts',        locked: false, completed: false, parent: 'foundations' },
  { id: 'conversations',   title: 'Conversations',    icon: 'MessageSquare', desc: 'Natural flow in dialogue',       locked: true,  completed: false, parent: 'daily-life' },
  { id: 'vocabulary',      title: 'Vocabulary',        icon: 'Library',  desc: 'Expand your word bank',          locked: true,  completed: false, parent: 'basic-grammar' },
  { id: 'professional',    title: 'Professional',      icon: 'Briefcase',desc: 'Business etiquette',             locked: true,  completed: false, parent: 'conversations' },
  { id: 'culture',         title: 'Culture',           icon: 'Palette',  desc: 'Social nuances',                 locked: true,  completed: false, parent: 'vocabulary' },
  { id: 'advanced-grammar',title: 'Advanced Grammar',  icon: 'Zap',      desc: 'Master complexity',              locked: true,  completed: false, parent: 'professional' },
  { id: 'expression',      title: 'Expression',        icon: 'Music',    desc: 'Speak with soul',                locked: true,  completed: false, parent: 'culture' },
  { id: 'fluency-master',  title: 'Fluency Master',    icon: 'Trophy',   desc: 'The ultimate goal',              locked: true,  completed: false, parent: 'expression' },
];

function SkillsPage() {
  const { language } = useStore();

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <AppHeader />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 120px', animation: 'pageEnter 0.4s ease forwards' }}>

        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2D4A3E', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>{language === 'pt' ? 'Sua Evolução' : 'Your Evolution'}</span>
          </div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1C1C1A', marginBottom: '12px', fontWeight: 700 }}>
            {language === 'pt' ? 'Árvore de Habilidades' : 'Skill Tree'}
          </h1>
          <p style={{ color: '#6B6B63', fontSize: '18px', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto', opacity: 0.8 }}>
            {language === 'pt' ? 'Um mapa visual da sua evolução linguística.' : 'A visual map of your linguistic evolution.'}
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', position: 'relative' }}>
          {/* Top node */}
          <SkillNode skill={SKILLS[0]} />
          <Connector />

          {/* Row 2: two branches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', width: '100%', maxWidth: '700px' }} className="grid-cols-1 md:grid-cols-2">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SkillNode skill={SKILLS[1]} />
              <Connector />
              <SkillNode skill={SKILLS[3]} />
              <Connector />
              <SkillNode skill={SKILLS[5]} />
              <Connector />
              <SkillNode skill={SKILLS[7]} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SkillNode skill={SKILLS[2]} />
              <Connector />
              <SkillNode skill={SKILLS[4]} />
              <Connector />
              <SkillNode skill={SKILLS[6]} />
              <Connector />
              <SkillNode skill={SKILLS[8]} />
            </div>
          </div>

          <Connector />
          {/* Final node */}
          <SkillNode skill={SKILLS[9]} />
        </div>
      </main>
    </div>
  );
}

function Connector() {
  return <div style={{ width: '2px', height: '50px', background: 'linear-gradient(180deg, #E0DDD6, #D4C5A9)', margin: '4px 0', opacity: 0.5 }} />;
}

function SkillNode({ skill }: { skill: typeof SKILLS[0] }) {
  const [hovered, setHovered] = useState(false);

  const bg = skill.completed ? 'linear-gradient(135deg, #2D4A3E, #1B3A4B)' : skill.locked ? 'rgba(255,255,255,0.4)' : 'white';
  const borderColor = skill.completed ? 'transparent' : skill.locked ? '#E0DDD6' : '#2D4A3E';
  const borderStyle = skill.completed ? 'solid' : skill.locked ? 'solid' : 'dashed';
  const opacity = skill.locked ? 0.6 : 1;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={!skill.locked ? { scale: 1.05, y: -4 } : {}}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        opacity, cursor: skill.locked ? 'default' : 'pointer',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        position: 'relative'
      }}
    >
      <div 
        className={!skill.locked ? "glass premium-shadow" : ""}
        style={{
          width: '100px', height: '100px', borderRadius: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bg, border: `2px ${borderStyle} ${borderColor}`,
          position: 'relative',
          boxShadow: skill.completed ? '0 12px 32px rgba(45,74,62,0.3)' :
                     !skill.locked && hovered ? '0 12px 32px rgba(45,74,62,0.15)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {skill.completed ? (
          <Check size={36} color="white" strokeWidth={3} />
        ) : skill.locked ? (
          <Lock size={24} color="#6B6B63" opacity={0.5} />
        ) : (
          <div style={{ color: '#2D4A3E' }}>
            <DynamicIcon name={skill.icon} size={36} />
          </div>
        )}

        {!skill.locked && !skill.completed && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', top: '-6px', right: '-6px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#C9A84C', border: '4px solid #F7F4EF',
              boxShadow: '0 0 15px rgba(201,168,76,0.6)',
            }} 
          />
        )}
      </div>

      <div style={{ textAlign: 'center', maxWidth: '160px' }}>
        <h3 style={{
          fontFamily: 'Nunito, sans-serif', fontSize: '18px',
          color: skill.locked ? '#6B6B63' : '#1C1C1A', fontWeight: 700, marginBottom: '4px',
        }}>
          {skill.title}
        </h3>
        <p style={{ fontSize: '13px', color: '#6B6B63', lineHeight: 1.5, opacity: 0.8 }}>
          {skill.desc}
        </p>
      </div>
    </motion.div>
  );
}
