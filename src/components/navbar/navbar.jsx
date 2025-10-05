import styles from "./navbar.module.css";
import userIcon from "../../image/navbar/user.svg";
import carIcon from "../../image/navbar/car.svg";
import calendarIcon from "../../image/navbar/calendar.svg";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <a href="#" className={styles.a}>
            <img src={userIcon} alt="" className={styles.icon} />
            <p className={styles.text}>Профиль</p>
          </a>
        </li>
        <li className={styles.li}>
          <a href="#" className={styles.a}>
            <img src={carIcon} alt="" className={styles.icon} />
            <p className={styles.text}>Поездки</p>
          </a>
        </li>
        <li className={styles.li}>
          <a href="#" className={styles.a}>
            <img src={calendarIcon} alt="" className={styles.icon} />
            <p className={styles.text}>Календарь</p>
          </a>
        </li>
      </ul>
    </nav>
  );
}
