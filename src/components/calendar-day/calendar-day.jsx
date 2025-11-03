import styles from "./calendar-day.module.css";

export default function CalendarDay({ day, clickedDay, ...props }) {
  const currentDay = `${new Date()}`.split(" ")[2].split("")[1];

  let stylesStr = `${day.value}` === currentDay ? `${styles.currentDay} ` : "";
  stylesStr += day.isActiveDay ? `${styles.activeDay} ` : `${styles.day} `;

  stylesStr += day.hasTrips ? `${styles.hasTrips} ` : "";

  stylesStr +=
    `${day.value}.${day.month}.${day.year}` === clickedDay
      ? `${styles.clickedDay}`
      : "";

  return (
    <p {...props} className={stylesStr}>
      {day.value}
    </p>
  );
}
