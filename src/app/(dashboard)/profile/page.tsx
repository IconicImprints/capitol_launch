"use client";

import { useMemo } from "react";
import Image from "next/image";
import { loadAppState, loadProfile, loadRooms } from "@/lib/capitol-session";

export default function ProfilePage() {
  const app = useMemo(() => loadAppState(), []);
  const profile = useMemo(() => loadProfile(), []);
  const rooms = useMemo(() => loadRooms(), []);

  const display = useMemo(() => {
    if (!profile) return null;
    return {
      name: profile.display_name || "Capitol member",
      username: profile.username ? `@${profile.username}` : "",
      bio: profile.bio || "",
      dob: profile.dob ? new Date(profile.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "",
      interest: profile.interest || "",
      avatar: profile.avatar,
    };
  }, [profile]);

  const initials = useMemo(() => {
    if (!display) return "??";
    return display.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [display]);

  const totalMembers = useMemo(() => {
    return rooms.reduce((sum, r) => sum + r.members.length, 0);
  }, [rooms]);

  if (!display) {
    return (
      <div className="capitol-empty">
        <p>No profile found.</p>
      </div>
    );
  }

  return (
    <div className="capitol-stack">
      <div className="capitol-card" style={{ padding: "1.5rem" }}>
        <div className="capitol-cluster" style={{ marginBottom: "1rem" }}>
          <div className="capitol-avatar capitol-avatar-lg">
            {display.avatar ? (
              <Image src={display.avatar} alt="" width={64} height={64} className="capitol-avatar" unoptimized />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{display.name}</h1>
            {display.username && <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)" }}>{display.username}</p>}
            {display.interest && <p style={{ fontSize: "0.85rem", color: "var(--c-text-4)", marginTop: "0.25rem" }}>{display.interest}</p>}
          </div>
        </div>
        {display.bio && <p style={{ fontSize: "0.95rem", color: "var(--c-text-2)", lineHeight: 1.6, marginBottom: "1rem" }}>{display.bio}</p>}
        <div className="capitol-divider" style={{ marginBottom: "1rem" }} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="Rooms" value={String(rooms.length)} />
          <Stat label="Members met" value={String(totalMembers)} />
          <Stat label="Streak" value={`${app.streak}d`} />
          <Stat label="Best streak" value={`${app.bestStreak}d`} />
          <Stat label="XP" value={app.xp.toLocaleString()} />
          <Stat label="Premium Points" value={String(app.premiumPoints)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--c-text)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <span style={{ fontSize: "0.78rem", color: "var(--c-text-3)" }}>{label}</span>
    </div>
  );
}
