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
  { id: 'm1', title: 'Foundations', slug: 'basics', icon: 'Seedling', color: '#2D4A3E', progress: 100, xpRequired: 0, desc: 'Master the essential building blocks of native interaction.' },
  { id: 'm2', title: 'Social Life', slug: 'travel', icon: 'Coffee', color: '#1B3A4B', progress: 45, xpRequired: 100, desc: 'Navigate restaurants, travel, and casual street talk.' },
  { id: 'm3', title: 'Work & Biz', slug: 'business', icon: 'Briefcase', color: '#C4714A', progress: 0, xpRequired: 300, desc: 'Professional etiquette and street-smart workplace communication.' },
  { id: 'm4', title: 'Culture & Slang', slug: 'history', icon: 'Palette', color: '#7850B4', progress: 0, xpRequired: 600, desc: 'Deep dive into cultural street slang, local idioms, and nuances.' },
];

const QUICK_TIPS = [
  { icon: 'Zap', text: 'Pratique 5 minutos por dia para acelerar seu aprendizado em até 2x.' },
  { icon: 'Book', text: 'Salve as gírias do dia a dia e revise antes de iniciar o chat de voz.' },
  { icon: 'MessageSquare', text: 'Não tenha medo de errar; o Lume corrige sua pronúncia na hora.' },
];

function HomePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { interfaceLanguage, xp, streak, level, lumes, dailyChallenges, setXP, setStreak, setInterfaceLanguage } = useStore();
  const [profile, setProfile] = useState<any>(null);
  const [conversationCount, setConversationCount] = useState(0);
  const [expressionCount, setExpressionCount] = useState(0);
  const [hasConversationToday, setHasConversationToday] = useState(false);
  const [todayExpressions, setTodayExpressions] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  
  const isPT = interfaceLanguage === 'pt';
  const dailyWord = getDailyWord(isPT ? 'en' : 'pt');

  useEffect(() => {
    if (!loading && !user) { nav({ to: "/login" }); return; }
    
    async function loadHomeData() {
      if (!user) return;
      const result = await getUserStats(user.id);
      if (result.profile) {
        setProfile(result.profile);
        setXP(result.profile.xp || 0);
        setStreak(result.profile.streak || 0);
        // Only sync language from DB if the user hasn't manually chosen one
        const storedLang = localStorage.getItem('lume_interface_language');
        if (!storedLang) {
          setInterfaceLanguage((result.profile.interface_language || 'pt') as any);
        }
      }
      setConversationCount(result.stats.conversationCount);
      setExpressionCount(result.stats.expressionCount);
      
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

  const firstName = profile?.full_name?.split(" ")[0] || (isPT ? "Estudante" : "Learner");

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (isPT) {
      if (hr < 12) return { main: `Bom dia, ${firstName}`, sub: "Que tal praticar algumas gírias hoje?" };
      if (hr < 18) return { main: `Boa tarde, ${firstName}`, sub: "Pronto para levar seu inglês para a rua?" };
      return { main: `Boa noite, ${firstName}`, sub: "Uma conversa rápida antes de encerrar o dia?" };
    }
    if (hr < 12) return { main: `Good morning, ${firstName}`, sub: "Shall we practice some street talk today?" };
    if (hr < 18) return { main: `Good afternoon, ${firstName}`, sub: "Ready to level up your English skills?" };
    return { main: `Good evening, ${firstName}`, sub: "A quick conversational practice before bed?" };
  };

  const greeting = getGreeting();

  if (loading || (!profile && loadingData)) return null;

  return (
    <div className="min-h-screen bg-background dark:bg-[#0D0D0B] text-foreground transition-colors duration-300">
      <AppHeader />
      
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12 pb-32">
        
        {/* Welcome Section */}
        <section className="relative mb-12 page-enter">
          <div className="glass p-8 md:p-10 rounded-[32px] relative overflow-hidden premium-shadow border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 text-accent-green dark:text-accent-gold text-xs font-extrabold uppercase tracking-widest mb-4">
                <Sparkles size={14} className="animate-pulse" />
                <span>{isPT ? 'Progresso Diário' : 'Daily Progress'}</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-[#1C1C1A] dark:text-white font-extrabold mb-3 leading-tight tracking-tight">
                {greeting.main}
              </h1>
              <p className="text-[#6B6B63] dark:text-gray-400 text-base md:text-lg mb-8 font-medium italic">
                {greeting.sub}
              </p>

              <div className="flex gap-4 flex-wrap items-center">
                <Link to="/play" className="no-underline">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3.5 bg-accent-green dark:bg-accent-gold text-white dark:text-zinc-900 rounded-2xl font-bold text-sm md:text-base flex items-center gap-2.5 shadow-[0_8px_20px_rgba(45,74,62,0.25)] dark:shadow-[0_8px_20px_rgba(221,192,110,0.15)] cursor-pointer hover:brightness-105 transition-all duration-200"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{isPT ? 'Iniciar Conversa' : 'Start Conversation'}</span>
                  </motion.button>
                </Link>

                <div className="flex gap-3">
                  <StatItem icon="Zap" value={xp} label="XP" color="var(--accent-green)" />
                  <StatItem icon="Flame" value={streak} label={isPT ? 'DIAS' : 'DAYS'} color="#FF6B35" />
                </div>
              </div>
            </div>
            
            <LumeIllustration className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-60 h-60 opacity-15 md:opacity-90 md:right-8 pointer-events-none transition-transform hover:scale-105 duration-500" />
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Learning Path */}
            <section>
              <SectionHeader 
                title={isPT ? 'Sua Trilha de Aprendizado' : 'Your Learning Path'} 
                sub={isPT ? 'Desbloqueie novos caminhos acumulando XP' : 'Unlock paths by leveling up'}
                action={{ label: isPT ? 'Habilidades' : 'Skills', to: '/skills' }}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MODULES.map((m, i) => (
                  <ModuleCard key={m.id} module={m} index={i} isPT={isPT} />
                ))}
              </div>
            </section>

            {/* Daily Word */}
            <section>
              <div className="glass premium-shadow p-6 md:p-8 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 relative">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-[11px] font-extrabold color-[#C4714A] text-accent-terra dark:text-accent-terra uppercase tracking-wider">
                      {isPT ? 'Palavra & Gíria do Dia' : 'Daily Word & Slang'}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-[#1C1C1A] dark:text-white mt-1.5 font-extrabold">
                      {dailyWord.word}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent-terra/10 dark:bg-accent-terra/20 flex items-center justify-center text-accent-terra">
                    <Bookmark size={20} />
                  </div>
                </div>
                <p className="text-lg text-[#1C1C1A] dark:text-white mb-4.5 font-bold">{dailyWord.translation}</p>
                <div className="text-sm md:text-base text-[#6B6B63] dark:text-gray-300 font-medium italic bg-[#F7F4EF]/60 dark:bg-zinc-800/40 p-4.5 rounded-2xl border-l-4 border-accent-terra">
                  "{dailyWord.example}"
                </div>
              </div>
            </section>

            {/* Mini-Games Section */}
            <section>
              <SectionHeader 
                title={isPT ? 'Mini-Jogos' : 'Mini-Games'} 
                sub={isPT ? 'Melhore sua fixação brincando' : 'Learn and play at the same time'}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/memory" className="no-underline">
                  <div className="lume-card glass p-6 rounded-2xl border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 flex flex-col items-center text-center">
                    <div className="mb-3.5 text-accent-green dark:text-accent-gold">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#1C1C1A] dark:text-white">Jogo da Memória</h4>
                    <p className="text-xs text-[#6B6B63] dark:text-gray-400 mt-1">{isPT ? 'Combine as gírias e palavras' : 'Match vocabulary pairs'}</p>
                  </div>
                </Link>

                <Link to="/hangman" className="no-underline">
                  <div className="lume-card glass p-6 rounded-2xl border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 flex flex-col items-center text-center">
                    <div className="mb-3.5 text-accent-terra">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#1C1C1A] dark:text-white">Forca do Lume</h4>
                    <p className="text-xs text-[#6B6B63] dark:text-gray-400 mt-1">{isPT ? 'Adivinhe o vocabulário' : 'Guess the hidden terms'}</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar Area (1 Col) */}
          <aside className="flex flex-col gap-8">
            
            {/* CEFR Level & Heatmap */}
            <div className="glass premium-shadow p-6 rounded-[24px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6B63] dark:text-gray-400">{isPT ? 'NÍVEL CEFR ESTIMADO' : 'ESTIMATED CEFR LEVEL'}</span>
                <span className="px-3 py-1 bg-accent-green dark:bg-accent-gold text-white dark:text-zinc-900 rounded-lg font-extrabold text-xs">
                  {xp < 200 ? 'A1' : xp < 600 ? 'A2' : xp < 1500 ? 'B1' : 'B2'}
                </span>
              </div>
              
              <div className="mt-4">
                <span className="text-[10px] font-extrabold text-[#A8A8A0] dark:text-gray-500 uppercase tracking-widest">{isPT ? 'ATIVIDADE SEMANAL' : 'WEEKLY ACTIVITY'}</span>
                <div className="flex gap-1.5 mt-3 h-10 items-end">
                  {[0.2, 0.4, 0.8, 1, 0.3, 0.6, 0.1].map((val, i) => (
                    <div key={i} className="flex-1 bg-accent-green dark:bg-accent-gold rounded-md" style={{ opacity: Math.max(0.15, val), height: `${val * 100}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2.5 text-[9px] color-[#A8A8A0] dark:text-gray-500 font-extrabold uppercase">
                  <span>Seg</span><span>Dom</span>
                </div>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="glass-dark premium-shadow p-6 rounded-[24px] border border-white/10 bg-[#1C1C1A]/95 dark:bg-[#151513] text-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] width-24 height-24 bg-accent-gold/10 rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-accent-gold fill-accent-gold animate-bounce" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent-gold">
                  {isPT ? 'DESAFIO DE CONVERSA' : 'CONVERSATION CHALLENGE'}
                </span>
              </div>
              <p className="text-sm md:text-base mb-6 leading-relaxed font-bold">
                {isPT 
                  ? 'Fale sobre o seu café da manhã em inglês usando pelo menos uma gíria por 1 minuto.' 
                  : 'Talk about your breakfast in English using at least one slang for 1 minute.'}
              </p>
              <Link to="/play" className="no-underline">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-accent-gold hover:brightness-105 text-zinc-950 border-none rounded-xl font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-all duration-200"
                >
                  {isPT ? 'Iniciar (+50 XP)' : 'Start (+50 XP)'}
                </motion.button>
              </Link>
            </div>

            {/* Daily Missions */}
            <div className="glass premium-shadow p-6 rounded-[24px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-accent-green dark:text-accent-gold" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-accent-green dark:text-accent-gold">
                    {isPT ? 'MISSÕES DIÁRIAS' : 'DAILY MISSIONS'}
                  </span>
                </div>
                <Link to="/shop" className="text-sm font-extrabold text-accent-gold no-underline flex items-center gap-1 hover:underline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 9h8"/><path d="M8 15h8"/></svg>
                  <span>{lumes}</span>
                </Link>
              </div>
              
              <div className="flex flex-col gap-3.5">
                {dailyChallenges?.map((c, i) => (
                  <div key={c.id} className="flex gap-3 items-center pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50 first:border-t-0 first:pt-0">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {c.completed ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8A8A0" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold leading-tight ${c.completed ? 'text-gray-400 line-through' : 'text-[#1C1C1A] dark:text-white'}`}>
                        {c.title}
                      </div>
                      <div className="text-[10px] text-accent-gold font-extrabold mt-0.5">+{c.reward} Lumes</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-white uppercase tracking-widest pl-2">
                {isPT ? 'DICAS DO LUME' : 'LUME TIPS'}
              </h4>
              {QUICK_TIPS.map((tip, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex gap-3.5 p-4 bg-white/70 dark:bg-zinc-900/60 rounded-2xl border border-white/20 dark:border-zinc-800/80 shadow-sm"
                >
                  <div className="text-accent-green dark:text-accent-gold shrink-0 mt-0.5"><DynamicIcon name={tip.icon} size={16} /></div>
                  <p className="text-xs text-[#6B6B63] dark:text-gray-400 font-medium leading-relaxed">{tip.text}</p>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>

      </main>

      <MobileNav isPT={isPT} />
    </div>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub: string; action?: { label: string; to: string } }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-[#1C1C1A] dark:text-white font-extrabold leading-tight">{title}</h2>
        <p className="text-xs md:text-sm text-[#6B6B63] dark:text-gray-400 font-semibold mt-0.5">{sub}</p>
      </div>
      {action && (
        <Link to={action.to} className="text-xs font-extrabold text-accent-green dark:text-accent-gold no-underline flex items-center gap-1 px-4 py-2 rounded-xl bg-accent-green/5 dark:bg-accent-gold/10 hover:brightness-105 transition-all">
          <span>{action.label}</span> <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function ModuleCard({ module, index, isPT }: { module: typeof MODULES[0]; index: number; isPT: boolean }) {
  const { xp } = useStore();
  const locked = xp < module.xpRequired;
  const nav = useNavigate();

  const handleClick = () => {
    if (locked) return;
    nav({ to: `/conversation/${module.slug}` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index + 0.2 }}
      whileHover={locked ? {} : { scale: 1.025, y: -4 }}
      whileTap={locked ? {} : { scale: 0.985 }}
      onClick={handleClick}
      className="lume-card glass flex flex-col p-6 rounded-[28px] border border-white/20 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 relative overflow-hidden transition-all duration-300"
      style={{ 
        borderStyle: locked ? 'dashed' : 'solid', 
        borderColor: locked ? 'var(--accent-terra)' : 'var(--border)',
        cursor: locked ? 'not-allowed' : 'pointer'
      }}
    >
      {locked && (
        <div className="absolute inset-0 bg-[#F7F4EF]/85 dark:bg-[#0D0D0B]/85 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-md border border-border dark:border-zinc-700">
            <DynamicIcon name="Lock" size={16} color="var(--accent-terra)" />
          </div>
          <span className="text-[10px] font-extrabold text-accent-terra uppercase tracking-wider bg-white dark:bg-zinc-800 px-3.5 py-1.5 rounded-full shadow-sm">
            {isPT ? `Requer ${module.xpRequired} XP` : `Requires ${module.xpRequired} XP`}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-5 z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${module.color}15`, color: module.color }}>
          <DynamicIcon name={module.icon} size={24} />
        </div>
        {module.progress > 0 && !locked && (
          <div className="px-2.5 py-1 rounded-full text-[10px] font-extrabold" style={{ background: `${module.color}15`, color: module.color }}>
            {module.progress}%
          </div>
        )}
      </div>

      <h3 className="font-display text-lg md:text-xl font-bold text-[#1C1C1A] dark:text-white mb-2 leading-snug z-10">{module.title}</h3>
      <p className="text-xs md:text-sm text-[#6B6B63] dark:text-gray-400 leading-relaxed mb-6 font-medium z-10">{module.desc}</p>

      {!locked && (
        <div className="mt-auto h-1.5 bg-[#F7F4EF] dark:bg-zinc-800 rounded-full overflow-hidden z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${module.progress}%` }}
            transition={{ duration: 1.2, delay: 0.4 + (index * 0.1) }}
            style={{ height: '100%', background: module.color }} 
          />
        </div>
      )}
    </motion.div>
  );
}

function StatItem({ icon, value, label, color }: { icon: string; value: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-2 bg-white dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div style={{ color }} className="shrink-0"><DynamicIcon name={icon} size={16} /></div>
      <div>
        <div className="text-base md:text-lg font-extrabold text-[#1C1C1A] dark:text-white leading-none">{value}</div>
        <div className="text-[9px] font-extrabold text-[#6B6B63] dark:text-gray-400 uppercase tracking-widest mt-1">{label}</div>
      </div>
    </div>
  );
}

function MobileNav({ isPT }: { isPT: boolean }) {
  const NAV_ITEMS = [
    { to: '/home', icon: 'Home', label: isPT ? 'Início' : 'Home' },
    { to: '/play', icon: 'Zap', label: isPT ? 'Jogar' : 'Play' },
    { to: '/skills', icon: 'Layers', label: isPT ? 'Habilidades' : 'Skills' },
    { to: '/progress', icon: 'BarChart2', label: isPT ? 'Perfil' : 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-40">
      <div className="glass shadow-xl rounded-2xl p-2.5 flex justify-around items-center border border-white/30 dark:border-zinc-850 bg-white/70 dark:bg-zinc-900/80">
        {NAV_ITEMS.map(item => (
          <Link 
            key={item.to}
            to={item.to} 
            className="flex flex-col items-center gap-1 p-1.5 transition-all text-[#6B6B63] dark:text-gray-400 [&.active]:text-accent-green dark:[&.active]:text-accent-gold"
          >
            <DynamicIcon name={item.icon} size={20} />
            <span className="text-[8px] font-extrabold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
