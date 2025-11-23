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

  function tryRemoveTrip(e) {
    e.stopPropagation();
    dispatch(removeTrip(tripForSettings.id, closeModal));
  }

  const arr = [
    {
      id: 0,
      creator_id: 0,
      driver_id: 0,
      vehicle_id: 0,
      from_address: "string",
      to_address: "string",
      passenger_phone_number: "string",
      departure_datetime: "2025-11-22T10:04:20.815Z",
      price: 0,
      total_seats: 0,
      car_class: "passenger_car",
      description: "string",
      trip_type: "own",
      status: "published",
      delegation_commission: 0,
      is_delegation_active: true,
      created_at: "2025-11-22T10:04:20.815Z",
      driver: {
        username: "string",
        first_name: "string",
        last_name: "string",
        phone_number: "string",
        id: 0,
        telegram_id: 0,
        role: "passenger",
        is_active: true,
        is_verified: true,
        subscription_exp: "2025-11-22T10:04:20.815Z",
        sbp_bank: "string",
        sbp_phone_number: "string",
        rating_avg: 0,
        rating_count: 0,
        created_at: "2025-11-22T10:04:20.815Z",
        updated_at: "2025-11-22T10:04:20.815Z",
      },
      creator: {
        username: "string",
        first_name: "string",
        last_name: "string",
        phone_number: "string",
        id: 0,
        telegram_id: 0,
        role: "passenger",
        is_active: true,
        is_verified: true,
        subscription_exp: "2025-11-22T10:04:20.815Z",
        sbp_bank: "string",
        sbp_phone_number: "string",
        rating_avg: 0,
        rating_count: 0,
        created_at: "2025-11-22T10:04:20.815Z",
        updated_at: "2025-11-22T10:04:20.815Z",
      },
      vehicle: {
        brand: "string",
        model: "string",
        year: 0,
        color: "string",
        license_plate: "string",
        additional_info: "string",
        car_class: "passenger_car",
        id: 0,
        driver_id: 0,
        photo_url: "string",
        is_active: true,
      },
    },
  ];

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
            <Settings closeSettings={closeModal}>
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
                Изменить
              </Button>
              <Button
                className="modal modalLower"
                onClick={(e) => tryRemoveTrip(e)}
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
                {/* {arr.map((trip) => { */}
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
