"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createEmptyLeaderboard,
  getCurrentUserRank,
  loadAppState,
  saveLeaderboard,
  type CapitolLeaderboardData,
  type LeaderboardEntry,
} from "@/lib/capitol-session";

type FilterType = "global" | "friends" | "room";
type FilterPeriod = "weekly" | "monthly" | "all";

const TYPE_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "friends", label: "Friends" },
  { value: "room", label: "Room" },
];

const PERIOD_OPTIONS: { value: FilterPeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all", label: "All Time" },
];

export default function LeaderboardsPage() {
  const [filterType, setFilterType] = useState<FilterType>("global");
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");

  const app = useMemo(() => loadAppState(), []);
  const myName = useMemo(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("capitol.profile") : null;
      if (raw) {
        const p = JSON.parse(raw);
        return p?.name?.trim()?.split(/\s+/)[0] ?? "You";
      }
    } catch { /* noop */ }
    return "You";
  }, []);

  const { leaderboard, myEntry } = useMemo(() => {
    let raw: string | null = null;
    try { raw = typeof window !== "undefined" ? window.localStorage.getItem("capitol.leaderboard") : null; } catch { /* noop */ }

    let data: CapitolLeaderboardData;
    if (raw) {
      try { data = JSON.parse(raw); } catch { data = createEmptyLeaderboard(); }
    } else {
      data = createEmptyLeaderboard();
    }

    const myXP = app.xp;
    const myLevel = Math.floor(myXP / 500) + 1;

    if (data.global.length === 0 && myXP > 0) {
      const currentUser: LeaderboardEntry = {
        rank: 0,
        username: myName.toLowerCase(),
        displayName: myName,
        xp: myXP,
        streak: app.streak,
        level: myLevel,
        isCurrentUser: true,
        movement: 0,
      };
      data.global = [currentUser];
      saveLeaderboard(data);
    }

    const pool = data[filterType] ?? [];
    const me = pool.find((e) => e.isCurrentUser) ?? null;

    return { leaderboard: pool, myEntry: me };
  }, [filterType, app.xp, app.streak, myName]);

  const sorted = useMemo(() => {
    return [...leaderboard].sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }));
  }, [leaderboard]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const podium1 = top3[0];
  const podium2 = top3[1];
  const podium3 = top3[2];

  const myRankInfo = useMemo(() => getCurrentUserRank(filterType), [filterType]);
  const showMyPosition = !myEntry && myRankInfo.entry;

  return (
    <div className="capitol-leaderboard-page">
      <header className="mb-8">
        <h1 className="capitol-leaderboard-title">Leaderboard</h1>
        <p className="capitol-leaderboard-subtitle">Show up. Build momentum. Climb.</p>
      </header>

      <div className="capitol-leaderboard-filters">
        <div className="capitol-leaderboard-filter-group">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`capitol-leaderboard-filter-btn ${filterType === opt.value ? "capitol-leaderboard-filter-btn-active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="capitol-leaderboard-filter-group">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterPeriod(opt.value)}
              className={`capitol-leaderboard-filter-btn ${filterPeriod === opt.value ? "capitol-leaderboard-filter-btn-active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="capitol-leaderboard-empty">
          <p className="capitol-leaderboard-empty-title">Climb starts with showing up.</p>
          <p className="capitol-leaderboard-empty-sub">Submit proofs and complete missions to appear on the leaderboard.</p>
          <Link href="/rooms" className="capitol-btn" style={{ marginTop: "1rem" }}>Join a room</Link>
        </div>
      )}

      {sorted.length > 0 && (
        <>
          <div className="capitol-leaderboard-podium">
            {podium2 && (
              <div className="capitol-podium-item capitol-podium-2" style={{ animationDelay: "0s" }}>
                <PodiumCard entry={podium2} rank={2} />
              </div>
            )}
            {podium1 && (
              <div className="capitol-podium-item capitol-podium-1" style={{ animationDelay: "0.1s" }}>
                <PodiumCard entry={podium1} rank={1} />
              </div>
            )}
            {podium3 && (
              <div className="capitol-podium-item capitol-podium-3" style={{ animationDelay: "0.2s" }}>
                <PodiumCard entry={podium3} rank={3} />
              </div>
            )}
          </div>

          {rest.length > 0 && (
            <div className="capitol-leaderboard-list">
              <ul className="capitol-leaderboard-list-ul">
                {rest.map((entry, i) => (
                  <li key={entry.username} className="capitol-leaderboard-row" style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="capitol-leaderboard-rank">#{entry.rank}</span>
                    <div className="capitol-leaderboard-avatar">
                      {entry.avatar ?? entry.displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#111] truncate">
                        {entry.displayName}
                        {entry.isCurrentUser && <span className="text-[#9a9a99] font-normal ml-1">(you)</span>}
                      </p>
                      <p className="text-[12px] text-[#9a9a99]">Level {entry.level}</p>
                    </div>
                    <div className="capitol-leaderboard-movement">
                      {entry.movement > 0 && (
                        <span className="capitol-leaderboard-movement-up">Ã¢â€ â€˜{entry.movement}</span>
                      )}
                      {entry.movement < 0 && (
                        <span className="capitol-leaderboard-movement-down">{entry.movement}</span>
                      )}
                      {entry.movement === 0 && <span className="capitol-leaderboard-movement-none">Ã¢â‚¬â€</span>}
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-[#111] tabular-nums">{entry.xp.toLocaleString()} XP</p>
                      <p className="text-[11px] text-[#9a9a99]">{entry.streak}d streak</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {showMyPosition && myRankInfo.entry && (
        <div className="capitol-leaderboard-my-position">
          <div className="capitol-leaderboard-my-position-inner">
            <span className="capitol-leaderboard-my-position-rank">Your position</span>
            <span className="capitol-leaderboard-my-position-rank-number">#{myRankInfo.rank}</span>
            <span className="capitol-leaderboard-my-position-name">{myRankInfo.entry.displayName}</span>
            <span className="capitol-leaderboard-my-position-xp">{myRankInfo.entry.xp.toLocaleString()} XP</span>
            <div className="flex-1 min-w-0">
              <div className="capitol-leaderboard-my-position-progress">
                <div
                  className="capitol-leaderboard-my-position-progress-fill"
                  style={{ width: `${Math.min(100, (myRankInfo.entry.xp / (sorted[myRankInfo.rank - 2]?.xp ?? myRankInfo.entry.xp * 1.1)) * 100)}%` }}
                />
              </div>
              {myRankInfo.rank > 1 && sorted[myRankInfo.rank - 2] && (
                <p className="text-[11px] text-[#9a9a99] mt-1">
                  {(sorted[myRankInfo.rank - 2].xp - myRankInfo.entry.xp).toLocaleString()} XP away from #{myRankInfo.rank - 1}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ entry, rank }: { entry: LeaderboardEntry; rank: 1 | 2 | 3 }) {
  const rankColors: Record<1 | 2 | 3, { bg: string; text: string; border: string }> = {
    1: { bg: "#111", text: "#fff", border: "#111" },
    2: { bg: "#f7f7f6", text: "#111", border: "#d4d4d2" },
    3: { bg: "#fafaf9", text: "#111", border: "#ececeb" },
  };
  const colors = rankColors[rank];

  return (
    <div
      className="capitol-podium-card"
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <div className="capitol-podium-rank">{rank}</div>
      <div
        className="capitol-podium-avatar"
        style={{
          background: rank === 1 ? "#fff" : "#111",
          color: rank === 1 ? "#111" : "#fff",
        }}
      >
        {entry.avatar ?? entry.displayName.slice(0, 2).toUpperCase()}
      </div>
      <p className="capitol-podium-name">{entry.displayName}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="capitol-podium-xp">{entry.xp.toLocaleString()} XP</span>
        <span className={`capitol-podium-streak ${rank === 1 ? "capitol-podium-streak-light" : ""}`}>{entry.streak}d</span>
      </div>
      <div className="capitol-podium-movement">
        {entry.movement > 0 && <span className={rank === 1 ? "text-white/70" : "text-[#6a6a6a]"}>Ã¢â€ â€˜{entry.movement}</span>}
        {entry.movement === 0 && <span className={rank === 1 ? "text-white/50" : "text-[#9a9a99]"}>Ã¢â‚¬â€</span>}
      </div>
    </div>
  );
}
