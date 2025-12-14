import styles from "./status-pro.module.css";

export default function StatusPro({ children }) {
  return <span className={styles.span}>{children}</span>;
}
