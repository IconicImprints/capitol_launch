"use client";
import React from "react";
import styles from "./ProgressIndicator.module.css";

interface ProgressIndicatorProps {
  total: number;
  current: number; // 1‑based current step
  className?: string;
}

export default function ProgressIndicator({ total, current, className = "" }: ProgressIndicatorProps) {
  return (
    <div className={`${styles.container} ${className}`.trim()} aria-label="progress">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`${styles.circle} ${i < current ? styles.active : ""}`}
        />
      ))}
    </div>
  );
}
