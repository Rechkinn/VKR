import { createPortal } from "react-dom";
import styles from "./modal-overlay.module.css";

const elementForRenderModal = document.getElementById("react-modals");

export default function ModalOverlay({ children, closeModal = null }) {
  return createPortal(
    <div className={styles.modalOverlay} onClick={closeModal}>
      {children}
    </div>,
    elementForRenderModal
  );
}
