import { useDispatch, useSelector } from "react-redux";
import styles from "./form-for-new-trip.module.css";
import closeIcon from "../../image/form-for-new-trip/close-icon.svg";
import dateIcon from "../../image/form-for-new-trip/date-icon.svg";
import watchIcon from "../../image/section-trips/watch-icon.svg";
import startPointIcon from "../../image/section-trips/start-point-icon.svg";
import endPointIcon from "../../image/section-trips/end-point-icon.svg";
import phoneIcon from "../../image/section-trips/phone-icon.svg";
import swapIcon from "../../image/swap.svg";
import Button from "../button/button";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import Input from "../input/input";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ADD_TRIP_OWN_REQUEST_SUCCESS,
  ADD_TRIP_REQUEST_SUCCESS,
  addTripDelegated,
  addTripOwn,
  UPDATE_TRIP_REQUEST_RESET,
  updateTrip,
} from "../../services/actions/trips";
import Loader from "../loader/loader";
import SelectCustom from "../select-custom/select-custom";

export default function FormForNewTrip() {
  const [totalSeatsError, setTotalSeatsError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [delegationCommissionError, setDelegationCommissionError] =
    useState(false);

  const [dateError, setDateError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const [fromAdressError, setFromAdressError] = useState(false);
  const [toAdressError, setToAdressError] = useState(false);

  const [countCharsTextarea, setCountCharsTextarea] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();

  const toAddressRef = useRef();
  const fromAddressRef = useRef();
  const [valueFromAddressForSwap, setValueFromAddressForSwap] = useState(
    "Новокузнецк Аэропорт",
  );
  const [valueToAddressForSwap, setValueToAddressForSwap] = useState("Шерегеш");

  const location = useLocation();

  const [tripForViewing, _] = useState(location?.state?.detailsTrip ?? null);
  const [isOnlyViewing] = useState(location?.state?.isOnlyViewing ?? false);

  // console.log("tripForViewing");
  // console.log(tripForViewing);

  const {
    addTripRequest,
    addTripRequestError,
    addTripOwnRequest,
    addTripOwnRequestError,
    updateTripRequest,
    updateTripRequestError,
  } = useSelector((store) => store.trips);

  const { infoFromTelegram } = useSelector((store) => store.user);

  function closeForm() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
    navigate(location?.state?.toRoute ?? "/", { replace: true });
  }

  function validationNumber(inputValue, min = -1, max = 999999) {
    const regex = /^-?(0|[1-9][0-9]{0,5})$/;
    if (!regex.test(inputValue)) return false;

    return Number(inputValue) > min && Number(inputValue) <= max;
  }

  function validateDateTime(inputData, inputTime) {
    console.log("inputData", inputData);
    console.log("inputTime", inputTime);

    if (inputData === "" || inputTime === "") return false;

    const currentDate = new Date();

    // "121221-12-12"
    const arrayInputData = inputData.split("-");
    const arrayInputTime = inputTime.split(":");

    const tripDate = new Date(
      arrayInputData[0],
      arrayInputData[1] - 1,
      arrayInputData[2],
      arrayInputTime[0],
      arrayInputTime[1],
    );

    console.log("currentDate", currentDate);
    console.log("tripDate", tripDate);

    const year = inputData.split("-")[0];
    const validYear =
      year.length === 4 &&
      Number(year) >= currentDate.getFullYear() &&
      Number(year) <= currentDate.getFullYear() + 1;

    console.log("year.length === 4", year.length === 4);
    console.log(
      "Number(year) >= currentDate.getFullYear()",
      Number(year) >= currentDate.getFullYear(),
    );
    console.log(
      "Number(year) <= currentDate.getFullYear() + 1",
      Number(year) <= currentDate.getFullYear() + 1,
    );

    console.log("validYear", validYear);
    console.log(
      "tripDate.getTime() >= currentDate.getTime()",
      tripDate.getTime() >= currentDate.getTime(),
    );

    return validYear && tripDate.getTime() >= currentDate.getTime();
  }

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

    if (!phoneRegex.test(phone)) return false;
    return true;
  }

  function checkSubscription() {
    if (
      location?.state?.detailsTrip ||
      location?.state?.toRoute.includes("calendar")
    )
      return;

    const dateEndingSubscribe = new Date(
      infoFromTelegram?.subscription_exp ?? "2000-01-01",
    );
    const dateCurrent = new Date();

    if (dateEndingSubscribe.getTime() < dateCurrent.getTime()) {
      navigate("/", {
        replace: true,
      });
      window.Telegram.WebApp.openLink("https://t.me/test_alss_bot?start=123");
    }
  }

  useEffect(() => {
    checkSubscription();
  }, []);

  function actionWithTrip(e) {
    checkSubscription();

    e.preventDefault();

    if (!formRef.current) return;
    const inputs = formRef.current.elements;

    const newTrip = {
      trip_type: location?.state?.isTripDelegated ? "delegated" : "own",
      is_delegation_active: location?.state?.isTripDelegated,
    };

    let date = "";
    let time = "";
    let stop = false;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "description") {
        if (inputs[i].value.length > 500) {
          inputs[i].focus();
          stop = true;
        }
        setCountCharsTextarea(inputs[i].value.length);
      }
      if (inputs[i].name === "from_address") {
        if (inputs[i].value === "") {
          inputs[i].focus();
          stop = true;
          setFromAdressError(true);
        } else {
          setFromAdressError(false);
        }
      }
      if (inputs[i].name === "to_address") {
        if (inputs[i].value === "") {
          inputs[i].focus();
          stop = true;
          setToAdressError(true);
        } else {
          setToAdressError(false);
        }
      }

      if (inputs[i].name === "" || inputs[i].value === "") continue;
      if (inputs[i].name === "car_class" && inputs[i].value === "any") continue;

      if (inputs[i].name === "date" || inputs[i].name === "time") {
        console.log("inputs[i].name", inputs[i].name);

        if (inputs[i].name === "date") date = `${inputs[i].value}`;
        if (inputs[i].name === "time") time = `${inputs[i].value}`;

        // date = `${inputs[i].value}`;

        console.log("date", date);
        console.log("time", time);
        console.log("newTrip", newTrip);
        console.log(
          "!validateDateTime(date, time)",
          !validateDateTime(date, time),
        );

        if (date !== "" && time !== "" && !newTrip?.departure_datetime) {
          if (!validateDateTime(date, time)) {
            // inputs[i].focus();
            stop = true;
            setDateError(true);
          } else {
            newTrip["departure_datetime"] = `${date}T${time}:00.007Z`;
            setDateError(false);
          }
        }
        console.log("newTrip после", newTrip);
        continue;
      }

      if (inputs[i].name === "price") {
        if (!validationNumber(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setPriceError(true);
        } else {
          setPriceError(false);
        }

        newTrip[inputs[i].name] = Number(inputs[i].value);
        continue;
      }
      if (inputs[i].name === "total_seats") {
        if (!validationNumber(inputs[i].value, 0, 100)) {
          inputs[i].focus();
          stop = true;
          setTotalSeatsError(true);
        } else {
          setTotalSeatsError(false);
        }

        newTrip[inputs[i].name] = Number(inputs[i].value);
        continue;
      }

      if (inputs[i].name === "delegation_commission") {
        if (!validationNumber(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setDelegationCommissionError(true);
        } else {
          newTrip[inputs[i].name] = Number(inputs[i].value);
          setDelegationCommissionError(false);
        }
        continue;
      }

      if (inputs[i].name === "passenger_phone_number") {
        if (!validatePhoneNumber(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setPhoneNumberError(true);
        } else {
          setPhoneNumberError(false);
        }
      }

      newTrip[inputs[i].name] = inputs[i].value;
    }

    // console.log("newTrip");
    // console.log(newTrip);

    if (stop) return;

    if (tripForViewing) {
      // console.log("{ ...tripForViewing, ...newTrip }");
      // console.log({ ...tripForViewing, ...newTrip });
      dispatch(updateTrip({ ...tripForViewing, ...newTrip }, closeForm));
    } else {
      location?.state?.isTripDelegated
        ? dispatch(addTripDelegated(newTrip, closeForm))
        : dispatch(addTripOwn(newTrip, closeForm));
    }
  }

  function resetError() {
    dispatch({ type: ADD_TRIP_REQUEST_SUCCESS });
    dispatch({ type: ADD_TRIP_OWN_REQUEST_SUCCESS });
    dispatch({ type: UPDATE_TRIP_REQUEST_RESET });
  }

  useEffect(() => {
    if (tripForViewing?.to_address)
      setValueToAddressForSwap(tripForViewing?.to_address);
    if (tripForViewing?.from_address)
      setValueFromAddressForSwap(tripForViewing?.from_address);
  }, [tripForViewing?.to_address, tripForViewing?.from_address]);

  function swapAdresses() {
    if (!toAddressRef?.current || !fromAddressRef?.current) return;

    const valueTo = toAddressRef.current.value;

    setValueToAddressForSwap(fromAddressRef.current.value);
    setValueFromAddressForSwap(valueTo);
  }

  function getInitialDate() {
    if (tripForViewing?.departure_datetime.split("T")[0]) {
      return tripForViewing?.departure_datetime.split("T")[0];
    } else if (location?.state?.selectedDate) {
      const date =
        location?.state?.selectedDate.length < 10
          ? `0${location?.state?.selectedDate}`
          : location?.state?.selectedDate;
      return date.split(".").reverse().join("-");
    }
    return "";
  }

  function getNameHuman(username, first_name) {
    let resultName = "";

    resultName += username ? `@${username}` : "";
    resultName += first_name ? ` (${first_name})` : "";
    return resultName.trim();
  }

  function openChat(username) {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/${username}`);
  }

  useEffect(() => {
    console.log("form-for-new-trip");
    console.log("tripForViewing", tripForViewing);
    console.log("location", location);

    // tripForViewing?.[location?.state?.whoShowInfo];
  }, []);

  return (
    <>
      {(addTripRequest || addTripOwnRequest || updateTripRequest) && (
        <Loader>Создаём новую поездку...</Loader>
      )}
      {addTripRequestError ||
      addTripOwnRequestError ||
      updateTripRequestError ? (
        <>
          <div>Ошибка обработки поездки!</div>
          <Link to="/" onClick={resetError}>
            Вернуться в профиль
          </Link>
        </>
      ) : (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>
              {tripForViewing
                ? `Поездка #${tripForViewing.id}`
                : "Новая поездка"}
            </h1>
          </header>

          <div className={styles.containerCreateTrip}>
            <form
              action=""
              ref={formRef}
              className={styles.form}
              onSubmit={(e) => actionWithTrip(e)}
            >
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  closeForm();
                }}
                className={styles.closeButton}
              >
                <img src={closeIcon} alt="Иконка закрытия формы" />
              </Button>
              <Input
                label="Дата"
                iconForLabel={dateIcon}
                type="date"
                name="date"
                className={styles.inputDate}
                errorText={
                  dateError
                    ? `Введите дату от сегодняшнего дня, но не более чем на год вперёд`
                    : ""
                }
                required
                initialValue={getInitialDate()}
                readOnly={isOnlyViewing}
              />

              <Input
                label="Время выезда"
                iconForLabel={watchIcon}
                type="time"
                name="time"
                step="300"
                className={styles.inputTime}
                required
                initialValue={
                  tripForViewing?.departure_datetime
                    .split("T")[1]
                    .slice(0, 5) ?? ""
                }
                errorText={
                  dateError
                    ? `Проверьте, чтобы указанное время было больше текущего, если поездка создается на сегодняшний день`
                    : ""
                }
                readOnly={isOnlyViewing}
              />
              <Input
                ref={fromAddressRef}
                label="Откуда"
                iconForLabel={startPointIcon}
                type="text"
                name="from_address"
                isSelect={true}
                setAdressError={setFromAdressError}
                errorText={fromAdressError ? "Выберите адрес из списка" : ""}
                placeholder="Начните вводить адрес"
                required
                initialValue={valueFromAddressForSwap}
                readOnly={isOnlyViewing}
              />
              <Input
                ref={toAddressRef}
                label="Куда"
                iconForLabel={endPointIcon}
                type="text"
                name="to_address"
                isSelect={true}
                setAdressError={setToAdressError}
                errorText={toAdressError ? "Выберите адрес из списка" : ""}
                placeholder="Начните вводить адрес"
                required
                initialValue={valueToAddressForSwap}
                readOnly={isOnlyViewing}
                swapButton={
                  !isOnlyViewing && (
                    <Button
                      onClick={swapAdresses}
                      type="button"
                      className={styles.swap}
                    >
                      <img src={swapIcon} alt="" />
                    </Button>
                  )
                }
              />
              <div className={styles.containerForTwoInputs}>
                <div className={styles.container40}>
                  <Input
                    label="Пассажиры"
                    iconForLabel={dateIcon}
                    type="number"
                    name="total_seats"
                    errorText={
                      totalSeatsError ? "Введите число от 1 до 100" : ""
                    }
                    required
                    initialValue={tripForViewing?.total_seats ?? ""}
                    readOnly={isOnlyViewing}
                  />
                </div>
                <div className={styles.container60}>
                  <SelectCustom
                    name="car_class"
                    id="car_class"
                    label="Класс автомобиля"
                    defaultValue={tripForViewing?.car_class ?? "any"}
                    disabled={isOnlyViewing}
                  >
                    <option value="any">Любой</option>
                    <option value="passenger_car">Легковой</option>
                    <option value="business">Бизнес</option>
                    <option value="microbus">Микроавтобус</option>
                    <option value="bus">Автобус</option>
                    <option value="seat">Место в авто</option>
                  </SelectCustom>
                </div>
              </div>
              <Input
                label="Номер телефона пассажира"
                iconForLabel={phoneIcon}
                type="tel"
                name="passenger_phone_number"
                placeholder="+7 (___) ___-__-__"
                errorText={
                  phoneNumberError
                    ? "Номер должен быть в формате: +7 (XXX) XXX-XX-XX"
                    : ""
                }
                required
                initialValue={tripForViewing?.passenger_phone_number ?? ""}
                readOnly={isOnlyViewing}
              />
              <Input
                label="Стоимость"
                type="number"
                name="price"
                errorText={priceError ? "Введите число от 0 до 999999" : ""}
                initialValue={tripForViewing?.price ?? ""}
                readOnly={isOnlyViewing}
              />
              <Input
                label="Комссия"
                type="number"
                name="delegation_commission"
                required
                errorText={
                  delegationCommissionError
                    ? "Введите число от 0 до 999999"
                    : ""
                }
                initialValue={tripForViewing?.delegation_commission ?? ""}
                readOnly={isOnlyViewing}
              />
              <div>
                <label htmlFor="description" className={styles.label}>
                  Дополнительная информация
                </label>
                <textarea
                  name="description"
                  id="description"
                  className={styles.textarea}
                  defaultValue={tripForViewing?.description ?? ""}
                  readOnly={isOnlyViewing}
                ></textarea>
                {countCharsTextarea > 500 && (
                  <p className={styles.errorText}>
                    Дополнительная информация не должна превышать 500 символов.
                    Ваше количество символов: {countCharsTextarea}
                  </p>
                )}
              </div>
              {tripForViewing && tripForViewing?.trip_type !== "own" && (
                <>
                  <Input
                    label={
                      location?.state?.whoShowInfo === "creator"
                        ? "Агент"
                        : "Водитель"
                    }
                    type="text"
                    name="info-field-human-1"
                    initialValue={getNameHuman(
                      tripForViewing?.[location?.state?.whoShowInfo]?.username,
                      tripForViewing?.[location?.state?.whoShowInfo]
                        ?.first_name,
                    )}
                    placeholder="Данные имени отсутствуют"
                    readOnly
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        tripForViewing?.[location?.state?.whoShowInfo]?.username
                      ) {
                        openChat(
                          tripForViewing?.[location?.state?.whoShowInfo]
                            ?.username,
                        );
                      }
                    }}
                  />
                  <Input
                    type="text"
                    name="info-field-human-2"
                    initialValue={`${
                      tripForViewing?.[location?.state?.whoShowInfo]
                        ?.phone_number ?? ""
                    } ${
                      tripForViewing?.[location?.state?.whoShowInfo]
                        ?.sbp_bank ?? ""
                    }`.trim()}
                    placeholder="Данные телефона отсутствуют"
                    readOnly
                  />

                  {location?.state?.whoShowInfo === "driver" && (
                    <Input
                      label="Авто"
                      type="text"
                      name="info-field-car"
                      initialValue={`${tripForViewing?.vehicle?.color ?? ""} ${
                        tripForViewing?.vehicle?.brand ?? ""
                      } ${tripForViewing?.vehicle?.model ?? ""} ${
                        tripForViewing?.vehicle?.license_plate ?? ""
                      }`.trim()}
                      placeholder="Данные об авто отсутствуют"
                      readOnly
                    />
                  )}
                </>
              )}
              {!isOnlyViewing && (
                <Button
                  type="submit"
                  className={`green ${styles.buttonPushForm}`}
                >
                  {location?.state?.isTripDelegated
                    ? "Опубликовать в канал"
                    : tripForViewing
                      ? "Сохранить"
                      : "Создать"}
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}
