import { Cloud, RefreshCw } from "lucide-react";
import { useSyncStatus } from "@/lib/sync-status";
export function SyncSettings({ ui }: { ui: "pt" | "en" | "es" }) {
  const status = useSyncStatus();
  const t = (pt: string, en: string, es: string) => (ui === "pt" ? pt : ui === "es" ? es : en);
  const labels = {
    waiting: t("Preparando sua conta", "Preparing your account", "Preparando tu cuenta"),
    syncing: t("Salvando na sua conta…", "Saving to your account…", "Guardando en tu cuenta…"),
    synced: t("Dados sincronizados", "Data synced", "Datos sincronizados"),
    offline: t(
      "Sem conexão · dados salvos neste aparelho",
      "Offline · saved on this device",
      "Sin conexión · guardado en este dispositivo",
    ),
    error: t(
      "Sincronização pendente · tente novamente",
      "Sync pending · try again",
      "Sincronización pendiente · inténtalo de nuevo",
    ),
  };
  return (
    <section className="lume-preferences-card">
      <div className="voice-settings-heading">
        <Cloud size={22} />
        <h2>
          {t(
            "Continue em qualquer tela",
            "Continue on another screen",
            "Continúa en otra pantalla",
          )}
        </h2>
      </div>
      <p>
        {t(
          "O histórico de quizzes, as palavras salvas e a agenda de revisão acompanham sua conta. Sem conexão, você continua praticando e o envio é retomado quando voltar.",
          "Quiz history, saved words and review schedules follow your account. Keep practicing offline; syncing resumes when you reconnect.",
          "El historial de quizzes, las palabras guardadas y los repasos acompañan tu cuenta. Sigue practicando sin conexión; se sincronizará cuando vuelvas.",
        )}
      </p>
      <p role="status" className={`sync-status sync-${status}`}>
        {labels[status]}
      </p>
      <button
        className="voice-preview"
        disabled={status === "syncing"}
        onClick={() => window.dispatchEvent(new Event("lume-learning-sync-request"))}
      >
        <RefreshCw size={17} />
        {t("Sincronizar agora", "Sync now", "Sincronizar ahora")}
      </button>
    </section>
  );
}
