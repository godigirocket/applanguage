import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/hooks/useStore";

const NavIcons = {
  practice: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  play: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.2"/>
      <polyline points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  skills: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  progress: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  lessons: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  guide: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  shop: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
};

export function AppHeader() {
  const { user } = useAuth();
  const { interfaceLanguage } = useStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name, onboarding_done").eq("id", user.id).maybeSingle()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const firstName = profile?.full_name?.split(" ")[0] || "";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/20 glass backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5 no-underline select-none" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '11px',
              background: 'linear-gradient(135deg, #2D6A4F 0%, #1B3A4B 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(45,106,79,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5.5C14 9 13.5 11 12 12c0 0 1-4-1-6" fill="white" opacity="0.9"/>
                <path d="M12 16a2 2 0 0 0 2-2c0-1-1-2-2-2s-2 1-2 2a2 2 0 0 0 2 2" fill="white"/>
              </svg>
            </div>
            <span style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: '20px', fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em', lineHeight: 1
            }}>Lume</span>
          </Link>

          {user && profile?.onboarding_done && (
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/home" icon="practice">{interfaceLanguage === 'pt' ? 'Praticar' : 'Practice'}</NavLink>
              <NavLink to="/lessons" icon="lessons">{interfaceLanguage === 'pt' ? 'Lições' : 'Lessons'}</NavLink>
              <NavLink to="/play" icon="play">{interfaceLanguage === 'pt' ? 'Jogar' : 'Play'}</NavLink>
              <NavLink to="/skills" icon="skills">{interfaceLanguage === 'pt' ? 'Habilidades' : 'Skills'}</NavLink>
              <NavLink to="/progress" icon="progress">{interfaceLanguage === 'pt' ? 'Progresso' : 'Progress'}</NavLink>
              <NavLink to="/guide" icon="guide">{interfaceLanguage === 'pt' ? 'Como usar' : 'Guide'}</NavLink>
              <NavLink to="/shop" icon="shop">{interfaceLanguage === 'pt' ? 'Loja' : 'Shop'}</NavLink>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
            {user ? (
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-accent-sand flex items-center justify-center text-accent-green font-bold text-sm border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative">
                  {firstName ? firstName[0] : NavIcons.user}
                  <div className="absolute inset-0 bg-accent-green/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={{
                  padding: '8px 18px', borderRadius: '99px',
                  background: 'rgba(45,74,62,0.08)', color: '#2D4A3E',
                  textDecoration: 'none', fontSize: '13px', fontWeight: 700,
                  transition: 'all 0.2s'
                }}
                className="hover:bg-primary hover:text-white"
              >
                {interfaceLanguage === 'pt' ? 'Entrar' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function NavLink({ to, children, icon }: { to: string; children: React.ReactNode; icon: keyof typeof NavIcons }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all px-3 py-2 rounded-lg"
      style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
      activeProps={{ style: { color: 'var(--accent-green)', background: 'rgba(45,106,79,0.08)' } }}
    >
      {NavIcons[icon]}
      {children}
    </Link>
  );
}