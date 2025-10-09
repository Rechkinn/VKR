import styles from "./tabs.module.css";
import Button from "../button/button";

export default function Tabs({ currentTab, setCurrentTab }) {
  return (
    <div className={styles.tabs}>
      <Button
        className={
          currentTab === "Active"
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab("Active")}
      >
        Активные
      </Button>

      <div
        className={
          currentTab === "Completed"
            ? `${styles.separator}`
            : `${styles.separator} ${styles.separatorHidden}`
        }
      ></div>

      <Button
        className={
          currentTab === "Upcoming"
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab("Upcoming")}
      >
        Предстоящие
      </Button>

      <div
        className={
          currentTab === "Active"
            ? `${styles.separator}`
            : `${styles.separator} ${styles.separatorHidden}`
        }
      ></div>

      <Button
        className={
          currentTab === "Completed"
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab("Completed")}
      >
        Завершенные
      </Button>
    </div>
  );
}
