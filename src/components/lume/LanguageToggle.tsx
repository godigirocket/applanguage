import { useStore } from "@/hooks/useStore";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function LanguageToggle() {
  const { user } = useAuth();
  const { language, setLanguage } = useStore();
  const isEN = language === "en";

  const toggle = async () => {
    const next = isEN ? "pt" : "en";
    
    // 1. Update local state immediately
    setLanguage(next);
    localStorage.setItem('lume_language', next);
    
    // 2. Update Supabase profile
    if (user) {
      await supabase.from('profiles').update({ language: next }).eq('id', user.id);
    }

    toast.success(next === "en" ? "Switched to English 🇺🇸" : "Mudou para Português 🇧🇷");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      style={{
        position: 'relative',
        width: '88px', height: '40px',
        borderRadius: '99px',
        background: isEN ? '#1B3A4B' : '#2D4A3E',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        padding: '4px',
        transition: 'background 0.3s ease',
        boxShadow: `0 4px 16px ${isEN ? 'rgba(27,58,75,0.35)' : 'rgba(45,74,62,0.35)'}`,
      }}
    >
      {/* Sliding pill */}
      <div style={{
        position: 'absolute',
        width: '42px', height: '32px',
        borderRadius: '99px',
        background: 'white',
        top: '4px',
        left: isEN ? '4px' : '42px',
        transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 800,
        color: isEN ? '#1B3A4B' : '#2D4A3E'
      }}>
        {isEN ? '🇺🇸' : '🇧🇷'}
      </div>
      {/* Labels */}
      <span style={{
        position: 'absolute', left: '12px',
        fontSize: '10px', fontWeight: 800,
        color: isEN ? 'transparent' : 'rgba(255,255,255,0.7)',
        transition: 'color 0.3s', letterSpacing: '0.05em'
      }}>EN</span>
      <span style={{
        position: 'absolute', right: '10px',
        fontSize: '10px', fontWeight: 800,
        color: isEN ? 'rgba(255,255,255,0.7)' : 'transparent',
        transition: 'color 0.3s', letterSpacing: '0.05em'
      }}>PT</span>
    </button>
  );
}

