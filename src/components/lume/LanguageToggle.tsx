import { useStore } from "@/hooks/useStore";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function LanguageToggle() {
  const { user } = useAuth();
  const { interfaceLanguage, setInterfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const toggle = async () => {
    const next = isPT ? "en" : "pt";
    
    // 1. Update local state immediately
    setInterfaceLanguage(next);
    localStorage.setItem('lume_interface_language', next);
    
    // 2. Update Supabase profile
    if (user) {
      await supabase.from('profiles').update({ interface_language: next }).eq('id', user.id);
    }

    toast.success(next === "en" ? "Switched to English" : "Idioma alterado para Português");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      style={{
        position: 'relative',
        width: '84px', height: '38px',
        borderRadius: '99px',
        background: isPT ? '#2D4A3E' : '#1B3A4B',
        border: '1.5px solid rgba(255,255,255,0.15)', 
        cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        padding: '3px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
      className="active:scale-95 hover:brightness-105"
    >
      {/* Sliding pill */}
      <div style={{
        position: 'absolute',
        width: '38px', height: '28px',
        borderRadius: '99px',
        background: 'white',
        top: '3.5px',
        left: isPT ? '3.5px' : '40.5px',
        transition: 'left 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 900,
        color: isPT ? '#2D4A3E' : '#1B3A4B'
      }}>
        {isPT ? 'PT' : 'EN'}
      </div>
      {/* Labels */}
      <span style={{
        position: 'absolute', left: '13px',
        fontSize: '9px', fontWeight: 800,
        color: isPT ? 'transparent' : 'rgba(255,255,255,0.8)',
        transition: 'color 0.2s', letterSpacing: '0.06em'
      }}>PT</span>
      <span style={{
        position: 'absolute', right: '13px',
        fontSize: '9px', fontWeight: 800,
        color: isPT ? 'rgba(255,255,255,0.8)' : 'transparent',
        transition: 'color 0.2s', letterSpacing: '0.06em'
      }}>EN</span>
    </button>
  );
}
