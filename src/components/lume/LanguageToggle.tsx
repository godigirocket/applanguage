import { useStore } from "@/hooks/useStore";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function LanguageToggle() {
  const { user } = useAuth();
  const { interfaceLanguage, setInterfaceLanguage } = useStore();

  const changeLanguage = async (next: "pt" | "en" | "es") => {
    setInterfaceLanguage(next);
    localStorage.setItem("lume_interface_language", next);
    if (user) {
      await supabase
        .from("profiles")
        .update({ interface_language: next } as any)
        .eq("id", user.id);
    }
    toast.success(
      next === "pt"
        ? "Idioma alterado para Português"
        : next === "en"
          ? "Switched to English"
          : "Cambiado a Español",
      {
        duration: 1200,
        style: {
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1.5px solid var(--border)",
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          fontWeight: 700,
          borderRadius: "99px",
          padding: "8px 16px",
        },
      },
    );
  };

  return (
    <div
      style={{
        display: "inline-flex",
        gap: "4px",
        alignItems: "center",
        background: "var(--bg-secondary)",
        padding: "4px",
        borderRadius: "12px",
        border: "1.5px solid var(--border)",
      }}
    >
      {(["pt", "en", "es"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 800,
            cursor: "pointer",
            border: "none",
            background: interfaceLanguage === lang ? "var(--brand)" : "transparent",
            color: interfaceLanguage === lang ? "var(--bg-secondary)" : "var(--text-secondary)",
            transition: "all 0.2s",
          }}
          className="hover:scale-105 active:scale-95"
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
