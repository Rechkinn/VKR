import { useSelector } from "react-redux";
import styles from "./navbar-link.module.css";

export default function NavbarLink({ children, section, activeIcon, icon }) {
  const { activeSection } = useSelector((store) => store.navbar);

  return (
    <a href="#" className={styles.a}>
      <img
        src={activeSection === section ? activeIcon : icon}
        alt={`Иконка секции "${children}"`}
        className={styles.icon}
      />
      <p
        className={
          activeSection === section
            ? `${styles.text} ${styles.active}`
            : `${styles.text}`
        }
      >
        {children}
      </p>
    </a>
  );
}
