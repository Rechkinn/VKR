import { useEffect, useState } from "react";
import styles from "./navbar-link.module.css";
import { Link, NavLink, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { SET_ACTIVE_SECTION_NAVBAR } from "../../services/actions/navbar";

export default function NavbarLink({ children, toRoute, activeIcon, icon }) {
  const { pathname } = useLocation();
  console.log(pathname);

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
