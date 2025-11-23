import Button from "../button/button";
import styles from "./car.module.css";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import CarImage from "../car-image/car-image";
import Status from "../status/status";

export default function Car({ car, openSettings }) {
  return (
    <article className={styles.car}>
      <CarImage />

      <div>
        <h3 className={styles.name}>{car.brand}</h3>
        <p className={styles.registrationNumber}>{car.model}</p>
        <p className={styles.registrationNumber}>{car.license_plate}</p>
      </div>

      {car.is_active && <Status extraClass={styles.carStatus}>Активно</Status>}

      <Button onClick={openSettings} className={styles.settingsButton}>
        <img src={settingsIcon} alt="" />
      </Button>
    </article>
  );
}
