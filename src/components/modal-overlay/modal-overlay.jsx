import { createPortal } from "react-dom";
import styles from "./modal-overlay.module.css";
import { useDispatch, useSelector } from "react-redux";
import { SET_VISIBILITY_MODAL } from "../../services/actions/modal";
import Button from "../button/button";

const elementForRenderModal = document.getElementById("react-modals");

export default function ModalOverlay() {
  const { currentTrip } = useSelector((store) => store.modal);

  const dispatch = useDispatch();
  function closeModal() {
    dispatch({
      type: SET_VISIBILITY_MODAL,
      visibilityModal: false,
    });
  }

  function removeTrip() {
    // отправка экшена для удаления поездки

    const option = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    };

    fetch(
      `https://xn--80aqak6ae.xn--p1ai/api/v1/trips/${currentTrip.id}`,
      option
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка удаления поездки!");
        }
        console.log(response);
      })
      .catch((error) => {
        console.error(error.message);
      });

    closeModal();
    window.location.reload();
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
