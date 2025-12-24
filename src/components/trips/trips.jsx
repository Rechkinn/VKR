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
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { isDevelopmentMode } from "../../utils/development-mode";
import { getStateForFormTrip } from "../../utils/state-for-form-trip";

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
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: true,
    });
    if (!trips) dispatch(getTrips());
  }, []);

  const sectionRef = useRef();
  const tripsContainerRef = useRef();
  const [styleTripsContainer, setStyleTripsContainer] = useState();

  function setMaxHeightContainerTrips() {
    setStyleTripsContainer({
      maxHeight: `${window.innerHeight - 139 - 99.5 - 145.5}px`,
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

  function openDetailsTrip(trip) {
    navigate(
      "/create-new-trip",
      getStateForFormTrip(trip, "/trips", true, "driver")
      //   {
      //   state: {
      //     detailsTrip: trip,
      //     toRoute: "/trips",
      //     isOnlyViewing: true,
      //     whoShowInfo: "driver",
      //   },
      // }
    );
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
      {!isDevelopmentMode && (
        <>
          {getTripsRequest && <Loader>Узнаём о ваших поездках...</Loader>}
          {getTripsRequestError && (
            <div>
              Ошибка загрузки поездок! Попробуйте перезагрузить приложение!
            </div>
          )}
        </>
      )}

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
                onClick={(e) => {
                  e.stopPropagation();
                  openDetailsTrip(tripForSettings);
                }}
              >
                Подробнее
              </Button>
              <Button
                className={`modal modalLower ${styles.buttonRemoveTrip}`}
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
              <h1 className={styles.title}>Предложенные поездки</h1>
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
                <span className={styles.buttonText}>Предложить поездку</span>
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
                      stateForFormTrip={
                        getStateForFormTrip(trip, "/trips", true, "driver")
                          ?.state
                      }
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
