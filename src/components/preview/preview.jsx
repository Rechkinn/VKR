import { useRef, useState } from "react";
import styles from "./preview.module.css";
import Input from "../input/input";
import mainLogo from "../../image/main-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button";
import arrow from "../../image/preview-arrow.svg";
import calendar from "../../image/preview-calendar.svg";
import tgChannel from "../../image/preview-tg-channel.svg";
import buttonCreateTrip from "../../image/preview-button-create-trip.svg";
import PreviewBar from "../preview-bar/preview-bar";
import { useReferralCode } from "../../services/actions/referral";
import StatusPro from "../status-pro/status-pro";
import App from "../app/app";

export default function Preview() {
  const arrayPages = [
    "inputReferralCode",
    "calendar",
    "tgChannel",
    "createTrip",
    "lastPage",
    "app",
  ];

  const [referralError, setReferralError] = useState(false);
  console.log("referralError", referralError);
  const formRef = useRef();
  const dispatch = useDispatch();
  const { infoFromTelegram } = useSelector((store) => store.user);
  console.log("infoFromTelegram preview");
  console.log(infoFromTelegram);
  const { useReferralCodeRequest, useReferralCodeRequestError } = useSelector(
    (store) => store.referral
  );

  const countAllPage = 5;
  const [completedPage, setCompletedPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(arrayPages[completedPage - 1]);

  function validateReferralCode(inputValue) {
    const regex = /^[0-9]+$/;
    return regex.test(inputValue);
  }

  function increaseCompletedPage() {
    setCompletedPage(completedPage + 1);
    setCurrentPage(arrayPages[completedPage]);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!formRef.current) return;

    let referralData = {};
    const inputReferralCode = formRef.current.elements[0];
    let stop = false;

    if (!validateReferralCode(inputReferralCode.value)) {
      stop = true;
      setReferralError(true);
    } else {
      referralData = {
        telegram_id: infoFromTelegram.telegram_id,
        referral_code: inputReferralCode.value,
      };
      setReferralError(false);
    }

    console.log("referralData");
    console.log(referralData);

    if (stop) return;
    dispatch(useReferralCode(referralData, increaseCompletedPage));
  }

  function getContent(page) {
    if (page === "inputReferralCode") {
      return (
        <form
          action=""
          ref={formRef}
          className={styles.form}
          onSubmit={(e) => handleFormSubmit(e)}
          id="form-for-referral-code"
        >
          <img src={mainLogo} alt="" className={styles.img} />
          <h1 className={styles.nameApp}>OkGo!</h1>
          <p className={styles.textInputReferralCode}>
            Чтобы начать, ведите реферальный код
          </p>
          <Input
            type="tel"
            name="referral_code"
            errorText={
              referralError
                ? "Некорректное значение!"
                : !useReferralCodeRequest && useReferralCodeRequestError
                ? "Реферальный код не найден!"
                : ""
            }
            // readOnly
            // placeholder="Поле отключено"
          />
        </form>
      );
    } else if (page === "calendar") {
      return (
        <>
          <p>
            Создавайте поездки для себя: указывайте дату, маршрут и время.
            <br />
            Все запланированные поездки попадают в ваш личный календарь
          </p>
          <img src={calendar} alt="" className={styles.img} />
        </>
      );
    } else if (page === "tgChannel") {
      return (
        <>
          <p>
            Пользователи с подпиской <StatusPro>PRO</StatusPro> могут
            опубликовать любую свою поездку из календаря в общий Telegram-канал
            с другими водителями.
          </p>
          <img src={tgChannel} alt="" className={styles.img} />
        </>
      );
    } else if (page === "createTrip") {
      return (
        <>
          <p>
            Публиковать поездки можно сразу в Telegram-канал в разделе Поездки
          </p>
          <img src={buttonCreateTrip} alt="" className={styles.img} />
        </>
      );
    } else if (page === "lastPage") {
      return (
        <>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "50px",
            }}
          >
            Ваш пробный период <StatusPro>PRO</StatusPro> — активен!
          </p>
          <p>
            Мы дарим вам пробный период подписки PRO на 7 дней! Теперь вы можете
            публиковать поездки и получать за них комиссию. За каждого друга,
            который введёт ваш личный реферальный код, мы продлим вашу подписку
            еще на 7 суток.
          </p>
        </>
      );
    }
  }

  return currentPage === "app" ? (
    <App />
  ) : (
    <section
      style={{
        paddingTop: currentPage === "inputReferralCode" ? "60px" : "60px",
      }}
      className={styles.section}
    >
      {getContent(currentPage)}
      <div className={styles.containerTextAndArrow}>
        <Button
          className={styles.arrowButton}
          form="form-for-referral-code"
          type="submit"
          onClick={() => {
            // increaseCompletedPage();
            if (currentPage !== "inputReferralCode") increaseCompletedPage();
          }}
        >
          <img src={arrow} alt="" className={styles.img} />
        </Button>
        {currentPage === "lastPage" && (
          <p style={{ margin: "0px" }}>
            Не забудьте добавить в профиль данные о себе и своих авто
          </p>
        )}
      </div>
      <PreviewBar
        countAll={countAllPage}
        countCompleted={completedPage}
        className={styles.previewBar}
      />
    </section>
  );
}
