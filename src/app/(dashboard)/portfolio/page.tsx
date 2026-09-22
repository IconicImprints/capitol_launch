"use client";

import { useMemo } from "react";
import {
  loadAppState,
  loadProfile,
  loadPortfolioEntries,
  xpProgress,
  type PortfolioEntryType,
} from "@/lib/capitol-session";

const badgeLabels: Record<PortfolioEntryType, string> = {
  completed: "Completed",
  failed: "Failed",
  abandoned: "Abandoned",
  quest_won: "Quest Won",
  quest_lost: "Quest Lost",
  milestone: "Milestone",
  attempted: "Attempted",
};

function formatDate(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function IconXp() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconStreak() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function IconQuest() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconWinRate() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8l-4 4-2.5-2.5" />
    </svg>
  );
}

function IconAttempts() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

function MilestoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function PortfolioPage() {
  const app = useMemo(() => loadAppState(), []);
  const profile = useMemo(() => loadProfile(), []);
  const portfolio = useMemo(() => loadPortfolioEntries(), []);

  const displayName = useMemo(() => {
    if (!profile) return "You";
    return profile.display_name.trim().split(/\s+/)[0] || profile.username || "You";
  }, [profile]);

  const initials = useMemo(() => {
    if (profile?.avatar) return null;
    const source = (profile?.display_name || profile?.username || "U").trim();
    return source.slice(0, 2).toUpperCase();
  }, [profile]);

  const niches = useMemo(() => {
    if (!profile?.interest) return [];
    return profile.interest
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  }, [profile]);

  const sorted = useMemo(() => {
    return [...portfolio].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [portfolio]);

  const milestones = useMemo(
    () => sorted.filter((e) => e.status === "milestone"),
    [sorted]
  );

  const activities = useMemo(
    () => sorted.filter((e) => e.status !== "milestone"),
    [sorted]
  );

  const stats = useMemo(() => {
    const attemptTypes: PortfolioEntryType[] = [
      "completed",
      "failed",
      "attempted",
      "quest_won",
      "quest_lost",
    ];
    const totalAttempts = portfolio.filter((e) =>
      attemptTypes.includes(e.status)
    ).length;
    const wins = portfolio.filter(
      (e) => e.status === "completed" || e.status === "quest_won"
    ).length;
    const winRate = totalAttempts > 0 ? Math.round((wins / totalAttempts) * 100) : 0;
    const questsCompleted = portfolio.filter((e) => e.status === "quest_won").length;
    return { totalAttempts, winRate, questsCompleted };
  }, [portfolio]);

  const progress = useMemo(() => xpProgress(app.xp), [app.xp]);

  const statCards = [
    { label: "XP", value: app.xp.toLocaleString(), icon: <IconXp /> },
    {
      label: "Current streak",
      value: `${app.streak}d`,
      icon: <IconStreak />,
    },
    {
      label: "Quests completed",
      value: String(stats.questsCompleted),
      icon: <IconQuest />,
    },
    {
      label: "Win rate",
      value: `${stats.winRate}%`,
      icon: <IconWinRate />,
    },
    {
      label: "Total attempts",
      value: String(stats.totalAttempts),
      icon: <IconAttempts />,
    },
  ];

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>
          Portfolio
        </h1>
        <p className="capitol-section-sub">
          {displayName}&apos;s Capitol journey.
        </p>
      </div>

      <div className="capitol-profile-header">
        <div className="capitol-profile-avatar" style={{ position: "relative" }}>
          {profile?.avatar ? (
            <span
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${profile.avatar})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="capitol-profile-meta">
          <div className="capitol-profile-name">
            {profile?.display_name || "User"}
          </div>
          <div className="capitol-profile-username">
            @{profile?.username || "user"}
          </div>
          {profile?.bio && (
            <div className="capitol-profile-bio">{profile.bio}</div>
          )}
          {niches.length > 0 && (
            <div className="capitol-profile-niches">
              {niches.map((niche) => (
                <span key={niche} className="capitol-pill">
                  {niche}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="capitol-stat-grid">
        {statCards.map((card) => (
          <div key={card.label} className="capitol-stat-card">
            <div style={{ color: "var(--c-text-3)" }}>{card.icon}</div>
            <div className="capitol-stat-value">{card.value}</div>
            <div className="capitol-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="capitol-level-card">
        <div className="capitol-level-number">{progress.level}</div>
        <div className="capitol-level-info">
          <div className="capitol-level-title">Level</div>
          <div className="capitol-level-xp">
            {progress.intoLevel} / {progress.xpPerLevel} XP
          </div>
          <div className="capitol-progress-track">
            <div className="capitol-progress-bar">
              <div
                className="capitol-progress-fill"
                style={{ width: `${progress.ratio * 100}%` }}
              />
            </div>
            <div className="capitol-progress-label">
              {Math.round(progress.ratio * 100)}%
            </div>
          </div>
        </div>
      </div>

      {milestones.length > 0 && (
        <div className="capitol-stack">
          <div>
            <h2 className="capitol-section-title">Milestones</h2>
            <p className="capitol-section-sub">
              Key achievements and markers.
            </p>
          </div>
          {milestones.map((entry) => (
            <div key={entry.id} className="capitol-milestone-node">
              <div className="capitol-milestone-icon">
                <MilestoneIcon />
              </div>
              <div className="capitol-milestone-info">
                <div className="capitol-milestone-title">{entry.title}</div>
                <div className="capitol-milestone-desc">{entry.description}</div>
                 <div className="capitol-milestone-date">
                  {formatDate(entry.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="capitol-stack">
        <div>
          <h2 className="capitol-section-title">Activity</h2>
          <p className="capitol-section-sub">Recent portfolio events.</p>
        </div>
        {activities.length === 0 ? (
          <div className="capitol-empty">No activity yet.</div>
        ) : (
          <div className="capitol-activity-timeline">
            {activities.map((entry) => (
              <div key={entry.id} className="capitol-activity-item">
                <div
                  className={`capitol-activity-dot capitol-activity-dot-${entry.status}`}
                />
                <div className="capitol-activity-content">
                  <div className="capitol-activity-title">{entry.title}</div>
                  <div className="capitol-activity-description">
                    {entry.description}
                  </div>
                  <div className="capitol-activity-meta">
                    {formatDate(entry.createdAt)}
                  </div>
                  <span
                    className={`capitol-activity-badge capitol-activity-badge-${entry.status}`}
                  >
                    {badgeLabels[entry.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
