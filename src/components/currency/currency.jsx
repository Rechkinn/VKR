import styles from "./currency.module.css";

export default function Currency({ children }) {
  return <div className={styles.currency}>{children}</div>;
}
