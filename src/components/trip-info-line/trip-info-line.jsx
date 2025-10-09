import styles from "./trip-info-line.module.css";

export default function TripInfoLine({ children, needGreyColor = false }) {
  return (
    <p
      className={
        needGreyColor ? `${styles.line} ${styles.grey}` : `${styles.line}`
      }
    >
      {children}
    </p>
  );
}
