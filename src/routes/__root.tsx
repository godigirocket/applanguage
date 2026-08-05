import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/lib/auth";
import { safeGetProfile, safeUpsertProfile } from "@/lib/db";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { sounds } from "@/lib/soundEffects";
import { useStore } from "@/hooks/useStore";
import { useUserStore } from "@/store/userStore";
import "@/i18n/config";
import { Sentry } from "@/lib/sentry-client";
import i18n from "i18next";
import { AppHeader } from "@/components/lume/AppHeader";
import { BottomNav } from "@/components/lume/BottomNav";
import { Logo } from "@/components/lume/Logo";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { startTutorial } from "@/components/lume/Tutorial";
import { LevelSelectionModal } from "@/components/LevelSelectionModal";
import { DifficultyPopup } from "@/components/DifficultyPopup";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { requestNotificationPermission, scheduleStreakReminder, trackActivity } from "@/lib/notifications";
import { isTrialActive, getTrialRemainingFormatted } from "@/lib/trial";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center page-enter">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-3 text-muted-foreground">This page drifted away.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-5 py-2 rounded-full bg-primary text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  Sentry.captureException(error);
  const router = useRouter();

  useEffect(() => {
    const message = error?.message || "";
    const isChunkError =
      message.includes("Failed to fetch dynamically imported module") ||
      message.includes("dynamically imported module") ||
      message.includes("Failed to fetch") ||
      error?.name === "ChunkLoadError";

    if (isChunkError) {
      const lastReload = sessionStorage.getItem("last_chunk_error_reload");
      const now = Date.now();
      // Throttle reloads to once per 15 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
        sessionStorage.setItem("last_chunk_error_reload", now.toString());
        console.warn("Chunk load error detected! Reloading page to fetch latest assets...", error);
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something paused mid-sentence.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground"
          >
            Try again
          </button>
          <Link to="/" className="px-5 py-2 rounded-full border border-border">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5",
      },
      { title: "LumeLearn — Aprenda Inglês, Espanhol e Português com IA" },
      {
        name: "description",
        content:
          "Aprenda idiomas de forma inteligente com 700+ lições interativas, prática de conversação com IA e gamificação. Inglês, Espanhol e Português. Comece grátis.",
      },
      { property: "og:title", content: "LumeLearn — Aprenda Idiomas com IA e Gamificação" },
      {
        property: "og:description",
        content:
          "700+ lições interativas, 5 modos de jogo, 3 idiomas. Prática de conversação com IA que complementa suas aulas. Comece grátis.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "es_ES" },
      { property: "og:site_name", content: "LumeLearn" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LumeLearn — Aprenda Idiomas com IA" },
      {
        name: "twitter:description",
        content: "700+ lições, 3 idiomas, 5 modos de jogo. Comece grátis.",
      },
      { name: "twitter:image", content: "https://langlume.vercel.app/og-image.svg" },
      { property: "og:image", content: "https://langlume.vercel.app/og-image.svg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "theme-color", content: "#ff7a45" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "LumeLearn" },
      {
        name: "keywords",
        content:
          "aprender inglês, aprender espanhol, aprender português, IA, gamificação, lições interativas, conversação",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
        as: "style",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint — without this, the
            page always renders light-theme CSS first (the default with no
            data-theme attribute) and only flips to the user's actual dark
            preference once React hydrates and the theme useEffect runs,
            causing a visible flash on every load. A blocking inline script
            is the standard fix (same approach Next.js/Tailwind docs use). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lume_theme')||'light';if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootInner />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootInner() {
  const { user } = useAuth();
  const interfaceLanguage = useStore((state) => state.interfaceLanguage);
  const { isLocked, setIsLocked, pinCode, pinEnabled, learningLevel, setLearningLevel } =
    useStore();
  const { userLevel, setUserLevel } = useUserStore();

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [storeHydrated, setStoreHydrated] = useState(false);

  // Monitor async store hydration
  useEffect(() => {
    const checkHydration = () => {
      const hasHydrated = useStore.persist.hasHydrated();
      setStoreHydrated(hasHydrated);
    };

    checkHydration();

    const unsub = useStore.persist.onHydrate(() => setStoreHydrated(false));
    const unsub2 = useStore.persist.onFinishHydration(() => setStoreHydrated(true));

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthOrLanding =
    currentPath === "/" ||
    currentPath === "/login" ||
    currentPath === "/signup" ||
    currentPath === "/onboarding" ||
    currentPath === "/pricing" ||
    currentPath === "/checkout" ||
    currentPath === "/produto" ||
    currentPath === "/como-usar" ||
    currentPath === "/entrega" ||
    currentPath === "/rastrear-pedido" ||
    currentPath === "/faq" ||
    currentPath === "/contato" ||
    currentPath === "/privacidade" ||
    currentPath === "/trocas-e-devolucoes" ||
    currentPath === "/terms" ||
    currentPath === "/support" ||
    currentPath === "/refund" ||
    currentPath === "/forgot-password" ||
    currentPath === "/success" ||
    currentPath === "/cancel";
  const isImmersive =
    currentPath.startsWith("/quiz") ||
    currentPath === "/hangman" ||
    currentPath === "/memory" ||
    currentPath.startsWith("/conversation") ||
    currentPath === "/setup" ||
    currentPath.startsWith("/quiz-play") ||
    currentPath.startsWith("/play/") ||
    currentPath.startsWith("/lesson/");

  // Synchronize user level from Supabase DB on auth load
  useEffect(() => {
    if (!user || !storeHydrated) return;
    (async () => {
      try {
        const data = await safeGetProfile(user.id);
        if (data && data.level) {
          let matched = data.level;
          if (matched === "beginner") matched = "A1";
          else if (matched === "intermediate") matched = "B1";
          else if (matched === "advanced") matched = "C1";
          const valid = ["A1", "A2", "B1", "B2", "C1", "C2"];
          if (valid.includes(matched)) {
            setUserLevel(matched as any);
            setLearningLevel(matched);
          }
        } else if (userLevel) {
          // If profile level not in DB but we have one locally, upsert it
          await safeUpsertProfile(user.id, { level: userLevel });
        }
      } catch (e) {
        console.error("Error loading level:", e);
      }
    })();
  }, [user, storeHydrated, userLevel, setUserLevel, setLearningLevel]);

  // Synchronize stores if they deviate
  useEffect(() => {
    if (!storeHydrated) return;
    if (learningLevel && !userLevel) {
      setUserLevel(learningLevel as any);
    } else if (userLevel && !learningLevel) {
      setLearningLevel(userLevel);
    }
  }, [storeHydrated, learningLevel, userLevel, setLearningLevel, setUserLevel]);

  useEffect(() => {
    if (interfaceLanguage) {
      i18n.changeLanguage(interfaceLanguage);
    }
  }, [interfaceLanguage]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("lume_theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) return; // Don't show tutorial for non-logged users
    const tutorialShown = localStorage.getItem("tutorial_shown");
    if (!tutorialShown) {
      setTimeout(() => startTutorial(), 500);
      localStorage.setItem("tutorial_shown", "true");
    }
  }, [user]);

  // Track user activity and schedule streak reminders
  useEffect(() => {
    if (!user) return;
    trackActivity();
    // Request notification permission after user has completed at least 1 lesson
    const completed = localStorage.getItem("lume-storage");
    if (completed && completed.includes("completedLessons")) {
      requestNotificationPermission().then(() => {
        scheduleStreakReminder();
      });
    }
  }, [user]);

  // PWA Service Worker — handled by vite-plugin-pwa with registerType: "autoUpdate"
  // No manual registration needed; the plugin injects its own register script.

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("lume-card") ||
        target.closest(".lume-card")
      ) {
        sounds.playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // 30-minute inactivity timeout
  useEffect(() => {
    if (typeof window === "undefined" || !pinEnabled) return;
    let timer: any;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
      }, 1800000); // 30 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [setIsLocked, pinEnabled]);

  const handlePinSubmit = (val: string) => {
    if (val === pinCode) {
      setIsLocked(false);
      setPinInput("");
      setPinError(false);
      toast.success("Bem-vindo de volta!");
    } else {
      setPinError(true);
      setPinInput("");
      sounds.playClick(); // Play a generic click sound or feedback
      toast.error("PIN incorreto. Tente novamente.");
    }
  };

  const handleKeypadPress = (num: string) => {
    setPinError(false);
    if (num === "clear") {
      setPinInput("");
    } else if (num === "back") {
      setPinInput((prev) => prev.slice(0, -1));
    } else {
      if (pinInput.length < 4) {
        const next = pinInput + num;
        setPinInput(next);
        if (next.length === 4) {
          handlePinSubmit(next);
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        boxSizing: "border-box",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      {/* Skip to content link for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Main Content Area */}
      <div
        id="main-content"
        role="main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {isAuthOrLanding || isImmersive || currentPath === "/guide" ? (
          <Outlet />
        ) : (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        )}
      </div>
      {!isAuthOrLanding && !isImmersive && (
        <>
          <div className="lume-bottom-spacer" />
          <BottomNav />
        </>
      )}

      {/* Level Selection Modal — only show if user is logged in AND has no level set */}
      {!isAuthOrLanding && user && !userLevel && !learningLevel && <LevelSelectionModal />}
      {!isAuthOrLanding && user && <DifficultyPopup />}

      {/* Global Toaster */}
      <Toaster position="bottom-right" richColors />

      {/* Vercel Analytics */}
      <Analytics />

      {/* Inactivity Glassmorphic Lockscreen */}
      {isLocked && pinEnabled && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(28,28,26,0.7)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            className="glass premium-shadow"
            style={{
              padding: "40px",
              borderRadius: "32px",
              maxWidth: "380px",
              width: "90%",
              textAlign: "center",
              border: "1.5px solid var(--border)",
              background: "var(--surface-raised)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 8px 24px color-mix(in srgb, var(--brand) 25%, transparent)",
              }}
            >
              <Logo size={42} withText={false} />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                marginBottom: "8px",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Lume Bloqueado
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                marginBottom: "32px",
                fontWeight: 600,
              }}
            >
              Por segurança, o Lume foi bloqueado por inatividade. Digite o PIN de 4 dígitos.
            </p>

            {/* PIN Indicators */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "2px solid var(--border)",
                    background: pinInput.length > i ? "var(--accent)" : "transparent",
                    boxShadow: pinInput.length > i ? "0 0 12px var(--accent)" : "none",
                    transform: pinError ? "scale(1.1)" : "none",
                    transition: "all 0.15s",
                  }}
                />
              ))}
            </div>

            {/* Keypad */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                maxWidth: "280px",
                margin: "0 auto",
              }}
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map((key) => {
                const isControl = key === "clear" || key === "back";
                return (
                  <button
                    key={key}
                    onClick={() => handleKeypadPress(key)}
                    style={{
                      height: "52px",
                      borderRadius: "16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: isControl ? "11px" : "18px",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.12s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textTransform: "uppercase",
                      letterSpacing: isControl ? "0.05em" : "none",
                    }}
                    onMouseDown={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = "scale(0.95)";
                      target.style.background = "var(--border)";
                    }}
                    onMouseUp={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = "none";
                      target.style.background = "var(--surface)";
                    }}
                  >
                    {key === "back" ? "←" : key === "clear" ? "Limpar" : key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
