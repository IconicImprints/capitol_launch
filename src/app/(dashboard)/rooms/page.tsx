"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { loadAppState, loadRooms, joinRoom, leaveRoom, type CapitolRoom } from "@/lib/capitol-session";

type Tab = "discover" | "my-room";

const CATEGORIES = ["All", "Coding / Building", "Video / Content", "Design / UI-UX", "Startup / Business", "Fitness", "Creative", "Tech", "Other"] as const;

const AGE_PRESETS = [
  { label: "My age", min: -1, max: -1 },
  { label: "13–17", min: 13, max: 17 },
  { label: "18–24", min: 18, max: 24 },
  { label: "25–34", min: 25, max: 34 },
  { label: "35–44", min: 35, max: 44 },
  { label: "45+", min: 45, max: 99 },
];

const MEMBER_PRESETS = [
  { label: "3–4", min: 3, max: 4 },
  { label: "5–6", min: 5, max: 6 },
  { label: "7–8", min: 7, max: 8 },
];

const DURATION_PRESETS = [
  { label: "3Ã¢â‚¬â€œ7 days", min: 3, max: 7 },
  { label: "8Ã¢â‚¬â€œ14 days", min: 8, max: 14 },
  { label: "15Ã¢â‚¬â€œ30 days", min: 15, max: 30 },
  { label: "31Ã¢â‚¬â€œ60 days", min: 31, max: 60 },
  { label: "61Ã¢â‚¬â€œ90 days", min: 61, max: 90 },
];

export default function RoomsPage() {
  const [tab, setTab] = useState<Tab>("discover");
  const app = useMemo(() => loadAppState(), []);
  const rooms = useMemo(() => loadRooms(), []);
  const currentRoom = app.room;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [agePreset, setAgePreset] = useState<string>("My age");
  const [memberPreset, setMemberPreset] = useState<string>("5-6");
  const [durationPreset, setDurationPreset] = useState<string>("8-14 days");
  const [showFilters, setShowFilters] = useState(false);

  const discoverRooms = useMemo(() => {
    let result = [...rooms];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.goal.toLowerCase().includes(q) ||
          r.niche.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((r) => r.niche === category);
    }

    const ap = AGE_PRESETS.find((a) => a.label === agePreset);
    if (ap && ap.min >= 0) {
      result = result.filter((r) => r.ageRange.min >= ap.min && r.ageRange.max <= ap.max);
    }

    const mp = MEMBER_PRESETS.find((m) => m.label === memberPreset);
    if (mp && mp.min >= 0) {
      result = result.filter((r) => r.minMembers >= mp.min && r.maxMembers <= mp.max);
    }

    const dp = DURATION_PRESETS.find((d) => d.label === durationPreset);
    if (dp && dp.min >= 0) {
      result = result.filter((r) => r.durationDays >= dp.min && r.durationDays <= dp.max);
    }

    result.sort((a, b) => b.proofRate - a.proofRate);

    return result;
  }, [rooms, search, category, agePreset, memberPreset, durationPreset]);

  const handleJoin = (room: CapitolRoom) => {
    const profile = typeof window !== "undefined" ? window.localStorage.getItem("capitol.profile") : null;
    let user = profile ? JSON.parse(profile) : null;
    if (!user) {
      user = { name: "You", age: 20, niche: room.niche, bio: "", dob: "", username: "" };
    }
    joinRoom(room.id, {
      name: user.name || "You",
      age: user.age || 20,
      niche: user.niche || room.niche,
    });
    window.location.reload();
  };

  const handleLeave = () => {
    if (!currentRoom) return;
    leaveRoom(currentRoom.id);
    window.location.reload();
  };

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Rooms</h1>
        <p className="capitol-section-sub">Find people who are building toward the same goal.</p>
      </div>

      <div className="capitol-tabs">
        <button
          onClick={() => setTab("discover")}
          className={`capitol-tab ${tab === "discover" ? "capitol-tab-active" : ""}`}
        >
          Discover
        </button>
        <button
          onClick={() => setTab("my-room")}
          className={`capitol-tab ${tab === "my-room" ? "capitol-tab-active" : ""}`}
        >
          My Room
        </button>
      </div>

      {tab === "discover" ? (
        <div className="capitol-stack">
          <div className="capitol-stack">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="capitol-input"
            />

            <div className="capitol-cluster" style={{ gap: "0.5rem", overflowX: "auto" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`capitol-pill ${category === cat ? "capitol-pill-active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="capitol-pill capitol-btn-ghost"
              style={{ width: "auto", alignSelf: "flex-start" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </button>

            {showFilters && (
              <div className="capitol-card" style={{ padding: "1.25rem" }}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="capitol-label">Age</label>
                    <select value={agePreset} onChange={(e) => setAgePreset(e.target.value)} className="capitol-input">
                      {AGE_PRESETS.map((a) => (
                        <option key={a.label} value={a.label}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="capitol-label">Members</label>
                    <select value={memberPreset} onChange={(e) => setMemberPreset(e.target.value)} className="capitol-input">
                      {MEMBER_PRESETS.map((m) => (
                        <option key={m.label} value={m.label}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="capitol-label">Duration</label>
                    <select value={durationPreset} onChange={(e) => setDurationPreset(e.target.value)} className="capitol-input">
                      {DURATION_PRESETS.map((d) => (
                        <option key={d.label} value={d.label}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

            {discoverRooms.length === 0 ? (
              <div className="capitol-empty">
                <p>No rooms match those filters.</p>
                <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Try adjusting your search or create a new room.</p>
                <Link href="/rooms/create" className="capitol-btn" style={{ marginTop: "1rem" }}>Create a Room</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {discoverRooms.map((room) => (
                  <div key={room.id} className="capitol-card" style={{ padding: "1.25rem", borderRadius: "var(--radius-pixel)" }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em" }}>{room.name}</h3>
                      <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", marginTop: "0.35rem", lineHeight: 1.5 }}>{room.goal}</p>
                    </div>
                    <div className="capitol-cluster" style={{ gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span className="capitol-badge" style={{ borderRadius: "var(--radius-pixel)" }}>{room.niche}</span>
                      <span className="capitol-badge" style={{ borderRadius: "var(--radius-pixel)" }}>{room.ageRange.min}Ã¢â‚¬â€œ{room.ageRange.max}</span>
                      {room.type === "Elite" && <span className="capitol-badge capitol-badge-solid" style={{ borderRadius: "var(--radius-pixel)" }}>Elite</span>}
                    </div>
                    <div className="capitol-row" style={{ marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>{room.members.length} / {room.maxMembers} members</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>{room.durationDays} days</span>
                    </div>
                    <div className="capitol-cluster">
                       <Link href={`/rooms/${room.id}`} className="capitol-btn capitol-btn-ghost" style={{ flex: 1, justifyContent: "center", borderRadius: "var(--radius-pixel)", padding: "0.8rem 1.25rem", fontSize: "0.95rem" }}>View</Link>
                      {room.members.length < room.maxMembers && (
                        <button onClick={() => handleJoin(room)} className="capitol-btn" style={{ flex: 1, borderRadius: "var(--radius-pixel)", padding: "0.8rem 1.25rem", fontSize: "0.95rem" }}>Join</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ) : (
        <div>
          {currentRoom ? (
            <div className="capitol-stack">
              <div className="capitol-card" style={{ padding: "1.5rem" }}>
                <div className="capitol-row" style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{currentRoom.name}</h2>
                    <p style={{ fontSize: "0.95rem", color: "var(--c-text-3)", marginTop: "0.35rem" }}>{currentRoom.goal}</p>
                  </div>
                  <span className="capitol-badge capitol-badge-solid">Active</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", lineHeight: 1.6, marginBottom: "1rem" }}>{currentRoom.description}</p>
                <div className="capitol-cluster" style={{ gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <span className="capitol-badge">{currentRoom.niche}</span>
                  <span className="capitol-badge">{currentRoom.members.length} members</span>
                  <span className="capitol-badge">{currentRoom.durationDays} days</span>
                </div>
                <button onClick={handleLeave} className="capitol-btn capitol-btn-ghost">Leave Room</button>
              </div>

              <div className="capitol-card" style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Members</h3>
                <div className="capitol-stack">
                  {currentRoom.members.map((member) => (
                    <div key={member.id} className="capitol-cluster" style={{ justifyContent: "flex-start" }}>
                      <div className="capitol-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem" }}>
                        {member.avatar ?? member.label.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--c-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {member.label} {member.isYou && <span style={{ color: "var(--c-text-4)", fontWeight: 400 }}>(you)</span>}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "var(--c-text-4)" }}>{member.streak !== undefined ? `${member.streak}d streak` : "New member"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="capitol-empty">
              <p>You aren&apos;t currently in a room.</p>
              <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Join a room to start building with others.</p>
              <Link href="/rooms" onClick={() => setTab("discover")} className="capitol-btn" style={{ marginTop: "1rem" }}>Find a Room</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
