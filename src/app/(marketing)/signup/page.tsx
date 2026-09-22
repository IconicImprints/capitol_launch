import React from "react";
import SignupForm from "./SignupForm";
import styles from "./styles.module.css";

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn} />
      <div className={styles.rightColumn}>
        <SignupForm />
      </div>
    </div>
  );
}
