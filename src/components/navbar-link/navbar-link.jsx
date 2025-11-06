import { useEffect, useState } from "react";
import styles from "./navbar-link.module.css";
import { NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { SET_ACTIVE_SECTION_NAVBAR } from "../../services/actions/navbar";

export default function NavbarLink({ children, toRoute, icon }) {
  return (
    <NavLink
      to={toRoute}
      className={({ isActive }) => {
        return isActive ? styles.activeLink : styles.link;
      }}
    >
      <img src={icon} alt="" className={styles.icon} />
      <p>{children}</p>
    </NavLink>
  );
}
