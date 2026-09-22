"use client";
import React, { useState } from "react";
import ProgressIndicator from "@/components/ProgressIndicator";
import styles from "../styles.module.css";

interface NicheStepProps {
  niche: string;
  setNiche: (niche: string) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

export default function NicheStep({ niche, setNiche, onNext, onBack, step, totalSteps }: NicheStepProps) {
  const [error, setError] = useState<string>("");
  const niches = ["Startups", "Tech", "Creative", "Fitness"];

  const handleNext = () => {
    if (!niche) {
      setError("Please select a niche");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className={`${styles.form} ${styles.stepContainer}`}>
      <div style={{ marginBottom: "1cm" }}>
        <ProgressIndicator total={totalSteps} current={step + 1} />
      </div>
      <h2 className={styles.heading}>What best describes you?</h2>
      <p className={styles.subtext}>Choose one of the following categories.</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {niches.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setNiche(item)}
            className={
              "w-full py-2 rounded-md border " +
              (niche === item
                ? "border-capitol-gold bg-capitol-gold/10"
                : "border-gray-600 bg-surface-elevated")
            }
          >
            {item}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <div className="mt-2 flex justify-center space-x-4">
        <button type="button" onClick={onBack} className={styles.primaryButton}>
          Back
        </button>
        <button type="button" onClick={handleNext} className={styles.primaryButton}>
          Continue
        </button>
      </div>
    </div>
  );
}
