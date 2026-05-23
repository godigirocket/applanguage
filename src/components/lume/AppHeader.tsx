import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/lume/Logo";
import { Sun, Moon } from "@/components/lume/CustomIcons";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/lume/LanguageSwitcher";

// Mobile bottom-tab nav icons as inline SVG for zero dependency
function IconHome() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}
function IconPlay() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function AppHeader({
  hideMobileTabs = false,
  isGlobal = false,
}: { hideMobileTabs?: boolean; isGlobal?: boolean } = {}) {
  // If this is a child render and the global header is already active, render nothing.
  if (!isGlobal && typeof window !== "undefined" && (window as any).__lumeGlobalHeaderMounted) {
    return null;
  }

  // Set the global mount flag
  if (isGlobal && typeof window !== "undefined") {
    (window as any).__lumeGlobalHeaderMounted = true;
  }
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { t } = useTranslation(["common"]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    try {
      return (localStorage.getItem("lume_theme") || "light") as "light" | "dark";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name, onboarding_done")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user]);

  const firstName = profile?.full_name?.split(" ")[0] || "";

  const NAV_ITEMS = [
    { href: "/home", label: t("practice"), Icon: IconHome },
    { href: "/lessons", label: t("lessons"), Icon: IconBook },
    { href: "/play", label: t("play"), Icon: IconPlay },
    { href: "/culture", label: "Cultura", Icon: IconGlobe },
    { href: "/profile", label: "Perfil", Icon: IconUser },
  ];

  const isLoggedIn = user && profile?.onboarding_done;

  return (
    <>
      {/* ── TOP HEADER ─────────────────────────────────────────── */}
      <header
        style={{
          position: "relative",
          zIndex: 100,
          background: "var(--surface-raised)",
          borderBottom: "1.5px solid var(--border)",
          height: "58px",
          boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "0 16px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          {/* LOGO */}
          <Link
            to="/home"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <Logo size={46} />
          </Link>

          {/* DESKTOP NAV — hidden on mobile */}
          {isLoggedIn && (
            <nav className="lume-desktop-nav">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href as any}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: currentPath === item.href ? "var(--brand)" : "var(--text-secondary)",
                    background: currentPath === item.href ? "rgba(45,74,62,0.08)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.18s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* RIGHT CONTROLS */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const next = theme === "light" ? "dark" : "light";
                setTheme(next);
                localStorage.setItem("lume_theme", next);
              }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--surface-raised)",
                border: "1.5px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              title={t("themeToggle")}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Avatar — desktop only */}
            {user ? (
              <Link
                to="/profile"
                className="lume-desktop-only"
                style={{ textDecoration: "none", flexShrink: 0 }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--brand), var(--accent-teal))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {firstName ? firstName[0].toUpperCase() : "L"}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: "7px 16px",
                  borderRadius: "99px",
                  background: "var(--brand)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s",
                }}
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
