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
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ADD_TRIP_REQUEST_SUCCESS,
  addTrip,
} from "../../services/actions/trips";
import Loader from "../loader/loader";
import SelectCustom from "../select-custom/select-custom";

export default function FormForNewTrip() {
  // const

  const [totalSeatsError, setTotalSeatsError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [delegationCommissionError, setDelegationCommissionError] =
    useState(false);

  const [dateError, setDateError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const [fromAdressError, setFromAdressError] = useState(false);
  const [toAdressError, setToAdressError] = useState(false);

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
    navigate(location?.state?.toRoute ?? "/", { replace: true });
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

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

    if (!phoneRegex.test(phone)) return false;
    return true;
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

      if (inputs[i].name === "passenger_phone_number") {
        if (!validatePhoneNumber(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setPhoneNumberError(true);
          break;
        } else {
          setPhoneNumberError(false);
        }
      }

      if (inputs[i].name === "from_address") {
        if (fromAdressError) {
          inputs[i].focus();
          stop = true;
          break;
        }
      }
      if (inputs[i].name === "to_address") {
        if (toAdressError) {
          inputs[i].focus();
          stop = true;
          break;
        }
      }

      newTrip[inputs[i].name] = inputs[i].value;
    }

    console.log("newTrip");
    console.log(newTrip);

    if (stop) return;

    dispatch(addTrip(newTrip, closeForm));
  }

  function resetError() {
    dispatch({ type: ADD_TRIP_REQUEST_SUCCESS });
  }

  useEffect(() => {
    // const url =
    //   "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    // const token = "b537cba152892a63e9e083bcd4ccf47b1b5e3fc9";
    // let query = "томск улица богдана хмельницкого д 39";
    // const options = {
    //   method: "POST",
    //   mode: "cors",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     Authorization: "Token " + token,
    //   },
    //   body: JSON.stringify({ query: query }),
    // };
    // fetch(url, options)
    //   .then((response) => response.json())
    //   .then((result) => console.log(result?.suggestions))
    //   .catch((error) => console.log("error", error));
  }, []);

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
              onSubmit={(e) => createNewTrip(e)}
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
                isSelect={true}
                setAdressError={setFromAdressError}
                errorText={fromAdressError ? "Выберите адрес из списка" : ""}
                placeholder="Начните вводить адрес"
                required
              />

              <Input
                label="Куда"
                iconForLabel={endPointIcon}
                type="text"
                name="to_address"
                isSelect={true}
                setAdressError={setToAdressError}
                errorText={toAdressError ? "Выберите адрес из списка" : ""}
                placeholder="Начните вводить адрес"
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
                  <SelectCustom
                    name="car_class"
                    id="car_class"
                    label={"Класс автомобиля"}
                    defaultValue={"passenger_car"}
                  >
                    <option value="passenger_car">Легковой</option>
                    <option value="minivan">Минивэн</option>
                    <option value="microbus">Микроавтобус</option>
                    <option value="bus">Автобус</option>
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
