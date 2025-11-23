import styles from "./status.module.css";

export default function Status({ children, extraClass = "", ...props }) {
  const stylesStr = `${styles.status} ${extraClass}`.trim();
  return <div className={stylesStr}>{children}</div>;
}
