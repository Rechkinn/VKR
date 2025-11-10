import Button from "../button/button";
import styles from "./calendar.module.css";
import arrowLeftIcon from "../../image/calendar/arrow-for-calendar-left.svg";
import arrowRightIcon from "../../image/calendar/arrow-for-calendar-right.svg";
import addTripIcon from "../../image/calendar/add-trip.svg";
import DayOfWeek from "../day-of-week/day-of-week";
import CalendarDay from "../calendar-day/calendar-day";
import { useState, useEffect, useRef } from "react";
import Trip from "../trip/trip";

export default function Calendar() {
  const [currentDate, _] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

  const [clickedDay, setClickedDay] = useState(
    `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  );

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

  function getDaysInMonth(dateForYear, numberMonth) {
    // console.log("numberMonth", numberMonth);
    const arrayMonth31 = [1, 3, 5, 7, 8, 10, 12];
    // const arrayMonth30 = [4, 6, 9, 11];

    if (numberMonth === 2) {
      // февраль
      if (dateForYear.getFullYear() % 4 === 0) {
        // високосный
        return 29;
      } else {
        // не високосный
        return 28;
      }
    } else if (arrayMonth31.indexOf(numberMonth) !== -1) {
      return 31;
    } else {
      return 30;
    }
  }

  function changeFormatValue(value) {
    return `${value}`.length === 1 ? `0${value}` : `${value}`;
  }

  function getArrayForRender(date) {
    const resultArrayDays = [];
    // const date = new Date();
    let daysInPreviousMonth = getDaysInMonth(
      date,
      date.getMonth() === 0 ? 12 : date.getMonth()
    );
    let daysInCurrentMonth = getDaysInMonth(date, date.getMonth() + 1);

    const arr = `${date}`.split(" ");
    arr[2] = "01";
    const newDateFirstDay = new Date(arr.join(" "));
    const dayOfWeekFirstDay =
      newDateFirstDay.getDay() === 0 ? 7 : newDateFirstDay.getDay();
    daysInPreviousMonth -= dayOfWeekFirstDay - 1 - 1;
    for (let i = 0; i < dayOfWeekFirstDay - 1; i++) {
      const day = {
        value: daysInPreviousMonth,
        isActiveDay: false,
        month:
          date.getMonth() === 0 ? "12" : changeFormatValue(date.getMonth()),
        year: `${
          date.getMonth() + 1 === 1
            ? date.getFullYear() - 1
            : date.getFullYear()
        }`,
      };
      day["hasTrips"] = true;

      resultArrayDays.push(day);
      daysInPreviousMonth++;
    }

    for (let i = 1; i < daysInCurrentMonth + 1; i++) {
      const day = {
        value: i,
        isActiveDay: true,
        month: changeFormatValue(date.getMonth() + 1),
        year: `${date.getFullYear()}`,
      };
      day["hasTrips"] = true;
      // console.log("day");
      // console.log(day);
      // console.log("currentDate");
      // console.log(currentDate);
      if (
        currentDate.getDate() == day.value &&
        currentDate.getMonth() + 1 == day.month &&
        currentDate.getFullYear() == day.year
      ) {
        day["isCurrentDay"] = true;
      } else {
        day["isCurrentDay"] = false;
      }
      resultArrayDays.push(day);
    }

    arr[2] = `${daysInCurrentMonth}`;
    const newDateLastDay = new Date(arr.join(" "));

    const dayOfWeekLastDay =
      newDateLastDay.getDay() === 0 ? 7 : newDateLastDay.getDay();

    // console.log("dayOfWeekLastDay");
    // console.log(dayOfWeekLastDay);

    for (let i = 0; i < 7 - dayOfWeekLastDay; i++) {
      const day = {
        value: i + 1,
        isActiveDay: false,
        month:
          date.getMonth() + 2 === 13
            ? "01"
            : changeFormatValue(date.getMonth() + 2),
        year: `${
          date.getMonth() + 1 === 12
            ? date.getFullYear() + 1
            : date.getFullYear()
        }`,
      };
      day["hasTrips"] = true;
      resultArrayDays.push(day);
    }
    // setArrayForRender(resultArrayDays);
    // console.log("resultArrayDays");
    // console.log(resultArrayDays);
    return resultArrayDays;
  }

  function changeMonth(way) {
    if (way === 1) {
      const numberNextMonth =
        (date.getMonth() + 1 + 1) % 13 === 0
          ? 1
          : (date.getMonth() + 1 + 1) % 13;
      // console.log(numberNextMonth);
      let currentYear = date.getFullYear();
      // console.log(currentYear);
      if (numberNextMonth === 1) {
        currentYear++;
      }

      const arrayDate = `${date}`.split(" ");
      arrayDate[1] = numberNextMonth;
      arrayDate[3] = currentYear;

      setDate(new Date(arrayDate.slice(1, 4)));
    } else if (way === -1) {
      const numberNextMonth = date.getMonth() === 0 ? 12 : date.getMonth();
      // console.log(numberNextMonth);
      let currentYear = date.getFullYear();
      // console.log(currentYear);
      if (numberNextMonth === 12) {
        currentYear--;
      }

      const arrayDate = `${date}`.split(" ");
      arrayDate[1] = numberNextMonth;
      arrayDate[3] = currentYear;

      setDate(new Date(arrayDate.slice(1, 4)));
    } else {
      throw new Error("Задайте значение изменения месяца календаря!");
    }
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <header className={styles.header}>
        <h1 className={styles.title}>Календарь</h1>
      </header>
      <article className={styles.calendar}>
        <header className={styles.calendarHeader}>
          {/* <Button onClick={() => changeMonth(-1)}> */}
          <Button>
            <img src={arrowLeftIcon} alt="" />
          </Button>
          <h2 className={styles.calendarTitle}>
            {getNameMonth()} {date.getFullYear()}
          </h2>
          {/* <Button onClick={() => changeMonth(1)}> */}
          <Button>
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
                          setClickedDay(`${day.value}.${day.month}.${day.year}`)
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
          {/* {[1, 2, 3, 4, 5].map((element) => {
            return <Trip key={element} status="Запланировано" />;
          })} */}
        </div>
      </div>
    </section>
  );
}
