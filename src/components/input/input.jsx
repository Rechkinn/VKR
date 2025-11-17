import { useState } from "react";
import styles from "./input.module.css";

export default function Input({
  label = "",
  // type = "text",
  name = "",
  initialValue = "",
  className = "",
  iconForLabel = null,
  errorText = "",
  ...props
}) {
  const [valueInput, setValueInput] = useState(initialValue);

  return (
    <div>
      <label htmlFor={name} className={styles.label}>
        {iconForLabel && (
          <img
            src={iconForLabel}
            alt="Иконка дял label"
            className={styles.iconForLabel}
          />
        )}
        {label}
      </label>
      <input
        {...props}
        id={name}
        name={name}
        value={valueInput}
        onChange={(event) => {
          setValueInput(event.target.value);
        }}
        className={`${styles.input} ${className}`}
      />
      {errorText && <p className={styles.errorText}>{errorText}</p>}
    </div>
  );
}
