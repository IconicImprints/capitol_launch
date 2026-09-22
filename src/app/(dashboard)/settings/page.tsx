"use client";

import { useMemo, useState } from "react";
import { loadProfile, saveProfile, type CapitolProfile } from "@/lib/capitol-session";

export default function SettingsPage() {
  const profile = useMemo(() => loadProfile(), []);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [dob, setDob] = useState(profile?.dob ?? "");
  const [interest, setInterest] = useState(profile?.interest ?? "");
  const [saved, setSaved] = useState(false);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    const nextProfile: CapitolProfile = {
      ...profile,
      display_name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      dob: dob.trim(),
      interest: interest.trim(),
      avatar: profile?.avatar,
      id: profile?.id ?? "",
      email: profile?.email ?? "",
      current_project: profile?.current_project ?? "",
      status: profile?.status ?? "building",
      created_at: profile?.created_at ?? new Date().toISOString(),
    };
    saveProfile(nextProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Settings</h1>
        <p className="capitol-section-sub">Manage your Capitol profile and preferences.</p>
      </div>

      <div className="capitol-card" style={{ padding: "1.5rem" }}>
        <div className="capitol-stack">
          <Field label="Display name" value={name} onChange={setName} placeholder="Your name" />
          <Field label="Username" value={username} onChange={setUsername} placeholder="@username" />
          <Field label="Bio" value={bio} onChange={setBio} placeholder="Tell us about yourself" />
          <Field label="Date of birth" type="date" value={dob} onChange={setDob} />
          <Field label="Interest" value={interest} onChange={setInterest} placeholder="e.g. Fitness, Code, Art" />

          <div className="capitol-cluster" style={{ marginTop: "0.5rem" }}>
            <button onClick={handleSave} disabled={!canSave} className="capitol-btn" aria-disabled={!canSave}>
              Save changes
            </button>
            {saved && <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>Saved.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <span className="capitol-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="capitol-input"
      />
    </label>
  );
}
