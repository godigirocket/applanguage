import { uiFallback } from "@/i18n/ui-fallback";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  CharacterCelebrating,
  CharacterRunner,
  CharacterThinking,
  CharacterReading,
  CharacterSpeaking,
  CharacterWaving,
} from "@/components/lume/LumeCharacters";

interface Player {
  id: string;
  name: string;
  xp: number;
  isCurrentUser: boolean;
  avatarColor: string;
  avatarUrl?: string | null;
  character: "celebrating" | "runner" | "thinking" | "reading" | "speaking" | "waving";
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#ff7a45,#4A7A6A)",
  "linear-gradient(135deg,#FF6B35,#C4714A)",
  "linear-gradient(135deg,#2f80ed,#3B7A8C)",
  "linear-gradient(135deg,#7B4FB0,#A97AE8)",
  "linear-gradient(135deg,#2E4BC4,#6080E8)",
  "linear-gradient(135deg,#D49E3B,#F3C66F)",
  "linear-gradient(135deg,#C44A4A,#E87A7A)",
  "linear-gradient(135deg,#1B6B4B,#3B9B7B)",
];
const CHARACTERS: Player["character"][] = [
  "celebrating",
  "runner",
  "thinking",
  "reading",
  "speaking",
  "waving",
];

// Cosmetic-only, deterministic per user id so the same person always gets
// the same avatar color/pose — not a claim about who they are, just style.
function hashPick<T>(id: string, options: T[]): T {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return options[hash % options.length];
}

interface LeaderboardRow {
  id: string;
  full_name: string | null;
  xp: number;
  avatar_url: string | null;
}

// Never present fixture accounts as members of the community. This remains a
// client guard for existing databases; the matching database function is also
// updated in the accompanying migration.
const SEED_NAME_PATTERN = /(?:^|\s)(?:lume|langlume)\s*(?:demo|test)|^(?:demo|test|placeholder)(?:\s|$)/i;

function visibleAvatar(url: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}

export function Leaderboard() {
  const { xp, interfaceLanguage } = useStore();
  const { user } = useAuth();
  const isPT = interfaceLanguage === "pt";
  const [players, setPlayers] = useState<Player[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.rpc("get_leaderboard", { limit_count: 20 }).then(({ data, error }) => {
      if (cancelled) return;
      // A fetch error is represented honestly as an empty community list.
      const rows: LeaderboardRow[] = error
        ? []
        : (data || []).filter(
            (row: LeaderboardRow) =>
              !row.full_name || !SEED_NAME_PATTERN.test(row.full_name),
          );
      const mapped: Player[] = rows.map((row) => ({
        id: row.id,
        name: row.full_name || (isPT ? "Estudante" : uiFallback("Learner")),
        xp: row.xp,
        isCurrentUser: user?.id === row.id,
        avatarColor: hashPick(row.id, AVATAR_COLORS),
        avatarUrl: visibleAvatar(row.avatar_url),
        character: hashPick(row.id, CHARACTERS),
      }));

      // The logged-in user might not be in the top 20 (or might have 0 XP,
      // which get_leaderboard excludes) — show them anyway, using the XP
      // already known client-side, so they always see where they stand.
      if (user && !mapped.some((p) => p.isCurrentUser)) {
        mapped.push({
          id: user.id,
          name: isPT ? "Você" : uiFallback("You"),
          xp,
          isCurrentUser: true,
          avatarColor: hashPick(user.id, AVATAR_COLORS),
          avatarUrl: null,
          character: hashPick(user.id, CHARACTERS),
        });
      }
      setPlayers(mapped.sort((a, b) => b.xp - a.xp));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Keep the current user's row's XP live as they earn more this session,
  // without waiting for a re-fetch of the whole leaderboard.
  useEffect(() => {
    setPlayers((prev) =>
      prev
        ? prev.map((p) => (p.isCurrentUser ? { ...p, xp } : p)).sort((a, b) => b.xp - a.xp)
        : prev,
    );
  }, [xp]);

  const getRankBadge = (rank: number) => {
    const badges: Record<number, { bg: string; icon: React.ReactNode; glow: string }> = {
      1: {
        bg: "linear-gradient(135deg,#FFD700,#FFA500)",
        icon: <Trophy size={16} color="#FFF" fill="#FFF" />,
        glow: "0 4px 16px rgba(255,215,0,0.4)",
      },
      2: {
        bg: "linear-gradient(135deg,#C0C0C0,#A8A8A8)",
        icon: <Trophy size={14} color="#FFF" />,
        glow: "0 4px 16px rgba(192,192,192,0.3)",
      },
      3: {
        bg: "linear-gradient(135deg,#CD7F32,#B87333)",
        icon: <Award size={14} color="#FFF" />,
        glow: "0 4px 16px rgba(205,127,50,0.3)",
      },
    };
    if (badges[rank]) {
      return (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: badges[rank].bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: badges[rank].glow,
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          {badges[rank].icon}
        </div>
      );
    }
    return (
      <span
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "var(--text-secondary)",
          width: "28px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {rank}
      </span>
    );
  };

  const getCharacterComponent = (character: Player["character"], size = 48) => {
    const components = {
      celebrating: CharacterCelebrating,
      runner: CharacterRunner,
      thinking: CharacterThinking,
      reading: CharacterReading,
      speaking: CharacterSpeaking,
      waving: CharacterWaving,
    };
    const Component = components[character];
    return <Component size={size} />;
  };

  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "28px",
        border: "1.5px solid var(--border)",
        padding: "28px",
        width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: 0,
          }}
        >
          <Trophy size={24} color="#D4A23B" />
          <span>{isPT ? "Ranking da comunidade" : uiFallback("Community ranking")}</span>
        </h3>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isPT ? "XP acumulado" : uiFallback("Total XP")}
        </span>
      </div>

      {players === null && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          {isPT ? "Carregando ranking..." : uiFallback("Loading leaderboard...")}
        </p>
      )}

      {players !== null && players.length === 0 && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          {isPT
            ? "Ninguém pontuou ainda esta semana. Seja o primeiro!"
            : uiFallback("No one has scored yet this week. Be the first!")}
        </p>
      )}

      {players !== null && players.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "480px",
            overflowY: "auto",
          }}
          className="no-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: "16px",
                    background: player.isCurrentUser ? "rgba(255,122,69,0.09)" : "var(--bg)",
                    border: "2px solid",
                    borderColor: player.isCurrentUser ? "var(--brand)" : "var(--border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getRankBadge(rank)}
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        background: player.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {player.avatarUrl ? (
                        <img src={player.avatarUrl} alt="" width="42" height="42" style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
                      ) : getCharacterComponent(player.character, 28)}
                    </div>
                    <span
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 800,
                        color: player.isCurrentUser ? "var(--brand)" : "var(--text-primary)",
                      }}
                    >
                      {player.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 900,
                      color: isTop3 ? "#D4A23B" : "var(--text-primary)",
                    }}
                  >
                    {player.xp.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
