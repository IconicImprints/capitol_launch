"use client";
import OnboardingFlow from "./OnboardingFlow";
import styles from "../signup/styles.module.css";

export default function OnboardingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn} />
      <div className={styles.rightColumn}>
        <OnboardingFlow />
      </div>
    </div>
  );
}
