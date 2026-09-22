"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CapitolRoomType, createRoom, loadAppState, saveAppState } from "@/lib/capitol-session";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function CreateRoomPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [niche, setNiche] = useState("Coding / Building");
  const [minMembers, setMinMembers] = useState(3);
  const [maxMembers, setMaxMembers] = useState(5);
  const [ageMin, setAgeMin] = useState(13);
  const [ageMax, setAgeMax] = useState(17);
  const [durationDays, setDurationDays] = useState(14);
  const [type, setType] = useState<CapitolRoomType>("Standard");
  const [dailyProof, setDailyProof] = useState(true);
  const proofDeadline = "23:59";
  const [allowInvites, setAllowInvites] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const autoReplace = true;
  const visibility: "Public" | "Discoverable" | "Private" = "Discoverable";

  const canNext = () => {
    if (step === 1) return name.trim() && goal.trim() && description.trim();
    if (step === 2) return minMembers >= 3 && maxMembers >= minMembers && ageMin > 0 && ageMax > ageMin;
    if (step === 3) return durationDays > 0;
    return true;
  };

  const handleCreate = () => {
    const today = new Date().toISOString().split("T")[0];
    const created = createRoom({
      name: name.trim(),
      goal: goal.trim(),
      description: description.trim(),
      niche,
      creator: "You",
      creatorAvatar: "YO",
      minMembers,
      maxMembers,
      ageRange: { min: ageMin, max: ageMax },
      durationDays,
      startDate: today,
      type,
      rules: {
        dailyProof,
        proofDeadline,
        allowInvites,
        approvalRequired,
        autoReplace,
        visibility,
      },
    });

    const app = loadAppState();
    saveAppState({ ...app, room: { ...created, members: [{ id: "you", label: "You", isYou: true }] } });
    router.push(`/rooms/${created.id}`);
  };

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Create a room</h1>
        <p className="capitol-section-sub">Step {step} of 6</p>
      </div>

      <div className="capitol-row" style={{ gap: "0.5rem" }}>
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div key={s} className="capitol-progress-track" style={{ flex: 1, padding: 0 }}>
            <div className="capitol-progress-bar" style={{ height: 6 }}>
              <div className="capitol-progress-fill" style={{ width: s <= step ? "100%" : "0%" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="capitol-card" style={{ padding: "1.5rem" }}>
        {step === 1 && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Basic Information</h2>
            <label className="capitol-label">Room name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Startup Sprint" className="capitol-input" />
            <label className="capitol-label">Goal</label>
            <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What are you building toward?" className="capitol-input" />
            <label className="capitol-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what members will do..." rows={4} className="capitol-input" style={{ resize: "none" }} />
            <label className="capitol-label">Niche</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)} className="capitol-input">
              <option>Coding / Building</option>
              <option>Video / Content</option>
              <option>Design / UI-UX</option>
              <option>Startup / Business</option>
              <option>Fitness</option>
              <option>Creative</option>
              <option>Tech</option>
              <option>Other</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Settings</h2>
            <label className="capitol-label">Duration</label>
            <select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="capitol-input">
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
            <label className="capitol-label">Max members</label>
            <select value={maxMembers} onChange={(e) => { setMaxMembers(Number(e.target.value)); setMinMembers(Math.min(minMembers, Number(e.target.value))); }} className="capitol-input">
              {[3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <label className="capitol-label">Age range</label>
            <div className="capitol-cluster" style={{ gap: "0.75rem" }}>
              <input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className="capitol-input" />
              <span className="capitol-section-sub">to</span>
              <input type="number" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} className="capitol-input" />
            </div>
            <div className="capitol-quest-badge-card" style={{ marginTop: "0.5rem" }}>
              <div>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--c-text)" }}>Elite room</p>
                <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.25rem" }}>Stricter accountability, custom roles, higher stakes</p>
              </div>
              <button
                type="button"
                onClick={() => setType(type === "Standard" ? "Elite" : "Standard")}
                className={`capitol-pill ${type === "Elite" ? "capitol-pill-active" : ""}`}
                style={{ minWidth: "3.5rem", justifyContent: "center" }}
              >
                {type === "Elite" ? "On" : "Off"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && type === "Elite" && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Role Setup</h2>
            <p className="capitol-section-sub">Configure the roles available in your elite room. Assign slots now Ã¢â‚¬â€ members fill them when they join.</p>
            <div className="capitol-stack">
              {["Captain", "Coach", "Enforcer", "Analyst", "Motivator", "Member"].map((role) => (
                <div key={role} className="capitol-quest-badge-card">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--c-text)" }}>{role}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.25rem", lineHeight: 1.5 }}>
                      {role === "Captain" ? "Leads the room, pins announcements, can kick members" : role === "Coach" ? "Guides members, posts daily prompts, reviews proofs" : role === "Enforcer" ? "Monitors compliance, flags late submissions" : role === "Analyst" ? "Tracks group stats, posts weekly summaries" : role === "Motivator" ? "Boosts morale, celebrates wins" : "Standard participant"}
                    </p>
                  </div>
                  {role === "Captain" && <span className="capitol-badge capitol-badge-solid">You</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Room Rules</h2>
            <div className="capitol-stack">
              <div className="capitol-quest-badge-card">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--c-text)" }}>Daily proof required</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.25rem" }}>Members must submit proof every day</p>
                </div>
                <button type="button" onClick={() => setDailyProof(!dailyProof)} className={`capitol-pill ${dailyProof ? "capitol-pill-active" : ""}`} style={{ minWidth: "3.5rem", justifyContent: "center" }}>
                  {dailyProof ? "On" : "Off"}
                </button>
              </div>
              <div className="capitol-quest-badge-card">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--c-text)" }}>Allow invites</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.25rem" }}>Members can invite others</p>
                </div>
                <button type="button" onClick={() => setAllowInvites(!allowInvites)} className={`capitol-pill ${allowInvites ? "capitol-pill-active" : ""}`} style={{ minWidth: "3.5rem", justifyContent: "center" }}>
                  {allowInvites ? "On" : "Off"}
                </button>
              </div>
              <div className="capitol-quest-badge-card">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--c-text)" }}>Approval required</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginTop: "0.25rem" }}>New members need approval</p>
                </div>
                <button type="button" onClick={() => setApprovalRequired(!approvalRequired)} className={`capitol-pill ${approvalRequired ? "capitol-pill-active" : ""}`} style={{ minWidth: "3.5rem", justifyContent: "center" }}>
                  {approvalRequired ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Review</h2>
            <div className="capitol-stack">
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Room name</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{name}</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Goal</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{goal}</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Niche</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{niche}</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Age range</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{ageMin}Ã¢â‚¬â€œ{ageMax}</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Members</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{minMembers}Ã¢â‚¬â€œ{maxMembers}</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Duration</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{durationDays} days</span>
              </div>
              <div className="capitol-row" style={{ borderBottom: "1px solid var(--c-line)" }}>
                <span className="capitol-section-sub">Type</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{type}</span>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="capitol-stack">
            <h2 className="capitol-section-title" style={{ fontSize: "1.15rem" }}>Ready to launch</h2>
            <p className="capitol-section-sub">Your room will be created and you&apos;ll be added as the first member.</p>
          </div>
        )}
      </div>

      <div className="capitol-row">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
          disabled={step === 1}
          className="capitol-btn capitol-btn-ghost"
          style={{ opacity: step === 1 ? 0.5 : 1 }}
        >
          Ã¢â€ Â Back
        </button>
        {step < 6 ? (
          <button type="button" onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canNext()} className="capitol-btn" style={{ opacity: canNext() ? 1 : 0.5 }}>
            Continue
          </button>
        ) : (
          <button type="button" onClick={handleCreate} className="capitol-btn">
            Create Room
          </button>
        )}
      </div>
    </div>
  );
}
