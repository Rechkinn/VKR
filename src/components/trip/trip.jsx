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
import { Link } from "react-router";

export default function Trip({ trip, openSettingsTrip, stateForFormTrip }) {
  function statusInRussian(status) {
    if (trip_type === "own") {
      if (status === "published") {
        return "Создано";
      } else {
        throw new Error("Передан не существующий статус поездки!");
      }
    } else if (trip_type === "delegated") {
      if (status === "published") {
        return "Поиск водителя";
      } else if (status === "pending") {
        return "Получен отклик";
      } else if (status === "confirmed") {
        return "Водитель найден";
      } else if (status === "cancelled") {
        return "Отменено";
      } else if (status === "completed") {
        return "Завершено";
      } else {
        throw new Error("Передан не существующий статус поездки!");
      }
    } else {
      throw new Error("Передан не существующий тип поездки!");
    }
  }

  return (
    <Link
      to="/create-new-trip"
      state={stateForFormTrip}
      style={{ textDecoration: "none" }}
    >
      <article className={styles.trip}>
        <header className={styles.header}>
          <div className={styles.status}>
            <Status>{statusInRussian(trip.status)}</Status>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openSettingsTrip();
            }}
            className={styles.settingsButton}
          >
            <img src={settingsIcon} alt="Иконка настроек" />
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
              {/* <span>{trip.passenger_phone_number}</span> */}
              <a href={`tel:${trip.passenger_phone_number}`}></a>
            </TripInfoLine>
          </div>
        </div>
      </article>
    </Link>
  );
}
