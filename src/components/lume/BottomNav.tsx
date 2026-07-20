import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { Home, BookOpen, Play, Globe, User, MessageCircle } from "lucide-react";

export function BottomNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const getNavLabel = (key: string, fallback: string) => {
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const NAV_ITEMS = [
    {
      href: "/home",
      label: getNavLabel(
        "navHome",
        i18n.language === "en" ? "Home" : i18n.language === "es" ? "Inicio" : "Início",
      ),
      Icon: Home,
    },
    {
      href: "/lessons",
      label: getNavLabel(
        "navLessons",
        i18n.language === "en" ? "Lessons" : i18n.language === "es" ? "Lecciones" : "Lições",
      ),
      Icon: BookOpen,
    },
    {
      href: "/community",
      label: getNavLabel(
        "navCommunity",
        i18n.language === "en" ? "Community" : i18n.language === "es" ? "Comunidad" : "Comunidade",
      ),
      Icon: MessageCircle,
    },
    {
      href: "/games",
      label: getNavLabel(
        "navPlay",
        i18n.language === "en" ? "Play" : i18n.language === "es" ? "Jugar" : "Jogar",
      ),
      Icon: Play,
    },
    {
      href: "/profile",
      label: getNavLabel(
        "navProfile",
        i18n.language === "en" ? "Profile" : i18n.language === "es" ? "Perfil" : "Perfil",
      ),
      Icon: User,
    },
  ];

  if (!user) return null;

  return (
    <nav
      className="lume-mobile-tabs"
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "var(--surface-raised)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "stretch",
        height: "60px",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -2px 20px rgba(0,0,0,0.05)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = currentPath === href || (href !== "/home" && currentPath.startsWith(href));
        return (
          <Link
            key={href}
            to={href as any}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              textDecoration: "none",
              color: active ? "var(--brand)" : "var(--text-secondary)",
              fontSize: "10px",
              fontWeight: active ? 800 : 600,
              letterSpacing: "0.02em",
              transition: "color 0.15s ease, transform 0.15s ease",
              padding: "8px 4px 6px",
              position: "relative",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              transform: active ? "scale(1)" : "scale(0.95)",
            }}
          >
            {active && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "25%",
                  right: "25%",
                  height: "3px",
                  borderRadius: "0 0 6px 6px",
                  background: "var(--brand)",
                  transition: "all 0.2s ease",
                }}
              />
            )}
            <Icon />
            <span style={{ lineHeight: 1, whiteSpace: "nowrap" }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
