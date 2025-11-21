import Button from "../button/button";
import styles from "./car.module.css";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import CarImage from "../car-image/car-image";

export default function Car({ car }) {
  return (
    <article className={styles.car}>
      <CarImage />

      <div>
        <h3 className={styles.name}>{car.brand}</h3>
        <p className={styles.registrationNumber}>{car.model}</p>
        <p className={styles.registrationNumber}>{car.license_plate}</p>
      </div>

      {car.is_active && <div className={styles.carStatus}>Активно</div>}

      <Button className={styles.settingsButton}>
        <img src={settingsIcon} alt="" />
      </Button>
    </article>
  );
}
