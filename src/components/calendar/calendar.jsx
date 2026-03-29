import Button from "../button/button";
import styles from "./calendar.module.css";
import arrowLeftIcon from "../../image/calendar/arrow-for-calendar-left.svg";
import arrowRightIcon from "../../image/calendar/arrow-for-calendar-right.svg";
import addTripIcon from "../../image/profile/addCarIcon.svg";
import DayOfWeek from "../day-of-week/day-of-week";
import CalendarDay from "../calendar-day/calendar-day";
import { useState, useEffect, useRef } from "react";
import Trip from "../trip/trip";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/loader";
import {
  changeTripType,
  getTripsForCalendar,
  REMOVE_TRIP_OWN_REQUEST_RESET,
  removeTripOwn,
  SET_TRIP_FOR_SETTINGS,
} from "../../services/actions/trips";
import { useLocation, useNavigate } from "react-router";
import { useModal } from "../../hooks/useModal";
import Settings from "../settings/settings";
import Notification from "../notification/notification";
import { isDevelopmentMode } from "../../utils/development-mode";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { getStateForFormTrip } from "../../utils/state-for-form-trip";
import { BASE_URL } from "../../utils/consts";

export default function Calendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visibilityModal, openModal, closeModal } = useModal();
  const [err, setErr] = useState(null);

  const [currentDate, _] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  const [clickedDay, setClickedDay] = useState(
    `${date.getDate()}.${`${date.getMonth() + 1}`.length > 1 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}.${date.getFullYear()}`,
  );

  const {
    tripsForCalendar,
    getTripsForCalendarRequest,
    getTripsForCalendarRequestError,
    tripForSettings,
    removeTripOwnRequest,
    removeTripOwnRequestError,
    changeTripTypeRequest,
    changeTripTypeRequestError,
    trips,
  } = useSelector((store) => store.trips);
  const { infoFromTelegram } = useSelector((store) => store.user);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: true,
    });
    dispatch(getTripsForCalendar());
  }, []);

  function openSettingsTrip(trip) {
    dispatch({ type: REMOVE_TRIP_OWN_REQUEST_RESET });
    document.querySelector("body").style.overflow = "hidden";
    dispatch({
      type: SET_TRIP_FOR_SETTINGS,
      tripForSettings: trip,
    });
    openModal();
  }

  function closeSettingsTrip() {
    document.querySelector("body").style.overflow = "visible";
    dispatch({
      type: SET_TRIP_FOR_SETTINGS,
      tripForSettings: null,
    });
    closeModal();
  }

  function getNameMonth() {
    let month = (date.getMonth() + 1) % 13;

    if (month === 1) {
      return "Январь";
    } else if (month === 2) {
      return "Февраль";
    } else if (month === 3) {
      return "Март";
    } else if (month === 4) {
      return "Апрель";
    } else if (month === 5) {
      return "Май";
    } else if (month === 6) {
      return "Июнь";
    } else if (month === 7) {
      return "Июль";
    } else if (month === 8) {
      return "Август";
    } else if (month === 9) {
      return "Сентябрь";
    } else if (month === 10) {
      return "Октябрь";
    } else if (month === 11) {
      return "Ноябрь";
    } else if (month === 12) {
      return "Декабрь";
    } else {
      throw new Error("Передан не существующий номер месяца!");
    }
  }

  function changeFormatValue(value) {
    return `${value}`.length === 1 ? `0${value}` : `${value}`;
  }

  function getDetailsDate(initialDay, initialMonth, initialYear) {
    const day = initialDay.length === 1 ? `0${day}` : initialDay;
    const month = initialMonth;
    const year = initialYear;

    let hasTrips = false;
    if (tripsForCalendar) {
      hasTrips = tripsForCalendar.find((trip) => {
        return (
          trip?.departure_datetime.split("T")[0] ===
          `${year}-${changeFormatValue(month)}-${changeFormatValue(day)}`
        );
      })
        ? true
        : false;
    }
    return {
      day,
      month,
      year,
      hasTrips,
    };
  }

  function getArrayForRender(date) {
    const resultArrayDays = [];

    // Первый день текущего месяца
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    // Последний день текущего месяца
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // День недели первого дня (0 - воскресенье, 1 - понедельник и т.д.)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    // Корректируем для нашего календаря (пн - 0, вт - 1, ..., вс - 6)
    const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Дни из предыдущего месяца
    const daysInPrevMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      0,
    ).getDate();

    // Заполняем дни предыдущего месяца
    for (let i = startDay - 1; i >= 0; i--) {
      const dayValue = daysInPrevMonth - i;

      const { day, month, year, hasTrips } = getDetailsDate(
        dayValue,
        changeFormatValue(date.getMonth() === 0 ? 12 : date.getMonth()),
        `${date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()}`,
      );

      resultArrayDays.push({
        value: day,
        isActiveDay: false,
        month: month,
        year: year,
        hasTrips: hasTrips,
        isCurrentDay: false,
      });
    }

    // Дни текущего месяца
    const daysInCurrentMonth = lastDayOfMonth.getDate();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const isCurrentDay =
        currentDate.getDate() === i &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getFullYear() === date.getFullYear();

      const { day, month, year, hasTrips } = getDetailsDate(
        i,
        changeFormatValue(date.getMonth() + 1),
        `${date.getFullYear()}`,
      );

      resultArrayDays.push({
        value: day,
        isActiveDay: true,
        month: month,
        year: year,
        hasTrips: hasTrips,
        isCurrentDay: isCurrentDay,
      });
    }

    // Дни следующего месяца
    const totalCells = 42; // 6 недель * 7 дней
    const remainingDays = totalCells - resultArrayDays.length;

    for (let i = 1; i <= remainingDays; i++) {
      const { day, month, year, hasTrips } = getDetailsDate(
        i,
        changeFormatValue(date.getMonth() + 2 === 13 ? 1 : date.getMonth() + 2),
        `${
          date.getMonth() + 1 === 12
            ? date.getFullYear() + 1
            : date.getFullYear()
        }`,
      );

      resultArrayDays.push({
        value: day,
        isActiveDay: false,
        month: month,
        year: year,
        hasTrips: hasTrips,
        isCurrentDay: false,
      });
    }

    return resultArrayDays;
  }

  function changeMonth(way) {
    try {
      const newDate = new Date(date);
      if (way === 1) {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (way === -1) {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        return;
      }
      setDate(newDate);
    } catch (error) {
      setErr(error);
    }
  }

  function tryRemoveTrip() {
    dispatch(removeTripOwn(tripForSettings.id, closeSettingsTrip));
  }

  const exportToCalendar = (tripId) => {
    // openLink открывает Safari, Safari обрабатывает .ics нативно

    console.log("exportToCalendar tripId", tripId);

    const token = localStorage.getItem("access_token");
    window.Telegram.WebApp.openLink(
      `https://xn--80aqak6ae.xn--p1ai/api/v1/trips/${tripId}/export.ics?token=${token}`,
    );
  };

  function addOwnTrip() {
    navigate("/create-new-trip", {
      state: {
        toRoute: "/calendar",
        isTripDelegated: false,
        selectedDate: clickedDay,
      },
    });
  }

  function setDisabledButton(trip, checkDate = false) {
    if (!trip?.creator_id || !trip?.driver_id || !trip?.trip_type) return true;

    let result =
      trip.creator_id === trip.driver_id &&
      trip.trip_type.toLowerCase() === "own";
    result = !result;
    if (checkDate) {
      const currentDate = new Date();
      const tripDate = new Date(trip?.departure_datetime);

      if (tripDate.getTime() < currentDate.getTime()) {
        result = !result;
      }
    }
    return result;
  }

  function openDetailsTrip(trip) {
    navigate(
      "/create-new-trip",
      getStateForFormTrip(
        trip,
        "/calendar",
        trip?.creator_id === infoFromTelegram?.id ? false : true,
        "creator",
      ),
      //   {
      //   state: {
      //     detailsTrip: trip,
      //     toRoute: "/calendar",
      //     whoShowInfo: "creator",
      //     isOnlyViewing: trip?.creator_id === infoFromTelegram?.id ? false : true,
      //   },
      // }
    );
  }

  function publishToChannel(trip) {
    function caseSuccessfulChange() {
      closeSettingsTrip();
      setNotifications([{ message: "Опубликовано в канал!" }]);
    }

    // dispatch(changeTripType(trip.id, closeSettingsTrip));
    dispatch(changeTripType(trip.id, caseSuccessfulChange));
  }

  function renderNotifications(notifications) {
    const animationDuration = 3;
    return notifications.map((notification, i) => {
      setTimeout(
        () => {
          setNotifications([]);
        },
        1000 * animationDuration * notifications.length,
      );
      return (
        <Notification
          duration={animationDuration}
          delay={i * animationDuration}
        >
          {notification.message}
        </Notification>
      );
    });
  }

  return (
    <>
      {!isDevelopmentMode && (
        <>
          {getTripsForCalendarRequest && (
            <Loader>Получаем ваши поездки...</Loader>
          )}
          {!getTripsForCalendarRequest && getTripsForCalendarRequestError && (
            <div>Ошибка загрузки поездок в календаре!</div>
          )}
        </>
      )}

      {/* {!getTripsForCalendarRequest &&
        !getTripsForCalendarRequestError &&
        tripsForCalendar && ( */}
      {tripsForCalendar && (
        <>
          {visibilityModal && (
            <Settings closeSettings={closeSettingsTrip}>
              {removeTripOwnRequest && (
                <Loader>Пробуем удалить поездку...</Loader>
              )}
              {!removeTripOwnRequest && removeTripOwnRequestError && (
                <p style={{ color: "red", textAlign: "center" }}>
                  Ошибка удаления поездки!
                </p>
              )}
              {changeTripTypeRequest && (
                <Loader>Пробуем опубликовать поездку...</Loader>
              )}
              {!changeTripTypeRequest && changeTripTypeRequestError && (
                <p style={{ color: "red", textAlign: "center" }}>
                  Ошибка публикации поездки!
                </p>
              )}

              <Button
                className={`modal modalUpper ${styles.buttonRemoveTrip}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openDetailsTrip(tripForSettings);
                }}
              >
                Подробнее
              </Button>
              <Button
                className={`modal modalMiddle ${styles.buttonRemoveTrip}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // openDetailsTrip(tripForSettings);
                  console.log(
                    "Экспортировать в календарь tripForSettings",
                    tripForSettings,
                  );
                  exportToCalendar(tripForSettings.id);
                }}
              >
                Экспортировать в календарь
              </Button>
              <Button
                className={`modal modalMiddle ${styles.buttonRemoveTrip}`}
                onClick={(e) => {
                  e.stopPropagation();
                  publishToChannel(tripForSettings);
                }}
                disabled={setDisabledButton(tripForSettings, true)}
              >
                Опубликовать в канал
              </Button>
              <Button
                className={`modal modalLower ${styles.buttonRemoveTrip}`}
                onClick={(e) => {
                  e.stopPropagation();
                  tryRemoveTrip();
                }}
                disabled={setDisabledButton(tripForSettings)}
              >
                Удалить
              </Button>
              <Button className="modal modalSingle" onClick={closeSettingsTrip}>
                Отмена
              </Button>
            </Settings>
          )}

          <section className={styles.section}>
            <header className={styles.header}>
              <h1 className={styles.title}>Календарь</h1>
              <div className={styles.containerNotifications}>
                {notifications && renderNotifications(notifications)}
              </div>
            </header>

            <article className={styles.calendar}>
              <header className={styles.calendarHeader}>
                <Button onClick={() => changeMonth(-1)}>
                  <img src={arrowLeftIcon} alt="" />
                </Button>
                <h2 className={styles.calendarTitle}>
                  {getNameMonth()} {date.getFullYear()}
                </h2>
                <Button onClick={() => changeMonth(1)}>
                  <img src={arrowRightIcon} alt="" />
                </Button>
              </header>
              <div className={styles.daysOfWeek}>
                {daysOfWeek.map((dayOfWeek) => {
                  return <DayOfWeek key={dayOfWeek}>{dayOfWeek}</DayOfWeek>;
                })}
              </div>
              <div className={styles.days}>
                {[0, 1, 2, 3, 4, 5].map((line) => {
                  return (
                    <div key={line} className={styles.daysLine}>
                      {getArrayForRender(date)
                        .slice(line * 7, (line + 1) * 7)
                        .map((day) => {
                          return (
                            <CalendarDay
                              key={`${day.value}.${day.month}.${day.year}`}
                              onClick={() =>
                                setClickedDay(
                                  `${day.value}.${day.month}.${day.year}`,
                                )
                              }
                              clickedDay={clickedDay}
                              day={day}
                            />
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </article>

            <div className={styles.containerTrips}>
              <header className={styles.containerTripsHeader}>
                <data value={clickedDay}>{clickedDay}</data>
                <Button
                  className={styles.containerTripsButton}
                  onClick={addOwnTrip}
                >
                  <img src={addTripIcon} alt="" />
                  <p>Добавить</p>
                </Button>
              </header>
              <div className={styles.trips}>
                {tripsForCalendar.map((trip) => {
                  const date1 = new Date(
                    clickedDay.split(".").reverse().join("-"),
                  );
                  const date2 = new Date(
                    trip?.departure_datetime.split("T")[0],
                  );

                  if (
                    date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate()
                  ) {
                    return (
                      <Trip
                        key={trip.id}
                        trip={trip}
                        openSettingsTrip={() => openSettingsTrip(trip)}
                        stateForFormTrip={
                          getStateForFormTrip(
                            trip,
                            "/calendar",
                            trip?.creator_id === infoFromTelegram?.id
                              ? false
                              : true,
                            "creator",
                          )?.state
                        }
                      />
                    );
                  }
                })}
              </div>
            </div>
            <p className={styles.minusForCorrectlyRenderContainerTrips}>-</p>
          </section>
        </>
      )}
    </>
  );
}
