import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("lume_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lume_theme", "dark");
      toast.success("Modo escuro ativado");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lume_theme", "light");
      toast.success("Modo claro ativado");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        width: '42px', height: '40px',
        borderRadius: '50%',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        border: '1.5px solid var(--border)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0',
        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
      className="hover:scale-110 active:scale-95 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#2D4A3E]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12 flex items-center justify-center">
        {isDark ? (
          <Moon size={18} className="text-[#DDC06E]" />
        ) : (
          <Sun size={18} className="text-[#2D4A3E]" />
        )}
      </span>
    </button>
  );
}
