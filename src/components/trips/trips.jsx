import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";
import { useState } from "react";

export default function Trips() {
  const [currentTab, setCurrentTab] = useState("Active");
  const [isOpeningForm, setIsOpeningForm] = useState(false);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои поездки</h1>

        <div
          className={
            isOpeningForm
              ? `${styles.hiddenBalance} ${styles.balance}`
              : `${styles.balance}`
          }
        >
          <Balance balanceValue={2.743} />
          <Button className="black">Пополнить</Button>
        </div>
      </header>
      <div
        className={
          isOpeningForm
            ? `${styles.containerCreateTrip} ${styles.animationOpenForm}`
            : `${styles.containerCreateTrip}`
        }
      >
        {isOpeningForm ? (
          <form>
            <button
              // style={{ color: "white" }}
              onClick={() => setIsOpeningForm(false)}
            >
              CLOSE
            </button>
          </form>
        ) : (
          <>
            <Button
              className={styles.buttonCreateTrip}
              onClick={() => setIsOpeningForm(true)}
            >
              <span className={styles.buttonIconBackground}>
                <img src={carIcon} alt="Иконка автомобиля" />
              </span>
              <span className={styles.buttonText}>Создать поездку</span>
            </Button>
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div className={styles.trips}>
              {currentTab === "Active" && (
                <>
                  <Trip />
                  <Trip />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
