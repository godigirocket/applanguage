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

export function Leaderboard() {
  const { xp, interfaceLanguage } = useStore();
  const { user } = useAuth();
  const isPT = interfaceLanguage === "pt";
  const [players, setPlayers] = useState<Player[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .rpc("get_leaderboard", { limit_count: 20 })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setPlayers([]);
          return;
        }
        const rows: LeaderboardRow[] = data || [];
        const mapped: Player[] = rows.map((row) => ({
          id: row.id,
          name: row.full_name || (isPT ? "Estudante" : "Learner"),
          xp: row.xp,
          isCurrentUser: user?.id === row.id,
          avatarColor: hashPick(row.id, AVATAR_COLORS),
          character: hashPick(row.id, CHARACTERS),
        }));
        // The logged-in user might not be in the top 20 (or might have 0 XP,
        // which get_leaderboard excludes) — show them anyway, using the XP
        // already known client-side, so they always see where they stand.
        if (user && !mapped.some((p) => p.isCurrentUser)) {
          mapped.push({
            id: user.id,
            name: isPT ? "Você" : "You",
            xp,
            isCurrentUser: true,
            avatarColor: hashPick(user.id, AVATAR_COLORS),
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
      prev ? prev.map((p) => (p.isCurrentUser ? { ...p, xp } : p)).sort((a, b) => b.xp - a.xp) : prev,
    );
  }, [xp]);

  const getRankBadge = (rank: number) => {
    const badges: Record<number, { bg: string; icon: React.ReactNode; glow: string }> = {
      1: { bg: "linear-gradient(135deg,#FFD700,#FFA500)", icon: <Trophy size={16} color="#FFF" fill="#FFF" />, glow: "0 4px 16px rgba(255,215,0,0.4)" },
      2: { bg: "linear-gradient(135deg,#C0C0C0,#A8A8A8)", icon: <Trophy size={14} color="#FFF" />, glow: "0 4px 16px rgba(192,192,192,0.3)" },
      3: { bg: "linear-gradient(135deg,#CD7F32,#B87333)", icon: <Award size={14} color="#FFF" />, glow: "0 4px 16px rgba(205,127,50,0.3)" },
    };
    if (badges[rank]) {
      return (
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: badges[rank].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: badges[rank].glow, border: "2px solid rgba(255,255,255,0.3)" }}>
          {badges[rank].icon}
        </div>
      );
    }
    return <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-secondary)", width: "28px", textAlign: "center", flexShrink: 0 }}>{rank}</span>;
  };

  const getCharacterComponent = (character: Player["character"], size = 48) => {
    const components = { celebrating: CharacterCelebrating, runner: CharacterRunner, thinking: CharacterThinking, reading: CharacterReading, speaking: CharacterSpeaking, waving: CharacterWaving };
    const Component = components[character];
    return <Component size={size} />;
  };

  const daysLeft = 7 - new Date().getDay();

  return (
    <div style={{ background: "var(--surface-raised)", borderRadius: "28px", border: "1.5px solid var(--border)", padding: "28px", width: "100%", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
          <Trophy size={24} color="#D4A23B" />
          <span>{isPT ? "Liga Ouro" : "Gold League"}</span>
        </h3>
        <span style={{ fontSize: "11px", fontWeight: 800, color: "#FF6B35", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6B35", animation: "pulse 2s infinite" }} />
          {isPT ? `${daysLeft}d restantes` : `${daysLeft}d left`}
        </span>
      </div>

      {players === null && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", padding: "24px 0" }}>
          {isPT ? "Carregando ranking..." : "Loading leaderboard..."}
        </p>
      )}

      {players !== null && players.length === 0 && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", padding: "24px 0" }}>
          {isPT
            ? "Ninguém pontuou ainda esta semana. Seja o primeiro!"
            : "No one has scored yet this week. Be the first!"}
        </p>
      )}

      {players !== null && players.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "480px", overflowY: "auto" }} className="no-scrollbar">
          <AnimatePresence mode="popLayout">
            {players.map((player, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <motion.div key={player.id} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", background: player.isCurrentUser ? "rgba(255,122,69,0.09)" : "var(--bg)", border: "2px solid", borderColor: player.isCurrentUser ? "var(--brand)" : "var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getRankBadge(rank)}
                    <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: player.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.15)" }}>
                      {getCharacterComponent(player.character, 28)}
                    </div>
                    <span style={{ fontSize: "14.5px", fontWeight: 800, color: player.isCurrentUser ? "var(--brand)" : "var(--text-primary)" }}>
                      {player.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: 900, color: isTop3 ? "#D4A23B" : "var(--text-primary)" }}>
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
