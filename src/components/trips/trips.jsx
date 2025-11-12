import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrips, SET_TRIP_FOR_SETTINGS } from "../../services/actions/trips";
import ModalOverlay from "../modal-overlay/modal-overlay";
import Loader from "../loader/loader";
import { useNavigate } from "react-router";
import SettingsTrip from "../settings-trip/settings-trip";
import { useModal } from "../../hooks/useModal";

export default function Trips() {
  // const sectionRef = useRef();
  // console.log("sectionRef");
  // console.log(sectionRef);
  // console.log("sectionRef.current");
  // console.log(sectionRef.current);
  // const tripsContainerRef = useRef();
  // console.log("tripsContainerRef");
  // console.log(tripsContainerRef);
  // console.log("tripsContainerRef.current");
  // console.log(tripsContainerRef.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infoFromTelegram } = useSelector((store) => store.user);
  // const { visibilityModal } = useSelector((store) => store.modal);
  const { trips, getTripsRequest, getTripsRequestError } = useSelector(
    (store) => store.trips
  );

  const { visibilityModal, openModal, closeModal } = useModal();

  useEffect(() => {
    dispatch(getTrips());
  }, []);

  const sectionRef = useRef();
  const tripsContainerRef = useRef();
  const [styleTripsContainer, setStyleTripsContainer] = useState();

  function setMaxHeightContainerTrips() {
    console.log("запускаем установку максимальной высоты");
    const section = sectionRef.current;
    const tripsContainer = tripsContainerRef.current;

    console.log(
      "перед проверкой !section || !tripsContainer:",
      !section || !tripsContainer
    );
    console.log("sectionRef.current");
    console.log(sectionRef.current);
    console.log("tripsContainerRef.current");
    console.log(tripsContainerRef.current);
    if (!section || !tripsContainer) return;

    const sectionBorders = section.getBoundingClientRect();
    const tripsContainerBorders = tripsContainer.getBoundingClientRect();

    const maxHeight = sectionBorders.bottom - tripsContainerBorders.top - 35;
    console.log("устанавливаем значение");
    setStyleTripsContainer({
      maxHeight: maxHeight,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", setMaxHeightContainerTrips);
    return () =>
      window.removeEventListener("resize", setMaxHeightContainerTrips);
  }, []);

  useEffect(() => {
    console.log("Видимо ref-ы в trips изменились");
    console.log("sectionRef.current");
    console.log(sectionRef.current);
    console.log("tripsContainerRef.current");
    console.log(tripsContainerRef.current);
    // setMaxHeightContainerTrips();
    setTimeout(() => setMaxHeightContainerTrips(), 100);
  }, [sectionRef.current, tripsContainerRef.current]);

  function openFormToCreateTrip() {
    navigate("/create-new-trip", {
      state: {
        toRoute: "/trips",
      },
    });
  }

  function openSettingsTrip(trip) {
    dispatch({
      type: SET_TRIP_FOR_SETTINGS,
      tripForSettings: trip,
    });
    openModal();
  }

  return (
    <>
      {getTripsRequest && <Loader>Узнаём о ваших поездках...</Loader>}
      {getTripsRequestError ? (
        <div>Ошибка загрузки поездок! Попробуйте перезагрузить приложение!</div>
      ) : (
        <>
          {visibilityModal && <SettingsTrip closeSettings={closeModal} />}
          <section ref={sectionRef} className={styles.section}>
            <header className={styles.header}>
              <h1 className={styles.title}>Мои поездки</h1>

              <div className={styles.balance}>
                <Balance balanceValue={infoFromTelegram.balance} />
                <Button className="black">Пополнить</Button>
              </div>
            </header>
            <div className={styles.containerCreateTrip}>
              <Button
                className={styles.buttonCreateTrip}
                onClick={openFormToCreateTrip}
              >
                <span className={styles.buttonIconBackground}>
                  <img src={carIcon} alt="Иконка автомобиля" />
                </span>
                <span className={styles.buttonText}>Создать поездку</span>
              </Button>

              {/* <Tabs /> */}

              <div
                ref={tripsContainerRef}
                className={styles.trips}
                style={styleTripsContainer}
              >
                {trips.map((trip) => {
                  return (
                    <Trip
                      key={trip.id}
                      trip={trip}
                      openSettingsTrip={() => openSettingsTrip(trip)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
