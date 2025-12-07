import Button from "../button/button";
import styles from "./calendar.module.css";
import arrowLeftIcon from "../../image/calendar/arrow-for-calendar-left.svg";
import arrowRightIcon from "../../image/calendar/arrow-for-calendar-right.svg";
import addTripIcon from "../../image/calendar/add-trip.svg";
import DayOfWeek from "../day-of-week/day-of-week";
import CalendarDay from "../calendar-day/calendar-day";
import { useState, useEffect, useRef } from "react";
import Trip from "../trip/trip";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/loader";
import { getTripsForCalendar } from "../../services/actions/trips";

export default function Calendar() {
  const [err, setErr] = useState(null);

  const [currentDate, _] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  const [clickedDay, setClickedDay] = useState(
    `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  );

  const [styleTripsContainer, setStyleTripsContainer] = useState(null);
  const sectionRef = useRef();
  const tripsContainerRef = useRef();

  const {
    tripsForCalendar,
    getTripsForCalendarRequest,
    getTripsForCalendarRequestError,
  } = useSelector((store) => store.trips);

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

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTripsForCalendar());
  }, []);

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

  // const [trips, setTrips] = useState([]);

  // useEffect(() => {
  //   if (!tripsForCalendar) return;
  //   setTrips([
  //     ...tripsForCalendar.filter((trip) => {
  //       const date1 = new Date(clickedDay.split(".").reverse().join("-"));
  //       const date2 = new Date(trip.departure_datetime.split("T"[0]));

  //       if (
  //         date1.getFullYear() === date2.getFullYear() &&
  //         date1.getMonth() === date2.getMonth() &&
  //         date1.getDate() === date2.getDate()
  //       ) {
  //         return trip;
  //       }
  //     }),
  //   ]);
  // }, [clickedDay, tripsForCalendar]);

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
          <section ref={sectionRef} className={styles.section}>
            <header className={styles.header}>
              <h1 className={styles.title}>Календарь</h1>
            </header>
            <article className={styles.calendar}>
              <header className={styles.calendarHeader}>
                <Button onClick={() => changeMonth(-1)}>
                  {/* <Button> */}
                  <img src={arrowLeftIcon} alt="" />
                </Button>
                <h2 className={styles.calendarTitle}>
                  {getNameMonth()} {date.getFullYear()}
                </h2>
                <Button onClick={() => changeMonth(1)}>
                  {/* <Button> */}
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

            {/* <div style={{ color: "green" }}>{`${JSON.stringify(
              tripsForCalendar
            )}`}</div> */}
            {/* <div style={{ color: "red" }}>{`${JSON.stringify(trips)}`}</div> */}
            <div style={{ color: "red" }}>{`${clickedDay}`}</div>

            <div
              ref={tripsContainerRef}
              className={styles.containerTrips}
              style={styleTripsContainer}
            >
              <header className={styles.containerTripsHeader}>
                <data value={clickedDay}>{clickedDay}</data>
                <Button className={styles.containerTripsButton}>
                  <img src={addTripIcon} alt="" />
                  <p>Добавить</p>
                </Button>
              </header>
              <div className={styles.trips}>
                {/* {tripsForCalendar.map((trip) => {
                  const date1 = new Date(
                    clickedDay.split(".").reverse().join("-")
                  );
                  const date2 = new Date(trip.departure_datetime.split("T"[0]));

                  if (
                    date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate()
                  ) {
                    return <Trip key={trip.id} trip={trip} />;
                  }
                })} */}

                {tripsForCalendar.map((trip) => {
                  return <Trip key={trip.id} trip={trip} />;
                })}
              </div>
            </div>

            {/* {err && <div>{err}</div>} */}
          </section>
        )}
    </>
  );
}
