import styles from "./navbar.module.css";
import userIcon from "../../image/navbar/user.svg";
import carIcon from "../../image/navbar/car.svg";
import calendarIcon from "../../image/navbar/calendar.svg";
import userActiveIcon from "../../image/navbar/userActive.svg";
import carActiveIcon from "../../image/navbar/carActive.svg";
import calendarActiveIcon from "../../image/navbar/calendarActive.svg";

export default function Navbar({ activeSection, setActiveSection }) {
  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li} onClick={() => setActiveSection("profile")}>
          <a href="#" className={styles.a}>
            <img
              src={activeSection === "profile" ? userActiveIcon : userIcon}
              alt="Иконка пользователя"
              className={styles.icon}
            />
            <p
              className={
                activeSection === "profile"
                  ? `${styles.text} ${styles.active}`
                  : `${styles.text}`
              }
            >
              Профиль
            </p>
          </a>
        </li>
        <li className={styles.li} onClick={() => setActiveSection("trips")}>
          <a href="#" className={styles.a}>
            <img
              src={activeSection === "trips" ? carActiveIcon : carIcon}
              alt="Иконка авто"
              className={styles.icon}
            />
            <p
              className={
                activeSection === "trips"
                  ? `${styles.text} ${styles.active}`
                  : `${styles.text}`
              }
            >
              Поездки
            </p>
          </a>
        </li>
        <li className={styles.li} onClick={() => setActiveSection("calendar")}>
          <a href="#" className={styles.a}>
            <img
              src={
                activeSection === "calendar" ? calendarActiveIcon : calendarIcon
              }
              alt="Иконка календаря"
              className={styles.icon}
            />
            <p
              className={
                activeSection === "calendar"
                  ? `${styles.text} ${styles.active}`
                  : `${styles.text}`
              }
            >
              Календарь
            </p>
          </a>
        </li>
      </ul>
    </nav>
  );
}
