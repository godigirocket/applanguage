import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAllLessonProgress } from "@/lib/lesson-progress";
import { localDay } from "@/hooks/useStore";
import { withTimeout } from "@/lib/promise-timeout";

export function ActivityCalendar({ userId }: { userId?: string }) {
  const [days, setDays] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!userId) return;
    let active = true;
    void Promise.all([
      getAllLessonProgress(userId),
      withTimeout(
        supabase.from("conversations").select("created_at").eq("student_id", userId),
        6000,
      ).catch(() => ({ data: [] })),
      withTimeout<{ data: Array<{ created_at: string }> | null }>(
        (supabase as any).from("learning_activity").select("created_at").eq("user_id", userId),
        6000,
      ).catch(() => ({ data: [] })),
    ]).then(([progress, chats, events]) => {
      if (!active) return;
      const timestamps = [
        ...progress
          .filter((p) => p.status === "completed")
          .map((p) => p.completed_at || p.updated_at),
        ...(chats.data || []).map((c) => c.created_at),
        ...(events.data || []).map((e: { created_at: string }) => e.created_at),
      ];
      setDays(new Set(timestamps.filter(Boolean).map((date) => localDay(new Date(date!)))));
    });
    return () => {
      active = false;
    };
  }, [userId]);
  const cells = Array.from({ length: 364 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 363 + index);
    return localDay(date);
  });
  return (
    <section
      className="lume-profile-activity"
      style={{
        padding: 24,
        border: "1px solid var(--border)",
        background: "var(--surface-raised)",
        borderRadius: 20,
        marginBottom: 40,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
        Atividade nos últimos 12 meses
      </h2>
      <div
        style={{ overflowX: "auto", paddingBottom: 8 }}
        tabIndex={0}
        aria-label="Calendário de atividade, deslize para ver todo o ano"
      >
        <div
          role="list"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7,12px)",
            gridAutoColumns: 12,
            gap: 4,
            width: "max-content",
          }}
        >
          {cells.map((day) => (
            <span
              role="listitem"
              key={day}
              aria-label={`${day}: ${days.has(day) ? "prática registrada" : "sem prática registrada"}`}
              title={`${day}: ${days.has(day) ? "prática registrada" : "sem prática registrada"}`}
              style={{
                borderRadius: 3,
                background: days.has(day) ? "var(--brand)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
      <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>
        {cells.filter((day) => days.has(day)).length} dias com lições ou conversas registradas.
      </p>
    </section>
  );
}
