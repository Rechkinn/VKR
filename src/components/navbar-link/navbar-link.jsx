import styles from "./navbar-link.module.css";
import { Link, useLocation } from "react-router";

export default function NavbarLink({ children, toRoute, activeIcon, icon }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={toRoute}
      className={pathname === toRoute ? styles.activeLink : styles.link}
    >
      <img
        src={pathname === toRoute ? activeIcon : icon}
        alt=""
        className={styles.icon}
      />
      <p>{children}</p>
    </Link>
  );
}
