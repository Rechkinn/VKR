import { useEffect, useState } from "react";
import styles from "./preview-bar.module.css";

export default function PreviewBar({
  countAll,
  countCompleted,
  className = "",
}) {
  const [arrayForRender, setArrayForRender] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < countCompleted; i++) {
      arr.push(true);
    }
    for (let i = 0; i < countAll - countCompleted; i++) {
      arr.push(false);
    }
    setArrayForRender(arr);
  }, [countAll, countCompleted]);

  return (
    <div className={`${styles.container} ${className}`}>
      {arrayForRender.map((completed, i) => {
        return (
          <div
            key={i}
            className={
              completed ? `${styles.completed}` : `${styles.notCompleted}`
            }
          ></div>
        );
      })}
    </div>
  );
}
