import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import styles from "../signup/styles.module.css";

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn} />
      <div className={styles.rightColumn}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
