import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FlagBR, FlagUS, FlagES } from "./Flags";
import i18n from "@/i18n/config";

const TARGETS = [
  { code: "en" as const, label: "EN", name: "English", Flag: FlagUS },
  { code: "es" as const, label: "ES", name: "Español", Flag: FlagES },
  { code: "pt" as const, label: "PT", name: "Português", Flag: FlagBR },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { targetLanguage, setTargetLanguage, interfaceLanguage, setInterfaceLanguage } = useStore();
  const { user } = useAuth();

  const currentTarget = TARGETS.find((l) => l.code === targetLanguage) || TARGETS[0];

  const handleOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [handleOutside]);

  const handleSetTarget = async (code: "pt" | "en" | "es") => {
    setTargetLanguage(code);
    localStorage.setItem("lume_target_language", code);
    setOpen(false);
    if (user) {
      supabase
        .from("profiles")
        .update({ target_language: code } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error)
            console.warn("[LanguageSwitcher] Could not save target language:", error.message);
        });
    }
    window.dispatchEvent(new Event("language-changed"));
  };

  const handleSetInterface = async (code: "pt" | "en" | "es") => {
    setInterfaceLanguage(code);
    await i18n.changeLanguage(code);
    localStorage.setItem("lume_interface_language", code);
    setOpen(false);
    if (user) {
      supabase
        .from("profiles")
        .update({ language: code } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error)
            console.warn("[LanguageSwitcher] Could not save interface language:", error.message);
        });
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 150 }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        onTouchEnd={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "7px 11px",
          borderRadius: "12px",
          background: open ? "var(--brand)" : "var(--surface-raised)",
          border: `1.5px solid ${open ? "var(--brand)" : "var(--border)"}`,
          cursor: "pointer",
          transition: "all 0.18s",
          color: open ? "#fff" : "var(--text-secondary)",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
        aria-label="Language settings"
        aria-expanded={open}
      >
        <currentTarget.Flag size={20} />
        <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em" }}>
          {currentTarget.label}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            opacity: 0.7,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s",
          }}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--surface-raised)",
            border: "1.5px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
            minWidth: "220px",
            zIndex: 9999,
            animation: "fadeSlideDown 0.15s ease",
          }}
        >
          {/* Section 1: Target Language */}
          <div style={{ padding: "14px 16px 8px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Quero Aprender (Alvo)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {TARGETS.map(({ code, label, name, Flag }) => (
                <button
                  key={code}
                  onClick={() => handleSetTarget(code)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSetTarget(code);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: targetLanguage === code ? "rgba(255,122,69,0.08)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                  }}
                >
                  <Flag size={20} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: targetLanguage === code ? 800 : 600,
                      color: targetLanguage === code ? "var(--brand)" : "var(--text-primary)",
                      flex: 1,
                    }}
                  >
                    {name}
                  </span>
                  {targetLanguage === code && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l4 4 6-7"
                        stroke="var(--brand)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

          {/* Section 2: Interface Language */}
          <div style={{ padding: "8px 16px 14px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Idioma do App (Interface)
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {TARGETS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => handleSetInterface(code)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSetInterface(code);
                  }}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: "8px",
                    background: interfaceLanguage === code ? "var(--text-primary)" : "transparent",
                    color:
                      interfaceLanguage === code
                        ? "var(--surface-raised)"
                        : "var(--text-secondary)",
                    border: `1px solid ${interfaceLanguage === code ? "var(--text-primary)" : "var(--border)"}`,
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "center",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
