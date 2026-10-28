import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { enableReminders, disableReminders, getReminderState } from "@/lib/push-client";
export function ReminderSettings({ ui }: { ui: "pt" | "en" | "es" }) {
  const t = (pt: string, en: string, es: string) => (ui === "pt" ? pt : ui === "es" ? es : en);
  const [state, setState] = useState({
      loading: true,
      supported: true,
      configured: false,
      enabled: false,
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    getReminderState()
      .then((s) => {
        if (active) setState({ loading: false, ...s });
      })
      .catch(() => {
        if (active)
          setState({ loading: false, supported: true, configured: false, enabled: false });
      });
    return () => {
      active = false;
    };
  }, []);
  const change = async () => {
    setBusy(true);
    setError("");
    try {
      if (state.enabled) await disableReminders();
      else await enableReminders(ui);
      setState((s) => ({ ...s, enabled: !s.enabled }));
    } catch (e) {
      setError(
        e instanceof Error && e.message === "permission"
          ? t(
              "As notificações estão bloqueadas. Libere o acesso nas configurações do navegador.",
              "Notifications are blocked. Allow them in your browser settings.",
              "Las notificaciones están bloqueadas. Permítelas en los ajustes del navegador.",
            )
          : t(
              "Não foi possível alterar o lembrete. Tente novamente com conexão.",
              "Could not change reminders. Try again while connected.",
              "No se pudo cambiar el recordatorio. Inténtalo con conexión.",
            ),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="lume-preferences-card">
      <div className="voice-settings-heading">
        <Bell size={22} />
        <h2>
          {t(
            "Um lembrete para continuar",
            "A reminder to keep going",
            "Un recordatorio para continuar",
          )}
        </h2>
      </div>
      <p>
        {t(
          "Receba um lembrete diário quando passar um dia sem praticar, mesmo com o app fechado. Você pode desativar quando quiser. A entrega depende da conexão e das permissões do aparelho.",
          "Get a daily reminder after a day without practice, even with the app closed. Turn it off whenever you want. Delivery depends on your connection and device permissions.",
          "Recibe un recordatorio diario tras un día sin practicar, incluso con la app cerrada. Desactívalo cuando quieras. La entrega depende de la conexión y los permisos del dispositivo.",
        )}
      </p>
      {!state.supported ? (
        <p>
          {t(
            "Para receber notificações no iPhone, adicione o Lume à tela inicial pelo Safari. Outros aparelhos precisam de um navegador compatível com notificações push.",
            "On iPhone, add Lume to your home screen from Safari. Other devices need a browser that supports push notifications.",
            "En iPhone, añade Lume a la pantalla de inicio desde Safari. Otros dispositivos necesitan un navegador compatible con notificaciones push.",
          )}
        </p>
      ) : (
        <>
          <p role="status">
            {state.loading
              ? t("Verificando…", "Checking…", "Comprobando…")
              : !state.configured
                ? t(
                    "Lembretes indisponíveis no momento.",
                    "Reminders are temporarily unavailable.",
                    "Recordatorios no disponibles por ahora.",
                  )
                : state.enabled
                  ? t(
                      "Lembrete ativado neste aparelho",
                      "Reminder enabled on this device",
                      "Recordatorio activado en este dispositivo",
                    )
                  : t("Lembrete desativado", "Reminder off", "Recordatorio desactivado")}
          </p>
          <button
            className="voice-preview"
            disabled={state.loading || !state.configured || busy}
            onClick={change}
          >
            {busy
              ? t("Salvando…", "Saving…", "Guardando…")
              : state.enabled
                ? t("Desativar lembrete", "Turn reminder off", "Desactivar recordatorio")
                : t("Ativar lembrete", "Turn reminder on", "Activar recordatorio")}
          </button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
