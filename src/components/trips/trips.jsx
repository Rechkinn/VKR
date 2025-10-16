import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";
import { useEffect, useRef, useState } from "react";

export default function Trips() {
  const [currentTab, setCurrentTab] = useState("Active");
  const [isOpeningForm, setIsOpeningForm] = useState(false);

  const [styleTripsContainer, setStyleTripsContainer] = useState(null);

  const sectionRef = useRef();
  const tripsContainerRef = useRef();

  useEffect(() => {
    const section = sectionRef.current;
    const tripsContainer = tripsContainerRef.current;

    if (!section) return;
    if (!tripsContainer) return;

    const sectionBorders = section.getBoundingClientRect();
    const tripsContainerBorders = tripsContainer.getBoundingClientRect();

    const maxHeight = sectionBorders.bottom - tripsContainerBorders.top - 35;

    setStyleTripsContainer({
      maxHeight: maxHeight,
    });
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
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

            <div
              ref={tripsContainerRef}
              style={styleTripsContainer}
              className={styles.trips}
            >
              {currentTab === "Active" && (
                <>
                  {[1, 2, 3, 4, 5].map(() => {
                    return <Trip status="Активные" />;
                  })}
                </>
              )}
              {currentTab === "Upcoming" && (
                <>
                  <Trip status="Предстоящие" />
                  <Trip status="Предстоящие" />
                  <Trip status="Предстоящие" />
                  <Trip status="Предстоящие" />
                </>
              )}
              {currentTab === "Completed" && (
                <>
                  <Trip status="Заверешнные" />
                  <Trip status="Заверешнные" />
                  <Trip status="Заверешнные" />
                  <Trip status="Заверешнные" />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
