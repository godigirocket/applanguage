export function validPushSubscription(
  value: unknown,
): value is { endpoint: string; keys: { p256dh: string; auth: string } } {
  if (!value || typeof value !== "object") return false;
  const s = value as any;
  if (
    typeof s.endpoint !== "string" ||
    s.endpoint.length > 2048 ||
    !s.keys ||
    typeof s.keys.p256dh !== "string" ||
    typeof s.keys.auth !== "string"
  )
    return false;
  try {
    const u = new URL(s.endpoint);
    const trusted =
      u.hostname === "fcm.googleapis.com" ||
      u.hostname === "updates.push.services.mozilla.com" ||
      u.hostname.endsWith(".push.services.mozilla.com") ||
      u.hostname === "web.push.apple.com" ||
      u.hostname.endsWith(".notify.windows.com");
    return (
      trusted &&
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      (!u.port || u.port === "443") &&
      /^[A-Za-z0-9_-]{80,100}$/.test(s.keys.p256dh) &&
      /^[A-Za-z0-9_-]{20,30}$/.test(s.keys.auth)
    );
  } catch {
    return false;
  }
}
export function reminderText(language: string) {
  return language === "es"
    ? {
        title: "Un pequeño paso hoy",
        body: "Tu próxima lección te espera. Practica un poco y continúa tu camino.",
      }
    : language === "en"
      ? {
          title: "One small step today",
          body: "Your next lesson is waiting. Practice a little and keep your journey going.",
        }
      : {
          title: "Um pequeno passo hoje",
          body: "Sua próxima lição está esperando. Pratique um pouco e continue sua jornada.",
        };
}
