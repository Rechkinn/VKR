import Button from "../button/button";
import styles from "./calendar.module.css";
import arrowLeftIcon from "../../image/calendar/arrow-for-calendar-left.svg";
import arrowRightIcon from "../../image/calendar/arrow-for-calendar-right.svg";
import addTripIcon from "../../image/calendar/add-trip.svg";
import DayOfWeek from "../day-of-week/day-of-week";
import CalendarDay from "../calendar-day/calendar-day";
import { useState, useEffect } from "react";
import Trip from "../trip/trip";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/loader";
import {
  changeTripType,
  getTripsForCalendar,
  REMOVE_TRIP_REQUEST_RESET,
  removeTrip,
  SET_TRIP_FOR_SETTINGS,
} from "../../services/actions/trips";
import { useNavigate } from "react-router";
import { useModal } from "../../hooks/useModal";
import Settings from "../settings/settings";

export default function Calendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visibilityModal, openModal, closeModal } = useModal();
  const [err, setErr] = useState(null);

  const [currentDate, _] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  const [clickedDay, setClickedDay] = useState(
    `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  );

  const {
    tripsForCalendar,
    getTripsForCalendarRequest,
    getTripsForCalendarRequestError,
    tripForSettings,
    removeTripRequest,
    removeTripRequestError,
    changeTripTypeRequest,
    changeTripTypeRequestError,
  } = useSelector((store) => store.trips);

  useEffect(() => {
    dispatch(getTripsForCalendar());
  }, []);

  function openSettingsTrip(trip) {
    dispatch({ type: REMOVE_TRIP_REQUEST_RESET });
    document.querySelector("body").style.overflow = "hidden";
    dispatch({
      type: SET_TRIP_FOR_SETTINGS,
      tripForSettings: trip,
    });
    openModal();
  }

  function closeSettingsTrip() {
    document.querySelector("body").style.overflow = "visible";
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
          trip.departure_datetime.split("T")[0] ===
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
      0
    ).getDate();

    // Заполняем дни предыдущего месяца
    for (let i = startDay - 1; i >= 0; i--) {
      const dayValue = daysInPrevMonth - i;

      const { day, month, year, hasTrips } = getDetailsDate(
        dayValue,
        changeFormatValue(date.getMonth() === 0 ? 12 : date.getMonth()),
        `${date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()}`
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
        `${date.getFullYear()}`
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
        }`
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

  function tryRemoveTrip(e) {
    e.stopPropagation();
    dispatch(removeTrip(tripForSettings.id, closeSettingsTrip));
  }

  function addOwnTrip() {
    navigate("/create-new-trip", {
      state: {
        toRoute: "/calendar",
        isTripDelegated: false,
      },
    });
  }

  function setDisabledButton(trip, checkDate = false) {
    let result =
      trip.creator_id === trip.driver_id &&
      trip.trip_type.toLowerCase() === "own";
    result = !result;
    if (checkDate) {
      const currentDate = new Date();
      const tripDate = new Date(trip.departure_datetime);

      if (tripDate.getTime() < currentDate.getTime()) {
        result = !result;
      }
    }
    return result;
  }

  function openDetailsTrip(trip) {
    navigate("/create-new-trip", {
      state: { detailsTrip: trip, toRoute: "/calendar" },
    });
  }

  function publishToChannel(trip) {
    dispatch(changeTripType(trip.id, closeSettingsTrip));
  }

  return (
    <>
      {getTripsForCalendarRequest && <Loader>Получаем ваши поездки...</Loader>}
      {!getTripsForCalendarRequest && getTripsForCalendarRequestError && (
        <div>Ошибка загрузки поездок в календаре!</div>
      )}
      {/* {true && ( */}
      {!getTripsForCalendarRequest &&
        !getTripsForCalendarRequestError &&
        tripsForCalendar && (
          <>
            {visibilityModal && (
              <Settings closeSettings={closeSettingsTrip}>
                {removeTripRequest && (
                  <Loader>Пробуем удалить поездку...</Loader>
                )}
                {!removeTripRequest && removeTripRequestError && (
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
                    publishToChannel(tripForSettings);
                  }}
                  disabled={setDisabledButton(tripForSettings, true)}
                >
                  Опубликовать в канал
                </Button>
                <Button
                  className={`modal modalLower ${styles.buttonRemoveTrip}`}
                  onClick={(e) => {
                    tryRemoveTrip(e);
                  }}
                  disabled={setDisabledButton(tripForSettings)}
                >
                  Удалить
                </Button>
                <Button
                  className="modal modalSingle"
                  onClick={closeSettingsTrip}
                >
                  Отмена
                </Button>
              </Settings>
            )}

            <section className={styles.section}>
              <header className={styles.header}>
                <h1 className={styles.title}>Календарь</h1>
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
                                    `${day.value}.${day.month}.${day.year}`
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
                      clickedDay.split(".").reverse().join("-")
                    );
                    const date2 = new Date(
                      trip.departure_datetime.split("T")[0]
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
                        />
                      );
                    }
                  })}
                </div>
              </div>
              <p style={{ color: "black" }}>-</p>
            </section>
          </>
        )}
    </>
  );
}
