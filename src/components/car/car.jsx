import Button from "../button/button";
import styles from "./car.module.css";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import CarImage from "../car-image/car-image";

export default function Car({ trip }) {
  return (
    <article className={styles.car}>
      <CarImage />

      <div>
        <h3 className={styles.name}>Toyota Camry</h3>
        <p className={styles.registrationNumber}>А432МР70</p>
      </div>

      <Button className={styles.settingsButton}>
        <img src={settingsIcon} alt="" />
      </Button>
    </article>
  );
}
