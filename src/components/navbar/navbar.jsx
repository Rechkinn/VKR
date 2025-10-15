import styles from "./navbar.module.css";
import userIcon from "../../image/navbar/user.svg";
import carIcon from "../../image/navbar/car.svg";
import calendarIcon from "../../image/navbar/calendar.svg";
import userActiveIcon from "../../image/navbar/userActive.svg";
import carActiveIcon from "../../image/navbar/carActive.svg";
import calendarActiveIcon from "../../image/navbar/calendarActive.svg";
import { useDispatch, useSelector } from "react-redux";
import { SET_ACTIVE_SECTION_NAVBAR } from "../../services/actions/navbar";
import { CALENDAR, PROFILE, TRIPS } from "../../utils/consts";
import NavbarLink from "../navbar-link/navbar-link";

export default function Navbar() {
  const { visibility } = useSelector((store) => store.navbar);

  const dispatch = useDispatch();
  function setActiveSection(section) {
    dispatch({
      type: SET_ACTIVE_SECTION_NAVBAR,
      activeSection: section,
    });
  }

  return (
    <>
      {visibility && (
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li className={styles.li} onClick={() => setActiveSection(PROFILE)}>
              <NavbarLink
                section={PROFILE}
                activeIcon={userActiveIcon}
                icon={userIcon}
              >
                Профиль
              </NavbarLink>
            </li>
            <li className={styles.li} onClick={() => setActiveSection(TRIPS)}>
              <NavbarLink
                section={TRIPS}
                activeIcon={carActiveIcon}
                icon={carIcon}
              >
                Поездки
              </NavbarLink>
            </li>
            <li
              className={styles.li}
              onClick={() => setActiveSection(CALENDAR)}
            >
              <NavbarLink
                section={CALENDAR}
                activeIcon={calendarActiveIcon}
                icon={calendarIcon}
              >
                Календарь
              </NavbarLink>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
