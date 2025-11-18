import { useDispatch, useSelector } from "react-redux";
import styles from "./form-for-new-trip.module.css";
import closeIcon from "../../image/form-for-new-trip/close-icon.svg";
import dateIcon from "../../image/form-for-new-trip/date-icon.svg";
import watchIcon from "../../image/section-trips/watch-icon.svg";
import startPointIcon from "../../image/section-trips/start-point-icon.svg";
import endPointIcon from "../../image/section-trips/end-point-icon.svg";
import phoneIcon from "../../image/section-trips/phone-icon.svg";
import Button from "../button/button";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import Input from "../input/input";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ADD_TRIP_REQUEST_SUCCESS,
  addTrip,
} from "../../services/actions/trips";
import Loader from "../loader/loader";

export default function FormForNewTrip() {
  // const

  const [totalSeatsError, setTotalSeatsError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [delegationCommissionError, setDelegationCommissionError] =
    useState(false);

  const [dateError, setDateError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();

  const location = useLocation();
  // console.log("location в форме");
  // console.log(location);

  const { addTripRequest, addTripRequestError } = useSelector(
    (store) => store.trips
  );

  function closeForm() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
    navigate(location?.state?.toRoute ?? "/");
  }

  function validationNumber(inputValue) {
    const regex = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;
    if (!regex.test(inputValue)) {
      // console.log("какие-то посторонние символы");
      return false;
    }

    // console.log(
    //   "результат значения Number(inputValue) > -1:",
    //   Number(inputValue) > -1
    // );
    return Number(inputValue) > -1;
  }

  function validateDate(inputValue) {
    // "121221-12-12"

    const year = inputValue.split("-")[0];
    const currentDate = new Date();
    // console.log(
    //   "year.length === 4 && Number(year) >= currentDate.getFullYear()",
    //   year.length === 4 && Number(year) >= currentDate.getFullYear()
    // );
    return year.length === 4 && Number(year) >= currentDate.getFullYear();
  }

  function createNewTrip(e) {
    e.preventDefault();

    if (!formRef.current) return;
    const inputs = formRef.current.elements;

    const newTrip = {
      trip_type: "delegated",
      is_delegation_active: true,
    };

    let date = "";
    let time = "";
    let stop = false;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "" || inputs[i].value === "") continue;

      if (inputs[i].name === "date") {
        date = `${inputs[i].value}`;

        if (!validateDate(date)) {
          inputs[i].focus();
          stop = true;
          setDateError(true);
          break;
        } else {
          setDateError(false);
        }

        if (date !== "" && time !== "" && !newTrip?.departure_datetime) {
          newTrip["departure_datetime"] = `${date}T${time}:00.007Z`;
        }
        continue;
      }
      if (inputs[i].name === "time") {
        time += `${inputs[i].value}`;
        if (date !== "" && time !== "" && !newTrip?.departure_datetime) {
          newTrip["departure_datetime"] = `${date}T${time}:00.007Z`;
        }
        continue;
      }

      if (
        inputs[i].name === "delegation_commission" ||
        inputs[i].name === "price" ||
        inputs[i].name === "total_seats"
      ) {
        if (!validationNumber(inputs[i].value)) {
          // console.log("проверка прошла безуспешно");

          inputs[i].focus();
          stop = true;
          if (inputs[i].name === "total_seats") setTotalSeatsError(true);
          else setTotalSeatsError(false);

          if (inputs[i].name === "price") setPriceError(true);
          else setPriceError(false);

          if (inputs[i].name === "delegation_commission")
            setDelegationCommissionError(true);
          else setDelegationCommissionError(false);

          break;
        }

        newTrip[inputs[i].name] = Number(inputs[i].value);
        continue;
      }

      newTrip[inputs[i].name] = inputs[i].value;
    }

    // console.log("newTrip");
    // console.log(newTrip);

    if (stop) return;

    dispatch(addTrip(newTrip, closeForm));
  }

  function resetError() {
    dispatch({ type: ADD_TRIP_REQUEST_SUCCESS });
  }

  return (
    <>
      {addTripRequest && <Loader>Создаём новую поездку...</Loader>}
      {addTripRequestError ? (
        <>
          <div>Ошибка создания новой поездки!</div>
          <Link to="/" onClick={resetError}>
            Вернуться в профиль
          </Link>
        </>
      ) : (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>Новая поездка</h1>
          </header>

          <div className={styles.containerCreateTrip}>
            <form
              action=""
              ref={formRef}
              className={styles.form}
              // onSubmit={(e) => createNewTrip(e)}
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

              {/* <div className={styles.containerForTwoInputs}>
                <div className={styles.container40}>
                  <Input
                    label="Дата"
                    iconForLabel={dateIcon}
                    type="date"
                    name="date"
                    required
                  />
                </div>
                <div className={styles.container60}>
                  <Input
                    label="Время"
                    iconForLabel={watchIcon}
                    type="time"
                    name="time"
                    required
                  />
                </div>
              </div> */}

              {/* <div className={styles.inputDate}> */}
              <Input
                label="Дата"
                iconForLabel={dateIcon}
                type="date"
                name="date"
                className={styles.inputDate}
                errorText={dateError ? "Введите корректную дату" : ""}
                required
              />

              <Input
                label="Время"
                iconForLabel={watchIcon}
                type="time"
                name="time"
                className={styles.inputTime}
                required
              />
              {/* </div> */}

              <Input
                label="Откуда"
                iconForLabel={startPointIcon}
                type="text"
                name="from_address"
                required
              />

              <Input
                label="Куда"
                iconForLabel={endPointIcon}
                type="text"
                name="to_address"
                required
              />

              <div className={styles.containerForTwoInputs}>
                <div className={styles.container40}>
                  <Input
                    label="Пассажиры"
                    iconForLabel={dateIcon}
                    type="number"
                    name="total_seats"
                    errorText={
                      totalSeatsError
                        ? "Введите число большее 0 без лишних символов"
                        : ""
                    }
                    required
                  />
                </div>
                <div className={styles.container60}>
                  <label htmlFor="car_class" className={styles.label}>
                    Класс автомобиля
                  </label>
                  <select
                    name="car_class"
                    id="car_class"
                    className={styles.select}
                  >
                    <option value="passenger_car">Легковой</option>
                    <option value="minivan">Минивэн</option>
                    <option value="microbus">Микроатобус</option>
                    <option value="bus">Автобус</option>
                  </select>
                </div>
              </div>

              <Input
                label="Номер телефона пассажира"
                iconForLabel={phoneIcon}
                type="tel"
                name="passenger_phone_number"
                required
              />

              <Input
                label="Стоимость"
                type="number"
                name="price"
                errorText={
                  priceError
                    ? "Введите число большее 0 без лишних символов"
                    : ""
                }
              />

              <Input
                label="Комссия"
                type="number"
                name="delegation_commission"
                required
                errorText={
                  delegationCommissionError
                    ? "Введите число большее 0 без лишних символов"
                    : ""
                }
              />

              <div>
                <label htmlFor="description" className={styles.label}>
                  Дополнительная информация
                </label>
                <textarea
                  name="description"
                  id="description"
                  className={styles.textarea}
                ></textarea>
              </div>

              <Button
                type="submit"
                className={`yellow ${styles.buttonPushForm}`}
                onSubmit={(e) => createNewTrip(e)}
              >
                Отправить в канал
              </Button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
