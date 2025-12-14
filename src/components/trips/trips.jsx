import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrips,
  REMOVE_TRIP_REQUEST_RESET,
  removeTrip,
  SET_TRIP_FOR_SETTINGS,
} from "../../services/actions/trips";
import ModalOverlay from "../modal-overlay/modal-overlay";
import Loader from "../loader/loader";
import { useNavigate } from "react-router";
import Settings from "../settings/settings";
import { useModal } from "../../hooks/useModal";

export default function Trips() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infoFromTelegram } = useSelector((store) => store.user);
  const { trips, getTripsRequest, getTripsRequestError } = useSelector(
    (store) => store.trips
  );

  const { tripForSettings, removeTripRequest, removeTripRequestError } =
    useSelector((store) => store.trips);

  const { visibilityModal, openModal, closeModal } = useModal();

  useEffect(() => {
    if (!trips) dispatch(getTrips());
  }, []);

  const sectionRef = useRef();
  const tripsContainerRef = useRef();
  const [styleTripsContainer, setStyleTripsContainer] = useState();

  function setMaxHeightContainerTrips() {
    setStyleTripsContainer({
      maxHeight: `${window.innerHeight - 139 - 99.5 - 125.5}px`,
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
        isTripDelegated: true,
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
  function closeSettingsTrip() {
    dispatch({
      type: SET_TRIP_FOR_SETTINGS,
      tripForSettings: null,
    });
    dispatch({
      type: REMOVE_TRIP_REQUEST_RESET,
    });
    closeModal();
  }

  function tryRemoveTrip(e) {
    e.stopPropagation();
    dispatch(removeTrip(tripForSettings.id, closeSettingsTrip));
  }

  return (
    <>
      {getTripsRequest && <Loader>Узнаём о ваших поездках...</Loader>}
      {getTripsRequestError && (
        <div>Ошибка загрузки поездок! Попробуйте перезагрузить приложение!</div>
      )}

      {/* {true && ( */}
      {trips && (
        <>
          {visibilityModal && (
            <Settings closeSettings={closeSettingsTrip}>
              {removeTripRequest && <Loader>Пробуем удалить поездку...</Loader>}
              {!removeTripRequest && removeTripRequestError && (
                <p style={{ color: "red", textAlign: "center" }}>
                  Ошибка удаления поездки!
                </p>
              )}
              <Button
                className="modal modalUpper"
                onClick={(e) => e.stopPropagation()}
              >
                Подробнее
              </Button>
              <Button
                className={`modal modalSingle ${styles.buttonRemoveTrip}`}
                onClick={(e) => tryRemoveTrip(e)}
                disabled={tripForSettings.status === "confirmed"}
              >
                Удалить
              </Button>
              <Button className="modal modalSingle" onClick={closeModal}>
                Отмена
              </Button>
            </Settings>
          )}
          <section ref={sectionRef} className={styles.section}>
            <header className={styles.header}>
              <h1 className={styles.title}>Мои поездки</h1>
              {/* <div className={styles.balance}>
                <Balance balanceValue={infoFromTelegram.balance} />
                <Button className="black">Пополнить</Button>
              </div> */}
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
