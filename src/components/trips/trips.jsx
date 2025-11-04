import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CLOSE_FORM_SECTION_TRIP,
  OPEN_FORM_SECTION_TRIP,
} from "../../services/actions/trips";
import FormForNewTrip from "../form-for-new-trip/form-for-new-trip";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import ModalOverlay from "../modal-overlay/modal-overlay";

export default function Trips() {
  const dispatch = useDispatch();
  const { currentTab, isOpeningForm } = useSelector((store) => store.trips);
  const { visibilityModal } = useSelector((store) => store.modal);

  const [styleTripsContainer, setStyleTripsContainer] = useState(null);
  const sectionRef = useRef();
  const tripsContainerRef = useRef();

  const { infoFromTelegram } = useSelector((store) => store.user);

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrayTrips, setArrayTrips] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      const option = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicm9sZSI6ImRyaXZlciIsImV4cCI6MTc2MjM0OTM2OX0.FYqEtRXuOqQuhY6YFOv7D0icIHPpJsVdLCknCDlbhIU`,
        },
      };

      try {
        const response = await fetch(
          "https://xn--80aqak6ae.xn--p1ai/api/v1/trips/search?trip_type=delegated&skip=0&limit=50",
          option
        );

        console.log(response);

        if (!response.ok) {
          throw new Error("Ошибка запроса поздок!");
        }

        const data = await response.json();
        setArrayTrips(data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function openForm() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: false,
    });
    dispatch({
      type: OPEN_FORM_SECTION_TRIP,
    });
  }

  return (
    <>
      {loading && <div>Загрузка данных...</div>}
      {!loading && error && <div>Ошибка загрузки данных! {error.message}</div>}

      {!loading && !error && arrayTrips && (
        <section ref={sectionRef} className={styles.section}>
          {visibilityModal && <ModalOverlay />}
          <header className={styles.header}>
            <h1 className={styles.title}>Мои поездки</h1>

            <div
              className={
                isOpeningForm
                  ? `${styles.hiddenBalance} ${styles.balance}`
                  : `${styles.balance}`
              }
            >
              <Balance balanceValue={infoFromTelegram.balance} />
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
              <FormForNewTrip actionType={CLOSE_FORM_SECTION_TRIP} />
            ) : (
              <>
                <Button className={styles.buttonCreateTrip} onClick={openForm}>
                  <span className={styles.buttonIconBackground}>
                    <img src={carIcon} alt="Иконка автомобиля" />
                  </span>
                  <span className={styles.buttonText}>Создать поездку</span>
                </Button>

                {/* <Tabs /> */}

                <div
                  ref={tripsContainerRef}
                  style={styleTripsContainer}
                  className={styles.trips}
                >
                  {[1, 2, 3, 4, 5].map((trip) => {
                    if (trip?.status === currentTab) {
                      return <Trip status={currentTab} />;
                    } else {
                      return <Trip status={currentTab} />;
                    }
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
