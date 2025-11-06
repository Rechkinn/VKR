import { createPortal } from "react-dom";
import styles from "./loader.module.css";

const elementForRenderLoader = document.getElementById("react-loader");

export default function Loader({ children }) {
  return createPortal(
    <div className={styles.containerLoader}>
      <span className={styles.loader}></span>
      {children && <p className={styles.text}>{children}</p>}
    </div>,
    elementForRenderLoader
  );
}
