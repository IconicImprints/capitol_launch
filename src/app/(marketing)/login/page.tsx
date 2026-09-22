import React from "react";
import LoginForm from "./LoginForm";
import styles from "../signup/styles.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn} />
      <div className={styles.rightColumn}>
        <LoginForm />
      </div>
    </div>
  );
}
