import styles from "./day-of-week.module.css";

export default function DayOfWeek({ children }) {
  return <p className={styles.dayOfWeek}>{children}</p>;
}
