import React from "react";
import { Trophy, Award } from "@/components/lume/CustomIcons";

const mockUsers = [
  {
    id: "1",
    name: "Você",
    xp: 450,
    isCurrentUser: true,
    avatarColor: "linear-gradient(135deg, #2D4A3E, #4A7A6A)",
  },
  {
    id: "2",
    name: "Ana Silva",
    xp: 820,
    isCurrentUser: false,
    avatarColor: "linear-gradient(135deg, #FF6B35, #C4714A)",
  },
  {
    id: "3",
    name: "Carlos M.",
    xp: 610,
    isCurrentUser: false,
    avatarColor: "linear-gradient(135deg, #1B3A4B, #3B7A8C)",
  },
  {
    id: "4",
    name: "Julia R.",
    xp: 440,
    isCurrentUser: false,
    avatarColor: "linear-gradient(135deg, #D49E3B, #F3C66F)",
  },
  {
    id: "5",
    name: "Pedro K.",
    xp: 390,
    isCurrentUser: false,
    avatarColor: "linear-gradient(135deg, #B34A4A, #E87A7A)",
  },
].sort((a, b) => b.xp - a.xp);

export function Leaderboard() {
  const users = mockUsers;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(212, 162, 59, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Trophy size={14} color="#D4A23B" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(120, 130, 140, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Award size={14} color="#78828C" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(196, 113, 74, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Award size={14} color="#C4714A" />
        </div>
      );
    }
    return (
      <span
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "var(--text-secondary)",
          width: "24px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {rank}
      </span>
    );
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Trophy size={20} color="#D4A23B" />
          <span>Liga Ouro</span>
        </h3>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            padding: "4px 10px",
            borderRadius: "99px",
          }}
        >
          Termina em 2d
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {users.map((user, index) => {
          const rank = index + 1;
          return (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "16px",
                background: user.isCurrentUser ? "var(--bg-primary)" : "transparent",
                border: "1px solid",
                borderColor: user.isCurrentUser ? "var(--brand)" : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {getRankBadge(rank)}

                {/* Gradient Avatar */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: user.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "14px",
                    color: "#FFFFFF",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                    flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0)}
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: user.isCurrentUser ? "var(--brand)" : "var(--text-primary)",
                  }}
                >
                  {user.name}
                </span>
              </div>

              <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                {user.xp} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
