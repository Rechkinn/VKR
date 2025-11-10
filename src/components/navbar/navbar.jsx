import styles from "./navbar.module.css";
import userIcon from "../../image/navbar/user.svg";
import carIcon from "../../image/navbar/car.svg";
import calendarIcon from "../../image/navbar/calendar.svg";
import userActiveIcon from "../../image/navbar/userActive.svg";
import carActiveIcon from "../../image/navbar/carActive.svg";
import calendarActiveIcon from "../../image/navbar/calendarActive.svg";
import { useDispatch, useSelector } from "react-redux";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import { CALENDAR, PROFILE, TRIPS } from "../../utils/consts";
import NavbarLink from "../navbar-link/navbar-link";
import { useLocation } from "react-router";
import { useEffect } from "react";

export default function Navbar() {
  const { visibility } = useSelector((store) => store.navbar);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    const visibilityNavbar =
      location.pathname === "/profile/change" ||
      location.pathname === "/create-new-trip";

    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: !visibilityNavbar,
    });
  }, [pathname]);

  // function setActiveSection(section) {
  //   dispatch({
  //     type: SET_ACTIVE_SECTION_NAVBAR,
  //     activeSection: section,
  //   });
  // }

  return (
    <>
      {visibility && (
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <NavbarLink
                toRoute="/profile"
                activeIcon={userActiveIcon}
                icon={userIcon}
              >
                Профиль
              </NavbarLink>
            </li>
            <li className={styles.li}>
              <NavbarLink
                toRoute="/trips"
                activeIcon={carActiveIcon}
                icon={carIcon}
              >
                Поездки
              </NavbarLink>
            </li>
            <li className={styles.li}>
              <NavbarLink
                toRoute="/calendar"
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
