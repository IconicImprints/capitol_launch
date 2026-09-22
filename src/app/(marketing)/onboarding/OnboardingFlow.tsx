"use client";
import React, { useState } from "react";
import DobStep from "./steps/DobStep";
import NicheStep from "./steps/NicheStep";
import ProfileStep from "./steps/ProfileStep";
import CompletionStep from "./steps/CompletionStep";
import ProgressIndicator from "@/components/ProgressIndicator";
import { useRouter } from "next/navigation";
import { saveProfile, type CapitolProfile } from "@/lib/capitol-session";
import styles from "./styles.module.css";

interface OnboardingData {
  dob: string;
  niche: string;
  name: string;
  username: string;
  bio: string;
  avatar?: string;
}

const steps = ["dob", "niche", "profile", "completion"] as const;

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    dob: "",
    niche: "",
    name: "",
    username: "",
    bio: "",
    avatar: "",
  });
  const router = useRouter();

  const goNext = () => setCurrentStep((c) => Math.min(c + 1, steps.length - 1));
  const goBack = () => setCurrentStep((c) => Math.max(c - 1, 0));

  const handleSubmit = () => {
    const profile: CapitolProfile = {
      id: `profile-${Date.now()}`,
      email: "",
      username: data.username,
      display_name: data.name,
      dob: data.dob,
      interest: data.niche,
      bio: data.bio,
      avatar: data.avatar,
      current_project: "",
      status: "building",
      created_at: new Date().toISOString(),
    };
    saveProfile(profile);
    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <ProgressIndicator total={steps.length} current={currentStep + 1} />
      {currentStep === 0 && (
        <DobStep
          dob={data.dob}
          setDob={(dob) => setData((d) => ({ ...d, dob }))}
          onNext={goNext}
          step={0}
          totalSteps={steps.length}
        />
      )}
      {currentStep === 1 && (
        <NicheStep
          niche={data.niche}
          setNiche={(niche) => setData((d) => ({ ...d, niche }))}
          onNext={goNext}
          onBack={goBack}
          step={1}
          totalSteps={steps.length}
        />
      )}
      {currentStep === 2 && (
        <ProfileStep
          name={data.name}
          username={data.username}
          bio={data.bio}
          avatar={data.avatar}
          setName={(v) => setData((d) => ({ ...d, name: v }))}
          setUsername={(v) => setData((d) => ({ ...d, username: v }))}
          setBio={(v) => setData((d) => ({ ...d, bio: v }))}
          setAvatar={(v) => setData((d) => ({ ...d, avatar: v }))}
          onBack={goBack}
          onSubmit={goNext}
          step={2}
          totalSteps={steps.length}
        />
      )}
      {currentStep === 3 && (
        <CompletionStep onEnter={handleSubmit} />
      )}
    </div>
  );
}
