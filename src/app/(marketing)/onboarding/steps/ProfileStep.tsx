"use client";
import React, { useState, useRef } from "react";
import { InputField } from "@/components/InputField";
import ProgressIndicator from "@/components/ProgressIndicator";
import styles from "../styles.module.css";

interface ProfileStepProps {
  step: number;
  totalSteps: number;
  name: string;
  username: string;
  bio: string;
  avatar?: string;
  setName: (v: string) => void;
  setUsername: (v: string) => void;
  setBio: (v: string) => void;
  setAvatar: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ProfileStep({
  name,
  username,
  bio,
  avatar,
  setName,
  setUsername,
  setBio,
  setAvatar,
  onBack,
  onSubmit,
  step,
  totalSteps,
}: ProfileStepProps) {
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Display name is required";
    if (!username.trim()) newErrors.username = "Username is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`${styles.form} ${styles.stepContainer}`}>
      <div style={{ marginBottom: "1cm" }}>
        <ProgressIndicator total={totalSteps} current={step + 1} />
      </div>
      <h2 className={styles.heading}>Complete your profile</h2>
      <p className={styles.subtext}>This is your builder identity on Capitol.</p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px dashed var(--c-line, #ccc)",
            background: avatar ? `url(${avatar}) center/cover` : "var(--c-surface-2, #f5f5f5)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--c-text-3, #888)",
            fontSize: "0.85rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {!avatar && initials || ""}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <InputField
        id="displayName"
        label="Display name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <InputField
        id="username"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
      />
      <div className="flex flex-col gap-1 mt-2">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Short bio (optional)
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-md border border-gray-600 bg-surface-elevated px-3 py-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-capitol-gold focus-visible:ring-offset-2"
          rows={3}
        />
      </div>
      <div className="flex justify-center space-x-4" style={{ marginTop: "1cm" }}>
        <button type="button" onClick={onBack} className={styles.primaryButton}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} className={styles.primaryButton}>
          Continue
        </button>
      </div>
    </div>
  );
}
