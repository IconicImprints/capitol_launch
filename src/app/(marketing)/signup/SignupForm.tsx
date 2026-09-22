"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { InputField } from "@/components/InputField";
import { GoogleButton } from "@/components/GoogleButton";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { saveAccount } from "@/lib/capitol-session";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const router = useRouter();
  useEffect(() => {
    if (success) {
      router.push('/onboarding');
    }
  }, [success, router]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // mock async submission
    await new Promise((r) => setTimeout(r, 1500));
    saveAccount({ email });
    setIsSubmitting(false);
    setSuccess(true);
  };


  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.logoWrapper}>
        {/* Assuming logo is in public folder as capitol.svg */}
        <Image src="/capitol.svg" alt="Capitol" width={48} height={48} />
      </div>
      <h1 className={styles.heading}>Create your account</h1>
      <p className={styles.subtext}>Join Capitol to start building habits together.</p>
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
      <InputField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        showToggle
        toggleVisibility={() => setShowPassword((v) => !v)}
        isPasswordVisible={showPassword}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.primaryButton}
      >
        {isSubmitting ? "CreatingÃ¢â‚¬Â¦" : "Create account"}
      </button>
      <div className={styles.divider}>
        <span>or</span>
      </div>
      <GoogleButton />
      <p className={styles.loginPrompt}>
        Already have an account?{' '}
        <Link href="/login" className={styles.loginLink}>Log in</Link>
      </p>
    </form>
  );
}
