import Button from "../button/button";
import styles from "./trip.module.css";
import carIcon from "../../image/section-trips/car-status.svg";
import startPointIcon from "../../image/section-trips/start-point-icon.svg";
import endPointIcon from "../../image/section-trips/end-point-icon.svg";
import watchIcon from "../../image/section-trips/watch-icon.svg";
import phoneIcon from "../../image/section-trips/phone-icon.svg";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import TripInfoLine from "../trip-info-line/trip-info-line";
import Status from "../status/status";

export default function Trip({ trip, openSettingsTrip }) {
  function statusInRussian(status) {
    if (status === "published") {
      return "Опубликовано";
    } else if (status === "pending") {
      return "Ожидание";
    } else if (status === "confirmed") {
      return "Подтверждено";
    } else if (status === "cancelled") {
      return "Отменено";
    } else if (status === "completed") {
      return "Завершено";
    } else {
      throw new Error("Передан не существующий статус поездки!");
    }
  }

  return (
    <>
      <article className={styles.trip}>
        <header className={styles.header}>
          <div className={styles.status}>
            <Status>{statusInRussian(trip.status)}</Status>
            {/* <img
              src={carIcon}
              alt="Иконка автомобиля"
              className={styles.carIcon}
            /> */}
          </div>
          <Button onClick={openSettingsTrip}>
            <img
              src={settingsIcon}
              alt="Иконка настроек"
              className={styles.carIcon}
            />
          </Button>
        </header>

        <div className={styles.info}>
          <TripInfoLine>
            <img src={startPointIcon} alt="Иконка начальной точки" />
            <span className={styles.address}>{trip.from_address}</span>
          </TripInfoLine>
          <TripInfoLine>
            <img src={endPointIcon} alt="Иконка конечной точки" />
            <span className={styles.address}>{trip.to_address}</span>
          </TripInfoLine>
          <div className={styles.containerTimeAndPhone}>
            <TripInfoLine needGreyColor>
              <img src={watchIcon} alt="Иконка часов" />
              <span>
                {trip.departure_datetime.split("T")[0] +
                  " " +
                  trip.departure_datetime.split("T")[1].slice(0, 5)}
              </span>
            </TripInfoLine>
            <TripInfoLine needGreyColor>
              <img src={phoneIcon} alt="Иконка телефонной трубки" />
              <span>{trip.passenger_phone_number}</span>
            </TripInfoLine>
          </div>
        </div>

        {/* {trip.status === ACTIVE_TAB && (
        <Button className={`yellow ${styles.buttonFinishTrip}`}>
          Завершить поездку
        </Button>
      )} */}
      </article>
    </>
  );
}
