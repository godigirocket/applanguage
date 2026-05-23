import React from "react";
import { dailyQuests } from "@/data/content";
import { useGameStore } from "@/store/gameStore";
import { Book, Mic, Bookmark, Trophy } from "@/components/lume/CustomIcons";

function GiftIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="14" rx="2" />
      <path d="M12 5a3 3 0 1 0-3 3h3Z" />
      <path d="M12 5a3 3 0 1 1 3 3h-3Z" />
      <path d="M12 8v14" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function DailyQuest() {
  const { dailyQuestsProgress, completedQuests, completeQuest, addXp, addLumes } = useGameStore();

  const handleClaim = (questId: string, xp: number, lumes: number) => {
    addXp(xp);
    addLumes(lumes);
    completeQuest(questId);
  };

  const getQuestDetails = (questId: string) => {
    if (questId.includes("lesson") || questId.includes("li")) {
      return {
        icon: <Book size={18} color="#2D4A3E" />,
        bgColor: "rgba(45, 74, 62, 0.1)",
        borderColor: "rgba(45, 74, 62, 0.2)",
      };
    }
    if (
      questId.includes("speak") ||
      questId.includes("falar") ||
      questId.includes("pronun") ||
      questId.includes("xp")
    ) {
      return {
        icon: <Mic size={18} color="#C4714A" />,
        bgColor: "rgba(196, 113, 74, 0.1)",
        borderColor: "rgba(196, 113, 74, 0.2)",
      };
    }
    return {
      icon: <Bookmark size={18} color="#D4A23B" />,
      bgColor: "rgba(212, 162, 59, 0.1)",
      borderColor: "rgba(212, 162, 59, 0.2)",
    };
  };

  return (
    <div
      id="daily-quest-card"
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
          <Trophy size={20} color="var(--brand)" />
          <span>Missões Diárias</span>
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
          Reseta em 14h
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {dailyQuests.slice(0, 3).map((quest) => {
          const progress = dailyQuestsProgress[quest.id] || 0;
          const isCompleted = progress >= quest.target;
          const isClaimed = completedQuests.includes(quest.id);
          const percent = Math.min(100, (progress / quest.target) * 100);
          const details = getQuestDetails(quest.id);

          return (
            <div
              key={quest.id}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                padding: "12px 14px",
                borderRadius: "16px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                transition: "transform 0.2s ease",
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: details.bgColor,
                  border: `1px solid ${details.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {details.icon}
              </div>

              {/* Quest details */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {quest.title}
                  </span>
                  <span
                    style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-secondary)" }}
                  >
                    {Math.min(progress, quest.target)}/{quest.target}
                  </span>
                </div>

                {/* Progress bar container */}
                <div
                  style={{
                    height: "8px",
                    background: "var(--border)",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "var(--brand)",
                      width: `${percent}%`,
                      transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>

                {/* Bottom Rewards & Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--accent)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <GiftIcon size={12} color="var(--accent)" />+{quest.xpReward} XP • +
                    {quest.lumesReward} Lumes
                  </span>

                  {isClaimed ? (
                    <span
                      style={{ fontSize: "11px", fontWeight: 800, color: "var(--text-secondary)" }}
                    >
                      ✓ Resgatado
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest.id, quest.xpReward, quest.lumesReward)}
                      style={{
                        padding: "4px 12px",
                        background: "var(--brand)",
                        color: "white",
                        border: "none",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(45, 74, 62, 0.2)",
                      }}
                    >
                      Resgatar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
