import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/hooks/useStore";
import { AppHeader } from "@/components/lume/AppHeader";
import { toast } from "sonner";
import {
  ShieldAlert,
  Moon,
  Award,
  Flame,
  Coins,
  ArrowLeft,
  ArrowRight,
} from "@/components/lume/CustomIcons";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

function ShopPage() {
  const { interfaceLanguage, lumes, setLumes } = useStore();

  const isPT = interfaceLanguage === "pt";
  const isES = interfaceLanguage === "es";

  // Dynamic trilingual items
  const SHOP_ITEMS = [
    {
      id: "freeze",
      title: isPT ? "Congelamento de Ofensiva" : isES ? "Congelar Racha" : "Streak Freeze",
      desc: isPT
        ? "Mantenha sua ofensiva ativa mesmo se perder um dia de lições."
        : isES
          ? "Mantén tu racha activa aunque te saltes un día de lecciones."
          : "Keep your learning streak active even if you miss a day.",
      price: 50,
      color: "var(--brand)",
      icon: <Flame size={32} color="var(--brand)" />,
    },
    {
      id: "theme-dark",
      title: isPT ? "Tema Noite Estrelada" : isES ? "Tema Noche Estrellada" : "Starry Night Theme",
      desc: isPT
        ? "Um visual escuro exclusivo de alta sofisticação para o tutor IA."
        : isES
          ? "Una apariencia oscura exclusiva de alta sofisticación para tu tutor de IA."
          : "An exclusive high-end dark aesthetic for your AI language tutor.",
      price: 100,
      color: "#1B3A4B",
      icon: <Moon size={32} color="#1B3A4B" />,
    },
    {
      id: "avatar-crown",
      title: isPT ? "Coroa de Avatar Real" : isES ? "Corona de Avatar Real" : "Royal Avatar Crown",
      desc: isPT
        ? "Destaque-se na liga com uma aura e coroa dourada no perfil."
        : isES
          ? "Destaca en la liga con una corona y aura dorada en tu perfil."
          : "Stand out in the community with a gold-gilded crown framing your avatar.",
      price: 200,
      color: "#C9A84C",
      icon: <Award size={32} color="#C9A84C" />,
    },
    {
      id: "bonus-xp",
      title: isPT ? "Poção de XP Duplo" : isES ? "Poción de XP Doble" : "Double XP Elixir",
      desc: isPT
        ? "Dobre todos os pontos obtidos em lições e quizzes nos próximos 30 minutos."
        : isES
          ? "Duplica los puntos obtenidos en lecciones y pruebas durante los próximos 30 minutos."
          : "Earn double experience points from all lessons and games for the next 30 minutes.",
      price: 150,
      color: "var(--accent-terra)",
      icon: <Coins size={32} color="var(--accent-terra)" />,
    },
  ];

  const handleBuy = (itemId: string, price: number, name: string) => {
    if (lumes >= price) {
      setLumes(lumes - price);
      toast.success(
        isPT
          ? `Você comprou "${name}"! Aproveite!`
          : isES
            ? `¡Has comprado "${name}"! ¡Disfrútalo!`
            : `Successfully purchased "${name}"! Enjoy!`,
      );
    } else {
      toast.error(
        isPT
          ? "Lumes insuficientes para esta transação."
          : isES
            ? "No tienes suficientes Lumes para esta compra."
            : "Insufficient Lumes to complete this purchase.",
      );
    }
  };

  const t = {
    title: isPT ? "Boutique Lume" : isES ? "Boutique Lume" : "Lume Boutique",
    subtitle: isPT
      ? "Troque suas gemas conquistadas por itens de status e amplificadores cognitivos."
      : isES
        ? "Canjea tus gemas conseguidas por artículos de estatus y potenciadores cognitivos."
        : "Redeem your earned tokens for exclusive status cards and cognitive boosters.",
    currency: isPT ? "Seu Saldo" : isES ? "Tu Saldo" : "Your Balance",
    backPlay: isPT ? "Voltar ao Hub" : isES ? "Volver al Hub" : "Back to Play",
    buyFor: isPT ? "Adquirir por" : isES ? "Adquirir por" : "Buy for",
    lumesUnit: "Lumes",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "40px" }}>
      <AppHeader />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 24px",
          animation: "pageEnter 0.5s ease",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Back navigation */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link
            to="/play"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "99px",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              transition: "all 0.2s",
            }}
          >
            <ArrowLeft size={14} />
            {t.backPlay}
          </Link>
        </div>

        {/* Header section */}
        <header
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--accent-terra)",
              }}
            >
              EXCLUSIVE UPGRADES
            </span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "38px",
                color: "var(--text-primary)",
                fontWeight: 800,
                marginTop: "4px",
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
                maxWidth: "580px",
                margin: "6px auto 0",
                lineHeight: 1.5,
              }}
            >
              {t.subtitle}
            </p>
          </div>

          {/* Golden Lumes counter with glowing status */}
          <div
            className="glass"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "var(--surface-raised)",
              padding: "12px 28px",
              borderRadius: "99px",
              border: "1.5px solid var(--border)",
              boxShadow: "0 4px 20px rgba(201,168,76,0.1)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(201,168,76,0.1)",
                color: "#C9A84C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✨
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.currency}
              </span>
              <span
                style={{ fontWeight: 800, fontSize: "18px", color: "#C9A84C", lineHeight: 1.1 }}
              >
                {lumes} {t.lumesUnit}
              </span>
            </div>
          </div>
        </header>

        {/* Shop Items Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {SHOP_ITEMS.map((item) => {
            const canBuy = lumes >= item.price;
            return (
              <div
                key={item.id}
                className="glass premium-shadow hover-lift"
                style={{
                  background: "var(--surface-raised)",
                  borderRadius: "28px",
                  padding: "32px 28px",
                  border: "1.5px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Product Icon Box */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "20px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                  }}
                >
                  {item.icon}
                </div>

                {/* Info Text */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: "0 0 6px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "13.5px",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Price tag & Purchase button */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() => handleBuy(item.id, item.price, item.title)}
                    disabled={!canBuy}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "14px",
                      background: canBuy ? "var(--brand)" : "var(--border)",
                      color: canBuy ? "white" : "var(--text-secondary)",
                      border: "none",
                      cursor: canBuy ? "pointer" : "not-allowed",
                      fontWeight: 800,
                      fontSize: "14px",
                      transition: "all 0.2s",
                      boxShadow: canBuy ? "0 4px 12px rgba(45,74,62,0.15)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>
                      {t.buyFor} {item.price} Lumes
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
