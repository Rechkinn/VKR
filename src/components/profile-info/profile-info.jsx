import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import starEmpty from "../../image/star-empty.svg";
import ProfilePhoto from "../profile-photo/profile-photo";
import Balance from "../balance/balance";
import { useDispatch, useSelector } from "react-redux";
import { Cars } from "../cars/cars";
import { useEffect, useRef, useState } from "react";
import Car from "../car/car";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import Button from "../button/button";

export default function ProfileInfo() {
  const { infoFromTelegram } = useSelector((store) => store.user);

  const [activeSubscription, setActiveSubscription] = useState(false);
  const [activeSubscriptionText, setActiveSubscriptionText] = useState("");

  console.log("infoFromTelegram в ProfileInfo");
  console.log(infoFromTelegram);

  function renderStars(rating) {
    const array = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      array.push(1);
    }
    for (let i = 0; i < 5 - Math.floor(rating); i++) {
      array.push(-1);
    }
    return array.map((value, i) => {
      if (value === 1)
        return <img src={star} alt="Звезда" key={i} className={styles.star} />;
      else
        return (
          <img src={starEmpty} alt="Звезда" key={i} className={styles.star} />
        );
    });
  }

  const sectionRef = useRef();
  const carsRef = useRef();
  const [styleTripsContainer, setStyleTripsContainer] = useState();

  const dispatch = useDispatch();

  function setMaxHeightContainerTrips() {
    // console.log("запускаем установку максимальной высоты");
    const section = sectionRef.current;
    const cars = carsRef.current;

    if (!section || !cars) return;

    const sectionBorders = section.getBoundingClientRect();
    const carsBorders = cars.getBoundingClientRect();

    const maxHeight = sectionBorders.bottom - carsBorders.top - 45;
    // console.log("устанавливаем значение");
    setStyleTripsContainer({
      maxHeight: maxHeight,
    });
  }

  useEffect(() => {
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: true,
    });

    window.addEventListener("resize", setMaxHeightContainerTrips);
    return () =>
      window.removeEventListener("resize", setMaxHeightContainerTrips);
  }, []);

  useEffect(() => {
    // console.log(
    //   "Видимо изменились sectionRef.current и carsRef.current, поэтому сейчас запустим функцию setMaxHeightContainerTrips"
    // );
    setMaxHeightContainerTrips();
  }, [sectionRef.current, carsRef.current]);

  function getMonthText(numberMonth) {
    const number = Number(numberMonth);
    return number === 1
      ? "Января"
      : number === 2
      ? "Февраля"
      : number === 3
      ? "Марта"
      : number === 4
      ? "Апреля"
      : number === 5
      ? "Мая"
      : number === 6
      ? "Июня"
      : number === 7
      ? "Июля"
      : number === 8
      ? "Августа"
      : number === 9
      ? "Сентября"
      : number === 10
      ? "Октября"
      : number === 11
      ? "Ноября"
      : "Декабря";
  }

  useEffect(() => {
    const currentDay = new Date();
    const finishDay = new Date(infoFromTelegram.subscription_exp);

    const currentDayMs = currentDay.getTime();
    const finishDayMs = finishDay.getTime();

    let resultString = "";
    let statusActiveSubscription = false;

    if (finishDayMs < currentDayMs) {
      resultString = "Подписка не активна";
      statusActiveSubscription = false;
    } else {
      // "2025-12-09T13:07:58.856Z"

      let difference = (finishDayMs - currentDayMs) / 1000 / 60 / 60 / 24;
      resultString =
        difference > 1
          ? `До конца подписки осталось дней: ${Math.floor(difference)}`
          : `Подписка заканчивается ${infoFromTelegram.subscription_exp
              .split("T")[0]
              .split("-")
              .reverse()
              .join(".")}`;
      statusActiveSubscription = true;
    }

    setActiveSubscription(statusActiveSubscription);
    setActiveSubscriptionText(resultString);
  }, [infoFromTelegram.subscription_exp]);

  function subscribe() {
    window.Telegram.WebApp.openLink("https://t.me/test_alss_bot?start=123");
  }

  return (
    <>
      {infoFromTelegram && (
        <section ref={sectionRef} className={styles.section}>
          <header className={styles.header}>
            <div
              style={{
                justifyContent: activeSubscription ? "center" : "space-between",
              }}
              className={styles.subscription}
            >
              <span className={styles.statusSubscription}>
                {activeSubscriptionText}
              </span>
              {!activeSubscription && (
                <Button className="black" onClick={subscribe}>
                  Купить подписку
                </Button>
              )}
            </div>
            {/* <div className={styles.headerPart}>
              <h1 className={styles.ratingText}>Рейтинг</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {renderStars(infoFromTelegram.rating_avg)}
                </div>
                <span className={styles.ratingValue}>
                  {infoFromTelegram.rating_avg}
                </span>
              </div>
            </div>
            <div className={styles.headerPart}>
              <Balance balanceValue={infoFromTelegram.balance} />
            </div> */}
          </header>

          <div className={styles.content}>
            <ProfilePhoto needButtonToEdit={true} size={166} />

            <h2 className={styles.nameUser}>
              {`${infoFromTelegram.first_name} ${infoFromTelegram.last_name}`.trim()}
            </h2>
            <p className={styles.userDescription}>
              В OkGo с {getMonthText(infoFromTelegram.created_at.split("-")[1])}{" "}
              {infoFromTelegram.created_at.split("-")[0]}
            </p>
          </div>

          <Cars ref={carsRef} style={styleTripsContainer} />
        </section>
      )}
    </>
  );
}
