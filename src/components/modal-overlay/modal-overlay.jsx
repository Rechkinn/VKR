import { createPortal } from "react-dom";
import styles from "./modal-overlay.module.css";
import { useDispatch } from "react-redux";
import { SET_VISIBILITY_MODAL } from "../../services/actions/modal";
import Button from "../button/button";

const elementForRenderModal = document.getElementById("react-modals");

export default function ModalOverlay() {
  const dispatch = useDispatch();
  function closeModal() {
    dispatch({
      type: SET_VISIBILITY_MODAL,
      visibilityModal: false,
    });
  }

  function removeTrip() {
    // отправка экшена для удаления поездки
    closeModal();
  }

  return createPortal(
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.containerForButton}>
        <Button
          className="modal modalUpper"
          onClick={(e) => e.stopPropagation()}
        >
          Изменить
        </Button>
        <Button className="modal modalLower" onClick={removeTrip}>
          Удалить
        </Button>
        <Button className="modal modalSingle" onClick={closeModal}>
          Отмена
        </Button>
      </div>
    </div>,
    elementForRenderModal
  );
}
