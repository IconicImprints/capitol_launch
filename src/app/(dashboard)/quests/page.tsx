"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addActivity,
  joinQuest,
  loadAppState,
  loadQuests,
  type Quest,
  type QuestStatus,
} from "@/lib/capitol-session";

type StatusLabel = {
  label: string;
  className: string;
};

function statusMeta(status: QuestStatus): StatusLabel {
  switch (status) {
    case "available":
      return { label: "Available", className: "capitol-badge" };
    case "in_progress":
      return { label: "In Progress", className: "capitol-badge capitol-badge-solid" };
    case "completed":
      return { label: "Completed", className: "capitol-badge" };
    case "failed":
      return { label: "Failed", className: "capitol-badge" };
    case "locked":
      return { label: "Locked", className: "capitol-badge" };
    case "abandoned":
      return { label: "Abandoned", className: "capitol-badge" };
    default:
      return { label: status, className: "capitol-badge" };
  }
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(() => loadQuests());
  const app = loadAppState();
  const router = useRouter();
  const [warningId, setWarningId] = useState<string | null>(null);

  const handleJoin = (quest: Quest) => {
    if (app.room !== null && quest.requiresRoomLeave) {
      setWarningId(quest.id);
      return;
    }
    performJoin(quest.id);
  };

  const performJoin = (questId: string) => {
    const updated = joinQuest(questId);
    if (updated) {
      addActivity(updated.id, "mission_start", `You joined quest: ${updated.title}`);
      const next = loadQuests();
      setQuests(next);
      setWarningId(null);
      router.push(`/quests/${questId}`);
    }
  };

  const handleWarningContinue = (questId: string) => {
    performJoin(questId);
  };

  const handleWarningCancel = () => {
    setWarningId(null);
  };

  if (quests.length === 0) {
    return (
      <div className="capitol-stack">
        <div>
          <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Quests</h1>
          <p className="capitol-section-sub">No quests available right now.</p>
        </div>
        <div className="capitol-empty">
          <p>No quests available.</p>
          <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Check back later for new challenges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Quests</h1>
        <p className="capitol-section-sub">Choose a challenge and commit to building.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quests.map((quest) => {
          const meta = statusMeta(quest.status);
          const completedDays = quest.days.filter((d) => d.status === "completed").length;
          const progress = Math.round((completedDays / quest.durationDays) * 100);
          const isLocked = quest.status === "locked" || quest.status === "abandoned";
          const showWarning = warningId === quest.id;

          if (showWarning) {
            return (
              <div key={quest.id} className="capitol-quest-card">
                <div className="capitol-warning-card">
                  <h3 className="capitol-warning-title">Leave room to join quest?</h3>
                  <p className="capitol-warning-text">
                    You must leave your current room before joining this quest.
                  </p>
                  <ul className="capitol-warning-list">
                    <li>You will lose access to your current room</li>
                    <li>Your room streak may be affected</li>
                    <li>You can rejoin rooms later</li>
                  </ul>
                  <div className="capitol-cluster" style={{ justifyContent: "flex-end" }}>
                    <button onClick={handleWarningCancel} className="capitol-btn-ghost">
                      Cancel
                    </button>
                    <button onClick={() => handleWarningContinue(quest.id)} className="capitol-btn">
                      Leave Room & Continue
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={quest.id}
              className={`capitol-quest-card ${isLocked ? "capitol-quest-card-locked" : ""} ${quest.status === "available" ? "capitol-quest-card-available" : ""} ${quest.status === "completed" ? "capitol-quest-card-completed" : ""} ${quest.status === "failed" ? "capitol-quest-card-failed" : ""}`}
            >
              <div className="capitol-row">
                <span className={meta.className}>{meta.label}</span>
                <span className="capitol-badge">{quest.durationDays} days</span>
              </div>
              <div>
                <h3 className="capitol-quest-title">{quest.title}</h3>
                <p className="capitol-quest-description">{quest.description}</p>
              </div>
              <div className="capitol-quest-meta">
                <span className="capitol-quest-reward">+{quest.xpReward} XP</span>
                <span className="capitol-badge">{quest.participants.length} participants</span>
              </div>
              {quest.status === "in_progress" && (
                <div>
                  <div className="capitol-progress-track">
                    <div className="capitol-progress-bar">
                      <div className="capitol-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="capitol-progress-label">{progress}%</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>
                    {completedDays} / {quest.durationDays} days completed
                  </p>
                </div>
              )}
              {!isLocked && quest.status !== "completed" && quest.status !== "failed" && (
                <div>
                  {quest.status === "available" ? (
                    <button onClick={() => handleJoin(quest)} className="capitol-btn" style={{ width: "100%", justifyContent: "center" }}>
                      Join Quest
                    </button>
                  ) : quest.status === "in_progress" ? (
                    <Link href={`/quests/${quest.id}`} className="capitol-btn" style={{ width: "100%", justifyContent: "center" }}>
                      Continue Quest
                    </Link>
                  ) : null}
                </div>
              )}
              {quest.status === "completed" && (
                <Link href={`/quests/${quest.id}`} className="capitol-btn capitol-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                  View Details
                </Link>
              )}
              {quest.status === "failed" && (
                <Link href={`/quests/${quest.id}`} className="capitol-btn capitol-btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
                  View Details
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
