import ModalOverlay from "../modal-overlay/modal-overlay";
import styles from "./settings.module.css";

export default function Settings({ closeSettings, children }) {
  return (
    <ModalOverlay closeModal={closeSettings}>
      <div className={styles.containerForButton}>{children}</div>
    </ModalOverlay>
  );
}
