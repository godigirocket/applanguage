import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award } from "@/components/lume/CustomIcons";
import { useStore } from "@/hooks/useStore";
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
  delta: number;
  isCurrentUser: boolean;
  avatarColor: string;
  flag: string;
  character: "celebrating" | "runner" | "thinking" | "reading" | "speaking" | "waving";
}

const BASE_PLAYERS: Omit<Player, "delta">[] = [
  { id: "u", name: "Você", xp: 450, isCurrentUser: true, avatarColor: "linear-gradient(135deg,#2D4A3E,#4A7A6A)", flag: "🇧🇷", character: "celebrating" },
  { id: "2", name: "Ana Silva", xp: 920, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#FF6B35,#C4714A)", flag: "🇧🇷", character: "runner" },
  { id: "3", name: "Carlos M.", xp: 870, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B3A4B,#3B7A8C)", flag: "🇵🇹", character: "thinking" },
  { id: "4", name: "Priya K.", xp: 810, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#7B4FB0,#A97AE8)", flag: "🇮🇳", character: "reading" },
  { id: "5", name: "Lena W.", xp: 760, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#2E4BC4,#6080E8)", flag: "🇩🇪", character: "speaking" },
  { id: "6", name: "Julia R.", xp: 710, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#D49E3B,#F3C66F)", flag: "🇧🇷", character: "waving" },
  { id: "7", name: "Marcos T.", xp: 690, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#C44A4A,#E87A7A)", flag: "🇲🇽", character: "runner" },
  { id: "8", name: "Sophie B.", xp: 650, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#C4714A,#E8A07A)", flag: "🇫🇷", character: "celebrating" },
  { id: "9", name: "Hiroshi N.", xp: 620, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#B03060,#E06090)", flag: "🇯🇵", character: "thinking" },
  { id: "10", name: "Elena V.", xp: 590, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B6B4B,#3B9B7B)", flag: "🇷🇺", character: "reading" },
  { id: "11", name: "Pedro K.", xp: 570, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#4A7A6A,#6ABAAA)", flag: "🇦🇷", character: "speaking" },
  { id: "12", name: "Amara D.", xp: 540, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B4513,#C47A50)", flag: "🇳🇬", character: "waving" },
  { id: "13", name: "Lars H.", xp: 520, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#2E6090,#4E90C0)", flag: "🇸🇪", character: "runner" },
  { id: "14", name: "Fatima A.", xp: 500, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#6B3A6B,#9B6A9B)", flag: "🇲🇦", character: "celebrating" },
  { id: "15", name: "Ben C.", xp: 480, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#3B5B8B,#6B8BBB)", flag: "🇦🇺", character: "thinking" },
  { id: "16", name: "Yuki S.", xp: 460, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#9B4040,#CB7070)", flag: "🇯🇵", character: "reading" },
  { id: "17", name: "Isabella M.", xp: 430, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#5B8B3B,#8BBB6B)", flag: "🇮🇹", character: "speaking" },
  { id: "18", name: "Kwame A.", xp: 410, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B6B1B,#BBA050)", flag: "🇬🇭", character: "waving" },
  { id: "19", name: "Sven L.", xp: 390, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#1B4B6B,#4B80A0)", flag: "🇳🇴", character: "runner" },
  { id: "20", name: "Clara N.", xp: 370, isCurrentUser: false, avatarColor: "linear-gradient(135deg,#8B1B6B,#BB509B)", flag: "🇧🇪", character: "celebrating" },
];

function simulateLive(players: Player[]): Player[] {
  return players.map((p) => {
    if (p.isCurrentUser) return { ...p, delta: 0 };
    const bump = Math.random() < 0.55 ? Math.floor(Math.random() * 22) : 0;
    return { ...p, xp: p.xp + bump, delta: bump };
  });
}

export function Leaderboard() {
  const { xp, interfaceLanguage } = useStore();
  const isPT = interfaceLanguage === "pt";

  const [players, setPlayers] = useState<Player[]>(
    BASE_PLAYERS.map((p) => ({ ...p, xp: p.isCurrentUser ? xp : p.xp, delta: 0 })).sort((a, b) => b.xp - a.xp)
  );

  useEffect(() => {
    setPlayers((prev) => prev.map((p) => (p.isCurrentUser ? { ...p, xp } : p)).sort((a, b) => b.xp - a.xp));
  }, [xp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => simulateLive(prev).sort((a, b) => b.xp - a.xp));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Demo notice for new users with 0 XP */}
      {xp === 0 && (
        <div style={{ padding: "12px 16px", background: "rgba(241,196,15,0.1)", borderRadius: "12px", border: "1px solid rgba(241,196,15,0.3)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            {isPT
              ? "🎮 Esta é uma prévia do ranking. Complete atividades para entrar na competição!"
              : "🎮 This is a preview of the ranking. Complete activities to join the competition!"}
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "480px", overflowY: "auto" }} className="no-scrollbar">
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            return (
              <motion.div key={player.id} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", background: player.isCurrentUser ? "rgba(45,74,62,0.09)" : "var(--bg)", border: "2px solid", borderColor: player.isCurrentUser ? "var(--brand)" : "var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {getRankBadge(rank)}
                  <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: player.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.15)" }}>
                    {getCharacterComponent(player.character, 28)}
                  </div>
                  <div>
                    <span style={{ fontSize: "14.5px", fontWeight: 800, color: player.isCurrentUser ? "var(--brand)" : "var(--text-primary)", display: "block" }}>
                      {player.name}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{player.flag}</span>
                  </div>
                </div>
                <span style={{ fontSize: "15px", fontWeight: 900, color: isTop3 ? "#D4A23B" : "var(--text-primary)" }}>
                  {player.xp.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
