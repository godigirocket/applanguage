import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";

interface Player {
  id: string;
  name: string;
  xp: number;
  delta: number;
  isCurrentUser: boolean;
  avatarColor: string;
  flag: string;
}

const BASE_PLAYERS: Omit<Player, "delta">[] = [
  { id: "u",  name: "Você",         xp: 450,  isCurrentUser: true,  avatarColor: "linear-gradient(135deg,#2D4A3E,#4A7A6A)", flag: "🇧🇷" },
  { id: "2",  name: "Ana Silva",    xp: 920,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#FF6B35,#C4714A)", flag: "🇧🇷" },
  { id: "3",  name: "Carlos M.",    xp: 870,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B3A4B,#3B7A8C)", flag: "🇵🇹" },
  { id: "4",  name: "Priya K.",     xp: 810,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#7B4FB0,#A97AE8)", flag: "🇮🇳" },
  { id: "5",  name: "Lena W.",      xp: 760,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#2E4BC4,#6080E8)", flag: "🇩🇪" },
  { id: "6",  name: "Julia R.",     xp: 710,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#D49E3B,#F3C66F)", flag: "🇧🇷" },
  { id: "7",  name: "Marcos T.",    xp: 690,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#C44A4A,#E87A7A)", flag: "🇲🇽" },
  { id: "8",  name: "Sophie B.",    xp: 650,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#C4714A,#E8A07A)", flag: "🇫🇷" },
  { id: "9",  name: "Hiroshi N.",   xp: 620,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#B03060,#E06090)", flag: "🇯🇵" },
  { id: "10", name: "Elena V.",     xp: 590,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B6B4B,#3B9B7B)", flag: "🇷🇺" },
  { id: "11", name: "Pedro K.",     xp: 570,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#4A7A6A,#6ABAAA)", flag: "🇦🇷" },
  { id: "12", name: "Amara D.",     xp: 540,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B4513,#C47A50)", flag: "🇳🇬" },
  { id: "13", name: "Lars H.",      xp: 520,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#2E6090,#4E90C0)", flag: "🇸🇪" },
  { id: "14", name: "Fatima A.",    xp: 500,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#6B3A6B,#9B6A9B)", flag: "🇲🇦" },
  { id: "15", name: "Ben C.",       xp: 480,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#3B5B8B,#6B8BBB)", flag: "🇦🇺" },
  { id: "16", name: "Yuki S.",      xp: 460,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#9B4040,#CB7070)", flag: "🇯🇵" },
  { id: "17", name: "Isabella M.",  xp: 430,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#5B8B3B,#8BBB6B)", flag: "🇮🇹" },
  { id: "18", name: "Kwame A.",     xp: 410,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B6B1B,#BBA050)", flag: "🇬🇭" },
  { id: "19", name: "Sven L.",      xp: 390,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B4B6B,#4B80A0)", flag: "🇳🇴" },
  { id: "20", name: "Clara N.",     xp: 370,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B1B6B,#BB509B)", flag: "🇧🇪" },
  { id: "21", name: "Ravi P.",      xp: 350,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#2E8B57,#5DB872)", flag: "🇮🇳" },
  { id: "22", name: "Nadia K.",     xp: 330,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#5B3B8B,#8B6BBB)", flag: "🇵🇱" },
  { id: "23", name: "Chen W.",      xp: 310,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B1B1B,#BB5050)", flag: "🇨🇳" },
  { id: "24", name: "Lily T.",      xp: 290,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#4B1B8B,#7B50BB)", flag: "🇺🇸" },
  { id: "25", name: "Omar H.",      xp: 270,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B6B1B,#50A050)", flag: "🇪🇬" },
  { id: "26", name: "Maria J.",     xp: 250,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#6B1B4B,#A050A0)", flag: "🇨🇴" },
  { id: "27", name: "Tom P.",       xp: 230,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B1B6B,#50509B)", flag: "🇬🇧" },
  { id: "28", name: "Aisha M.",     xp: 200,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#6B4A1B,#A07A50)", flag: "🇰🇪" },
  { id: "29", name: "Viktor Z.",    xp: 175,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#3B3B6B,#6B6B9B)", flag: "🇺🇦" },
  { id: "30", name: "Mei L.",       xp: 150,  isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B3B6B,#BB6B9B)", flag: "🇹🇼" },
];

function simulateLive(players: Player[]): Player[] {
  return players.map((p) => {
    if (p.isCurrentUser) return { ...p, delta: 0 };
    const bump = Math.random() < 0.55 ? Math.floor(Math.random() * 22) : 0;
    return { ...p, xp: p.xp + bump, delta: bump };
  });
}

export function Leaderboard() {
  const { xp } = useStore();
  const { interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const [players, setPlayers] = useState<Player[]>(
    BASE_PLAYERS.map((p) => ({ ...p, xp: p.isCurrentUser ? xp : p.xp, delta: 0 }))
      .sort((a, b) => b.xp - a.xp),
  );

  // Keep current user XP in sync
  useEffect(() => {
    setPlayers((prev) =>
      prev
        .map((p) => (p.isCurrentUser ? { ...p, xp } : p))
        .sort((a, b) => b.xp - a.xp),
    );
  }, [xp]);

  // Live simulation — tick every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => simulateLive(prev).sort((a, b) => b.xp - a.xp));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (rank: number) => {
    const badges: Record<number, { bg: string; icon: React.ReactNode }> = {
      1: { bg: "rgba(212,162,59,0.15)",  icon: <Trophy size={14} color="#D4A23B" /> },
      2: { bg: "rgba(120,130,140,0.15)", icon: <Award size={14}  color="#78828C" /> },
      3: { bg: "rgba(196,113,74,0.15)",  icon: <Award size={14}  color="#C4714A" /> },
    };
    if (badges[rank]) {
      return (
        <div
          style={{
            width: "24px", height: "24px", borderRadius: "50%",
            background: badges[rank].bg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {badges[rank].icon}
        </div>
      );
    }
    return (
      <span style={{
        fontSize: "12px", fontWeight: 800, color: "var(--text-secondary)",
        width: "24px", textAlign: "center", flexShrink: 0,
      }}>
        {rank}
      </span>
    );
  };

  const now = new Date();
  const daysLeft = 7 - now.getDay();

  // Find current user rank
  const userRank = players.findIndex((p) => p.isCurrentUser) + 1;

  return (
    <div
      style={{
        background: "var(--surface-raised)",
        borderRadius: "24px",
        border: "1.5px solid var(--border)",
        padding: "24px",
        width: "100%",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Trophy size={20} color="#D4A23B" />
          <span>{isPT ? "Liga Ouro" : "Gold League"}</span>
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 700, color: "var(--accent-terra)" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#FF6B35",
              boxShadow: "0 0 0 3px rgba(255,107,53,0.2)",
              animation: "pulse 2s ease-in-out infinite",
              display: "inline-block",
            }} />
            LIVE
          </span>
          <span style={{
            fontSize: "11px", fontWeight: 700,
            background: "var(--bg)", border: "1px solid var(--border)",
            color: "var(--text-secondary)", padding: "4px 10px", borderRadius: "99px",
          }}>
            {isPT ? `${daysLeft}d restantes` : `${daysLeft}d left`}
          </span>
        </div>
      </div>

      {/* Your rank summary pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "rgba(45,74,62,0.06)", borderRadius: "14px",
        padding: "10px 14px", border: "1px solid rgba(45,74,62,0.12)",
      }}>
        <Trophy size={16} color="var(--accent-green)" />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-green)" }}>
          {isPT ? `Você está em #${userRank} de 30 — continue!` : `You're #${userRank} of 30 — keep going!`}
        </span>
      </div>

      {/* Scrollable player list */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "6px",
        maxHeight: "420px", overflowY: "auto",
        paddingRight: "4px",
      }}
        className="no-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => {
            const rank = index + 1;
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 320, damping: 30 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 12px", borderRadius: "14px",
                  background: player.isCurrentUser ? "rgba(45,74,62,0.07)" : "transparent",
                  border: "1px solid",
                  borderColor: player.isCurrentUser ? "var(--brand)" : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {getRankBadge(rank)}

                  <div
                    style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: player.avatarColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "13px", color: "#FFFFFF",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                      flexShrink: 0, position: "relative",
                    }}
                  >
                    {player.name.charAt(0)}
                    <span style={{ position: "absolute", bottom: -2, right: -2, fontSize: "9px" }}>
                      {player.flag}
                    </span>
                  </div>

                  <span style={{
                    fontSize: "13.5px", fontWeight: 700,
                    color: player.isCurrentUser ? "var(--brand)" : "var(--text-primary)",
                  }}>
                    {player.name}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {player.delta > 0 && (
                    <motion.span
                      key={`delta-${player.xp}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ fontSize: "10px", fontWeight: 700, color: "#2D9D4A" }}
                    >
                      +{player.delta}
                    </motion.span>
                  )}
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {player.xp.toLocaleString()} XP
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
