"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Coffee } from "lucide-react";
import {
  addActivity,
  createPost,
  displayName,
  getActivities,
  greetingForHour,
  isProofSubmittedToday,
  loadAccount,
  loadAppState,
  loadProofImage,
  loadProfile,
  saveProofImage,
  submitTodayProof,
  xpProgress,
  type CapitolAppState,
  type CapitolRoom,
} from "@/lib/capitol-session";

function XPIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function PPIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

type ProofStep = "idle" | "preview" | "done";
type Tab = "dashboard" | "quests";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [app, setApp] = useState<CapitolAppState>(() => loadAppState());
  const [proofStep, setProofStep] = useState<ProofStep>("idle");
  const [proofImage, setProofImage] = useState<string | null>(() => loadProofImage());
  const [celebration, setCelebration] = useState(false);
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, new Date().setHours(24, 0, 0, 0) - Date.now()));
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [postText, setPostText] = useState("");
  const [postVersion, setPostVersion] = useState(0);

  const syncClock = useCallback(() => {
    setRemainingMs(Math.max(0, new Date().setHours(24, 0, 0, 0) - Date.now()));
  }, []);

  useEffect(() => {
    const id = window.setInterval(syncClock, 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setApp(loadAppState());
        syncClock();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [syncClock]);

  useEffect(() => {
    if (celebration) {
      const t = window.setTimeout(() => setCelebration(false), 1200);
      return () => window.clearTimeout(t);
    }
  }, [celebration]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProofImage(dataUrl);
      setProofStep("preview");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmitProof = () => {
    if (!proofImage || !app) return;
    saveProofImage(proofImage);
    const next = submitTodayProof(app);
    setApp(next);
    if (next.room?.id) {
      addActivity(next.room.id, "proof", `You submitted today's proof.`);
    }
    setProofStep("done");
    setCelebration(true);
  };

  const handleRetake = () => {
    setProofImage(null);
    setProofStep("idle");
  };

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    createPost({
      text: postText.trim(),
      createdAt: new Date().toISOString(),
      image: proofImage ?? undefined,
      authorId: profile?.id || "you",
      authorName: profile?.display_name?.trim() || "You",
      authorUsername: profile?.username?.trim() || "you",
      replyTo: undefined,
    });
    setPostText("");
    setPostVersion((v) => v + 1);
    if (currentRoom?.id) {
      addActivity(currentRoom.id, "post", postText.trim());
    }
  };

  const submitted = isProofSubmittedToday(app);
  const xp = xpProgress(app.xp);
  const profile = loadProfile();
  const account = loadAccount();
  const name = displayName(profile, account);
  const greeting = greetingForHour(new Date().getHours());
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const currentRoom = app.room;

  return (
    <div className="capitol-stack">
      <header className="capitol-animate-in" style={{ animationDelay: "0s" }}>
        <div className="capitol-row" style={{ marginBottom: "0.5rem" }}>
          <div>
            <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>{greeting}, {name}.</h1>
            <p className="capitol-section-sub">{today}</p>
          </div>
          <div className="capitol-cluster">
            <StatBadge icon={<XPIcon width={16} height={16} />} label={`${app.xp.toLocaleString()} XP`} sub={`Level ${xp.level}`} />
            <StatBadge icon={<PPIcon width={16} height={16} />} label={`${app.premiumPoints} PP`} sub="Premium Points" />
          </div>
        </div>

        <div className="capitol-tabs" style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setTab("dashboard")}
            className={`capitol-tab ${tab === "dashboard" ? "capitol-tab-active" : ""}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab("quests")}
            className={`capitol-tab ${tab === "quests" ? "capitol-tab-active" : ""}`}
          >
            Quests
          </button>
        </div>
      </header>

      {tab === "dashboard" ? (
        <div className="capitol-stack">
          {app.graceActive ? (
            <GraceState />
          ) : !currentRoom ? (
            <NoRoomState />
          ) : (
            <>
              <StreakCard streak={app.streak} bestStreak={app.bestStreak} protectedToday={submitted} />

              {currentRoom && (
                <CurrentRoomCard room={currentRoom} />
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ProofSection
                    submitted={submitted}
                    step={proofStep}
                    image={proofImage}
                    remainingMs={remainingMs}
                    inRoom={Boolean(currentRoom)}
                    onUploadCamera={() => cameraInputRef.current?.click()}
                    onPreviewSubmit={handleSubmitProof}
                    onRetake={handleRetake}
                    xpEarned={submitted ? 50 : 0}
                    streak={app.streak}
                    celebration={celebration}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
                <MembersCard room={currentRoom} />
              </div>

              <PostComposer onPost={handleCreatePost} />
              <PostFeed key={postVersion} currentRoom={currentRoom} />
            </>
          )}
        </div>
      ) : (
        <QuestsView />
      )}
    </div>
  );
}

function StatBadge({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div className="capitol-badge" style={{ padding: "0.5rem 0.9rem", borderRadius: "var(--radius-pixel)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "var(--c-text)" }}>{icon}<span className="capitol-section-title" style={{ fontSize: "0.9rem" }}>{label}</span></span>
      {sub && <span style={{ fontSize: "0.78rem", color: "var(--c-text-3)" }}>{sub}</span>}
    </div>
  );
}

function GraceState() {
  return (
    <div className="capitol-empty" style={{ padding: "3rem 2rem" }}>
      <div style={{ marginBottom: "1rem", opacity: 0.9, display: "flex", justifyContent: "center" }}>
        <Coffee size={48} strokeWidth={1.5} />
      </div>
      <h2 className="capitol-section-title" style={{ fontSize: "1.25rem" }}>Grace Active</h2>
      <p className="capitol-section-sub" style={{ marginTop: "0.5rem", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
        Your Capitol activity is paused. Take the time you need.
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.75rem" }}>Grace can be used up to 2 times per month.</p>
    </div>
  );
}

function NoRoomState() {
  return (
    <div className="capitol-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
      <div style={{ marginBottom: "1rem", opacity: 0.9, display: "flex", justifyContent: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2 className="capitol-section-title" style={{ fontSize: "1.25rem" }}>Find your people.</h2>
      <p style={{ fontSize: "0.95rem", color: "var(--c-text-3)", marginTop: "0.5rem", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
        You haven&apos;t joined a room yet. Discover rooms and start building with others.
      </p>
      <Link href="/rooms" className="capitol-btn" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}>Find a room</Link>
    </div>
  );
}

function ProofSection({
  submitted,
  step,
  image,
  remainingMs,
  inRoom,
  onUploadCamera,
  onPreviewSubmit,
  onRetake,
  xpEarned,
  streak,
  celebration,
}: {
  submitted: boolean;
  step: ProofStep;
  image: string | null;
  remainingMs: number;
  inRoom: boolean;
  onUploadCamera: () => void;
  onPreviewSubmit: () => void;
  onRetake: () => void;
  xpEarned: number;
  streak: number;
  celebration: boolean;
}) {
  return (
    <div className={`capitol-card ${submitted || step === "done" ? "" : ""}`} style={{ padding: "1.25rem" }}>
      {celebration && <div className="capitol-animate-pop" aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />}
      {submitted || step === "done" ? (
        <div>
          <div className="capitol-cluster" style={{ marginBottom: "0.75rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--c-text)", color: "#fff", display: "grid", placeItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Today&apos;s proof</p>
              <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>Streak protected. {streak > 0 ? `${streak} day${streak === 1 ? "" : "s"} and counting.` : "Nice work."}</p>
            </div>
          </div>
          {image && (
            <div style={{ borderRadius: "var(--radius-2xs)", overflow: "hidden", border: "1px solid var(--c-line)", marginBottom: "0.75rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Today's proof" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", display: "block" }} />
            </div>
          )}
          <div className="capitol-cluster">
            <span className="capitol-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              +{xpEarned} XP
            </span>
            <span className="capitol-badge">Today complete</span>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/activity" className="capitol-btn-ghost capitol-pill">View in activity</Link>
          </div>
        </div>
      ) : step === "preview" && image ? (
        <div>
          <div className="capitol-cluster" style={{ marginBottom: "0.75rem" }}>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Today&apos;s proof</p>
              <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>This will be shared with your room and count toward your streak.</p>
            </div>
          </div>
          <div style={{ borderRadius: "var(--radius-2xs)", overflow: "hidden", border: "1px solid var(--c-line)", marginBottom: "0.75rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Preview" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", display: "block" }} />
          </div>
          <div className="capitol-cluster">
            <button type="button" onClick={onPreviewSubmit} className="capitol-btn">Submit proof</button>
            <button type="button" onClick={onRetake} className="capitol-btn capitol-btn-ghost">Retake</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="capitol-row" style={{ marginBottom: "0.75rem" }}>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Today&apos;s proof</p>
              <p style={{ fontSize: "0.85rem", color: "var(--c-text-4)" }}>{formatCountdown(remainingMs)} remaining</p>
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{inRoom ? "Show us what you did." : "Join a room to submit proof"}</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", marginTop: "0.35rem" }}>
              {inRoom ? "Submit one piece of proof before your day resets." : "Proof is shared with your room. You need to be in a room before you can submit."}
            </p>
          </div>
          {inRoom ? (
            <div className="capitol-cluster">
              <button type="button" onClick={onUploadCamera} className="capitol-btn" style={{ gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Add proof
              </button>
              <span style={{ fontSize: "0.85rem", color: "var(--c-text-4)" }}>Upload a photo</span>
            </div>
          ) : (
            <div>
              <Link href="/rooms" className="capitol-btn">Find a room</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StreakCard({ streak, bestStreak, protectedToday }: { streak: number; bestStreak: number; protectedToday: boolean }) {
  const nextMilestone = [7, 14, 30, 60, 90, 180, 365].find((m) => m > streak) ?? streak;
  const prevMilestone = [7, 14, 30, 60, 90, 180, 365].filter((m) => m <= streak).pop() ?? 0;
  const progress = nextMilestone > prevMilestone ? Math.min(1, streak / nextMilestone) : 1;

  return (
    <div className="capitol-card" style={{ padding: "1.25rem", borderRadius: "var(--radius-pixel)" }}>
      <div className="capitol-row" style={{ marginBottom: "0.75rem" }}>
        <div className="capitol-cluster">
          <div className="capitol-animate-bounce" style={{ width: 48, height: 48, borderRadius: "var(--radius-pixel)", background: "var(--c-surface-2)", border: "1px solid var(--c-line)", display: "grid", placeItems: "center", color: "var(--c-text)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{streak}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Day streak</span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", marginTop: "0.35rem" }}>{protectedToday ? "You&apos;re protected today." : "Keep your momentum going."}</p>
          </div>
        </div>
        <span className="capitol-badge" style={{ background: protectedToday ? "var(--c-text)" : "var(--c-surface-2)", color: protectedToday ? "#fff" : "var(--c-text)", borderColor: protectedToday ? "var(--c-text)" : "var(--c-line)", borderRadius: "var(--radius-pixel)" }}>
          {protectedToday ? "Protected" : "Active"}
        </span>
      </div>

      <div>
        <div className="capitol-row" style={{ marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>Best streak</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{bestStreak} days</span>
        </div>
        <div style={{ height: 8, borderRadius: "var(--radius-pixel)", background: "var(--c-surface-2)", overflow: "hidden" }}>
          <div className="capitol-animate-in" style={{ height: "100%", width: `${progress * 100}%`, background: "var(--c-text)", borderRadius: "var(--radius-pixel)", transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.5rem" }}>{streak} / {nextMilestone} days</p>
      </div>
    </div>
  );
}

function CurrentRoomCard({ room }: { room: CapitolRoom }) {
  const endDate = new Date(room.startDate);
  endDate.setDate(endDate.getDate() + room.durationDays);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const progress = room.members.length > 0 ? Math.min(100, Math.round((room.members.length / room.maxMembers) * 100)) : 0;

  return (
    <div className="capitol-card" style={{ padding: "1.25rem" }}>
      <div className="capitol-row" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{room.name}</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", marginTop: "0.25rem" }}>{room.goal}</p>
        </div>
        <span className="capitol-badge">{daysRemaining} days left</span>
      </div>
      <div className="capitol-cluster" style={{ gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <span className="capitol-badge">{room.members.length} members</span>
        <span className="capitol-badge">{room.durationDays} days</span>
        <span className="capitol-badge">{room.niche}</span>
      </div>
      <div style={{ marginBottom: "0.75rem" }}>
        <div className="capitol-row" style={{ marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>Room progress</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: 8, borderRadius: "var(--radius-pixel)", background: "var(--c-surface-2)", overflow: "hidden" }}>
          <div className="capitol-animate-in" style={{ height: "100%", width: `${progress}%`, background: "var(--c-text)", borderRadius: "var(--radius-pixel)", transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </div>
      </div>
      <div className="capitol-cluster" style={{ justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>Today&apos;s participation</span>
        <span className="capitol-badge">{room.members.filter((m) => m.streak && m.streak > 0).length}/{room.members.length}</span>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <Link href={`/rooms/${room.id}`} className="capitol-btn" style={{ width: "100%", justifyContent: "center" }}>Open room</Link>
      </div>
    </div>
  );
}

function MembersCard({ room }: { room: CapitolRoom | null }) {
  if (!room) return null;
  const members = room.members.slice(0, 8);
  return (
    <div className="capitol-card" style={{ padding: "1.25rem" }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Members</p>
      <div className="capitol-stack">
        {members.map((member) => {
          const proofStatus = member.streak && member.streak > 0 ? "Submitted" : "Pending";
          return (
            <div key={member.id} className="capitol-cluster" style={{ justifyContent: "flex-start" }}>
              <div className="capitol-avatar" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>
                {member.avatar ?? member.label.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="capitol-row" style={{ flex: 1, minWidth: 0, gap: "0.5rem" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--c-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {member.label} {member.isYou && <span style={{ color: "var(--c-text-4)", fontWeight: 400 }}>(you)</span>}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>{member.streak !== undefined ? `${member.streak}d streak` : "New member"}</p>
                </div>
                <span className={`capitol-badge ${proofStatus === "Submitted" ? "" : "capitol-badge-ghost"}`} style={{ padding: "0.25rem 0.6rem", fontSize: "0.72rem" }}>
                  {proofStatus}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PostComposer({ onPost }: { onPost: () => void }) {
  const [text, setText] = useState("");
  const maxChars = 280;

  return (
    <div className="capitol-card" style={{ padding: "1.25rem" }}>
      <div className="capitol-cluster" style={{ gap: "0.75rem" }}>
        <div className="capitol-avatar" style={{ width: 40, height: 40, fontSize: "0.85rem" }}>
          {loadProfile()?.display_name?.slice(0, 2).toUpperCase() ?? "YO"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="What are you working on?"
            className="capitol-input"
            rows={2}
            style={{ resize: "vertical", minHeight: 60 }}
          />
          <div className="capitol-cluster" style={{ justifyContent: "space-between", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>{text.length}/{maxChars}</span>
             <button onClick={onPost} disabled={!text.trim()} className="capitol-btn" style={{ padding: "0.8rem 1.25rem", fontSize: "0.95rem" }}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostFeed({ currentRoom }: { currentRoom: CapitolRoom | null }) {
  const activities = useMemo(() => {
    if (!currentRoom) return [];
    return getActivities(currentRoom.id).slice(0, 20);
  }, [currentRoom]);

  if (activities.length === 0) {
    return (
      <div className="capitol-card" style={{ padding: "1.25rem" }}>
        <div className="capitol-empty">
          <p>No activity yet.</p>
          <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Start the conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="capitol-stack">
      {activities.map((act) => (
        <div key={act.id} className="capitol-card" style={{ padding: "1.25rem" }}>
          <div className="capitol-cluster" style={{ marginBottom: "0.75rem" }}>
            <div className="capitol-avatar" style={{ width: 40, height: 40, fontSize: "0.85rem" }}>
              {(act.userId ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{act.userId ?? "Unknown"}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>{new Date(act.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </div>
              {act.roomId && <span className="capitol-badge" style={{ marginTop: "0.25rem" }}>Room</span>}
            </div>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--c-text-2)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{act.text}</p>
          {act.image && (
            <div style={{ borderRadius: "var(--radius-2xs)", overflow: "hidden", border: "1px solid var(--c-line)", marginBottom: "0.75rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={act.image} alt="Activity" style={{ width: "100%", maxHeight: "320px", objectFit: "cover", display: "block" }} />
            </div>
          )}
          {act.type === "proof" && (
            <div className="capitol-cluster">
              <span className="capitol-badge" style={{ background: "var(--c-text)", color: "#fff", borderColor: "var(--c-text)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Proof
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QuestsView() {
  const quests = useMemo(() => {
    return [
      {
        id: "quest-1",
        partner: "Anthropic",
        title: "Build with Claude",
        description: "Build something useful with Claude AI assistance.",
        duration: "14 days",
        participants: 3,
        requirements: "Active room membership",
        rewards: "Exclusive Anthropic badge + 500 XP",
      },
    ];
  }, []);

  return (
    <div className="capitol-stack">
      <div>
        <h2 className="capitol-section-title" style={{ fontSize: "1.25rem" }}>Quests</h2>
        <p className="capitol-section-sub">Partnered challenges and special experiences.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quests.map((quest) => (
          <div key={quest.id} className="capitol-card capitol-card-interactive" style={{ padding: "1.5rem" }}>
            <span className="capitol-badge" style={{ marginBottom: "0.75rem" }}>Quest</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{quest.partner} — Capitol</h3>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)", marginTop: "0.35rem" }}>{quest.title}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--c-text-3)", marginTop: "0.35rem" }}>{quest.description}</p>
            <div className="capitol-cluster" style={{ marginTop: "1rem" }}>
              <span className="capitol-badge">{quest.duration}</span>
              <span className="capitol-badge">{quest.participants} participants</span>
            </div>
            <button className="capitol-btn" style={{ width: "100%", marginTop: "1rem" }}>Join Quest</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
