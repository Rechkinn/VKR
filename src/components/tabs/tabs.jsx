import styles from "./tabs.module.css";
import Button from "../button/button";
import { ACTIVE_TAB, COMPLETED_TAB, UPCOMING_TAB } from "../../utils/consts";
import { useDispatch, useSelector } from "react-redux";
import { SET_CURRENT_TAB } from "../../services/actions/trips";

export default function Tabs() {
  const { currentTab } = useSelector((store) => store.trips);

  const dispatch = useDispatch();
  function setCurrentTab(tab) {
    dispatch({
      type: SET_CURRENT_TAB,
      currentTab: tab,
    });
  }

  return (
    <div className={styles.tabs}>
      <Button
        className={
          currentTab === ACTIVE_TAB
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab(ACTIVE_TAB)}
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
          currentTab === UPCOMING_TAB
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab(UPCOMING_TAB)}
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
          currentTab === COMPLETED_TAB
            ? `${styles.button} ${styles.activeTab}`
            : `${styles.button}`
        }
        onClick={() => setCurrentTab(COMPLETED_TAB)}
      >
        Завершенные
      </Button>
    </div>
  );
}
