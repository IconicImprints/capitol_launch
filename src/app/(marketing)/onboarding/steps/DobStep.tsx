"use client";
import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import ProgressIndicator from "@/components/ProgressIndicator";
import styles from "../styles.module.css";

interface DobStepProps {
  dob: string;
  setDob: (dob: string) => void;
  onNext: () => void;
  step: number;
  totalSteps: number;
}

export default function DobStep({ dob, setDob, onNext, step, totalSteps }: DobStepProps) {
  const [error, setError] = useState<string>("");

  const minDate = "1990-01-01";
  const maxDate = "2013-08-27"; // user must be at least 13

  const handleNext = () => {
    if (!dob) {
      setError("Please select your date of birth");
      return;
    }
    // Simple age check using the maxDate constraint is enough
    setError("");
    onNext();
  };

  return (
    <div className={`${styles.form} ${styles.stepContainer}`}>
      <ProgressIndicator total={totalSteps} current={step + 1} className="mb-4" />
      <h2 className={styles.heading}>When were you born?</h2>
      <p className={styles.subtext}>Select your date of birth (you must be at least 13 years old).</p>
      <InputField
        id="dob"
        label="Date of Birth"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        min={minDate}
        max={maxDate}
        error={error}
        className="w-full rounded-md border border-gray-600 bg-surface-elevated px-3 py-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-capitol-gold focus-visible:ring-offset-2"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={handleNext}
          className={styles.primaryButton}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
