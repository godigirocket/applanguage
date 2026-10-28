/* Receives server-scheduled reminders even when no app window is open. */
self.addEventListener("push", (event) => {
  let payload;
  try {
    payload = event.data?.json();
  } catch {
    return;
  }
  if (!payload || typeof payload.title !== "string" || typeof payload.body !== "string") return;
  event.waitUntil(
    self.registration.showNotification(payload.title.slice(0, 100), {
      body: payload.body.slice(0, 300),
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: "lume-daily-practice",
      data: { url: "/home" },
    }),
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const target = windows.find((c) => new URL(c.url).origin === self.location.origin);
      if (target) {
        await target.navigate("/home");
        return target.focus();
      }
      return self.clients.openWindow("/home");
    })(),
  );
});
