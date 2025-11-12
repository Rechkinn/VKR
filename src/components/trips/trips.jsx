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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infoFromTelegram } = useSelector((store) => store.user);
  const { trips, getTripsRequest, getTripsRequestError } = useSelector(
    (store) => store.trips
  );

  const { visibilityModal, openModal, closeModal } = useModal();

  useEffect(() => {
    if (!trips) dispatch(getTrips());
  }, []);

  const sectionRef = useRef();
  const tripsContainerRef = useRef();
  const [styleTripsContainer, setStyleTripsContainer] = useState();

  function setMaxHeightContainerTrips() {
    setStyleTripsContainer({
      maxHeight: `${window.innerHeight - 139 - 99.5 - 89.5}px`,
    });
  }

  useEffect(() => {
    setMaxHeightContainerTrips();
    window.addEventListener("resize", setMaxHeightContainerTrips);
    return () =>
      window.removeEventListener("resize", setMaxHeightContainerTrips);
  }, []);

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
      {getTripsRequestError && (
        <div>Ошибка загрузки поездок! Попробуйте перезагрузить приложение!</div>
      )}

      {trips && (
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
