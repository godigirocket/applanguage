import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/index/minimal")({
  component: MinimalLanding,
});

function MinimalLanding() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "#F7F4EF",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ textAlign: "center", maxWidth: "600px", padding: "40px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "20px", color: "#1C1C1A" }}>
          Lume
        </h1>
        <p style={{ fontSize: "18px", color: "#6B6B63", marginBottom: "40px" }}>
          Um parceiro de conversação paciente, calmo e artístico.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a 
            href="/signup" 
            style={{
              padding: "16px 32px",
              background: "#2D4A3E",
              color: "white",
              textDecoration: "none",
              borderRadius: "99px",
              fontWeight: "700"
            }}
          >
            Começar
          </a>
          <a 
            href="/login" 
            style={{
              padding: "16px 32px",
              background: "white",
              color: "#2D4A3E",
              textDecoration: "none",
              borderRadius: "99px",
              fontWeight: "700",
              border: "2px solid #2D4A3E"
            }}
          >
            Entrar
          </a>
        </div>
        <p style={{ marginTop: "60px", fontSize: "14px", color: "#A8A8A0" }}>
          🔧 Modo de depuração SSR ativado
        </p>
      </div>
    </div>
  );
}
