import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/lume/AppHeader";
import { useEffect, useState } from "react";
import { safeQuery, supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/hooks/useStore";
import { TOPICS } from "@/lib/topics";
import { getUserStats } from "@/lib/db";
import { getDailyWord } from "@/lib/daily-words";
import { DynamicIcon } from "@/components/lume/DynamicIcon";
import { LumeIllustration } from "@/components/lume/LumeIllustration";
import { ChevronRight, Play, Star, Book, Sparkles, Trophy, Zap, Clock, Bookmark, Layers, BarChart2, Home, User, Target } from "lucide-react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

const MODULES = [
  { id: 'm1', title: 'Foundations', slug: 'basics', icon: 'Seedling', color: '#2D4A3E', progress: 100, locked: false, desc: 'Master the essential building blocks of interaction.' },
  { id: 'm2', title: 'Social Life', slug: 'travel', icon: 'Coffee', color: '#1B3A4B', progress: 45, locked: false, desc: 'Navigate restaurants, travel, and casual meetups.' },
  { id: 'm3', title: 'Work & Biz', slug: 'business', icon: 'Briefcase', color: '#C4714A', progress: 0, locked: true, desc: 'Professional etiquette and workplace communication.' },
  { id: 'm4', title: 'Culture', slug: 'history', icon: 'Palette', color: '#7850B4', progress: 0, locked: true, desc: 'Deep dive into social nuances and cultural context.' },
];

const QUICK_TIPS = [
  { icon: 'Zap', text: 'Practice 5 mins every day for 2x faster growth.' },
  { icon: 'Book', text: 'Save expressions to review them before bed.' },
  { icon: 'MessageSquare', text: 'Don\'t fear mistakes; they are your best teachers.' },
];

function HomePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { language, xp, streak, level, lumes, dailyChallenges, setXP, setStreak, setLanguage } = useStore();
  const [profile, setProfile] = useState<any>(null);
  const [conversationCount, setConversationCount] = useState(0);
  const [expressionCount, setExpressionCount] = useState(0);
  const [hasConversationToday, setHasConversationToday] = useState(false);
  const [todayExpressions, setTodayExpressions] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const dailyWord = getDailyWord(language as any);

  useEffect(() => {
    if (!loading && !user) { nav({ to: "/login" }); return; }
    
    async function loadHomeData() {
      if (!user) return;
      const result = await getUserStats(user.id);
      if (result.profile) {
        setProfile(result.profile);
        setXP(result.profile.xp || 0);
        setStreak(result.profile.streak || 0);
        setLanguage((result.profile.language || 'en') as any);
      }
      setConversationCount(result.stats.conversationCount);
      setExpressionCount(result.stats.expressionCount);
      
      // Check daily missions
      const today = new Date().toISOString().split('T')[0];
      const todayConvs = result.conversations.filter(c => 
        c.created_at.startsWith(today)
      );
      setHasConversationToday(todayConvs.length > 0);
      
      const todayExprs = result.expressions.filter(e => 
        e.created_at.startsWith(today)
      );
      setTodayExpressions(todayExprs.length);
      
      setLoadingData(false);
    }
    
    if (user) {
      loadHomeData();
    }
  }, [user, loading, nav]);

  const firstName = profile?.full_name?.split(" ")[0] || "Friend";

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (language === 'pt') {
      if (hr < 12) return { main: `Bom dia, ${firstName}`, sub: "Vamos praticar um pouco hoje?" };
      if (hr < 18) return { main: `Boa tarde, ${firstName}`, sub: "Pronto para evoluir seu inglês?" };
      return { main: `Boa noite, ${firstName}`, sub: "Uma sessão rápida antes de descansar?" };
    }
    if (hr < 12) return { main: `Good morning, ${firstName}`, sub: "Shall we practice a bit today?" };
    if (hr < 18) return { main: `Good afternoon, ${firstName}`, sub: "Ready to level up your English?" };
    return { main: `Good evening, ${firstName}`, sub: "A quick session before you rest?" };
  };

  const greeting = getGreeting();

  if (loading || (!profile && loadingData)) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <AppHeader />
      
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '40px 24px 120px' }}>
        
        {/* Welcome Section */}
        <section style={{ position: 'relative', marginBottom: '48px', animation: 'pageEnter 0.6s ease-out both' }}>
          <div className="glass" style={{ padding: '40px', borderRadius: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.4)' }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2D4A3E', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
                <Sparkles size={14} />
                <span>{language === 'pt' ? 'Bem-vindo de volta' : 'Welcome back'}</span>
              </div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 5vw, 48px)', color: '#1C1C1A', marginBottom: '12px', fontWeight: 700, lineHeight: 1.1 }}>
                {greeting.main}
              </h1>
              <p style={{ color: '#6B6B63', fontSize: '18px', marginBottom: '32px', fontStyle: 'italic', opacity: 0.8 }}>
                {greeting.sub}
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/play" style={{ textDecoration: 'none' }}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      padding: '14px 28px', background: '#2D4A3E', color: 'white', border: 'none', borderRadius: '16px', 
                      fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      boxShadow: '0 10px 25px rgba(45,74,62,0.2)'
                    }}
                  >
                    <Play size={18} fill="white" />
                    {language === 'pt' ? 'Iniciar Conversa' : 'Start Conversation'}
                  </motion.button>
                </Link>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <StatItem icon="Zap" value={xp} label="XP" color="#2D4A3E" />
                  <StatItem icon="Flame" value={streak} label={language === 'pt' ? 'DIAS' : 'DAYS'} color="#FF6B35" />
                </div>
              </div>
            </div>
            
            <LumeIllustration className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 md:opacity-100 md:right-8" />
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }} className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Learning Path */}
            <section>
              <SectionHeader 
                title={language === 'pt' ? 'Seu Caminho' : 'Your Learning Path'} 
                sub={language === 'pt' ? 'Continue de onde parou' : 'Pick up where you left off'}
                action={{ label: language === 'pt' ? 'Ver tudo' : 'View all', to: '/skills' }}
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {MODULES.map((m, i) => (
                  <ModuleCard key={m.id} module={m} index={i} />
                ))}
              </div>
            </section>

            {/* Daily Word */}
            <section>
              <div className="glass premium-shadow" style={{ padding: '32px', borderRadius: '28px', border: '1px solid white', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#C4714A', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {language === 'pt' ? 'Palavra do Dia' : 'Daily Word'}
                    </span>
                    <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', color: '#1C1C1A', marginTop: '4px', fontWeight: 700 }}>
                      {dailyWord.word}
                    </h3>
                  </div>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#C4714A10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4714A' }}>
                    <Bookmark size={24} />
                  </div>
                </div>
                <p style={{ fontSize: '18px', color: '#1C1C1A', marginBottom: '14px', fontWeight: 600 }}>{dailyWord.translation}</p>
                <p style={{ fontSize: '15px', color: '#6B6B63', fontStyle: 'italic', lineHeight: 1.6, background: '#F7F4EF', padding: '16px', borderRadius: '12px', borderLeft: '3px solid #C4714A' }}>"{dailyWord.example}"</p>
              </div>
            </section>

            {/* Mini-Games Section */}
            <section>
              <SectionHeader 
                title={language === 'pt' ? 'Mini-Jogos' : 'Mini-Games'} 
                sub={language === 'pt' ? 'Aprenda brincando' : 'Learn by playing'}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Link to="/memory" style={{ textDecoration: 'none' }}>
                  <div className="lume-card glass" style={{ padding: '24px', borderRadius: '24px', border: '1px solid white', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '12px', color: '#2D4A3E' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                    </div>
                    <h4 style={{ fontFamily: 'Playfair Display', fontSize: '18px', fontWeight: 800, color: '#1C1C1A' }}>Jogo da Memória</h4>
                    <p style={{ fontSize: '13px', color: '#6B6B63', marginTop: '4px' }}>Combine as palavras</p>
                  </div>
                </Link>
                <Link to="/hangman" style={{ textDecoration: 'none' }}>
                  <div className="lume-card glass" style={{ padding: '24px', borderRadius: '24px', border: '1px solid white', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '12px', color: '#C4714A' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <h4 style={{ fontFamily: 'Playfair Display', fontSize: '18px', fontWeight: 800, color: '#1C1C1A' }}>Forca do Lume</h4>
                    <p style={{ fontSize: '13px', color: '#6B6B63', marginTop: '4px' }}>Adivinhe o vocabulário</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* CEFR Level & Heatmap */}
            <div className="glass premium-shadow" style={{ padding: '24px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.4)', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B63' }}>Nível CEFR Estimado</span>
                <span style={{ padding: '4px 12px', background: '#2D4A3E', color: 'white', borderRadius: '8px', fontWeight: 800, fontSize: '14px' }}>
                  {xp < 200 ? 'A1' : xp < 600 ? 'A2' : xp < 1500 ? 'B1' : 'B2'}
                </span>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#A8A8A0', textTransform: 'uppercase' }}>Atividade Semanal</span>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px', height: '32px', alignItems: 'flex-end' }}>
                  {[0.2, 0.4, 0.8, 1, 0.3, 0.6, 0.1].map((val, i) => (
                    <div key={i} style={{ flex: 1, background: '#2D4A3E', opacity: Math.max(0.1, val), height: `${val * 100}%`, borderRadius: '4px' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#A8A8A0', fontWeight: 600 }}>
                  <span>Seg</span><span>Dom</span>
                </div>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="glass-dark premium-shadow" style={{ padding: '28px', borderRadius: '28px', color: 'white', position: 'relative', overflow: 'hidden', marginTop: '0px' }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', background: 'rgba(201, 168, 76, 0.1)', borderRadius: '50%' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Zap size={18} color="#C9A84C" fill="#C9A84C" />
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C9A84C' }}>
                  {language === 'pt' ? 'Desafio Diário' : 'Daily Challenge'}
                </span>
              </div>
              <p style={{ fontSize: '16px', marginBottom: '24px', lineHeight: 1.5, opacity: 0.9, fontWeight: 500 }}>
                {language === 'pt' 
                  ? 'Fale sobre o seu café da manhã por 1 minuto.' 
                  : 'Talk about your breakfast for 1 minute.'}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '100%', padding: '14px', background: '#C9A84C', color: '#1C1C1A', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {language === 'pt' ? 'Começar (+50 XP)' : 'Start (+50 XP)'}
              </motion.button>
            </div>

            {/* Daily Missions */}
            <div className="glass premium-shadow" style={{ padding: '24px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.4)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="#2D4A3E" />
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#2D4A3E' }}>
                    {language === 'pt' ? 'Missões Diárias' : 'Daily Missions'}
                  </span>
                </div>
                <Link to="/shop" style={{ fontSize: '14px', fontWeight: 800, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 9h8"/><path d="M8 15h8"/></svg>
                  {lumes}
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dailyChallenges?.map((c, i) => (
                  <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderTop: i > 0 ? '1px solid #F0EBE3' : 'none', paddingTop: i > 0 ? '12px' : '0' }}>
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.completed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8A8A0" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: c.completed ? '#6B6B63' : '#1C1C1A', textDecoration: c.completed ? 'line-through' : 'none' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '11px', color: c.completed ? '#6B6B63' : '#C9A84C', fontWeight: 700 }}>+{c.reward} Lumes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.15em', paddingLeft: '8px' }}>
                {language === 'pt' ? 'Dicas Rápidas' : 'Quick Tips'}
              </h4>
              {QUICK_TIPS.map((tip, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  style={{ display: 'flex', gap: '14px', padding: '18px', background: 'white', borderRadius: '20px', border: '1px solid #E0DDD6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ color: '#2D4A3E', flexShrink: 0, marginTop: '2px' }}><DynamicIcon name={tip.icon} size={18} /></div>
                  <p style={{ fontSize: '13px', color: '#6B6B63', lineHeight: 1.5 }}>{tip.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Milestone Card */}
            <div className="glass premium-shadow" style={{ padding: '28px', borderRadius: '28px', textAlign: 'center', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#C9A84C10', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#C9A84C' }}>
                <Trophy size={32} />
              </div>
              <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', color: '#1C1C1A', marginBottom: '8px', fontWeight: 700 }}>
                {language === 'pt' ? 'Quase lá!' : 'Almost there!'}
              </h4>
              <p style={{ fontSize: '14px', color: '#6B6B63', marginBottom: '20px', lineHeight: 1.4 }}>
                {language === 'pt' ? 'Você está a 250 XP de subir para o nível 5.' : 'You are 250 XP away from level 5.'}
              </p>
              <div style={{ height: '8px', background: '#E0DDD6', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #C9A84C, #E5C365)' }} 
                />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>750 / 1000 XP</span>
            </div>
          </aside>
        </div>

      </main>

      <MobileNav language={language} />
    </div>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub: string; action?: { label: string; to: string } }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
      <div>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '30px', color: '#1C1C1A', marginBottom: '4px', fontWeight: 700 }}>{title}</h2>
        <p style={{ fontSize: '15px', color: '#6B6B63', opacity: 0.8 }}>{sub}</p>
      </div>
      {action && (
        <Link to={action.to} style={{ fontSize: '14px', fontWeight: 700, color: '#2D4A3E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', borderRadius: '12px', background: '#2D4A3E08' }}>
          {action.label} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function ModuleCard({ module, index }: { module: typeof MODULES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index + 0.3 }}
      className="lume-card"
      style={{ 
        background: 'white', padding: '28px', borderRadius: '28px', 
        border: '1px solid #E0DDD6', cursor: module.locked ? 'default' : 'pointer',
        position: 'relative', overflow: 'hidden'
      }}
    >
      {module.locked && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(3px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <DynamicIcon name="Lock" size={20} color="#6B6B63" />
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${module.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: module.color }}>
          <DynamicIcon name={module.icon} size={28} />
        </div>
        {module.progress > 0 && !module.locked && (
          <div style={{ padding: '5px 12px', borderRadius: '99px', background: `${module.color}15`, color: module.color, fontSize: '11px', fontWeight: 800 }}>
            {module.progress}%
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1C1A', marginBottom: '8px' }}>{module.title}</h3>
      <p style={{ fontSize: '14px', color: '#6B6B63', lineHeight: 1.5, marginBottom: '24px', opacity: 0.9 }}>{module.desc}</p>

      {!module.locked && (
        <div style={{ height: '6px', background: '#F7F4EF', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${module.progress}%` }}
            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
            style={{ height: '100%', background: module.color }} 
          />
        </div>
      )}
    </motion.div>
  );
}

function StatItem({ icon, value, label, color }: { icon: string; value: any; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: 'white', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
      <div style={{ color }}><DynamicIcon name={icon} size={18} /></div>
      <div>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1C1C1A', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B6B63', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  );
}

function MobileNav({ language }: { language: string }) {
  const NAV_ITEMS = [
    { to: '/home', icon: 'Home', label: language === 'pt' ? 'Início' : 'Home' },
    { to: '/play', icon: 'Zap', label: language === 'pt' ? 'Jogar' : 'Play' },
    { to: '/skills', icon: 'Layers', label: language === 'pt' ? 'Skills' : 'Skills' },
    { to: '/progress', icon: 'BarChart2', label: language === 'pt' ? 'Perfil' : 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-40">
      <div className="glass shadow-xl rounded-2xl p-2 flex justify-around items-center border border-white/40">
        {NAV_ITEMS.map(item => (
          <Link 
            key={item.to}
            to={item.to} 
            className="flex flex-col items-center gap-1 p-2 transition-all [&.active]:text-[#2D4A3E] text-[#6B6B63]"
          >
            <DynamicIcon name={item.icon} size={22} />
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
