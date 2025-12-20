import { forwardRef } from "react";
import styles from "./notification.module.css";

const Notification = forwardRef(
  ({ children, duration = 3, delay = 0 }, ref) => {
    return (
      <div
        className={styles.notification}
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <div
          ref={ref}
          className={styles.loader}
          style={{
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        ></div>
        <p className={styles.text}>{children}</p>
      </div>
    );
  }
);
export default Notification;
