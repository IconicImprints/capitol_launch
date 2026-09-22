"use client";
import React, { useState } from "react";
import { InputField } from "@/components/InputField";
import styles from "../signup/styles.module.css";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Enter a valid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className={styles.successMessage}>
        <h2 className={styles.heading}>Reset link sent</h2>
        <p className={styles.subtext}>Check your email for a password reset link.</p>
        <Link href="/login" className={styles.loginLink}>Back to login</Link>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.logoWrapper}>
        <Image src="/capitol.svg" alt="Capitol" width={48} height={48} />
      </div>
      <h1 className={styles.heading}>Forgot your password?</h1>
      <p className={styles.subtext}>Enter your email and weÃ¢â‚¬â„¢ll send you a reset link.</p>
      <InputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.primaryButton}
      >
        {isSubmitting ? "SendingÃ¢â‚¬Â¦" : "Send reset link"}
      </button>
      <p className={styles.loginPrompt} style={{ marginTop: "1rem" }}>
        Remembered your password?{' '}
        <Link href="/login" className={styles.loginLink}>Back to login</Link>
      </p>
    </form>
  );
}
