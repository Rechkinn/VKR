import styles from "./trip-status.module.css";

export default function TripStatus({ children, ...props }) {
  return <div className={styles.tripStatus}>{children}</div>;
}
