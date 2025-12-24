import Button from "../button/button";
import styles from "./car.module.css";
import settingsIcon from "../../image/section-trips/settings-icon.svg";
import CarImage from "../car-image/car-image";
import Status from "../status/status";
import { Link } from "react-router";

export default function Car({ car, openSettings, openCarForm }) {
  return (
    <Link
      to=""
      style={{ textDecoration: "none", marginBottom: "15px" }}
      onClick={(e) => {
        e.preventDefault();
        openCarForm();
      }}
    >
      <article className={styles.car}>
        {/* <CarImage /> */}

        <div>
          <h3 className={styles.name}>{car.brand}</h3>
          <p className={styles.registrationNumber}>{car.model}</p>
          <p className={styles.registrationNumber}>{car.license_plate}</p>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openSettings();
          }}
          className={styles.settingsButton}
        >
          <img src={settingsIcon} alt="" />
        </Button>
      </article>
    </Link>
  );
}
