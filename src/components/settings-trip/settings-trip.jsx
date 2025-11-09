import { useDispatch, useSelector } from "react-redux";
import ModalOverlay from "../modal-overlay/modal-overlay";
import styles from "./settings-trip.module.css";
import { removeTrip } from "../../services/actions/trips";
import Loader from "../loader/loader";
import Button from "../button/button";

export default function SettingsTrip({ closeSettings = null }) {
  const { tripForSettings, removeTripRequest, removeTripRequestError } =
    useSelector((store) => store.trips);

  const dispatch = useDispatch();
  function tryRemoveTrip() {
    dispatch(removeTrip(tripForSettings.id, closeSettings));
  }

  return (
    <ModalOverlay closeModal={closeSettings}>
      <div className={styles.containerForButton}>
        {removeTripRequest && <Loader>Пробуем удалить поездку...</Loader>}
        {!removeTripRequest && removeTripRequestError && (
          <p>Не удалось выполнить удаление поездки!</p>
        )}
        <Button
          className="modal modalUpper"
          onClick={(e) => e.stopPropagation()}
        >
          Изменить
        </Button>
        <Button className="modal modalLower" onClick={tryRemoveTrip}>
          Удалить
        </Button>
        <Button className="modal modalSingle" onClick={closeSettings}>
          Отмена
        </Button>
      </div>
    </ModalOverlay>
  );
}
