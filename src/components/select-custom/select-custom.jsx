import { useEffect, useState } from "react";
import styles from "./select-custom.module.css";

const SelectCustom = ({
  label,
  disabled = false,
  defaultValue,
  children,
  id,
  name,
}) => {
  const [option, setOption] = useState();
  console.log("option", option);

  useEffect(() => {
    setOption(defaultValue);
  }, [defaultValue]);

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        value={option}
        onChange={(e) => setOption(e.target.value)}
        name={name}
        id={id}
        className={styles.select}
      >
        {children}
      </select>
    </div>
  );
};

export default SelectCustom;
