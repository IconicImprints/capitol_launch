"use client";
import React from "react";
import styles from "../styles.module.css";

interface CompletionStepProps {
  onEnter: () => void;
}

export default function CompletionStep({ onEnter }: CompletionStepProps) {
  return (
    <div className={`${styles.form} ${styles.stepContainer}`} style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "1cm" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--c-text, #111)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1rem",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <h2 className={styles.heading}>You&apos;re ready.</h2>
      <p className={styles.subtext} style={{ marginBottom: "1.5rem" }}>
        Your builder profile is set up. Time to find your people and start building.
      </p>
      <button type="button" onClick={onEnter} className={styles.primaryButton}>
        Enter Capitol
      </button>
    </div>
  );
}
