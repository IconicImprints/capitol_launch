"use client";
import React, { useState } from "react";
import Image from "next/image";
import { InputField } from "@/components/InputField";
import { GoogleButton } from "@/components/GoogleButton";
import styles from "../signup/styles.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveAccount } from "@/lib/capitol-session";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setAuthError("");
    await new Promise((r) => setTimeout(r, 1200));
    saveAccount({ email });
    setIsSubmitting(false);
    router.push("/home");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.logoWrapper}>
        <Image src="/capitol.svg" alt="Capitol" width={48} height={48} />
      </div>
      <h1 className={styles.heading}>Welcome back</h1>
      <p className={styles.subtext}>Sign in to continue building.</p>
      {authError && <p className="text-red-500 text-sm">{authError}</p>}
      <InputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        showToggle
        toggleVisibility={() => setShowPassword((v) => !v)}
        isPasswordVisible={showPassword}
      />
      <p className={styles.loginPrompt} style={{ textAlign: "right", marginBottom: "0.5rem" }}>
        <Link href="/forgot-password" className={styles.loginLink}>Forgot password?</Link>
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.primaryButton}
      >
        {isSubmitting ? "Signing inâ€¦" : "Sign in"}
      </button>
      <div className={styles.divider}>
        <span>or</span>
      </div>
      <GoogleButton />
      <p className={styles.loginPrompt}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className={styles.loginLink}>Create account</Link>
      </p>
    </form>
  );
}
