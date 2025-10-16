import Button from "../button/button";
import TripStatus from "../trip-status/trip-status";
import styles from "./trip.module.css";
import carIcon from "../../image/section-trips/car-status.svg";
import startPointIcon from "../../image/section-trips/start-point-icon.svg";
import endPointIcon from "../../image/section-trips/end-point-icon.svg";
import watchIcon from "../../image/section-trips/watch-icon.svg";
import phoneIcon from "../../image/section-trips/phone-icon.svg";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import TripInfoLine from "../trip-info-line/trip-info-line";
import { ACTIVE_TAB } from "../../utils/consts";
import { useDispatch } from "react-redux";
import { SET_VISIBILITY_MODAL } from "../../services/actions/modal";

export default function Trip({ status }) {
  const dispatch = useDispatch();
  function openModal() {
    dispatch({
      type: SET_VISIBILITY_MODAL,
      visibilityModal: true,
    });
  }

  return (
    <article className={styles.trip}>
      <header className={styles.header}>
        <div className={styles.status}>
          <TripStatus>{status}</TripStatus>
          <img
            src={carIcon}
            alt="Иконка автомобиля"
            className={styles.carIcon}
          />
        </div>
        <Button onClick={openModal}>
          <img
            src={settingsIcon}
            alt="Иконка автомобиля"
            className={styles.carIcon}
          />
        </Button>
      </header>

      <div className={styles.info}>
        <TripInfoLine>
          <img src={startPointIcon} alt="Иконка начальной точки" />
          <span>Новокузнецк, Аэропорт</span>
        </TripInfoLine>
        <TripInfoLine>
          <img src={endPointIcon} alt="Иконка конечной точки" />
          <span>Шерегеш, Весенняя 72</span>
        </TripInfoLine>
        <div className={styles.containerTimeAndPhone}>
          <TripInfoLine needGreyColor>
            <img src={watchIcon} alt="Иконка часов" />
            <span>Сегодня 12:00</span>
          </TripInfoLine>
          <TripInfoLine needGreyColor>
            <img src={phoneIcon} alt="Иконка телефонной трубки" />
            <span>+7(923)777-23-32</span>
          </TripInfoLine>
        </div>
      </div>

      {status === ACTIVE_TAB && (
        <Button className={`yellow ${styles.buttonFinishTrip}`}>
          Завершить поездку
        </Button>
      )}
    </article>
  );
}
