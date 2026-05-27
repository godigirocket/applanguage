import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";
import { Home, BookOpen, Play, Globe, User } from "lucide-react";

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
      href: "/games",
      label: getNavLabel(
        "navPlay",
        i18n.language === "en" ? "Play" : i18n.language === "es" ? "Jugar" : "Jogar",
      ),
      Icon: Play,
    },
    {
      href: "/culture",
      label: getNavLabel(
        "navCulture",
        i18n.language === "en" ? "Culture" : i18n.language === "es" ? "Cultura" : "Cultura",
      ),
      Icon: Globe,
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
      className="lume-mobile-tabs glass"
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
        height: "56px",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = currentPath === href || (href !== "/home" && currentPath.startsWith(href));
        return (
          <Link
            key={href}
            to={href as any}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              textDecoration: "none",
              color: active ? "var(--brand)" : "var(--text-secondary)",
              fontSize: "10px",
              fontWeight: active ? 800 : 600,
              letterSpacing: "0.02em",
              transition: "all 0.18s",
              padding: "6px 4px 4px",
              position: "relative",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            {active && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: "2.5px",
                  borderRadius: "0 0 4px 4px",
                  background: "var(--brand)",
                }}
              />
            )}
            <Icon />
            <span style={{ lineHeight: 1 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
