import { useState } from "react";
import styles from "./input.module.css";

export default function Input({
  label = "",
  type = "text",
  name = "",
  initialValue = "",
  className = "",
  ...props
}) {
  const [valueInput, setValueInput] = useState(initialValue);

  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        {...props}
        id={name}
        name={name}
        value={valueInput}
        onChange={(event) => setValueInput(event.target.value)}
        className={`${styles.input} ${className}`}
      />
    </div>
  );
}
